require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function createDefaultAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/academic-system', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@admin.com' });
        if (existingAdmin) {
            console.log('Admin account already exists');
            process.exit(0);
        }

        // Create admin user
        const admin = new User({
            name: 'Admin',
            email: 'admin@admin.com',
            password: 'admin123',
            role: 'admin'
        });

        await admin.save();
        console.log('Admin account created successfully');
        console.log('Email: admin@admin.com');
        console.log('Password: admin123');
    } catch (error) {
        console.error('Error creating admin account:', error);
    } finally {
        await mongoose.disconnect();
    }
}

createDefaultAdmin();
