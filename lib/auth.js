const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const OutlookStrategy = require('passport-outlook');
const config = require('./config');
const constants = require('./constants');
const error = require('./error');

if (config.google.clientId && config.google.clientSecret) {
    passport.use(new GoogleStrategy({
            clientID: config.google.clientId,
            clientSecret: config.google.clientSecret,
            callbackURL: '/auth/google/callback'
        },
        function (accessToken, refreshToken, profile, done) {
            if (!profile.emails[0].value.includes('@idtechproducts.com'))
                return done(new Error('Email has to be from ID TECH.'));
            // TODO: create or find user
            const user = {
                // id: profile.id,
                // token: accessToken,
                name: profile.displayName,
                email: profile.emails[0].value
            }
            return done(null, user);
        }
    ));
}

if (config.outlook.clientId && config.outlook.clientSecret) {
    passport.use(new OutlookStrategy({
        clientID: config.outlook.clientId,
        clientSecret: config.outlook.clientSecret,
        callbackURL: '/auth/outlook/callback'
      },
      function(accessToken, refreshToken, profile, done) {
        if (!profile.emails[0].value.includes('@idtechproducts.com'))
            return done(new Error('Email has to be from ID TECH.'));
        const user = {
            // id: profile.id,
            // token: accessToken,
            name: profile.displayName,
            email: profile.emails[0].value
        }
        return done(null, user);
      }
    ));
}

passport.serializeUser(function (user, done) {
    // TODO: serialize user
    done(null, user);
});

passport.deserializeUser(function (id, done) {
    // TODO: deserialize user
    done(null, id);
});

exports.passport = passport;

exports.isUser = (req, res, next) => {
    if (config.env !== constants.PROD || req.isAuthenticated())
        return next();
    res.render('warning', {
        title: 'ID TECH TLV: Not Logged In',
        user: req.user,
        search: req.query.data || '',
        warning: 'Log in to access page.'
    });
};

exports.isUserApi = (req, res, next) => {
    if (config.env !== constants.PROD || req.isAuthenticated())
        return next();
    throw error(401, `Not logged in.`);
};

exports.isAdminApi = (req, res, next) => {
    if (config.env !== constants.PROD || req.isAuthenticated()) {
        if (config.env !== constants.PROD || true) // TODO: if (req.user.isAdmin)
            return next();
        throw error(401, `User is not an admin.`);
    }
    throw error(401, `Not logged in.`);
};