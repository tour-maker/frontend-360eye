import React, { useRef, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import icons1 from "../../assets/showcase360_ico.svg";
import icons2 from "../../assets/commercial_film_ico.svg";
import icons3 from "../../assets/3D Rendering.svg";
import backgroundImg from "../../assets/backgroundImg.png";
import Marquee from "react-fast-marquee";
import logo from "../../assets/360eye_logo.png";
import down from "../../assets/down_arrow.svg";

function VideoPlayer({ css, mobileAlignment = 'left' }) {
  // mobileAlignment can be 'left' or 'center'
  const w = window.innerWidth
  const h = window.innerHeight
  const isDesktop = w > 1024 && w > h

  const scrollToContainer = () => {
    const viewportHeight = window.innerHeight; // Get the viewport height
      window.scrollBy({
        top: viewportHeight,  // Scroll by 100vh (vertical scrolling)
        behavior: 'smooth'     // Smooth scroll effect
      });
  };
  
  return (
    <>
    {isDesktop ? 
    <div className={"flex items-end bg-blue-500 justify-around relative " + css}>
      <video
        className="w-full h-full absolute object-cover"
        autoPlay
        loop
        muted
        poster={backgroundImg}
        preload="auto"
        playsInline>

        <source src="/homepage/Home - Landing Page_comp.mp4" type="video/mp4" />
      </video>
     
     
      <div className="absolute  w-screen h-screen z-30 grid place-items-center text-white   font-medium bg-black/70" >
        <div className="text-green w-[clamp(320px,50vw,50vw)] mx-auto h-[58vh]  flex flex-col text-white text-[clamp(22px,2.4vw,2.4vw)] text-center bg-red-00 leading-tight">
   
          <img
            src={logo}
            className="w-full h-[40vh] object-contain mr-[2vw] mb-[2.3vw]"
            alt="Logo"
          />
          <div className="text-center">
  <p className="text-[clamp(16px,3vw,24px)]">We are</p>
  <p className="font-semibold text-[clamp(20px,4vw,32px)]">Multimedia Production Company</p>
  <p className="text-[clamp(14px,2.2vw,18px)] text-gray-300 font-light mt-1">(solving Property Marketing Needs)</p>
</div>

        </div>
      </div>


      <div className="w-full h-[18%] z-30 relative">
  <div className="w-full sm:w-[90vw] lg:w-[75vw] h-[clamp(7.5vh,3vw,3vw)] text-white text-[clamp(12px,1.8vw,1.8vw)] z-20 relative flex justify-between items-center mx-auto">
    
    <div className="flex items-center gap-2 sm:gap-4 whitespace-nowrap justify-center">
      <img className="h-full sm:h-[80%] lg:h-[90%]" src={icons1} alt="ShowCase360" />
      <h1 className="text-center">ShowCase360</h1>
    </div>
    
 
    
    <div className="flex items-center gap-2 sm:gap-4 whitespace-nowrap justify-center">
      <img className="h-full sm:h-[80%] lg:h-[90%]" src={icons3} alt="3D ArchViz Rendering" />
      <h1 className="text-center">3D ArchViz Rendering</h1>
    </div>

    <div className="flex items-center gap-2 sm:gap-4 whitespace-nowrap justify-center">
      <img className="h-full sm:h-[80%] lg:h-[90%]" src={icons2} alt="Video Production" />
      <h1 className="text-center">Video Production</h1>
    </div>
  </div>
  <img
    className="h-[12%] mx-auto mt-7 cursor-pointer"
    src={down}
    alt="Scroll Icon"
    onClick={() => scrollToContainer()}
  />
</div>

    </div>:
   
   
   
   
   
   <div
    className={"flex items-end bg-blue-500 justify-around relative " + css}
    style={{
      /* This ensures we account for both the address bar and header */
      minHeight: "calc(100svh - var(--header-height, 56px))"
    }}
  >
    <video
      className="w-full h-full absolute object-cover"
      autoPlay
      loop
      muted
      poster={backgroundImg}
      preload="auto"
      playsInline
    >
      <source src="/homepage/Home - Landing Page_comp.mp4" type="video/mp4" />
    </video>
   
    <div className="absolute w-screen h-screen z-30 flex justify-start items-center text-white font-medium bg-black/70 p-0 m-0" >
      <div className={`text-green w-[calc(100vw-44px)] h-auto flex flex-col text-white text-[clamp(22px,2.4vw,2.4vw)] ${mobileAlignment === 'center' ? 'items-center mx-auto' : 'items-start ml-[22px]'} bg-red-00 leading-tight mt-[calc(-20vw+var(--header-height,56px))]`}>
        {/* <Marquee speed={50} gradient={false}>
        MULTIMEDIA PRODUCTION
      </Marquee> */}
        <img
          src={logo}
          className="w-fit h-[25vh] max-h-[180px] object-contain"
          alt="Logo"
        />
      <div className={`mt-[16px] ${mobileAlignment === 'center' ? 'text-center' : 'text-left'} flex flex-wrap items-baseline gap-2 w-full`}>
        <span className="text-[clamp(18px,4vw,2.5rem)] font-light">We are</span>
        <span className="text-[clamp(20px,5vw,3rem)]">Multimedia Production Company</span>
        <span className="text-[clamp(14px,2.5vw,1.2rem)] text-gray-300 font-light mb-6 md:mb-0">(solving Property Marketing Needs)</span>
      </div>

      </div>
    </div>


     <div className="w-full h-auto pb-[calc(var(--safe-area-inset-bottom,12px)+20px)] z-30 relative pt-4">
        <div className="w-[calc(100vw-44px)] h-auto text-white text-[20px] z-20 relative flex flex-col justify-start gap-4 mx-auto ml-[22px]">
          {[
            { icon: icons1, text: "ShowCase360" },
            { icon: icons3, text: "3D ArchViz Rendering" },
            { icon: icons2, text: "Video Production" },
            
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-4 h-[42px] sm:h-[6vh]">
              <img className="h-[30px] sm:h-[40px]" src={item.icon} alt="" />
              <h1 className="text-[clamp(16px,4vw,1.5rem)] sm:text-[2rem] leading-none">{item.text}</h1>
            </div>
          ))}
        </div>

        <img className="h-[8%] mx-auto mt-[15px] sm:mt-[30px]" src={down} onClick={()=>{
          scrollToContainer()
        }}></img>
    </div> 
  </div>
  }
  </>
  );
}

export default VideoPlayer;
