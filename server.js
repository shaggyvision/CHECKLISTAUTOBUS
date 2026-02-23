// server.js
// npm i express multer nodemailer dotenv
const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const upload = multer();

// Servir archivos estáticos (tu index.html, css, imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para enviar correo con adjunto PDF
app.post('/api/send-email', upload.single('pdf'), async (req, res) => {
  try {
    const { to, subject, body } = req.body || {};
    if (!req.file) return res.status(400).json({ ok: false, message: 'Falta el PDF.' });
    if (!to) return res.status(400).json({ ok: false, message: 'Falta destinatario.' });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.office365.com',
      port: Number(process.env.SMTP_PORT || 587),
      secure: false, // STARTTLS
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });

    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to,
      subject: subject || 'Documento PDF',
      text: body || 'Se adjunta el PDF.',
      attachments: [{
        filename: req.file.originalname || 'reporte.pdf',
        content: req.file.buffer,
        contentType: 'application/pdf'
      }]
    });

    res.json({ ok: true, message: 'Correo enviado con adjunto.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: 'Error al enviar.', error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor listo en http://localhost:${PORT}`));
