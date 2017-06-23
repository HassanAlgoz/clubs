const router = require('express').Router();

// Models
const Club = require('../models/club');
const User = require('../models/user');


// GET
router.get('/clubs/:clubId', (req, res, next) => {

	let clubId = req.params.clubId;
	Club.findById(clubId).then((club) => {
		res.json({club})
	}).catch(next)

});


// GET ALL
router.get('/clubs', (req, res, next) => {

	return Promise.all([
		Club.find({})
			.sort({date: -1}),
		Club.count()
	]).then(([clubs, count]) => {
		res.json({clubs, count})
	}).catch(next)

});


// POST
router.post('/clubs', User.canManage, (req, res, next) => {

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
			club: club,
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
router.put('/clubs/:clubId', User.canManage, (req, res, next) => {
	let clubId = req.params.clubId
	console.log(req.body)
	Club.findByIdAndUpdate(clubId, req.body).then(() => {
		res.sendStatus(204) // Successful and no content returned.
	}).catch(next)
});


// DELETE
router.delete('/clubs/:clubId', User.canManage, (req, res, next) => {
	let clubId = req.params.clubId
	Club.findByIdAndRemove(clubId).then(() => {
		res.sendStatus(204) // Successful and no content returned.
	}).catch(next)
});



// User Joins club ==============================================================
router.get('/clubs/:clubId/join', User.isLoggedIn, (req, res, next) => {
	
	let clubId = req.params.clubId
	Club.findById(clubId).then((club) => {
		// Check if user has no membership in this club
		// We do that by checking if no role was attached to req.user
		if (typeof req.user.role === undefined) {
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
// app.get('/clubs/:clubId/kick/:userId', User.isPresident, (req, res, next) => {
	
// 	let clubId = req.params.clubId
// 	let userId = req.params.userId
// 	Promise.all[Club.findById(clubId), User.findById(userId)].then(([club, user]) => {
// 		// Check if user is already a member of this club
// 	})
// 	.catch(next)

// })




module.exports = router;
