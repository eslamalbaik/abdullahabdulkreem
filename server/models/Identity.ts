import mongoose, { Schema, Document } from 'mongoose';

export interface IIdentity extends Document {
    title: string;
    description: string;
    price: number;
    image: string;
    images?: string[];
    includes: string[];
    featured: boolean;
    createdAt: Date;
}

const IdentitySchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        images: { type: [String], default: [] },
        includes: { type: [String], required: true },
        featured: { type: Boolean, default: false },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IIdentity>('Identity', IdentitySchema);
