import mongoose from 'mongoose';
import User from '../server/models/User.js';
import dotenv from 'dotenv';
dotenv.config();

async function testPasswordReset() {
    try {
        await mongoose.connect(process.env.DATABASE_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/vi-hub');
        console.log('Connected to DB');

        // Create a dummy user
        const testEmail = 'testreset@example.com';
        await User.deleteOne({ email: testEmail });
        const user = new User({
            name: 'Test Reset',
            email: testEmail,
            password: 'OldPassword123!',
            role: new mongoose.Types.ObjectId()
        });
        await user.save();
        console.log('User created. Hash:', user.password);

        // Fetch like in controller
        const fetchedUser = await User.findById(user._id).select('+password');
        if (!fetchedUser) throw new Error('User not found');
        
        console.log('Fetched user hash:', fetchedUser.password);
        console.log('Is valid pass?', await fetchedUser.comparePassword('OldPassword123!'));

        // Change password
        console.log('Updating password...');
        fetchedUser.password = 'NewPassword123!';
        await fetchedUser.save();
        
        console.log('Password updated. New hash:', fetchedUser.password);
        
        // Fetch again and verify
        const finalUser = await User.findById(user._id).select('+password');
        if (!finalUser) throw new Error('User not found');
        
        console.log('Final user hash:', finalUser.password);
        console.log('Is new valid?', await finalUser.comparePassword('NewPassword123!'));
        console.log('Is old valid?', await finalUser.comparePassword('OldPassword123!'));
    } catch (e) {
        console.error('Test failed:', e);
    } finally {
        await mongoose.disconnect();
    }
}

testPasswordReset();
