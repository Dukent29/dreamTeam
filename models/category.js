const db = require('../config/db');

const Category = {
    // Find a category by age and return the associated coach
    findByAge: async (age) => {
        const [rows] = await db.query(
            'SELECT * FROM categories WHERE ? BETWEEN min_age AND max_age',
            [age]
        );
        return rows[0];  // Return the first matching category
    },
};

module.exports = Category;
