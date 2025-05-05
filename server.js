// /api/contact.js
require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

module.exports = async (req, res) => {
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end(); // No content
  }

  // Make sure it's a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  // Set CORS headers for the actual POST request too
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Parse the body
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid JSON' });
    }
  }

  const { name, email, message } = body;

  // Validate
  if (!name) return res.status(400).json({ message: "Name is required" });
  if (!email) return res.status(400).json({ message: "Email is required" });
  if (!message) return res.status(400).json({ message: "Message is required" });

  // Send mail
  const mailOptions = {
    from: '"KingFix Contact" <contact@kingfix.name.ng>',
    to: 'support@kingfix.name.ng',
    subject: `New Message from ${name} through kingfix.name.ng website`,
    html: `<p><strong>Name:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Message:</strong> ${message}</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: 'Error sending email' });
  }
};
