const mongoose = require("mongoose");
const Joi = require("joi");

const rideDetailsSchema = new mongoose.Schema({
    ride_details_id: String,
    departure_address: String,
    destination_address: String,
    departure_time:Date,
    emptySeatNum: Number,
    status:{type:Number, default:0}
})

exports.RideDetailsModel = mongoose.model("rideDetails", rideDetailsSchema);

exports.validateRideDetails = (_reqBody) => {
    let schemaJoi = Joi.object({
        ride_details_id: Joi.string().required(),
        departure_address: Joi.string().min(5).max(200).required(),
        destination_address: Joi.string().min(5).max(200).required(),
        departure_time: Joi.Date().required(),
        emptySeatNum: Joi.number().min(1).max(20).required(),
        status: Joi.number().min(0).max(2).required()
    })
    return schemaJoi.validate(_reqBody)
}


