const express = require("express");
const { RideModel } = require("../models/rideModel");
const { authadmin } = require("../middlewares/auth");
const { RideOfferModel } = require("../models/rideOfferModel");
const { RideRequestModel } = require("../models/rideRequestModel");
const { UserModel } = require("../models/userModel");
const { RideDetailsModel } = require("../models/rideDetailModel");
const router = express.Router();

// http://localhost:3000/rides/getAllRides -> send admin token
router.get("/getAllRides", authadmin, async (req, res) => {
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? -1 : 1;

  try {
    let rides = await RideModel.find({})
      .sort({ [sort]: reverse })
      .populate({
        path: "rideOffer_id",
        populate: {
          path: "user_id",
          select: "name",
        },
      })
      .populate({
        path: "rideRequest_id",
        populate: {
          path: "user_id",
          select: "name",
        },
      });

    res.json(rides);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error", err });
  }
});

router.get("/", async (req, res) => {

  try {
    let rides = await RideModel.find({});
    let r = [];

    for (let i = 0; i < rides.length; i++) {
      // Fetch user details for the offer linked to the ride
      let offer = await RideOfferModel.findById(rides[i].rideOffer_id);
      let userOffer = await UserModel.findById(offer.user_id);
      let detailsOffer = await RideDetailsModel.findById(offer.rideDetails_id);

      // Fetch user details for the request linked to the ride
      let request = await RideRequestModel.findById(rides[i].rideRequest_id);
      let userRequest = await UserModel.findById(request.user_id);
      let detailsRequest = await RideDetailsModel.findById(request.rideDetails_id);

      userOffer = JSON.parse(JSON.stringify(userOffer));
      detailsOffer = JSON.parse(JSON.stringify(detailsOffer));
      userRequest = JSON.parse(JSON.stringify(userRequest));
      detailsRequest = JSON.parse(JSON.stringify(detailsRequest))

      // Assign the fetched details to the ride object
      rides[i].userOffer = userOffer;
      rides[i].detailsOffer = detailsOffer;
      rides[i].userRequest = userRequest;
      rides[i].detailsRequest = detailsRequest;
    }
    
    let arr = [];
    rides.forEach((item, i) => {
      arr[i] = {
        ride_offer: JSON.parse(JSON.stringify(rides[i].userOffer)),
      details_offer: JSON.parse(JSON.stringify(rides[i].detailsOffer)),
      ride_requst: JSON.parse(JSON.stringify(rides[i].userRequest,)),
      details_request: JSON.parse(JSON.stringify(rides[i].detailsRequest))
      }
    })
    res.json({
      arr
      // ride_offer: JSON.parse(JSON.stringify(rides[0].userOffer)),
      // details_offer: JSON.parse(JSON.stringify(rides[0].detailsOffer)),
      // ride_requst: JSON.parse(JSON.stringify(rides[0].userRequest,)),
      // details_request: JSON.parse(JSON.stringify(rides[0].detailsRequest))
    });
    //let rides = await RideModel.find({});
    // let offerIds = rides.map(ride => ride.rideOffer_id);
    // let offer = await RideOfferModel.find({_id: {$in: offerIds}});
    // let requestIds = rides.map(ride => ride.rideRequest_id);
    // let request = await RideRequestModel.find({_id: {$in: requestIds}});

    // let userOfferIds = offer.map(o => o.user_id);
    // let userO = await UserModel.find({_id: {$in: userOfferIds}});

    // let detailsOfferIds = offer.map(o => o.rideDetails_id);
    // let detailsO = await RideDetailsModel.find({_id: {$in: detailsOfferIds}});

    // let userRequestIds = request.map(r => r.user_id);
    // let userR = await UserModel.find({_id: {$in: userRequestIds}});

    // let detailsRequestIds = request.map(r => r.rideDetails_id);
    // let detailsR = await RideDetailsModel.find({_id: {$in: detailsRequestIds}});

    // res.json({offer, userO, detailsO, request, userR, detailsR});

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error", err });
  }
});

module.exports = router;