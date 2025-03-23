import mongoose from "mongoose";
import * as dotenv from "dotenv";
import Guest, { IGuest } from "../models/Guest"; // No `.ts` needed

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";
if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables.");
}

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// Create a new guest
async function addGuest(): Promise<void> {
    try {
        const newGuest: IGuest = new Guest({
            whereFrom: "Family",
            name: "דני כהן",
            phone: "+972500000000",
            attendance: true, // should be Boolean
            guests: 2,
            note: "צמחוני"
        });

        await newGuest.save();
        console.log("✅ Guest saved successfully!");

    } catch (error) {
        console.error("❌ Error saving guest:", (error as Error).message);
    } finally {
        await mongoose.connection.close();
    }
}

// Run it
void addGuest();
