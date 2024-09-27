const mongoose = require('mongoose');

// Define the Exercise schema
const ExerciseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String  // URL or path to the image
    },
    created_by: {
        type: String,  // Coach ID (could be a reference to the User table in MySQL)
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Create the model from the schema
const Exercise = mongoose.model('Exercise', ExerciseSchema);

module.exports = Exercise;
