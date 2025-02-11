var express = require('express');
//const app = express();
var router = express.Router();
const Event = require('../models/eventModelSuperset');


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



/* GET users listing. */
router.get('/', function(req, res, next) {
	try {
        //const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({sucess:"Nothing here yet..."});
    } catch (err) {
        res.status(500).json({ error: 'Error :(', error_details: err });
    }
});

router.post('/newEvent', async (req, res) => {
	// try {
        const event = new Event(convertEventhubToER(req.body));
		console.log("created");
        const savedEvent = await event.save();
		console.log("saved");
        res.status(201).json(savedEvent);
    /*} catch (err) {
        res.status(500).json({ error: 'Error creating event', error_details: err});
    }*/
});

module.exports = router;