import React, { useState, useRef, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import VideoPlayer from "../../components/videoPlayer/VideoPlayer";
import ModelComp from "../../components/modelComp/ModelComp";
import Clients from "../../components/Clients/Clients";
import Partners from "../../components/Partners/Partners";
import MapContactUs from "../../components/contactUs/MapComponent";
import "./Home.css";
import play from "../../assets/playbutton.svg";

const W = window.innerWidth;
const H = window.innerHeight;

function Home() {
  const css = useOutletContext();
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef(null);
  const sectionRefs = useRef([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoFullscreenAttempted, setAutoFullscreenAttempted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsFullScreen(window.innerHeight === window.screen.height);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check on mount

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sections configuration
  const sections = [
    { id: "video", name: "video" },
    { id: "showcase", name: "showcase" },
    { id: "films", name: "films" },
    { id: "photography", name: "photography" },
    { id: "clients", name: "clients" },
    { id: "contact", name: "contact" }
  ];

  // Fullscreen functions
  const enterFullscreen = () => {
    if (!document.fullscreenElement) {
      const docElm = document.documentElement;
      
      // Try the standard method first
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      } 
      // Fallbacks for different browsers
      else if (docElm.mozRequestFullScreen) { /* Firefox */
        docElm.mozRequestFullScreen();
      } else if (docElm.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        docElm.webkitRequestFullscreen();
      } else if (docElm.msRequestFullscreen) { /* IE/Edge */
        docElm.msRequestFullscreen();
      }
      
      setIsFullscreen(true);
    }
  };
  
  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari & Opera */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
      document.msExitFullscreen();
    }

    setIsFullscreen(false);
  };
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Handle scroll events
  const handleScroll = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollPosition = container.scrollTop + (container.clientHeight / 2);
    let closestIndex = 0;
    let closestDistance = Infinity;
    sectionRefs.current.forEach((ref, index) => {
      if (!ref) return;
      if (ref.offsetTop <= scrollPosition) {
        const distance = scrollPosition - ref.offsetTop;
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      }
    });
    setActiveSection(closestIndex);
  };

  // Handle dot clicks
  const scrollToSection = (index) => {
    if (sectionRefs.current[index]) {
      sectionRefs.current[index].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Set up section refs
  const setSectionRef = (ref, index) => {
    sectionRefs.current[index] = ref;
  };

  // Add scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className={"w-full h-full bg-[#000000] " + css}>
      {/* Navigation Dots */}
      <div className="fixed right-2 sm:right-4 md:right-6 top-1/2 transform -translate-y-1/2 z-40">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(index)}
            className={`block w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 my-2.5 sm:my-3 md:my-3.5 rounded-full cursor-pointer transition-all duration-300 ${
              index === activeSection 
                ? 'bg-white scale-100' 
                : 'bg-white/30 scale-80'
            }`} 
            aria-label={`Go to ${section.name} section`}
          />
        ))}
      </div>
  
      {/* Fullscreen button removed as requested */}

      {/* Scroll Container - Full height */}
      <div 
      ref={containerRef} 
      className="overflow-y-auto snap-y snap-mandatory w-full h-[calc(100svh-9.2svh)]"
    >
        {/* Video Player Section */}
        <section 
          ref={ref => setSectionRef(ref, 0)}
          className={`snap-start overflow-hidden h-[calc(100svh-9.2svh)]`}
        >
          <VideoPlayer css="w-full h-full overflow-hidden" mobileAlignment="left" />
        </section>

        {/* Showcase360 Section */}
        <section 
            ref={(ref) => setSectionRef(ref, 1)}
            className="snap-start flex flex-col bg-black h-[calc(100svh-9.2svh)] justify-between pt-2"
          >

          {/* 1. TOP - Title Section */}
          <div className="py-6">
            <div className="w-[60vw] mx-auto min-w-[320px] max-w-4xl grid place-items-center text-white">
              <h1 className="text-center text-xl sm:text-2xl font-bold">
                Showcase 360
              </h1>
            </div>
          </div>

          {/* 2. MIDDLE - Video Container */}
          <div className="flex-1 flex items-center justify-center min-h-0 mb-3 md:mb-4">
            <div className="relative w-full h-full max-w-5xl max-h-[70vh] rounded-xl overflow-hidden shadow-lg">
              <video 
                key={W < H ? "mobile-video" : "desktop-video"} 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-fit"
                preload="auto"
              >
                <source 
                  src={W < H 
                    
                    ? "/homepage/2_Showcase360 Mobile_comp.mp4" 
                    : "/homepage/2_Showcase360 Desktop_comp.mp4"
                  } 
                  type="video/mp4" 
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* 3. BOTTOM - CTA Section */}
          <div className="text-center py-3 md:py-4 pb-6 md:pb-8 safe-bottom">
            <p className="text-base md:text-lg text-[#868686] mt-2 min-w-[330px] max-w-3xl mx-auto px-4 mb-3 leading-relaxed">
              Showcase your space in an interactive and immersive way with 360° Virtual Tours
            </p>
            
            <a 
               href="/gallery-showcase360"  
              className="inline-flex items-center justify-center h-10 px-6 bg-black rounded-lg text-gray-200 hover:text-white transition-colors duration-200 shadow-md buttonShadow"
            >
              <img className="h-[45%] mr-2" src={play} alt="Play Icon" /> 
              View Gallery
            </a>
          </div>
        </section>
        {/* Commercial Films Section */}
        <section
          ref={(ref) => setSectionRef(ref, 2)}
          className="snap-start flex flex-col bg-black h-[calc(100svh-9.2svh)] justify-between pt-2"
        >
          <ModelComp
            css="w-full h-full"
            title="Video Production"
            description="Tell your brand's story through engaging and high-quality Video Production. [ Promotional Property Film , Corporate Ad-Film , 360° VR Video ]"
            buttonText="View Gallery"
            buttonLink="/commercialflims"
            model="/homepage/Commercial Films_comp.mp4"
          />
        </section>
        <section
          ref={(ref) => setSectionRef(ref, 3)}
          className="snap-start flex flex-col bg-black h-[calc(100svh-9.2svh)] justify-between pt-2"
        >
          <ModelComp
            css="w-full h-full"
            title="3D ArchViz Rendering"
            description="Visualize your architectural projects with photorealistic 3D renderings and immersive virtual environments"
            buttonText="View Portfolio"
            buttonLink="/3darchvizrendering"
            model="/homepage/3D Archviz_comp.mp4"
          />
        </section>
        {/* Clients Section */}
        <section
          ref={(ref) => setSectionRef(ref, 4)}
          className="snap-start flex h-[calc(100svh-9.2svh)] pt-2 overflow-hidden"
        >
          <Clients css="w-full h-full pb-10 sm:pb-8 md:pb-6" />
          <Partners />
        </section>


        {/* Contact Us Section */}
        <section 
          ref={ref => setSectionRef(ref, 5)}
          className="snap-start flex flex-col items-center justify-center bg-black h-[calc(100svh-9.2svh)] overflow-y-auto px-3 sm:px-4 pt-2 sm:pt-2"
        >
          <MapContactUs css="w-full h-full pb-20 md:pb-12 lg:pb-8" />
        </section>
      </div>
    </div>
  );
}

export default Home;