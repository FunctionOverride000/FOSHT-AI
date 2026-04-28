// src/app/api/v1/generate/route.js

import prisma from '../../../../lib/prisma';
import { decryptApiKey } from '../../../../lib/encryption';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

// ── GROQ KEY ROTATOR (support hingga 12 keys) ──
const getGroqKeys = () =>
  Array.from({ length: 12 }, (_, i) => process.env[`GROQ_API_KEY_${i + 1}`]).filter(Boolean);

// ── GETIMG KEY ROTATOR (support hingga 12 keys) ──
const getGetImgKeys = () =>
  Array.from({ length: 12 }, (_, i) => process.env[`GETIMG_API_KEY_${i + 1}`]).filter(Boolean);

// ── CORE GROQ CALLER dengan fallback antar key ──
async function callGroq({ messages, model = 'llama-3.3-70b-versatile', useJsonFormat = false, startKeyIndex = 0 }) {
  const keys = getGroqKeys();
  if (keys.length === 0) throw new Error('No GROQ API keys configured in environment');

  for (let attempt = 0; attempt < keys.length; attempt++) {
    const idx = (startKeyIndex + attempt) % keys.length;
    const key = keys[idx];

    try {
      const body = {
        model,
        messages,
        temperature: 0.7,
        max_tokens: 4096,
      };

      if (useJsonFormat && !model.includes('compound')) {
        body.response_format = { type: 'json_object' };
      }

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.status === 429 || res.status === 503) {
        console.warn(`[GROQ] Key #${idx + 1} rate limited (${res.status}), trying next...`);
        continue;
      }

      if (data.error) {
        console.warn(`[GROQ] Key #${idx + 1} error: ${data.error.message}`);
        if (data.error.code === 'model_not_active' || data.error.type === 'invalid_request_error') {
          throw new Error(`Model "${model}" tidak tersedia: ${data.error.message}`);
        }
        continue;
      }

      const content = data.choices?.[0]?.message?.content;
      if (!content || content.trim() === '') {
        console.warn(`[GROQ] Key #${idx + 1} returned empty content`);
        continue;
      }

      return { content, keyUsed: idx };
    } catch (e) {
      if (e.message.includes('tidak tersedia') || e.message.includes('model_not_active')) throw e;
      console.warn(`[GROQ] Key #${idx + 1} threw: ${e.message}`);
      if (attempt === keys.length - 1) throw new Error(`Semua ${keys.length} GROQ key gagal. Error terakhir: ${e.message}`);
    }
  }

  throw new Error(`Semua ${keys.length} GROQ key exhausted tanpa hasil`);
}

// ── PARSE JSON DARI TEKS ──
function extractJson(raw) {
  try { return JSON.parse(raw); } catch (_) {}

  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) {
    try { return JSON.parse(fenced[1].trim()); } catch (_) {}
  }

  const firstBrace = raw.indexOf('{');
  const lastBrace = raw.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    try { return JSON.parse(raw.substring(firstBrace, lastBrace + 1)); } catch (_) {}
  }

  throw new Error('Tidak bisa parse JSON dari response model');
}

// ── FASE 1: RISET REAL-TIME (compound-beta = built-in web search) ──
async function researchTopic(topic, startKeyIndex) {
  const messages = [
    {
      role: 'system',
      content: `You are a professional research assistant with web search capability.
Your job: gather REAL, CURRENT, FACTUAL information about the given topic from the web.

RULES:
- Search for latest data, statistics, trends, and facts
- Collect at least 5 concrete data points or real statistics with numbers
- Find recent news or developments (within last 12 months if possible)
- NEVER fabricate or assume any data — only use what you actually find
- Output ONLY a valid JSON object, no markdown formatting, no explanation outside JSON

REQUIRED OUTPUT FORMAT (strict JSON, no extra text):
{
  "topic_summary": "brief factual summary of the topic based on real findings",
  "key_facts": ["fact 1 with context", "fact 2", "fact 3", "fact 4", "fact 5"],
  "latest_trends": ["trend 1", "trend 2", "trend 3"],
  "statistics": ["stat with real number 1", "stat 2", "stat 3"],
  "image_flux_prompt": "Deskripsi visual SANGAT DETAIL dalam Bahasa Indonesia yang menggambarkan isi blog, latar belakang futuristik/sinematik, sesuai topik. Contoh untuk 'restoran vegan jakarta': 'Hidangan vegan segar dan berwarna-warni di atas meja kayu elegan, restoran modern Jakarta, pencahayaan hangat sinematik, fotografi editorial profesional'",
  "seo_title": "SEO-optimized blog title max 60 chars",
  "meta_description": "SEO meta description max 160 chars",
  "slug": "url-friendly-slug"
}`,
    },
    {
      role: 'user',
      content: `Research this topic using real web data and return only JSON: "${topic}"`,
    },
  ];

  let result;
  try {
    result = await callGroq({
      messages,
      model: 'compound-beta',
      useJsonFormat: false,
      startKeyIndex,
    });
  } catch (e) {
    console.warn(`[FOSHT] compound-beta gagal (${e.message}), fallback ke llama-3.3-70b...`);
    result = await callGroq({
      messages,
      model: 'llama-3.3-70b-versatile',
      useJsonFormat: true,
      startKeyIndex,
    });
  }

  return extractJson(result.content);
}

// ── FASE 2: TULIS BLOG SEO PROFESIONAL ──
async function writeBlog(topic, researchData, startKeyIndex) {
  const messages = [
    {
      role: 'system',
      content: `You are a world-class SEO blog writer. Write a comprehensive, engaging blog post based ONLY on the provided research data.

WRITING RULES:
- Use ONLY facts and statistics from the research — never invent data
- Professional yet engaging tone
- Structure: Introduction → H2 sections (min 4) → Key Takeaways → FAQ (3-5 Q&A) → Conclusion with CTA
- Minimum 900 words
- Naturally integrate SEO keywords
- Each H2 section: 2-3 paragraphs with real data cited inline

HTML FORMATTING:
- <h1> for main title (1x only)
- <h2> for major sections
- <h3> for subsections
- <p> for paragraphs
- <ul><li> for lists
- <strong> for key terms/statistics
- <blockquote class="fosht-highlight"> for notable stats/quotes
- NO inline styles, NO scripts, NO external links

OUTPUT: JSON object only, no extra text:
{"html": "complete HTML starting from <h1>..."}`,
    },
    {
      role: 'user',
      content: `Write a complete SEO blog post about: "${topic}"

Verified research data to use:
- Summary: ${researchData.topic_summary}
- Key Facts: ${researchData.key_facts?.join(' | ')}
- Trends: ${researchData.latest_trends?.join(' | ')}
- Statistics: ${researchData.statistics?.join(' | ')}
- SEO Title: ${researchData.seo_title}

Return only JSON: {"html": "..."}`,
    },
  ];

  const result = await callGroq({
    messages,
    model: 'llama-3.3-70b-versatile',
    useJsonFormat: true,
    startKeyIndex,
  });

  return extractJson(result.content);
}

// ── GENERATE GAMBAR ──
// Prioritas: Pollinations Flux (utama) → GetImg → Unsplash → Pexels → Pollinations default
async function generateImage(fluxPrompt, topic = '') {
  const base = fluxPrompt || topic || 'teknologi futuristik modern';
  const cleanPrompt = base.substring(0, 200);

  // ── UTAMA: POLLINATIONS FLUX (sama persis dengan fosht.vercel.app/blog/fosht-blog) ──
  try {
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      `${cleanPrompt}, dark background, cyan neon accent, cinematic lighting, ultra detailed, 16:9 aspect ratio`
    )}?width=1200&height=630&nologo=true&model=flux&seed=${Date.now()}`;

    // Verifikasi URL bisa diakses
    const check = await fetch(pollinationsUrl, { method: 'HEAD', signal: AbortSignal.timeout(8000) });
    if (check.ok || check.status === 200) {
      console.log('[FOSHT] ✓ Image from Pollinations Flux');
      return pollinationsUrl;
    }
  } catch (e) {
    console.warn('[FOSHT] Pollinations Flux failed:', e.message);
  }

  // ── FALLBACK 1: GETIMG (coba semua 12 key) ──
  const getimgKeys = getGetImgKeys();
  for (let i = 0; i < getimgKeys.length; i++) {
    try {
      const imgRes = await fetch('https://api.getimg.ai/v1/essential/text-to-image', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getimgKeys[i]}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          prompt: `${cleanPrompt}, cinematic lighting, ultra detailed, professional, 4k`,
          negative_prompt: 'low quality, blurry, watermark, text overlay, cartoon, anime',
          style: 'photorealism',
          width: 1216,
          height: 832,
          output_format: 'webp',
        }),
      });

      const imgData = await imgRes.json();
      if (imgData.image) {
        console.log(`[FOSHT] ✓ Image from GetImg key #${i + 1}`);
        return `data:image/webp;base64,${imgData.image}`;
      }
      console.warn(`[FOSHT] GetImg key #${i + 1} failed: ${imgData.error?.message || 'no image'}`);
    } catch (e) {
      console.warn(`[FOSHT] GetImg key #${i + 1} threw: ${e.message}`);
    }
  }

  // ── FALLBACK 2: UNSPLASH ──
  try {
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
    if (unsplashKey) {
      const keyword = topic.substring(0, 50);
      const res = await fetch(
        `https://api.unsplash.com/photos/random?query=${encodeURIComponent(keyword)}&orientation=landscape&content_filter=high`,
        { headers: { Authorization: `Client-ID ${unsplashKey}` } }
      );
      const data = await res.json();
      if (data.urls?.regular) {
        console.log('[FOSHT] ✓ Image from Unsplash');
        return data.urls.regular;
      }
    }
  } catch (e) {
    console.warn('[FOSHT] Unsplash failed:', e.message);
  }

  // ── FALLBACK 3: PEXELS ──
  try {
    const pexelsKey = process.env.PEXELS_API_KEY;
    if (pexelsKey) {
      const keyword = topic.substring(0, 50);
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=1&orientation=landscape`,
        { headers: { Authorization: pexelsKey } }
      );
      const data = await res.json();
      if (data.photos?.[0]?.src?.large2x) {
        console.log('[FOSHT] ✓ Image from Pexels');
        return data.photos[0].src.large2x;
      }
    }
  } catch (e) {
    console.warn('[FOSHT] Pexels failed:', e.message);
  }

  // ── LAST RESORT: POLLINATIONS tanpa model flux ──
  console.warn('[FOSHT] All sources failed, using Pollinations default');
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=1200&height=630&nologo=true&seed=${Date.now()}`;
}

// ── CORS PREFLIGHT ──
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

// ── MAIN POST HANDLER ──
export async function POST(req) {
  const startTime = Date.now();

  try {
    // ── 1. AUTH ──
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized: Missing Bearer token' }),
        { status: 401, headers: corsHeaders }
      );
    }

    const providedKey = authHeader.split(' ')[1];
    const allKeys = await prisma.apiKey.findMany({ where: { isActive: true } });
    let validKeyRecord = null;

    for (const record of allKeys) {
      try {
        const decrypted = decryptApiKey(record.encryptedKey, record.iv, record.authTag);
        if (decrypted === providedKey) {
          validKeyRecord = record;
          break;
        }
      } catch { continue; }
    }

    if (!validKeyRecord) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized: Invalid API key' }),
        { status: 401, headers: corsHeaders }
      );
    }

    // ── 2. PARSE & VALIDASI BODY ──
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: 'Bad Request: Invalid JSON body' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const { topic } = body;
    if (!topic || typeof topic !== 'string' || topic.trim().length < 3) {
      return new Response(
        JSON.stringify({ success: false, error: 'Bad Request: "topic" wajib diisi (min 3 karakter)' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const cleanTopic = topic.trim().substring(0, 500);
    const groqKeys = getGroqKeys();
    if (groqKeys.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Server Error: Tidak ada GROQ API key yang dikonfigurasi' }),
        { status: 500, headers: corsHeaders }
      );
    }

    const startKeyIndex = Math.floor(Math.random() * groqKeys.length);
    console.log(`[FOSHT] ▶ Generating blog: "${cleanTopic}" | GROQ keys: ${groqKeys.length} | GetImg keys: ${getGetImgKeys().length}`);

    // ── 3. FASE 1: RISET REAL-TIME ──
    let researchData;
    try {
      researchData = await researchTopic(cleanTopic, startKeyIndex);
      console.log(`[FOSHT] ✓ Research done. Title: "${researchData.seo_title}"`);
    } catch (e) {
      console.error('[FOSHT] ✗ Research phase failed:', e.message);
      throw new Error(`Fase riset gagal: ${e.message}`);
    }

    // ── 4. FASE 2: TULIS BLOG + GAMBAR (paralel) ──
    const nextKeyIndex = (startKeyIndex + 1) % groqKeys.length;
    let blogData, imageUrl;

    try {
      [blogData, imageUrl] = await Promise.all([
        writeBlog(cleanTopic, researchData, nextKeyIndex),
        // Pakai image_flux_prompt dari research untuk gambar yang relevan
        generateImage(researchData.image_flux_prompt, cleanTopic),
      ]);
      console.log(`[FOSHT] ✓ Blog written. Image generated.`);
    } catch (e) {
      console.error('[FOSHT] ✗ Write/image phase failed:', e.message);
      throw new Error(`Fase penulisan gagal: ${e.message}`);
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[FOSHT] ✅ Done in ${elapsed}s for plan: ${validKeyRecord.name}`);

    // ── 5. RESPONSE ──
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          plan: validKeyRecord.name,
          seo: {
            title: researchData.seo_title || cleanTopic,
            metaDescription: researchData.meta_description || '',
            slug: researchData.slug || cleanTopic.toLowerCase().replace(/\s+/g, '-'),
          },
          featuredImage: imageUrl,
          contentHtml: `<div class="fosht-article">${blogData.html}</div>`,
          generatedIn: `${elapsed}s`,
        },
      }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('[FOSHT] ✗ Fatal error:', error.message);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal Server Error',
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}