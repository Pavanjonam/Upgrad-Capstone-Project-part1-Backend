const Joi = require("joi");
const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  manufacturer: String,
  availableItems: Number,
  price: Number,
  imageURL: {
    type: String,
  },
  description: String,
  createdAt :{
    type:Date,
    default: Date.now()
  },
  updatedAt:{
    type:Date,
    default: Date.now()
  }
});

const Product = mongoose.model("Product", productSchema);

function validateProduct(product) {
  const schema = {
    name: Joi.string().min(3).required(),
    availableItems: Joi.number().positive().required(),
    price: Joi.number().positive().required(),
    category: Joi.string().min(3).required(),
    description: Joi.string().min(3).required(),
    imageURL: Joi.string().min(3).required(),
    manufacturer: Joi.string().min(3).required(),
    createdAt: Joi.date(),
    updatedAt: Joi.date()
  };
  return Joi.validate(product, schema); // change the type
}

function validateProductGet(product) {
  const schema = {
    name: Joi.string().default(""),
    category: Joi.string().default(""),
    direction: Joi.any().valid('ASC','DESC').default('DESC'),
    sortBy: Joi.string().default('productId'),
  };
  return Joi.validate(product, schema); // change the type
}

exports.Product = Product; 
exports.validateProduct = validateProduct;
exports.validateProductGet = validateProductGet;

















exports.productSchema = productSchema;
exports.Product = Product;
exports.validateProduct = validateProduct;
exports.validateProductGet = validateProductGet;
