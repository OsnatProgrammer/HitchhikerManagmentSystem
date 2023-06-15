const mongoose = require("mongoose");
const Joi = require("joi");

// let rideSchema = new mongoose.Schema({
//     rideOffer_id: String,
//     rideRequest_id: String,

// })

let rideSchema = new mongoose.Schema({
    rideOffer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rideOffers'
    },
    rideRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rideRequests'
    }
});

exports.RideModel = mongoose.model("rides", rideSchema);


