// api/openrouter.js
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_KEY) {
    return res.status(500).json({ error: 'Server missing OPENROUTER_API_KEY' });
  }

  try {
    const referer = req.headers['referer'] || req.headers['origin'] || '';
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

    const response = await fetch('https://api.openrouter.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': referer,
        'X-Title': 'Chat App Ready'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('OpenRouter proxy error:', err);
    res.status(500).json({ error: String(err) });
  }
}
