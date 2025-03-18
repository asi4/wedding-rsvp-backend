import mongoose from "mongoose";

const guestSchema = new mongoose.Schema({
    whereFrom: String,  // Manually added when uploading CSV
    name: String,       // Guest's name
    phone: { type: String, unique: true, required: true }, // Guest's phone number (unique)
    attendance: { type: String, default: "לא ידוע" }, // "כן", "לא", "אולי"
    guests: { type: Number, default: 1 }, // Number of guests (defaults to 1)
    numSentMsgs: { type: Number, default: 0 }, // Tracks number of messages sent
    note: String,       // Special requests (vegetarian, allergies, etc.)
    tableNumber: { type: Number, default: null } // Assigned later if attending
});

// Create a Mongoose model
const Guest = mongoose.model("Guest", guestSchema);

export default Guest;
