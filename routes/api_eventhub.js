var express = require('express');
//const app = express();
var router = express.Router();
const eventModel = require('../models/eventModelSuperset');
const Event = eventModel.Event;
const Archive = eventModel.Archive;

// Apply authentication middleware to the protected URLs
const ApiAuth = require('../public/api_auth'); ApiAuth.currentAuthLocation = "EventHub"; router.use(ApiAuth.goAuth);

function convertEventhubToER(input){
	//console.log(input.titlle);
	console.log("converter 1 called");
	
	return {
		hubID: input._id.$oid,
		title: input.title,
		typeOfEvent: "EventhubAutogen",
		description: input.description,
		likes: input.likes,
		creationTimestamp: input.creationTimestamp.$date,
		eventCreator: input.poster,
		eventHost: input.club,
		startDateTime: new Date(input.startDateTime.$date),
		endDateTime: new Date(input.endDateTime.$date),
		location: input.location,
		image: input.image,
		tags: input.tags,
		rsvp: input.rsvpMethod,
		
		club: input.club,
	};
}

function convertERToEventhub(input){
	//console.log(input.titlle);
	console.log("converter 2 called");
	
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
router.get('/:id', async function(req, res, next) {
	try {
        foundEvent = await Event.findOne({hubID: req.params.id});
		if (!foundEvent) {
            return res.status(404).json({ error: 'Event not found'});
        }
		        res.status(200).json({ sucess: "Got event!", event: foundEvent });
    } catch (err) {
        res.status(500).json({ error: 'Error getting event', error_details: err });
    }
});

router.post('/*', async (req, res) => {
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

		//console.log("API key: ",req.get('Api-Key'));
		
		foundEvent = await Event.findOne({hubID: req.params.id});
		if (!foundEvent) {
            return res.status(404).json({ error: 'Event not found'});
        }
		//console.log("Found event: \n",foundEvent.toJSON());
		foundEvent = convertERToEventhub(foundEvent);
		//console.log("Found event (EventHub format): \n",foundEvent);
		for (var key in req.body) {
			foundEvent[key] = req.body[key];
		}
		//console.log("Found event (Edureka format): \n",convertEventhubToER(foundEvent));
		collection = await Event.replaceOne({hubID: req.params.id}, convertEventhubToER(foundEvent));
		//console.log(collection);
        res.status(201).json({ sucess: "Patched event!", editedEvent: foundEvent});
    } catch (err) {
        res.status(500).json({ error: 'Error creating event', error_details: err});
    }
});

module.exports = router;