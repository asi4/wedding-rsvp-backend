import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import Guest from "./models/Guest.js";
import ErrorLog from "./models/ErrorLog.js";

dotenv.config();
console.log("MONGO_URI:", process.env.MONGO_URI);

const app = express();
app.use(cors()); // Allow frontend requests
app.use(bodyParser.json()); // Parse JSON request body

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

// API to save RSVP data
app.post("/rsvp", async (req, res) => {
    try {
        const newGuest = new Guest(req.body);
        await newGuest.save();
        console.log(`✅ RSVP saved for guest: ${newGuest.name}`); // Log success
        res.json({ message: "RSVP saved!" });
    } catch (error) {
        console.error("❌ *** Error saving the RSVP!!! ***");
        console.error("Guest Details:", req.body); // Log full guest details
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
            console.error("❌ Failed to save error log:", logError.message);
        }

        res.status(500).json({ error: "Error saving RSVP" });
    }
});

// Wake-up endpoint
app.get("/wake-up", (req, res) => {
    res.send("Backend is awake!");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));