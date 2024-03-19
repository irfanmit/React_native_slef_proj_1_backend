const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email : {
    type : String,
    required : true
  },
  password: {
    type: String,
    required: true,
  },
  mobileNo: {
    // Add the mobile number field
    type: String,
    required: true,
  },
  expoPushToken : {
    type : String,
    // required : true
  },
  Name : {
    type : String,
    required : true
  },
  DpUrl : {
    type : String,
    required : true
  }
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return this.password === candidatePassword;
};

// Create the user model
module.exports = mongoose.model("User", userSchema);
