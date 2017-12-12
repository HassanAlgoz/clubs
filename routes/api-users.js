const router = require('express').Router();

// Models
const User = require('../models/user');
const Club = require('../models/club')

// Attach 'role' in this club to the 'req.user' object
router.use(User.getRoleFromQuery)

// GET
router.get('/:userId', async (req, res, next) => {

	let userId = req.params.userId;
	try {
		let user = await User.findById(userId).select('-password -confirmationCode').exec();
		res.json(user);
	} catch (err) {next(err)}
})

// GET ALL
router.get('/', (req, res, next) => {

	console.log('req.query.clubId = ', req.query.clubId)

	if (req.query.clubId) {
		// Get ALL Members of some Club
		Club.findById(req.query.clubId)
			.populate('members', '-password -confirmationCode')
			.then((club) => {
			res.json({users: club.members})
		}).catch(next)
	} else {
		return Promise.all([
			User.find({}).select('-password -confirmationCode'),
			User.count()
		]).then(([users, count]) => {
			res.json({users, count})
		}).catch(next)
	}
});

// PUT
router.put('/:userId', User.isPresident, (req, res, next) => {
	
	let userId = req.params.userId
	
	let role = req.body.role
	let clubId = req.query.clubId
	console.log('role =', role)
	console.log('req.query.clubId =', req.query.clubId)
	if (req.body.role) {
		// Set user role in this club
		User.update({ _id: userId, "memberships.club": clubId },
			{ $set: { "memberships.$.role": role } }
		)
		.then(() => res.sendStatus(204))
		.catch(next)

	} else {
		User.findById(userId).then((user) => {
			user.username = req.body.username;
			user.email = req.body.email;
			user.enrollment = req.body.enrollment;
			user.major = req.body.major;
			return user.save()
				
		})
		.then(() => res.sendStatus(204))
		.catch(next)
	}
});


// PUT - Profile
router.put('/profile/:userId', async (req, res, next) => {
	
	let userId = req.params.userId

	req.checkBody('email', 'must be a valid email.').isEmail()
	req.checkBody('password', 'a minimum length of 6 characters.').len({ min: 6 })
	let errors = await utils.getValidationErrors(req)
	if (errors.length > 0) {
		return done(null, false, req.flash('errors', errors));
	}
	
	try {
		let user = await User.findById(userId).exec()
		// Password check
		let currentPassword = req.body.currentPassword.trim()
		if (currentPassword && user.validPassword(currentPassword)) {
			user.password = user.generateHash(req.body.newPassword)
			console.log('password changed successfully!')
		} else {
			console.log('password remains unchanged')
		}

		user.email = req.body.email;
		user.username = req.body.username;
		user.enrollment = req.body.enrollment;
		user.major = req.body.major;

		await user.save()
		res.sendStatus(204)
	} catch (err) {next(err)}
	
});


// DELETE
router.delete('/:userId', User.isPresident, (req, res, next) => {

	let userId = req.params.userId
	User.findByIdAndRemove(userId).then(() => {
		res.sendStatus(204) // Successful and no content returned.
	}).catch(next)

});


module.exports = router;
