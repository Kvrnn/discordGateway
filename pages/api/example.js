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
// Import the handler function
const { handler } = require('../../middleware/handler');

export default async (req, res) => {
    // || \\ // || \\ // || \\ START EDITING // || \\ // || \\ // || \\

    // This object represents the data you want to send to Discord
    // You can hardcode values here by setting them to anything but null or undefined.
    let data = {
        "timestamp":null,
        "version": null,
        "type": null,
        "tailnet": null,
        "message": null,
        "data":{
            "nodeID": null,
            "url": null,
            "deviceName": null,
            "managedBy": null,
            "actor": null,
        }
    }
    // The handler helper function will try to fill in the data object with the data from the request body.
    // If the data is not present, it will be set to 'Not Found'
    data = handler(req.body, data)

    const discordObject = new DiscordObject();

    // Set the username and avatar of the webhook (Optional)
    discordObject.setUserName("TailScale");
    discordObject.setAvatarUrl("https://avatars.githubusercontent.com/u/48932923");

    // Add a message to the webhook
    discordObject.setContent("This is a test message");

    // Add an embed to the webhook. You can add upto 10 embeds per webhook.
    discordObject.addEmbed(
        {
            title: `Tailnet: ${data.tailnet}`,
            url: data.data.url,
            description: `NodeID: ${data.data.nodeID}\n${data.message} by ${data.data.actor} \nVersion: ${data.version} \nType: ${data.type}`,
            footer: {
                text: `Device Name: ${data.data.deviceName} | Managed By: ${data.data.managedBy}`,
            },
            timestamp: data.timestamp,
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
