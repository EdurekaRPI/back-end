const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Student', 'Admin'],
        default: 'Student'
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
