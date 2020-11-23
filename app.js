var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jwt = require('express-jwt');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var purchasesRouter = require('./routes/purchases');
var testsRouter = require('./routes/tests');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(jwt({
	secret: process.env.JWT_SECRET,
	algorithms: ['sha1', 'RS256', 'HS256'],
	credentialsRequired: false,
	requestProperty: 'token',
	
	getToken: function fromHeaderOrQuerystring (req) {
	  if (req.headers.token && req.headers.token.split(' ')[0] === 'Bearer') {
		  return req.headers.token.split(' ')[1];
	  } else if (req.query && req.query.token) {
		return req.query.token;
	  }
	  return null;
	}
  }));

  app.use(function (err, req, res, next) {
	if (err && err.name && err.name.includes('Unauthorized')) {
	  return res.status(401).json({err : err.name });
	}
	next(req, res);
  });

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/purchases', purchasesRouter);

if (process.env.ENV === 'dev') {
	app.use('/tests', testsRouter);
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.ENV === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
