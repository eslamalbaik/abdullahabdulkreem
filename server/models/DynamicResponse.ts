import mongoose, { Schema, Document } from 'mongoose';

export interface IDynamicResponse extends Document {
    questionnaireId: mongoose.Types.ObjectId;
    answers: Map<string, any>;
    submittedAt: Date;
}

const DynamicResponseSchema: Schema = new Schema(
    {
        questionnaireId: { type: Schema.Types.ObjectId, ref: 'DynamicQuestionnaire', required: true },
        answers: { type: Map, of: Schema.Types.Mixed, required: true },
    },
    { timestamps: { createdAt: 'submittedAt', updatedAt: false } }
);

export default mongoose.model<IDynamicResponse>('DynamicResponse', DynamicResponseSchema);
