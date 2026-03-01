import mongoose, { Schema, Document } from 'mongoose';

export interface ICourseEnrollment extends Document {
    courseId: mongoose.Types.ObjectId;
    userId: string;
    createdAt: Date;
}

const CourseEnrollmentSchema: Schema = new Schema(
    {
        courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        userId: { type: String, required: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<ICourseEnrollment>('CourseEnrollment', CourseEnrollmentSchema);
