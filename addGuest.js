import mongoose from "mongoose";
import dotenv from "dotenv";
import Guest from "./models/Guest.js"; // Import the Mongoose model

dotenv.config(); // Load environment variables

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// Create a new guest
async function addGuest() {
    try {
        const newGuest = new Guest({
            whereFrom: "Family",
            name: "דני כהן",
            phone: "+972500000000",
            attendance: "כן",
            guests: 2,
            note: "צמחוני"
        });

        await newGuest.save();
        console.log("✅ Guest saved successfully!");

        mongoose.connection.close(); // Close the connection after saving
    } catch (error) {
        console.error("❌ Error saving guest:", error);
        mongoose.connection.close();
    }
}

// Run the function
addGuest();
