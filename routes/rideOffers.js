const express = require("express");
const { RideOfferModel } = require("../models/rideOfferModel");
const { auth } = require("../middlewares/auth");
const router = express.Router();


//למערך ובצד לקוח לשלוף ספציפי יותר rideoffers כמו שסיכמנו שליפה של כל ה
// http://localhost:3000/rideoffers/getAllRideOffer -> send token
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

// http://localhost:3000/rideoffers/addRideOffer/123   -> send token
router.post("/addRideOffer/:id", auth, async (req, res) => {

    let details_id = req.params.id;

    try {
        let rideoffer = new RideOfferModel();
        rideoffer.user_id = req.tokenData._id;
        rideoffer.rideDetails_id = details_id;
        await rideoffer.save();
        res.status(201).json(rideoffer)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

// http://localhost:3000/rideoffers/deleteRideOffer/123 -> send token
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
