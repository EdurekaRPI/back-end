const mongoose = require('mongoose');

const eventModelSuperset = new mongoose.Schema({
	// Event id in other DBs
	hubID: { type: String, required: false },
	compassID: { type: String, required: false },

    // Superset of Study Compass and Event Hub
    // eventID: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: false },
    typeOfEvent: { type: String, required: true },
    likes: { type: Number, default: 0 },
    creationTimestamp: { type: Date, default: Date.now },
    eventCreator: { type: String, required: true },
    // eventHost: { type: String,
	// 	required: function() {
	// 	  return !this.club;
	// 	}
	// },
    eventHost: { type: String, required: false },  // TODO: Change back/fix/figure out
    hostingType: { type: String, required: true }, // e.g., 'User', 'Club', etc.
    hostingId: { type: mongoose.Schema.Types.ObjectId, required: false, refPath: 'hostingType' },
    attendees: { type: Array, default:[] },
    expectedAttendance: { type: Number, required: false },
    approvalReference: { type: mongoose.Schema.Types.ObjectId, required: false, refPath: 'ApprovalInstance' },
    eventStatus: { type: String, required: true, enum: ['approved', 'pending', 'rejected', 'not-applicable'], default: 'not-applicable' },
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },
    location: { type: String, required: true },
    classroomID: {type: String},
    image: { type: String },
    tags: {type: [String] },
    // club: { type: String,
	// 	required: function() {
	// 	  return !this.eventHost;
	// 	}
	// },
    club: { type: String, required: false }, // TODO: Change back/fix/figure out
    rsvpMethod: { type: String },
    contact: { type: String, required: false },
    visibility: { type: String, required: false },

}, { versionKey: false });

const Event = mongoose.model('Event', eventModelSuperset);
const Archive = mongoose.model('eventArchive', eventModelSuperset);

module.exports = {Event, Archive};
