var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Models
var Club = require('../models/club');
var User = require('../models/user');

module.exports = function(app) {


	app.get('/profile/:id', (req, res) => {

		User.findOne({ _id: req.params.id }).exec((err, user) => {
			if (err) console.log(err);

			if (user) {
				res.render('profile', {user});
			} else {
				res.send('error finding user!');
			}

		});

	});


	app.get('/signup', (req, res) => {
		res.render('signup');
	});


	app.post('/signup', (req, res) => {

	  User.findOne({ email: req.body.email }, (err, user) => {
	  	if (err) console.log(err);
	  	if (user) {
	      res.send('Account with that email address already exists!');
	  	} else {
	  		new User({
	      	name: req.body.name,
	      	email: req.body.email,
	  			password: User.encryptPassword(req.body.password),
	  			major: req.body.major,
	  			enrollment: req.body.enrollment
      	}).save((err, user) => {
      		if (err) console.log(err);
      		if (user) {
	      		req.logIn(user, (err) => {
		          if (err) console.log(err);
		          res.redirect('/');
		        });
	      	} else {
	      		console.log('error while saving user');
	      	}
      	});
	  	}
	  });

	});

	app.get('/login', function(req, res){
		if (req.user) return res.redirect('/');
		res.render('login');
	});



	app.post('/login', passport.authenticate('local.login', {
		successRedirect: '/clubs',
		failureRedirect: '/login',
		failureFlash: false
	}));



	app.get('/logout', function(req, res){
		req.logout();
  	res.redirect('/');
	});

};
