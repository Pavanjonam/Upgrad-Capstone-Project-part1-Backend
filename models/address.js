const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi);
const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);


const addressSchema = new mongoose.Schema({
  name: String,
  city: String,
  state: String,
  street: String,
  contactNumber: Number,
  landmark: String, // optional
  zipCode: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
  }
});

const Address = mongoose.model("Address", addressSchema);

function validateAddress(address) {
  const schema = {
    name: Joi.string().min(3).required(),
    city: Joi.string().min(3).required(),
    state: Joi.string().min(3).required(),
    street: Joi.string().min(3).required(),
    contactNumber: Joi.number().min(10).required(),
    landmark: Joi.string().min(3).optional(),
    zipCode: Joi.number().min(100000).max(999999).required().error(() => {
      return {
        message: "Invalid zip code!",
      };
    })
  };
  return Joi.validate(address, schema); // change the type
}

exports.addressSchema = addressSchema;
exports.Address = Address;
exports.validateAddress = validateAddress;
