/**
 * /api/print.js
 * This is a debug endpoint that will print the request body to the console and to the client
 * */
/**
 * Handle an HTTP request, and then, print to console the request body and return the request body.
 * This function is meant to be used for development purposes.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export default (req, res) => {
    console.log(req.body)
    res.status(200).send(JSON.stringify(req.body))
}
