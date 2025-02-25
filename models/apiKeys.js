const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    perms: {
        type: [String],
        enum: ['EventHub', 'Admin', 'None'],
        default: 'None'
    }
});

const ApiKeys = mongoose.model('ApiKeys', userSchema);

module.exports = ApiKeys;
