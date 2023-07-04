const mongoose = require("mongoose");
const Joi = require("joi");

let rideOfferSchema = new mongoose.Schema({
    user_id: String,
    rideDetails_id: String,
})

exports.RideOfferModel = mongoose.model("rideOffers", rideOfferSchema);


