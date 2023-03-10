const express = require('express');
const usersRouter = require('./users.route');
const authRouter = require('./auth.route');
const startupRouter = require('./startup.route');
const jobRouter = require('./job.route');
const googleRouter = require('./google.route');
const googleRoute = require('./google');

const router = express.Router();
// home route
router.get('/', (_req, res) => {
  res.send('test server is running');
});
// business route
router.use('/api/users', usersRouter);
router.use('/api/auth', authRouter);
router.use('/api/startup', startupRouter);
router.use('/api/job', jobRouter);
router.use('/auth', googleRoute);

module.exports = router;
