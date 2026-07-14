import React, { useEffect } from 'react'
import MapContactUs from '../../components/contactUs/MapComponent'
import { useOutletContext } from "react-router-dom";

export const ContactPage = () => {
  const css = useOutletContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className={`w-full bg-black ${css}`}>
      <div className="w-full h-[calc(100svh-9.2svh)] bg-black flex items-center justify-center overflow-y-auto pb-safe">
        <MapContactUs css="w-full min-h-full flex-1 bg-black" />
      </div>
    </div>
  )
}