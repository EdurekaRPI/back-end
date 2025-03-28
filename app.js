require('dotenv').config({ path: './.env' });


const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const apiEventHubRouter = require('./routes/api_eventhub');
const apiConcertoRouter = require('./routes/api_concerto');
const apiFrontendRouter = require('./routes/api_frontend');
const apiAdminRouter = require('./routes/api_admin');

const app = express();

const MongoURI = process.env.MongoURI;

if (!MongoURI) {
    console.error('MongoDB URI not defined in .env');
    process.exit(1);
}

const mongoose = require('mongoose');

mongoose.connect(MongoURI, {
    //useNewUrlParser: true,    //deprecated
    //useUnifiedTopology: true, //deprecated
});

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

//const {db} = mongoose.connection;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/eventhub', apiEventHubRouter);
app.use('/api/concerto', apiConcertoRouter);
app.use('/api/frontend', apiFrontendRouter);
app.use('/api/admin', apiAdminRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

//module.exports = app;
