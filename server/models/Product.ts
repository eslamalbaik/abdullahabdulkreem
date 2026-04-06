import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    title?: string;
    description?: string;
    price: number;
    category: string;
    stock: number;
    image?: string;
    imageUrl?: string;
    featured: boolean;
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
        title: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: '',
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
            min: 0,
            default: 0,
        },
        image: {
            type: String,
        },
        imageUrl: {
            type: String,
        },
        featured: {
            type: Boolean,
            default: false,
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

// Virtual: always resolve image from image or imageUrl
ProductSchema.virtual('resolvedImage').get(function(this: IProduct) {
    return this.image || this.imageUrl || '';
});

// Pre-save: sync image and imageUrl
ProductSchema.pre('save', function(next) {
    if (this.image && !this.imageUrl) {
        this.imageUrl = this.image as string;
    } else if (this.imageUrl && !this.image) {
        this.image = this.imageUrl as string;
    }
    // Sync name/title
    if (!this.name && this.title) {
        this.name = this.title as string;
    } else if (this.name && !this.title) {
        this.title = this.name as string;
    }
    next();
});

// Indexing
ProductSchema.index({ name: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ isDeleted: 1 });

export default mongoose.model<IProduct>('Product', ProductSchema);
