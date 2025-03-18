import pkg from 'twilio';
const { Twilio } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Define your form base URL (Replace with actual hosted link)
const RSVP_FORM_URL = "https://weddingme.netlify.app";

export function sendSMS(to) {
    // Create a personalized RSVP link with query parameters
    const rsvpLink= `${RSVP_FORM_URL}?phone=${encodeURIComponent(to)}`;

    // SMS Message with RSVP link
    const message = `משפחה וחברים יקרים!\n    אנא עדכנו הגעתם בקישור הבא:\n${rsvpLink}`;

    client.messages.create({
        body: message,
        messagingServiceSid: "MGf3645b48c349204e3bcf23d6e5405316",
        to: to
    }).then(msg => console.log(`Message sent to ${to}: ${msg.sid}`))
        .catch(error => console.error(`Failed to send message to ${to}:`, error));
}

// Example Usage:
sendSMS("+972542388943");
