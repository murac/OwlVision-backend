var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
var mongoose = require('mongoose');
var cors = require('cors');

dotenv.load();

require('./models/Class');
require('./models/Course');
require('./models/Instructor');

var classes = require('./routes/classes');

var development = process.env.NODE_ENV !== 'production';

const app = express();

app.use(cors());

mongoose.Promise = require('bluebird');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//****************************
//**********ROUTES************
//****************************

app.use('/classes', classes);
// don't activate this route. the class db is full
// app.use('/scrape', scrape);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.json('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.json('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;