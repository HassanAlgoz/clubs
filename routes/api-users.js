const router = require('express').Router();

// Models
const User = require('../models/user');
const Club = require('../models/club')

// GET
router.get('/users/:userId', (req, res, next) => {

	let userId = req.params.userId;
	User.findById(userId).then((user) => {
		res.json({user})
	}).catch(next)

})

// GET ALL
router.get('/users', (req, res, next) => {

	// ?clubId
	if (typeof req.query.clubId !== undefined) {
		// Get ALL Members of some Club
		Club.findById(req.query.clubId)
			.populate('members')
			.then((club) => {
			res.json({users: club.members})
		}).catch(next)
	} else {
		return Promise.all([
			User.find({}),
			User.count()
		]).then(([users, count]) => {
			res.json({users, count})
		}).catch(next)
	}
});

// PUT
router.put('/users/:userId', User.isPresident, (req, res, next) => {

	// ?role
	if (typeof req.query.role !== undefined && (req.query.role === 'unapproved' || req.query.role === 'member' || req.query.role === 'manager')) {
		// Set user role in this club
		User.update({ _id: userId, "memberships.club": clubId }, { $set: {
			"memberships.$.role": req.query.role
		}}).then(() => res.sendStatus(204)).catch(next)

	} else {
		let userId = req.params.userId
		User.findById(userId).then((user) => {
			user.username = req.body.username;
			user.email = req.body.email;
			user.enrollment = req.body.enrollment;
			user.major = req.body.major;
			user.setPassword(req.body.password, () => {
				user.save().then(() => res.sendStatus(204)).catch(next)
			})
		})
		.catch(next)
	}
});


// DELETE
router.delete('/users/:userId', User.isPresident, (req, res, next) => {

	let userId = req.params.userId
	User.findByIdAndRemove(userId).then(() => {
		res.sendStatus(204) // Successful and no content returned.
	}).catch(next)

});


module.exports = router;
