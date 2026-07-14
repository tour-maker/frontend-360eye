import React, { useEffect } from "react";
import { FaFacebookF, FaInstagram, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import "../../portrait-lock.css";

const coFounders = [
  {
    id: 1,
    name: "Dhaval Gajjar",
    title: "Production Head",
    image: "/images/team/Dhaval.png",
    socialLinks: {
      facebook: "https://www.facebook.com/dngajjar",
      whatsapp: "https://wa.me/+9537808176",
      instagram: "https://www.instagram.com/dngajjar",
      email: "mailto:dhaval@360eye.in",
    },
  },
  {
    id: 2,
    name: "Chinmay Naik",
    title: "Operation Head",
    image: "/images/team/Chinmay.png",
    socialLinks: {
      facebook: "https://www.facebook.com/chinmay.naik.10",
      whatsapp: "https://wa.me/+9727765971",
      instagram: "https://www.instagram.com/chinmaxstar/",
      email: "mailto:infiniti4d@gmail.com",
    },
  },
  {
    id: 3,
    name: "Viraj Dave",
    title: "Sales Head",
    image: "/images/team/Viraj.png",
    socialLinks: {
      facebook: "https://www.facebook.com/virajdave",
      whatsapp: "https://wa.me/+7096360360",
      instagram: "https://www.instagram.com/virudave143",
      email: "mailto:viraj@360eye.in",
    },
  },
];

const CoFounders = () => {
  return (
    <div className="bg-black text-white px-4 w-full h-full flex flex-col items-center justify-center">
      <div className="py-3 sm:py-4">
        <div className="w-[80vw] sm:w-[60vw] mx-auto min-w-[280px] max-w-4xl grid place-items-center text-white">
          <h1 className="text-center text-xl sm:text-2xl font-bold">
            Co-Founders
          </h1>
        </div>
      </div>
      
      {/* Mobile view - vertical stack with side-by-side layout for each founder */}
      <div className="sm:hidden w-full max-w-5xl mx-auto flex flex-col gap-4 justify-center items-center" style={{ minHeight: 'min(70svh, 500px)' }}>
        {coFounders.map((founder) => (
          <div
            key={founder.id}
            className="w-full bg-black/20 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-white/5 hover:border-[#87BA3A]/20 transition-all duration-300 flex-shrink-0"
          >
            {/* Side-by-side layout for mobile */}
            <div className="flex flex-row items-center">
              {/* Image Section - Left side */}
              <div className="w-2/5 p-3">
                <div className="aspect-square rounded-lg overflow-hidden bg-black/30 border border-white/10">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Content Section - Right side */}
              <div className="w-3/5 p-3 flex flex-col justify-center">
                <h2 className="text-[1.2rem] text-white font-montserrat mb-1 font-normal">
                  {founder.name}
                </h2>
                <p className="text-[1rem] text-[#87BA3A] font-montserrat font-light mb-2">
                  {founder.title}
                </p>
                
                {/* Social Links Section */}
                <div className="flex items-center gap-2 mt-1">
                  {founder.socialLinks.whatsapp && (
                    <a
                      href={founder.socialLinks.whatsapp}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#9B9B9B] hover:text-[#87BA3A] text-sm hover:scale-110 transition-all duration-300 border border-white/10 hover:border-[#87BA3A]/30 p-1.5 rounded-full">
                      <FaWhatsapp />
                    </a>
                  )}
                  {founder.socialLinks.facebook && (
                    <a
                      href={founder.socialLinks.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#9B9B9B] hover:text-[#87BA3A] text-sm hover:scale-110 transition-all duration-300 border border-white/10 hover:border-[#87BA3A]/30 p-1.5 rounded-full"
                    >
                      <FaFacebookF />
                    </a>
                  )}
                  {founder.socialLinks.instagram && (
                    <a
                      href={founder.socialLinks.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#9B9B9B] hover:text-[#87BA3A] text-sm hover:scale-110 transition-all duration-300 border border-white/10 hover:border-[#87BA3A]/30 p-1.5 rounded-full"
                    >
                      <FaInstagram />
                    </a>
                  )}
                  {founder.socialLinks.email && (
                    <a
                      href={founder.socialLinks.email}
                      className="text-[#9B9B9B] hover:text-[#87BA3A] text-sm hover:scale-110 transition-all duration-300 border border-white/10 hover:border-[#87BA3A]/30 p-1.5 rounded-full"
                    >
                      <FaEnvelope />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Desktop view - single row layout */}
      <div className="hidden sm:flex flex-row gap-4 md:gap-6 w-full max-w-6xl mx-auto justify-center items-center overflow-x-auto px-2 py-4" style={{ minHeight: 'min(75svh, 600px)' }}>
        {coFounders.map((founder) => (
          <div
            key={founder.id}
            className="overflow-hidden shadow-lg flex flex-col justify-between items-center w-1/3 min-w-[250px] max-h-[85%] bg-black/20 backdrop-blur-sm rounded-xl border border-white/5 hover:border-[#87BA3A]/20 transition-all duration-300"
          >
            {/* Image Section */}
            <div className="w-[90%] lg:w-full p-4 flex justify-center">
              <div className="aspect-square w-full overflow-hidden rounded-lg">
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center pt-4 lg:pt-8 pb-2 px-6 h-[40%]">
              <h2 className="text-[1.5rem] lg:text-[1.2rem] text-white font-montserrat mb-1 font-normal">{founder.name}</h2>
              <p className="text-[1.25rem] lg:text-[1rem] text-[#9B9B9B] font-montserrat font-light">{founder.title}</p>
            </div>
            
            {/* Social Links Section */}
            <div className="w-full p-2 flex justify-center items-center gap-4">
              <a
                href={founder.socialLinks.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="text-[#9B9B9B] font-montserrat font-light hover:scale-110 transition-transform border-2 border-[#9B9B9B] p-2 rounded-2xl"
              >
                <FaWhatsapp />
              </a>
              <a
                href={founder.socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className="text-[#9B9B9B] font-montserrat font-light hover:scale-110 transition-transform border-2 border-[#9B9B9B] p-2 rounded-2xl"
              >
                <FaFacebookF />
              </a>
              <a
                href={founder.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="text-[#9B9B9B] font-montserrat font-light hover:scale-110 transition-transform border-2 border-[#9B9B9B] p-2 rounded-2xl"
              >
                <FaInstagram />
              </a>
              <a
                href={founder.socialLinks.email}
                className="text-[#9B9B9B] font-montserrat font-light hover:scale-110 transition-transform border-2 border-[#9B9B9B] p-2 rounded-2xl"
              >
                <FaEnvelope />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoFounders;




