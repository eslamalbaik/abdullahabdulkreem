import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
    title: string;
    description?: string;
    image?: string;
    price: number;
    published: boolean;
    totalHours?: number;
    devices?: string;
    certificates?: string;
    courseInfo?: string;
    createdAt: Date;
}

const CourseSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        image: { type: String },
        price: { type: Number, required: true },
        published: { type: Boolean, default: false },
        totalHours: { type: Number },
        devices: { type: String },
        certificates: { type: String },
        courseInfo: { type: String },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<ICourse>('Course', CourseSchema);
