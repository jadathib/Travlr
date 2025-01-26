const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // Correct import for passport-local
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
  user.setPassword(password); // Hash password using setPassword method defined in User schema

  // Save user to database
  user.save((err) => {
    if (err) {
      // Check for duplicate email
      if (err.code === 11000) {
        return res.status(400).json({ message: "Email already exists" });
      }
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
      console.error("Passport authentication error:", err); // Log error for debugging
      return res.status(500).json({ message: "Internal server error", error: err });
    }

    if (!user) {
      // User not found or invalid credentials
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // User authenticated successfully
    const token = user.generateJwt();
    return res.status(200).json({ message: "Login successful", token });
  })(req, res);
};

// Passport local strategy configuration
passport.use(
    new LocalStrategy(
        { usernameField: 'email', passwordField: 'password' },
        async (email, password, done) => {
          try {
            // Query the user by email using async/await
            const user = await User.findOne({ email });

            if (!user) {
              return done(null, false, { message: 'No user found with that email.' });
            }

            // Validate the password (assuming validPassword is async)
            const isPasswordValid = await user.validPassword(password);
            if (!isPasswordValid) {
              return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user); // Authentication successful
          } catch (err) {
            return done(err);
          }
        }
    )
);

passport.serializeUser((user, done) => {
  done(null, user.id); // Store user ID in session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = {
  register,
  login
};
