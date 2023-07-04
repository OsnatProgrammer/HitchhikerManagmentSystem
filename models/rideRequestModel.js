const mongoose = require("mongoose");
const Joi = require("joi");

let rideRequestSchema = new mongoose.Schema({
    user_id: String,
    rideDetails_id: String,
})

exports.RideRequestModel = mongoose.model("rideRequests", rideRequestSchema);


