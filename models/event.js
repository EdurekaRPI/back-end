const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    poster: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    time: {
        type: String,
        required: true
    },
    club: {
        type: String,
        required: true
    },
    rsvp: {
        type: String,
        default: ""
    },
    creationTimestamp: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
