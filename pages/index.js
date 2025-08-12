import { useEffect, useRef, useState } from 'react'

export default function Home(){
  const [messages, setMessages] = useState([{ role: 'system', content: 'You are a helpful assistant.' }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesRef = useRef(null)

  useEffect(()=>{ messagesRef.current?.scrollIntoView({behavior:'smooth', block:'end'}) }, [messages])

  const handleSend = async ()=>{
    if(!input.trim()) return
    const userMsg = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    try{
      const res = await fetch('/api/openrouter', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ model:'openai/gpt-4o-mini', messages:newMessages }) })
      if(!res.ok){ const txt = await res.text(); throw new Error(`Proxy error: ${res.status} ${txt}`) }
      const data = await res.json()
      const assistantText = data?.choices?.[0]?.message?.content || data?.output?.[0]?.content || data?.choices?.[0]?.text || JSON.stringify(data)
      setMessages(prev => [...prev, { role:'assistant', content: assistantText }])
    }catch(err){ setMessages(prev => [...prev, { role:'assistant', content: 'Error: '+String(err.message) }]) }
    finally{ setLoading(false) }
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <header style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0' }}>
        <h1>AI Chatbot</h1>
        <a href="https://maps.google.com" target="_blank" rel="noreferrer" style={{ color:'#1f8ceb' }}>Google Maps</a>
      </header>
      <main>
        <div style={{ minHeight: 360, borderRadius: 8, background:'#fff', padding: 12, border:'1px solid #e6e6e6', overflow:'auto' }}>
          {messages.filter(m=>m.role!=='system').map((m,i)=> (
            <div key={i} style={{ display:'flex', margin:'8px 0' }}>
              <div style={{ background: m.role==='user' ? '#cfe9ff' : '#f1f1f1', borderRadius: 10, padding:'10px 12px', maxWidth:'80%', marginLeft: m.role==='user' ? 'auto' : undefined, marginRight: m.role==='assistant' ? 'auto' : undefined }}>
                {m.content}
              </div>
            </div>
          ))}
          <div ref={messagesRef} />
        </div>
        <div style={{ display:'flex', gap:8, marginTop: 8 }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter') handleSend()}} placeholder="Type your message and press Enter" style={{ flex:1, padding:8, border:'1px solid #ddd', borderRadius:6 }} />
          <button onClick={handleSend} disabled={loading} style={{ background:'#1f8ceb', color:'#fff', border:'none', padding:'8px 12px', borderRadius:6 }}>{loading ? '...' : 'Send'}</button>
        </div>
      </main>
    </div>
  )
}