const createError = require('http-errors');
const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const indexRouter = require('./routes');
app.use('/', indexRouter);

const discordModel = require('./models/discord.model');
discordModel.initialize();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
