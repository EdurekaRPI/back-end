const express = require('express');
const router = express.Router();
const eventModel = require('../models/eventModelSuperset');
const Event = eventModel.Event;
// const Archive = eventModel.Archive;
const currentAuthLocation = "Concerto";
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
        res.status(500).json({ error: 'Internal server error', details: error});
    }
});

// router.get('/test', (req, res) => {
//     res.json({ message: "Test route works!" });
// });

module.exports = router;
