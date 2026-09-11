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
