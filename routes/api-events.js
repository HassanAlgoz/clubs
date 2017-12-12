const router = require('express').Router();
// util
const utils = require('../utils.js')
const moment = require('moment')
// Models
const Event = require('../models/event');
const User = require('../models/user');
const Club = require('../models/club')


// Attach 'role' in this club to the 'req.user' object
router.param('clubId', User.getRoleFromParam)
router.use(User.getRoleFromQuery)

// GET
router.get('/:clubId/events/:eventId', async (req, res, next) => {
	let {eventId} = req.params;
	try {
		let event = await Event.findById(eventId).populate('organizers', 'username').exec()
		if (!event) {
			// return res.status(404).send(`Error finding event with id: ${eventId}`);
			return res.sendStatus(404);
		}
		res.json({event})
	}catch(err){next(err)}
});

// GET ALL events
router.get('/:clubId/events', async (req, res, next) => {
	let {clubId} = req.params
	// Offset & Limit
	let offset = parseInt(req.query.offset) || 0;
	let limit  = parseInt(req.query.limit)  || 0;
	try {
		// Date range
		let startDate = (req.query.startDate)? new Date(req.query.startDate) : null;
		let endDate   = (req.query.endDate)?   new Date(req.query.endDate)   : null;
		let match = {}
		if (startDate) {
			if (!match.date) {
				match.date = {}
			}
			match.date.$gte = startDate
		}
		if (endDate) {
			if (!match.date) {
				match.date = {}
			}
			match.date.$lte = endDate
		}
		let {events} = await Club.findById(clubId).select('events').populate({
			path: 'events',
			match: match,
			options: { offset, limit },
			populate: { path: 'organizers', select: 'username'}
		}).sort({date: -1}).exec()
		res.json({events})
	}catch(err){next(err)}
});


// POST
router.post('/:clubId/events', User.canManage, async (req, res, next) => {
	let { clubId } = req.params

	req.checkBody('title',   "can't be empty").notEmpty()
	req.checkBody('image')
		.notEmpty().withMessage("can't be empty")
		.isURL().withMessage("must be a url")
	req.checkBody('time', "can't be empty").notEmpty()
	req.checkBody('location', "can't be empty").notEmpty()

	let errors = await utils.getValidationErrors(req)
	if (errors.length > 0) {
		res.status(400).json({errors: errors})
		return;
	}

	let sentAsEmail = (req.body.sentAsEmail === 'true') ? true : false
	let membersOnly = (req.body.membersOnly === 'true') ? true : false

	try {
		// Create event
		let event = await new Event({
			image: req.body.image,
			title: req.body.title,
			brief: req.body.brief,
			lastEditDate: new Date(),
			lastEditBy: req.user._id,
			time: req.body.time,
			location: req.body.location,
			date: new Date(req.body.date) || new Date(),
			membersOnly: membersOnly,
			sentAsEmail: sentAsEmail,
			organizers: req.body.organizers,
			seatLimit: parseInt(req.body.seatLimit) || 0,
			club: clubId
		}).save()
		let club = await Club.findById(clubId).populate('members', 'email').exec()
		club.events.push(event._id)
		await club.save()
		if (sentAsEmail) {
			await sendEmailsToMembers(club, event)
		}
		res.json(event)
		return;
	}
	catch(err){next(err)}
});

async function sendEmailsToMembers(club, event) {
	let recepients = club.members.map(member => member.email)
	let fromName = club.name.replace(/\sclub\s/i, "").trim() + " Club"
	console.log("recepients:", recepients)
	let body = {
		"apikey": process.env.EMAIL_API_KEY,
		"from": process.env.EMAIL_FROM,
		"fromName": fromName,
		"to": recepients.join(';'),
		"subject": event.title,
		"bodyHtml": `
			<h1>${event.title}</h1>
			<a href="${process.env.DOMAIN}/clubs/${club._id}/events/${event._id}">
				<img src="${event.image}" alt="You should be seeing an image about the event instead of this text...">
			</a>
		`,
		"isTransactional": false // True, if email is transactional (non-bulk, non-marketing, non-commercial). Otherwise, false
	}
	if (!utils.sendEmail(body)) {
		throw new Error("Couldn't Send Email")
	}
}


// PUT
router.put('/:clubId/events/:eventId', User.canManage, async (req, res, next) => {
	let {clubId, eventId} = req.params;

	req.checkBody('title',   "can't be empty").notEmpty()
	req.checkBody('image')
		.notEmpty().withMessage("can't be empty")
		.isURL().withMessage("must be a url")
	req.checkBody('time', "can't be empty").notEmpty()
	req.checkBody('location', "can't be empty").notEmpty()

	let errors = await utils.getValidationErrors(req)
	if (errors.length > 0) {
		res.status(400).json({errors: errors})
		return;
	}

	try {
		// Check if event belongs to this club
		let club = await Club.findOne({ "events": eventId }).exec()
		
		if (!club) throw new Error("404: No such club")
		if (String(club._id) !== clubId) throw new Error("Event doesn't belong to this club!")
		
		// Update Event
		let event = await Event.findByIdAndUpdate(eventId, {
			image: req.body.image,
			title: req.body.title,
			brief: req.body.brief,
			lastEditDate: new Date(),
			lastEditBy: req.user._id,
			time: req.body.time,
			location: req.body.location,
			date: new Date(req.body.date) || new Date(),
			membersOnly: (req.body.membersOnly === 'true') ? true : false,
			sentAsEmail: (req.body.sentAsEmail === 'true') ? true : false,
			organizers: req.body.organizers,
			seatLimit: parseInt(req.body.seatLimit) || 0
		}).exec()
		res.json(event)
		return;
	}
	catch(err){next(err)}
});


// DELETE
router.delete('/:clubId/events/:eventId', User.canManage, (req, res, next) => {

	let {eventId, clubId} = req.params;

	// Check if event belongs to this club
	Club.findOne({ "events": eventId }).then((club) => {
		if (!(club && String(club._id) === clubId)) return next(new Error("Event doesn't belong to this club!"))
		
		// Remove Club from events and club.events
		return Promise.all([
			Event.findByIdAndRemove(eventId),
			Club.findOneAndUpdate({ events: eventId }, {$pull: { events: eventId }})
			// Using Pull [https://docs.mongodb.com/manual/reference/operator/update/pull/]
		])
	})
	.then(([event, club]) => {
		res.sendStatus(204) // Successful and no content returned.
	}).catch(next)

})


// Close an event
router.put('/:clubId/events/:eventId/close', User.canManage, (req, res, next) => {
	let {clubId, eventId} = req.params

	// Check if event belongs to this club
	Club.findOne({ "events": eventId }).then((club) => {
		if (!(club && String(club._id) === clubId)) return next(new Error("Event doesn't belong to this club!"))
		
		return Event.findByIdAndUpdate(eventId, {condition: 'closed'})

	})
	.then(() => res.sendStatus(204))
	.catch(next)

})


// Open an event
router.put('/:clubId/events/:eventId/open', User.canManage, (req, res, next) => {
	let {clubId, eventId} = req.params

	// Check if event belongs to this club
	Club.findOne({ "events": eventId }).then((club) => {
		if (!(club && String(club._id) === clubId)) return next(new Error("Event doesn't belong to this club!"))

		return Event.findByIdAndUpdate(eventId, {condition: 'open'})
	})
	.then(() => res.sendStatus(204))
	.catch(next)

})


// Promise to attend
router.put('/:clubId/events/:eventId/promise', User.isConfirmed, (req, res, next) => {
	let {clubId, eventId} = req.params

	// Check if event belongs to this club
	Club.findOne({ "events": eventId }).then((club) => {
		if (!(club && String(club._id) === clubId)) return next(new Error("Event doesn't belong to this club!"))

		return Event.findById(eventId)

	})
	.then((event) => {
		if (event.condition === 'open' && (event.seatLimit == 0 || event.promisers.length < event.seatLimit)) {
			if (event.membersOnly === true) {
				if (req.user.role === 'member' || req.user.role === 'manager' || req.user.role === 'president') {
					
					Event.findByIdAndUpdate(eventId, { $addToSet: { promisers: {user: req.user._id, attended: false} } }).then(() => {
						console.log('Promised to attend membersOnly event')
						res.sendStatus(204)
					})

				} else {
					console.log('Event is membersOnly')
					res.sendStatus(403)
				}
			} else {
				Event.findByIdAndUpdate(eventId, { $addToSet: { promisers: {user: req.user._id, attended: false} } }).then(() => {
					console.log('Promised to attend event')
					res.sendStatus(204)
				})	
			}
		} else {
			console.log("can't promise cuz, event is closed or seat limit exceeded!")
			res.sendStatus(304)
		}
	}).catch(next)
})


// Update attendance
router.put('/:clubId/events/:eventId/attendance', User.canManage, async (req, res, next) => {

	let {clubId, eventId} = req.params

	let updatedUsers = (req.body.updatedUsers)? req.body.updatedUsers.split(",") : null;
	let updatedAttendance = (req.body.updatedAttendance)? req.body.updatedAttendance.split(",").map((a, i) => (a == 'true') ? true : false) : null;
	console.log(updatedUsers)
	console.log(updatedAttendance)

	try {
		if (updatedUsers && updatedAttendance) {
			// Check if event belongs to this club
			let club = await Club.findOne({ "events": eventId })
			if (!(club && String(club._id) === clubId)) return next(new Error("Event doesn't belong to this club!"))
			
			let event = await Event.findById(eventId)
			let updatePromises = []
			for(let i = 0; i < updatedUsers.length; ++i) {
				// According to [https://stackoverflow.com/questions/15691224/mongoose-update-values-in-array-of-objects]
				updatePromises.push(
					Event.findOneAndUpdate({_id: eventId, 'promisers.user': updatedUsers[i]}, {'$set': {
						'promisers.$.attended': updatedAttendance[i]
					}})
				)
			}
			await Promise.all(updatePromises)
			res.sendStatus(200)
		} else {
			res.status(400).json({errors: ['Invalid attendance update!']})
		}	
	}
	catch(err){next(err)}
})


module.exports = router;
