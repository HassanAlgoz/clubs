var Club = require('../models/club');
var News = require('../models/news');
var Event = require('../models/event');
var User = require('../models/user');

module.exports = function(app) {
	
	app.get('/clubs/:clubName/email', User.isLoggedIn, function(req, res) {
		
		var name = req.params.clubName.replace(/\-/g, ' ');

		Club.findOne({ name: new RegExp(name, 'i') }, function(err, club) {
			
			if (err) console.log(err);

			if (club && req.user.canManage(club)) {
				var userRole = req.user.getRole(club);
				res.render('email', {
					userRole,
					clubName: name
				});
			}
		
		});
		
	});

	
	app.get('/clubs/:clubName/manage/users', User.isLoggedIn, (req, res) => {

		var name = req.params.clubName.replace(/\-/g, ' ');

		Club.findOne({ name: new RegExp(name, 'i') }, function(err, club) {
			
			if (err) console.log(err);
			
			if (club && req.user.isPresident(club)) {
				var userRole = req.user.getRole(club);
				res.render('manage-users', {
					clubName: name,
					userRole
				});
			} else {
				res.sendStatus(403);
			}
		
		});
		
	});



	app.get('/clubs/:clubName/manage/news', User.isLoggedIn, (req, res) => {
		
		var name = req.params.clubName.replace(/\-/g, ' ');

		Club.findOne({ name: new RegExp(name, 'i') })
		.populate('news')
		.exec(function(err, club) {

			if (err) console.log(err);

			if (club && req.user.canManage(club)) {

				var userRole = req.user.getRole(club);
				res.render('manage-news', {
					news: club.news,
					clubName: club.name,
					userRole
				});

			} else {
				res.sendStatus(403);
			}

		});

	});




	app.get('/clubs/:clubName/manage/events', User.isLoggedIn, (req, res) => {
		
		var name = req.params.clubName.replace(/\-/g, ' ');

		Club.findOne({ name: new RegExp(name, 'i') })
		.populate('events')
		.exec(function(err, club) {

			if (err) console.log(err);

			if (club && req.user.canManage(club)) {

				var userRole = req.user.getRole(club);
				res.render('manage-events', {
					events: club.events,
					clubName: club.name,
					userRole
				});

			} else {
				res.sendStatus(403);
			}

		});

	});


	app.get('/clubs/create/club', [User.isLoggedIn, User.canAdmin], (req, res) => {
		res.render('club-create', {userRole:''});
	});
};
