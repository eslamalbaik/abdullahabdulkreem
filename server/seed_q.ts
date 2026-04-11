import mongoose from 'mongoose';
import DynamicQuestionnaire from './models/DynamicQuestionnaire.js';
import DynamicQuestion from './models/DynamicQuestion.js';
import dotenv from 'dotenv';
dotenv.config();

async function seed() {
    await mongoose.connect(process.env.MONGODB_URI!);
    
    let q = await DynamicQuestionnaire.findOne({ slug: 'brand-questionnaire' });
    if (!q) {
        q = await DynamicQuestionnaire.create({
            title: 'استبيان العلامة التجارية',
            description: 'أجب على هذه الأسئلة لنتمكن من فهم رؤيتك لعلامتك التجارية.',
            slug: 'brand-questionnaire',
            isPublished: true
        });
        
        const questions = [
            { label: 'الاسم الكامل', type: 'text', placeholder: 'مثلاً: محمد علي', order: 0 },
            { label: 'نوع الخدمة المطلوبة', type: 'select', options: ['identity', 'strategy', 'landing'], order: 1 },
            { label: 'وصف المشروع', type: 'textarea', placeholder: 'احكِ لنا عن مشروعك...', order: 2 },
            { label: 'الميزانية المتوقعة', type: 'number', placeholder: 'بالدولار الكندي', order: 3 },
            { label: 'رابط الموقع الحالي (إن وجد)', type: 'text', order: 4 },
        ];
        
        for (const question of questions) {
            await DynamicQuestion.create({
                questionnaireId: q._id,
                ...question
            });
        }
        console.log("Created default dynamic questionnaire.");
    } else {
        console.log("Questionnaire 'brand-questionnaire' already exists.");
    }
    
    process.exit(0);
}

seed();
