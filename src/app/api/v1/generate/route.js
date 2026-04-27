import prisma from '../../../../lib/prisma';
import { decryptApiKey } from '../../../../lib/encryption';

/**
 * ── KONFIGURASI CORS ──
 * Memastikan API bisa dipanggil dari domain mana pun (Cross-Origin).
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Unauthorized: API Key tidak tersedia.' 
      }), { status: 401, headers: corsHeaders });
    }

    const providedKey = authHeader.split(' ')[1];

    // 1. VALIDASI & DEKRIPSI API KEY
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
        error: 'API Key tidak valid atau telah dinonaktifkan.' 
      }), { status: 401, headers: corsHeaders });
    }

    // 2. AMBIL KONFIGURASI USER DARI DATABASE
    const userConfig = await prisma.user.findUnique({ 
      where: { id: validKeyRecord.userId } 
    });

    const body = await req.json();
    const { topic, keywords } = body;

    if (!topic) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Topik artikel wajib diisi.' 
      }), { status: 400, headers: corsHeaders });
    }

    // 3. GENERATE TEKS VIA GROQ (Llama 3.1)
    // Menggunakan System Prompt yang ketat agar HTML bersih
    const systemPrompt = `Kamu adalah Penulis SEO FOSHT AI. 
    ATURAN KONTEN: HANYA gunakan tag <h1>, <h2>, <p>, <ul>, <li>. 
    DILARANG: Tag <html>, <head>, <body>, <link>, <script>, atau <style>. 
    Berikan output artikel yang mendalam dan profesional.`;

    const groqKeys = [process.env.GROQ_API_KEY_1, process.env.GROQ_API_KEY_2].filter(Boolean);
    const activeGroqKey = groqKeys[Math.floor(Math.random() * groqKeys.length)];

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${activeGroqKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt }, 
          { role: 'user', content: `Tulis artikel HTML murni tentang: ${topic}. Keywords: ${keywords || 'umum'}.` }
        ],
        temperature: 0.7,
      })
    });

    const groqData = await groqResponse.json();
    let cleanHtml = groqData.choices[0].message.content;
    // Membersihkan jika AI masih nakal memberikan tag markdown atau tag head
    cleanHtml = cleanHtml.replace(/```html/g, '').replace(/```/g, '').replace(/<head>[\s\S]*?<\/head>/gi, '').replace(/<link[^>]*>/gi, '');

    // 4. GENERATE GAMBAR VIA GETIMG.AI (Premium)
    let imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(topic)}?nologo=true`; // Fallback ke Pollinations

    try {
      const getImgKey = process.env.GETIMG_API_KEY_1;
      if (getImgKey) {
        const imgResponse = await fetch('https://api.getimg.ai/v1/essential/text-to-image', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${getImgKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            prompt: `Cinematic professional digital art for blog header about ${topic}, detailed, 4k, clean composition, no text overlay`,
            style: 'digital-art',
            output_format: 'webp',
            width: 1024,
            height: 512
          })
        });
        
        const imgData = await imgResponse.json();
        if (imgData.image) {
          imageUrl = `data:image/webp;base64,${imgData.image}`;
        }
      }
    } catch (imgError) {
      console.error("GetImg API Gagal:", imgError.message);
    }

    // 5. RESPONSE FINAL (MATANG & SIAP PAKAI)
    return new Response(JSON.stringify({
      success: true,
      data: {
        plan: validKeyRecord.name, 
        featuredImage: imageUrl, 
        contentHtml: `<div class="fosht-article">${cleanHtml}</div>` 
      }
    }), { status: 200, headers: corsHeaders });

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: `Internal Server Error: ${error.message}` 
    }), { status: 500, headers: corsHeaders });
  }
}