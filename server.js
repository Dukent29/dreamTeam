// server.js
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectMongoDB = require('./config/mongodb');  // MongoDB connection
const db = require('./config/db');  // MySQL connection
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const { APIToolkit } = require("apitoolkit-express");
const parentRoutes = require('./routes/parent');  // Import the new parent routes
const coachRoutes = require('./routes/coach');  // Import the coach routes
const trainingSessionRoutes = require('./routes/trainingSession');


dotenv.config();  // Load environment variables

const app = express();

// Middleware
app.use(bodyParser.json());
const apitoolkitClient = APIToolkit.NewClient({ apiKey: process.env.API_TOOLKIT_API_KEY });
app.use(apitoolkitClient.expressMiddleware);

// Use the auth routes under `/api/auth`
app.use('/api/auth', authRoutes);

// Protected routes (require authentication)
app.use('/api/protected', protectedRoutes);

app.use('/api/parent', parentRoutes);

// Use the coach routes under `/api/coach`
app.use('/api/coach', coachRoutes);

app.use(apitoolkitClient.errorHandler);

// Use the training session routes under `/api/training-sessions`
app.use('/api/training-sessions', trainingSessionRoutes);

// Initialize MongoDB
connectMongoDB();

// MySQL connection test (optional)
db.getConnection((err, connection) => {
    if (err) {
        console.error('MySQL connection error:', err);
        process.exit(1);
    } else {
        console.log('MySQL connected successfully');
        connection.release();  // Release the connection back to the pool
    }
});

// Sample route to test the server
app.get('/', (req, res) => {
    res.send('Hello from the DreamTeam backend!');
});

// Define your routes here, like auth, users, and training sessions

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
