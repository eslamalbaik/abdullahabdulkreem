import mongoose, { Schema, Document } from 'mongoose';

export type ContactStatus = 'pending' | 'completed';

export interface IContact extends Document {
    name: string;
    email: string;
    projectType: string;
    message: string;
    status: ContactStatus;
    createdAt: Date;
}

const ContactSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        projectType: { type: String, required: true },
        message: { type: String, required: true },
        status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IContact>('Contact', ContactSchema);

