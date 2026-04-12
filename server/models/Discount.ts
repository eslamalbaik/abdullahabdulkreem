import mongoose, { Schema, Document } from 'mongoose';

export interface IDiscount extends Document {
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
    startDate: Date;
    endDate: Date;
    scope: 'product' | 'identity' | 'both';
    applicableItems: mongoose.Types.ObjectId[]; // IDs of Products or Identities
    active: boolean;
    isGlobal: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const DiscountSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ['percentage', 'fixed'],
            required: true,
        },
        value: {
            type: Number,
            required: true,
            min: 0,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        scope: {
            type: String,
            enum: ['product', 'identity', 'both'],
            required: true,
            default: 'both',
        },
        applicableItems: {
            type: [Schema.Types.ObjectId],
            default: [],
        },
        active: {
            type: Boolean,
            default: true,
        },
        isGlobal: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Basic validation: percentage cannot exceed 100
DiscountSchema.pre('save', function(next) {
    if (this.type === 'percentage' && this.value > 100) {
        return next(new Error('Percentage discount cannot exceed 100%'));
    }
    if (this.endDate <= this.startDate) {
        return next(new Error('End date must be after start date'));
    }
    next();
});

// Indexing for efficient active discount querying
DiscountSchema.index({ active: 1, startDate: 1, endDate: 1 });
DiscountSchema.index({ isGlobal: 1 });

export default mongoose.model<IDiscount>('Discount', DiscountSchema);
