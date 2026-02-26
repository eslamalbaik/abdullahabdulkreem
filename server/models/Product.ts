import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    imageUrl?: string;
    isDeleted: boolean;
    deletedAt?: Date;
}

const ProductSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        imageUrl: {
            type: String,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

// Indexing
ProductSchema.index({ name: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ isDeleted: 1 });

export default mongoose.model<IProduct>('Product', ProductSchema);
