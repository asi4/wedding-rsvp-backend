import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Guest from "./models/Guest";
import ErrorLog from "./models/ErrorLog";

dotenv.config();

const app: Express = express();
app.use(cors()); // Allow frontend requests
app.use(express.json()); // Parse JSON request body

const MONGO_URI: string = process.env.MONGO_URI || "";
if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables.");
}
console.log("MONGO_URI:", MONGO_URI);

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// API to save RSVP data
app.post("/rsvp", async (req: Request, res: Response): Promise<any> => {
    const { phone, name, attendance, guests, note } = req.body;

    try {
        const existingGuest = await Guest.findOne({ phone });

        if (existingGuest) {
            const noChanges: boolean =
                existingGuest.name === name &&
                existingGuest.attendance === attendance &&
                existingGuest.guests === parseInt(guests) &&
                existingGuest.note === note;

            if (noChanges) {
                console.log(`Guest "${name}", -${phone}- submitted unchanged RSVP.`);
                return res.json({ message: "RSVP already exists. No changes made." });
            }

            // Update guest
            existingGuest.name = name;
            existingGuest.attendance = attendance;
            existingGuest.guests = guests;
            existingGuest.note = note;

            await existingGuest.save();
            console.log(`🔁 Guest "${name}", -${phone}- updated their RSVP.`);
            return res.json({ message: "RSVP updated." });
        } else {
            const newGuest = new Guest(req.body);
            await newGuest.save();
            console.log(`✅ New RSVP saved for guest: ${name}`);
            return res.json({ message: "RSVP saved!" });
        }

    } catch (error: any) {
        console.error("❌ Error saving the RSVP!");
        console.error("Guest Details:", req.body);
        console.error("Error:", error.message);

        // Save the error to the Errors collection
        try {
            const errorEntry = new ErrorLog({
                ...req.body, // Save guest details
                errorMessage: error.message
            });
            await errorEntry.save();
            console.log("⚠️ Error logged in the Errors collection.");
        } catch (logError) {
            console.error(`❌ Failed to save error log in guest -${req.body}-:`, logError.message);
        }

        return res.status(500).json({ error: "Error saving RSVP" });
    }
});

// Wake-up endpoint
app.get("/wake-up", (req, res) => {
    res.send("Backend is awake!");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));