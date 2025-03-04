const TrainingSession = require('../models/TrainingSession');
const Child = require('../models/child');  // Assuming children are stored in MySQL
const User = require('../models/user');  // Assuming coaches are stored in MySQL
const Category = require('../models/category');
const transporter = require('../config/nodemailer');
const Exercise = require('../models/Exercise');  // Add the Exercise model

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

// Controller to create a training session for all children in the coach's category
exports.addCategoryTrainingSession = async (req, res) => {
    try {
        const { category_id, training_date, exercise_id } = req.body;
        const loggedInCoachId = req.user.id;  // Get logged-in coach ID from the JWT

        // Step 1: Verify that the logged-in user is a coach
        const coach = await User.findById(loggedInCoachId);
        if (!coach || coach.role !== 'coach') {
            return res.status(403).json({ message: 'Only coaches can create training sessions.' });
        }

        // Step 2: Verify that the coach is assigned to this category
        const category = await Category.findById(category_id);
        if (!category || category.coach_id !== loggedInCoachId) {
            return res.status(403).json({ message: 'You are not assigned to this category.' });
        }

        // Step 3: Fetch all children in this category
        const childrenInCategory = await Child.findByCategoryId(category_id);
        if (!childrenInCategory.length) {
            return res.status(404).json({ message: 'No children found in this category.' });
        }

        // Step 4: Fetch the exercise details
        const exercise = await Exercise.findById(exercise_id);
        if (!exercise) {
            return res.status(404).json({ message: 'Exercise not found.' });
        }

        const sessionsCreated = [];

        // Step 5: Loop through each child in the category and create a training session
        for (let child of childrenInCategory) {
            const newSession = new TrainingSession({
                child_id: child.id,
                coach_id: loggedInCoachId,
                training_date,
                exercise_id,  // Link to the exercise ID
                attendance: false  // Default attendance as false (not marked)
            });

            await newSession.save();
            sessionsCreated.push(newSession);  // Add the session to the array

            // Step 6: Send email to the parent
            const parent = await User.findById(child.parent_id);  // Assuming parent_id exists

            if (parent) {
                // Prepare the parent's title and child's name
                const parentTitle = parent.title || 'Mr./Ms.';  // Default to 'Mr./Ms.' if no title
                const childName = `<b>${child.first_name}</b>`;  // Bold the child's first name

                // Send the email
                await transporter.sendMail({
                    from: process.env.EMAIL_USERNAME,
                    to: parent.email,
                    subject: `Training Session for ${child.first_name}`,  // Email subject
                    html: `
                        Dear ${parentTitle} ${parent.last_name},<br><br>
                        A training session has been created for your child ${childName} on ${training_date}.<br>
                        The assigned exercise is: <b>${exercise.title}</b>.<br><br>
                        Best regards,<br>
                        Your Coaching Team
                    `
                });
            }
        }

        // Step 7: Return a response with all the created sessions
        res.status(201).json({
            message: 'Training sessions for the category created successfully!',
            sessions: sessionsCreated
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error. Could not create training sessions.' });
    }
};