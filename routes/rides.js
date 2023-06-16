const express = require("express");
const { RideModel } = require("../models/rideModel");
const { authadmin, auth } = require("../middlewares/auth");
const { RideOfferModel } = require("../models/rideOfferModel");
const { RideRequestModel } = require("../models/rideRequestModel");
const { UserModel } = require("../models/userModel");
const { RideDetailsModel } = require("../models/rideDetailModel");
const router = express.Router();

// http://localhost:3000/rides/getAllRides 
// router.get("/getAllRides", async (req, res) => {
//   let sort = req.query.sort || "_id";
//   let reverse = req.query.reverse == "yes" ? -1 : 1;

//   try {
//     let rides = await RideModel.find({})
//       .sort({ [sort]: reverse })
//       .populate({
//         path: "rideOffer_id",
//         populate: {
//           path: "user_id",
//           select: "name",
//         },
//       })
//       .populate({
//         path: "rideRequest_id",
//         populate: {
//           path: "user_id",
//           select: "name",
//         },
//       });

//     res.json(rides);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ msg: "Error", err });
//   }
// });

// http://localhost:3000/rides/getAllRides 
router.get("/getAllRides", async (req, res) => {

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

// http://localhost:3000/rides/getAllRidesById -> send token user
router.get("/getAllRidesById", auth, async (req, res) => {
  const userId = req.tokenData._id;

  try {
    const rides = await RideModel.find({});
    const userRides = [];

    for (let i = 0; i < rides.length; i++) {
      const ride = rides[i];
      const rideID = ride._id;
      const offer = await RideOfferModel.findById(ride.rideOffer_id);
      const userOffer = await UserModel.findById(offer.user_id);
      const request = await RideRequestModel.findById(ride.rideRequest_id);
      const userRequest = await UserModel.findById(request.user_id);

      if (userOffer._id.toString() === userId.toString() || userRequest._id.toString() === userId.toString()) {
        const detailsOffer = await RideDetailsModel.findById(offer.rideDetails_id);
        const detailsRequest = await RideDetailsModel.findById(request.rideDetails_id);

        const userOfferData = JSON.parse(JSON.stringify(userOffer));
        const detailsOfferData = JSON.parse(JSON.stringify(detailsOffer));
        const userRequestData = JSON.parse(JSON.stringify(userRequest));
        const detailsRequestData = JSON.parse(JSON.stringify(detailsRequest));

        const rideData = {
          rideID,
          ride_offer: userOfferData,
          details_offer: detailsOfferData,
          ride_request: userRequestData,
          details_request: detailsRequestData
        };

        userRides.push(rideData);
      }
    }

    res.json({
      rides: userRides
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error", err });
  }
});

// http://localhost:3000/rides/getAllRidesByIdAndStatus/:status
router.get("/getAllRidesById/:status", auth, async (req, res) => {
  const userId = req.tokenData._id;
  const userStatus = req.params.status; // Get the user's status from the URL

  try {
    const rides = await RideModel.find({});
    const userRides = [];

    for (let i = 0; i < rides.length; i++) {
      const ride = rides[i];
      const rideID = ride._id;
      const offer = await RideOfferModel.findById(ride.rideOffer_id);
      const userOffer = await UserModel.findById(offer.user_id);
      const request = await RideRequestModel.findById(ride.rideRequest_id);
      const userRequest = await UserModel.findById(request.user_id);

      if (
        (userOffer._id.toString() === userId.toString() && userOffer.status === userStatus) ||
        (userRequest._id.toString() === userId.toString() && userRequest.status === userStatus)
      ) {
        const detailsOffer = await RideDetailsModel.findById(offer.rideDetails_id);
        const detailsRequest = await RideDetailsModel.findById(request.rideDetails_id);

        const userOfferData = JSON.parse(JSON.stringify(userOffer));
        const detailsOfferData = JSON.parse(JSON.stringify(detailsOffer));
        const userRequestData = JSON.parse(JSON.stringify(userRequest));
        const detailsRequestData = JSON.parse(JSON.stringify(detailsRequest));

        const rideData = {
          rideID,
          ride_offer: userOfferData,
          details_offer: detailsOfferData,
          ride_request: userRequestData,
          details_request : detailsRequestData
        };

        userRides.push(rideData);
      }
    }

    res.json({
      rides: userRides
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