import jwt from 'jsonwebtoken';

export const generateAccessToken = (user, deviceId, tokenVersion) => {
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
            role: user.role,
            deviceId,
            tokenVersion
        },
        process.env.ACCESS_TOKEN_SECRET || 'fallback_access_secret',
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m'
        }
    );
};

export const generateRefreshToken = (user, deviceId, tokenVersion) => {
    return jwt.sign(
        {
            _id: user._id,
            deviceId,
            tokenVersion
        },
        process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret',
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d'
        }
    );
};