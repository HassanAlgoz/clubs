// Models
var Club = require('../models/club');
var User = require('../models/user');
var News = require('../models/news');
var Event = require('../models/event');


module.exports = function (app) {

	// --- Clubs API --- \\
	// Get all clubs
	app.get('/api/clubs', function (req, res) {

		Club.find({})
			.sort({ date: -1 })
			.exec(function (err, clubs) {
				if (clubs)
					res.json(clubs);
				else
					res.json({ message: 'error finding clubs' });
			});

	});



	// Get a single club
	app.get('/api/clubs/:clubName', function (req, res) {

		var name = req.params.clubName.replace(/\-/g, ' ');

		Club.findOne({ name: new RegExp(name, 'i') }, function (err, club) {
			if (err) console.error(err);

			if (club) {
				res.json(club);
			} else {
				res.sendStatus(404);
			}

		});

	});


	// Create a club
	app.post('/api/clubs', [User.isLoggedIn, User.canAdmin], function (req, res) {

		console.log(req.body);

		var club = new Club({
			name: req.body.name,
			description: req.body.description,
			logo: req.body.logo,
			members: []
		});

		User.findOne({ _id: req.body.clubPresidentId }, function (err, user) {

			if (err) {
				console.log(err);
				res.json({ error: true, message: "user not found" });
			}

			club.members.push(user);

			club.save(function (err, club) {
				if (err) console.log(err);
				user.memberships.push({
					club: club,
					role: "president",
				});
				user.save(function (err, user) {
					if (err) console.log(err);
					console.log('club created correctly!');
					res.json(club);
				});
			});
		})

	});


	// Modify a club
	app.put('/api/clubs/:clubName', User.isLoggedIn, function (req, res) {

		var name = req.params.clubName.replace(/\-/g, ' ');

		Club.findOne({ name: new RegExp(name, 'i') }, function (err, club) {
			if (err) console.log(err);

			if (club) {
				if (req.user.isPresident(club)) {
					club.name = req.body.name;
					club.description = req.body.description;
					club.logo = req.body.logo;
					console.log('sucessfully updated', club);
					club.save(function (err, club) {
						if (err) console.log(err);
						res.json({ message: 'successfully updated', club });
					});
				} else {
					res.sendStatus(403)
				}
			} else {
				res.json({error: true, message: 'could not modify club' });
			}


		});

	});


	// Delete a club
	app.delete('/api/clubs/:clubName', [User.isLoggedIn, User.canAdmin], function (req, res) {

		console.log('req.body', req.body);
		var name = req.params.clubName.replace(/\-/g, ' ');

		Club.findOne({ name: new RegExp(name, 'i') }).remove(function (err, data) {
			if (err) console.log(err);
			if (data) {
				res.json({ message: 'successfully deleted club' });
			} else {
				res.sendStatus(404);
			}
		});

	});


	// --- Users API --- \\

	// Add membership of a club to a user
	// Also add user to club
	app.get('/api/clubs/:clubName/users/join', function (req, res) {

		if (!req.user)
			return res.sendStatus(401);

		var name = req.params.clubName.replace(/\-/g, ' ');

		Club.findOne({ name: new RegExp(name, 'i') }, function (err, club) {

			if (err) console.log(err);
			if (club) {
				// check if user has no membership in this club
				let alreadyAMember = false;
				for(let i=0; i<req.user.memberships.length; i++) {
					if (req.user.memberships[i].club === club) {
						alreadyAMember = true;
						break;
					}
				}

				if (alreadyAMember) {
					club.members.push(req.user);
					req.user.memberships.push({
						club: club
					});

					req.user.save(function (err, user) {
						if (err) console.log(err);
						club.save(function (err, club) {
							if (err) console.log(err);
							res.sendStatus(201);
						});
					});
				} else {
					console.log("already a member");
					res.sendStatus(200);
				}
			} else {
				res.sendStatus(404);
			}


		});

	});



	// Remove membership of a club from user
	// Also remove user from club
	app.delete('/api/clubs/:clubName/users/:userID/kick', function (req, res) {

		if (!req.user) {
			return res.sendStatus(401);
		}

		var name = req.params.clubName.replace(/\-/g, ' ');

		Club.findOne({ name: new RegExp(name, 'i') }, function (err, club) {

			if (err) console.log(err);

			if (club) {

				User.findOne({ _id: req.params.userID }, function (err, user) {

					if (err) console.log(err);

					if (user) {

						for (var i = 0; i < club.members.length; i++) {
							if (String(club.members[i]) === String(user._id)) {
								club.members.splice(i, 1);
								break;
							}
						}

						var index = user.findMembership(res, club);
						user.memberships.splice(index, 1);

						user.save(function (err, user) {
							if (err) console.log(err);
							club.save(function (err, club) {
								if (err) console.log(err);
								res.sendStatus(201);
							});
						});

					} else {
						console.log('error finding user!');
						res.sendStatus(404);
					}

				});
			} else {
				console.log('error finding club!');
				res.sendStatus(404);
			}

		});

	});


	// Get all users
	app.get('/api/clubs/:clubName/users', function (req, res) {

		var name = req.params.clubName.replace(/\-/g, ' ');

		Club.findOne({ name: new RegExp(name, 'i') }).populate('members').exec(function (err, club) {

			if (err) console.log(err);

			if (club) {

				res.json({ users: club.members, clubID: club });

			} else {
				res.sendStatus(404);
			}

		});

	});

	// Get a single user
	app.get('/api/users/:id', function (req, res) {


		User.findOne({ _id: req.params.id }, function (err, user) {
			if (err) console.error(err);
			if (user) {
				res.json(user);
			} else {
				res.sendStatus(404);
			}
		});

	});

	// Create a user
	app.post('/api/users', function (req, res) {

		console.log(req.body);
		// if (req.body.password === passwd) {
		// var passHash = hash(req.body.password)
		new User({
			name: req.body.name,
			password: req.body.password,
			email: req.body.email,
			role: req.body.role,
			manages: req.body.manages
		}).save(function (err, user) {
			if (err) console.log(err);
			console.log('user created correctly!');
			res.json(user);
		});

		// } else {
		// 	res.sendStatus(403);
		// }

	});


	// Modify a user
	app.put('/api/users/:id', function (req, res) {

		// if (req.body.password === passwd) {

		User.findOne({ _id: req.params.id }, function (err, user) {
			if (err) console.log(err);
			if (user) {
				user.name = req.body.name;
				user.password = req.body.password;
				user.email = req.body.email;
				user.role = req.body.role;
				user.save(function (err, user) {
					if (err) console.log(err);
					res.json({ message: 'successfully updated', user });
				});
			} else {
				res.send('could not modify user');
			}
		});
		// } else {
		// 	res.sendStatus(403);
		// }

	});


	// Delete a user
	app.get('/api/users/:id/delete', function (req, res) {

		console.log('req.body', req.body);

		// if (req.body.password === passwd) {

		User.findOne({ _id: req.params.id }, function (err, user) {
			if (err) console.log(err);
			if (user) {

				res.json({ message: 'successfully deleted user' });
			} else {
				res.sendStatus(404);
			}
		});

		// } else {
		// 	res.sendStatus(403);
		// }

	});

	// --- News API --- \\
	// Get all news
	app.get('/api/news', function (req, res) {

		News.find({}).sort({ date: -1 }).exec(function (err, posts) {
			if (posts)
				res.json(posts);
			else
				res.json({ message: 'error finding posts' });
		});

	});



	// Get a single news
	app.get('/api/news/:id', function (req, res) {

		News.findOne({ _id: req.params.id }, function (err, news) {
			if (err) console.error(err);
			if (news) {
				res.json(news);
			} else {
				res.sendStatus(404);
			}
		});

	});


	// Create a news
	app.post('/api/news', function (req, res) {

		console.log(req.body);
		// if (req.body.password === passwd) {

		new News({
			title: req.body.title,
			body: req.body.body
		}).save(function (err, news) {
			if (err) console.log(err);

			Club.findOne({ name: req.body.clubName }, (err, club) => {
				if (err) console.log(err);
				club.news.push(news._id);
				club.save((err, club) => {
					if (err) console.log(err);
					console.log('news created correctly!');
					res.json(news);
				});

			});


		});

		// } else {
		// 	res.sendStatus(403);
		// }

	});


	// Modify a news
	app.put('/api/news/:id', function (req, res) {

		// if (req.body.password === passwd) {

		News.findOne({ _id: req.params.id }, function (err, news) {
			if (err) console.log(err);
			if (news) {
				news.title = req.body.title;
				news.body = req.body.body;
				news.save(function (err, news) {
					if (err) console.log(err);
					res.json({ message: 'successfully updated', news });
				});
			} else {
				res.send('could not modify news');
			}
		});
		// } else {
		// 	res.sendStatus(403);
		// }

	});


	// Delete a news
	app.delete('/api/news/:id', function (req, res) {

		News.findOne({ _id: req.params.id }, (err, news) => {
			if (err) console.log('err ', err);

			if (news) {

				news.remove((err) => {
					if (err) console.log('err ', err);
					// Remove news from club
					Club.findOne({ news: news._id }, (err, club) => {
						if (club) {
							console.log('club found!');
							for (var i = 0; i < club.news.length; i++) {
								if (String(club.news[i]) === String(news._id)) {
									club.news.splice(i, 1);
									break;
								}
							}
							club.save((err) => {
								if (err) console.log('err', err);
								res.json({ message: 'news deleted successfully' });
							});
						} else {
							console.log('club not found!');
							res.json({ message: 'news deleted successfully' });
						}
					});

				});

			}

		});



	});

	// --- Events API --- \\
	// Get all events
	app.get('/api/events', function (req, res) {

		Event.find({}).sort({ date: -1 }).exec(function (err, events) {
			if (events)
				res.json(events);
			else
				res.json({ message: 'error finding events' });
		});

	});



	// Get a single event
	app.get('/api/events/:id', function (req, res) {

		Event.findOne({ _id: req.params.id }, function (err, event) {
			if (err) console.error(err);
			if (event) {
				res.json(event);
			} else {
				res.sendStatus(404);
			}
		});

	});


	// Create an event
	app.post('/api/events', function (req, res) {

		console.log(req.body);
		// if (req.body.password === passwd) {

		new Event({
			title: req.body.title,
			brief: req.body.brief,
			time: req.body.time,
			location: req.body.location,
			date: req.body.date
		}).save(function (err, event) {
			if (err) console.log(err);

			Club.findOne({ name: req.body.clubName }, (err, club) => {
				if (err) console.log(err);
				club.events.push(event._id);
				club.save((err, club) => {
					if (err) console.log(err);
					console.log('events created correctly!');
					res.json(event);
				});

			});


		});

		// } else {
		// 	res.sendStatus(403);
		// }

	});


	// Modify an event
	app.put('/api/events/:id', function (req, res) {

		// if (req.body.password === passwd) {

		Event.findOne({ _id: req.params.id }, function (err, event) {
			if (err) console.log(err);
			if (event) {
				event.title = req.body.title;
				event.brief = req.body.brief;
				event.time = req.body.time;
				event.location = req.body.location;
				event.date = req.body.date;
				event.save(function (err, event) {
					if (err) console.log(err);
					res.json({ message: 'successfully updated', event });
				});
			} else {
				res.send('could not modify event');
			}
		});
		// } else {
		// 	res.sendStatus(403);
		// }

	});

	// Close an event
	app.get('/api/events/:id/close', function (req, res) {

		console.log('close');

		if (req.user.canManage()) {

			Event.findOne({ _id: req.params.id }, function (err, event) {
				if (err) console.log(err);
				if (event) {
					event.open = false;
					event.save(function (err, event) {
						if (err) console.log(err);
						res.json({ message: 'successfully closed event', event });
					});
				} else {
					res.send('could not close event');
				}
			});

		} else {
			res.sendStatus(403);
		}

	});

	// Open an event
	app.get('/api/events/:id/open', function (req, res) {

		console.log('open');

		if (req.user.canManage()) {

			Event.findOne({ _id: req.params.id }, function (err, event) {
				if (err) console.log(err);
				if (event) {
					event.open = true;
					event.save(function (err, event) {
						if (err) console.log(err);
						res.json({ message: 'successfully opend event', event });
					});
				} else {
					res.send('could not open event');
				}
			});

		} else {
			res.sendStatus(403);
		}

	});


	// Delete an event
	app.delete('/api/events/:id', function (req, res) {

		Event.findOne({ _id: req.params.id }, (err, event) => {
			if (err) console.log('err ', err);

			if (event) {

				event.remove((err) => {
					if (err) console.log('err ', err);
					// Remove event from club
					Club.findOne({ events: event._id }, (err, club) => {
						if (club) {
							console.log('club found!');
							for (var i = 0; i < club.events.length; i++) {
								if (String(club.events[i]) === String(event._id)) {
									club.events.splice(i, 1);
									break;
								}
							}
							club.save((err) => {
								if (err) console.log('err', err);
								res.json({ message: 'event deleted successfully' });
							});
						} else {
							console.log('club not found!');
							res.json({ message: 'event deleted successfully' });
						}
					});

				});

			}

		});

	});


	// Add a promise
	app.post('/api/events/:id/promise', function (req, res) {

		Event.findOne({ _id: req.params.id }, function (err, event) {
			if (err) console.error(err);
			if (event) {

				var counted = false;
				if (req.user) {
					for (var i = 0; i < event.promisers.length; i++) {
						if (String(event.promisers[i]) === String(req.user._id)) {
							counted = true;
							break;
						}
					}
				}

				if (!counted) {
					event.promisers.push(req.user._id);
					event.save(function (err, event) {
						if (err) console.error(err);
						res.sendStatus(201);
					});
				} else {
					res.sendStatus(404);
				}
			} else {
				res.sendStatus(404);
			}

		});

	});

	// Admin API
	app.put('/api/:clubName/users-roles/:id', function (req, res) {

		var name = req.params.clubName.replace(/\-/g, ' ');

		User.findOne({ _id: req.params.id }, function (err, user) {

			if (err) console.log(err);

			if (user) {

				Club.findOne({ name: new RegExp(name, 'i') }, function (err, club) {
					if (err) console.log(err);

					if (club) {

						var index = user.findMembership(res, club);
						if (index >= 0) {
							user.memberships[index].role = req.body.role;
							console.log('role set', user.memberships[index].role);
							user.save(function (err) {
								if (err) console.log(err);
								res.sendStatus(204);
							});
						} else {
							console.log('role not set');
							res.sendStatus(404);
						}



					} else {
						res.sendStatus(404);
					}
				});


			} else {
				res.sendStatus(404);
			}

		});

	});

};
