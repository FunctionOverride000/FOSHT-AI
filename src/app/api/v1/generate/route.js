import prisma from '../../../../lib/prisma';
import { decryptApiKey } from '../../../../lib/encryption';

// Fungsi OPTIONS sangat penting untuk "menjawab" izin dari browser klien (Preflight Request)
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*', // Mengizinkan akses dari semua domain (termasuk file lokal)
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req) {
  // Setup Header CORS dasar untuk digunakan di setiap response
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Unauthorized: API Key missing.' 
      }), { status: 401, headers: corsHeaders });
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
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'API Key tidak valid.' 
      }), { status: 401, headers: corsHeaders });
    }

    // 2. AMBIL PENGATURAN DARI DASHBOARD
    const userConfig = await prisma.user.findUnique({ 
      where: { id: validKeyRecord.userId } 
    });

    const customPrompt = userConfig?.systemPrompt || "You are an expert SEO Writer. Write pure HTML.";
    const customCss = userConfig?.blogCss || "h1 { color: #f97316; }";

    const planName = validKeyRecord.name || "API Key Biasa"; 
    let wordLimit = planName.includes('3_MONTHS') ? "2000" : "800";

    const body = await req.json();
    const { topic, keywords } = body;
    if (!topic) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Topik wajib diisi.' 
      }), { status: 400, headers: corsHeaders });
    }

    // 3. LOAD BALANCER GROQ
    const groqKeys = [
      process.env.GROQ_API_KEY_1, process.env.GROQ_API_KEY_2, process.env.GROQ_API_KEY_3,
      process.env.GROQ_API_KEY_4, process.env.GROQ_API_KEY_5, process.env.GROQ_API_KEY_6,
      process.env.GROQ_API_KEY_7, process.env.GROQ_API_KEY_8, process.env.GROQ_API_KEY_9,
      process.env.GROQ_API_KEY_10, process.env.GROQ_API_KEY_11, process.env.GROQ_API_KEY_12
    ].filter(Boolean);

    const activeGroqKey = groqKeys[Math.floor(Math.random() * groqKeys.length)];

    // 4. GENERATE TEKS (FETCH)
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

    const groqData = await groqResponse.json();
    let rawHtml = groqData.choices[0].message.content;
    rawHtml = rawHtml.replace(/```html/g, '').replace(/```/g, '');
    
    // 5. SUNTIK CSS
    const finalStyledHtml = `
      <style>${customCss}</style>
      <div class="fosht-article">${rawHtml}</div>
    `;

    // 6. GENERATE GAMBAR
    const encodedPrompt = encodeURIComponent(`high resolution digital art for blog about ${topic}, clean, no text`);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;

    // 7. RESPONSE SUKSES DENGAN CORS
    return new Response(JSON.stringify({
      success: true,
      data: {
        plan: planName, 
        featuredImage: imageUrl, 
        contentHtml: finalStyledHtml 
      }
    }), { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error("FOSHT Internal Error:", error?.message);
    return new Response(JSON.stringify({ 
      success: false, 
      error: `Sistem Crash: ${error.message}` 
    }), { status: 500, headers: corsHeaders });
  }
}