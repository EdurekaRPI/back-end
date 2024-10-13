const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('../models/user');
const Event = require('../models/event');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/EventApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Test route
app.get('/', (req, res) => {
    res.send('Connected');
});

// Route for registering a new user (both students and admins)
app.post('/users', async (req, res) => {
    try {
        const { userID, password, role } = req.body;

        // Validate role
        if (!['Student', 'Admin'].includes(role)) {
            return res.status(400).send('Invalid role. Role must be either Student or Admin.');
        }

        const newUser = new User({
            userID,
            password,
            role // Role can be 'Student' or 'Admin'
        });

        const savedUser = await newUser.save();
        res.status(201).send(savedUser);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Route for creating a new event (accessible by students and admins)
app.post('/events', async (req, res) => {
    try {
        const { userID, eventName, eventDescription, dateOfEvent, checklist, approvalRequired } = req.body;

        // Find the user by userID instead of MongoDB _id
        const user = await User.findOne({ userID });
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Create the event
        const newEvent = new Event({
            eventName,
            eventDescription,
            dateOfEvent,
            checklist,
            approvalRequired,
            createdBy: user._id
        });

        const savedEvent = await newEvent.save();
        res.status(201).send(savedEvent);
    } catch (err) {
        res.status(500).send(err);
    }
});


// Route for getting all events
app.get('/events', async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).send(events);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.status(200).json(users); // Send the result as a JSON response
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Route for an admin to approve or deny an event
app.put('/events/:id/approve', async (req, res) => {
    const { userId, approvalStatus } = req.body;

    try {
        // Find the user and check their role
        const user = await User.findById(userId);
        if (!user || user.role !== 'Admin') {
            return res.status(403).send('Permission denied');
        }

        // Find the event by ID
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).send('Event not found');
        }

        // Update the approval status
        event.approvalStatus = approvalStatus;
        if (approvalStatus === 'Approved') {
            event.approvedBy = userId;
        }

        const updatedEvent = await event.save();
        res.status(200).send(updatedEvent);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Route to delete an event (accessible by admins)
app.delete('/events/:id', async (req, res) => {
    const { userId } = req.body;

    try {
        // Find the user and check if they are an admin
        const user = await User.findById(userId);
        if (!user || user.role !== 'Admin') {
            return res.status(403).send('Permission denied');
        }

        // Delete the event
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).send('Event not found');
        }

        res.status(200).send('Event deleted');
    } catch (err) {
        res.status(500).send(err);
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
