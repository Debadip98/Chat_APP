import React from 'react'
import { FaMapMarkerAlt } from 'react-icons/fa'
export default function GoogleMapsButton(){
  return (
    <button onClick={()=>window.open('https://maps.google.com','_blank')} aria-label='Open Google Maps' title='Open Google Maps' style={{position:'fixed',right:20,bottom:20,backgroundColor:'#4285F4',color:'white',border:'none',borderRadius:'50%',width:40,height:40,display:'flex',justifyContent:'center',alignItems:'center',boxShadow:'0 4px 8px rgba(0,0,0,0.2)',cursor:'pointer',zIndex:9999}}>
      <FaMapMarkerAlt size={18} />
    </button>
  )
}
