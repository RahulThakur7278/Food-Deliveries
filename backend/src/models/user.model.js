import mongoose from "mongoose";

const user = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        // unique: true
    },
    role: {
        type: String,
        enum: ["admin", "user", "deliveryBoy"]
    },
    devices: [{
        deviceId: {
            type: String,
            required: true
        },
        tokenVersion: {
            type: Number,
            default: 0
        }
    }],
    password: {
        type: String,
        required: true
    }
});

export default mongoose.model("User", user);