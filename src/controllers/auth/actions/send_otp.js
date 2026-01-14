const client = require('../../../core/config/twilio');
const sendOTP = async (scope) => {
    try {
        const { req, res, db, utility } = scope;
        const { phone } = req.body;

        const otp = utility.generateOTP();

        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

        const query = { phone };
        const doc = {
            otp,
            otpExpiresAt: expiresAt
        };

        const isExist = await db.count(query, 'user_verification');

        if (isExist === 0) {
            doc.user_id = utility.generateId();
        }

        await db.update(query, doc, 'user_verification');

        await client.messages.create({
            body: `Your verification code is ${otp}`,
            from: process.env.TWILIO_PHONE,
            to: phone
        });

        return res.status(201).json({
            success: true,
            message: 'OTP sent successfully'
        });

    } catch (error) {
        console.error('Send OTP Error:', error);
        return scope.res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};

module.exports = sendOTP;
