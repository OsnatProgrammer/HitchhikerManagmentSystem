const express = require("express");
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

            if (
                rideOfferDetail.departure_address === rideRequestDetail[0].departure_address &&
                rideOfferDetail.destination_address === rideRequestDetail[0].destination_address &&
                Math.abs(rideOfferDetail.departure_time - rideRequestDetail[0].departure_time) <= 2 * 60 * 60 * 1000 &&
                rideOfferDate.getTime() === rideRequestDate.getTime()
            ) {
                matchingOffers.push(rideOffer);
            }
        }
        res.status(200).json(matchingOffers);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Error", err });
    }
});

module.exports = router;