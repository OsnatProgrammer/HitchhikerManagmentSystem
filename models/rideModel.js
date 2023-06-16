const mongoose = require("mongoose");
const Joi = require("joi");

let rideSchema = new mongoose.Schema({
    rideOffer_id: String,
    rideRequest_id: String,

})

exports.RideModel = mongoose.model("rides", rideSchema);


