const router = require("express").Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user.schema');
require('dotenv').config();

const passport = require("passport");
// const googleCallback =require('../controllers/auth.controller')

const CLIENT_URL = process.env.CLIENT;
// const CLIENT_URL = "http://localhost:3000";

router.get("/login/success", async(req, res) => {
  console.log(req.user);
  
 
  if (req.user) {
    const email = req.user.email;
    console.log(req.user);
    
    const userExist = await User.findOne({ email });
    const payload = {
      email: req.user.email,
      id: req.user._id,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2d' }); // AuthService.issueToken(req.user._id);
   return res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
      token: `Bearer ${token}`,
      role: userExist?.role,
      //   cookies: req.cookies
    });
  }
  res.send({
    success: false,
    message: "unauthorized",
 
    //   cookies: req.cookies
  });
});
// router.get("/login/success", (req, res) => {
//   if (req.user) {
//     res.status(200).json({
//       success: true,
//       message: "successfull",
//       user: req.user,
//       //   cookies: req.cookies
//     });
//   }
// });


router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(CLIENT_URL);
});

router.get("/google", passport.authenticate("google", { scope: ["profile","email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    
    // successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  }),
  (req, res) => {
    const payload = {
      email: req.user.email,
      id: req.user._id,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2d' });
    res.cookie('token', `Bearer ${token}`, );
  res.cookie('userRole', req.user.role,);
  //   res.cookie('token', `Bearer ${token}`, { secure:true, sameSite: 'none' });
  // res.cookie('userRole', req.user.role, { secure:true,  sameSite: 'none' });
  res.redirect(CLIENT_URL)
      // if (req.user.role === 'startup') {
      //     res.redirect(`${CLIENT_URL}/dashboard`);
      //     return;
      // }
      // if (req.user.role === 'remoforce') {
      //     res.redirect(`${CLIENT_URL}/remoforce-dashboard`);
          
      // }
})

// router.get("/github", passport.authenticate("github", { scope: ["profile"] }));

// router.get(
//   "/github/callback",
//   passport.authenticate("github", {
//     successRedirect: CLIENT_URL,
//     failureRedirect: "/login/failed",
//   })
// );

// router.get("/facebook", passport.authenticate("facebook", { scope: ["profile"] }));

// router.get(
//   "/facebook/callback",
//   passport.authenticate("facebook", {
//     successRedirect: CLIENT_URL,
//     failureRedirect: "/login/failed",
//   })
// );

module.exports = router