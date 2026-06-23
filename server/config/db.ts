import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    if (!process.env.MONGODB_URI) {
        console.warn('⚠️  MONGODB_URI not set — MongoDB features will be disabled');
        return;
    }
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI as string);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`❌ MongoDB connection failed: ${error.message}`);
        if (error.message.includes('whitelist') || error.message.includes('IP')) {
            console.error('👉 Fix: Go to MongoDB Atlas → Network Access → Add your IP: 213.6.138.123');
        }
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
        // In development, continue without MongoDB
        console.warn('⚠️  Continuing without MongoDB (development mode)');
    }
};

export default connectDB;
