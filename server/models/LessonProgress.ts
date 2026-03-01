import mongoose, { Schema, Document } from 'mongoose';

export interface ILessonProgress extends Document {
    lessonId: mongoose.Types.ObjectId;
    userId: string;
    completed: boolean;
    watchedSeconds: number;
    completedAt?: Date;
    createdAt: Date;
}

const LessonProgressSchema: Schema = new Schema(
    {
        lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
        userId: { type: String, required: true },
        completed: { type: Boolean, default: false },
        watchedSeconds: { type: Number, default: 0 },
        completedAt: { type: Date },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<ILessonProgress>('LessonProgress', LessonProgressSchema);
