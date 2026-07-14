import React, { useState, useEffect, useRef } from 'react'
import { useOutletContext } from "react-router-dom";
// removed unused ShowcaseVideoPlayer import
import About from "../../assets/360eye_logo.png"
import CoFounders from '../../components/CoFounder/Cofounder';
import Clients from '../../components/Clients/Clients';
// removed unused Footer import
import './AboutUs.css';
export const AboutUs = () => {
    const css = useOutletContext();
    const [activeSection, setActiveSection] = useState(0);
    const containerRef = useRef(null);
    const sectionRefs = useRef([]);
    
    // Sections configuration
    const sections = [0, 1, 2]; // Three sections
    
    // Handle scroll events
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const scrollPosition = container.scrollTop;
      const viewportHeight = container.clientHeight;
      
      // Find which section is most visible in the viewport
      let maxVisibleSection = 0;
      let maxVisibleArea = 0;
      
      sectionRefs.current.forEach((ref, index) => {
        if (!ref) return;
        
        const rect = ref.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionBottom = rect.bottom;
        const headerHeight = window.innerHeight * 0.092; // 9.2vh header height
        
        // Calculate visible area of this section
        const visibleTop = Math.max(headerHeight, sectionTop);
        const visibleBottom = Math.min(window.innerHeight, sectionBottom);
        const visibleArea = Math.max(0, visibleBottom - visibleTop);
        
        if (visibleArea > maxVisibleArea) {
          maxVisibleArea = visibleArea;
          maxVisibleSection = index;
        }
      });
      
      setActiveSection(maxVisibleSection);
    };

    // Handle dot clicks
    const scrollToSection = (index) => {
      if (sectionRefs.current[index]) {
        sectionRefs.current[index].scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'start'
        });
        setActiveSection(index);
      }
    };

    // Set up section refs
    const setSectionRef = (ref, index) => {
      sectionRefs.current[index] = ref;
    };

    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
   
    const [bgSize, setBgSize] = useState("40%");

    useEffect(() => {
      const updateBgSize = () => {
        setBgSize(window.innerWidth <= 768 ? "45%" : "25%");
      };
  
      window.addEventListener("resize", updateBgSize);
      updateBgSize();
  
      return () => window.removeEventListener("resize", updateBgSize);
    }, []);
    
    // Set up scroll event listener
    useEffect(() => {
      const container = containerRef.current;
      if (container) {
        container.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();
        
        // Set initial scroll position to top
        container.scrollTop = 0;
      }
      
      return () => {
        if (container) {
          container.removeEventListener('scroll', handleScroll);
        }
      };
    }, []);

  return (
    <div className={"w-full bg-[#000000] " + css}>
      {/* Navigation Dots - match Showcase360 style */}
      <div className="fixed right-2 sm:right-4 md:right-6 top-1/2 transform -translate-y-1/2 z-40">
        {sections.map((index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className={`block w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 my-2.5 sm:my-3 md:my-3.5 rounded-full cursor-pointer transition-all duration-300 ${
              index === activeSection 
                ? 'bg-white scale-100' 
                : 'bg-white/30 scale-80'
            }`}
            aria-label={`Go to section ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Container */}
      <div 
        ref={containerRef} 
        className="aboutus-scroll-container w-full h-full"
      >
    
        {/* First Section - About Us */}
        <section 
          ref={ref => setSectionRef(ref, 0)}
          className="aboutus-section bg-black flex items-center justify-center relative"
          style={{
            backgroundImage: `url(${About})`,
            backgroundSize: bgSize,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Dark Overlay for Readability */}
          <div className="absolute inset-0 bg-black opacity-85"></div>

          {/* Content Wrapper */}
          <div className="relative z-10 w-full h-full flex flex-col justify-center items-center text-center p-4 md:p-8 overflow-auto">
            {/* Text Section */}
            <div className="w-[90vw] md:w-[80vw] lg:w-[60vw] max-h-[85vh] overflow-auto flex flex-col items-center gap-4 mx-auto">
              <h1 className="text-lg md:text-xl lg:text-2xl text-white font-montserrat font-light py-4">
                About 360 EYE
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-[#9B9B9B] font-light leading-relaxed">
                Established in 2016, We are a Surat-based Multimedia Production company.
              </p>
              <p className="text-sm md:text-base lg:text-lg text-[#9B9B9B] font-light leading-relaxed">
                360EYE provides a revolutionary Showcase360 tool that is changing the way Real Estate, Hospitality, Manufacturing, and Retail Industries market their properties and offerings.
              </p>
              <p className="text-sm md:text-base lg:text-lg text-[#9B9B9B] font-light leading-relaxed">
                Our team of professionals leverages the latest technology to combine 360° Virtual Tours, Video Production, cutting-edge Architectural Photography, Stunning Product Photography, and awe-inspiring 3D Architectural Visualization to create a complete branding and marketing solution for your Space or Product.
              </p>
              <p className="text-sm md:text-base lg:text-lg text-[#9B9B9B] font-light leading-relaxed italic">
                "Experience the magic of Space & Product brought to life with 360 EYE!"
              </p>

              {/* Vision Section */}
              <div className="mt-4">
                <h2 className="text-lg md:text-xl lg:text-2xl text-white font-semibold">Our Vision:</h2>
                <p className="text-sm md:text-base lg:text-lg text-[#9B9B9B] font-light leading-relaxed">
                  Our vision is to be at the forefront of innovation in the 360° Virtual Tour industry, providing businesses with the tools they need to showcase their properties and products in a way that truly captures their essence.
                </p>
              </div>

              {/* Goals Section */}
              <div className="mt-4">
                <h2 className="text-lg md:text-xl lg:text-2xl text-white font-semibold">Our Goals:</h2>
                <p className="text-sm md:text-base lg:text-lg text-[#9B9B9B] font-light leading-relaxed">
                  Our goal is to simplify the marketing process for real estate and retail industries, providing them with a comprehensive solution that includes 30+ features designed to help them stand out from the competition and achieve their marketing goals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Second Section - Co-Founders */}
        <section 
          ref={ref => setSectionRef(ref, 1)}
          className="aboutus-section bg-black flex items-center justify-center overflow-y-auto"
        >
          <CoFounders />
        </section>

        {/* Third Section - Clients */}
        <section
          ref={(ref) => setSectionRef(ref, 2)}
          className="snap-start flex h-[calc(100svh-9.2svh)]"
        >
          <Clients css="w-full h-full" />
        </section>

      </div>
    </div>

  )
}
