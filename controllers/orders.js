const auth = require("../middleware/auth");
const { Order, validateOrder } = require("../models/order");
const { User, validate } = require("../models/user");
const { Address } = require("../models/address");
const { Product } = require("../models/product");
const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
const Fawn = require("fawn"); // for transactions

Fawn.init(mongoose); // initialize fawn

const express = require("express");
const adminForOrders = require("../middleware/adminForOrders");
const router = express.Router();

router.post("/", [auth, adminForOrders], async (req, res) => {
  const { error } = validateOrder(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // req.user is taken from auth module when user is logged in
  const user = await User.findById(req.user._id).select('-isAdmin -__v');
  if (!user) return res.status(400).send('Invalid user.');

  const product = await Product.findById(req.body.productId);
  if (!product)
    return res
      .status(400)
      .send(`No Product found for ID - ${req.body.productId}!`);

  const address = await Address.findById(req.body.addressId);
  if (!address)
    return res
      .status(400)
      .send(`No Address found for ID - ${req.body.addressId}!`);

  if (product.availableItems === 0)
    return res
      .status(400)
      .send(
        `Product with ID - ${req.body.productId} is currently out of stock!`
      );

  let order = new Order({
    product: {
      _id: product._id,
    },
    address: {
      _id: address._id,
    },
    quantity: req.body.quantity,
  });

  // Transaction implementation using Fawn library
  try {
      new Fawn.Task() // new task initialized, all will be treated as one unit, in case of errors rollback
      .save("orders", order)
      .update(
        "products",
        { _id: req.body.productId },
        { $inc: { availableItems: -1 } }
      )
      .run();

    const amount = req.body.quantity * product.price;
    orderDate = [Date.now()];
    order = await Order.find({
      address: req.body.addressId,
      product: req.body.productId,
    })
      .populate("address", "-__v")
      .populate("product", "-__v")
      .select("product address quantity");
    res.send({user, product,address, amount, orderDate });
  } catch (ex) {
    res.status(500).send("Something Failed!");
  }
});

module.exports = router;
