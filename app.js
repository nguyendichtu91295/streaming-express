var express = require('express');
var path = require('path');
var fs = require('fs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');
var os = require('os');
var index = require('./routes/index');
var users = require('./routes/users');
var minimist = require('minimist');

var app = express();

// view engine setup
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Get Parameters in Terminal
let _PARAMS = minimist(process.argv.slice(2));
app.set('PARAMS', _PARAMS);
app.set('PATH', _PARAMS.path);
app.use(express.static(_PARAMS.path));
console.log('changing git');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

//Get local Ip
var ifaces = os.networkInterfaces();

Object.keys(ifaces).forEach(function(ifname) {
	var alias = 0;

	ifaces[ifname].forEach(function(iface) {
		if ('IPv4' !== iface.family || iface.internal !== false) {
			// skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
			return;
		}

		console.clear();

		const port = _PARAMS.port || '3000';

		if (alias >= 1) {
			// this single interface has multiple ipv4 addresses
			console.log('Open link at:', `${iface.address}:${port}`);
		} else {
			// this interface has only one ipv4 adress
			console.log('Open link at:', `${iface.address}:${port}`);
		}
		++alias;
	});
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
