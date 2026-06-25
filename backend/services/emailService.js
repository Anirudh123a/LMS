const nodemailer = require('nodemailer');
require('dotenv').config();

const sendMail = async (to, subject, htmlContent) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false, // false for port 587
            auth: {
                user: process.env.SMTP_USER, // lmsprojectkg2026@gmail.com
                pass: process.env.SMTP_PASS, // yvmwquyumsizxwys
            },
            tls: {
                // This prevents local security certificates from blocking Gmail connections on Windows
                rejectUnauthorized: false 
            }
        });

        const mailOptions = {
            from: `"LMS Portal" <${process.env.SMTP_USER}>`,
            to: to,
            subject: subject,
            html: htmlContent
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[SMTP] Email sent successfully: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('[SMTP ERROR] Failed to send email via Nodemailer:', error.message);
        throw error; // Passes the error up to the controller catch block
    }
};

module.exports = { sendMail };