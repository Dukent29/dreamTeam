const db = require('../config/db');

const Coach = {
    // Find an available coach based on category and max children limit
    findAvailableCoachForCategory: async (category_id) => {
        const [rows] = await db.query(
            `SELECT u.id AS user_id, u.first_name, u.last_name, c.max_children,
              (SELECT COUNT(*) FROM children ch WHERE ch.coach_id = u.id) AS assigned_children
       FROM users u
       INNER JOIN coaches c ON u.id = c.user_id
       WHERE u.role = 'coach' AND c.category_id = ?
       HAVING assigned_children < c.max_children
       LIMIT 1`,  // Get only one available coach
            [category_id]
        );
        return rows[0];  // Return the first coach with availability
    },
};

module.exports = Coach;
