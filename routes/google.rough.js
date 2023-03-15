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



// router.get('/login/success', googleLoginSuccess);
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect(CLIENT_URL);
});
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    // res.redirect('/api/auth/google');
    next()
};

router.get("/login/success", isAuthenticated, (req, res) => {
    console.log(req.user);
    
    if (req.user) {
      res.status(200).json({
        success: true,
        message: "successfull",
        user: req.user,
        //   cookies: req.cookies
      });
    }
  });

// Google Authentication Route
router.get('/google', passport.authenticate('google', { scope: ['profile','email'] }));

// Google Authentication Callback Route
router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    googleCallback
);

module.exports = router;
