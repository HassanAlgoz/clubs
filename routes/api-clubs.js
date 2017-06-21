const router = require('express').Router();

// Models
const Club = require('../models/club');
const User = require('../models/user');

// search by name
// Club.findOne({ name: new RegExp(name, 'i') })

// GET
router.get('/clubs/:id', (req, res, next) => {

	let clubId = req.params.id;
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
router.post('/clubs', [User.isLoggedIn, User.canAdmin], (req, res, next) => {

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
router.put('/clubs/:id', User.isLoggedIn, (req, res, next) => {
	let clubId = req.params.id
	console.log(req.body)
	Club.findByIdAndUpdate(clubId, req.body).then(() => {
		res.sendStatus(204) // Successful and no content returned.
	}).catch(next)
});


// DELETE
router.delete('/clubs/:id', [User.isLoggedIn, User.canAdmin], (req, res, next) => {

	let clubId = req.params.id
	Club.findByIdAndRemove(clubId).then(() => {
		res.sendStatus(204) // Successful and no content returned.
	}).catch(next)

});


module.exports = router;
