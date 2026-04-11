import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const QuestionnaireSubmissionSchema = new mongoose.Schema({
    name: String,
    serviceType: String,
    role: String,
    projectInfo: String,
    socialMedia: String,
    companySize: String,
    budget: String,
    contactMethod: String,
    email: String,
    whatsapp: String,
    instagram: String,
}, { timestamps: true });

const QuestionnaireSubmission = mongoose.models.QuestionnaireSubmission || mongoose.model('QuestionnaireSubmission', QuestionnaireSubmissionSchema);

async function check() {
    await mongoose.connect(process.env.MONGODB_URI!);
    const count = await QuestionnaireSubmission.countDocuments();
    const latest = await QuestionnaireSubmission.find().sort({ createdAt: -1 }).limit(5);
    console.log(`Total legacy submissions: ${count}`);
    console.log('Latest submissions:', JSON.stringify(latest, null, 2));
    process.exit(0);
}

check();
