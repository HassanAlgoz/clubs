const router = require('express').Router()

// Models
const Club = require('../models/club')
const Event = require('../models/event')
const Post = require('../models/post')
const User = require('../models/user')


// Homepage ================================================================
router.get('/', (req, res, next) => res.render('index'))


// Club ====================================================================
router.get('/club/:clubId', (req, res, next) => {
    let clubId = req.params.clubId;
	Club.findById(clubId).then((club) => {
		res.render('club', {club})
	}).catch(next)
})
router.get('/club-edit/:clubId', (req, res, next) => {
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
router.get('/club/:clubId/event-edit/:eventId', (req, res, next) => {
    let eventId = req.params.eventId;
	Event.findById(eventId).then((event) => {
		res.render('event-edit', {event})
	}).catch(next)
})
router.get('/club/:clubId/event-new', (req, res, next) => {
    res.render('event-edit', {event:null})
})


// Post ====================================================================
router.get('/club/:clubId/post/:postId', (req, res, next) => {
    let postId = req.params.postId;
	Post.findById(postId).then((post) => {
		res.render('post', {post})
	}).catch(next)
})
router.get('/club/:clubId/post-edit/:postId', (req, res, next) => {
    let postId = req.params.postId;
	Post.findById(postId).then((post) => {
		res.render('post-edit', {post})
	}).catch(next)
})
router.get('/club/:clubId/post-new', (req, res, next) => {
    res.render('post-edit', {post:null})
})


// Management Panels =========================================================
router.get('/clubs/:clubId/manage/users', User.isPresident, (req, res, next) => {
	res.render('manage-users')
})

router.get('/clubs/:clubId/manage/events', User.isPresident, (req, res, next) => {
	res.render('manage-events')
})

router.get('/clubs/:clubId/manage/posts', User.isPresident, (req, res, next) => {
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