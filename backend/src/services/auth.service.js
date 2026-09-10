import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens.js";

export const registerUser = async (userData) => {
    const { name, email, phone, password, role, deviceId = "web" } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
        throw new Error("User with this email or phone already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        role: role,
        devices: [{ deviceId, tokenVersion: 0 }]
    });

    // Generate tokens
    const accessToken = generateAccessToken(newUser, deviceId, 0);
    const refreshToken = generateRefreshToken(newUser, deviceId, 0);

    // Remove password from returned user object
    const userToReturn = newUser.toObject();
    delete userToReturn.password;

    return {
        user: userToReturn,
        accessToken,
        refreshToken
    };
};

export const loginUser = async ({ email, password, deviceId = "web" }) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    // Find device or add new one
    let device = user.devices.find((d) => d.deviceId === deviceId);
    if (!device) {
        device = { deviceId, tokenVersion: 0 };
        user.devices.push(device);
    }

    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user, device.deviceId, device.tokenVersion);
    const refreshToken = generateRefreshToken(user, device.deviceId, device.tokenVersion);

    const userToReturn = user.toObject();
    delete userToReturn.password;

    return {
        user: userToReturn,
        accessToken,
        refreshToken
    };
};

export const logoutUser = async (userId, deviceId = "web") => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    const device = user.devices.find((d) => d.deviceId === deviceId);
    if (device) {
        device.tokenVersion += 1;
        await user.save();
    }
    return { success: true };
};

export const logoutAllDevices = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    // Increment tokenVersion for all devices
    user.devices.forEach((device) => {
        device.tokenVersion += 1;
    });
    
    await user.save();
    return { success: true };
};
