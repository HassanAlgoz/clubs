const Event = require('../models/event');
const router = require('express').Router();

// GET
router.get('/events/:id', (req, res, next) => {

	let eventId = req.params.id;
	Event.findById(eventId).then((event) => {
		res.json({event})
	}).catch(next)

});


// GET ALL
router.get('/events', (req, res, next) => {

	return Promise.all([
		Event.find({})
			.sort({date: -1}),
		Event.count()
	]).then(([events, count]) => {
		res.json({events, count})
	}).catch(next)

});


// POST
router.post('/events', (req, res, next) => {

	new Event(req.body).save().then((event) => {
		res.sendStatus(201) // Created new resource
	}).catch(next)

});


// PUT
router.put('/events/:id', (req, res, next) => {
	let eventId = req.params.id
	console.log(req.body)
	Event.findByIdAndUpdate(eventId, req.body).then(() => {
		res.sendStatus(204) // Successful and no content returned.
	}).catch(next)
});


// DELETE
router.delete('/events/:id', (req, res, next) => {

	let eventId = req.params.id
	Event.findByIdAndRemove(eventId).then(() => {
		res.sendStatus(204) // Successful and no content returned.
	}).catch(next)

});


module.exports = router;
