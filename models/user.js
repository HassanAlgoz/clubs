var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

// User Schema
var schema = new mongoose.Schema({
    name: String,
    password: String,
    email: { type: String, unique: true, lowercase: true },
    major: { type: String, default: "" },
    enrollment_year: { type: String, default: "" },
    memberships: [
        {
            club: { type: Schema.Types.ObjectId, ref: 'Club' },
            role: { type: String, default: "unapproved" },
            date: { type: Date, default: Date.now }
        }
    ],
    isAdmin: { type: Boolean, default: false }
});



schema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};



schema.statics.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};



schema.statics.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
};


schema.statics.canAdmin = function (req, res, next) {
    if (req.user.isAdmin === true) {
        next();
    } else {
        res.sendStatus(403);
    }
};





schema.methods.getMembership = function (club) {
    if (club === undefined) {
        console.error("ERROR: club is undefined!");
        return null;
    }

    var clubID = club._id;
    var index = this.findMembership(club);
    if (index >= 0) {
        return this.memberships[index];
    } else {
        return null;
    }
};



schema.methods.getRole = function (club) {
    if (club === undefined) {
        console.error("ERROR: club is undefined!");
        return '';
    }

    var index = this.findMembership(club);
    var role = '';
    if (index >= 0) {
        role = this.memberships[index].role;
    }
    return role;

};



schema.methods.findMembership = function (club) {
    if (club === undefined) {
        console.error("ERROR: club is undefined!");
        return -1;
    }
    var clubID = club._id;
    var isFound = false;
    for (var i = 0; i < this.memberships.length; i++) {
        if (String(this.memberships[i].club) === String(clubID)) {
            isFound = true;
            break;
        }
    }

    if (isFound) {
        return i;
    } else {
        return -1;
    }
};


schema.methods.isMember = function (club) {
    if (club === undefined) {
        console.error("ERROR: club is undefined!");
        return false;
    }
    var role = this.getRole(club);
    return role === 'president' ||
        role === 'manager' ||
        role === 'member';
};


schema.methods.canManage = function (club) {
    if (club === undefined) {
        console.error("ERROR: club is undefined!");
        return false;
    }
    var role = this.getRole(club);
    return role === 'president' ||
        role === 'manager';
};


schema.methods.isPresident = function (club) {
    if (club === undefined) {
        console.error("ERROR: club is undefined!");
        return false;
    }
    var role = this.getRole(club);
    return role === 'president';
};





module.exports = mongoose.model('User', schema);