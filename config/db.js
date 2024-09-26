// config/db.js
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();  // Load environment variables from the .env file

// Create MySQL connection pool
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    waitForConnections: true,
    connectionLimit: 10,  // Adjust based on server load
    queueLimit: 0  // No limit on queued queries
});

// Retry logic to handle connection failures
const connectWithRetry = () => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('MySQL connection error:', err.message);
            console.error('Retrying connection in 5 seconds...');
            setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
        } else {
            console.log('MySQL connected successfully');
            connection.release(); // Release the connection back to the pool
        }
    });
};

// Start the connection retry process
connectWithRetry();

module.exports = pool.promise();  // Export the promise-based connection pool for async/await use
