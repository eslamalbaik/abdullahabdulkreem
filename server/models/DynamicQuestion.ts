import mongoose, { Schema, Document } from 'mongoose';

export interface IDynamicQuestion extends Document {
    questionnaireId: mongoose.Types.ObjectId;
    type: 'text' | 'paragraph' | 'number' | 'select' | 'checkbox' | 'radio';
    label: string;
    description?: string;
    required: boolean;
    options?: string[];
    order: number;
    createdAt: Date;
}

const DynamicQuestionSchema: Schema = new Schema(
    {
        questionnaireId: { type: Schema.Types.ObjectId, ref: 'DynamicQuestionnaire', required: true },
        type: { 
            type: String, 
            enum: ['text', 'paragraph', 'number', 'select', 'checkbox', 'radio'], 
            required: true 
        },
        label: { type: String, required: true },
        description: { type: String },
        required: { type: Boolean, default: false },
        options: { type: [String], default: [] },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.model<IDynamicQuestion>('DynamicQuestion', DynamicQuestionSchema);
