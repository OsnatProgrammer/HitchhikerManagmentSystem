
const express = require("express");
const { RideRequestModel } = require("../models/rideRequestModel");
const { auth } = require("../middlewares/auth");
const router = express.Router();

//למערך ובצד לקוח לשלוף ספציפי יותר rideRequests כמו שסיכמנו שליפה של כל ה
// http://localhost:3000/rideRequests/getAllrideRequest  -> send token
// router.get("/getAllrideRequest", async (req, res) => {
//     let sort = req.query.sort || "_id";
//     let reverse = req.query.reverse == "yes" ? -1 : 1;

//     try {
//         const userId = req.user.id;

//         let rideRequests = await RideRequestModel.find({ user_id: _id })
//             .sort({ [sort]: reverse });

//         if (rideRequests.length === 0) {
//             return res.status(200).json([]);
//         }
//         res.json(rideRequests);
//     }

//     catch (err) {
//         console.log(err);
//         res.status(500).json({ msg: "Error", err });
//     }
// });

// work
// http://localhost:3000/rideRequests/addrideRequest   
router.post("/addrideRequest/", async (req, res) => {

    // let details_id = req.params.id;

    try {
        let rideRequest = new RideRequestModel(req.body);
        // rideRequest.user_id = req.tokenData._id;
        // rideRequest.rideDetails_id = details_id;
        await rideRequest.save();
        res.status(201).json(rideRequest)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})
// work
// http://localhost:3000/rideRequests/deleterideRequest/123 -> send token
router.delete("/deleterideRequest/:idDel", async (req, res) => {

    try {
        let idDel = req.params.idDel
        let data = await RideRequestModel.deleteOne({ _id: idDel})
        res.json(data);
    }

    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

module.exports = router;



