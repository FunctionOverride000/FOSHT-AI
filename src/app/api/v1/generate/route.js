import prisma from '../../../../lib/prisma';
import { decryptApiKey } from '../../../../lib/encryption';

// Header CORS dasar
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
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized: API Key missing.' }), { status: 401, headers: corsHeaders });
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
      return new Response(JSON.stringify({ success: false, error: 'API Key tidak valid.' }), { status: 401, headers: corsHeaders });
    }

    // 2. AMBIL PENGATURAN USER
    const userConfig = await prisma.user.findUnique({ where: { id: validKeyRecord.userId } });
    const customPrompt = userConfig?.systemPrompt || "You are an expert SEO Writer. Write pure HTML.";
    const customCss = userConfig?.blogCss || "";

    const body = await req.json();
    const { topic, keywords } = body;
    if (!topic) {
      return new Response(JSON.stringify({ success: false, error: 'Topik wajib diisi.' }), { status: 400, headers: corsHeaders });
    }

    // 3. GENERATE TEKS (GROQ LOAD BALANCER)
    const groqKeys = [
      process.env.GROQ_API_KEY_1, process.env.GROQ_API_KEY_2, process.env.GROQ_API_KEY_3
    ].filter(Boolean);
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
          { role: 'system', content: customPrompt }, 
          { role: 'user', content: `Tulis artikel blog HTML murni tentang ${topic}. Kata kunci: ${keywords}. Gunakan tag <h1>, <h2>, <p>. JANGAN gunakan tag markdown.` }
        ],
        temperature: 0.7,
      })
    });

    const groqData = await groqResponse.json();
    const rawHtml = groqData.choices[0].message.content.replace(/```html/g, '').replace(/```/g, '');

    // 4. GENERATE GAMBAR (GETIMG.AI)
    // Menggunakan GETIMG_API_KEY_1 untuk kualitas gambar premium
    let imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(topic)}?nologo=true`; // Fallback

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
            prompt: `Professional cinematic digital art for a blog post about ${topic}, highly detailed, clean composition, 4k resolution, no text`,
            style: 'digital-art',
            output_format: 'webp',
            width: 1024,
            height: 512
          })
        });
        
        const imgData = await imgResponse.json();
        if (imgData.image) {
          // getimg.ai mengembalikan base64. Kita kirim sebagai Data URL.
          imageUrl = `data:image/webp;base64,${imgData.image}`;
        }
      }
    } catch (imgError) {
      console.error("GetImg API Error:", imgError.message);
    }

    // 5. RESPONSE FINAL
    return new Response(JSON.stringify({
      success: true,
      data: {
        plan: validKeyRecord.name,
        featuredImage: imageUrl, 
        contentHtml: `<style>${customCss}</style><div class="fosht-article">${rawHtml}</div>`
      }
    }), { status: 200, headers: corsHeaders });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: corsHeaders });
  }
}