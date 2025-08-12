import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import AuthButton from './components/AuthButton'
import Chat from './components/Chat'
import GoogleMapsButton from './components/GoogleMapsButton'

export default function App(){ 
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    let mounted = true
    supabase.auth.getSession().then(({data})=>{ if(!mounted) return; setSession(data.session); setLoading(false) })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session)=>{ setSession(session) })
    return ()=> listener.subscription.unsubscribe()
  },[])

  if(loading) return <div className="center">Loading…</div>

  return (
    <div className="app">
      <header className="header">
        <h1>Chat App Ready</h1>
        <AuthButton session={session} />
      </header>
      <main className="main">
        {session ? <Chat session={session} /> : <div className="landing"><p>Please sign in with Google to start.</p><AuthButton session={session} /></div>}
      </main>
      <GoogleMapsButton />
    </div>
  )
}
