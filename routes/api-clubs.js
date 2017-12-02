const router = require('express').Router();
const utils = require('../utils')
// Models
const Club = require('../models/club');
const User = require('../models/user');
const Event = require('../models/event');
const Post = require('../models/post');

// Attach 'role' in this club to the 'req.user' object
router.param('clubId', User.getRoleFromParam)

// GET
router.get('/:clubId', async (req, res, next) => {
	let {clubId} = req.params;
	let {events, posts} = req.query
	try {
		let dbQuery = Club.findById(clubId)
		if (events) {
			dbQuery.populate('events', 'title date time location condition membersOnly image club seatLimit')
				.populate({
					path: 'events',
					populate: { path: 'organizers', select: 'username' }
				})
		}
		if (posts) {
			dbQuery.populate('posts', 'title publishDate image')
		}
		let club = await dbQuery.exec()
		if (!club) {
			// return res.status(404).send(`Error finding club with id: ${clubId}`);
			return res.sendStatus(404);
		}
		res.json({club})
	}catch(err){next(err)}
});


// GET ALL
router.get('/', async (req, res, next) => {
	let {events, posts} = req.query
	try {
		let dbQuery = Club.find({}).sort({date: -1})
		if (events) {
			dbQuery.populate('events', 'title date time location condition membersOnly image club seatLimit')
				.populate({
					path: 'events',
					populate: { path: 'organizers', select: 'username' }
				})
		}
		
		if (posts) {
			dbQuery.populate('posts', 'title publishDate')
		}
		let [clubs, count] = await Promise.all([dbQuery.exec(), dbQuery.count().exec()])
		res.json({clubs, count})
	}catch(err){next(err)}
});


// POST
router.post('/', User.isAdmin, async (req, res, next) => {

	req.checkBody('name', "can't be empty").notEmpty()

	let errors = await utils.getValidationErrors(req)
	if (errors.length > 0) {
		res.status(400).json({errors: errors})
		return;
	}

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
router.put('/:clubId', User.canManage, async (req, res, next) => {
	// NOTE: User.canManage doesn't include Admin
	req.checkBody('name', "can't be empty").notEmpty()
	req.checkBody('logo')
		.notEmpty().withMessage("can't be empty")
		.isURL().withMessage("must be a url")
	req.checkBody('description', "can't be empty").notEmpty()
	
	let errors = await utils.getValidationErrors(req)
	if (errors.length > 0) {
		res.status(400).json({errors: errors})
		return;
	}
	
	try {
		let {clubId} = req.params
		await Club.findByIdAndUpdate(clubId, req.body).exec()
		res.sendStatus(204) // Successful and no content returned.
	}
	catch(err){next(err)}
});


// DELETE
router.delete('/:clubId', User.isAdmin, (req, res, next) => {
	let clubId = req.params.clubId
	
	Club.findById(clubId).then((club) => {
		return Promise.all([
			Event.remove({ _id: {$in: club.events} }),
			Post.remove({ _id: {$in: club.posts} }),
			User.update({ _id: {$in: club.members} }, { $pull: {"memberships": {"club": clubId}} }),
			Club.findByIdAndRemove(clubId)
		])
	}).then(() => {
		res.sendStatus(204) // Successful and no content returned.
	})
	.catch(next)
});

// Condition approved/unapproved
router.put('/:clubId/condition', User.isAdmin, async (req, res, next) => {
	try {
		let {clubId} = req.params
		await Club.findByIdAndUpdate(clubId, {condition: req.body.condition}).exec()
		res.sendStatus(204) // Successful and no content returned.
	}
	catch(err){next(err)}
});

// User Joins club ==============================================================
router.put('/:clubId/join', [User.isLoggedIn, User.isConfirmed], (req, res, next) => {
	
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

// Send Notifications
// router.get('/:clubId/send', async (req, res, next) => {
// 	let {clubId} = req.params
// 	try {
// 		let club = await Club.findById(clubId).populate('members', 'notificationToken').exec()
// 		let registrationTokens = club.members
// 			.map(member => member.notificationToken)
// 			.filter(notification => typeof notification !== undefined)
// 		if (registrationTokens.length > 0) {
// 			utils.pushNotification(registrationTokens,  {
// 				title: "$GOOG up 1.43% on the day",
// 				body: "$GOOG gained 11.80 points to close at 835.67, up 1.43% on the day."
// 			})
// 			return res.send("Notifications Sent");
// 		}
// 		res.send("No Registered Tokens...");
// 	}
// 	catch(err){next(err)}
// })



module.exports = router;
