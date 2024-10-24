const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['student', 'teacher', 'admin'], // You can add more roles as needed
        required: true,
        default: 'student'
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
