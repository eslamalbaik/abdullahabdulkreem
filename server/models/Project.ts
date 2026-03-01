import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
    title: string;
    category: string;
    image: string;
    images: string[];
    year: string;
    country?: string;
    field?: string;
    package?: string;
    description?: string;
    strategy?: string;
    behanceUrl?: string;
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true
        },
        image: {
            type: String,
            required: [true, 'Main image is required']
        },
        images: {
            type: [String],
            default: []
        },
        year: {
            type: String,
            required: [true, 'Year is required']
        },
        country: { type: String },
        field: { type: String },
        package: { type: String },
        description: { type: String },
        strategy: { type: String },
        behanceUrl: { type: String },
        featured: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model<IProject>('Project', ProjectSchema);
