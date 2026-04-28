import prisma from '../../../../lib/prisma';
import { decryptApiKey } from '../../../../lib/encryption';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    const providedKey = authHeader.split(' ')[1];
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

    if (!validKeyRecord) return new Response(JSON.stringify({ success: false, error: 'Key Invalid' }), { status: 401, headers: corsHeaders });

    const body = await req.json();
    const { topic: instruction } = body;

    // ── PERBAIKAN SYSTEM PROMPT AGAR AI TIDAK HALUSINASI ──
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
          { 
            role: 'system', 
            content: `Kamu adalah FOSHT Agent AI Serbaguna. 
            TUGAS: Jalankan instruksi user dan hasilkan artikel/tulisan yang relevan.
            
            ATURAN OUTPUT:
            1. JANGAN JADIKAN INSTRUKSI USER SEBAGAI JUDUL. Buatlah judul baru yang kreatif.
            2. "image_prompt": Berikan HANYA 3 kata kunci visual bahasa Inggris (Contoh: "vegan food jakarta"). JANGAN berikan kalimat panjang.
            3. "html": Tuliskan hasil tugasmu dalam format HTML (<h1>, <h2>, <p>).
            4. FORMAT: Harus JSON murni: {"image_prompt": "...", "html": "..."}` 
          }, 
          { role: 'user', content: `Instruksi: ${instruction}` }
        ],
        response_format: { type: "json_object" },
        temperature: 0.8,
      })
    });

    const groqData = await groqResponse.json();
    let aiRaw = groqData.choices[0].message.content;
    aiRaw = aiRaw.replace(/```json/g, '').replace(/```/g, '').trim();
    const aiResponse = JSON.parse(aiRaw);

    // ── GENERATE GAMBAR DENGAN PROMPT SINGKAT ──
    const finalImageKeyword = aiResponse.image_prompt.substring(0, 50);
    let imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalImageKeyword)}?width=1024&height=512&nologo=true`;

    try {
      if (process.env.GETIMG_API_KEY_1) {
        const imgRes = await fetch('https://api.getimg.ai/v1/essential/text-to-image', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.GETIMG_API_KEY_1}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            prompt: `Professional photography of ${finalImageKeyword}, cinematic lighting, high quality, 4k`,
            style: 'photorealism',
            output_format: 'webp'
          })
        });
        const imgData = await imgRes.json();
        if (imgData.image) imageUrl = `data:image/webp;base64,${imgData.image}`;
      }
    } catch (e) { console.error("GetImg Fallback used"); }

    return new Response(JSON.stringify({
      success: true,
      data: {
        plan: validKeyRecord.name, 
        featuredImage: imageUrl, 
        contentHtml: `<div class="fosht-article">${aiResponse.html}</div>` 
      }
    }), { status: 200, headers: corsHeaders });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: corsHeaders });
  }
}