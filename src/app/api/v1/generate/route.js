import prisma from '../../../../lib/prisma';
import { decryptApiKey } from '../../../../lib/encryption';

// KITA TIDAK LAGI MENGGUNAKAN AXIOS

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ success: false, error: 'Unauthorized: Invalid or missing API Key.' }, { status: 401 });
    }

    const providedKey = authHeader.split(' ')[1];

    // 1. GATEKEEPER & DEKRIPSI
    const allKeys = await prisma.apiKey.findMany({ where: { isActive: true } });
    let validKeyRecord = null;

    for (const record of allKeys) {
      try {
        const decryptedKey = decryptApiKey(record.encryptedKey, record.iv, record.authTag);
        if (decryptedKey === providedKey) {
          validKeyRecord = record;
          break;
        }
      } catch (e) { continue; }
    }

    if (!validKeyRecord) {
      return Response.json({ success: false, error: 'API Key tidak valid.' }, { status: 401 });
    }

    // 2. AMBIL PENGATURAN DARI DASHBOARD (DATABASE)
    const userConfig = await prisma.user.findUnique({ 
      where: { id: validKeyRecord.userId } 
    });

    const customPrompt = userConfig?.systemPrompt || "You are an expert SEO Writer. Write pure HTML.";
    const customCss = userConfig?.blogCss || "h1 { color: #f97316; }";

    const planName = validKeyRecord.name || "API Key Biasa"; 
    let wordLimit = planName.includes('3_MONTHS') ? "2000" : "800";

    const body = await req.json();
    const { topic, keywords, language = "Indonesia" } = body;
    if (!topic) return Response.json({ success: false, error: 'Topik wajib diisi.' }, { status: 400 });

    // 3. LOAD BALANCER GROQ
    const groqKeys = [
      process.env.GROQ_API_KEY_1, process.env.GROQ_API_KEY_2, process.env.GROQ_API_KEY_3,
      process.env.GROQ_API_KEY_4, process.env.GROQ_API_KEY_5, process.env.GROQ_API_KEY_6,
      process.env.GROQ_API_KEY_7, process.env.GROQ_API_KEY_8, process.env.GROQ_API_KEY_9,
      process.env.GROQ_API_KEY_10, process.env.GROQ_API_KEY_11, process.env.GROQ_API_KEY_12
    ].filter(Boolean);

    if (groqKeys.length === 0) {
      return Response.json({ success: false, error: 'Sistem Maintenance.' }, { status: 500 });
    }

    const activeGroqKey = groqKeys[Math.floor(Math.random() * groqKeys.length)];

    // 4. PABRIK TEKS AI (SEKARANG MENGGUNAKAN NATIVE FETCH - SANGAT STABIL)
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${activeGroqKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: customPrompt }, 
          { role: 'user', content: `Tulis artikel blog HTML murni tentang ${topic}. Kata kunci: ${keywords}. Panjang: ${wordLimit} kata. JANGAN gunakan tag markdown (\`\`\`html). HANYA kembalikan tag HTML <h1>, <h2>, <p>.` }
        ],
        temperature: 0.7,
      })
    });

    if (!groqResponse.ok) {
       throw new Error(`Koneksi Groq Gagal: Server menolak request.`);
    }

    const groqData = await groqResponse.json();
    
    // 5. PEMBERSIHAN MARKDOWN & SUNTIK CSS
    let rawHtml = groqData.choices[0].message.content;
    rawHtml = rawHtml.replace(/```html/g, '').replace(/```/g, '');
    
    const finalStyledHtml = `
      <style>
        /* CSS dari Dashboard Anda */
        ${customCss}
      </style>
      <div class="fosht-article">
        ${rawHtml}
      </div>
    `;

    // 6. PABRIK GAMBAR
    const encodedPrompt = encodeURIComponent(`high resolution digital art for blog about ${topic}, clean, no text`);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;

    // 7. HASIL FINAL KEMBALI KE KLIEN
    return Response.json({
      success: true,
      data: {
        plan: planName, 
        featuredImage: imageUrl, 
        contentHtml: finalStyledHtml 
      }
    });

  } catch (error) {
    const realError = error?.message || "Unknown error";
    console.error("FOSHT Internal Error DETIL:", realError);
    return Response.json({ success: false, error: `Sistem Crash: ${realError}` }, { status: 500 });
  }
}