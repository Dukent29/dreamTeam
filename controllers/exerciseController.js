const Exercise = require('../models/Exercise');

// Controller to create a new exercise
exports.createExercise = async (req, res) => {
    try {
        const { title, description, image } = req.body;
        const coachId = req.user.id;  // Assume the logged-in coach's ID is in the token

        // Create the exercise
        const newExercise = new Exercise({
            title,
            description,
            image,  // Could be an image URL or uploaded file
            created_by: coachId
        });

        await newExercise.save();

        res.status(201).json({
            message: 'Exercise created successfully!',
            exercise: newExercise
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error. Could not create exercise.' });
    }
};
