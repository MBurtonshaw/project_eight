var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Book = require('./models');

var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');
const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'library.db'
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', booksRouter);

(async () => {
  try{
  await sequelize.authenticate();
  console.log('Step 1: complete. Connection established.');
  await sequelize.sync();
  console.log('Step 2: complete. Database is synced.');
} catch(error) {
  if (error.name === 'SequelizeValidationError') {
    const errors = error.errors.map(err = err.message);
    console.error('Validation Errors', errors);
  } else {
    throw error;
  }
}
})();

//404 error handler
app.use((req, res, next) => {
  const err = new Error();
  err.status = 404;
  err.message = " ...you don't wanna go down that road";
  next(err);
});

//500 error handler
app.use((err, req, res, next) => {
  if (err) {
      console.log("Global error handler has been called. ", err);
      if (err.status === 404) {
          err.message = " ...you don't wanna go down that road";
          res.status(404).render("page-not-found", {err});
      } else {
          err.message = err.message || "Ooops!";
          err.status = err.status || 500;
          res.status(500).render("error", {err});
      }
  }
});

module.exports = app;
