const verifyOTP = async (scope) => {
    try {
        const { req, res, db, jwtService } = scope;
        const { phone, otp } = req.body;

        const query = { phone };

        const user = await db.findOne(query, 'user_verification');

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Phone number not found'
            });
        }

        if (!user.otp || user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        if (new Date(user.otpExpiresAt).getTime() < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'OTP expired'
            });
        }

        await db.update(
            query,
            {
                isVerified: true,
                otp: null,
                otpExpiresAt: null
            },
            'user_verification'
        );

        const token = jwtService.generateToken({
            phone,
            user_id: user.user_id
        });

        return res.status(201).json({
            success: true,
            message: 'Phone number verified successfully',
            token
        });

    } catch (error) {
        console.error('Verify OTP Error:', error);

        return scope.res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};

module.exports = verifyOTP;
