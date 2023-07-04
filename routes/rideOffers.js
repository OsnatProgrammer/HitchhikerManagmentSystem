const express = require("express");
const { RideOfferModel } = require("../models/rideOfferModel");
const { auth } = require("../middlewares/auth");
const { RideModel } = require("../models/rideModel");
const { UserModel } = require("../models/userModel");
const { RideDetailsModel } = require("../models/rideDetailModel");
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
//                 // טבלת rideOffers
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

// http://localhost:3001/rideoffers/getAllridesoffersOpenById
router.get("/getAllridesoffersOpenById", auth, async (req, res) => {
    const userId = req.tokenData._id;

    try {
        let ar_rideoffers = [];
        let rideoffers = await RideOfferModel.find({})
        for (let i = 0; i < rideoffers.length; i++) {
            let detailsOffer = await RideDetailsModel.findById(rideoffers[i].rideDetails_id);
            // .sort({ [sort]: reverse });
            if (detailsOffer.status === 0 && rideoffers[i].user_id == userId) {
                const rideData = {
                    ride_offer: rideoffers[i],
                    details_offer: detailsOffer,
                };
                ar_rideoffers.push(rideData);
            }
        }
        res.json({ ar_rideoffers });

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Error", err });
    }
});
// http://localhost:3001/rideoffers/getAllridesoffersOpenDifferentId
router.get("/getAllridesoffersOpenDifferentId", auth, async (req, res) => {
    const userId = req.tokenData._id;

    try {
        let ar_rideoffers = [];
        let rideoffers = await RideOfferModel.find({})
        for (let i = 0; i < rideoffers.length; i++) {
            let detailsOffer = await RideDetailsModel.findById(rideoffers[i].rideDetails_id);
            // console.log(detailsOffer);
            // .sort({ [sort]: reverse });
            if (detailsOffer.status === 0 && rideoffers[i].user_id != userId) {
                const rideData = {
                    ride_offer: rideoffers[i],
                    details_offer: detailsOffer,
                };
                ar_rideoffers.push(rideData);
            }
        }
        res.json({ ar_rideoffers });

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Error", err });
    }
});

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
router.delete("/deleterideOffer/:idDel", auth, async (req, res) => {
    try {
        let idDel = req.params.idDel;
        let RideOfferToRemove = await RideOfferModel.find({ _id: idDel, user_id: req.tokenData._id });
        if (RideOfferToRemove) {
            await RideDetailsModel.deleteOne({ _id: RideOfferToRemove[0].rideDetails_id });
            await RideOfferModel.deleteOne({ _id: idDel, user_id: req.tokenData._id });
        }
        res.json(RideOfferToRemove);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "err", err });
    }
});







// http://localhost:3001/rideoffers/updateStatus/123 -> send token
router.patch("/updateStatus/:id", async (req, res) => {
    try {
        const rideOfferId = req.params.id;
        const newStatus = req.body.status;

        // Retrieve the rideDetails_id associated with the rideOfferId
        const rideOffer = await RideOfferModel.findOne({ _id: rideOfferId });
        const rideDetailsId = rideOffer.rideDetails_id;

        // Update the status in the rideDetails table
        await RideDetailsModel.updateOne({ _id: rideDetailsId }, { status: newStatus });

        res.json({ msg: "Status updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error updating status", error });
    }
});

// http://localhost:3001/rideoffers/getAllridesoffersOpen
router.get("/getAllridesoffersOpen", async (req, res) => {
    // let sort = req.query.sort || "_id";
    try {
        let ar_rideoffers = [];
        let rideoffers = await RideOfferModel.find({})
        for (let i = 0; i < rideoffers.length; i++) {
            let detailsOffer = await RideDetailsModel.findById(rideoffers[i].rideDetails_id);
            // .sort({ [sort]: reverse });
            if (detailsOffer.status === 0) {
                const rideData = {
                    ride_offer: rideoffers[i],
                    details_offer: detailsOffer,
                };
                ar_rideoffers.push(rideData);
            }
        }
        res.json({ ar_rideoffers });

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Error", err });
    }
});

module.exports = router;
