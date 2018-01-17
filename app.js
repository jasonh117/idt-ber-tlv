const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const Database = require('better-sqlite3');

const db = new Database('./db/dev.db');
const res = db.prepare('SELECT count(*) as count from tlv').get();
if (res.count <= 0) {
  const insert = db.prepare('INSERT INTO tlv (tag) VALUES ($tag)');
  for (let i = 0xE1; i <= 0xEF; i++) {
    for (let j = 0x01; j <= 0x7F; j++) {
      insert.run({
        tag: Buffer.from([0xDF, i, j])
      });
    }
  }
  for (let i = 0x01; i <= 0x7F; i++) {
    insert.run({
      tag: Buffer.from([0xFF, 0xEE, i])
    });
  }
}
db.close();
console.log('Database OK');

const index = require('./routes/index');
const tlv = require('./routes/tlv');

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
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/tlv', tlv);

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
