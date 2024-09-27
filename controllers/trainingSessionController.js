const TrainingSession = require('../models/TrainingSession');
const Child = require('../models/child');  // Assuming children are stored in MySQL
const User = require('../models/user');  // Assuming coaches are stored in MySQL

// Controller to add a new training session (only for assigned children)
exports.addTrainingSession = async (req, res) => {
    try {
        const { child_id, training_date } = req.body;
        const loggedInCoachId = req.user.id;  // Get logged-in coach ID from the JWT

        // Step 1: Verify that the logged-in user is indeed a coach
        const coach = await User.findById(loggedInCoachId);
        if (!coach || coach.role !== 'coach') {
            return res.status(403).json({ message: 'Only coaches can create training sessions.' });
        }

        // Step 2: Ensure the child exists and is assigned to this coach
        const child = await Child.findById(child_id);

        if (!child) {
            return res.status(404).json({ message: 'Child not found.' });
        }

        // Check if the child is assigned to this coach (based on the child's coach_id)
        if (child.coach_id !== loggedInCoachId) {
            return res.status(403).json({ message: 'You are not assigned to this child.' });
        }

        // Step 3: Create the training session
        const newSession = new TrainingSession({
            child_id,
            coach_id: loggedInCoachId,  // Use the logged-in coach's ID
            training_date
        });

        await newSession.save();

        res.status(201).json({
            message: 'Training session added successfully!',
            session: newSession
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error. Could not add training session.' });
    }
};


exports.getTrainingSessionsForCoach = async (req, res) => {
    try {
        const coachId = req.user.id;  // Assuming the coach is authenticated

        const sessions = await TrainingSession.find({ coach_id: coachId });

        if (!sessions.length) {
            return res.status(404).json({ message: 'No training sessions found for this coach.' });
        }

        res.status(200).json({
            message: 'Training sessions retrieved successfully.',
            sessions
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error. Could not retrieve training sessions.' });
    }
};
