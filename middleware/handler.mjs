/**
 * This script does something that I forgot.
 *
 */
const {isDiscordWebhook} = require('./validator.mjs')

/**
 * Disassembles a targetKey string and searches for the corresponding value in a given json object.
 *
 * @param {Object} json - The object to search.
 * @param {string} targetKey - A string representing the path to the value, with each key in the path separated by a period.
 * @return {any} The value at the specified path in the object, or null if the path is not present in the object.
 */
export function disassembleAndFind(json, targetKey) {
    if (!json || typeof json !== 'object') return null;

    const keys = targetKey.split(".");
    let value = json;
    for (const key of keys) {
        if (value.hasOwnProperty(key)) {
            value = value[key];
        } else {
            return null;
        }
    }
    return value;
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
 * @param {Object} json - The object to search.
 * @param {string[]} variables - An array of strings representing the paths to the values to search for, with each key in the path separated by a period.
 * @param {Function} [callback] - An optional callback function to be called with an array of the variables that were not found.
 * @param {string} [defaultValue=""] - An optional default value to use if a variable is not found.
 * @return {any[]} An array of the values found for the specified variables.
 */
export function handler(json, variables, callback, defaultValue="") {
    if (!json || typeof json !== 'object') return null;

    const result = [];
    const missing = [];
    for (const variable of variables) {
        const value = disassembleAndFind(json, variable);
        if (value !== null) {
            result.push(value);
        } else {
            missing.push(variable);
        }
    }
    if (callback) {
        callback(missing);
    }
    return result;
}

/**
 * Extracts webhookID and webhookToken from a Discord webhook URL
 *
 * @param url
 * @returns {{webhookId: *, webhookToken: *}}
 */
export function extractWebhookIdAndToken(url) {
    if (!isDiscordWebhook(url)) {
        throw new Error(`Invalid Discord webhook URL: ${url}`);
    }

    const webhookId = url.split('/')[6];
    const webhookToken = url.split('/')[7];

    return { webhookId, webhookToken };
}