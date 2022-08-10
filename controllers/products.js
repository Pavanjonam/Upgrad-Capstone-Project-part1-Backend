const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const {Product,validateProduct,validateProductGet} = require("../models/product");
const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const { error } = validateProductGet(req.query);
  if (error) return res.status(400).send(error.details[0].message);

  // if no query is passed as part of url then default values will be taken
  if(!req.query.category && !req.query.name){
    let products = await Product.find().sort('-_id');
    res.send(products);
    return;
  }
  const direction = req.query.direction === "ASC" ? +1 : -1;
  let products = await Product.find().or([{ name: req.query.name },{ category: req.query.category }])
    .sort({ price: direction });
  res.send(products);
});

router.get("/categories", async (req, res) => {
  const products = await Product.find().select("category").distinct("category");
  res.send(products);
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product)
    return res.status(404).send(`No Product found for ID ${req.params.id}`);
  res.send(product);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let product = new Product({
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    description: req.body.description,
    manufacturer: req.body.manufacturer,
    availableItems: req.body.availableItems,
    imageURL: req.body.imageURL,
  });

  product = await product.save();
  res.send(product);
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      description: req.body.description,
      manufacturer: req.body.manufacturer,
      availableItems: req.body.availableItems,
      imageURL: req.body.imageURL,
      createdAt: req.body.createdAt,
      updatedAt: req.body.updatedAt,
    },
    { new: true }
  );
  if (!product)
    return res.status(404).send("The product with the given id not found");
  res.send({
    productId: product._id,
    name: product.name,
    category: product.category,
    price: product.price,
    description: product.description,
    manufacturer: product.manufacturer,
    availableItems: product.availableItems,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  });
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);

  if (!product)
    return res.status(404).send("The product with the given ID was not found.");
  res.send(product);
});

module.exports = router;
