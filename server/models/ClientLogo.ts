import mongoose, { Schema, Document } from 'mongoose';

export interface IClientLogo extends Document {
    name: string;
    image: string;
    order: number;
    createdAt: Date;
}

const ClientLogoSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        image: { type: String, required: true },
        order: { type: Number, default: 0 },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IClientLogo>('ClientLogo', ClientLogoSchema);
