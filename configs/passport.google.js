const passport = require('passport');
const { Strategy } = require('passport-jwt');
const { ExtractJwt } = require('passport-jwt');

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.schema');
const RemoForce = require('../models/remoForce.schema');
require('dotenv').config();

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

// console.log(`${process.env.GOOGLE_CALLBACK}`);



const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
passport.use(
    new Strategy(opts, (jwtPayload, done) => {
        User.findOne({ email: jwtPayload.email }, (err, user) => {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        });
    })
);
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
            // callbackURL: 'http://localhost:4000/api/user/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            const email = profile.emails[0].value;
           

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
