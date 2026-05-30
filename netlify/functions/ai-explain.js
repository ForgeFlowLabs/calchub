// Netlify serverless function — proxies Gemini API
// API key stored in Netlify env var GEMINI_API_KEY — never in client code
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured.' }) };
  }

  let body;
  try { body = JSON.parse(event.body); }
  catch(e) { return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

  const { prompt } = body;
  if (!prompt) return { statusCode: 400, body: JSON.stringify({ error: 'No prompt' }) };

  // Try models newest → stable fallback
  const MODELS = [
    'gemini-3.1-flash-preview',   // best free — next-gen
    'gemini-3.0-flash-preview',   // fallback next-gen
    'gemini-2.5-flash',           // stable, 1500 RPD free
    'gemini-2.5-flash-lite',      // lightest, 1500 RPD free
    'gemini-2.0-flash',           // older stable
    'gemini-1.5-flash',           // always available
  ];

  for (const model of MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 700 }
          })
        }
      );

      if (res.status === 404 || res.status === 400) continue; // model not available, try next

      if (!res.ok) continue;

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) continue;

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ result: text, model })
      };
    } catch(e) { continue; }
  }

  return {
    statusCode: 500,
    body: JSON.stringify({ error: 'All AI models unavailable. Please try again.' })
  };
};
