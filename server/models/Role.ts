import mongoose, { Schema, Document } from 'mongoose';

export interface IRole extends Document {
    name: string;
    description?: string;
    permissions: string[];
}

const RoleSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        permissions: [
            {
                type: String,
                required: true,
            },
        ],
    },
    { timestamps: true }
);

// Indexing
RoleSchema.index({ name: 1 });

export default mongoose.model<IRole>('Role', RoleSchema);
