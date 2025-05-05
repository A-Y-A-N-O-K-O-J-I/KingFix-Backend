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
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  let body = req.body;

  // If the body hasn't been parsed yet (common in serverless), parse it manually
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid JSON' });
    }
  }

  const { name, email, message } = body;

  if (!name) return res.status(400).json({ message: "Name is required" });
  if (!email) return res.status(400).json({ message: "Email is required" });
  if (!message) return res.status(400).json({ message: "Message is required" });

  const mailOptions = {
    from: '"KingFix Support" <support@kingfix.name.ng>',
    to: 'support@kingfix.name.ng',
    subject: `New Message from ${name}`,
    html: `<p>You have received a new message from your website contact form.</p>
           <p><strong>Name:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Message:</strong> ${message}</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error("Here: ", error);
    res.status(500).json({ error: 'Error sending email' });
  }
};
