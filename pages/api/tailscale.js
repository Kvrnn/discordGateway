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

let variables = {
    "timestamp": "timestamp",
    "tailnet": "tailnet",

}
export default (req, res) => {

    const { timestamp, type, tailnet, message, data } = req.body
    console.log(timestamp, type, tailnet, message, data)
    res.status(200).send(JSON.stringify({ timestamp, type, tailnet, message, data }))
}
