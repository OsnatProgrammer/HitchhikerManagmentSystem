
const express = require("express");
const { RideModel } = require("../models/rideModel");
const { authadmin } = require("../middlewares/auth");
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

module.exports = router;



