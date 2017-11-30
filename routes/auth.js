const router = require('express').Router()
const passport = require('passport');
const lusca = require('lusca')
const RateLimit = require('express-rate-limit');
// Models
const Club = require('../models/club');
const User = require('../models/user');

const authLimiter = new RateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour window
	delayAfter: 1, // begin slowing down responses after the first request
	delayMs: 3 * 1000, // slow down subsequent responses by 3 seconds per request
	max: 5, // start blocking after 5 requests
	// Too many accounts created from this IP, please try again after an hour
	message: "Too many requests, please try again later."
	/*
	statusCode: HTTP status code returned when max is exceeded. Defaults to 429
	resetKey(key): Resets the rate limiting for a given key. (Allow users to complete a captcha or whatever to reset their rate limit, then call this method.)
	*/
});

router.use((req, res, next) => {
	authLimiter.store = req.session.store;
	next();
})

router.use(lusca.csrf())

//  Signup ====================================================================
router.get('/signup', function(req, res) {
	res.render('signup', {
		errors: req.flash('errors'),
		_csrf: req.csrfToken()
	});
});

router.post('/signup', [passport.authenticate('local-signup', {
	successRedirect : '/clubs',
	failureRedirect : '/auth/signup',
	failureFlash : true // allow flash messages
}), authLimiter]);

router.get('/confirmation', authLimiter, async (req, res, next) => {
	let {id, code} = req.query;
	try {
		let user = await User.findById(id).exec()
		if (user.confirmationCode == code) {
			user.confirmationCode = "0"
			await user.save()
			res.sendStatus(200)
		} else {
			res.sendStatus(403)
		}
	}
	catch(err){next(err)}
})

// Login ====================================================================
router.get('/login', (req, res, next) => {
	if (req.user) {
		res.redirect('/clubs')
	} else {
		res.render('login', {
			message: req.flash('loginMessage'),
			_csrf: req.csrfToken()
		})
	}
})

router.post('/login', [passport.authenticate('local-login', {
	failureRedirect : '/auth/login',
	failureFlash : true // allow flash messages
}), authLimiter], (req, res, next) => {
	res.redirect(req.query.redirect || '/clubs')
});


// LOGOUT ==============================
router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});




module.exports = router;