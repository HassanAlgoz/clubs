var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

// User Schema
var schema = new mongoose.Schema({
  name: String,
  password: String,
  email: { type: String, unique: true, lowercase: true},
  major: { type: String, default: ""},
  enrollment_year: { type: String, default: ""},
  memberships: [
    {
      club: { type: Schema.Types.ObjectId, ref: 'Club'},
      role: { type: String, default: "unapproved"},
      date: { type: Date, default: Date.now}
    }
  ],
  isAdmin: { type: Boolean, default: false }
});



schema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};



schema.statics.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};



schema.statics.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
  	res.redirect('/login');
  }
};


schema.statics.canAdmin = function(req, res, next) {
  if (req.user.isAdmin === true)
    res.next();
  res.sendStatus(403);
};





schema.methods.getMembership = function(club) {
  var index = this.findMembership(club);
  if ( index >= 0) {
    return this.memberships[index];
  } else {
    return null;
  }
};



schema.methods.getRole = function(club) {

  var index = this.findMembership(club);
  var role = '';
  if (index >= 0) {
    role = this.memberships[index].role;
  }
  return role;

};



schema.methods.findMembership = function(club) {

  if (typeof club === typeof '')
    console.log('ERROR ', 'parameter passed as string');

  var isFound = false;
  for(var i=0; i<this.memberships.length; i++) {
    if (String(this.memberships[i].club) === String(club)){
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


schema.methods.isMember = function(club) {
  clubID = club._id
  var role = this.getRole(clubID);
  return role === 'president' ||
         role === 'manager' ||
         role === 'member';
};


schema.methods.canManage = function(club) {
  clubID = club._id
  var role = this.getRole(clubID);
  return role === 'president' ||
         role === 'manager';
};


schema.methods.isPresident = function(club) {
  clubID = club._id
  var role = this.getRole(clubID);
  return role === 'president';
};





module.exports = mongoose.model('User', schema);