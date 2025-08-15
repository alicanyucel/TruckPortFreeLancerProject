require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

app.post('/api/send-contact', async (req, res) => {
  const { name, email, phone, subject, message } = req.body || {};
  const to = process.env.TO_EMAIL || 'yucelalicandan@hotmail.com';
  const from = process.env.FROM_EMAIL || 'webmaster@truckport.com';

  if (!name || !email || !phone || !subject || !message) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' });
  }

  const mailOptions = {
    from: `${from}`,
    to,
    subject: `İletişim formu - ${subject}`,
    text: `Ad: ${name}\nE-posta: ${email}\nTelefon: ${phone}\nKonu: ${subject}\n\nMesaj:\n${message}`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Mail sent:', info.messageId);
    return res.json({ ok: true });
  } catch (err) {
    console.error('Mail error', err);
    return res.status(500).json({ ok: false, error: 'Mail send failed', details: err.message });
  }
});

app.listen(port, () => console.log(`Contact server listening on ${port}`));
