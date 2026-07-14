import React from 'react'
import icons1 from "../../assets/icons1.png";
import icons2 from "../../assets/icons2.png";
import icons3 from "../../assets/icons3.png";
import backgroundImg from "../../assets/backgroundImg.png";
import Marquee from "react-fast-marquee";


export const ShowcaseVideoPlayer = ({ css , text }) => {
  return (
    <div
    className={"flex items-end bg-blue-500 justify-around relative  " + css}
  >
    <video
    
      className="w-full h-full absolute object-cover"
      autoPlay
      loop
      muted
      src="https://360eye.in//video/1_landing%20section_comp.webm"
      // scr={backgroundImg}
      poster={backgroundImg}
      // type="video/mp4"
    ></video>
    <div className="absolute text-green w-screen h-screen z-30 grid place-items-center text-white text-[16vh] font-bold opacity-50">
      <Marquee speed={50} gradient={false}>
        {text}
      </Marquee>
    </div>
   
    {/* <div className="w-full h-[25%]  z-20 relative  bg-gradient-to-t from-black to-transparent ">
      <div className="w-full h-[clamp(7.5vh,5vw,5vw)] font-bold text-white  text-[clamp(12px,1.5vw,1.5vw)]   z-20 relative justify-around  flex   mb-20 object-cover   m-auto  p-3 ">
        <div className=" flex items-center gap-[5%] w-[clamp(107px,20vw,20vw)]     ">
          <img className="h-full" src={icons1}></img>
          <h1 className="max-w-[20%]">ShowCase 360</h1>
        </div>
        <div className="flex items-center gap-[5%] w-[clamp(107px,20vw,20vw)]  ">
          <img className="h-full" src={icons2}></img>
          <h1 className="max-w-[20%]">Commercial Film</h1>
        </div>
        <div className="flex items-center gap-[5%] w-[clamp(107px,20vw,20vw)]   ">
          <img className="h-full" src={icons3}></img>
          <h1 className="max-w-[20%]">Commercial Photography</h1>
        </div>
      </div>
    </div> */}
  </div>
  )
}
