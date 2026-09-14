import * as authService from "../services/auth.service.js";

export const register = async (req, res) => {
    try {
        const { name, email, phone, password, role, deviceId } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({ success: false, message: "Please provide all required fields" });
        }

        const { user, accessToken, refreshToken } = await authService.registerUser({ name, email, phone, password, role, deviceId });

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user,
            accessToken,
            refreshToken
        });
    } catch (error) {
        if (error.message === "User with this email or phone already exists") {
            return res.status(409).json({ success: false, message: error.message });
        }
        console.error("Error in register controller:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, deviceId } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide email and password" });
        }

        const { user, accessToken, refreshToken } = await authService.loginUser({ email, password, deviceId });

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: user,
            accessToken,
            refreshToken
        });
    } catch (error) {
        if (error.message === "Invalid email or password") {
            return res.status(401).json({ success: false, message: error.message });
        }
        console.error("Error in login controller:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const logout = async (req, res) => {
    try {
        const { deviceId } = req.body;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "Please provide userId" });
        }

        await authService.logoutUser(userId, deviceId);

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });
    } catch (error) {
        if (error.message === "User not found") {
            return res.status(404).json({ success: false, message: error.message });
        }
        console.error("Error in logout controller:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const logoutAll = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "Please provide userId" });
        }

        await authService.logoutAllDevices(userId);

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.status(200).json({
            success: true,
            message: "User logged out from all devices successfully"
        });
    } catch (error) {
        if (error.message === "User not found") {
            return res.status(404).json({ success: false, message: error.message });
        }
        console.error("Error in logoutAll controller:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const sendOTP = async (req, res) => {
    try {
        const identifier = req.body.identifier || req.body.email;
        console.log("identifier controller", identifier);
        if (!identifier) {
            return res.status(400).json({ success: false, message: "Please provide identifier (email)" });
        }
        const { otp, expireTime } = await authService.sendOTP(identifier);
        res.status(200).json({
            success: true,
            message: `OTP sent successfully to ${identifier} `,
            data: {  //in production only send expire time not the otp because used node mailer to send otp in client email
                otp,
                expireTime
            }
        });
    } catch (error) {
        if (error.message === "User with this email  not found") {
            return res.status(404).json({ success: false, message: error.message });
        }
        console.error("Error in sendOTP controller:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "Please provide identifier and otp" });
        }
        const { user } = await authService.verifyOtp(email, otp);
        res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            data: user
        });
    } catch (error) {
        if (error.message === "Invalid otp" || error.message === "OTP already used") {
            return res.status(401).json({ success: false, message: error.message });
        }
        console.error("Error in verifyOtp controller:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body;
        console.log("email", email);
        console.log("otp", otp);
        console.log("password", password);
        if (!email || !otp || !password) {
            return res.status(400).json({ success: false, message: "Please provide identifier, otp and password" });
        }
        const { user } = await authService.resetPassword(email, otp, password);
        res.status(200).json({
            success: true,
            message: "Password reset successfully",
            data: user
        });
    } catch (error) {
        if (error.message === "Invalid otp" || error.message === "OTP already used" || error.message === "Please verify OTP first") {
            return res.status(401).json({ success: false, message: error.message });
        }
        console.error("Error in resetPassword controller:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const googleSignUp = async (req, res) => {
    try {
        const { email, name, phone, role } = req.body;
        if (!email || !name) {
            return res.status(400).json({ success: false, message: "Email and name are required" });
        }

        const { user, accessToken, refreshToken } = await authService.googleSignUp({ email, name, phone, role });

        // Set cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            success: true,
            message: "Google Sign-In successful",
            data: user
        });
    } catch (error) {
        console.error("Error in googleSignUp controller:", error);
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
}

export const googleSignIn = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        
        const { user, accessToken, refreshToken } = await authService.googleSignIn({ email });
        
        // Set cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });
        
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            success: true,
            message: "Google Log-In successful",
            data: user
        });
    } catch (error) {
        if (error.message.includes("does not exist")) {
            return res.status(404).json({ success: false, message: error.message });
        }
        console.error("Error in googleSignIn controller:", error);
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
}