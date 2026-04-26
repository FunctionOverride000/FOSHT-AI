import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { systemPrompt, testTopic } = await req.json(); 

    // 1. SEKARANG KITA MENGGUNAKAN API KEY KHUSUS TEST (Lebih Aman!)
    // Jika tidak ada kunci test, dia akan menggunakan kunci 1 sebagai cadangan
    const apiKey = process.env.GROQ_API_KEY_TEST || process.env.GROQ_API_KEY_1; 

    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'Groq API Key tidak ditemukan di server.' }, { status: 500 });
    }

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt }, 
          { role: 'user', content: `Tulis HANYA satu paragraf pendek (maksimal 40 kata) dan satu list (<ul>). Topik: "${testTopic || 'Teknologi Masa Depan'}". Gunakan tag HTML <h1>, <p>, dan <ul>. JANGAN gunakan markdown.` }
        ],
        temperature: 0.7,
        // 2. SABUK PENGAMAN (Mesin otomatis berhenti di 150 token agar anti-spam)
        max_tokens: 150 
      })
    });

    const data = await groqResponse.json();
    let htmlContent = data.choices[0].message.content;
    
    htmlContent = htmlContent.replace(/```html/g, '').replace(/```/g, '');

    return NextResponse.json({ success: true, html: htmlContent });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal membuat preview.' }, { status: 500 });
  }
}