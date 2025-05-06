require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Utility: send email
async function sendMail({ from, to, subject, html }, res) {
  try {
    await transporter.sendMail({ from, to, subject, html });
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
}

// Shared email builder
function buildHtml({ name, email, phone, phoneType,phoneBrand, message }) {
  let html = `<p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>`;
  if (phone) html += `<p><strong>Phone:</strong> ${phone}</p>`;
  if (phoneType) html += `<p><strong>Phone Type:</strong> ${phoneType} ${phoneBrand}</p>`;
  html += `<p><strong>Message:</strong> ${message}</p>`;
  return html;
}

// Generic form handler
function createRoute(path, config) {
  router.post(path, async (req, res) => {
    const { name, email, message, phone, phoneType, phoneBrand } = req.body;
    if (!name || !email || !message ) return res.status(400).json({ message: "Name, email, and message are required." });
    if (config.requirePhone && (!phone || !phoneType || !phoneBrand)) {
      return res.status(400).json({ message: "Phone and phone type are required for this form." });
    }

    await sendMail({
      from: config.from,
      to: config.to,
      subject: config.subject,
      html: buildHtml({ name, email, phone, phoneType,phoneBrand,message })
    }, res);
  });
}

// Define all routes
createRoute('/fix', {
  to: 'support@kingfix.name.ng',
  from: '"KingFix Fix" <fix@kingfix.name.ng>',
  subject: "Message received from Fix Section",
  requirePhone: true
});

createRoute('/swap', {
  to: 'support@kingfix.name.ng',
  from: '"KingFix Swap" <swap@kingfix.name.ng>',
  subject: "Message received from Swap Section"
});

createRoute('/sell', {
  to: 'support@kingfix.name.ng',
  from: '"KingFix Sell" <sell@kingfix.name.ng>',
  subject: "Message received from Sell Section"
});

createRoute('/buy', {
  to: 'support@kingfix.name.ng',
  from: '"KingFix Buy" <buy@kingfix.name.ng>',
  subject: "Message received from Buy Section"
});

createRoute('/contact', {
  to: 'support@kingfix.name.ng',
  from: '"KingFix Support" <support@kingfix.name.ng>',
  subject: "New Message from Contact Page"
});

module.exports = router;
