const router = require('express').Router();
// util
const utils = require('../utils.js')
// Models
const Event = require('../models/event');
const User = require('../models/user');
const Club = require('../models/club')


// Attach 'role' in this club to the 'req.user' object
router.use(User.getRoleFromQuery)

// GET
router.get('/:eventId', (req, res, next) => {

	let eventId = req.params.eventId;
	Event.findById(eventId).then((event) => {
		res.json({event})
	}).catch(next)

});


// GET ALL
router.get('/', (req, res, next) => {
	
	if (req.query.clubId) {
		// Get ALL Members of some Club
		Club.findById(req.query.clubId)
			.populate('events')
			.then((club) => {
			res.json({events: club.events})
		}).catch(next)
	} else {
		return Promise.all([
			Event.find({})
				.sort({date: -1}),
			Event.count()
		]).then(([events, count]) => {
			res.json({events, count})
		}).catch(next)
	}

});


// POST
router.post('/', User.canManage, async (req, res, next) => {
	let {clubId} = req.query

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
			organizers: req.body.organizers
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
router.put('/:eventId', User.canManage, async (req, res, next) => {
	let {eventId} = req.params
	let {clubId} = req.query

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
			organizers: req.body.organizers
		}).exec()
		res.json(event)
		return;
	}
	catch(err){next(err)}
});


// DELETE
router.delete('/:eventId', User.canManage, (req, res, next) => {

	let eventId = req.params.eventId
	let clubId = req.query.clubId

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
router.put('/:eventId/close', User.canManage, (req, res, next) => {
	
	let eventId = req.params.eventId
	let clubId = req.query.clubId

	// Check if event belongs to this club
	Club.findOne({ "events": eventId }).then((club) => {
		if (!(club && String(club._id) === clubId)) return next(new Error("Event doesn't belong to this club!"))
		
		return Event.findByIdAndUpdate(eventId, {condition: 'closed'})

	})
	.then(() => res.sendStatus(204))
	.catch(next)

})


// Open an event
router.put('/:eventId/open', User.canManage, (req, res, next) => {
	
	let eventId = req.params.eventId
	let clubId = req.query.clubId

	// Check if event belongs to this club
	Club.findOne({ "events": eventId }).then((club) => {
		if (!(club && String(club._id) === clubId)) return next(new Error("Event doesn't belong to this club!"))

		return Event.findByIdAndUpdate(eventId, {condition: 'open'})
	})
	.then(() => res.sendStatus(204))
	.catch(next)

})


// Promise to attend
router.put('/:eventId/promise', (req, res, next) => {
	let eventId = req.params.eventId
	let clubId = req.query.clubId

	// Check if event belongs to this club
	Club.findOne({ "events": eventId }).then((club) => {
		if (!(club && String(club._id) === clubId)) return next(new Error("Event doesn't belong to this club!"))

		return Event.findById(eventId)

	})
	.then((event) => {
		if (event.condition === 'open') {
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
			console.log("can't promise cuz, event is closed!")
			res.sendStatus(304)
		}
	}).catch(next)
})


// Update attendance
router.put('/:eventId/attendance', User.canManage, (req, res, next) => {

	let eventId = req.params.eventId
	let clubId = req.query.clubId

	let updatedUsers = req.body.updatedUsers.split(",");
	let updatedAttendance = req.body.updatedAttendance.split(",").map((a, i) => (a == 'true') ? true : false);
	console.log(updatedUsers)
	console.log(updatedAttendance)

	if (updatedUsers && updatedAttendance) {

		// Check if event belongs to this club
		Club.findOne({ "events": eventId }).then((club) => {
			if (!(club && String(club._id) === clubId)) return next(new Error("Event doesn't belong to this club!"))
			
			return Event.findById(eventId)
		})
		.then((event) => {
			let updatePromises = []
			for(let i = 0; i < updatedUsers.length; ++i) {
				// According to [https://stackoverflow.com/questions/15691224/mongoose-update-values-in-array-of-objects]
				updatePromises.push(
					Event.findOneAndUpdate({_id: eventId, 'promisers.user': updatedUsers[i]}, {'$set': {
						'promisers.$.attended': updatedAttendance[i]
					}})
				)
			}
			return Promise.all(updatePromises)
		})
		.then(() => {
			console.log('updated attendance')
			res.sendStatus(204)
		})
	} else {
		console.log('invalid attendance update!')
		res.sendStatus(304)
	}
})


module.exports = router;
