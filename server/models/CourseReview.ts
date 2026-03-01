import mongoose, { Schema, Document } from 'mongoose';

export interface ICourseReview extends Document {
    courseId: mongoose.Types.ObjectId;
    userId: string;
    rating: number;
    comment?: string;
    createdAt: Date;
}

const CourseReviewSchema: Schema = new Schema(
    {
        courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        userId: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<ICourseReview>('CourseReview', CourseReviewSchema);
