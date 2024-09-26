const Child = require('../models/child');
const Category = require('../models/category');
const User = require('../models/user');  // Assuming the coach is stored in the `users` table
const moment = require('moment');

// Controller to add a child (only accessible by parents)
exports.addChild = async (req, res) => {
    try {
        const { first_name, last_name, birthdate } = req.body;

        // Get the logged-in parent ID from the authenticated user (from the token)
        const parentId = req.user.id;

        // Calculate the age based on the birthdate
        const birthYear = moment(birthdate).year();
        const currentYear = moment().year();
        const age = currentYear - birthYear;

        // Check if a child with the same name, birthdate, and parent ID already exists
        const existingChild = await Child.findExistingChild(first_name, last_name, birthdate, parentId);
        if (existingChild) {
            return res.status(400).json({ message: 'A child with the same name and birthdate already exists for this parent.' });
        }

        // Find the child's category based on age
        const category = await Category.findByAge(age);

        if (!category) {
            return res.status(400).json({ message: 'No category available for this age.' });
        }

        // Fetch the coach assigned to this category
        const coachId = category.coach_id;

        if (!coachId) {
            return res.status(400).json({ message: 'No coach assigned for this category.' });
        }

        // Add the child to the database with the assigned coach and category
        const childId = await Child.create({
            first_name,
            last_name,
            birthdate,  // Ensure the birthdate is passed to the create function
            age,
            parent_id: parentId,
            category_id: category.id,
            coach_id: coachId,  // Automatically assign the category's coach
        });

        // Fetch the coach's details from the `users` table
        const coach = await User.findById(coachId);

        // Return a response with the success message and coach details
        res.status(201).json({
            message: 'Child added successfully!',
            childId,
            coach: {
                id: coach.id,
                first_name: coach.first_name,
                last_name: coach.last_name,
                email: coach.email,
                phone_number: coach.phone_number
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error. Could not add child.' });
    }
};
