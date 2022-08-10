const auth = require("../middleware/auth"); 
const { Address, validateAddress } = require("../models/address");
const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

const express = require("express");
const router = express.Router();


router.post("/",auth, async (req, res) => {
  const { error } = validateAddress(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // req.user is taken from auth module when user is logged in
  const user = await User.findById(req.user._id).select('-isAdmin -__v');
  if (!user) return res.status(400).send('Invalid user.');

  let address = new Address({
    name: req.body.name,
    city: req.body.city,
    state: req.body.state,
    street: req.body.street,
    contactNumber: req.body.contactNumber,
    landmark: req.body.landmark,
    zipCode: req.body.zipCode,
    user: user,
  });
  address = await address.save();
 res.send(address);
});

module.exports = router;
