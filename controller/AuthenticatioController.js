const User = require("../models/User");
// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateRandomUsername = () => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let username = "";
  for (let i = 0; i < 8; i++) {
    // You can adjust the length of the username as needed
    username += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return username;
};

const signup = async (req, res, next) => {
  console.log("singin up...")
  const { email, password, mobileNo, expoPushToken, Name } = req.body;

  const DpUrl = "random";


  console.log("expoPushToken ...............", expoPushToken.data);
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const newUser = new User({
      username: generateRandomUsername(),
      email,
      password,
      mobileNo : mobileNo.replace("+91", "").replace(/\s/g, ""),
      expoPushToken: expoPushToken.data,
      Name,
      DpUrl,
    });
    await newUser.save();
    console.log(newUser);
    // Optionally, you can generate a JWT token here and send it in the response for authentication

    res
      .status(201)
      .json({ success: true, message: "User signed up successfully" });
  } catch (err) {
    console.error("Failed signup:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const login = async (req, res, next) => {
  console.log("loging in...")
  const { email, password } = req.body;
  console.log(password, email);

  // Check if the user exists
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const isPasswordValid = user.comparePassword(password);
  if (!isPasswordValid) {
    console.log("wrong pass");
    return res.status(401).json({ error: "Invalid password" });
  }

  const token = jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
    },
    "somesupersecretsecret",
    { expiresIn: "1h" }
  );

  console.log("login success");
  res.json({ token: token, userData: user });
};

exports.signup = signup;
exports.login = login;
