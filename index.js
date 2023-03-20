
const colors = require('colors');
const http = require('http');
const app = require('./app');
const {connectDataBase} = require('./configs/db');
require('dotenv').config();

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
