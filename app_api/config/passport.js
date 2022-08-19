const passport = require('passport'); //bring in passport library
const LocalStrategy = require('passport-local').Strategy; //using local strategy
const mongoose = require('mongoose'); //bring in mongoose
const User = mongoose.model('users'); 

passport.use(new LocalStrategy({
    usernameField: 'email'
  }, 
  (username, password, done) => {
    User.findOne({ email: username }, (err, user) => { //mongoose find method
      if (err) { return done(err); }
      if (!user) { 
        return done(null, false, { 
          message: 'Incorrect username there, frien.'
        });
      }
      if (!user.validPassword(password)) { 
        return done(null, false, {
          message: 'Wrong password there, frien.'
        });
      }
      return done(null, user);
    });
  }
));