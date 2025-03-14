const express = require('express');
const router = express.Router();
const eventModel = require('../models/eventModelSuperset');
const Event = eventModel.Event;
// const Archive = eventModel.Archive;

// GET events that have posters
router.get('/events-with-posters', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of the day

        const weekLater = new Date();
        weekLater.setDate(today.getDate() + 14); // Get date 14 days from today
        weekLater.setHours(23, 59, 59, 999); // Set to end of the day

        const eventsWithPosters = await Event.find({
            image: { $exists: true, $ne: null }, // Filter for events with a poster
            startDateTime: { $gte: today, $lte: weekLater } // Events within 7-day window
        }).select('title description startDateTime endDateTime location image');

        res.json(eventsWithPosters);
        console.log('Events with posters:', eventsWithPosters);
        // res.status(201).json({ success: "It worked!!"});
    } catch (error) {
        console.error('Error fetching events with posters:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// router.get('/test', (req, res) => {
//     res.json({ message: "Test route works!" });
// });

module.exports = router;
