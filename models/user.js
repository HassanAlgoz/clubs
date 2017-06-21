var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

// User Schema
var userSchema = new mongoose.Schema({
    name: String,
    password: String,
    email: { type: String, unique: true, lowercase: true },
    major: { type: String, default: "" },
    enrollment: { type: String, default: "" },
    memberships: [
        {
            club: { type: Schema.Types.ObjectId, ref: 'Club' },
            role: { type: String, default: "unapproved" },
            date: { type: Date, default: Date.now }
        }
    ],
    isAdmin: { type: Boolean, default: false }
}, { timestamps: true });



userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};



userSchema.statics.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};



userSchema.statics.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
};


userSchema.statics.canAdmin = function (req, res, next) {
    if (req.user.isAdmin === true) {
        next();
    } else {
        res.sendStatus(403);
    }
};





userSchema.methods.getMembership = function (club) {
    if (club === undefined) {
        console.error("ERROR: club is undefined!");
        return null;
    }

    var clubID = club._id;
    var index = this.findMembershipIndex(club);
    if (index >= 0) {
        return this.memberships[index];
    } else {
        return null;
    }
};



userSchema.methods.getRole = function (club) {
    if (club === undefined) {
        console.error("ERROR: club is undefined!");
        return '';
    }

    var index = this.findMembershipIndex(club);
    var role = '';
    if (index >= 0) {
        role = this.memberships[index].role;
    }
    return role;

};



userSchema.methods.findMembershipIndex = function (club) {
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


userSchema.methods.isMember = function (club) {
    if (club === undefined) {
        console.error("ERROR: club is undefined!");
        return false;
    }
    var role = this.getRole(club);
    return role === 'president' ||
        role === 'manager' ||
        role === 'member';
};


userSchema.methods.canManage = function (club) {
    if (club === undefined) {
        console.error("ERROR: club is undefined!");
        return false;
    }
    var role = this.getRole(club);
    return role === 'president' ||
        role === 'manager';
};


userSchema.methods.isPresident = function (club) {
    if (club === undefined) {
        console.error("ERROR: club is undefined!");
        return false;
    }
    var role = this.getRole(club);
    return role === 'president';
};


module.exports = mongoose.model('User', userSchema);