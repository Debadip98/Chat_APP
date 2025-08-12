import React from 'react'
import { supabase } from '../supabaseClient'
export default function AuthButton({session}){
  const signIn = async ()=>{
    await supabase.auth.signInWithOAuth({provider:'google', options:{queryParams:{prompt:'select_account'}}})
  }
  const signOut = async ()=>{
    await supabase.auth.signOut()
    window.location.href='/'
  }
  return session ? (<div className='auth'><span className='email'>{session.user?.email}</span><button className='btn' onClick={signOut}>Sign out</button></div>) : (<button className='btn' onClick={signIn}>Sign in with Google</button>)
}
