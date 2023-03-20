const cookieSession = require("cookie-session");
const express = require("express");
const cors = require("cors");
const colors = require('colors');
const http = require('http');

const passport = require("passport");
const logger = require('./middleware/logger');

const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { mongoDB } = require('./configs/db');
const {connectDataBase} = require('./configs/db');
const routes = require('./routes/routes');
require('./configs/passport');
require('dotenv').config();


// app.use(
//   cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
// );
app.use(
  cors({
    origin: process.env.CLIENT,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
    
  })
);
app.use([express.json(), express.urlencoded({ extended: true }), logger]);
app.use(
  session({
    secret:'cat',
    resave: true,
    saveUninitialized: true,
    saveUninitialized: true,

    store: MongoStore.create({
      mongoUrl: mongoDB,
      collectionName: "sessions",
    }),
    cookie : {
      maxAge: 2419200000,
      secure: true ,
      sameSite: "none",
    }
    // cookie: { secure: true },
  })
);
app.set("trust proxy", 1);


app.use(passport.initialize());
app.use(passport.session());


require("./configs/passport.google");

app.use(routes);

const server = http.createServer(app);
const port = process.env.PORT;
colors.setTheme({
  info: 'green',
  help: 'cyan',
  warn: 'yellow',
  error: 'red',
});

connectDataBase().then(() => {
  server.listen(port, () => {
      console.log('Server running on port', port);
  });
});
