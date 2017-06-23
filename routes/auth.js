const router = require('express').Router()
const passport = require('passport');

// Models
const Club = require('../models/club');
const User = require('../models/user');


//  Signup ====================================================================
router.get('/signup', (req, res, next) => res.render('signup'))
router.post('/signup', (req, res, next) => {

	User.register(new User({
		username: req.body.username,
		email: req.body.email,
		major: req.body.major,
		enrollment: req.body.enrollment
	}), req.body.password, function(err, user) {
        if (err) {
            return next(err)
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });

})

// Login ====================================================================
router.get('/login', (req, res, next) => {
	if (req.user) {
		res.redirect('/')
	} else {
		res.render('login')
	}
})

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});


router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


module.exports = router;