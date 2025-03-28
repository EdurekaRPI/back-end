const express = require('express');
const router = express.Router();
const eventModel = require('../models/eventModelSuperset');
const Event = eventModel.Event;
const Archive = eventModel.Archive;
const mongoSanitize = require('express-mongo-sanitize');

// Apply authentication middleware to the protected URLs
ApiAuth = require('../public/api_auth').create("FrontendAdmin"); router.use(ApiAuth);

// sanitize inputs to prevent NoSQL injection
router.use(mongoSanitize());

// Post a new event to the database
router.post('/new-event', async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        await newEvent.save();
        console.log('Admin created new event! ->', newEvent);
        res.json('Successfully pushed your event to the database!');
    } catch (error) {
        console.error('Error creating new event:', error);
        res.status(500).json({ error: 'Internal server error', details: error });
    }
});

// Delete an existing event from the database and archive it
router.delete('/delete-event/:id', async (req, res) => {
    try {
        const { id } = req.params;
        foundEvent = await Event.findById(id);
        if (!foundEvent) {
            return res.status(404).json({ error: 'Event not found'});
        }

        const archivedEvent = new Archive(foundEvent.toObject()); // Converts event to plain object before copying
        await archivedEvent.save();

        await Event.findByIdAndDelete(id);
        res.status(200).json({ success: 'Event deleted and archived'});
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Internal server error', details: error });
    }
});

// Patch an existing event in the database
router.patch('/edit-event/:id', async (req, res) => {
    try {
        foundEvent = await Event.findOne({_id: req.params.id});
        if (!foundEvent) {
            return res.status(404).json({ error: 'Event not found'});
        }

        for (var key in req.body) {
            foundEvent[key] = req.body[key];
        }

        collection = await Event.replaceOne({_id: req.params.id}, foundEvent);
        //console.log(collection);
        res.status(201).json({ success: "Patched event!", editedEvent: foundEvent});
    } catch (err) {
        res.status(500).json({ error: 'Error creating event', error_details: err});
    }
});

module.exports = router;