// config/mongodb.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();  // Load environment variables from the .env file

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);  // Exit process with failure
    }
};

module.exports = connectMongoDB;
