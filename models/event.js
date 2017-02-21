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
	promisers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	open: {type: Boolean, default: true}
});


module.exports = mongoose.model('Event', schema);