const mongoose = require('mongoose');

// Define the Training Session schema
const TrainingSessionSchema = new mongoose.Schema({
    child_id: {
        type: String,  // Could reference the child ID from MySQL
        required: true
    },
    coach_id: {
        type: String,  // Reference to the coach ID from MySQL
        required: true
    },
    training_date: {
        type: Date,
        required: true
    },
    attendance: {
        type: Boolean,
        default: false
    },
    exercise_id: {
        type: mongoose.Schema.Types.ObjectId,  // Reference to an exercise in MongoDB
        ref: 'Exercise'
    }
}, {
    timestamps: true  // Automatically add `createdAt` and `updatedAt`
});

// Create the model from the schema
const TrainingSession = mongoose.model('TrainingSession', TrainingSessionSchema);

module.exports = TrainingSession;
