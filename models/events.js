const mongoose = require('mongoose');

const eventsSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true
    },
    eventDescription: {
        type: String,
        required: true
    }
});

const Event = mongoose.model('event', eventsSchema);

module.exports = Event;
