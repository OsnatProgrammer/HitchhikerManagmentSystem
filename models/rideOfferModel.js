const mongoose = require("mongoose");
const Joi = require("joi");

// let rideOfferSchema = new mongoose.Schema({
//     user_id: String,
//     rideDetails_id: String,

// })

let rideOfferSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    rideDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rideDetails'
    }
});



exports.RideOfferModel = mongoose.model("rideOffers", rideOfferSchema);


