import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const DynamicQuestionnaireSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    isPublished: { type: Boolean, default: false },
    slug: { type: String, required: true, unique: true },
}, { timestamps: true });

const DynamicQuestionSchema = new mongoose.Schema({
    questionnaireId: { type: mongoose.Schema.Types.ObjectId, required: true },
    label: { type: String, required: true },
    type: { type: String, required: true },
    options: [String],
    placeholder: { type: String },
    required: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
});

const DynamicQuestionnaire = mongoose.models.DynamicQuestionnaire || mongoose.model('DynamicQuestionnaire', DynamicQuestionnaireSchema);
const DynamicQuestion = mongoose.models.DynamicQuestion || mongoose.model('DynamicQuestion', DynamicQuestionSchema);

async function seed() {
    try {
        console.log("Connecting to:", process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log("Connected!");

        await DynamicQuestionnaire.deleteOne({ slug: 'brand-questionnaire' });
        
        const q = await DynamicQuestionnaire.create({
            title: 'استبيان العلامة التجارية',
            description: 'أجب على هذه الأسئلة لنتمكن من فهم رؤيتك لعلامتك التجارية.',
            slug: 'brand-questionnaire',
            isPublished: true
        });
        
        const questions = [
            { label: 'الاسم الكامل', type: 'text', placeholder: 'مثلاً: محمد علي', order: 0, required: true },
            { label: 'نوع الخدمة المطلوبة', type: 'select', options: ['identity', 'strategy', 'landing'], order: 1, required: true },
            { label: 'وصف المشروع', type: 'textarea', placeholder: 'احكِ لنا عن مشروعك...', order: 2, required: true },
            { label: 'الميزانية المتوقعة', type: 'number', placeholder: 'بالدولار الكندي', order: 3 },
            { label: 'رابط الموقع الحالي (إن وجد)', type: 'text', order: 4 },
        ];
        
        for (const question of questions) {
            await DynamicQuestion.create({
                questionnaireId: q._id,
                ...question
            });
        }
        console.log("SUCCESS: Created brand-questionnaire");
        process.exit(0);
    } catch (err) {
        console.error("ERROR:", err);
        process.exit(1);
    }
}

seed();
