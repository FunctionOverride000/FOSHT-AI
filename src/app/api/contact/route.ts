import { NextResponse } from 'next/server';
import { transporter } from '../../../lib/mail'; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message, honeypot, num1, num2, captchaAnswer, timeElapsed } = body;

    // --- 🛡️ 3-LAYER ANTI-BOT SYSTEM 🛡️ ---
    
    // LAYER 1: Honeypot (Jika bot mengisi kolom tersembunyi, pura-pura berhasil agar bot pergi)
    if (honeypot && honeypot.length > 0) {
      console.warn("Spam Bot Terdeteksi: Honeypot terisi.");
      return NextResponse.json({ success: true, message: 'Message sent successfully.' }); 
    }

    // LAYER 2: Time-Lock (Jika form diisi terlalu cepat, misal di bawah 4 detik = BOT)
    if (timeElapsed < 4000) {
      console.warn("Spam Bot Terdeteksi: Form diisi tidak wajar (terlalu cepat).");
      return NextResponse.json({ success: false, error: 'Aktivitas mencurigakan. Terlalu cepat.' }, { status: 400 });
    }

    // LAYER 3: Math Captcha (Jika jawaban matematika salah = BOT)
    const expectedAnswer = parseInt(num1) + parseInt(num2);
    if (parseInt(captchaAnswer) !== expectedAnswer) {
      return NextResponse.json({ success: false, error: 'Verifikasi manusia (Matematika) salah.' }, { status: 400 });
    }

    // ----------------------------------------

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: 'Name, email, and message are required.' }, { status: 400 });
    }

    const destinationEmail = 'functionoverride000@gmail.com'; 

    const htmlContent = `
      <div style="font-family: sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 8px; color: #333;">
        <h2 style="color: #f97316;">New Contact Message - FOSHT AI</h2>
        <p><strong>From:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p><strong>Message:</strong></p>
        <div style="background-color: #fff; padding: 15px; border-radius: 5px; border: 1px solid #eee; white-space: pre-wrap;">
          ${message}
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"FOSHT AI Contact Form" <${process.env.EMAIL_USER}>`, 
      to: destinationEmail, 
      replyTo: email, 
      subject: `[FOSHT Contact] ${subject} - ${name}`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, message: 'Message sent successfully.' });

  } catch (error: unknown) {
    console.error('Contact Form Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send message. Please try again later.' }, { status: 500 });
  }
}