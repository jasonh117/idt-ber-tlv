const express = require('express');
const lib = require('../lib');
const router = express.Router();

router.get('/google', lib.auth.passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback', lib.auth.passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: '/'
}));

router.get('/outlook', lib.auth.passport.authenticate('windowslive', {
    scope: [
        'openid',
        'profile',
        'offline_access',
        'https://outlook.office.com/Mail.Read'
    ]
}));

router.get('/outlook/callback', lib.auth.passport.authenticate('windowslive', {
    failureRedirect: '/login',
    successRedirect: '/'
}));

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;