
const express = require("express");
const { RideModel } = require("../models/rideModel");
const { authadmin } = require("../middlewares/auth");
const { RideRequestModel } = require("../models/rideRequestModel");
const router = express.Router();

// http://localhost:3000/rides
router.get("/", async (req, res) => {
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? -1 : 1;

  try {
    let rides = await RideModel.aggregate([
        {
          $lookup: {
            from: "rideOffers",
            localField: "rideOffer_id",
            foreignField: "_id",
            as: "ride_offer"
          }
        },
        {
          $lookup: {
            from: "rideRequests",
            localField: "rideRequest_id",
            foreignField: "_id",
            as: "ride_request"
          }
        },
        // {
        //   $lookup: {
        //     from: "users",
        //     localField: "ride_offer.user_id",
        //     foreignField: "_id",
        //     as: "offer_user"
        //   }
        // },
        // {
        //   $lookup: {
        //     from: "users",
        //     localField: "ride_request.user_id",
        //     foreignField: "_id",
        //     as: "request_user"
        //   }
        // },
        // {
        //   $lookup: {
        //     from: "ride_details",
        //     localField: "ride_offer.ride_details_id",
        //     foreignField: "_id",
        //     as: "ride_details"
        //   }
        // },
        // {
        //   $unwind: "$ride_offer"
        // },
        // {
        //   $unwind: "$ride_request"
        // },
        // {
        //   $unwind: "$offer_user"
        // },
        // {
        //   $unwind: "$request_user"
        // },
        // {
        //   $unwind: "$ride_details"
        // },
        {
          $project: {
            "_id": 1,
            "ride_offer": "$ride_offer.user_id",
            "ride_request": "$ride_request.user_id",
            // "offer_user": "$offer_user",
            // "request_user": "$request_user",
            // "ride_details": "$ride_details"
          }
        }
      ])

    res.json(rides);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error", err });
  }
});

// http://localhost:3000/rides/getAllRides -> send admin token
router.get("/getAllRides", async (req, res) => {
// router.get("/getAllRides",authadmin, async (req, res) => {
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

// work
// http://localhost:3000/rides/addRide 
router.post("/addRide", async (req, res) => {

  try {
      let ride = new RideModel(req.body);
      await ride.save();
      res.status(201).json(ride)
  }
  catch (err) {
      console.log(err)
      res.status(500).json({ msg: "err", err })
  }
})

module.exports = router;



