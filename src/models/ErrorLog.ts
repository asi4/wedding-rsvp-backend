import mongoose, { Schema, Document, Model } from "mongoose";

// Define the TypeScript interface
export interface IErrorLog extends Document {
    whereFrom?: string;
    name?: string;
    phone?: string;
    attendance?: boolean;
    guestsShouldBe?: number;
    guests?: number;
    numSentMsgs?: number;
    note?: string;
    tableNumber?: number | null;
    timestamp?: Date;
    errorMessage: string;
}

// Define the Mongoose schema
const errorSchema = new Schema<IErrorLog>({
    whereFrom: String,
    name: String,
    phone: { type: String }, // in error the phone is not unique
    attendance: Boolean,
    guestsShouldBe: Number,
    guests: { type: Number, default: -1 },
    // -1: didn't answered
    // 0: will not come
    // positive num: number of guests
    numSentMsgs: { type: Number, default: 0 },
    note: String,
    tableNumber: { type: Number, default: null },
    timestamp: { type: Date, default: Date.now },
    errorMessage: { type: String, required: true }
});

// Export the model
const ErrorLog: Model<IErrorLog> = mongoose.model<IErrorLog>("ErrorLog", errorSchema);

export default ErrorLog;
