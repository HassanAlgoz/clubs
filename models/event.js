var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Event Schema
var schema = new mongoose.Schema({
  title: {type: String, default: ''},
	publish_date: {type: Date, default: Date.now},
	brief: {type: String, default: ''},
	date: {type: Date, default: Date.now},
	time: {type: String, default: ''},
	location: {type: String, default: ''},
	promisers: [{
			userID: {type: Schema.Types.ObjectId, ref: 'User'},
			attended: {type: Boolean, default: false}
		}],
	condition: {type: String, default: 'open'},
	membersOnly: { type: Boolean, default: true }
});


module.exports = mongoose.model('Event', schema);