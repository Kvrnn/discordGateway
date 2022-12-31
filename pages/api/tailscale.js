/**
 * ./api/tailscale.js
 * Accepts: Tailscale formatted webhook requests
 * Sends: Discord formatted webhook requests
 * Returns: 200 OK
 * */

/** Example of json data
 * [
 *   {
 *     timestamp: '2022-12-17T17:36:41.918053157Z',
 *     version: 1,
 *     type: 'test',
 *     tailnet: '<name of tailnet>',
 *     message: 'This is a test event',
 *     data: null
 *   }
 * ]
 * */

// Import the Axios library
const axios = require('axios');
// Import the handler middleware
const { handler } = require('../../middleware/handler');

// || \\ // || \\ // || \\ EDIT SECTION BELOW // || \\ // || \\ // || \\
/**
 * An object that maps the Tailscale webhook event types to the corresponding Discord webhook event types.
 *
 * The Discord webhook event types are the keys, and the Tailscale webhook event types are the values.
 */
// This contains variables that are hardcoded.
const hardCodedValues = {
    username: 'Tailscale',
    avatar_url: 'https://avatars.githubusercontent.com/u/48932923',
}

// This is an object that maps the Tailscale webhook event types to the corresponding Discord webhook event types.
// The Discord webhook event types are the keys, and the Tailscale webhook event types are the values.
// For mulitdimensional arrays, the code supports . notation. Such that, if you have a json object like this:
// {
//   "a": {
//     "b": {
//       "c": "d"
//     }
//   }
// }
// You can access the value of "c" by using "a.b.c" as the key.
let tailscaleToDiscordMap = {
    content: 'message',
    embeds: [
        {
            title: 'data.title',
            content: 'data.message',
        }
    ],
}
// If you want to use a specific webhook URL, add it here (otherwise, it will use the default webhook URL)
let webhookURL = process.env.DISCORD_WEBHOOK_URL;
// || \\ // || \\ // || \\ STOP EDITING // || \\ // || \\ // || \\

export default async (req, res) => {
    // Destructure the content, username, avatar_url, and embeds properties from the request body
    const discordObject = handler(req.body, tailscaleToDiscordMap, hardCodedValues,  (variables) =>
        // Log missing variables to the console
        console.log(`Missing variables: ${variables}`)
    );

    // Send a POST request to the Discord endpoint with the discordObject as the request body
    axios.post('/api/discord/', discordObject, {
        baseURL: "http://localhost:3000",
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
