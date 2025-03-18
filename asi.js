import CryptoJS from "crypto-js";

const TWILIO_ACCOUNT_SID = "AC50a6270b52f8478fed627c77d7b485af"; // Example AES encrypted username
const encryptedPassword = "U2FsdGVkX1+LKyhX7+JSD==";
const secretKey = "asiSec123"; // Must be the same as the encryption key

const encryptedTWILIO_ACCOUNT_SID = String(CryptoJS.AES.encrypt(TWILIO_ACCOUNT_SID, secretKey));
const decryptedTWILIO_ACCOUNT_SID = String(CryptoJS.AES.decrypt(encryptedTWILIO_ACCOUNT_SID, secretKey));
const decryptedPassword = CryptoJS.AES.decrypt(encryptedPassword, secretKey).toString(CryptoJS.enc.Utf8);

console.log("encryptedTWILIO_ACCOUNT_SID - ", encryptedTWILIO_ACCOUNT_SID);
console.log("decryptedTWILIO_ACCOUNT_SID - ", decryptedTWILIO_ACCOUNT_SID);
