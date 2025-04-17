const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // Correct import for passport-local
const User = require('../models/user'); // Adjust the path if necessary

// Input validation helper
const validateInput = (input, field) => {
  if (!input) {
    return `${field} is required`;
  }

  if (field === 'email') {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(input)) {
      return 'Please provide a valid email address';
    }
  }

  if (field === 'password' && input.length < 6) {
    return 'Password must be at least 6 characters long';
  }

  return null;
};

// User registration
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    const errors = {};
    const nameError = validateInput(name, 'name');
    const emailError = validateInput(email, 'email');
    const passwordError = validateInput(password, 'password');

    if (nameError) errors.name = nameError;
    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Validation failed',
        errors 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Registration failed',
        errors: { email: 'Email already exists' } 
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: role || 'user'
    });

    // Save user to database
    await user.save();

    // Generate JWT for the new user
    const token = user.generateJwt();

    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      status: 'error',
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// User login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    const errors = {};
    const emailError = validateInput(email, 'email');
    const passwordError = validateInput(password, 'password');

    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Validation failed',
        errors 
      });
    }

    // Use a promise-based approach for passport authentication
    const authenticate = () => {
      return new Promise((resolve, reject) => {
        passport.authenticate('local', (err, user, info) => {
          if (err) return reject(err);
          if (!user) return resolve({ success: false, message: info.message || 'Invalid email or password' });
          return resolve({ success: true, user });
        })(req, res);
      });
    };

    const authResult = await authenticate();

    if (!authResult.success) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication failed',
        error: authResult.message
      });
    }

    // User authenticated successfully
    const token = authResult.user.generateJwt();

    return res.status(200).json({
      status: 'success',
      message: 'Login successful',
      user: {
        id: authResult.user._id,
        name: authResult.user.name,
        email: authResult.user.email,
        role: authResult.user.role
      },
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
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
