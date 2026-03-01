import mongoose, { Schema, Document } from 'mongoose';

export interface IArticle extends Document {
    title: string;
    slug: string;
    excerpt: string;
    content?: string;
    date: string;
    readTime: string;
    published: boolean;
    createdAt: Date;
}

const ArticleSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        excerpt: { type: String, required: true },
        content: { type: String },
        date: { type: String, required: true },
        readTime: { type: String, required: true },
        published: { type: Boolean, default: false },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IArticle>('Article', ArticleSchema);
