const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");
const { boolean } = require("joi/lib");

let userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  address: String,
  gender: String,
  status: {
    type: Boolean, default: true
  },
  role: {
    type: String, default: "user"
  },
  date_created: {
    type: Date, default: Date.now()
  }
})

exports.UserModel = mongoose.model("users", userSchema);

exports.createToken = (user_id, role) => {
  let token = jwt.sign({ _id: user_id, role }, config.tokenSecret, { expiresIn: "60mins" })

  return token;
}

exports.validUser = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(99).required(),
    email: Joi.string().min(2).max(99).email().required(),
    address: Joi.string().min(2).max(99).required(),
    gender: Joi.string().min(4).max(6).required(),
    password: Joi.string().min(5).max(8).required()
  })

  return joiSchema.validate(_reqBody);
}

exports.validLogin = (_reqBody) => {
  let joiSchema = Joi.object({
    email: Joi.string().min(2).max(99).email().required(),
    password: Joi.string().min(3).max(99).required()
  })

  return joiSchema.validate(_reqBody);
}