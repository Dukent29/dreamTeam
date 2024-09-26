// middleware/auth.js
const jwt = require('jsonwebtoken');

// Middleware to authenticate the JWT token
exports.authenticate = (req, res, next) => {
    // Extract the token from the Authorization header and remove the "Bearer " prefix
    const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : null;

    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify and decode the JWT token

        // Only log in development mode for debugging
        if (process.env.NODE_ENV === 'development') {
            console.log('Token:', token);
            console.log('Decoded Token:', decoded);
            console.log('JWT Secret:', process.env.JWT_SECRET);
        }

        req.user = decoded;  // Attach decoded token payload to req.user
        next();  // Proceed to the next middleware/route
    } catch (err) {
        console.error('JWT verification error:', err);  // Log any error that occurs during verification
        return res.status(400).json({ message: 'Invalid token.' });
    }
};

// Middleware to check if the user is an admin
exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();  // If user is an admin, proceed to the next middleware/route
};

// Middleware to check if the user is a parent
exports.isParent = (req, res, next) => {
    if (req.user.role !== 'parent') {
        return res.status(403).json({ message: 'Access denied. Parents only.' });
    }
    next();  // If user is a parent, proceed to the next middleware/route
};

// Middleware to check if the user is a coach
exports.isCoach = (req, res, next) => {
    if (req.user.role !== 'coach') {
        return res.status(403).json({ message: 'Access denied. Coaches only.' });
    }
    next();  // If user is a coach, proceed to the next middleware/route
};
