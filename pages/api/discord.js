/**
 * ./api/discord.js
 * Accepts: Discord formatted webhook requests with/without a webhookURL variable
 * Sends: Discord formatted webhook requests to the specified webhookURL or the default webhookURL
 * Returns: 200 OK
 * */

/** Example of json data
 * [
 *   {
 *   content: 'content',
 *   username: 'username',
 *   avatar_url: 'avatar_url',
 *   embeds: [embed],
 *   }
 * ]
 * */
const {extractWebhookIdAndToken} = require('../../middleware/handler')

let variables = {
    content: "content",
    username: "username",
    avatar_url: "avatar_url",
    embeds: "embeds",
}

// Import the Axios library
const axios = require('axios');

// Define the default export as an async function
export default async (req, res) => {
    // Determine the webhook URL to use
    // If the request contains a webhookURL variable, use that
    // Otherwise, use the default webhook URL
    let webhookURL = req.body.webhookURL || process.env.DISCORD_WEBHOOK_URL;

    // Extract the webhook ID and token from the webhook URL
    let { webhookID, webhookToken } = extractWebhookIdAndToken(webhookURL);

    // Destructure the content, username, avatar_url, and embeds properties from the request body
    const { content, username, avatar_url, embeds } = req.body;

    // Create the discordObject object
    const discordObject = {
        content,
        username,
        avatar_url,
        embeds,
    };

    try {
        // Send a POST request to the Discord webhook URL with the discordObject as the request body
        const response = await axios.post(`https://discord.com/api/webhooks/${webhookID}/${webhookToken}`, discordObject);
        // If the response status is 204, return a success message to the client
        if (response.status === 204) {
            res.status(200).send('Message successfully sent to Discord');
        }
        // Otherwise, return a server error message to the client
        else {
            res.status(500).send('Error sending message to Discord');
        }
    } catch (error) {
        // If there was an error sending the request, log the error and return a server error message to the client
        console.error(error);
        res.status(500).send('Error sending message to Discord');
    }
};