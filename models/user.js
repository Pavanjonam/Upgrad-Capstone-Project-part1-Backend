const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

const userSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024,
    },
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true,
    },
    contactNumber: {
      type: Number,
      minlength: 10,
      maxlength: 10,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
    isAdmin: Boolean,
  },
  { __v: false }
);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    password: Joi.string().min(5).max(255).required(),
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50).required(),
    email: Joi.string().regex(/^(([a-zA-Z0-9 _ - .]{1,255})+)@(([a-zA-Z0-9]{1,255})+).([a-z]{2,6})$/)
    .required().email().error(() => {
      return {
        message: 'Invalid email-id format!',
      };
    }),
    contactNumber: Joi.number().min(1000000000).max(9999999999).required().error(() => {
      return {
        message: 'Invalid contact number!',
      };
    })
  };

  return Joi.validate(user, schema);
}
exports.User = User;
exports.validate = validateUser;
exports.userSchema = userSchema;
