import nodemailer from "nodemailer";
// Create a transporter using SMTP
export const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

