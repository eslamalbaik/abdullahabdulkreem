import mongoose from 'mongoose';
import DynamicQuestionnaire from './models/DynamicQuestionnaire.js';
import DynamicResponse from './models/DynamicResponse.js';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
    await mongoose.connect(process.env.MONGODB_URI!);
    const questionnaires = await DynamicQuestionnaire.find();
    const responses = await DynamicResponse.find();
    console.log("Questionnaires:", questionnaires.length);
    console.log("Responses:", responses.length);
    if (responses.length > 0) {
        console.log("Latest response:", JSON.stringify(responses[responses.length - 1], null, 2));
    }
    process.exit(0);
}

check();
