/* eslint-disable camelcase */

import { Resend } from 'resend';

// import nodemailer from 'nodemailer';

class MailSender {
  constructor() {
    this._resend = new Resend(process.env.RESEND_API_KEY);
  }
  /*smtp
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
  */
  sendEmail({ targetEmail, token, url, subject, type = 'default' }) {
    const verifyUrl = token
      ? `${process.env.URLFE}${url}?token=${token}`
      : `${process.env.URLFE}${url}`;

    const templates = {
      google_only_account: {
        heading: 'Info Akun Kamu',
        body: `
          <p style="margin:0 0 16px;">Halo!</p>
          <p style="margin:0 0 16px;">
            Kami menerima permintaan reset password untuk akun ini.
            Namun, akun kamu terdaftar menggunakan <strong>Google</strong> dan belum memiliki password.
          </p>
          <p style="margin:0 0 16px;">
            Silakan login menggunakan tombol <strong>Login dengan Google</strong>.
          </p>
        `,
        button: { text: 'Login Sekarang', href: verifyUrl },
        expiry: null,
      },
      reset_password: {
        heading: 'Reset Password',
        body: `
          <p style="margin:0 0 16px;">Halo!</p>
          <p style="margin:0 0 16px;">
            Klik tombol di bawah untuk mereset password akun kamu.
          </p>
        `,
        button: { text: 'Reset Password', href: verifyUrl },
        expiry: '30 menit',
      },
      default: {
        heading: 'Verifikasi Akun',
        body: `
          <p style="margin:0 0 16px;">Halo!</p>
          <p style="margin:0 0 16px;">
            Klik tombol di bawah untuk memverifikasi akun kamu.
          </p>
        `,
        button: { text: 'Verifikasi Akun', href: verifyUrl },
        expiry: '5 menit',
      },
    };

    const tmpl = templates[type] ?? templates.default;

    return this._resend.emails.send({
      from: 'no-reply@hello.com',
      to: targetEmail,
      subject,
      text: token
        ? `${subject}: ${verifyUrl}${tmpl.expiry ? `\n\nBerlaku ${tmpl.expiry}.` : ''}`
        : subject,
      html: `
        <!DOCTYPE html>
        <html lang="id">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body style="margin:0; padding:0; background-color:#f4f7f6; font-family:Arial, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="padding:40px 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0"
                    style="max-width:600px; background:#ffffff; border-radius:12px; padding:40px 30px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                    <tr>
                      <td align="center">
                        <h1 style="margin:0; color:#2fa084; font-size:28px;">
                          ${tmpl.heading}
                        </h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-top:24px; color:#444444; font-size:16px; line-height:1.7;">
                        ${tmpl.body}
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding:24px 0;">
                        <a href="${tmpl.button.href}"
                          style="background-color:#2fa084; color:#ffffff; text-decoration:none; padding:14px 32px; border-radius:8px; display:inline-block; font-size:16px; font-weight:bold;">
                          ${tmpl.button.text}
                        </a>
                      </td>
                    </tr>
                    ${tmpl.expiry ? `
                    <tr>
                      <td style="color:#666666; font-size:14px; line-height:1.6;">
                        <p style="margin:0 0 12px;">
                          Link berlaku selama <strong>${tmpl.expiry}</strong>.
                        </p>
                      </td>
                    </tr>` : ''}
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });
  }
}

export default MailSender;