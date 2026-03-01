import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteConfig extends Document {
    key: string;
    value: string;
    updatedAt: Date;
}

const SiteConfigSchema: Schema = new Schema(
    {
        key: { type: String, required: true, unique: true },
        value: { type: String, required: true },
    },
    { timestamps: { createdAt: false, updatedAt: true } }
);

export default mongoose.model<ISiteConfig>('SiteConfig', SiteConfigSchema);
