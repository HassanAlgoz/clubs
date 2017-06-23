const router = require('express').Router()

// Models
const Club = require('../models/club')
const Event = require('../models/event')


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
router.get('/posts/:id', (req, res, next) => res.render('posts'))
router.get('/posts-edit/:id', (req, res, next) => res.render('posts-edit'))
router.get('/posts-new', (req, res, next) => res.render('posts-edit'))


module.exports = router;


// module.exports = function(app) {


// 	// ## Club
// 	app.get('/', function(req, res) {
// 		res.redirect('/clubs');
// 	});



// 	app.get('/clubs', function(req, res) {
// 		let isAdmin = false;
// 		if (req.user) {
// 			isAdmin = req.user.isAdmin;
// 		}
// 		res.render('index', {isAdmin});
// 	});



// 	app.get('/clubs/:clubName', function(req, res) {

// 		var name = req.params.clubName.replace(/\-/g, ' ');

// 		Club.findOne({ name: new RegExp(name, 'i') })
// 		.populate('posts')
// 		.populate('events')
// 		.exec((err, club) => {

// 			if (err) console.log(err);


// 			var userRole = '';
// 			if (club) {
// 				if (req.user) {
// 					userRole = req.user.getRole(club);
// 					console.log("userRole = " + userRole);
// 				}

// 				res.render('club', {club, userRole, clubName: name});
// 			} else {
// 				res.sendStatus(404);
// 			}

			
// 		});

// 	});




// 	app.get('/clubs/:clubName/edit', User.isLoggedIn, function(req, res) {
		
// 		var name = req.params.clubName.replace(/\-/g, ' ');

// 		Club.findOne({ name: new RegExp(name, 'i') }, (err, club) => {
// 			if (err) console.log(err);

// 			var userRole = '';
// 			if (club) {

// 				userRole = req.user.getRole(club);
// 				if (req.user.isPresident(club)) {
// 					res.render('club-edit', {club, clubName:name, userRole});
// 				} else {
// 					res.sendStatus(403);
// 				}

// 			} else {
// 				res.sendStatus(404);
// 			}
// 		});

// 	});



// 	// # Post
// 	app.get('/clubs/:clubName/posts/:id', function(req, res) {

// 		var name = req.params.clubName.replace(/\-/g, ' ');

// 		Club.findOne({ name: name }, (err, club) => {
// 			if (err) console.log('err', err);

// 			var userRole = '';
// 			if (club) {
// 				if (req.user) {
// 					userRole = req.user.getRole(club);
// 				}

// 				Post.findOne({ _id: req.params.id }).exec(function(err, posts) {
// 					if (err) console.log(err);

// 					res.render('posts', {posts, clubName:name, userRole});
// 				});

// 			} else {
// 				res.sendStatus(404);
// 			}

// 		});

		

// 	});



// 	app.get('/clubs/:clubName/posts/:id/edit', User.isLoggedIn, function(req, res) {

// 		var name = req.params.clubName.replace(/\-/g, ' ');

		
// 		Club.findOne({ name: new RegExp(name, 'i') }, (err, club) => {
// 			if (err) console.log(err);

// 			var userRole = "";
// 			if (club) {
// 				if (req.user.canManage(club)) {

// 					if (req.user) {
// 						userRole = req.user.getRole(club);
// 					}

// 					Post.findOne({ _id: req.params.id }).exec(function(err, posts) {
// 						if (err) console.log(err);

// 						res.render('posts-edit', {posts, clubName:name, userRole});

// 					});

// 				} else {
// 					res.sendStatus(403);
// 				}
// 			} else {
// 				res.sendStatus(404);
// 			}

// 		});

// 	});



// 	// # Event
// 	app.get('/clubs/:clubName/events/:id', function(req, res) {
		
// 		var name = req.params.clubName.replace(/\-/g, ' ');

// 		Event.findOne({ _id: req.params.id }).exec(function(err, event) {
// 			if (err) console.log(err);

// 			var counted = false;
// 			if (req.user) {
// 				for(var i=0; i<event.promisers.length; i++) {
// 					if (String(event.promisers[i].user) === String(req.user._id)) {
// 						counted = true;
// 						break;
// 					}
// 				}
// 			}

			
// 			Club.findOne({ name: new RegExp(name, 'i') }, (err, club) => {
// 				if (err) console.log('err', err);

// 				var userRole = '';
// 				if (club) {
// 					if (req.user) {
// 						userRole = req.user.getRole(club);
// 					}
// 				} else {
// 					console.log('club not found');
// 				}
// 				res.render('event', {
// 					event,
// 					counted,
// 					userRole,
// 					clubName:name
// 				});
// 			});
			
// 		});
// 	});



// 	app.get('/clubs/:clubName/events/:id/edit', User.isLoggedIn, function(req, res) {

// 		var name = req.params.clubName.replace(/\-/g, ' ');


// 		Club.findOne({ name: new RegExp(name, 'i') }, (err, club) => {
// 			if (err) console.log(err);

// 			if (req.user.canManage(club)) {

// 				var userRole = "";
// 				if (req.user) {
// 					userRole = req.user.getRole(club);
// 				}

// 				Event.findOne({ _id: req.params.id }).exec(function(err, event) {
// 					if (err) console.log(err);

// 					res.render('event-edit', {event, userRole, clubName:name});

// 				});
// 			} else {
// 				res.sendStatus(403);
// 			}
// 		});
// 	});



// 	app.get('/clubs/:clubName/events/:id/attendance', User.isLoggedIn, function(req, res) {
		
// 		var name = req.params.clubName.replace(/\-/g, ' ');

// 		Event.findOne({ _id: req.params.id })
// 		.populate('promisers.user')
// 		.exec(function(err, event) {
// 			if (err) console.log(err);

// 			var counted = false;
// 			if (req.user) {
// 				for(var i=0; i<event.promisers.length; i++) {
// 					if (String(event.promisers[i].user) === String(req.user._id)) {
// 						counted = true;
// 						break;
// 					}
// 				}
// 			}

			
// 			Club.findOne({ name: new RegExp(name, 'i') }, (err, club) => {
// 				if (err) console.log('err', err);

// 				var userRole = '';
// 				if (club && req.user.canManage(club)) {
// 					if (req.user) {
// 						userRole = req.user.getRole(club);
// 					}
// 				} else {
// 					if (!club) {
// 						console.log('club not found');
// 						res.sendStatus(404);
// 					} else {
// 						res.sendStatus(403);
// 					}
					
// 				}
// 				res.render('event-attendance', {
// 					event,
// 					userRole,
// 					clubName:name
// 				});
// 			});
			
// 		});
// 	});
	


// };

