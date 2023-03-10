const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");
require('dotenv').config();

const GOOGLE_CLIENT_ID =
  "your id";
const GOOGLE_CLIENT_SECRET = "your id";

GITHUB_CLIENT_ID = "your id";
GITHUB_CLIENT_SECRET = "your id";

FACEBOOK_APP_ID = "your id";
FACEBOOK_APP_SECRET = "your id";
const User = require('./models/user.schema');
const RemoForce = require('./models/remoForce.schema');

console.log(process.env.GOOGLE_CALLBACK);


passport.use(
  new GoogleStrategy(
    {
      clientID: '365154765627-k9i8b5lsiuk9tarqa4af9lbih4sg836u.apps.googleusercontent.com',
      clientSecret: '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',
      // callbackURL: `${process.env.GOOGLE_CALLBACK}`,
       callbackURL: "https://temp-back-production.up.railway.app/auth/google/callback",

    },
    async (accessToken, refreshToken, profile, done) => {
      // done(null, profile);
      const email = profile.emails[0].value;
      console.log('email',email);
      
           

      try {
          // Check if user already exists in the database
          const existingUser = await User.findOne({ email });
          console.log('new hello1');
          if (existingUser) {
              return done(null, existingUser);
          }
          const newRemoForce = new RemoForce({
              fullName: profile.displayName,
              email,
          });

          await newRemoForce
              .save()
              // .then((remoforce) => console.log(remoforce))
              .then(async () => {
                  const newRemoForceUser = await RemoForce.findOne({ email });

                  const newUser = new User({
                      fullName: profile.displayName,
                      signInMethod: 'google',
                      googleId: profile.id,
                      email,
                      ventureId: newRemoForceUser._id,

                      role: 'remoforce',
                  });

                  await newUser.save();
                  console.log(newUser);
                  return done(null, newUser);
              });
      } catch (error) {
          // console.log(err);
          done(error, null);
      }
      
    }
  )
);



passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
