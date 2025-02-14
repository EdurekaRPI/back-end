require('dotenv').config({ path: '../.env' });

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const eventModel = require('../models/eventModelSuperset');
const Event = eventModel.Event;
const axios = require('axios');

// TODO: need to get endpoint from study compass
// const studyCompassEndpoint = process.env.studyCompassEndpoint;

// Get all events with a compassID
router.get('/study-compass/events', async (req, res) => {
    try {
        const events = await Event.find({ compassID: { $exists: true, $ne: null } });
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching events', error_details: err });
    }
});

// Get a specific event by ID
router.get('/study-compass/events/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching event', error_details: err });
    }
});

// Watch for changes in events with compassID and sync updates
Event.watch().on('change', async (change) => {
    try {
        if (change.operationType === 'update' || change.operationType === 'replace') {
            const updatedEvent = await Event.findById(change.documentKey._id);
            if (updatedEvent && updatedEvent.compassID) {
                await axios.post(COMPASS_DB_ENDPOINT, updatedEvent.toObject());
                console.log(`Synced event ${updatedEvent._id} to Compass DB`);
            }
        }
    } catch (error) {
        console.error('Error syncing with Compass DB:', error);
    }
});

module.exports = router;
