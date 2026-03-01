import mongoose, { Schema, Document } from 'mongoose';

export interface ILesson extends Document {
    courseId: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    videoUrl?: string;
    duration?: number;
    order: number;
    isFree: boolean;
    attachments: Array<{ name: string; url: string }>;
    createdAt: Date;
}

const LessonSchema: Schema = new Schema(
    {
        courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        title: { type: String, required: true },
        description: { type: String },
        videoUrl: { type: String },
        duration: { type: Number },
        order: { type: Number, required: true },
        isFree: { type: Boolean, default: false },
        attachments: {
            type: [{ name: String, url: String }],
            default: [],
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<ILesson>('Lesson', LessonSchema);
