var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Models
var Club = require('./club');

// News Schema
var schema = new mongoose.Schema({
  title: {type: String, default: ''},
	body: {type: String, default: ''},
	publish_date: {type: Date, default: Date.now}
});

schema.pre('remove', function(next) {
	Club.findOne({ news: this._id }, function(err, club) {
		if (err) console.log('err ', err);
		if (club) {
			for(var i=0; i<club.news.length; i++) {
				if (String(club.news[i]) === String(this._id)){
					club.news.splice(i, 1);
					club.save((err) => {if (err) console.log(err);});
					break;	
				}
			}
		} else {
			console.log('no such club');
		}
		next();
	});
});

module.exports = mongoose.model('News', schema);