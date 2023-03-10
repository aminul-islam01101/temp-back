const passport = require('passport');
const express = require('express');
const {
    register,
    login,
    user,
    googleCallback,
    googleLoginSuccess,
} = require('../controllers/auth.controller');

const router = express.Router();
const CLIENT_URL = 'http://localhost:3000/';

// register route
router.post('/register', register);

// login route
router.post('/login', login);

// test route
router.get('/user', passport.authenticate('jwt', { session: false }), user);

router.get('/login/success', googleLoginSuccess);
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect(CLIENT_URL);
});

// Google Authentication Route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google Authentication Callback Route
router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, successRedirect: '/login/success', failureRedirect: '/login' }),
    googleCallback
);

module.exports = router;
