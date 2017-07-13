const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;


// User Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: { type: String, unique: true, lowercase: true },
    major: { type: String, default: "" },
    enrollment: Number,
    KFUPMID: Number,
    memberships: [
    {
        club: { type: Schema.Types.ObjectId, ref: 'Club' },
        role: { type: String, default: "unapproved" },
        date: { type: Date, default: Date.now },
        _id: false
    }
    ],
    isAdmin: Boolean
}, { timestamps: true });


// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


userSchema.statics.getRoleFromParam = function(req, res, next, clubId) {
	if (req.user) {
		for (let i = 0; i < req.user.memberships.length; i++) {
			if (String(req.user.memberships[i].club) === String(clubId)) {
				req.user.role = req.user.memberships[i].role
				break;
			}
		}
	}
    next()
}

userSchema.statics.getRoleFromQuery = function(req, res, next) {
    let clubId = req.query.clubId
	if (req.user) {
		for (let i = 0; i < req.user.memberships.length; i++) {
			if (String(req.user.memberships[i].club) === String(clubId)) {
				req.user.role = req.user.memberships[i].role
				break;
			}
		}
	}
    next()
}
    

// Admin
userSchema.statics.isAdmin = function(req, res, next) {
    if (req.isAuthenticated() && (req.user.isAdmin && req.user.isAdmin === true)) {
        next()
    } else {
        res.sendStatus(403) // Forbidden
    }
}

// President
userSchema.statics.isPresident = function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'president') {
        next()
    } else {
        res.sendStatus(403) // Forbidden
    }
}

// President OR Manager
userSchema.statics.canManage = function(req, res, next) {
    if (req.isAuthenticated() && (req.user.role === 'manager' || req.user.role === 'president')) {
        next()
    } else {
        res.sendStatus(403) // Forbidden
    }
}


// Member
userSchema.statics.isMember = function(req, res, next) {
    if (req.isAuthenticated() && (req.user.role === 'member' || req.user.role === 'manager' || req.user.role === 'president')) {
        next()
    } else {
        res.sendStatus(403) // Forbidden
    }
}

// Logged in
userSchema.statics.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.sendStatus(401) // Unauthorized
    }
}

module.exports = mongoose.model('User', userSchema);