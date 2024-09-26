// models/user.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
    // Find a user by email
    findByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },

    // Create a new user with a confirmation token
    create: async (first_name, last_name, email, phone_number, password, role, confirmationToken) => {
        const [result] = await db.query(
            'INSERT INTO users (first_name, last_name, email, phone_number, password, role, confirmation_token, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, phone_number, password, role, confirmationToken, false]  // Set is_active to false
        );
        return result.insertId;
    },

    // Find a user by confirmation token
    findByToken: async (token) => {
        const [rows] = await db.query('SELECT * FROM users WHERE confirmation_token = ?', [token]);
        return rows[0];
    },

    // Activate the user's account after confirming the email
    activateAccount: async (id) => {
        await db.query('UPDATE users SET is_active = ?, confirmation_token = NULL WHERE id = ?', [true, id]);
    },

    findById: async (id) => {
        const [rows] = await db.query(
            'SELECT id, first_name, last_name, email, phone_number FROM users WHERE id = ? AND role = "coach"',
            [id]
        );
        return rows[0];  // Return the first matching coach
    },
};

module.exports = User;
