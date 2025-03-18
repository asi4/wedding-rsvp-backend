import fs from "fs";
import csv from "csv-parser";

function loadGuestsFromCSV(filePath) {
    return new Promise((resolve, reject) => {
        const guests = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => guests.push(row))
            .on('end', () => resolve(guests))
            .on('error', (err) => reject(err));
    });
}

module.exports = loadGuestsFromCSV;
