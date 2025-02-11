var express = require('express');
//const app = express();
var router = express.Router();
const Event = require('../models/eventModelSuperset');


function convertEventhubToER(input){
	console.log("converter called");
	return input;
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