import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens.js";
import { transporter } from "../utils/mail.js";
import Otp from "../models/otp.model.js";

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
export const sendOTP = async (identifier) => {
    console.log("identifier service ", identifier);
    const user = await User.findOne({ email: identifier });
    console.log("user service ", user);
    if (!user) {
        throw new Error("User with this email not found");
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("otp ", otp);
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: identifier,
        subject: 'Welcome to HungryHub - Your OTP',
        html: `
        <h3>Hello ${user.name},</h3>
        <p>An OTP has been sent to you for login.</p>
        <p>You can log in using the following credentials:</p>
        <ul>
          <li><strong>Email:</strong> ${identifier}</li>
          <li><strong>OTP:</strong> ${otp}</li>
        </ul>
        <p>This OTP will expire in 5 minutes.</p>
        <br>
        <p>Best Regards,<br>HungryHub Team</p>
      `,
    };
    try {
        // Delete any old OTPs for this email to prevent DB clutter
        await Otp.deleteMany({ identifier });

        // Save new OTP to database
        await Otp.create({
            identifier,
            otp: String(otp),
            otpVerified: false
        });

        // Use await to make sure the email actually sends successfully
        // await transporter.sendMail(mailOptions);
        console.log("Otp sent successfully ", otp);
    } catch (error) {
        console.error('Error sending welcome email:', error);
        throw new Error('Failed to send OTP email. Please check email configuration.');
    }
    // The TTL index will expire the document in 5 minutes (300 seconds). 
    // We send this exact expiration timestamp to the frontend.
    const expireTime = new Date(Date.now() + 300000);
    return { success: true, otp, expireTime };
};

export const verifyOtp = async (identifier, otp) => {
    const user = await User.findOne({ email: identifier });
    console.log("user..", user);
    console.log("otp..", otp);
    if (!user) {
        throw new Error("User with this email not found");
    }
    const otpEntry = await Otp.findOne({ identifier, otp: String(otp) });
    if (!otpEntry) {
        throw new Error("Invalid otp");
    }
    if (otpEntry.otpVerified) {
        throw new Error("OTP already used");
    }
    otpEntry.otpVerified = true;
    await otpEntry.save();
    return { user };
}

export const resetPassword = async (identifier, otp, password) => {
    const user = await User.findOne({ email: identifier });
    console.log("user ser1", user)
    if (!user) {
        throw new Error("User with this email not found");
    }

    const otpEntry = await Otp.findOne({ identifier, otp: String(otp) });
    if (!otpEntry) {
        throw new Error("OTP expired or invalid");
    }

    // ENFORCE FLOW: Ensure the OTP was actually verified in the previous step
    if (!otpEntry.otpVerified) {
        throw new Error("Please verify OTP first");
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    console.log("user ser", user)
    await user.save();

    // Delete the OTP document so it cannot be used again for another password reset
    await Otp.deleteOne({ _id: otpEntry._id });

    return { user };
}
