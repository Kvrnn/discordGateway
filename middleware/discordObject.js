const hexToDec = (hex) => {
    return parseInt(hex, 16);
};

const isHex = (str) => {
    const hexRegex = /^#[0-9A-F]{6}$/i;
    return hexRegex.test(str)
};

function isValidTimestamp(timestamp) {
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    return regex.test(timestamp);
}

allowedEmbedKeys = [
    'color',
    'author',
    'title',
    'url',
    'description',
    'image',
    'thumbnail',
    'footer',
    'timestamp'
];

class DiscordObject {
    constructor(content, username, avatar_url, embeds = []) {
        this.content = content;
        this.username = username;
        this.avatar_url = avatar_url;
        this.embeds = embeds;
    }

    setContent(content) {
        this.content = content;
    }

    setUserName(username) {
        this.username = username;
    }

    setAvatarUrl(avatar_url) {
        this.avatar_url = avatar_url;
    }

    addEmbed(embed) {
        if (this.embeds.length === 10) {
            throw new Error('Cannot add more than 10 embeds to a DiscordObject');
        }
        const newEmbed = {};
        for (const key in embed) {
            if (allowedEmbedKeys.includes(key)) {
                if (key === 'color') {
                    if (isHex(embed[key])) {
                        newEmbed[key] = hexToDec(embed[key]);
                    } else {
                        newEmbed[key] = embed[key];
                    }
                }

                if (allowedEmbedKeys[key] === 'author') {
                    newEmbed[key] = {
                        name: embed[key].name,
                        url: embed[key].url,
                        icon_url: embed[key].icon_url
                    }
                }

                if (allowedEmbedKeys[key] === 'image') {
                    newEmbed[key] = {
                        url: embed[key].url
                    }
                }

                if (allowedEmbedKeys[key] === 'thumbnail') {
                    newEmbed[key] = {
                        url: embed[key].url
                    }
                }

                if (allowedEmbedKeys[key] === 'footer') {
                    newEmbed[key] = {
                        text: embed[key].text,
                        icon_url: embed[key].icon_url
                    }
                }

                if (allowedEmbedKeys[key] === 'timestamp') {
                    if (isValidTimestamp(embed[key])) {
                        newEmbed[key] = embed[key];
                    } else {
                        // TODO: Override entire embed if timestamp is invalid and display error message
                        throw new Error('Invalid timestamp');
                    }
                }
                newEmbed[key] = embed[key];
            }
        }
        this.embeds.push(newEmbed);
    }

    toJSON() {
        return {
            content: this.content,
            username: this.username,
            avatar_url: this.avatar_url,
            embeds: this.embeds
        };
    }
}

module.exports = DiscordObject;