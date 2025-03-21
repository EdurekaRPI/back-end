const express = require('express');
const router = express.Router();
const eventModel = require('../models/eventModelSuperset');
const Event = eventModel.Event;

// Apply authentication middleware to the protected URLs
// const ApiAuth = require('../public/api_auth'); ApiAuth.currentAuthLocation = "Frontend"; router.use(ApiAuth.goAuth);

router.get('/week-of-events', async (req, res, next) => {
    try {
        // Parse the date from the query parameter
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ error: 'Missing required query parameter: date (YYYY-MM-DD)' });
        }

        const selectedDate = new Date(date);
        if (isNaN(selectedDate.getTime())) {
            return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
        }


        // Find the start (Sunday) and end (Saturday) of the calendar week
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay()); // Go to Sunday
        startOfWeek.setHours(0, 0, 0, 0);


        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Move to Saturday
        endOfWeek.setHours(23, 59, 59, 999);

        console.log(`Fetching events from ${startOfWeek.toISOString()} to ${endOfWeek.toISOString()}`);

        // Query events that fall within the week range
        const weeklyEvents = await Event.find({
            startDateTime: { $gte: startOfWeek, $lte: endOfWeek },
        }).select('title description startDateTime endDateTime location image typeOfEvent tags image club eventHost');

        // console.log(weeklyEvents);
        res.json(weeklyEvents);
    } catch (error) {
        console.error('Error fetching week of events:', error);
        res.status(500).json({ error: 'Internal server error', details: error });
    }
})

module.exports = router;
