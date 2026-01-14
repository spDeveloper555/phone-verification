const AuthController = require("../controllers/auth/AuthController");

module.exports = [
    {
        path : 'auth',
        children:  AuthController
    }
];

