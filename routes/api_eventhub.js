var express = require('express');
//const app = express();
var router = express.Router();
const eventModel = require('../models/eventModelSuperset');
const Event = eventModel.Event;
const Archive = eventModel.Archive;
const ApiKeys = require('../models/apiKeys');
const mongoose = require('mongoose');
const currentAuthLocation = "EventHub";


/*
EventHub Model:
{
  title: { type: String, required: true },
  description: { type: String, required: true },
  likes: { type: Number, default: 0 },
  creationTimestamp: { type: Date, default: Date.now },
  poster: { type: String, required: true },
  startDateTime: { type: Date, required: true },
  endDateTime: { type: Date, required: true },
  location: { type: String, required: true },
  image: { type: String },
  tags: [String],
  club: { type: String, required: true },
  rsvp: { type: String },
}
*/

/*
Our Model:
{
	eventID: { type: String, required: true },
    title: { type: String, required: true },
	description: { type: String, required: true },
    typeOfEvent: { type: String, required: true },
    likes: { type: Number, default: 0 },
    creationTimestamp: { type: Date, default: Date.now },
    eventCreator: { type: String, required: true },
    eventHost: { type: String, required: true },
    attendees: { type: Array, default:[] },
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },
    location: { type: String, required: true },
    classroomID: {type: String},
    image: { type: String },
    tags: {type: [String] },
    club: { type: String, required: true },
    rsvpMethod: { type: String },
    externalRef: { type: mongoose.Schema.ObjectId },
}
*/

const auth = async (req, res, next) => {
	// Define the logic for authentication (e.g., check for a key, verify credentials)
	const apiAuthKey = req.get('Api-Key');

	//check if the user gave us an API key in the header
	if (apiAuthKey) {
		//look for the given key in the DB
		apiUser = await ApiKeys.findOne({key: apiAuthKey});
		//if we found them, check their perms
		if(apiUser){
			//check if user has necessary perms (currentAuthLocation should be set to the name of the current route's permission identifier)
			if(apiUser.perms.includes(currentAuthLocation)||apiUser.perms.includes("Admin")){
				// If authenticated, proceed to the method handler
				next();
			}
			else{
				res.status(401).send('Incorrect perms to access '+currentAuthLocation+' API sector.');
			}
		}
		else{
			res.status(400).send('Invalid api key.');
		}
	}
	else {
		// If not authenticated, return an error
		res.status(400).send('Missing "Api-Key" header.');
	}
};


// Apply authentication middleware to the protected URLs
router.use(auth);

function convertEventhubToER(input){
	//console.log(input.titlle);
	console.log("converter called");
	
	return {
		hubID: input._id.$oid,
		title: input.title,
		typeOfEvent: "EventhubAutogen",
		description: input.description,
		likes: input.likes,
		creationTimestamp: input.creationTimestamp.$date,
		eventCreator: input.poster,
		eventHost: input.club,
		startDateTime: input.startDateTime.$date,
		endDateTime: input.endDateTime.$date,
		location: input.location,
		image: input.image,
		tags: input.tags,
		rsvp: input.rsvpMethod,
		
		club: input.club,
	};
}

function convertERToEventhub(input){
	//console.log(input.titlle);
	console.log("converter called");
	
	return {
		_id:{$oid: input.hubID},
		title: input.title,
		description: input.description,
		likes: input.likes,
		creationTimestamp:{$date: input.creationTimestamp},
		poster: input.eventCreator,
		club: input.eventHost,
		startDateTime:{$date: input.startDateTime},
		endDateTime:{$date: input.endDateTime},
		location: input.location,
		image: input.image,
		tags: input.tags,
		rsvpMethod: input.rsvp,
		
		club: input.club,
	};
}


/* GET users listing. */
router.get('/', function(req, res, next) {
	try {
        res.status(200).json({sucess:"Nothing here yet..."});
    } catch (err) {
        res.status(500).json({ error: 'Error :(', error_details: err });
    }
});

router.post('/', async (req, res) => {
	try {
        const event = new Event(convertEventhubToER(req.body));
        const savedEvent = await event.save();
        res.status(201).json({ sucess: "Created event!", created_event: savedEvent});
    } catch (err) {
        res.status(500).json({ error: 'Error creating event', error_details: err});
    }
});

router.delete('/:id', async (req, res) => {
	try {
        foundEvent = await Event.findOne({hubID: req.params.id});
		if (!foundEvent) {
            return res.status(404).json({ error: 'Event not found'});
        }
		foundEvent = foundEvent.toJSON();
		delete foundEvent["_id"];
		const archiveEvent = new Archive(foundEvent);
		
		await archiveEvent.save();
		const deletedEvent = await Event.findOneAndDelete({hubID: req.params.id});
        res.status(200).json({ sucess: "Deleted event!" });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting event', error_details: err });
    }
});
    
router.patch('/:id', async (req, res) => {
	try {
		console.log("API key: ",req.get('Api-Key'));
		
		foundEvent = await Event.findOne({hubID: req.params.id});
		if (!foundEvent) {
            return res.status(404).json({ error: 'Event not found'});
        }
		console.log(foundEvent.toJSON());
		foundEvent = convertERToEventhub(foundEvent);
		console.log(foundEvent);
		for (var key in req.body) {
			foundEvent[key] = req.body[key];
		}
		console.log(convertEventhubToER(foundEvent));
		collection = await Event.replaceOne({hubID: req.params.id}, convertEventhubToER(foundEvent));
        res.status(201).json({ sucess: "Patched event!", editedEvent: foundEvent});
    } catch (err) {
        res.status(500).json({ error: 'Error creating event', error_details: err});
    }
});

module.exports = router;