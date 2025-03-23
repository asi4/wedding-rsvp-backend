import mongoose, { Document, Schema, Model } from "mongoose";

// Define a TypeScript interface for the guest document
export interface IGuest extends Document {
    whereFrom?: string;
    name: string;
    phone: string;
    attendance: boolean;
    guestsShouldBe?: number;
    guests: number;
    numSentMsgs: number;
    note?: string;
    tableNumber?: number | null;
}

// Define the Mongoose schema
const guestSchema = new Schema<IGuest>({
    whereFrom: { type: String },
    name: { type: String, required: true },
    phone: { type: String, unique: true, required: true },
    attendance: { type: Boolean, required: true },
    guestsShouldBe: { type: Number },
    guests: { type: Number, default: -1 },
    // -1: didn't answered
    // 0: will not come
    // positive num: number of guests
    numSentMsgs: { type: Number, default: 0 },
    note: { type: String },
    tableNumber: { type: Number, default: null }
});

// Export the model
const Guest: Model<IGuest> = mongoose.model<IGuest>("Guest", guestSchema);

export default Guest;
