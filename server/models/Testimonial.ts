import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
    text: string;
    author: string;
    role: string;
    rating: number;
    createdAt: Date;
}

const TestimonialSchema: Schema = new Schema(
    {
        text: { type: String, required: true },
        author: { type: String, required: true },
        role: { type: String, required: true },
        rating: { type: Number, default: 5 },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
