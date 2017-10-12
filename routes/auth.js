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

router.get('/confirmation', async (req, res, next) => {
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
		res.redirect('/')
	} else {
		res.render('login', {
			message: req.flash('loginMessage'),
			_csrf: req.csrfToken()
		})
	}
})

router.post('/login', passport.authenticate('local-login', {
	failureRedirect : '/auth/login',
	failureFlash : true // allow flash messages
}), (req, res, next) => {
	res.redirect(req.query.redirect || '/')
});


// LOGOUT ==============================
router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});




module.exports = router;