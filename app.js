const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();

const passport = require('passport');
const session = require('express-session');

//require('./db/models')
//require('./db/database').sync({force: true});

require('../BarMusicServer/config/passport')(passport);


app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session( { secret: "Thomas is under the impression that static files should be authorized", resave: true, saveUninitialized: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());
app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api/index'));
app.use('/login', require('./routes/login'));


// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500).send();
});

module.exports = app;
