const router = require('express').Router();

// Models
const Club = require('../models/club');
const User = require('../models/user');


// GET
router.get('/:clubId', (req, res, next) => {

	let clubId = req.params.clubId;
	Club.findById(clubId).then((club) => {
		res.json({club})
	}).catch(next)

});


// GET ALL
router.get('/', (req, res, next) => {

	return Promise.all([
		Club.find({})
			.sort({date: -1}),
		Club.count()
	]).then(([clubs, count]) => {
		res.json({clubs, count})
	}).catch(next)

});


// POST
router.post('/', User.isAdmin, (req, res, next) => {

	console.log(req.body);

	let club = new Club({
		name: req.body.name,
		description: req.body.description,
		logo: req.body.logo,
		members: []
	});

	User.findById(req.body.clubPresidentId).then((user) => {
		club.members.push(user)
		user.memberships.push({
			club: club._id,
			role: "president"
		})
		return Promise.all([user.save(), club.save()])
	})
	.then(() => {
		res.sendStatus(201)
	})
	.catch(next)

});


// PUT
router.put('/:clubId', User.canManage, (req, res, next) => {
	// NOTE: User.canManage doesn't include Admin
	let clubId = req.params.clubId
	console.log(req.body)
	Club.findByIdAndUpdate(clubId, req.body).then(() => {
		res.sendStatus(204) // Successful and no content returned.
	}).catch(next)
});


// DELETE
router.delete('/:clubId', User.isAdmin, (req, res, next) => {
	let clubId = req.params.clubId
	Club.findByIdAndRemove(clubId).then(() => {
		res.sendStatus(204) // Successful and no content returned.
	}).catch(next)
});



// User Joins club ==============================================================
router.put('/:clubId/join', User.isLoggedIn, (req, res, next) => {
	
	let clubId = req.params.clubId
	Club.findById(clubId).then((club) => {
		// Check if user has no membership in this club
		// We do that by checking if no role was attached to req.user
		if (!req.user.role) {
			club.members.push(req.user)
			req.user.memberships.push({club})
			Promise.all([req.user.save(), club.save()]).then(() => res.sendStatus(201))
		} else {
			console.log('already a joined this club')
			res.sendStatus(304) // Not Modified
		}
	})
	.catch(next)

})

// Kick User from Club ==============================================================
router.put('/:clubId/kick/:userId', User.isPresident, (req, res, next) => {
	
	let clubId = req.params.clubId
	let userId = req.params.userId
	User.findOneAndUpdate({ _id: userId, "memberships.club": clubId }, { $set: {
		"memberships.$.role": 'kicked'
	}}).then((user) => {
		res.sendStatus(204) // Success but no content returned
	})
	.catch(next)

})




module.exports = router;
