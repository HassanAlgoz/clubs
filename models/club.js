var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Club Schema
var clubSchema = new mongoose.Schema({
    name: {type: String, default: '', unique: true},
    description: {type: String, default: ''},
    logo: {type: String, default: ''},
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    date: { type: Date, default: Date.now },
    condition: { type: String, default: 'unapproved' }
});


module.exports = mongoose.model('Club', clubSchema);