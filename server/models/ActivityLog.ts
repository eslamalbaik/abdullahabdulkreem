import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
    user: mongoose.Types.ObjectId;
    action: string;
    method: string;
    url: string;
    ip: string;
    userAgent: string;
    details?: any;
}

const ActivityLogSchema: Schema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        action: {
            type: String,
            required: true,
        },
        method: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        ip: {
            type: String,
        },
        userAgent: {
            type: String,
        },
        details: {
            type: Schema.Types.Mixed,
        },
    },
    { timestamps: true }
);

// Indexing
ActivityLogSchema.index({ user: 1 });
ActivityLogSchema.index({ createdAt: -1 });

export default mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
