import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestionnaireSubmission extends Document {
    name: string;
    serviceType: string;
    role: string;
    projectInfo?: string;
    socialMedia?: string;
    companySize: string;
    budget: string;
    contactMethod: string;
    email?: string;
    whatsapp?: string;
    instagram?: string;
    status: string;
    createdAt: Date;
}

const QuestionnaireSubmissionSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        serviceType: { type: String, required: true },
        role: { type: String, required: true },
        projectInfo: { type: String },
        socialMedia: { type: String },
        companySize: { type: String, required: true },
        budget: { type: String, required: true },
        contactMethod: { type: String, required: true },
        email: { type: String },
        whatsapp: { type: String },
        instagram: { type: String },
        status: { type: String, default: 'new' },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IQuestionnaireSubmission>('QuestionnaireSubmission', QuestionnaireSubmissionSchema);
