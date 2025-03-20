import mongoose from "mongoose";

// Error Guest Schema
const errorSchema  = new mongoose.Schema({
    whereFrom: String,  // Manually added when uploading CSV
    name: String,       // Guest's name
    phone: { type: String, unique: true }, // Guest's phone number (unique)
    attendance: Boolean,
    guestsShouldBe: Number, // Number of guests should be according to the lists
    guests: { type: Number, default: -1 }, // Number of guests (defaults to -1)
    // -1: didn't answered
    // 0: will not come
    // positive num: number of guests
    numSentMsgs: { type: Number, default: 0 }, // Tracks number of messages sent
    note: String,       // Special requests (vegetarian, allergies, etc.)
    tableNumber: { type: Number, default: null }, // Assigned later if attending
    timestamp: { type: Date, default: Date.now }, // Capture when the error happened
    errorMessage: String // Store error details
});

// Create a Mongoose model
const ErrorLog  = mongoose.model("ErrorLog", errorSchema);

export default ErrorLog;
