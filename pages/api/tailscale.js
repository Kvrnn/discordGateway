/**
 * ./api/tailscale.js
 * Accepts: Tailscale formatted webhook requests
 * Sends: Discord Object to /api/discord
 * Returns: 200 OK
 * */

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

// || \\ // || \\ // || \\ STOP EDITING // || \\ // || \\ // || \\
export default async (req, res) => {
    let {timestamp, version, type, tailnet, message, data} = req.body;
    let {nodeID, url, deviceName, managedBy, actor} = data;

    const discordObject = new DiscordObject();

    discordObject.setUserName("TailScale");
    discordObject.setAvatarUrl("https://avatars.githubusercontent.com/u/48932923");

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
