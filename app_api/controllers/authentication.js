// controllers/authentication.js
const passport = require('passport');
const User = require('../models/user'); // Adjust the path if necessary

// User registration
const register = (req, res) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required, friend!" });
  }

  // Create new user
  const user = new User();
  user.name = name;
  user.email = email;
  user.setPassword(password); // Custom method to hash the password

  // Save user to database
  user.save((err) => {
    if (err) {
      return res.status(400).json({ message: "Error saving user", error: err });
    }

    // Generate JWT for the new user
    const token = user.generateJwt();
    res.status(200).json({ token });
  });
};

// User login
const login = (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required, friend!" });
  }

  // Authenticate user using Passport
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Authentication error", error: err });
    }

    if (!user) {
      // User not found or invalid credentials
      return res.status(401).json({ message: "Invalid email or password", info });
    }

    // User authenticated successfully
    const token = user.generateJwt();
    res.status(200).json({ token });
  })(req, res);
};

module.exports = {
  register,
  login
};
