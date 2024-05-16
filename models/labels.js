const mongoose = require('mongoose');

const labelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        default: new Date()
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Reference to the User model
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users' // Reference to the User model
    }
});

module.exports = labelSchema;
