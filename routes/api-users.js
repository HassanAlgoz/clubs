const router = require('express').Router();

// Models
const User = require('../models/user');
const Club = require('../models/club')

// Attach 'role' in this club to the 'req.user' object
router.use(User.getRoleFromQuery)

// GET
router.get('/:userId', (req, res, next) => {

	let userId = req.params.userId;
	User.findById(userId).then((user) => {
		res.json({user})
	}).catch(next)

})

// GET ALL
router.get('/', (req, res, next) => {

	console.log('req.query.clubId = ', req.query.clubId)

	if (req.query.clubId) {
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
			user.setPassword(req.body.password, () => {
				user.save().then(() => res.sendStatus(204)).catch(next)
			})
		})
		.catch(next)
	}
});


// DELETE
router.delete('/:userId', User.isPresident, (req, res, next) => {

	let userId = req.params.userId
	User.findByIdAndRemove(userId).then(() => {
		res.sendStatus(204) // Successful and no content returned.
	}).catch(next)

});


module.exports = router;
