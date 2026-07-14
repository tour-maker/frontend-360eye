import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import 'swiper/css';
import 'swiper/css/navigation';

const ShowcaseCarousel = () => {
  const swiperRef = useRef(null);
  const [loaded, setLoaded] = useState({});

  // Mark video as loaded
  const handleVideoLoaded = (index) => {
    setLoaded(prev => ({ ...prev, [index]: true }));
  };

  const items = [
    {
      heading: "3D+Real Surroundings",
      video: "/future/01-3D+Real Surroundings_comp.mp4"
    },
    {
      heading: "Without Furniture",
      video: "/future/02-Without Furniture_comp.mp4"
    },
    {
      heading: "3D+Real Balcony View",
      video: "/future/03-3D+Real Balcony View_comp.mp4"
    },
    {
      heading: "Day & Night View",
      video: "/future/04-Day & Night View_comp.mp4"
    },
    {
      heading: "Multifloor View",
      video: "/future/05-Multifloor View_comp.mp4"
    },
    {
      heading: "Live Floorplan",
      video: "/future/06-Live Floorplan_comp.mp4"
    },
    {
      heading: "Open-Close",
      video: "/future/07-Open-Close_comp.mp4"
    },
    {
      heading: "Audio Guidance",
      video: "/future/08-Audio Guidance_comp.mp4"
    },
    {
      heading: "Floorplan Overlay",
      video: "/future/09-Floorplan Overlay_comp.mp4"
    },
    {
      heading: "Virtual Reality Mode",
      video: "/future/10-Virtual Reality Mode_comp.mp4"
    },
    {
      heading: "Nearby Localities",
      video: "/future/11-Nearby Localities_comp.mp4"
    },
    {
      heading: "Information Pop-Up",
      video: "/future/12-Information Pop-Up_comp.mp4"
    },
    {
      heading: "360° Photo Gallery",
      video: "/future/13-360° Photo Gallery_comp.mp4"
    },
    {
      heading: "Contact & Location",
      video: "/future/14-Contact & Location_comp.mp4"
    },
    {
      heading: "Gallery",
      video: "/future/15-Gallery_comp.mp4"
    },
    {
      heading: "Brochure",
      video: "/future/16-Brochure_comp.mp4"
    },
    {
      heading: "Legal Documents",
      video: "/future/17-Legal Documents_comp.mp4"
    },
    {
      heading: "Social Sharing Buttons",
      video: "/future/18-Social Sharing Buttons_comp.mp4"
    },
    {
      heading: "Quick Photo Render",
      video: "/future/19-Quick Photo Render_comp.mp4"
    },
    {
      heading: "Analytics",
      video: "/future/20-Analytics_comp.mp4"
    }
  ];

  return (
    <div className="bg-black w-full h-full text-white flex flex-col">
      <div className="container mx-auto pt-[3vh] sm:pt-[5vh] md:pt-[6vh] px-3 sm:px-6">
        <div className="w-[90vw] md:w-[60vw] mx-auto mb-4 min-w-[320px] flex flex-col items-center justify-center gap-3">
          <h1 className="text-center text-[clamp(20px,1.5vw,1.5vw)] min-h-[35px] text-white text-center font-montserrat font-extralight tracking-normal">Showcase360 (How?)</h1>
          <p className="text-[1rem] m-auto text-[#868686] font-light font-montserrat text-center max-w-[90%]">Experience our interactive 360° tour features</p>
          <p className="text-[1rem] m-auto text-[#868686] font-light font-montserrat text-center max-w-[90%]">
            It is not just a Virtual Tour platform; it's a marketing powerhouse that provides a range of innovative features.
          </p>
        </div>

        <div className="w-full relative mt-2 sm:mt-4 md:mt-2 px-2 sm:px-6 md:px-8">
          {/* Navigation Buttons */}
          <button
            className="absolute left-0 top-[45%] transform -translate-y-1/2 z-10 bg-[#578500] rounded-full p-2 sm:p-3 hover:bg-[#769F32] w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <IoIosArrowBack className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>

          {/* Swiper Component */}
          <div className="showcase-carousel-container" style={{ height: 'clamp(35vh, 45vh, 55vh)' }}>
            <Swiper
            loop={true}
            modules={[Navigation]}
            slidesPerView={3}
            spaceBetween={20}
            centeredSlides={true}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 10 },
              640: { slidesPerView: 1.5, spaceBetween: 15 },
              768: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 20 }
            }}
            className="w-full h-full"
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            >
            {items.map((item, index) => (
              <SwiperSlide key={index} className="h-full flex items-center justify-center py-0">
                <div className="p-0 sm:p-1 md:p-2 flex flex-col items-center justify-center h-full w-full">
                  <div className="w-full rounded-lg overflow-hidden relative group h-[28vh] sm:h-[32vh] md:h-[40vh] flex items-center justify-center bg-black shadow-md">
                    <video 
                      autoPlay 
                      muted 
                      loop 
                      playsInline 
                      onLoadedData={() => handleVideoLoaded(index)}
                      className={`w-full h-full object-contain transition-opacity duration-300 ${loaded[index] ? 'opacity-100' : 'opacity-0'}`}
                      src={item.video}
                    >
                      Your browser does not support the video tag.
                    </video>
                    <div className="absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300 group-hover:bg-opacity-40 cursor-pointer"></div>
                  </div>
                  {/* Features are commented out as requested */}
                  {/* <ul className="list-none space-y-3 px-4 mx-auto w-full text-center">
                    {item.features && item.features.map((feature, idx) => (
                      <li key={idx} className="text-[#868686] text-center font-light font-montserrat text-[.8rem] sm:text-[.9rem] w-full mx-auto">
                        {feature}
                      </li>
                    ))}
                  </ul> */}
                </div>
              </SwiperSlide>
            ))}
            </Swiper>
          </div>

          {/* Next Button */}
          <button
            className="absolute right-0 top-[45%] transform -translate-y-1/2 z-10 bg-[#578500] rounded-full p-2 sm:p-3 hover:bg-[#769F32] w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <IoIosArrowForward className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowcaseCarousel;
