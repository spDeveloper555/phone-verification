const sendOTP = require('./actions/send_otp');
const verifyOTP = require('./actions/verify_otp');
const { sendOTPValidator, verifyOTPValidator } = require('../../core/validators/auth.validator');
const { validate } = require('../../core/middlewares/validate.middleware');
class AuthController {
    constructor(scope) {
        this.scopeObj = scope;
    }
    send_otp() {
        sendOTP(this.scopeObj)
    }
    verify_otp() {
        verifyOTP(this.scopeObj)
    }
}
module.exports = AuthController;

module.exports = [
    {
        path: "send-otp",
        controller: AuthController,
        action: "send_otp",
        type: 'post',
        middlewares: [sendOTPValidator, validate]
    },
    {
        path: "verify-otp",
        controller: AuthController,
        action: "verify_otp",
        type: 'post',
        middlewares: [verifyOTPValidator, validate]
    }
]