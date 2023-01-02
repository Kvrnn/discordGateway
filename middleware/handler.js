/**
 * This script does something that I forgot.
 *
 */
const {isDiscordWebhook} = require('./validator')

/**
 * Disassembles a targetKey string and searches for the corresponding value in a given json object.
 *
 * @param {Object} json - The object to search.
 * @param {string} targetKey - A string representing the path to the value, with each key in the path separated by a period.
 * @return {any} The value at the specified path in the object, or null if the path is not present in the object.
 */
export function disassembleAndFind(json, targetKey) {
    if (!targetKey.includes('.')) {
        return json[targetKey];
    } else {
        const keys = targetKey.split('.');
        let current = json;
        for (let i = 0; i < keys.length; i++) {
            if (current[keys[i]] === undefined) {
                return null;
            }
            current = current[keys[i]];
        }
        return current;
    }
}

/**
 * Assigns a value to a specified path in a given json object.
 *
 * @param {Object} json - The object to modify.
 * @param {string} targetKey - A string representing the path to the value, with each key in the path separated by a period.
 * @param {any} value - The value to assign to the specified path in the object.
 * @return {Object} The modified json object.
 */
export function assembler(json, targetKey, value) {
    if (!json || typeof json !== 'object') return null;

    const keys = targetKey.split(".");
    let current = json;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current.hasOwnProperty(key)) {
            current[key] = {};
        }
        current = current[key];
    }
    current[keys[keys.length - 1]] = value;
    return json;
}

/**
 * Searches a given json object for a list of specified variables, and returns an array of the values found. If a callback function is provided, it is called with an array of the variables that were not found.
 *
 * @param dataGiven
 * @param dataWanted
 * @param callback - A function to call if any of the variables are not found.
 * @return {any[]} An array of the values found for the specified variables.
 */
export function handler(dataGiven, dataWanted, callback) {
    let missingVariables = [];

    for (const key in dataWanted) {
        // If there is a hardcoded value, skip this key
        if (dataWanted[key] != undefined || dataWanted[key] != null) {
            continue;
        }

        if (dataGiven[key] === undefined || dataGiven[key] === null) {
            console.log(`dataGiven[${key}] is undefined or null`);
        }

        if (dataGiven.hasOwnProperty(key) && dataGiven[key] !== undefined && dataGiven[key] !== null) {
            dataWanted[key] = dataGiven[key];
        } else {
            missingVariables.push(key);
            dataWanted[key] = "Not Found";
        }
    }
    if(missingVariables.length > 0 && callback){
        callback(missingVariables);
    }
    return dataWanted;
}

/**
 * Extracts webhookID and webhookToken from a Discord webhook URL
 *
 * @param url
 * @param callback
 * @returns {{webhookId: *, webhookToken: *}}
 */
export function extractWebhookIdAndToken(url, callback) {
    if (!isDiscordWebhook(url)) {
        return callback(`Invalid Discord webhook URL: ${url}`);
    }

    const webhookID = url.split('/')[5];
    const webhookToken = url.split('/')[6];

    return { webhookID, webhookToken };
}

/**
 * Extracts all possible keys from an object
 *
 * @param {Object} obj - The object to extract keys from
 * @returns {string[]} An array of all possible keys
 * */
function extractKeys(obj) {
    let keys = [];
    for (let key in obj) {
        keys.push(key);
        if (typeof obj[key] === 'object') {
            keys = keys.concat(extractKeys(obj[key]));
        }
    }
    return keys;
}
