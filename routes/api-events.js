const router = require('express').Router();

// Models
const Event = require('../models/event');
const User = require('../models/user');
const Club = require('../models/club')

// GET
router.get('/:eventId', (req, res, next) => {

	let eventId = req.params.eventId;
	Event.findById(eventId).then((event) => {
		res.json({event})
	}).catch(next)

});


// GET ALL
router.get('/', (req, res, next) => {
	
	if (req.clubId) {
		// Get ALL Members of some Club
		Club.findById(req.clubId)
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
router.post('/', User.canManage, (req, res, next) => {

	Promise.all[new Event({
		title: req.body.title,
		brief: req.body.brief,
		lastEditDate: Date.now,
		lastEditBy: req.user._id,
		time: req.body.time,
		location: req.body.location,
		date: req.body.date,
		membersOnly: (req.body.membersOnly == 'true') ? true : false,
		sentAsEmail: (req.body.sentAsEmail == 'true') ? true : false
	}).save(),
	Club.findById(req.clubId)
	]
	.then(([event, club]) => {
		club.events.push(event._id)
		return club.save()
	}).then(() => {
		res.sendStatus(201) // Created new resource
	})
	.catch(next)

});


// PUT
router.put('/:eventId', User.canManage, (req, res, next) => {
	let eventId = req.params.eventId
	console.log(req.body)
	Event.findByIdAndUpdate(eventId, {
		title: req.body.title,
		brief: req.body.brief,
		lastEditDate: Date.now,
		lastEditBy: req.user._id,
		time: req.body.time,
		location: req.body.location,
		date: req.body.date,
		membersOnly: (req.body.membersOnly == 'true') ? true : false,
		sentAsEmail: (req.body.sentAsEmail == 'true') ? true : false
	}).then(() => {
		res.sendStatus(204) // Successful and no content returned.
	}).catch(next)
});


// DELETE
router.delete('/:eventId', User.canManage, (req, res, next) => {


	let eventId = req.params.eventId
	Promise.all([
		Event.findByIdAndRemove(eventId),
		Club.findOneAndUpdate({ events: eventId }, {$pull: { events: eventId }})
		// Using Pull [https://docs.mongodb.com/manual/reference/operator/update/pull/]
	]).then(([event, club]) => {
		res.sendStatus(204) // Successful and no content returned.
	}).catch(next)

})


// Close an event
router.post('/:eventId/close', User.canManage, (req, res, next) => {
	
	let eventId = req.params.eventId
	Event.findByIdAndUpdate(eventId, {condition: 'closed'})
	.then(() => res.sendStatus(204)).catch(next)

})


// Open an event
router.post('/events/:eventId/open', User.canManage, (req, res, next) => {
	
	let eventId = req.params.eventId
	Event.findByIdAndUpdate(eventId, {condition: 'open'})
	.then(() => res.sendStatus(204)).catch(next)

})


// Promise to attend
router.post('/:eventId/promise', (req, res, next) => {
	let eventId = req.params.eventId

	Event.findById(eventId).then((event) => {
		if (event.condition === 'open') {
			if (event.membersOnly === true) {
				if (req.user.role === 'member' || req.user.role === 'manager' || req.user.role === 'president') {
					event.update({$addToSet: { "event.promisers": {user: req.user._id, attended: false} } }).then(() => {
						console.log('Promised to attend membersOnly event')
						res.sendStatus(204)
					})				
				} else {
					console.log('Event is membersOnly')
					res.sendStatus(403)
				}
			} else {
				event.update({$addToSet: { promisers: {user: req.user._id, attended: false} } }).then(() => {
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

	let updatedUsers = req.body.updatedUsers.split(",");
	let updatedAttendance = req.body.updatedAttendance.split(",").map((a, i) => (a == 'true') ? true : false);
	console.log(updatedUsers)
	console.log(updatedAttendance)

	if (updatedUsers && updatedAttendance) {
		
		Event.findById(eventId).then((event) => {
			let updatePromises = []
			for(let i = 0; i < updatePromises.length; ++i) {
				// According to [https://stackoverflow.com/questions/15691224/mongoose-update-values-in-array-of-objects]
				updatePromises.push(event.update({'promisers.user': updatedUsers[i]}, {'$set': {
					'promisers.$.attended': updatedAttendance[i]
				}}))
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
