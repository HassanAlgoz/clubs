const router = require('express').Router()
const passport = require('passport');
const lusca = require('lusca')
// Models
const Club = require('../models/club');
const User = require('../models/user');

router.use(lusca.csrf())

//  Signup ====================================================================
router.get('/signup', function(req, res) {
	res.render('signup', {
		errors: req.flash('errors'),
		_csrf: req.csrfToken()
	});
});

router.post('/signup', passport.authenticate('local-signup', {
	successRedirect : '/',
	failureRedirect : '/auth/signup',
	failureFlash : true // allow flash messages
}));

// Login ====================================================================
router.get('/login', (req, res, next) => {
	if (req.user) {
		res.redirect('/')
	} else {
		res.render('login', {
			message: req.flash('loginMessage'),
			_csrf: req.csrfToken()
		})
	}
})

router.post('/login', passport.authenticate('local-login', {
	successRedirect : '/',
	failureRedirect : '/auth/login',
	failureFlash : true // allow flash messages
}));


// LOGOUT ==============================
router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});




module.exports = router;