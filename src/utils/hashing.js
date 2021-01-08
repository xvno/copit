const crypto = require('crypto');

function md5(str) {
    let hash = crypto.createHash('sha256');
    hash.update(str);
    return hash.digest('base64');
}

function getHash(mod = 'sha256') {
    return crypto.createHash(mod);
}

module.exports = {
    md5,
    getHash
};
