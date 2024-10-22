const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// Middleware to parse JSON
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
const mongoURI = 'mongodb://Admin:HtShXcVSu29MWqgcu@128.113.126.110:27017/admin'; // Update this with your actual connection string

mongoose.connect(mongoURI, {
    useNewUrlParser: true,  // You can remove this in newer versions
    useUnifiedTopology: true // You can remove this in newer versions
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Use the defined routes
app.use('/', indexRouter);
app.use('/api', usersRouter); // Add usersRouter under '/api' path

// Error handling (optional)
app.use(function(req, res, next) {
  res.status(404).send('Sorry, cannot find that!');
});

// Start the server
const PORT = process.env.PORT || 3001; // Use environment variable for the port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
