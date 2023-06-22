const express = require("express");
const { RideOfferModel } = require("../models/rideOfferModel");
const { auth } = require("../middlewares/auth");
const { RideModel } = require("../models/rideModel");
const { UserModel } = require("../models/userModel");
const router = express.Router();

// http://localhost:3001/rideOffers
// router.get("/", async (req, res) => {
//     let sort = req.query.sort || "_id";
//     let reverse = req.query.reverse == "yes" ? -1 : 1;

//     try {
//         let rides = await RideModel.aggregate([
//             {
//                 // טבלת rideOffers
//                 $lookup: {
//                     from: "rideOffers",
//                     localField: "rideOffer_id",
//                     foreignField: "_id",
//                     as: "rideOffer",
//                 },
//             },
//             {
//                 // טבלת rideRequests
//                 $lookup: {
//                     from: "rideRequests",
//                     localField: "rideRequest_id",
//                     foreignField: "_id",
//                     as: "rideRequest",
//                 },
//             },
//             {
//                 // טבלת users
//                 $lookup: {
//                     from: "users",
//                     localField: "rideOffer.user_id",
//                     foreignField: "_id",
//                     as: "user",
//                 },
//             },
//             {
//                 $project: {
//                     _id: 1,
//                     rideOffer_id: "$rideOffer._id",
//                     rideRequest_id: "$rideRequest._id",
//                     userName: "$user.name",
//                 },
//             },
//             {
//                 $sort: { [sort]: reverse },
//             },
//         ]);

//         res.json(rides);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ msg: "Error", err });
//     }
// });

router.get("/", async (req, res) => {
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;

    try {
        let ridesOffer = await RideModel.find({});
        let userIds = ridesOffer.map(ridesOffer => ridesOffer.user_id);

        res.json(rides);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Error", err });
    }
});

//למערך ובצד לקוח לשלוף ספציפי יותר rideoffers כמו שסיכמנו שליפה של כל ה
// http://localhost:3001/rideoffers/getAllRideOffer -> send token
router.get("/getAllrideoffer", auth, async (req, res) => {
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;

    try {
        const userId = req.user.id;

        let rideoffers = await RideOfferModel.find({ user_id: userId })
            .sort({ [sort]: reverse });

        if (rideoffers.length === 0) {
            return res.status(200).json([]);
        }
        res.json(rideoffers);
    }

    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Error", err });
    }
});

// WORK
// http://localhost:3001/rideoffers/addRideOffer 
router.post("/addRideOffer", async (req, res) => {

    try {
        let rideoffer = new RideOfferModel(req.body);
        await rideoffer.save();
        res.status(201).json(rideoffer)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})


// http://localhost:3001/rideoffers/deleteRideOffer/123 -> send token
router.delete("/deleteRideOffer/:idDel", auth, async (req, res) => {

    try {
        let idDel = req.params.idDel
        let data = await RideOfferModel.deleteOne({ _id: idDel, user_id: req.tokenData._id })
        res.json(data);
    }

    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

module.exports = router;
