// Base64URL encoding/decoding module
const base64URL = (str) => {
    return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')
}

module.exports = { base64URL }
