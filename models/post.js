var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Models
var Club = require('./club');

// Post Schema
var postSchema = new mongoose.Schema({
  	title: {type: String, default: ''},
	content: {type: String, default: ''},
	publishDate: {type: Date, default: Date.now},
	lastEditDate: {type: Date, default: Date.now},
	lastEditBy: {type: Schema.Types.ObjectId, ref: 'User'},
	sentAsEmail: {type: Boolean, default: false}
});

module.exports = mongoose.model('Post', postSchema);