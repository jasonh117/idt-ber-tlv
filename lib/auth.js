const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const OutlookStrategy = require('passport-outlook');
const nconf = require('nconf');
nconf.argv().env();
const error = require('./error');
const GOOGLE_CLIENT_ID = nconf.get('GOOGLE_CLIENT_ID');
const GOOGLE_CLIENT_SECRET = nconf.get('GOOGLE_CLIENT_SECRET');
const OUTLOOK_CLIENT_ID = nconf.get('OUTLOOK_CLIENT_ID');
const OUTLOOK_CLIENT_SECRET = nconf.get('OUTLOOK_CLIENT_SECRET');

passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
    function (accessToken, refreshToken, profile, done) {
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

passport.use(new OutlookStrategy({
    clientID: OUTLOOK_CLIENT_ID,
    clientSecret: OUTLOOK_CLIENT_SECRET,
    callbackURL: '/auth/outlook/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    const user = {
        // id: profile.id,
        // token: accessToken,
        name: profile.displayName,
        email: profile.emails[0].value
    }
    return done(null, user);
  }
));

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
    if (req.isAuthenticated())
        return next();
    res.render('warning', {
        title: 'ID TECH TLV: Not Logged In',
        user: req.user,
        search: req.query.data || '',
        warning: 'Log in to access page.'
    });
};

exports.isUserApi = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    throw error(401, `Not logged in.`);
};

exports.isAdminApi = (req, res, next) => {
    if (req.isAuthenticated()) {
        if (true) // TODO: if (req.user.isAdmin)
            return next();
        throw error(401, `User is not an admin.`);
    }
    throw error(401, `Not logged in.`);
};