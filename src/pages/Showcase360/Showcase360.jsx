import React, { useState, useRef, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { ShowcaseModelComp } from "../../components/modelComp/ShowcaseModelComp";
import ShowcaseCarousel from "../../components/Carousel/ShowcaseCarousel";
import play from "../../assets/playbutton.svg";
import "./Showcase360.css";

const W = window.innerWidth;
const H = window.innerHeight;

const Showcase360 = () => {
  const css = useOutletContext();
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
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
  
  const cardData = [
    {
      id: 1,
      title: "Immersive Experience",
      description:
        "Showcase360 provides an immersive and interactive experience for the viewer. This allows them to feel as if they are physically inside the space, giving them a better understanding of the layout & features.",
      icon: "🌐",
      image: "/images/service/immersive_cont.png", 
    },
    {
      id: 2,
      title: "CGI for Underconstruction Area",
      description:
        "By using our hyper realistic 3D Rendering service, you can start showcasing your property from the planning stage only.",
      icon: "🖥️",
      image: "/images/service/cgi_cont.png",
    },
    {
      id: 3,
      title: "Marketing & Branding Tool",
      description:
        "Showcase360 is useful for multi-purpose: One to one meeting, Expo & Summit, Project Launch, Social media marketing, Corporate presentation.",
      icon: "📈",
      image: "/images/service/marketing_cont.png",
    },
    {
      id: 4,
      title: "Boosted Site Visit",
      description:
        "Salesman can target 100x more visit compared to the traditional method.",
      icon: "📊",
      image: "/images/service/boosted_cont.png",
    },
    {
      id: 5,
      title: "Increased Engagement",
      description:
        "Showcase360 has the potential to increase engagement and interest in a property & product compared to traditional photographs or videos.",
      icon: "📱",
      image: "/images/service/increased_img.png",
    },
    {
      id: 6,
      title: "Cost-Effective",
      description:
        "By using our hyper realistic 3D Rendering service, you can start showcasing your property from the planning stage only.",
      icon: "💰",
      image: "/images/service/cost_effective_img.png",
    },
  ];
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const cardPairs = [];
  for (let i = 0; i < cardData.length; i += 2) {
    cardPairs.push(cardData.slice(i, i + 2));
  }

  const totalPairs = cardPairs.length;

  // Auto scroll effect for card carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPairIndex((prevIndex) => 
        prevIndex === totalPairs - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [totalPairs]);

  return (
    <div className={"w-full bg-[#000000] " + css}>
      {/* Navigation Dots */}
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

      {/* Scroll Container - Full height accounting for mobile */}
      <div 
        ref={containerRef} 
        className="showcase-scroll-container w-full"
      >
        {/* First Section - Showcase Model Component */}
        <section 
          ref={ref => setSectionRef(ref, 0)}
          className="showcase-section bg-black flex items-center justify-center w-full pb-16"
        >
          <ShowcaseModelComp
            css="w-full h-full"
            title="Showcase360 (what?)"
            
            imgSize={
              W < H
                ? "w-[clamp(310px,70vw,70vw)] h-auto max-h-[45vh] object-contain"
                : "w-[clamp(280px,40vw,40vw)] h-auto max-h-[45vh] object-contain"
            }
            buttonText1="Showcase your space in an interactive and immersive way with 360° Virtual Tours"
            buttonText2="It offers an immersive, interactive experience that allows viewers to explore every detail of a property or venue from any device."
            buttonText3="- Perfect for real estate, hospitality, retail, museums, and more -"
            model={W < H ? "/homepage/2_Showcase360 Mobile_comp.mp4" : "/homepage/2_Showcase360 Desktop_comp.mp4"}
            text={true}
          />
        </section>

        {/* Second Section - Showcase Carousel */}
        <section 
          ref={ref => setSectionRef(ref, 1)}
          className="showcase-section bg-black flex flex-col items-center justify-center w-full relative pb-16"
        >
          <div className="flex-grow w-full flex items-center justify-center">
            <ShowcaseCarousel />
          </div>
        </section>
        
        {/* Fixed View Gallery Button */}
        <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center">
          <a 
            href="/gallery-showcase360"  
            className="inline-flex items-center justify-center h-10 px-6 bg-black rounded-lg text-gray-200 hover:text-white transition-colors duration-200 shadow-md buttonShadow"
          >
            <img className="h-[45%] mr-2" src={play} alt="Play Icon" /> 
            View Gallery
          </a>
        </div>

        {/* Third Section */}
        <section 
          ref={ref => setSectionRef(ref, 2)}
          className="showcase-section bg-black flex flex-col items-center justify-start w-full pb-20 pt-4"
        >
          <div className="text-white p-2 sm:p-4 pt-[2vh] sm:pt-[5vh] md:pt-[8vh] w-full">
            {/* Header Section */}
            <div className="w-[90vw] md:w-[60vw] mx-auto mb-2 sm:mb-4 min-w-[280px] flex flex-col items-center justify-center gap-2 sm:gap-3">
              <h1 className="text-center text-[clamp(18px,5vw,22px)] md:text-[clamp(20px,1.5vw,24px)] min-h-[30px] text-white text-center font-montserrat font-extralight tracking-normal">
                Showcase360 (why?)
              </h1>
              <p className="text-[clamp(14px,4vw,16px)] md:text-[1rem] m-auto text-[#868686] font-light font-montserrat text-center max-w-[95%] md:max-w-[90%]">
                Tailored for property professionals, Showcase360 enhances your listings with immersive experiences.
              </p>
            </div>

            {/* Carousel for Mobile View */}
            <div className="sm:hidden relative h-[calc(65svh)] max-h-[500px] min-h-[300px] w-[90vw] mx-auto">
              <div className="overflow-hidden h-full">
                <div 
                  className="flex h-full transition-transform duration-300 ease-in-out"
                  style={{ 
                    transform: `translateX(-${currentPairIndex * 100}%)`
                  }}
                >
                  {cardPairs.map((pair, index) => (
                    <div key={index} className="w-full flex-shrink-0 px-4 py-2 flex flex-col justify-center space-y-4">
                      {pair.map((card) => (
                        <div
                          key={card.id}
                          className="w-full rounded-lg px-3 py-2 text-center shadow-lg bg-black flex flex-col h-[calc(30svh-10px)] min-h-[120px] max-h-[220px]"
                        >
                          <div className="w-full h-[50%] mb-1 flex items-center justify-center overflow-hidden rounded-lg">
                            <img
                              src={card.image}
                              alt={card.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col justify-between flex-1 overflow-y-auto py-1">
                            <h3 className="text-[clamp(14px,4vw,18px)] font-normal mb-1 flex items-center justify-center font-montserrat">
                              {card.title}
                            </h3>
                            <p className="text-[clamp(11px,3.5vw,14px)] text-[#868686] font-light font-montserrat">
                              {card.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {cardPairs.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentPairIndex(index)}
                    className={`h-2 w-2 rounded-full cursor-pointer transition-colors ${
                      index === currentPairIndex ? 'bg-white' : 'bg-white/50 hover:bg-white'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Grid for Larger Screens */}
            <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[85rem] w-[90%] mx-auto mb-20">
              {cardData.map((card) => (
                <div
                  key={card.id}
                  className="rounded-lg p-4 text-center shadow-lg bg-black flex flex-col justify-start items-center h-full"
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-[85%] h-[12svh] lg:h-[16svh] rounded-lg mb-3 object-cover"
                  />
                  <h3 className="text-[1.1rem] font-normal mb-2 flex items-center justify-center font-montserrat">
                    <span className="mr-2">{card.icon}</span> {card.title}
                  </h3>
                  <p className="text-[.9rem] text-[#868686] font-light font-montserrat">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Showcase360;
