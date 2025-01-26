const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user'); // Adjust the path if necessary

// Define the local strategy for user authentication
passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',   // Use email as the username field
            passwordField: 'password', // Password field
        },
        async (email, password, done) => {
            try {
                // Query the user by email
                const user = await User.findOne({ email });

                // Log the user object to verify its contents
                console.log('User:', user);  // This will show the entire user object

                // If no user found, return error
                if (!user) {
                    return done(null, false, { message: 'Invalid email or password.' });
                }

                // Check if the password is correct
                const isPasswordValid = user.validPassword(password);  // Ensure this method is defined in your user schema
                if (!isPasswordValid) {
                    return done(null, false, { message: 'Invalid email or password.' });
                }

                // If everything is okay, return the user object
                return done(null, user);
            } catch (err) {
                // Handle errors, such as database issues, etc.
                console.error('Error during authentication:', err); // Log the error for debugging
                return done(err);
            }
        }
    )
);

// Serialize and deserialize user to support session-based login (if needed)
passport.serializeUser((user, done) => {
    done(null, user.id); // Store the user ID in the session
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user); // Return the user object from the ID stored in the session
    } catch (err) {
        done(err, null); // Handle error if user not found
    }
});

module.exports = passport;
