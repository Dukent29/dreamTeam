// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');  // Adjust path based on structure
const transporter = require('../config/nodemailer'); // Email configuration
const crypto = require('crypto'); // To generate a unique confirmation token

exports.register = async (req, res) => {
    const { first_name, last_name, email, phone_number, password, role } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate a hashed password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a unique confirmation token
        const confirmationToken = crypto.randomBytes(32).toString('hex');

        // Create the new user but mark them as inactive (unconfirmed)
        const userId = await User.create(first_name, last_name, email, phone_number, hashedPassword, role, confirmationToken);

        // Generate the confirmation URL
        const confirmationUrl = `http://localhost:5000/api/auth/confirm/${confirmationToken}`;

        // Send the confirmation email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Confirm your email address',
            html: `<h2>Hello ${first_name},</h2>
             <p>Please confirm your email address by clicking the link below:</p>
             <a href="${confirmationUrl}">Confirm your email</a>`,
        });

        res.status(201).json({ message: 'Registration successful. Please check your email to confirm your account.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findByEmail(email);
        if (!user || !user.is_active) {
            return res.status(400).json({ message: 'Account not activated or invalid email/password.' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Confirm email by verifying the token
exports.confirmEmail = async (req, res) => {
    const { token } = req.params;

    try {
        // Find the user by the confirmation token
        const user = await User.findByToken(token);
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        // Activate the user's account
        await User.activateAccount(user.id);

        res.status(200).json({ message: 'Email confirmed. You can now log in.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

