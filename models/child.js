const db = require('../config/db');

const Child = {
    // Create a new child
    create: async (childData) => {
        const { first_name, last_name, birthdate, age, parent_id, category_id, coach_id } = childData;

        const [result] = await db.query(
            'INSERT INTO children (first_name, last_name, birthdate, age, parent_id, category_id, coach_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [first_name, last_name, birthdate, age, parent_id, category_id, coach_id]
        );
        return result.insertId;
    },

    // Check if a child with the same name, birthdate, and parent_id exists
    findExistingChild: async (first_name, last_name, birthdate, parent_id) => {
        const [rows] = await db.query(
            'SELECT * FROM children WHERE first_name = ? AND last_name = ? AND birthdate = ? AND parent_id = ?',
            [first_name, last_name, birthdate, parent_id]
        );
        return rows[0];  // Return the first match (or null if none found)
    },

    findByCoachId: async (coachId) => {
        const [rows] = await db.query(
            'SELECT c.id, c.first_name, c.last_name, c.birthdate, c.age, cat.category_name FROM children c INNER JOIN categories cat ON c.category_id = cat.id WHERE c.coach_id = ?',
            [coachId]
        );
        return rows;
    },
};

module.exports = Child;
