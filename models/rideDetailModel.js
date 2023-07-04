const mongoose = require("mongoose");
const Joi = require("joi");

const rideDetailsSchema = new mongoose.Schema({
  
    departure_address: String,
    destination_address: String,
    departure_time:Date,
    emptySeatNum: Number,
    status:{type:Number, default:0}
})

exports.RideDetailsModel = mongoose.model("rideDetails", rideDetailsSchema);

exports.validateRideDetails = (_reqBody) => {
    let schemaJoi = Joi.object({
        departure_address: Joi.string().min(5).max(200).required(),
        destination_address: Joi.string().min(5).max(200).required(),
        departure_time: Joi.date().required(),
        status: Joi.number().allow(null, "")
    })


      
    return schemaJoi.validate(_reqBody)
}


