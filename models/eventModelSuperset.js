const mongoose = require('mongoose');

const eventModelSuperset = new mongoose.Schema({

    // Superset of Study Compass and Event Hub
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

    // Edureka specific

    // Attendees
    requestForPresident: { type: Boolean, default: false },
    presidentRequestReason: { type: String },
    featuredSpeakers: { type: Array, default: [] },

    // Event details


    // Media


    // Catering & Vendors


    // Budget, Staffing, & Transportation



}, { versionKey: false });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
