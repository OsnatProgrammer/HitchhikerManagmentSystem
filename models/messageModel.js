const mongoose = require("mongoose");
const Joi = require("joi");

const MessageSchema = new mongoose.Schema({
    user_idSend: String,
    user_idReceive: String,
    messageDetails: String,
    rides_id: String,
    status:{type:Boolean, default:false}
})

exports.MessageModel = mongoose.model("messages", MessageSchema);

exports.validateMessage = (_reqBody) => {
    let schemaJoi = Joi.object({
        user_idReceive: Joi.string().required(),
        messageDetails: Joi.string().min(5).max(1000).required(),
        rides_id: Joi.string().required()
    })
    return schemaJoi.validate(_reqBody)
}


