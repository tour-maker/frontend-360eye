import React, { useEffect, useState } from "react";
import play from "../../assets/playbutton.svg";
import Marquee from "react-fast-marquee";

function ModelComp({
  css,
  title,
  description,
  imgSize,
  buttonText,
  model,
  text = false,
  morecss="",
  desc="",
  buttonLink
}) {
  // Reference to the video element
  const videoRef = React.useRef(null);
  const containerRef = React.useRef(null);
  
  // Apply rounded corners after component mounts
  useEffect(() => {
    // Apply rounded corners directly to the video element
    if (videoRef.current) {
      videoRef.current.style.borderRadius = '24px';
      videoRef.current.style.WebkitBorderRadius = '24px';
      videoRef.current.style.MozBorderRadius = '24px';
    }
    
    // Apply rounded corners to the container as well
    if (containerRef.current) {
      containerRef.current.style.borderRadius = '24px';
      containerRef.current.style.overflow = 'hidden';
    }
  }, []);

  return (
    <div id="showcase" className={"text-white flex flex-col justify-between h-full " + css}>
      {/* 1. TOP - Title Section */}
      <div className="py-6">
        <div className="w-[60vw] mx-auto min-w-[320px] max-w-4xl grid place-items-center text-white">
          <h1 className="text-center text-xl sm:text-2xl font-bold">
            {title}
          </h1>
        </div>
      </div>
      
      {/* 2. MIDDLE - Video Container */}
      <div className="flex-1 flex items-center justify-center min-h-0 mb-3 md:mb-4">
        {/* Outermost container - provides positioning */}
        <div className="relative w-full h-full max-w-5xl max-h-[70vh]">
          {/* Middle container - provides backdrop and shadow */}
          <div 
            className="absolute inset-0 rounded-2xl shadow-lg"
            style={{
              backgroundColor: 'black',
              zIndex: 1
            }}
          ></div>
          
          {/* Inner mask container - no rounded corners */}
          <div 
            className="absolute inset-0 overflow-hidden z-10"
            style={{
              borderRadius: '12px',
              WebkitBorderRadius: '12px',
              MozBorderRadius: '12px',
            }}
          >
            {/* Video element inside the mask */}
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            >
              <source src={model}/>
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>

      {text && (
        <div className="absolute text-green w-screen h-screen z-10 grid place-items-center text-#1F1F1F text-[16vh] font-bold opacity-5 ">
          <Marquee speed={50} gradient={false}>
            360 EYE VIEW 360 EYE VIEW
          </Marquee>
        </div>
      )}
      
      {/* 3. BOTTOM - CTA Section */}
      <div className="text-center py-3 md:py-4">
        {description && description.trim() !== '' && (
          <p className="text-base md:text-lg text-[#868686] mt-2 min-w-[330px] max-w-3xl mx-auto px-4 mb-3 leading-relaxed">
            {description}
          </p>
        )}
        
        <a href={buttonLink} className="inline-flex items-center justify-center h-10 px-6 bg-black rounded-lg text-gray-200 hover:text-white transition-colors duration-200 shadow-md buttonShadow">
          <img className="h-[45%] mr-2" src={play} alt="Play Icon" /> 
          {buttonText}
        </a>
      </div>
    </div>
  );
}

export default ModelComp;
