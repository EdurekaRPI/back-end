// Study Compass Model

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    type:{
        type:String,
        required:true,
    },
    hostingId: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'hostingType'
    },
    hostingType: {
        type: String,
        required: true,
        enum: ['User', 'Club']
    },
    going:{
        type:Array,
        default:[],
    },
    location:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:false,
    },
    classroom_id:{
        type: Schema.Types.ObjectId,
        ref: 'Classroom'
    },

}, {
    timestamps: true
});

const Event = mongoose.model('Event', eventSchema , 'events');

module.exports = Event;