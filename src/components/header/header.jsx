import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaFolderOpen, FaFolder, FaChevronRight, FaHome, FaEye, FaInfoCircle, FaEnvelope } from "react-icons/fa";
import { HiOutlinePhotograph, HiOutlineCube, HiOutlineFilm } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import "./header-shadow.css";

function Header({ css }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showGalleryDropdown, setShowGalleryDropdown] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if device is a tablet on component mount
  useEffect(() => {
    const checkDeviceSize = () => {
      const width = window.innerWidth;
      // Consider tablet size between 768px and 1024px
      setIsTablet(width > 768 && width <= 1024);
      
      // Removed auto-opening gallery on tablet devices to prevent
      // unwanted behavior when switching between portrait and landscape
    };
    
    checkDeviceSize();
    window.addEventListener('resize', checkDeviceSize);
    return () => window.removeEventListener('resize', checkDeviceSize);
  }, []);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
    // We'll preserve the gallery dropdown state during orientation changes
    // No automatic opening/closing based on device orientation
  };
  const toggleGalleryDropdown = () => setShowGalleryDropdown(!showGalleryDropdown);
  const closeAll = () => {
    setShowMenu(false);
    setShowGalleryDropdown(false);
  };

  // We no longer automatically redirect from gallery-showcase360 to showcase360
  // This allows the gallery-showcase360 route to be properly displayed
  // useEffect(() => {
  //   if (location.pathname.includes("gallery-showcase360")) {
  //     navigate("/showcase360");
  //   }
  // }, [location.pathname, navigate]);

  // Check active states - ensure proper distinction between showcase360 and gallery-showcase360
  const isShowcase360 = location.pathname === "/showcase360";
  const isGalleryShowcase360 = location.pathname === "/gallery-showcase360";
  const isCommercialPhotography = location.pathname.includes("3darchvizrendering");
  const isCommercialFilms = location.pathname.includes("commercialflims");

  const getCurrentPageName = () => {
  
    if (isGalleryShowcase360) return "GALLERY: SHOWCASE360";
    if (isCommercialPhotography) return "3D ARCHVIZ";
    if (isCommercialFilms) return "VIDEO PRODUCTION";
    return "GALLERY";
  };

  // Simple animation variants
  const menuVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  // State to track if we're in mobile view
  const [isMobileView, setIsMobileView] = useState(false);
  
  // Check for mobile view on component mount and resize
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  return (
    <div 
      className={`fixed w-full z-50 ${
        location.pathname === "/" || (location.pathname.includes("showcase360") && isMobileView)
          ? "bg-transparent" 
          : "bg-black"
        } ${css} h-[9.2svh]`}
      style={{
        borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 4px 8px -2px rgba(255, 255, 255, 0.15)'
      }}>
      {/* Fixed height with direct shadow styling */}

      <div className="w-full h-full flex justify-between items-center relative">
        {/* Minimal Menu Button - Only visible when menu is closed */}
        {!showMenu && (
          <div className="z-50 pl-4 pt-4 md:hidden">
            <motion.button 
              onClick={toggleMenu} 
              className="text-white p-2"
              aria-label="Toggle Menu"
              whileTap={{ scale: 0.9 }}
            >
              <FaBars size={20} />
            </motion.button>
          </div>
        )}

        {/* Minimal Authentic Mobile Menu */}
        <AnimatePresence>
          {showMenu && (
            <motion.div 
              ref={menuRef}
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute inset-0 bg-black/90" />
              
              <div className="h-full flex flex-col relative">
                {/* Minimal Header */}
                <div className="py-8 px-6 flex justify-between items-center">
                  <div className="text-2xl tracking-wide">
                    <span className="text-white font-extralight">360</span>
                    <span className="text-[#87BA3A] font-medium">EYE</span>
                  </div>
                  <button 
                    onClick={closeAll} 
                    className="text-white w-8 h-8 flex items-center justify-center focus:outline-none"
                    aria-label="Close menu"
                  >
                    <FaTimes size={18} />
                  </button>
                </div>
                
                {/* Minimal Menu Items with Folder-Style Gallery */}
                <div className="flex-1 flex flex-col justify-center items-center py-4">
                  <nav className="w-full max-w-xs">
                    <motion.ul 
                      className="space-y-5 px-8"
                      variants={{
                        hidden: {},
                        visible: {
                          transition: { staggerChildren: 0.1 }
                        }
                      }}
                      initial="hidden"
                      animate="visible"
                    >
                      {/* Home Menu Item */}
                      <motion.li
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 }
                        }}
                      >
                        <motion.div whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                          <Link 
                            to="/" 
                            className={`flex items-center py-1 text-lg font-light tracking-wide ${location.pathname === "/" ? "text-[#87BA3A]" : "text-white hover:text-[#87BA3A]"}`}
                            onClick={closeAll}
                          >
                            <motion.div whileHover={{ rotate: 10 }} transition={{ type: "spring", stiffness: 300 }}>
                              <FaHome size={16} className={location.pathname === "/" ? "text-[#87BA3A]" : "text-white"} />
                            </motion.div>
                            <span className="ml-2">Home</span>
                          </Link>
                        </motion.div>
                      </motion.li>
                      
                      {/* Showcase360 Menu Item */}
                      <motion.li
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 }
                        }}
                      >
                        <motion.div whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                          <Link 
                            to="/showcase360" 
                            className={`flex items-center py-1 text-lg font-light tracking-wide ${isShowcase360 ? "text-[#87BA3A]" : "text-white hover:text-[#87BA3A]"}`}
                            onClick={closeAll}
                          >
                            <motion.div whileHover={{ scale: 1.2 }} transition={{ type: "spring", stiffness: 300 }}>
                              <FaEye size={16} className={isShowcase360 ? "text-[#87BA3A]" : "text-white"} />
                            </motion.div>
                            <span className="ml-2">Showcase360</span>
                          </Link>
                        </motion.div>
                      </motion.li>
                      
                      {/* Gallery Folder with Submenu */}
                      <motion.li
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 }
                        }}
                      >
                        <div className="mb-1">
                          <motion.button 
                            onClick={toggleGalleryDropdown}
                            className="flex items-center w-full py-1 text-lg font-light tracking-wide text-white hover:text-[#87BA3A] focus:outline-none"
                            whileHover={{ x: 3 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          >
                            <motion.div
                              animate={{ rotate: showGalleryDropdown ? [0, -10, 0] : 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                              {showGalleryDropdown ? 
                                <FaFolderOpen size={16} className="text-[#87BA3A]" /> : 
                                <FaFolder size={16} className="text-white" />}
                            </motion.div>
                            <span className="ml-2">Gallery</span>
                            <motion.div
                              animate={{ rotate: showGalleryDropdown ? 90 : 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="ml-auto"
                            >
                              <FaChevronRight size={12} />
                            </motion.div>
                          </motion.button>
                        </div>
                        
                        {/* Gallery Submenu Items */}
                        <AnimatePresence>
                          {showGalleryDropdown && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden ml-5 pl-2 border-l border-white/20"
                            >
                              {/* Gallery Item: Showcase360 */}
                              <motion.li 
                                className="mt-2"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                              >
                                <motion.div 
                                  whileHover={{ x: 3 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                >
                                  <Link 
                                    to="/gallery-showcase360" 
                                    className={`flex items-center py-1 text-base font-light tracking-wide ${isGalleryShowcase360 ? "text-[#87BA3A]" : "text-white/80 hover:text-white"}`}
                                    onClick={closeAll}
                                  >
                                    <motion.div whileHover={{ scale: 1.2 }} transition={{ type: "spring" }}>
                                      <HiOutlinePhotograph size={16} className={isGalleryShowcase360 ? "text-[#87BA3A]" : ""} />
                                    </motion.div>
                                    <span className="ml-2">Showcase360</span>
                                  </Link>
                                </motion.div>
                              </motion.li>
                              
                              {/* Gallery Item: 3D Archviz */}
                              <motion.li 
                                className="mt-2"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                              >
                                <motion.div whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                                  <Link 
                                    to="/3darchvizrendering" 
                                    className={`flex items-center py-1 text-base font-light tracking-wide ${isCommercialPhotography ? "text-[#87BA3A]" : "text-white/80 hover:text-white"}`}
                                    onClick={closeAll}
                                  >
                                    <motion.div whileHover={{ scale: 1.2 }} transition={{ type: "spring" }}>
                                      <HiOutlineCube size={16} className={isCommercialPhotography ? "text-[#87BA3A]" : ""} />
                                    </motion.div>
                                    <span className="ml-2">3D Archviz</span>
                                  </Link>
                                </motion.div>
                              </motion.li>
                              
                              {/* Gallery Item: Commercial Films */}
                              <motion.li 
                                className="mt-2 mb-1"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                              >
                                <motion.div whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                                  <Link 
                                    to="/commercialflims" 
                                    className={`flex items-center py-1 text-base font-light tracking-wide ${isCommercialFilms ? "text-[#87BA3A]" : "text-white/80 hover:text-white"}`}
                                    onClick={closeAll}
                                  >
                                    <motion.div whileHover={{ scale: 1.2 }} transition={{ type: "spring" }}>
                                      <HiOutlineFilm size={16} className={isCommercialFilms ? "text-[#87BA3A]" : ""} />
                                    </motion.div>
                                    <span className="ml-2">Video Production</span>
                                  </Link>
                                </motion.div>
                              </motion.li>
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </motion.li>

		      {/* Blog Menu Item */}
                      <motion.li
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 }
                        }}
                      >
                        <motion.div whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                          <Link
                            to="/blog"
                            className={`flex items-center py-1 text-lg font-light tracking-wide ${location.pathname.includes("blog") ? "text-[#87BA3A]" : "text-white hover:text-[#87BA3A]"}`}
                            onClick={closeAll}
                          >
                            <span className="ml-2">Blog</span>
                          </Link>
                        </motion.div>
                      </motion.li>	
                      
                      {/* About Us Menu Item */}
                      <motion.li
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 }
                        }}
                      >
                        <motion.div whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                          <Link 
                            to="/aboutus" 
                            className={`flex items-center py-1 text-lg font-light tracking-wide ${location.pathname.includes("aboutus") ? "text-[#87BA3A]" : "text-white hover:text-[#87BA3A]"}`}
                            onClick={closeAll}
                          >
                            <motion.div whileHover={{ rotate: 10 }} transition={{ type: "spring", stiffness: 300 }}>
                              <FaInfoCircle size={16} className={location.pathname.includes("aboutus") ? "text-[#87BA3A]" : "text-white"} />
                            </motion.div>
                            <span className="ml-2">About Us</span>
                          </Link>
                        </motion.div>
                      </motion.li>
                      
                      {/* Contact Us Menu Item */}
                      <motion.li
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 }
                        }}
                      >
                        <motion.div whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                          <Link 
                            to="/contactus" 
                            className={`flex items-center py-1 text-lg font-light tracking-wide ${location.pathname.includes("contactus") ? "text-[#87BA3A]" : "text-white hover:text-[#87BA3A]"}`}
                            onClick={closeAll}
                          >
                            <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300 }}>
                              <FaEnvelope size={16} className={location.pathname.includes("contactus") ? "text-[#87BA3A]" : "text-white"} />
                            </motion.div>
                            <span className="ml-2">Contact Us</span>
                          </Link>
                        </motion.div>
                      </motion.li>
                    </motion.ul>
                  </nav>
                </div>
                
                {/* Minimal Footer */}
                <div className="py-6 px-6 text-center">
                  <div className="flex justify-center space-x-8 mb-4">
                    <a href="https://instagram.com" className="text-white/70 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                    </a>
                    <a href="https://wa.me/917096360360" className="text-white/70 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                    </a>
                    <a href="mailto:info@360eye.in" className="text-white/70 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                        <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                      </svg>
                    </a>
                  </div>
                  <p className="text-xs text-white/50 font-light">© 2025 360EYE. All rights reserved.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Desktop Navigation */}
        <nav className="hidden md:block w-full h-full">
          <div className="w-full h-full  flex justify-center items-center text-white
            space-x-6 sm:space-x-8 md:space-x-12 lg:space-x-20 px-4 md:px-8 shadows flex-wrap ">
            <NavLink 
              to="/" 
              className={({isActive}) => `text-base hover:text-[#87BA3A] transition-colors ${isActive ? "text-[#87BA3A]" : ""}`}
              onClick={closeAll}
            >
              HOME
            </NavLink>
            
            <NavLink 
              to="/showcase360" 
              className={({isActive}) => `text-base hover:text-[#87BA3A] transition-colors ${isActive ? "text-[#87BA3A]" : ""}`}
              onClick={closeAll}
            >
              SHOWCASE360
            </NavLink>
            
            <div className="relative" ref={dropdownRef}>
            <motion.button
              className={`text-base hover:text-[#87BA3A] transition-colors duration-300 ${
                isGalleryShowcase360 || isCommercialPhotography || isCommercialFilms 
                  ? "text-[#87BA3A]" 
                  : ""
              }`}
              onClick={toggleGalleryDropdown}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
                {getCurrentPageName()}
                <motion.span
                  animate={{ rotate: showGalleryDropdown ? 180 : 0 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className="inline-block ml-1"
                > ▼
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {showGalleryDropdown && (
                  <motion.div
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-900 text-white py-1 rounded-lg shadow-2xl z-10 min-w-[250px] overflow-hidden border border-white/10 backdrop-blur-md"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: "auto",
                      opacity: 1,
                      transition: { 
                        duration: 0.5,
                        ease: [0.4, 0, 0.2, 1]
                      }
                    }}
                    exit={{ 
                      height: 0,
                      opacity: 0,
                      transition: { 
                        duration: 0.4,
                        ease: [0.4, 0, 0.2, 1]
                      }
                    }}
                  >
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={{
                        hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
                        visible: { 
                          transition: { 
                            staggerChildren: 0.15, 
                            delayChildren: 0.2,
                          } 
                        }
                      }}
                      className="py-1"
                    >
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: -5 },
                          visible: { 
                            opacity: 1, 
                            y: 0,
                            transition: {
                              duration: 0.5,
                              ease: [0.4, 0, 0.2, 1]
                            }
                          }
                        }}
                        className="px-5 py-2.5"
                      >
                        <NavLink
                          to="/gallery-showcase360"
                          className={({isActive}) => `block hover:text-[#87BA3A] transition-colors duration-300 ${
                            isActive ? "text-[#87BA3A] font-medium" : ""
                          }`}
                          onClick={closeAll}
                        >
                        Showcase360
                        </NavLink>
                      </motion.div>
                      
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: -5 },
                          visible: { 
                            opacity: 1, 
                            y: 0,
                            transition: {
                              duration: 0.5,
                              ease: [0.4, 0, 0.2, 1]
                            }
                          }
                        }}
                        className="px-5 py-2.5"
                      >
                        <NavLink
                          to="/3darchvizrendering"
                          className={({isActive}) => `block hover:text-[#87BA3A] transition-colors duration-300 ${
                            isActive ? "text-[#87BA3A] font-medium" : ""
                          }`}
                          onClick={closeAll}
                        >
                          3D ArchViz Rendering
                        </NavLink>
                      </motion.div>
                      
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: -5 },
                          visible: { 
                            opacity: 1, 
                            y: 0,
                            transition: {
                              duration: 0.5,
                              ease: [0.4, 0, 0.2, 1]
                            }
                          }
                        }}
                        className="px-5 py-2.5">
                        <NavLink
                          to="/commercialflims"
                          className={({isActive}) => `block hover:text-[#87BA3A] transition-colors duration-300 ${
                            isActive ? "text-[#87BA3A] font-medium" : ""
                          }`}
                          onClick={closeAll}
                        >
                          Video Production
                        </NavLink>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink
              to="/blog"
              className={({isActive}) => `text-base hover:text-[#87BA3A] transition-colors ${isActive ? "text-[#87BA3A]" : ""}`}
              onClick={closeAll}
            >
              BLOG
            </NavLink>
            <NavLink
              to="/careers"
              className={({isActive}) => `text-base hover:text-[#87BA3A] transition-colors ${isActive ? "text-[#87BA3A]" : ""}`}
              onClick={closeAll}
            >
              CAREERS
            </NavLink>
            <NavLink 
              to="/aboutus" 
              className={({isActive}) => `text-base hover:text-[#87BA3A] transition-colors ${isActive ? "text-[#87BA3A]" : ""}`}
              onClick={closeAll}
            >
              ABOUT US
            </NavLink>
            
            <NavLink 
              to="/contactus" 
              className={({isActive}) => `text-base hover:text-[#87BA3A] transition-colors ${isActive ? "text-[#87BA3A]" : ""}`}
              onClick={closeAll}
            >
              CONTACT US
            </NavLink>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Header;