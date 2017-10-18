const router = require('express').Router();
// util
const utils = require('../utils.js')
const moment = require('moment')
// Models
const Event = require('../models/event');
const Post = require('../models/post');
const User = require('../models/user');

// Attach 'role' in this club to the 'req.user' object
router.param('clubId', User.getRoleFromParam)
router.use(User.getRoleFromQuery)

// GET ALL events
router.get('/events', async (req, res, next) => {
	// Offset & Limit
	let offset = parseInt(req.query.offset) || 0;
	let limit  = parseInt(req.query.limit)  || 0;
	try {
        // Date range
        let startDate = (req.query.startDate)? new Date(req.query.startDate) : null;
        let endDate   = (req.query.endDate)?   new Date(req.query.endDate)   : null;

		let dbQuery = Event.find({})
		if (startDate) {
			dbQuery.where("date").gte(startDate)
		}
		if (endDate) {
			dbQuery.where("date").lte(endDate)
		}
		dbQuery.sort({date: -1}).populate({path: "organizers", select: "username"})
		let events = await dbQuery.skip(offset).limit(limit).exec()
		
		res.json({events})
	}catch(err){next(err)}
})

// GET ALL posts
router.get('/posts', async (req, res, next) => {
    // Offset & Limit
	let offset = parseInt(req.query.offset) || 0;
	let limit  = parseInt(req.query.limit)  || 0;
	try {
        // Date range
        let startDate = (req.query.startDate)? new Date(req.query.startDate) : null;
        let endDate   = (req.query.endDate)?   new Date(req.query.endDate)   : null;
        
		let dbQuery = Post.find({})
		if (startDate) {
			dbQuery.where("publishDate").gte(startDate)
		}
		if (endDate) {
			dbQuery.where("publishDate").lte(endDate)
		}
		dbQuery.sort({date: -1}).populate({path: "lastEditBy", select: "username"})
		let posts = await dbQuery.skip(offset).limit(limit).exec()
		
		res.json({posts})
	}catch(err){next(err)}
})


module.exports = router;
