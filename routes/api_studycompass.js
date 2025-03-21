var express = require('express');
//const app = express();
var router = express.Router();
const eventModel = require('../models/eventModelSuperset');
const Event = eventModel.Event;
const Archive = eventModel.Archive;
require('dotenv').config({ path: './.env' });
// Apply authentication middleware to the protected URLs
const ApiAuth = require('../public/api_auth');
ApiAuth.currentAuthLocation = "Concerto";
router.use(ApiAuth.goAuth);

// TODO: method for study compass to call whenever new event is created on their end
// TODO: conversion going both ways
// TODO: watcher to notify study compass if we change one of their events

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

function edurekaToStudyCompass(input) {
    console.log("Converting Edureka to Study Compass");

    return {
        name: input.title,
        type: input.typeOfEvent,
        hostingId: input.hostingId,
        hostingType: input.hostingType,
        going: input.attendees,
        location: input.location,
        start_time: input.startDateTime,
        end_time: input.endDateTime,
        description: input.description,
        image: input.image,
        classroom_id: input.classroomID,
        visibility: input.visibility,
        expectedAttendance: input.expectedAttendance,
        approvalReference: input.approvalReference,
        status: input.eventStatus,
        contact: input.contact
    };
}

function studyCompassToEdureka(input) {
    console.log("Converting Study Compass to Edureka");

    return {
        title: input.name,
        typeOfEvent: input.type,
        hostingId: input.hostingId,
        hostingType: input.hostingType,
        attendees: input.going,
        location: input.location,
        startDateTime: input.start_time,
        endDateTime: input.end_time,
        description: input.description,
        image: input.image,
        classroomID: input.classroom_id,
        visibility: input.visibility,
        expectedAttendance: input.expectedAttendance,
        approvalReference: input.approvalReference,
        eventStatus: input.status,
        contact: input.contact
    };
}


module.exports = router;