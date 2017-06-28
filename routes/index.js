const router = require('express').Router()

// Models
const Club = require('../models/club')
const Event = require('../models/event')
const Post = require('../models/post')
const User = require('../models/user')

// Attach 'role' in this club to the 'req.user' object
router.param('clubId', User.getRoleFromParam)
router.use(User.getRoleFromQuery)

// Homepage ================================================================
router.get('/', (req, res, next) => res.render('index'))


// Club ====================================================================
router.get('/club/:clubId', (req, res, next) => {
    let clubId = req.params.clubId;
	Club.findById(clubId)
		.populate('events', 'title date time location condition membersOnly')
		.populate('posts', 'title publishDate')
		.then((club) => {
		res.render('club', {club})
	}).catch(next)
})
router.get('/club/:clubId/edit', (req, res, next) => {
    let clubId = req.params.clubId;
	Club.findById(clubId).then((club) => {
		res.render('club-edit', {club})
	}).catch(next)
})
router.get('/club-new', (req, res, next) => {
    res.render('club-new')
})


// Event ===================================================================
router.get('/club/:clubId/event/:eventId', (req, res, next) => {
    let eventId = req.params.eventId;
	Event.findById(eventId).then((event) => {
		res.render('event', {event})
	}).catch(next)
})
router.get('/club/:clubId/event/:eventId/edit', (req, res, next) => {
    let eventId = req.params.eventId;
	Event.findById(eventId).then((event) => {
		res.render('event-edit', {event})
	}).catch(next)
})
router.get('/club/:clubId/event-new', (req, res, next) => {
    res.render('event-edit', {event:null})
})
router.get('/club/:clubId/event/:eventId/attendance', (req, res, next) => {
    let eventId = req.params.eventId;
	Event.findById(eventId)
		.populate('promisers.user', '_id username enrollment major')
		.then((event) => {
		res.render('event-attendance', {event})
	}).catch(next)
})


// Post ====================================================================
router.get('/club/:clubId/post/:postId', (req, res, next) => {
    let postId = req.params.postId;
	Post.findById(postId).then((post) => {
		res.render('post', {post})
	}).catch(next)
})
router.get('/club/:clubId/post/:postId/edit', (req, res, next) => {
    let postId = req.params.postId;
	Post.findById(postId).then((post) => {
		res.render('post-edit', {post})
	}).catch(next)
})
router.get('/club/:clubId/post-new', (req, res, next) => {
    res.render('post-edit', {post:null})
})

// Profile ====================================================================
router.get('/profile', (req, res, next) => {
	User.findById(req.user._id)
		.populate('memberships.club')
		.then((user) => res.render('profile', {
		profile: {
			username: user.username,
			email: user.email,
			major: user.major,
			enrollment: user.enrollment,
			memberships: user.memberships
		}
	})).catch(next)
})

router.get('/profile/:id', (req, res, next) => {
	User.findById(req.params.id)
		.populate('memberships.club')
		.then((user) => res.render('profile', {
		profile: {
			username: user.username,
			major: user.major,
			enrollment: user.enrollment,
			memberships: user.memberships
		}
	})).catch(next)
})

// Management Panels =========================================================
// President
router.get('/club/:clubId/manage/users', User.isPresident, (req, res, next) => {
	res.render('manage-users')
})

router.get('/club/:clubId/edit', User.isPresident, (req, res, next) => {
	res.render('club-edit')
})

// Manager
router.get('/club/:clubId/manage/events', User.canManage, (req, res, next) => {
	res.render('manage-events')
})

router.get('/club/:clubId/manage/posts', User.canManage, (req, res, next) => {
	res.render('manage-posts')
})



// Admin Panels
router.get('/admin/clubs', User.isAdmin, (req, res, next) => {
	res.render('admin-clubs')
})

router.get('/admin/club-new', User.isAdmin, (req, res, next) => {
	res.render('club-new')
})

module.exports = router;