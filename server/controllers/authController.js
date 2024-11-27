const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

// Register new user
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        console.log('Registration attempt:', { name, email, role }); // Debug log

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists:', email); // Debug log
            return res.status(400).json({
                message: 'User with this email already exists'
            });
        }

        // Create new user
        const user = new User({
            name,
            email,
            password,
            role: role || 'student' // Default to student if role not specified
        });

        console.log('Attempting to save user:', user); // Debug log

        await user.save();
        console.log('User saved successfully:', user._id); // Debug log

        // Generate token
        const token = user.generateAuthToken();

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: user.toPublicProfile()
        });
    } catch (error) {
        console.error('Registration error:', error); // Debug log
        res.status(400).json({
            message: error.message
        });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email and explicitly select password
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = user.generateAuthToken();

        res.json({
            message: 'Login successful',
            token,
            user: user.toPublicProfile()
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.json({
            user: user.toPublicProfile()
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Check if email is being changed and if it's already taken
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    message: 'Email already in use'
                });
            }
            user.email = email;
        }

        if (name) user.name = name;

        await user.save();

        res.json({
            message: 'Profile updated successfully',
            user: user.toPublicProfile()
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id).select('+password');

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                message: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({
            message: 'Password changed successfully'
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};
