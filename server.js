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
  
    const { name, email, message } = req.body;
    if(!name) return res.status(400).json({message:"Invalid Form"})
    if(!email) return res.status(400).json({message: "Invalid Form"})
    if(!message) return res.status(400).json({message: "Invalid Form"})
    
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
      res.status(500).json({ error: 'Error sending email' });
      console.error("Here: ",error)
    }
};
