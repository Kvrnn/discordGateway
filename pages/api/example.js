/**
 * ./api/example.js
 * Accepts: Name of Signals it receives
 * Sends: Probably a discordObject to /api/discord
 * Returns: 200 OK
 * */

// Make a detailed comment about the format of the data you expect to receive
// Easiest way to do this is to ping /api/print first and then copy the response and paste it here
/** Example of json data
 * [
 *   {
 *     timestamp: '2022-12-31T16:28:21.819854938Z',
 *     version: 1,
 *     type: 'nodeAuthorized',
 *     tailnet: '<tailnetName>',
 *     message: 'Node <nameOfNode> authorized',
 *     data: {
 *       nodeID: '<>',
 *       url: 'https://login.tailscale.com/admin/machines/<ipaddressOfNode>',
 *       deviceName: '<>.ts.net',
 *       managedBy: '<>',
 *       actor: '<nameOfExecutor>'
 *     }
 *   }
 * ]
 * */

// Import the Axios library
const axios = require('axios');
// Import the DiscordObject class
const DiscordObject  = require('../../middleware/discordObject');

export default async (req, res) => {
    // || \\ // || \\ // || \\ START EDITING // || \\ // || \\ // || \\
    // If your data is json formatted, you can destructure it like this:
    // If it's not then you can use a helper function extractKeys() to get a list of all possible keys.
    // Note that the helper function is still under development and may not work as expected.
    let {timestamp, version, type, tailnet, message, data} = req.body;
    // If you need to access a nested object, you can destructure it like this:
    let {nodeID, url, deviceName, managedBy, actor} = data;

    const discordObject = new DiscordObject();

    // Set the username and avatar of the webhook (Optional)
    discordObject.setUserName("TailScale");
    discordObject.setAvatarUrl("https://avatars.githubusercontent.com/u/48932923");

    // For a webhook, you must have either an embed or a message. You can have both, but you cannot send an empty webhook.

    // Add a message to the webhook
    discordObject.setContent("This is a test message");

    // Add an embed to the webhook. You can add upto 10 embeds per webhook.
    discordObject.addEmbed(
        {
            title: `Tailnet: ${tailnet}`,
            url: url,
            description: `NodeID: ${nodeID}\n${message} by ${actor} \nVersion: ${version} \nType: ${type}`,
            footer: {
                text: `Device Name: ${deviceName} | Managed By: ${managedBy}`,
            },
            timestamp: timestamp,
        }
    )
    // || \\ // || \\ // || \\ STOP EDITING // || \\ // || \\ // || \\

    // Send a POST request to the Discord endpoint with the discordObject as the request body
    axios.post('/api/discord/', discordObject.toJSON(), {
        baseURL: process.env.baseURL,
    })
        .then((response) => {
            if (response.status === 200) {
                res.status(200).send('Message successfully sent to Discord');
            }
            else {
                res.status(400).send('Error sending message to Discord');
            }
        })
        .catch((error) => {
            // If there was an error sending the request, return a server error message to the client
            res.status(500).send(error);
        });
}
