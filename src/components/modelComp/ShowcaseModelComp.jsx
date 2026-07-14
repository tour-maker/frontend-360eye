import React from 'react'
import Marquee from "react-fast-marquee";


export const ShowcaseModelComp = ({
    css,
    title,
    description,
    imgSize,
    buttonText1,
    buttonText2,
    buttonText3,
    model,
    text = false,
  }) => {

    
const W = window.innerWidth;
const H = window.innerHeight;
    
    // const  imgSize=
    //   window.innerWidth < window.innerHeight
    //     ? "w-[clamp(310px,50vw,50vw)] h-[26vw] min-h-[520px] w-full object-contain  "
    //     : "w-[clamp(280px,50vw,50vw)] h-[28vw] min-h-[310px] object-contain mb-3"
  
  return (
    <div
      className={
        "text-white flex flex-col items-center justify-center gap-3 sm:gap-4 text-center relative h-full pt-[2vh] sm:pt-[5vh] md:pt-[6vh] w-full overflow-y-auto " +
        css
      }
      style={{ zIndex: 5, margin: 0 }}
    >
      <div className="w-[90vw] md:w-[60vw] mx-auto mb-4 min-w-[320px] flex flex-col items-center justify-center gap-3">
        <h1 className="text-center text-[clamp(20px,1.5vw,1.5vw)] min-h-[35px] text-white text-center font-montserrat font-extralight tracking-normal">
          {title}
        </h1>
        <p className="text-[1rem] m-auto text-[#868686] font-light font-montserrat text-center max-w-[90%]">{description}</p>
      </div>
      {/* <div className={ " " + imgSize}> */}

     
      <div className="flex-1 flex items-center justify-center min-h-0 mb-3 md:mb-4">
            <div className="relative w-full h-full max-w-5xl max-h-[70vh] rounded-xl overflow-hidden shadow-lg">
              <video 
                key={W < H ? "mobile-video" : "desktop-video"} 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-fit"
                preload="auto">
                  
                <source 
                 src={W < H ? "/homepage/2_Showcase360 Mobile_comp.mp4" : "/homepage/2_Showcase360 Desktop_comp.mp4"}
                  type="video/mp4" 
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

      {/* <div className='w-full md:hidden border-2'>
         <video
        className={"object-fit rounded-[1rem] z-20 " + imgSize}
        autoPlay
        loop
        muted
        src={model}
        // scr={backgroundImg}
        // type="video/mp4"
      ></video>
      </div> */}

      {/* </div> */}
      {/* {text && (
        // <div className="absolute text-green w-screen h-screen z-10 grid place-items-center text-#1F1F1F text-[16vh] font-bold opacity-5 ">
        //   <Marquee speed={50} gradient={false}>
        //     360 EYE VIEW 360 EYE VIEW
        //   </Marquee>
        // </div>
      )} */}

  <div className="flex flex-col items-center justify-center w-full md:w-[90%] lg:w-[80%] text-[.8rem] lg:text-[1.1rem] gap-2 md:gap-5 text-[#868686] font-normal pb-20 px-4">
    <p className='leading-5 text-center max-w-[90%] mx-auto'>{buttonText1}</p>
    <p className='leading-5 text-center max-w-[90%] mx-auto'>{buttonText2}</p>
    <p className='italic text-center max-w-[90%] mx-auto'>{buttonText3}</p>
    {/* <img className="h-[60%]" src={play} alt="Play Icon" /> */}

</div>

     
    </div>
  )
}
