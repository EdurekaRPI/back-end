const express = require('express');
const router = express.Router();
const eventModel = require('../models/eventModelSuperset');
const Event = eventModel.Event;
// const Archive = eventModel.Archive;
const currentAuthLocation = "Frontend";
const ApiKeys = require('../models/apiKeys');

const {
    scrypt,
} = require('node:crypto');
require('dotenv').config({ path: './.env' });
const APIkeySalt = process.env.APIkeySalt;


const auth = async (req, res, next) => {
    // Define the logic for authentication (e.g., check for a key, verify credentials)
    const apiAuthKey = req.get('Api-Key');
    console.log(APIkeySalt);
    //check if the user gave us an API key in the header
    if (apiAuthKey) {
        //look for the given key in the DB
        await scrypt(apiAuthKey, APIkeySalt, 64, async (err, keyHash) => {
            keyHash = keyHash.toString('hex');
            console.log("API hash: ",keyHash);
            if (err) throw err;
            apiUser = await ApiKeys.findOne({key: keyHash});
            //if we found them, check their perms
            if(apiUser){
                //check if user has necessary perms (currentAuthLocation should be set to the name of the current route's permission identifier)
                if(apiUser.perms.includes(currentAuthLocation)||apiUser.perms.includes("Admin")){
                    // If authenticated, proceed to the method handler
                    next();
                }
                else{
                    res.status(401).send({"error":'Incorrect perms to access '+currentAuthLocation+' API sector.'});
                }
            }
            else{
                res.status(400).send({"error":'Invalid api key.'});
            }
        });
    }
    else {
        // If not authenticated, return an error
        res.status(400).send({"error":'Missing "Api-Key" header.'});
    }
};

// Apply authentication middleware to the protected URLs
router.use(auth);

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
        }).select('title description startDateTime endDateTime location');

        // console.log(weeklyEvents);
        res.json(weeklyEvents);
    } catch (error) {
        console.error('Error fetching week of events:', error);
        res.status(500).json({ error: 'Internal server error', details: error });
    }
})

module.exports = router;
