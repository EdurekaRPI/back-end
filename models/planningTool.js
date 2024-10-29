const mongoose = require('mongoose');

const planningToolSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    createdBy: {
        type: String,
        ref: 'User',
        required: true
    },
    approvedBy: {
        type: String,
        ref: 'User',
        default: null
    },
    isApproved: {
        type: Boolean,
        default: false
    }
}, { versionKey: false });

const PlanningTool = mongoose.model('PlanningTool', planningToolSchema);

module.exports = PlanningTool;
