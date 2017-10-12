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
router.get('/clubs/:clubId', (req, res, next) => {
    let clubId = req.params.clubId;
	Club.findById(clubId)
		.populate('events', 'title date time location condition membersOnly image')
		.populate('posts', 'title publishDate')
		.then((club) => {
		res.render('club', {club})
	}).catch(next)
})
router.get('/clubs/:clubId/edit', User.isPresident, (req, res, next) => {
    let clubId = req.params.clubId;
	Club.findById(clubId).then((club) => {
		res.render('club-edit', {club})
	}).catch(next)
})
router.get('/club-new', (req, res, next) => {
    res.render('club-new')
})


// Event ===================================================================
router.get('/clubs/:clubId/events/:eventId', async (req, res, next) => {
	try {
		let {eventId} = req.params;
		let event = await Event.findById(eventId).exec()
		res.render('event', {event})
	}
	catch(err){next(err)}
})
router.get('/clubs/:clubId/events/:eventId/edit', User.canManage, async (req, res, next) => {
    try {
		let {clubId, eventId} = req.params;
		let [club, event] = await Promise.all([
			Club.findById(clubId).populate('members', 'username').exec(),
			Event.findById(eventId).exec()
		])
		res.render('event-edit', {event: event, members: club.members})
	}
	catch(err){next(err)}
})
router.get('/clubs/:clubId/event-new', User.canManage, async (req, res, next) => {
	let {clubId} = req.params;
	let club = await Club.findById(clubId).populate('members', 'username').exec()
    res.render('event-edit', {event:null, members: club.members})
})
router.get('/clubs/:clubId/events/:eventId/attendance', User.canManage, (req, res, next) => {
    let eventId = req.params.eventId;
	Event.findById(eventId)
		.populate('promisers.user', '_id username major enrollment')
		.then((event) => {
		res.render('event-attendance', {event})
	}).catch(next)
})


// Post ====================================================================
router.get('/clubs/:clubId/posts/:postId', (req, res, next) => {
    let postId = req.params.postId;
	Post.findById(postId).then((post) => {
		res.render('post', {post})
	}).catch(next)
})
router.get('/clubs/:clubId/posts/:postId/edit', User.canManage, (req, res, next) => {
    let postId = req.params.postId;
	Post.findById(postId).then((post) => {
		res.render('post-edit', {post})
	}).catch(next)
})
router.get('/clubs/:clubId/post-new', User.canManage, (req, res, next) => {
    res.render('post-edit', {post:null})
})

// Profile ====================================================================
router.get('/profile', [User.isLoggedIn, User.isConfirmed], (req, res, next) => {
	User.findById(req.user._id)
		.populate('memberships.club')
		.then((user) => res.render('profile', {
		profile: {
			username: user.username,
			email: user.email,
			major: user.major,
			enrollment: user.enrollment,
			memberships: user.memberships,
			KFUPMID: user.KFUPMID
		}
	})).catch(next)
})

router.get('/profile-edit', [User.isLoggedIn, User.isConfirmed], (req, res, next) => {
	User.findById(req.user._id)
		.populate('memberships.club')
		.then((user) => res.render('profile-edit', {
		profile: {
			_id: user._id,
			username: user.username,
			email: user.email,
			major: user.major,
			enrollment: user.enrollment,
			KFUPMID: user.KFUPMID
		}
	})).catch(next)
})

router.get('/profile/:id', [User.isLoggedIn, User.isConfirmed], (req, res, next) => {
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
router.get('/clubs/:clubId/manage/users', User.isPresident, (req, res, next) => {
	res.render('manage-users')
})

router.get('/clubs/:clubId/edit', User.isPresident, (req, res, next) => {
	res.render('club-edit')
})

// Manager
router.get('/clubs/:clubId/manage/events', User.canManage, (req, res, next) => {
	res.render('manage-events')
})

router.get('/clubs/:clubId/manage/posts', User.canManage, (req, res, next) => {
	res.render('manage-posts')
})



// Admin Panels
router.get('/admin/clubs', User.isAdmin, (req, res, next) => {
	res.render('manage-clubs')
})

router.get('/admin/club-new', User.isAdmin, (req, res, next) => {
	res.render('club-new')
})

module.exports = router;