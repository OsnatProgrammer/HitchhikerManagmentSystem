
const express = require("express");
const router = express.Router();
// const bcrypt = require("bcrypt");
const { auth, authAdmin } = require("../middlewares/auth");
const { RideDetailsModel, validateRideDetails } = require("../models/rideDetailModel")





// הצגת הנסיעה - גישת משתמש רשום
// קבלת נסיעה ע"י קוד. done!!
// קבלת כל הנסיעות ע"י סטטוס- כדי לסגור אותן.  done!!
// POST
// פתיחת נסיעה- גישת משתמש done!

// PUT
// עדכון פרטי נסיעה- גישת משתמש done!!

// DELETE
// מחיקת נסיעה

// PATCH
// עדכון סטטוס 








//קבלת נסיעה ע"י קוד
//getRideDetailsById()
// http://localhost:3000/getRideDetailsById/:id
router.get("getRideDetailsById/:id", async (req, res) => {
    let id = req.params.id;
    try {
        let data = await RideDetailsModel.findById(id);
        if (!data) {
            return res.json({ msg: "There is no match rides in our database" });
        }
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Error", err });
    }
});

//קבלת כל פרטי הנסיעות באמצעות טוקן של מנהל
// http://localhost:3000/rideDetails/getRideDetailsList    -> send only admin token  
router.get("getRideDetailsList", async (req, res) => {
    try {
        let data = await RideDetailsModel.find({});
        if (!data) {
            return res.json({ msg: "There is no match rides in our database" });
        }
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "err", err })
    }
});

// http://localhost:3000/rideDetails/addRideDetails    -> send token admin or user
// router.post("/addRideDetails", auth, async (req, res) => {
router.post("/addRideDetails", async (req, res) => {
    let validateBody = validateRideDetails(req.body);
    if (validateBody.error) {
        return res.status(400).json(validateBody.error.details)
    }
    try {
        let rideDetails = new RideDetailsModel(req.body);
        // toy.user_id = req.tokenData._id;
        await rideDetails.save();
        res.status(201).json(rideDetails)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

// http://localhost:3000/updateRideDetails/:idEdit     -> send token admin or user
router.put("/updateRideDetails/:idEdit", auth, async (req, res) => {
    let validateBody = validateRideDetails(req.body);
    if (validateBody.error) {
        return res.status(400).json(validateBody.error.details)
    }
    try {
        let idEdit = req.params.idEdit;
        let data;

        if (req.tokenData.role == "ADMIN") {
            data = await RideDetailsModel.updateOne({ _id: idEdit }, req.body)
        }
        else if (idEdit == req.tokenData._id) {
            data = await RideDetailsModel.updateOne({ _id: idEdit }, req.body)
        }
        else {
            return res.status(401).json({ msg: "Sorry, you do not have permission to update" });
        }
        res.json(data)

    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "There is an error please try again", err })
    }
})

// http://localhost:3000/deleteRidedetails/:idDel     -> send token admin or user
router.delete("/deleteRidedetails/:idDel", auth, async (req, res) => {
    try {
        let idDel = req.params.idDel;
        let data;
        if (req.tokenData.role == "ADMIN") {
            data = await RideDetailsModel.deleteOne({ _id: idDel })
        }
        else if (idDel == req.tokenData._id) {
            data = await RideDetailsModel.deleteOne({ _id: idDel })

        }
        else {
            return res.status(401).json({ msg: "You cannot delete another a ride of another person!" })
        }
        res.json(data);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "There is an error please try again", err })
    }
})


// // http://localhost:3000/toys/:idEdit     -> send token admin or user
// router.put("/:idEdit", auth, async (req, res) => {
//     let validateBody = validateToy(req.body);
//     if (validateBody.error) {
//         return res.status(400).json(validateBody.error.details)
//     }
//     try {
//         let idEdit = req.params.idEdit;
//         let data;

//         if (req.tokenData.role == "ADMIN") {
//             data = await ToyModel.updateOne({ _id: idEdit }, req.body)
//         }
//         else if (idEdit == req.tokenData._id) {
//             data = await ToyModel.updateOne({ _id: idEdit, user_id: req.tokenData._id }, req.body)
//         }
//         else {
//             return res.status(401).json({ msg: "Sorry, you do not have permission to update" });
//         }
//         res.json(data)

//     }
//     catch (err) {
//         console.log(err)
//         res.status(500).json({ msg: "There is an error please try again", err })
//     }
// })

// // http://localhost:3000/toys/:idDel     -> send token admin or user
// router.delete("/:idDel", auth, async (req, res) => {
//     try {
//         let idDel = req.params.idDel;
//         let data;
//         if (req.tokenData.role == "ADMIN") {
//             data = await ToyModel.deleteOne({ _id: idDel })
//         }
//         else {
//             data = await ToyModel.deleteOne({ _id: idDel, user_id: req.tokenData._id })
//         }
//         res.json(data);
//     }
//     catch (err) {
//         console.log(err)
//         res.status(500).json({ msg: "There is an error please try again", err })
//     }
// })

module.exports = router;
