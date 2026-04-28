// src/app/api/v1/generate/route.js

import prisma from '../../../../lib/prisma';
import { decryptApiKey } from '../../../../lib/encryption';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

// ── GROQ KEY ROTATOR (12 keys, fallback otomatis) ──
const getGroqKeys = () =>
  Array.from({ length: 12 }, (_, i) => process.env[`GROQ_API_KEY_${i + 1}`]).filter(Boolean);

async function callGroq(messages, model = 'llama-3.3-70b-versatile', responseFormat = null, keyIndex = 0) {
  const keys = getGroqKeys();
  if (keys.length === 0) throw new Error('No GROQ API keys configured');

  for (let attempt = 0; attempt < keys.length; attempt++) {
    const idx = (keyIndex + attempt) % keys.length;
    const key = keys[idx];
    try {
      const body = {
        model,
        messages,
        temperature: 0.7,
        max_tokens: 4096,
      };
      if (responseFormat) body.response_format = responseFormat;

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (res.status === 429 || res.status === 503) {
        console.warn(`GROQ key #${idx + 1} rate limited, trying next...`);
        continue;
      }

      const data = await res.json();
      if (!data.choices?.[0]?.message?.content) throw new Error('Empty GROQ response');
      return { content: data.choices[0].message.content, keyUsed: idx };
    } catch (e) {
      if (attempt === keys.length - 1) throw e;
      console.warn(`GROQ key #${idx + 1} failed: ${e.message}`);
    }
  }
  throw new Error('All GROQ keys exhausted');
}

// ── FASE 1: RISET REAL-TIME (compound-beta = built-in web search) ──
async function researchTopic(topic, keyIndex) {
  const messages = [
    {
      role: 'system',
      content: `You are a professional research assistant. Your job is to gather REAL, CURRENT, FACTUAL information about the given topic from the web.

RULES:
- Search for the latest data, statistics, trends, and facts
- Collect at least 5 concrete data points or statistics
- Find recent news or developments (within the last 6-12 months if possible)
- NEVER fabricate or assume data
- Output ONLY a JSON object, no markdown, no explanation

OUTPUT FORMAT (strict JSON):
{
  "topic_summary": "brief factual summary of the topic",
  "key_facts": ["fact 1 with source context", "fact 2...", "..."],
  "latest_trends": ["trend 1", "trend 2", "..."],
  "statistics": ["stat 1 with number", "stat 2...", "..."],
  "image_search_keyword": "3-5 word English visual keyword for image generation",
  "seo_title": "SEO-optimized blog title (max 60 chars)",
  "meta_description": "SEO meta description (max 160 chars)",
  "slug": "url-friendly-slug-from-title"
}`,
    },
    {
      role: 'user',
      content: `Research this blog topic thoroughly using real web data: "${topic}"`,
    },
  ];

  // compound-beta punya built-in web search — kunci anti-halusinasi
  const result = await callGroq(messages, 'compound-beta', { type: 'json_object' }, keyIndex);
  return JSON.parse(result.content);
}

// ── FASE 2: TULIS BLOG SEO PROFESIONAL ──
async function writeBlog(topic, researchData, keyIndex) {
  const messages = [
    {
      role: 'system',
      content: `You are a world-class SEO blog writer. Write a comprehensive, engaging, and SEO-optimized blog post based ONLY on the provided real research data.

WRITING RULES:
- Use ONLY the facts and statistics provided — never invent data
- Write in a professional yet engaging tone
- Structure: Introduction → multiple H2 sections → Conclusion with CTA
- Minimum 800 words, maximum 1500 words
- Naturally integrate SEO keywords from the topic
- Each H2 section should be 2-4 paragraphs with real data cited inline
- Add a "Key Takeaways" section before conclusion
- Add FAQ section at the end (3-5 questions)

HTML FORMATTING RULES:
- Use <h1> for the main title only (1x)
- Use <h2> for major sections
- Use <h3> for subsections
- Wrap paragraphs in <p>
- Use <ul><li> for lists and bullet points
- Use <strong> for key terms/statistics
- Use <blockquote> for notable quotes or key stats
- Add class="fosht-highlight" to blockquote and key stat paragraphs
- NO inline styles, NO scripts

OUTPUT: A single JSON object:
{
  "html": "complete HTML blog content starting from <h1>..."
}`,
    },
    {
      role: 'user',
      content: `Write a full SEO blog post about: "${topic}"

Use this verified research data:
- Topic Summary: ${researchData.topic_summary}
- Key Facts: ${researchData.key_facts?.join(' | ')}
- Latest Trends: ${researchData.latest_trends?.join(' | ')}
- Statistics: ${researchData.statistics?.join(' | ')}

SEO Title to use: ${researchData.seo_title}`,
    },
  ];

  const result = await callGroq(messages, 'llama-3.3-70b-versatile', { type: 'json_object' }, keyIndex);
  return JSON.parse(result.content);
}

// ── GENERATE GAMBAR GETIMG ──
async function generateImage(keyword) {
  const cleanKeyword = keyword?.substring(0, 60) || 'professional blog cover';
  const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    `${cleanKeyword}, professional photography, cinematic, 4k`
  )}?width=1200&height=630&nologo=true`;

  try {
    const apiKey = process.env.GETIMG_API_KEY_1;
    if (!apiKey) return fallbackUrl;

    const imgRes = await fetch('https://api.getimg.ai/v1/essential/text-to-image', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        prompt: `Professional blog cover photo of ${cleanKeyword}, cinematic lighting, high quality, 4k, editorial style`,
        negative_prompt: 'cartoon, anime, illustration, low quality, blurry, watermark, text overlay',
        style: 'photorealism',
        width: 1216,
        height: 832,
        output_format: 'webp',
      }),
    });

    const imgData = await imgRes.json();
    if (imgData.image) return `data:image/webp;base64,${imgData.image}`;
    return fallbackUrl;
  } catch (e) {
    console.error('GetImg failed, using fallback:', e.message);
    return fallbackUrl;
  }
}

// ── CORS ──
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

// ── MAIN HANDLER ──
export async function POST(req) {
  const startTime = Date.now();

  try {
    // ── AUTH: Validate API Key ──
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
      } catch {
        continue;
      }
    }

    if (!validKeyRecord) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized: Invalid API key' }),
        { status: 401, headers: corsHeaders }
      );
    }

    // ── PARSE REQUEST ──
    const body = await req.json();
    const { topic } = body;

    if (!topic || typeof topic !== 'string' || topic.trim().length < 3) {
      return new Response(
        JSON.stringify({ success: false, error: 'Bad Request: "topic" field is required (min 3 chars)' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const cleanTopic = topic.trim().substring(0, 300);
    const randomKeyIndex = Math.floor(Math.random() * getGroqKeys().length);

    // ── PIPELINE: Research → Write → Image (parallelized where possible) ──
    console.log(`[FOSHT] Generating blog for: "${cleanTopic}"`);

    // Fase 1: Riset real-time
    const researchData = await researchTopic(cleanTopic, randomKeyIndex);
    console.log(`[FOSHT] Research complete. SEO Title: "${researchData.seo_title}"`);

    // Fase 2: Tulis blog + generate gambar (paralel)
    const [blogData, imageUrl] = await Promise.all([
      writeBlog(cleanTopic, researchData, (randomKeyIndex + 1) % getGroqKeys().length),
      generateImage(researchData.image_search_keyword),
    ]);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[FOSHT] Blog generated in ${elapsed}s for key: ${validKeyRecord.name}`);

    // ── RESPONSE ──
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          plan: validKeyRecord.name,
          seo: {
            title: researchData.seo_title,
            metaDescription: researchData.meta_description,
            slug: researchData.slug,
          },
          featuredImage: imageUrl,
          contentHtml: `<div class="fosht-article">${blogData.html}</div>`,
          generatedIn: `${elapsed}s`,
        },
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('[FOSHT] Generation error:', error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Internal Server Error' }),
      { status: 500, headers: corsHeaders }
    );
  }
}