// src/components/Chat.jsx
import React, { useEffect, useRef, useState } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are a helpful assistant.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    messagesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Send to local serverless proxy (Vercel). It will forward to OpenRouter.
      const res = await fetch('/api/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: newMessages
        })
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Proxy error: ${res.status} ${txt}`);
      }

      const data = await res.json();

      // Try common fields from OpenRouter responses
      const assistantText =
        data?.choices?.[0]?.message?.content ||
        data?.output?.[0]?.content ||
        data?.choices?.[0]?.text ||
        JSON.stringify(data);

      const assistantMsg = { role: 'assistant', content: assistantText };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: ' + String(err.message) }]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-wrapper">
      <div className="messages" aria-live="polite">
        {messages.filter(m => m.role !== 'system').map((m, i) => (
          <div key={i} className={'msg ' + m.role}>
            <div className="bubble">
              {m.content}
              <div style={{ marginTop: 8 }}>
                <button className="maps-inline" onClick={() => window.open('https://maps.google.com', '_blank')}>
                  Open Google Maps
                </button>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesRef} />
      </div>

      <div className="controls">
        <input
          aria-label="chat input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          placeholder="Type your message and press Enter"
        />
        <button className="btn-send" onClick={handleSend} disabled={loading}>
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
