import mongoose, { Schema, Document } from 'mongoose';

export interface ICourseTestimonial extends Document {
    courseId: mongoose.Types.ObjectId;
    userId?: string;
    name: string;
    image?: string;
    title?: string;
    rating: number;
    comment: string;
    adminReply?: string;
    createdAt: Date;
}

const CourseTestimonialSchema: Schema = new Schema(
    {
        courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        userId: { type: String }, // User ID from auth system
        name: { type: String, required: true },
        image: { type: String },
        title: { type: String },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        adminReply: { type: String },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<ICourseTestimonial>('CourseTestimonial', CourseTestimonialSchema);
