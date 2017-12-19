const express = require('express'),
  app = express(),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  { join } = require('path'),
  { conn, seed } = require('./db');

app.use('/public', express.static(join(__dirname, '../client/public')));

app.use(require('compression')());

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res, next) => res.sendFile(join(__dirname, '../client/public/index.html')));

app.use('/api', require('./api'));

app.use((err, req, res, next) => {
  if (err) console.log(`Server Error = ${err.message}`);
});

const port = process.env.PORT || 3000;

conn
  .sync({ force: true }) //remove this for production
  .then(() => seed())
  .then(() => app.listen(port, console.log(`listening on port ${port}`)));
