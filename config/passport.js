const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use('local.login', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, function(req, email, password, done) {
	User.findOne({'email': email}, function(err, user) {
		if (err) return done(err);
		if (!user) {
			return done(null, false, {message: 'No such user'});
		}
		if (!user.validPassword(password)) {
			return done(null, false, {message: 'Wrong password'});
		}
		return done(null, user);
	});
}
));