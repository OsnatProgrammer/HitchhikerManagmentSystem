
const express = require("express");
const { RideModel } = require("../models/rideModel");
const { authadmin } = require("../middlewares/auth");
const { RideOfferModel } = require("../models/rideOfferModel");
const { RideRequestModel } = require("../models/rideRequestModel");
const { UserModel } = require("../models/userModel");
const { RideDetailsModel } = require("../models/rideDetailModel");
const router = express.Router();

// http://localhost:3000/rides/getAllRides -> send admin token
router.get("/getAllRides",authadmin, async (req, res) => {
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
    let offerIds = rides.map(ride => ride.rideOffer_id);
    let offer = await RideOfferModel.find({_id: {$in: offerIds}});
    let requestIds = rides.map(ride => ride.rideRequest_id);
    let request = await RideRequestModel.find({_id: {$in: requestIds}});
    
    let userOfferIds = offer.map(o => o.user_id);
    let userO = await UserModel.find({_id: {$in: userOfferIds}});

    let detailsOfferIds = offer.map(o => o.rideDetails_id);
    let detailsO = await RideDetailsModel.find({_id: {$in: detailsOfferIds}});

    let userRequestIds = request.map(r => r.user_id);
    let userR = await UserModel.find({_id: {$in: userRequestIds}});

    let detailsRequestIds = request.map(r => r.rideDetails_id);
    let detailsR = await RideDetailsModel.find({_id: {$in: detailsRequestIds}});

    res.json({userO, detailsO, userR, detailsR});

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error", err });
  }
});

module.exports = router;



