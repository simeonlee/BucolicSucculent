var session = require('express-session');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var keys =  require('./keys');
var User = require('../users/users');

module.exports = function(app) {
  
  app.use(session({ 
    secret: 'sneaky diamonds',
    saveUninitialized: true,
    resave: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new FacebookStrategy({
    clientID: keys.FACEBOOK_APP_ID, // TODO: set process.env.FACEBOOK_APP_ID config vars in heroku
    clientSecret: keys.FACEBOOK_APP_SECRET, // TODO: set  process.env.FACEBOOK_APP_SECRET config vars in heroku
    callbackURL: 'http://localhost:4200/auth/facebook/callback', // TODO: put website url here
    profileFields: exports.profileFields = [
      'id',
      'displayName',
      'first_name',
      'last_name',
      'email',
      'bio',
      'work',
      'education',
      'location',
      'birthday',
      'cover',
      'picture.type(large)',
      'gender',
      'interested_in',
      'link', // FB timeline 
      'website',
      'is_verified'
    ]
  }, function(accessToken, refreshToken, profile, done) {

      var user = {
        facebookname: profile.displayName,
        facebookavatar: profile.photos[0].value,
        facebookemail: profile.photos[0].value,
        facbeookid: profile.id,
        }
       //<--- dummy data testing
    done(null, user);
  }));

  passport.serializeUser(function(user, done) {
    done(null, user); //<====  fb user reference is saved in req.session.passport.user
  });

  passport.deserializeUser(function(user, done) {
    console.log('is this allowed?', user);
    done(null, user); //<==== grab user from db via fb reference from serializeUser. Persistent data of user info is attached onto req as req.user!
  });

};