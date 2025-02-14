const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const eventModel = require('../models/eventModelSuperset');
const Event = eventModel.Event;
const axios = require('axios');

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

module.exports = router;
