/**
 * Check whether a URL is a valid Discord webhook URL.
 *
 * @param {string} url - The URL to check.
 * @returns {boolean} - Whether the URL is a valid Discord webhook URL.
 */
export function isDiscordWebhook(url) {
  const pattern = /^https:\/\/[a-z]+\.discord\.com\/api\/webhooks\//;
  return pattern.test(url);
}