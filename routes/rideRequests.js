
const express = require("express");
const { RideRequestModel } = require("../models/rideRequestModel");

const { auth } = require("../middlewares/auth");
const { RideOfferModel } = require("../models/rideOfferModel");
const { RideDetailsModel } = require("../models/rideDetailModel");
const router = express.Router();

//למערך ובצד לקוח לשלוף ספציפי יותר rideRequests כמו שסיכמנו שליפה של כל ה
// http://localhost:3001/rideRequests/getAllrideRequest  -> send token
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

// http://localhost:3001/rideRequests/getAllridesRequestsOpen
router.get("/getAllridesRequestsOpen", async (req, res) => {
    // let sort = req.query.sort || "_id";
    try {
        let ar_rideRequests = [];
        let rideRequests = await RideRequestModel.find({})
        for (let i = 0; i < rideRequests.length; i++) {
            let detailsRequest = await RideDetailsModel.findById(rideRequests[i].rideDetails_id);
            // .sort({ [sort]: reverse });
            if (detailsRequest.status === 0) {
                const rideData = {
                    ride_request: rideRequests[i],
                    details_request: detailsRequest,
                };
                ar_rideRequests.push(rideData);
            }
        }
        res.json({ ar_rideRequests });

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Error", err });
    }
});

// http://localhost:3001/rideRequests/addrideRequest   
router.post("/addrideRequest", async (req, res) => {

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

// http://localhost:3001/rideRequests/updateStatus/?idOffer=XXXXXX
// http://localhost:3001/rideRequests/updateStatus/?idRequest=XXXX
router.patch("/updateStatus", async (req, res) => {

    let idRequest = req.query.idRequest;
    let idOffer = req.query.idOffer;
    const newStatus = req.body.status;

    try {
        let data;

        if (idRequest) {
            let request = await RideRequestModel.findById(idRequest);
            data = await RideDetailsModel.updateOne({ _id: request.rideDetails_id }, { status: newStatus });

        } else {
            let offer = await RideOfferModel.findById(idOffer);
            data = await RideDetailsModel.updateOne({ _id: offer.rideDetails_id }, { status: newStatus });
        }

        res.json(data);

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Error", err });
    }
});

// http://localhost:3001/rideRequests/deleterideRequest/123 -> send token
router.delete("/deleterideRequest/:idDel", async (req, res) => {

    try {
        let idDel = req.params.idDel
        let data = await RideRequestModel.deleteOne({ _id: idDel })
        res.json(data);
    }

    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

router.patch("/updateStatus/:id", async (req, res) => {
    try {
        const rideRequestId = req.params.id;
        const newStatus = req.body.status;

        // Retrieve the rideDetails_id associated with the rideRequestId
        const rideRequest = await RideRequestModel.findOne({ _id: rideRequestId });
        const rideDetailsId = rideRequest.rideDetails_id;

        // Update the status in the rideDetails table
        await RideDetailsModel.updateOne({ _id: rideDetailsId }, { status: newStatus });

        res.json({ msg: "Status updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error updating status", error });
    }
});

module.exports = router;



