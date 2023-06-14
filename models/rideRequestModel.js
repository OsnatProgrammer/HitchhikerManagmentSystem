const mongoose = require("mongoose");
const Joi = require("joi");

// let rideRequestSchema = new mongoose.Schema({
//     user_id: String,
//     rideDetails_id: String,

// })

let rideRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    rideDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rideDetails'
    }
})

exports.RideRequestModel = mongoose.model("rideRequests", rideRequestSchema);


