const Child = require('../models/child');

// Controller to get children assigned to the logged-in coach
exports.getMyChildren = async (req, res) => {
    try {
        const coachId = req.user.id;  // The logged-in coach's ID from the JWT

        // Fetch all children where the coach_id matches the logged-in coach's ID
        const children = await Child.findByCoachId(coachId);

        if (!children.length) {
            return res.status(404).json({ message: 'No children assigned to this coach.' });
        }

        res.status(200).json({
            message: 'Children retrieved successfully.',
            children
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error. Could not retrieve children.' });
    }
};
