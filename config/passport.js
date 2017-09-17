const LocalStrategy = require('passport-local').Strategy;
const utils = require('../utils')

// Models
const User = require('../models/user');
const ObjectId = require('mongoose').Schema.Types.ObjectId



// =========================================================================
module.exports = function(passport) {   
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    }, async function(req, email, password, done) {
        try {
            let user = await User.findOne({email: email}).exec();
            
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

            return done(null, user)

        }catch(err){done(err)}
    }));

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    }, async function(req, email, password, done) {

        req.checkBody('email',    'must be a valid email.').isEmail()
        req.checkBody('password', 'a minimum length of 6 characters.').len({min: 6})
        // req.checkBody('KFUPMID', 'must be like s201314740.').matches(/s?[0-9]{9}/i)
        // req.sanitizeBody('KFUPMID').trim()
        let errors = await utils.getValidationErrors(req)
        if (errors.length > 0) {
            return done(null, false, req.flash('errors', errors));
        }
        
        // let id = req.body.KFUPMID || ""
        // // Drop the s if its there
        // if (id.charAt(0).toLowerCase() === 's') {
        //     id = id.slice(1)
        // }

        // if the user is already logged in:
        if (req.user)
            return done(null, req.user);
        process.nextTick(async function() {
            try {
                let user = await User.findOne({email : email}).exec()
                if (user)
                    return done(null, false, req.flash('errors', 'That email is already taken.'));
                // create the user
                let newUser = new User({
                    email: email,
                    password: User.generateHash(password),
                    username: req.body.username,
                    major: req.body.major,
                    KFUPMID: (id)? Number(id) : 0
                    // notificationToken: req.body.notificationToken
                })
                newUser = await newUser.save()
                return done(null, newUser);
            }
            catch(err){done(err)};
        })
    }));

    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};

