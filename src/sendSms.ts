import * as twilio from "twilio";
import * as dotenv from "dotenv";

dotenv.config();

// Check for required environment variables
const accountSid: string = process.env.TWILIO_ACCOUNT_SID;
const authToken: string = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid: string = process.env.TWILIO_MSG_SERVICE_SID || "MGf3645b48c349204e3bcf23d6e5405316";

if (!accountSid || !authToken) {
    throw new Error("❌ Missing Twilio credentials in environment variables.");
}

const client = new twilio.Twilio(accountSid, authToken)

// The RSVP Form's public URL
const RSVP_FORM_URL: string = "https://weddingme.netlify.app";

// Define function signature
export async function sendSMS(to: string): Promise<void> {
    const rsvpLink: string = `${RSVP_FORM_URL}?phone=${encodeURIComponent(to)}`;
    const message: string = `משפחה וחברים יקרים!\nאנא עדכנו הגעתכם בקישור הבא:\n${rsvpLink}`;

    try {
        const msg = await client.messages.create({
            body: message,
            messagingServiceSid,
            to,
        });

        console.log(`✅ Message sent to ${to}: ${msg.sid}`);
    } catch (error: any) {
        console.error(`❌ Failed to send message to ${to}:`, error.message || error);
    }
}

// Example usage (you can remove this if importing elsewhere)
void sendSMS("+972542388943");
