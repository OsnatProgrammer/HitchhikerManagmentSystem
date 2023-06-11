
const express = require("express");
const { RideModel } = require("../models/rideModel");
const { UserModel } = require("../models/userModel");
const router = express.Router();

// http://localhost:3000/rides
router.get("/", async (req, res) => {
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

// http://localhost:3000/rides/single/647a003290fa7f51e99114a4
router.get("/", async (req, res) => {
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

// http://localhost:3000/toys/single/647a003290fa7f51e99114a4
router.get("/single/:id", async (req, res) => {

    try {
      let id = req.params.id;
      let data = await ToyModel.
      res.json(data);
    }
  
    catch (err) {
      console.log(err);
      res.status(500).json({ msg: "There is an error, please try again later", err });
    }
  
  })




module.exports = router;



