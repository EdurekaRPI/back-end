require('dotenv').config({ path: '../.env' });

const express = require('express');
const mongoose = require('mongoose');
const Event = require('../models/eventModelSuperset');

const { MongoURI } = process.env;

const app = express();

app.use(express.json());

async function connectToDB() {
    if (!MongoURI) {
        console.error('MongoURI is not defined in the .env file');
        return;
    }

    try {
        // Attempt to connect to MongoDB using the MongoURI
        await mongoose.connect(MongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Successfully connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

// Connect to the database
connectToDB();

// Route to add a new event
app.post('/events', async (req, res) => {
    try {
        const eventData = req.body;  // Event data from request body

        // Create a new Event instance
        const event = new Event(eventData);

        // Save the event to the database
        const savedEvent = await event.save();

        // Respond with the saved event
        res.status(201).json(savedEvent);
    } catch (err) {
        console.error('Error adding event:', err);
        res.status(500).json({ error: 'Failed to add event. Please try again.' });
    }
});

// Route to get all events
app.get('/events', async (req, res) => {
    try {
        // Fetch all events from the database
        const events = await Event.find();

        // Respond with the list of events
        res.status(200).json(events);
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ error: 'Failed to fetch events. Please try again.' });
    }
});

// Route to get a specific event by ID
app.get('/events/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find the event by ID
        const event = await Event.findById(id);

        // If the event is not found, return a 404 error
        if (!event) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        // Respond with the event details
        res.status(200).json(event);
    } catch (err) {
        console.error('Error fetching event:', err);
        res.status(500).json({ error: 'Failed to fetch event. Please try again.' });
    }
});

// Route to edit (update) an event by ID
app.put('/events/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;  // Data to update from the request body

    try {
        // Find the event by ID and update with the provided data
        const updatedEvent = await Event.findByIdAndUpdate(id, updatedData, { new: true });

        // If event not found, return a 404 error
        if (!updatedEvent) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        // Respond with the updated event
        res.status(200).json(updatedEvent);
    } catch (err) {
        console.error('Error updating event:', err);
        res.status(500).json({ error: 'Failed to update event. Please try again.' });
    }
});

// Route to delete an event by ID
app.delete('/events/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find and delete the event by ID
        const deletedEvent = await Event.findByIdAndDelete(id);

        if (!deletedEvent) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        // Respond with a success message
        res.status(200).json({ message: 'Event deleted successfully.' });
    } catch (err) {
        console.error('Error deleting event:', err);
        res.status(500).json({ error: 'Failed to delete event. Please try again.' });
    }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server avail on port ${PORT}`);
});
