/**
 * AgriMastery Welcome Service
 * Sends automated greetings to new Farmers
 */

const twilio = require('twilio');

// These would be moved to a .env file for security in Layer 6
const accountSid = 'YOUR_TWILIO_ACCOUNT_SID'; 
const authToken = 'YOUR_TWILIO_AUTH_TOKEN'; 
const client = new twilio(accountSid, authToken);

async function sendWelcomeSMS(farmerPhone, farmerName) {
    try {
        const message = await client.messages.create({
            body: \Hello \! Welcome to AgriMastery. Your journey to becoming a Verified Master Farmer starts now. Access your first course here: https://bit.ly/agrimastery\,
            from: '+1234567890', // Your Twilio Number
            to: farmerPhone
        });
        console.log("Welcome SMS sent! SID: " + message.sid);
    } catch (error) {
        console.error("SMS failed to send:", error.message);
    }
}

module.exports = { sendWelcomeSMS };
