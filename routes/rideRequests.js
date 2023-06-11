
const express = require("express");
const { RideRequestModel } = require("../models/rideRequestModel");
const { auth } = require("../middlewares/auth");
const router = express.Router();

//למערך ובצד לקוח לשלוף ספציפי יותר rideRequests כמו שסיכמנו שליפה של כל ה
// http://localhost:3000/rideRequests/getAllrideRequest  -> send token
router.get("/getAllrideRequest", auth, async (req, res) => {
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;

    try {
        const userId = req.user.id;

        let rideRequests = await RideRequestModel.find({ user_id: userId })
            .sort({ [sort]: reverse });

        if (rideRequests.length === 0) {
            return res.status(200).json([]);
        }
        res.json(rideRequests);
    }

    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Error", err });
    }
});


// http://localhost:3000/rideRequests/addrideRequest/123   -> send token
router.post("/addrideRequest/:id", auth, async (req, res) => {

    let details_id = req.params.id;

    try {
        let rideRequest = new RideRequestModel();
        rideRequest.user_id = req.tokenData._id;
        rideRequest.rideDetails_id = details_id;
        await rideRequest.save();
        res.status(201).json(rideRequest)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

// http://localhost:3000/rideRequests/deleterideRequest/123 -> send token
router.delete("/deleterideRequest/:idDel", auth, async (req, res) => {

    try {
        let idDel = req.params.idDel
        let data = await RideRequestModel.deleteOne({ _id: idDel, user_id: req.tokenData._id })
        res.json(data);
    }

    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

module.exports = router;



