import * as fs from "fs";
import csv from "csv-parser";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import Guest, { IGuest } from "../models/Guest";

dotenv.config();

const MONGO_URI:string = process.env.MONGO_URI || "";
if (!MONGO_URI) {
    throw new Error("❌ MONGO_URI is not defined in .env");
}

// Connect to MongoDB
mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// Define the structure of each row in the CSV
interface GuestCSVRow {
    whereFrom: string;
    name: string;
    phone: string;
}

// Import guests from CSV
async function importGuestsFromCSV(filePath: string): Promise<void> {
    const guestPromises: Promise<any>[] = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row: GuestCSVRow) => {
            const guestData: Partial<IGuest> = {
                whereFrom: row.whereFrom,
                name: row.name,
                phone: row.phone,
                numSentMsgs: 0,
                tableNumber: null,
                guests: -1,
                attendance: false,
            };

            const promise = Guest.create(guestData)
                .then(() => console.log(`✅ Imported: ${row.name}`))
                .catch((error) => console.error(`❌ Error importing ${row.name}:`, error));

            guestPromises.push(promise);
        })
        .on("end", async () => {
            await Promise.allSettled(guestPromises);
            console.log("🎉 CSV import complete.");
            await mongoose.connection.close();
        });
}

// Run it
void importGuestsFromCSV("guests.csv");
