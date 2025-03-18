import fs from "fs";
import csv from "csv-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Guest from "./models/Guest.js"; // Import your Mongoose model

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

async function importGuestsFromCSV(filePath) {
    fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", async (row) => {
            try {
                await Guest.create({
                    whereFrom: row.whereFrom,
                    name: row.name,
                    phone: row.phone,
                    numSentMsgs: 0, // Start at 0
                    tableNumber: null, // No table assigned yet
                });
                console.log(`✅ Imported: ${row.name}`);
            } catch (error) {
                console.error(`❌ Error importing ${row.name}:`, error);
            }
        })
        .on("end", () => {
            console.log("🎉 CSV import complete.");
            mongoose.connection.close(); // Close connection after import
        });
}

// Run import function
importGuestsFromCSV("guests.csv");
