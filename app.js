const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const Database = require('better-sqlite3');
const passport = require('passport');
const session = require('express-session');
const env = require('get-env')();
const nconf = require('nconf');
nconf.argv().env();

const db = new Database('./db/dev.db');
const res = db.prepare('SELECT count(*) as count from tlv').get();
if (res.count <= 0) {
  const insert = db.prepare('INSERT INTO tlv (tag, createdAt, modifiedAt) VALUES ($tag, $createdAt, $modifiedAt)');
  const currDatetime = Date.now();
  for (let i = 0xE1; i <= 0xEF; i++) {
    for (let j = 0x01; j <= 0x7F; j++) {
      insert.run({
        tag: Buffer.from([0xDF, i, j]),
        createdAt: currDatetime,
        modifiedAt: currDatetime
      });
    }
  }
  for (let i = 0x01; i <= 0x7F; i++) {
    insert.run({
      tag: Buffer.from([0xFF, 0xEE, i]),
      createdAt: currDatetime,
      modifiedAt: currDatetime
    });
  }
}
db.close();
console.log('Database OK');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: env === 'prod' ? nconf.get('SESSION_SECRET') : 'test_session',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/tlv', require('./routes/tlv'));
app.use('/api', require('./routes/api'));
app.use('/request', require('./routes/request'));
app.use('/auth', require('./routes/auth'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
