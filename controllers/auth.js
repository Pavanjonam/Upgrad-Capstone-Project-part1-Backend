const bcrypt = require("bcrypt");
const Joi = require("joi");
const { User } = require("../models/user");
const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("This email has not been registered!");
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid Credentials!");

  const token = user.generateAuthToken();
  res.header("x-auth-token", token);
  res.send({email:user.email, name: user.firstName+" "+user.lastName, isAuthenticated:true});
});

// Below we are confirming that email and password is sent by user in request
function validate(user) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(user, schema);
}

module.exports = router;
