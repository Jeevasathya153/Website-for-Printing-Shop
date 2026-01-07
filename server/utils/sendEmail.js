const nodemailer = require('nodemailer');
const config = require('../config/config');

const sendEmail = async (options) => {
  // Skip email sending if email is not configured
  if (!config.email.user || config.email.user === 'your_email@gmail.com') {
    console.log('⚠️  Email not configured. Skipping email notification.');
    return { skipped: true, message: 'Email service not configured' };
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.email.user,
      pass: config.email.password,
    },
  });

  // Email options
  const mailOptions = {
    from: config.email.from,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  // Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully: ' + info.response);
    return info;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    // Don't throw error - just log it and continue
    return { error: true, message: error.message };
  }
};

module.exports = sendEmail;