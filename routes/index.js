// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// MongoDB connection URL
const dbURI = 'mongodb://localhost:27017/myDatabase';

// Connect to MongoDB using Mongoose
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

// Import the User and Event models
const User = require('../models/user');  // Updated path
const Event = require('../models/events'); // Updated path

// Define a simple route to verify the app works
app.get('/', (req, res) => {
    res.send('Hello World');
});

// *************** USER ROUTES ***************
// Create a new user (POST request)
app.post('/users', async (req, res) => {
    const user = new User({
        userID: req.body.userID,
        password: req.body.password
    });

    try {
        const savedUser = await user.save();
        res.status(201).send(savedUser);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Get all users (GET request)
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update a user by ID (PUT request)
app.put('/users/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).send(updatedUser);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Delete a user by ID (DELETE request)
app.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).send('User deleted');
    } catch (err) {
        res.status(500).send(err);
    }
});

// *************** EVENT ROUTES ***************
// Create a new event (POST request)
app.post('/events', async (req, res) => {
    const event = new Event({
        eventName: req.body.eventName,
        eventDescription: req.body.eventDescription
    });

    try {
        const savedEvent = await event.save();
        res.status(201).send(savedEvent);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Get all events (GET request)
app.get('/events', async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).send(events);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update an event by ID (PUT request)
app.put('/events/:id', async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).send(updatedEvent);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Delete an event by ID (DELETE request)
app.delete('/events/:id', async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.status(200).send('Event deleted');
    } catch (err) {
        res.status(500).send(err);
    }
});

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
