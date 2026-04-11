import mongoose, { Schema, Document } from 'mongoose';

export interface IDynamicQuestionnaire extends Document {
    title: string;
    description?: string;
    isPublished: boolean;
    slug: string;
    createdAt: Date;
}

const DynamicQuestionnaireSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        isPublished: { type: Boolean, default: false },
        slug: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

export default mongoose.model<IDynamicQuestionnaire>('DynamicQuestionnaire', DynamicQuestionnaireSchema);
