var express = require('express');
//const app = express();
var router = express.Router();
const eventModel = require('../models/eventModelSuperset');
const Event = eventModel.Event;
const Archive = eventModel.Archive;
const ApiKeys = require('../models/apiKeys');
const mongoose = require('mongoose');
const currentAuthLocation = "EventHub";
// const argon2 = require('argon2');
const {
    scrypt,
} = require('node:crypto');
require('dotenv').config({ path: './.env' });
const APIkeySalt = process.env.APIkeySalt;



/*
StudyCompass Model:
{
  const eventSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true },
    hostingId: { type: Schema.Types.ObjectId, required: true, refPath: 'hostingType' },
    hostingType: { type: String, required: true, enum: ['User', 'Org'] },
    going: { type: Array, default: [] },
    location: { type: String, required: true },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    description: { type: String, required: false },
    image: { type: String, required: false },
    classroom_id: { type: Schema.Types.ObjectId, ref: 'Classroom' },
    visibility: { type: String, required: true },
    expectedAttendance: { type: Number, required: true },
    approvalReference: { type: Schema.Types.ObjectId, ref: 'ApprovalInstance' },
    status: { type: String, required: true, enum: ['approved', 'pending', 'rejected', 'not-applicable'], default: 'not-applicable' },
    contact: { type: String, required: false }
}, { timestamps: true });

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


module.exports = router;