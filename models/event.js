const mongoose = require('mongoose');

const eventsSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true
    },
    eventDescription: {
        type: String,
        required: true
    },
    dateOfEvent: {
        type: Date,
        required: true
    },
    checklist: [{
        task: String,
        completed: {
            type: Boolean,
            default: false
        }
    }],
    approvalRequired: {
        type: Boolean,
        default: false
    },
    approvalStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Denied'],
        default: 'Pending'
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function() { return this.approvalStatus === 'Approved'; }
    }
});

const Event = mongoose.model('Event', eventsSchema);

module.exports = Event;
