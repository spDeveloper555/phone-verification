const jwt = require('jsonwebtoken');
require('dotenv').config();

class JwtService {
    constructor() {
        this.secret = process.env.JWT_SECRET;
        this.expiresIn = process.env.JWT_EXPIRES_IN;
    }

    generateToken(payload) {
        return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, this.secret);
        } catch (err) {
            return null;
        }
    }
}

module.exports = JwtService;
