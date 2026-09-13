import mongoose from "mongoose";

const otp = new mongoose.Schema({
    identifier: {
        type: String,  //email
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    otpVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // Document will automatically delete 5 minutes after creation
    }
});

export default mongoose.model("Otp", otp);