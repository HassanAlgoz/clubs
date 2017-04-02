var moment = require('moment');

// Models
var Club = require('../models/club');
var News = require('../models/news');
var Event = require('../models/event');
var User = require('../models/user');

module.exports = function(app) {


	// ## Club
	app.get('/', function(req, res) {
		res.redirect('/clubs');
	});



	app.get('/clubs', function(req, res) {
		res.render('index');
	});



	app.get('/clubs/:clubName', function(req, res) {

		var name = req.params.clubName.replace(/\-/g, ' ');

		Club.findOne({ name: new RegExp(name, 'i') })
		.populate('news')
		.populate('events')
		.exec((err, club) => {

			if (err) console.log(err);


			var userRole = '';
			if (club) {
				if (req.user) {
					userRole = req.user.getRole(club);
					console.log("userRole = " + userRole);
				}

				res.render('club', {club, userRole, clubName: name});
			} else {
				res.sendStatus(404);
			}

			
		});

	});




	app.get('/clubs/:clubName/edit', User.isLoggedIn, function(req, res) {
		
		var name = req.params.clubName.replace(/\-/g, ' ');

		Club.findOne({ name: new RegExp(name, 'i') }, (err, club) => {
			if (err) console.log(err);

			var userRole = '';
			if (club) {

				userRole = req.user.getRole(club);
				if (req.user.isPresident(club)) {
					res.render('club-edit', {club, clubName:name, userRole});
				} else {
					res.sendStatus(403);
				}

			} else {
				res.render('club-edit', {club, clubName:"", userRole:"admin"});
			}
		});

	});



	// # News
	app.get('/clubs/:clubName/news/:id', function(req, res) {

		var name = req.params.clubName.replace(/\-/g, ' ');

		Club.findOne({ name: name }, (err, club) => {
			if (err) console.log('err', err);

			var userRole = '';
			if (club) {
				if (req.user) {
					userRole = req.user.getRole(club);
				}

				News.findOne({ _id: req.params.id }).exec(function(err, news) {
					if (err) console.log(err);

					res.render('news', {news, clubName:name, userRole});
				});

			} else {
				res.sendStatus(404);
			}

		});

		

	});



	app.get('/clubs/:clubName/news/:id/edit', User.isLoggedIn, function(req, res) {

		var name = req.params.clubName.replace(/\-/g, ' ');

		
		Club.findOne({ name: new RegExp(name, 'i') }, (err, club) => {
			if (err) console.log(err);

			var userRole = "";
			if (club) {
				if (req.user.canManage(club)) {

					if (req.user) {
						userRole = req.user.getRole(club);
					}

					News.findOne({ _id: req.params.id }).exec(function(err, news) {
						if (err) console.log(err);

						res.render('news-edit', {news, clubName:name, userRole});

					});

				} else {
					res.sendStatus(403);
				}
			} else {
				res.sendStatus(404);
			}

		});

	});



	// # Event
	app.get('/clubs/:clubName/events/:id', function(req, res) {
		
		var name = req.params.clubName.replace(/\-/g, ' ');

		Event.findOne({ _id: req.params.id }).exec(function(err, event) {
			if (err) console.log(err);

			var counted = false;
			if (req.user) {
				for(var i=0; i<event.promisers.length; i++) {
					if (String(event.promisers[i]) === String(req.user._id)) {
						counted = true;
						break;
					}
				}
			}

			
			Club.findOne({ name: new RegExp(name, 'i') }, (err, club) => {
				if (err) console.log('err', err);

				var userRole = '';
				if (club) {
					if (req.user) {
						userRole = req.user.getRole(club);
					}
				} else {
					console.log('club not found');
				}
				res.render('event', {event, counted, userRole, clubName:name});
			});
			
		});
	});



	app.get('/clubs/:clubName/events/:id/edit', User.isLoggedIn, function(req, res) {

		var name = req.params.clubName.replace(/\-/g, ' ');


		Club.findOne({ name: new RegExp(name, 'i') }, (err, club) => {
			if (err) console.log(err);

			if (req.user.canManage(club)) {

				var userRole = "";
				if (req.user) {
					userRole = req.user.getRole(club);
				}

				Event.findOne({ _id: req.params.id }).exec(function(err, event) {
					if (err) console.log(err);

					res.render('event-edit', {event, userRole, clubName:name});

				});
			} else {
				res.sendStatus(403);
			}
		});
	});
	


};
