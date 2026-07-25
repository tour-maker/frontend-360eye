import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import NewHeader from "../../components/header/header";
import { FaWhatsapp } from 'react-icons/fa';

function Main() {
  const location = useLocation();

  useEffect(() => {
    // Enable landscape lock for all pages EXCEPT virtual tour pages
    // Virtual tour pages are those starting with /gallery/
    const isTourPage = location.pathname.startsWith('/gallery/');
    
    const checkOrientation = () => {
      // Get viewport dimensions
      const viewport = window.visualViewport || window;
      const width = viewport.width || window.innerWidth;
      const height = viewport.height || window.innerHeight;
      
      // Check if device is in landscape mode (width > height)
      const isLandscape = width > height;
      
      // Improved iPad detection (including iPad Pro and modern iPads)
      const isIPad = /iPad|Macintosh/i.test(navigator.userAgent) && 'ontouchend' in document;
      
      // Detect tablets (iPad, Android tablets)
      const isTablet = isIPad || (/Android/i.test(navigator.userAgent) && width >= 768);
      
      // Detect if this is a mobile phone (small screen device)
      const isMobilePhone = width < 768 && !isTablet;
      
      // Only apply landscape lock if:
      // 1. NOT a tour page
      // 2. IS a mobile phone (width < 768 and not tablet)
      // 3. Device is in landscape orientation (width > height)
      // 4. Height is small (< 1500px)
      // 
      // This allows:
      // ✅ Desktop/PC in landscape (width >= 768)
      // ✅ Tablets (iPad/Android) in landscape (any size)
      // ✅ OnePlus Open unfolded landscape (height > 1500px)
      // ✅ All portrait modes
      // ❌ Mobile phones in landscape (width < 768 and height < 1500px)
      const shouldLock = !isTourPage && isMobilePhone && isLandscape && height < 1500;
      
      if (shouldLock) {
        document.body.classList.add('landscape-lock-enabled');
      } else {
        document.body.classList.remove('landscape-lock-enabled');
      }
    };

    // Initial check
    checkOrientation();

    // Handle resize and orientation changes
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', checkOrientation);
    }

    // Cleanup function
    return () => {
      document.body.classList.remove('landscape-lock-enabled');
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', checkOrientation);
      }
    };
  }, [location.pathname]);

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-full z-50">
        <NewHeader />
      </div>
      
      {/* Content Area with proper spacing */}
      <div className="flex flex-col w-full h-full">
        {/* Spacer with header height */}
        <div className="w-full h-[9.2svh] flex-none"></div>
        
        {/* Main Content */}
        <div className="flex-1 w-full overflow-y-auto">
          <Outlet context=" "/>
        </div>
      </div>
      
      {/* WhatsApp Button */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        <a
          href="https://wa.me/917096360360"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-900 hover:bg-gray-800 text-[#25D366] rounded-full p-4 shadow-lg transition"
        >
          <FaWhatsapp className="w-6 h-6" />
        </a>
      </div>
      {/* Uncomment below if Footer is needed */}
      {/* <Footer css="w-full h-auto" /> */}
    </div>
  );
}

export default Main;
