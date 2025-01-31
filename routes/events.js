const express = require('express');
const router = express.Router();
const Event = require('../models/eventModelSuperset'); // Adjust path as needed

// GET events that have posters
router.get('/events-with-posters', async (req, res) => {
    try {
        const eventsWithPosters = await Event.find(
            { image: { $exists: true, $ne: null } } // Filter for events with a poster
        ).select('title description startDateTime endDateTime location image'); // Return only necessary fields

        res.json(eventsWithPosters);
    } catch (error) {
        console.error('Error fetching events with posters:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
