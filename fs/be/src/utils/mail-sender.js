import nodemailer from 'nodemailer';
class MailSender {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  sendEmail(targetEmail, token) {
    const verifyUrl = `${process.env.BASE_URL}/verify-email?token=${token}`;
    const message = {
      from: 'no-repy@hello.com',
      to: targetEmail,
      subject: 'Verifikasi Email',
      text: `Verifikasi email kamu: ${verifyUrl}\n\nBerlaku 30 menit.`,
      html: `
      <p>Klik tautan berikut untuk verifikasi akun kamu:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>Berlaku selama 30 menit.</p>
    `,
    };
    return this._transporter.sendMail(message);
  }

}

export default MailSender;