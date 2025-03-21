const ApiKeys = require('../models/apiKeys');
const currentAuthLocation = null;//"EventHub";
// const argon2 = require('argon2');
const {
  scrypt,
} = require('node:crypto');
require('dotenv').config({ path: './.env' });
const APIkeySalt = process.env.APIkeySalt;



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
const goAuth = async (req, res, next) => {
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

module.exports = {currentAuthLocation,goAuth};