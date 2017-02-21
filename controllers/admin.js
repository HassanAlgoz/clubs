var Club = require('../models/club');
var News = require('../models/news');
var Event = require('../models/event');
var User = require('../models/user');

module.exports = function(app) {
	
	app.get('/clubs/:clubName/email', User.isLoggedIn, function(req, res) {
		
		var name = req.params.clubName.replace(/\-/g, ' ');

		Club.findOne({ name: new RegExp(name, 'i') }, function(err, club) {
			
			if (err) console.log(err);

			if (club && req.user.canManage(res, club._id)) {
				var userRole = req.user.getRole(club._id);
				res.render('email', {userRole, clubName:name});
			}
		
		});
		
	});



	app.get('/clubs/:clubName/admin/users', User.isLoggedIn, (req, res) => {

		var name = req.params.clubName.replace(/\-/g, ' ');

		Club.findOne({ name: new RegExp(name, 'i') }, function(err, club) {
			
			if (err) console.log(err);
			
			if (club && req.user.canAdmin(res, club._id)) {
				var userRole = req.user.getRole(club._id);
				res.render('admin-users', {clubName:name, userRole});
			} else {
				res.SendStatus(404);
			}
		
		});
		
	});



	app.get('/clubs/:clubName/admin/news', User.isLoggedIn, (req, res) => {
		
		var name = req.params.clubName.replace(/\-/g, ' ');

		Club.findOne({ name: new RegExp(name, 'i') }).populate('news').exec(function(err, club) {

			if (err) console.log(err);

			if (club && req.user.canManage(res, club._id)) {

				var userRole = req.user.getRole(club._id);
				res.render('admin-news', {news: club.news, clubName: club.name, userRole});

			} else {
				res.sendStatus(404);
			}

		});

	});




	app.get('/clubs/:clubName/admin/events', User.isLoggedIn, (req, res) => {
		
		var name = req.params.clubName.replace(/\-/g, ' ');

		Club.findOne({ name: new RegExp(name, 'i') }).populate('events').exec(function(err, club) {

			if (err) console.log(err);

			if (club && req.user.canManage(res, club._id)) {

				var userRole = req.user.getRole(club._id);
				res.render('admin-events', {events: club.events, clubName: club.name, userRole});

			} else {
				res.sendStatus(404);
			}

		});

	});



};
