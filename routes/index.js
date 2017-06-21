const router = require('express').Router()


// Homepage
router.get('/', (req, res, next) => res.render('index'))
// Club 
router.get('/club/:id', (req, res, next) => res.render('club'))
router.get('/club-edit/:id', (req, res, next) => res.render('club-edit'))
router.get('/club-new', (req, res, next) => res.render('club-edit'))
// Event
router.get('/event/:id', (req, res, next) => res.render('event'))
router.get('/event-edit/:id', (req, res, next) => res.render('event-edit'))
router.get('/event-new', (req, res, next) => res.render('event-edit'))
// News 
router.get('/news/:id', (req, res, next) => res.render('news'))
router.get('/news-edit/:id', (req, res, next) => res.render('news-edit'))
router.get('/news-new', (req, res, next) => res.render('news-edit'))


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
// 		.populate('news')
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



// 	// # News
// 	app.get('/clubs/:clubName/news/:id', function(req, res) {

// 		var name = req.params.clubName.replace(/\-/g, ' ');

// 		Club.findOne({ name: name }, (err, club) => {
// 			if (err) console.log('err', err);

// 			var userRole = '';
// 			if (club) {
// 				if (req.user) {
// 					userRole = req.user.getRole(club);
// 				}

// 				News.findOne({ _id: req.params.id }).exec(function(err, news) {
// 					if (err) console.log(err);

// 					res.render('news', {news, clubName:name, userRole});
// 				});

// 			} else {
// 				res.sendStatus(404);
// 			}

// 		});

		

// 	});



// 	app.get('/clubs/:clubName/news/:id/edit', User.isLoggedIn, function(req, res) {

// 		var name = req.params.clubName.replace(/\-/g, ' ');

		
// 		Club.findOne({ name: new RegExp(name, 'i') }, (err, club) => {
// 			if (err) console.log(err);

// 			var userRole = "";
// 			if (club) {
// 				if (req.user.canManage(club)) {

// 					if (req.user) {
// 						userRole = req.user.getRole(club);
// 					}

// 					News.findOne({ _id: req.params.id }).exec(function(err, news) {
// 						if (err) console.log(err);

// 						res.render('news-edit', {news, clubName:name, userRole});

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
