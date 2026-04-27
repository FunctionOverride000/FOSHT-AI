import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export async function sendOtpEmail(to: string, otp: string, type: string) {
  let subject = 'FOSHT AI - Security Code';
  let actionText = '';

  if (type === 'PASSWORD') { subject = 'FOSHT AI - Password Reset'; actionText = 'mereset Password'; }
  else if (type === 'PIN') { subject = 'FOSHT AI - PIN Reset'; actionText = 'mereset Security PIN'; }
  else if (type === 'REGISTER') { subject = 'FOSHT AI - Verifikasi Registrasi'; actionText = 'memverifikasi akun baru'; }

  const htmlContent = `
    <div style="font-family: sans-serif; background-color: #050505; color: #f0f0f0; padding: 40px; border-radius: 10px;">
      <h2 style="color: #f97316;">FOSHT AI Security</h2>
      <p>Kami menerima permintaan untuk <strong>${actionText}</strong> Anda.</p>
      <p>Berikut adalah kode OTP 6-Digit Anda. Kode ini hanya berlaku selama 10 menit.</p>
      <div style="background-color: #111; padding: 15px; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; border: 1px solid #333; border-radius: 8px; color: #f97316; margin: 20px 0;">
        ${otp}
      </div>
      <p style="color: #666; font-size: 12px;">Jika Anda tidak merasa melakukan tindakan ini, abaikan email ini.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"FOSHT AI Security" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: htmlContent,
  });
}