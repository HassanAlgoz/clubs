const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Conditions
// const OPEN = 'open'
// const CLOSED = 'closed'

// Event Schema
const eventSchema = new mongoose.Schema({
	image: {type: String, default: ''},
	title: {type: String, default: ''},
	brief: {type: String, default: ''},
	publishDate: {type: Date, default: Date.now},
	lastEditDate: {type: Date, default: Date.now},
	lastEditBy: {type: Schema.Types.ObjectId, ref: 'User'},
	sentAsEmail: { type: Boolean, default: false },
	date: {type: Date, default: Date.now},
	time: {type: String, default: ''},
	location: {type: String, default: ''},
	promisers: [{
		user: {type: Schema.Types.ObjectId, ref: 'User'},
		attended: {type: Boolean, default: false},
		_id: false
	}],
	condition: {type: String, default: 'open'},
	membersOnly: { type: Boolean, default: false },
	organizers: [{type: Schema.Types.ObjectId, ref: 'User'}]
});


module.exports = mongoose.model('Event', eventSchema);