// middleware/auth.js

const User = require('../models/user');

// Middleware to check if user is authenticated
async function isLoggedIn(req, res, next) {
    try {
        // Check if session contains userId
        if (req.session.userId) {
            // Fetch user details from database using userId stored in session
            const user = await User.findById(req.session.userId);

            if (user) {
                // Attach user information to request object to be used in templates
                req.user = {
                    _id: user._id,
                    name: user.name,
                    image: user.image || '/uploads/default-profile-image.jpg' // Default image if not set
                };
            }
        }
        next(); // Proceed to next middleware or route handler
    } catch (err) {
        console.error('Error in authentication middleware:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    isLoggedIn
};
