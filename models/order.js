const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi);
const { User, validate } = require("../models/user");
const { Product, validateProduct, validateProductGet } = require("../models/product");
const { Address, validateAddress } = require("../models/address");
const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

const orderSchema = new mongoose.Schema({
    address : {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'Address',
      required: true
    },
    product : {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'Product',
      required: true
    },
    quantity :{
      type: Number,
      required : true,
    },
    user : {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'User'
    }
  });
  
  const Order = mongoose.model("Order", orderSchema);


  function validateOrder(order) {
    const schema = {
      addressId: Joi.objectId().required(), // client should not set dateOut,dateReturned, 
      productId: Joi.objectId().required(),
      quantity: Joi.number().min(1).required()
    };
    return Joi.validate(order, schema); // change the type
  }

exports.orderSchema = orderSchema;
exports.Order = Order; 
exports.validateOrder = validateOrder;
