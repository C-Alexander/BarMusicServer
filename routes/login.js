const express = require('express');
const router = express.Router();
 let passport = require('passport');
// const localStrategy = require('passport-local').Strategy;

/* SUBMIT login details. */
router.post('/', (req, res, next) => {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) { return res.send(403) }
        req.login(user, err => {
            if (err) return next(err);
            let redirectURL = 'http://localhost:3000/';
            if (req.session.redirectTo) redirectURL = req.session.redirectTo;
            req.session.redirectTo = null;
            res.redirect(redirectURL);
        });
    }) (req, res, next);
});

module.exports = router;