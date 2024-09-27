const mongoose = require('mongoose');

// Define the Training Session schema
const TrainingSessionSchema = new mongoose.Schema({
    child_id: {
        type: String,  // This can reference the child ID from MySQL or MongoDB
        required: true,
    },
    coach_id: {
        type: String,  // This references the coach ID from MySQL
        required: true,
    },
    training_date: {
        type: Date,
        required: true,
    },
    attendance: {
        type: Boolean,
        default: false,  // Default to false (absent) unless explicitly marked as present
    }
}, {
    timestamps: true  // This automatically adds `createdAt` and `updatedAt` fields
});

// Create the TrainingSession model
const TrainingSession = mongoose.model('TrainingSession', TrainingSessionSchema);

module.exports = TrainingSession;
