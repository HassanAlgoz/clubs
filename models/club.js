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
    condition: { type: String, default: 'unapproved' },
    // Social Media Links
    twitter: String,
    youtube: String,
    periscope: String,
    instagram: String,
    snapchat: String,
    telegram: String,
    whatsapp: String,
    slack: String
});


module.exports = mongoose.model('Club', clubSchema);