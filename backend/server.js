import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import FormData from 'form-data';
import { fetch } from 'undici';

const app = express();
app.use(cors());
app.use(express.json({ limit: '25mb' }));

const { PORT=3000, WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, SMTP_HOST, SMTP_PORT, SMTP_SECURE='false', SMTP_USER, SMTP_PASS, FROM_EMAIL = SMTP_USER } = process.env;

const transporter = nodemailer.createTransport({ host: SMTP_HOST, port: Number(SMTP_PORT), secure: String(SMTP_SECURE)==='true', auth: { user: SMTP_USER, pass: SMTP_PASS } });

async function sendWhatsAppPdf(toNumber, filename, pdfBuffer){
  const fd = new FormData();
  fd.append('messaging_product','whatsapp');
  fd.append('type','application/pdf');
  fd.append('file', pdfBuffer, { filename, contentType:'application/pdf' });
  const mediaRes = await fetch(`https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_NUMBER_ID}/media`, { method:'POST', headers:{ Authorization:`Bearer ${WHATSAPP_TOKEN}` }, body:fd });
  if(!mediaRes.ok){ throw new Error(await mediaRes.text()); }
  const mediaJson = await mediaRes.json();
  const msgRes = await fetch(`https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, { method:'POST', headers:{ Authorization:`Bearer ${WHATSAPP_TOKEN}`, 'Content-Type':'application/json' }, body: JSON.stringify({ messaging_product:'whatsapp', to: toNumber, type:'document', document:{ id: mediaJson.id, filename } }) });
  if(!msgRes.ok){ throw new Error(await msgRes.text()); }
  const msgJson = await msgRes.json();
  return msgJson.messages?.[0]?.id || null;
}

app.post('/send', async (req,res)=>{
  try{
    const { pdfBase64, filename, employeeId, whatsappTo, emailTo } = req.body;
    if(!pdfBase64||!filename) return res.status(400).send('Falta PDF o filename');
    const pdfBuffer = Buffer.from(pdfBase64,'base64');
    let waId = null;
    if(WHATSAPP_TOKEN && WHATSAPP_PHONE_NUMBER_ID && whatsappTo){ waId = await sendWhatsAppPdf(whatsappTo, filename, pdfBuffer); }
    const info = await transporter.sendMail({ from: FROM_EMAIL, to: emailTo, subject: `Inventario Unidad Toreto – ${employeeId}`, text: `Se adjunta el PDF del inventario. Empleado: ${employeeId}`, attachments:[{ filename, content: pdfBuffer, contentType:'application/pdf' }] });
    res.json({ ok:true, whatsappMessageId: waId, emailMessageId: info.messageId });
  }catch(err){ console.error(err); res.status(500).send(err.message || 'Error interno'); }
});

app.listen(PORT, ()=>console.log(`Backend listo en http://localhost:${PORT}`));
