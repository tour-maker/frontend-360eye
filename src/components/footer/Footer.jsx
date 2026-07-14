import React from "react";
import eye from "../../assets/360eye.png"
import arrow from "../../assets/arrow.png" 

function Footer({ css }) {
  return (
    <div className={" text-white bg-[#000000] pt-4  flex flex-col items-center justify-center gap-8 md:gap-0 " + css}>
      <div className="bg-transparent w-full h-[21vw] min-h-[220px] flex justify-center items-center">
        <div className="h-full w-[50%] flex flex-col pl-[10%] gap-3">
          <h1 className=" font-medium text-[clamp(21px,3vw,3vw)]">QUICK LINKS</h1>
          <h1 className="text-[clamp(16px,2vw,2vw)]">Home</h1>
          <h1 className="text-[clamp(16px,2vw,2vw)]">Showcase360</h1>
          <h1 className="text-[clamp(16px,2vw,2vw)]">Gallery</h1>
          <h1 className="text-[clamp(16px,2vw,2vw)]">About Us</h1>
        </div>
        <div className="h-full w-[50%]  flex flex-col pl-[3%] gap-5">
          <h1 className=" font-medium text-[clamp(21px,3vw,3vw)]">Newsletter</h1>
          <input className="px-2 border border-[#FFFFFF29] bg-[#D9D9D914] w-[88%] h-[18%] rounded-lg" placeholder="Email Address"></input>
          <button className="flex h-[17%] items-center justify-around  w-fit bg-[#f05942] rounded-full  px-4 text-lg gap-2">
          Subscribe 
        <img className="h-[60%] " src={arrow}></img>
      </button>
        </div>
      </div>
      <div className="grid place-items-center text-[clamp(20px,18.8vw,18.8vw)]  w-full h-[25vw] leading-tight">
       
        <img src={eye} className="w-[80%] h-[60%]"></img>
      </div>
      <div className=" w-[80%] min-w-[360px] flex gap-5  h-fit  mx-auto border-t border-[#535353] flex-wrap px-3 py-2 text-white items-center  text-[clamp(18px,2vw,2vw)] ">
        <h3 className=" w-fit  mx-auto  ">Copyright © 2025 360eye.in</h3>
        <div className="flex gap-10  w-fit h-fit mx-auto">
          <h3>Facebook</h3>
          <h3>Instagram</h3>
          <h3>Youtube</h3>
        </div>
      </div>
    </div>
  );
}

export default Footer;
