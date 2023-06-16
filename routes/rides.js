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
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error", err });
  }
});

// http://localhost:3000/rides/addRide
router.post("/addRide", async (req, res) => {

  // let details_id = req.params.id;

  try {
      let ride = new RideModel(req.body);
      // ride.user_id = req.tokenData._id;
      // ride.rideDetails_id = details_id;
      await ride.save();
      res.status(201).json(ride)
  }
  catch (err) {
      console.log(err)
      res.status(500).json({ msg: "err", err })
  }
})

module.exports = router;