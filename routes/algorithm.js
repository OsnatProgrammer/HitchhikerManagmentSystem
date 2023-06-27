const express = require("express");
const axios = require('axios');
const geolib = require('geolib');
const turf = require('@turf/turf');
const polyline = require('polyline');
require("dotenv").config()
const { RideRequestModel } = require("../models/rideRequestModel");
const { RideDetailsModel } = require("../models/rideDetailModel");
const { RideOfferModel } = require("../models/rideOfferModel");
const router = express.Router();

router.get("/findMatchByOffer/:idOffer", async (req, res) => {
    try {
        const idOffer = req.params.idOffer;
        const rideOffer = await RideOfferModel.find({ _id: { $in: idOffer } });
        const rideOfferDetail = await RideDetailsModel.find({ _id: rideOffer[0].rideDetails_id });

        const rideRequests = await RideRequestModel.find({});
        const matchingRequest = [];

        for (const rideRequest of rideRequests) {
            const rideRequestDetail = await RideDetailsModel.findById(rideRequest.rideDetails_id);

            const rideRequestDate = new Date(rideRequestDetail.departure_time.toDateString());
            const rideOfferDate = new Date(rideOfferDetail[0].departure_time.toDateString());

            if (
                rideOfferDetail[0].departure_address === rideRequestDetail.departure_address &&
                rideOfferDetail[0].destination_address === rideRequestDetail.destination_address &&
                Math.abs(rideOfferDetail[0].departure_time - rideRequestDetail.departure_time) <= 2 * 60 * 60 * 1000 &&
                rideOfferDate.getTime() === rideRequestDate.getTime()
            ) {
                matchingRequest.push(rideRequest);
            }
        }

        console.log(matchingRequest);
        res.status(200).json(matchingRequest);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Error", err });
    }
});

router.get("/findMatchByRequest/:idRequest", async (req, res) => {
    try {
        const idRequest = req.params.idRequest;
        const rideRequest = await RideRequestModel.find({ _id: { $in: idRequest } });
        const rideRequestDetail = await RideDetailsModel.find({ _id: rideRequest[0].rideDetails_id });

        const rideOffers = await RideOfferModel.find({});
        const matchingOffers = [];

        for (const rideOffer of rideOffers) {
            const rideOfferDetail = await RideDetailsModel.findById(rideOffer.rideDetails_id);

            const rideRequestDate = new Date(rideRequestDetail[0].departure_time.toDateString());
            const rideOfferDate = new Date(rideOfferDetail.departure_time.toDateString());

            if (findObjectsOnRoute(rideOfferDetail.departure_address, rideOfferDetail.destination_address,
                rideRequestDetail[0].departure_address, rideRequestDetail[0].destination_address)) {

                matchingOffers.push(rideOffer);
            }
            // if (
            //     rideOfferDetail.departure_address === rideRequestDetail[0].departure_address &&
            //     rideOfferDetail.destination_address === rideRequestDetail[0].destination_address &&
            //     Math.abs(rideOfferDetail.departure_time - rideRequestDetail[0].departure_time) <= 2 * 60 * 60 * 1000 &&
            //     rideOfferDate.getTime() === rideRequestDate.getTime()
            // ) {
            //     matchingOffers.push(rideOffer);
            // }
        }
        res.status(200).json(matchingOffers);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Error", err });
    }
});

async function findObjectsOnRoute(exitAddressOffer, destinationAddressOffer, exitAddressRequest, destinationAddressRequest) {
    try {
        // Step 1: Get the route using Google Maps Directions API
        const route = await getRouteFromGoogleMaps(exitAddressOffer, destinationAddressOffer);
        console.log(route);

        // Step 2: Check each object in the list against the route
        let objectsOnRoute = false;

        const addressExit = await getCoordinatesFromAddress(exitAddressRequest)
        console.log(addressExit);
        const addressDestination = await getCoordinatesFromAddress(destinationAddressRequest)

        console.log(addressExit, addressDestination);
        if (isOnRoute(route, addressExit) && isOnRoute(route, addressDestination)) {
            objectsOnRoute = true;
        }

        return objectsOnRoute;

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function getRouteFromGoogleMaps(exitAddress, destinationAddress) {
    const apiKey = process.env.API_KEY;
    const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(exitAddress)}&destination=${encodeURIComponent(destinationAddress)}&key=${apiKey}`;

    try {
        console.log(exitAddress, destinationAddress);
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      if (data.status === 'OK') {
        const route = data.routes[0];
        return route;
      } else {
        throw new Error(data.status);
      }
    } catch (error) {
      console.error('Error:', error.message);
      return null;
    }
}


// function isOnRoute(route, address) {
//     const routeGeometry = route.overview_polyline.points;
//     const addressPoint = turf.point([address.lng, address.lat]);
//     const routeFeature = turf.lineString(routeGeometry);
  
//     return turf.booleanPointOnLine(addressPoint, routeFeature);
//   }

// function isOnRoute(route, address) {
//     const addressCoordinates = geolib.getCenter([
//       { latitude: address.lat, longitude: address.lng } // Replace with the coordinates of the address
//     ]);
    
//     const routeCoordinates = route.legs[0].steps.map(step => ({
//       latitude: step.start_location.lat,
//       longitude: step.start_location.lng
//     }));
    
//     // Use geolib library to check if the address falls within the route
//     const isOnRoute = geolib.isPointInside(addressCoordinates, routeCoordinates);
    
//     return isOnRoute;
//   }


function isOnRoute(route, address) {
  const polylinePoints = polyline.decode(route.overview_polyline.points);
  
  const addressPoint = {
    lat: address.lat,
    lng: address.lng
  };
  
  const isOnRoute = isPointInsidePolyline(addressPoint, polylinePoints);
  
  return isOnRoute;
}

function isPointInsidePolyline(point, polylinePoints) {
  let isInside = false;
  for (let i = 0, j = polylinePoints.length - 1; i < polylinePoints.length; j = i++) {
    const xi = polylinePoints[i][0], yi = polylinePoints[i][1];
    const xj = polylinePoints[j][0], yj = polylinePoints[j][1];
    
    const intersect = ((yi > point.lng) !== (yj > point.lng)) &&
      (point.lat < ((xj - xi) * (point.lng - yi)) / (yj - yi) + xi);
      
    if (intersect) {
      isInside = !isInside;
    }
  }
  
  return isInside;
}


async function getCoordinatesFromAddress(address) {
    try {
        const apiKey = process.env.API_KEY;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

        const response = await axios.get(url);

        const result = response.data.results[0];
        const coordinates = result.geometry.location;

        return coordinates;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

module.exports = router;