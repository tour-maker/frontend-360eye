import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAlbumImages } from '../../services/albumService';
import { 
  FaChevronLeft, FaChevronRight, FaTimes, 
  FaPlay, FaPause, FaExpand, FaCompress
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export const AlbumImages = () => {
  const { albumId } = useParams();
  const [albumData, setAlbumData] = useState({
    images: [],
    albumName: '',
    totalImages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(3000);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playIntervalRef = useRef(null);
  const fullscreenRef = useRef(null);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeout = useRef(null);
  const [direction, setDirection] = useState(0);

  // Add swipe state
  const [swipeStartX, setSwipeStartX] = useState(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  // Add zoom state
  const [scale, setScale] = useState(1);
  const [initialDistance, setInitialDistance] = useState(null);

  // Pan/drag state for zoomed image
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  // Container/image measurement for clamped panning
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ w: rect.width, h: rect.height });
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
  const clampPan = (nextX, nextY, customScale = null) => {
    const s = customScale ?? scale;
    const { w: cw, h: ch } = containerSize;
    const { w: nw, h: nh } = naturalSize;
    if (!cw || !ch || !nw || !nh) return { x: nextX, y: nextY };
    // Fit-to-height: displayed height equals container height; width follows aspect ratio
    const imageRatio = nw / nh;
    const displayedH = ch;
    const displayedW = ch * imageRatio;
    const scaledW = displayedW * s;
    const scaledH = displayedH * s;
    const maxOffsetX = Math.max(0, (scaledW - cw) / 2);
    const maxOffsetY = Math.max(0, (scaledH - ch) / 2);
    return {
      x: clamp(nextX, -maxOffsetX, maxOffsetX),
      y: clamp(nextY, -maxOffsetY, maxOffsetY),
    };
  };

  const imageVariants = {
    enter: () => ({ opacity: 0 }),
    center: {
      opacity: 1,
      transition: { opacity: { duration: 0.2 } }
    },
    exit: () => ({ opacity: 0, transition: { duration: 0.2 } }),
  };

  // Fetch album data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAlbumImages(albumId);
        
        
        // Map and format the images
        const formattedImages = response.images.map(img => {
          
          return {
            ...img,
            thumbPhoto: formatUrl(img.thumbPhoto, '/placeholder-thumb.jpg'),
            // Choose the best available image URL for fullscreen
            photo: formatUrl(
              img.photo || img.desktopPhoto || img.imageUrl || img.url,
              '/placeholder-image.jpg'
            ),
            title: img.title || '',
            description: img.imageDescription || img.description || '',
            subtitle: img.subtitle || ''
          };
        });
        
        // Sort images by name based on the number prefix (1_desktop, 2, 3, etc.)
        const sortedImages = [...formattedImages].sort((a, b) => {
          // First check the original filename if available
          const aFilename = a.originalFilename || a.desktopPhoto || a.photo || '';
          const bFilename = b.originalFilename || b.desktopPhoto || b.photo || '';
          
          // Extract the base filename without path
          const aBaseName = aFilename.split('/').pop() || '';
          const bBaseName = bFilename.split('/').pop() || '';
          
          // Try to extract the first number from the filename
          const aMatch = aBaseName.match(/^(\d+)/);
          const bMatch = bBaseName.match(/^(\d+)/);
          
          // If both have numbers at the start, sort numerically
          if (aMatch && bMatch) {
            const aNum = parseInt(aMatch[0]);
            const bNum = parseInt(bMatch[0]);
            return aNum - bNum; // Sort numerically
          }
          
          // If only one has a number, prioritize it
          if (aMatch) return -1;
          if (bMatch) return 1;
          
          // Fall back to alphabetical sorting
          return aBaseName.localeCompare(bBaseName);
        });
        
        
        
        setAlbumData({
          images: sortedImages,
          albumName: response.albumName,
          totalImages: response.totalImages
        });
        
        

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const formatUrl = (url, fallback) => 
      url ? (url.startsWith('http') ? url : `${import.meta.env.VITE_BACKEND_URL}${url}`) : fallback;

    if (albumId) fetchData();
    return () => clearInterval(playIntervalRef.current);
  }, [albumId]);

  // Reset zoom on image change
  useEffect(() => {
    setScale(1);
    setSwipeOffset(0);
    setIsSwiping(false);
    setInitialDistance(null);
    setPanX(0);
    setPanY(0);
    setIsDragging(false);
  }, [selectedImageIndex]);
  
  // Add keyboard shortcuts for navigation and zoom
  useEffect(() => {
    if (selectedImageIndex !== null) {
      const handleKeyDown = (e) => {
        switch (e.key) {
          case 'ArrowLeft':
            handlePrevious();
            break;
          case 'ArrowRight':
            handleNext();
            break;
          case 'Escape':
            closeImage();
            break;
          case '+':
          case '=':
            setScale(prev => Math.min(prev + 0.2, 3));
            break;
          case '-':
            setScale(prev => Math.max(prev - 0.2, 1));
            break;
          case '0':
            setScale(1);
            break;
          case 'f':
            toggleFullscreen();
            break;
          case ' ':
            togglePlay();
            break;
          default:
            break;
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedImageIndex, albumData.images.length]);

  // Handle slideshow playback
  useEffect(() => {
    if (isPlaying && selectedImageIndex !== null) {
      playIntervalRef.current = setInterval(() => {
        setSelectedImageIndex(prev => (prev + 1) % albumData.images.length);
      }, playSpeed);
      return () => clearInterval(playIntervalRef.current);
    }
  }, [isPlaying, selectedImageIndex, albumData.images.length, playSpeed]);

  // Fullscreen handling
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      fullscreenRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Image navigation
  const handleNext = () => {
    setDirection(1);
    setSelectedImageIndex((prev) => (prev + 1) % albumData.images.length);
  };

  const handlePrevious = () => {
    setDirection(-1);
    setSelectedImageIndex((prev) => 
      prev === 0 ? albumData.images.length - 1 : prev - 1
    );
  };

  // Other controls
  const togglePlay = () => setIsPlaying(!isPlaying);

  const changeSpeed = () => {
    setPlaySpeed(prev => ([3000, 2000, 1000, 500][([3000, 2000, 1000, 500].indexOf(prev) + 1) % 4]));
    if (isPlaying) {
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 100);
    }
  };

  const closeImage = () => {
    setSelectedImageIndex(null);
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    document.body.style.overflow = 'auto';
    setIsPlaying(false);
  };

  const openImage = (index) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = 'hidden';
  };

  useEffect(() => {
    if (isFullscreen) {
      const resetTimeout = () => {
        clearTimeout(controlsTimeout.current);
        setShowControls(true);
        controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
      };
      
      resetTimeout();
      window.addEventListener('mousemove', resetTimeout);
      return () => {
        clearTimeout(controlsTimeout.current);
        window.removeEventListener('mousemove', resetTimeout);
      };
    }
  }, [isFullscreen]);

  // Touch handlers
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setSwipeStartX(e.touches[0].clientX);
      setIsSwiping(true);
    } else if (e.touches.length === 2) {
      setIsSwiping(false);
      setInitialDistance(
        Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
      );
      // Prevent default to avoid browser zooming
      e.preventDefault();
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && initialDistance) {
      // Handle zoom
      const currentDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const newScale = Math.min(Math.max(scale * (currentDistance / initialDistance), 1), 3);
      setScale(newScale);
    } else if (isSwiping && e.touches.length === 1 && swipeStartX) {
      // Handle swipe
      const currentX = e.touches[0].clientX;
      const diff = currentX - swipeStartX;
      if (Math.abs(diff) > 5) {
        e.preventDefault();
        setSwipeOffset(diff);
      }
    }
  };

  const handleTouchEnd = () => {
    setInitialDistance(null);
    if (isSwiping) {
      if (Math.abs(swipeOffset) > 50) {
        if (swipeOffset > 0) {
          handlePrevious();
        } else {
          handleNext();
        }
      }
      setIsSwiping(false);
      setSwipeOffset(0);
      setSwipeStartX(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-screen h-screen bg-black text-white p-8 text-center">
        <div className="text-red-500 text-2xl mb-4">Error Loading Album</div>
        <div className="text-gray-400 mb-6">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Helper function to check for empty content
  const hasContent = (str) => str && str.trim().length > 0;

  // Main render
  return (
    <div className="w-full h-[calc(100svh-9.2svh)] bg-black text-white py-6 overflow-y-auto">
      <h1 className="text-2xl font-medium text-center mb-6 mx-auto">
        {albumData.albumName}
      </h1>

      {/* Thumbnail Grid */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {albumData.images.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-xl text-gray-400 mb-2">No images found in this album</div>
            <div className="text-sm text-gray-600">Try another album or check back later</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {albumData.images.map((image, index) => (
              <motion.div
                key={image._id || index}
                className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
                onClick={() => openImage(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <img
                  src={image.thumbPhoto}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-48 sm:h-56 object-cover transition-opacity duration-300 group-hover:opacity-90"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=Thumbnail+Not+Found';
                    e.target.className = 'w-full h-48 sm:h-56 object-cover bg-gray-800';
                  }}
                />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-white text-sm font-medium truncate">
                    {image.title || `Image ${index + 1}`}
                  </span>
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Fullscreen Image Viewer */}
      <AnimatePresence custom={direction}>
        {selectedImageIndex !== null && albumData.images[selectedImageIndex] && (
          <motion.div 
            ref={fullscreenRef}
            className="fixed inset-0 bg-black z-50 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Viewer Header - overlay (transparent with left/right pills) */}
            <motion.div 
              className="absolute top-0 left-0 right-0 z-20 p-4 pointer-events-none"
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ type: 'spring' }}
            >
              <div className="flex justify-between items-start">
                {/* Left pill: count + title */}
                <div className="pointer-events-auto inline-flex items-center gap-3 bg-black/35 hover:bg-black/45 text-white rounded-lg px-3 py-2 backdrop-blur-sm shadow-sm">
                  <span className="font-medium whitespace-nowrap">{selectedImageIndex + 1} of {albumData.images.length}</span>
                  {albumData.images[selectedImageIndex].title && (
                    <span className="text-gray-200/90 truncate max-w-[50vw]">
                      {albumData.images[selectedImageIndex].title}
                    </span>
                  )}
                </div>

                {/* Right pill: controls */}
                <div className="pointer-events-auto inline-flex items-center gap-2 bg-black/35 hover:bg-black/45 text-white rounded-lg px-2 py-1 backdrop-blur-sm shadow-sm">
                  <motion.button
                    onClick={togglePlay}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-md hover:bg-white/10"
                    aria-label="Play/Pause slideshow"
                  >
                    {isPlaying ? <FaPause /> : <FaPlay />}
                  </motion.button>
                  <motion.button
                    onClick={changeSpeed}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-2 rounded-md hover:bg-white/10 text-sm"
                    aria-label="Change slideshow speed"
                  >
                    {playSpeed / 1000}s
                  </motion.button>
                  <motion.button
                    onClick={toggleFullscreen}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-md hover:bg-white/10"
                    aria-label="Toggle fullscreen"
                  >
                    {isFullscreen ? <FaCompress /> : <FaExpand />}
                  </motion.button>
                  <motion.button
                    onClick={closeImage}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-md hover:bg-white/10"
                    aria-label="Close viewer"
                  >
                    <FaTimes />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Main Image Content - fills viewport minus thumbnail space */}
            <div className="relative flex-1 w-full overflow-hidden" ref={containerRef}>
              <AnimatePresence custom={direction}>
                <motion.div
                  key={selectedImageIndex}
                  custom={direction}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <motion.div
                    style={{
                      x: isSwiping ? swipeOffset : panX,
                      y: panY,
                      scale: scale,
                      transition: (isSwiping || isDragging) ? 'none' : 'transform 0.2s ease-out',
                      transformOrigin: 'center center',
                      translateZ: 0,
                      touchAction: scale > 1 ? 'none' : 'pan-y',
                      cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'auto',
                      userSelect: scale > 1 ? 'none' : 'auto',
                      willChange: 'transform',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      height: '100%',
                      width: 'auto'
                    }}
                    className="h-full"
                    onDoubleClick={() => {
                      const nextScale = scale > 1 ? 1 : 2;
                      setScale(nextScale);
                      if (nextScale === 1) {
                        setPanX(0);
                        setPanY(0);
                      } else {
                        const { x, y } = clampPan(panX, panY, nextScale);
                        setPanX(x);
                        setPanY(y);
                      }
                    }}
                    onPointerDown={(e) => {
                      if (scale > 1 && e.isPrimary) {
                        e.preventDefault();
                        e.currentTarget.setPointerCapture?.(e.pointerId);
                        setIsDragging(true);
                        isDraggingRef.current = true;
                        dragStartRef.current = { x: e.clientX, y: e.clientY };
                        panStartRef.current = { x: panX, y: panY };
                      }
                    }}
                    onPointerMove={(e) => {
                      if (scale > 1 && isDraggingRef.current && e.isPrimary) {
                        e.preventDefault();
                        const dx = e.clientX - dragStartRef.current.x;
                        const dy = e.clientY - dragStartRef.current.y;
                        const { x, y } = clampPan(panStartRef.current.x + dx, panStartRef.current.y + dy);
                        setPanX(x);
                        setPanY(y);
                      }
                    }}
                    onPointerUp={(e) => {
                      if (e.isPrimary) {
                        setIsDragging(false);
                        isDraggingRef.current = false;
                        e.currentTarget.releasePointerCapture?.(e.pointerId);
                      }
                    }}
                    onPointerCancel={(e) => {
                      if (e.isPrimary) {
                        setIsDragging(false);
                        isDraggingRef.current = false;
                        e.currentTarget.releasePointerCapture?.(e.pointerId);
                      }
                    }}
                    onTouchStart={(e) => {
                      if (e.touches.length === 2) {
                        // Pinch zoom start
                        const touch1 = e.touches[0];
                        const touch2 = e.touches[1];
                        const dist = Math.hypot(
                          touch2.clientX - touch1.clientX,
                          touch2.clientY - touch1.clientY
                        );
                        setInitialDistance(dist);
                        e.preventDefault();
                      } else if (scale > 1 && e.touches.length === 1) {
                        // Start panning with one finger when zoomed
                        const t = e.touches[0];
                        dragStartRef.current = { x: t.clientX, y: t.clientY };
                        panStartRef.current = { x: panX, y: panY };
                        setIsDragging(true);
                      } else {
                        // Normal swipe navigation
                        handleTouchStart(e);
                      }
                    }}
                    onWheel={(e) => {
                      // Mouse wheel zoom
                      e.preventDefault();
                      const delta = e.deltaY * -0.01;
                      const newScale = Math.min(Math.max(1, scale + delta), 3);
                      setScale(newScale);
                      if (newScale === 1) {
                        setPanX(0);
                        setPanY(0);
                      } else {
                        const { x, y } = clampPan(panX, panY, newScale);
                        setPanX(x);
                        setPanY(y);
                      }
                    }}
                    onTouchMove={(e) => {
                      if (e.touches.length === 2) {
                        // Pinch zoom move
                        const touch1 = e.touches[0];
                        const touch2 = e.touches[1];
                        const dist = Math.hypot(
                          touch2.clientX - touch1.clientX,
                          touch2.clientY - touch1.clientY
                        );
                        if (initialDistance) {
                          const scale = dist / initialDistance;
                          const newScale = Math.min(Math.max(1, scale), 3);
                          setScale(newScale);
                          const { x, y } = clampPan(panX, panY, newScale);
                          setPanX(x);
                          setPanY(y);
                        }
                        e.preventDefault();
                      } else if (scale > 1 && e.touches.length === 1) {
                        // Pan when zoomed with one finger
                        const t = e.touches[0];
                        const dx = t.clientX - dragStartRef.current.x;
                        const dy = t.clientY - dragStartRef.current.y;
                        const { x, y } = clampPan(panStartRef.current.x + dx, panStartRef.current.y + dy);
                        setPanX(x);
                        setPanY(y);
                        e.preventDefault();
                      } else {
                        handleTouchMove(e);
                      }
                    }}
                    onTouchEnd={(e) => {
                      if (e.touches.length < 2 && initialDistance) {
                        // Pinch zoom end
                        setInitialDistance(null);
                      }
                      if (scale > 1) {
                        setIsDragging(false);
                      }
                      handleTouchEnd(e);
                    }}
                    onTouchCancel={(e) => {
                      if (e.touches.length < 2 && initialDistance) {
                        // Pinch zoom end
                        setInitialDistance(null);
                      }
                      if (scale > 1) {
                        setIsDragging(false);
                      }
                      handleTouchEnd(e);
                    }}
                  >
                    <motion.div
                      className="relative w-full h-full flex justify-center items-center"
                    >
                      <img
                        src={albumData.images[selectedImageIndex].photo}
                        className="object-contain select-none"
                        style={{
                          width: '100%',
                          height: 'auto',
                          maxHeight: '100%',
                          margin: 'auto'
                        }}
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
                        onLoad={(e) => {
                          const img = e.currentTarget;
                          setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
                        }}
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
                        }}
                        alt=""
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
              {/* Navigation controls positioned on sides of image */}
              <div className="absolute inset-x-0 bottom-4 z-20 p-4 pointer-events-none">
                {/* Content */}
                
                {/* Bottom navigation */}
                <div className="flex justify-between items-center pointer-events-auto">
                  <button 
                    onClick={handlePrevious}
                    className="p-3 bg-black/30 rounded-full text-white hover:bg-black/50 hover:text-green-400 transition-all"
                    aria-label="Previous image"
                  >
                    <FaChevronLeft size={24} />
                  </button>
                  <div className="space-y-1 text-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {albumData.images[selectedImageIndex]?.projectname || ''}
                  </h3>
                  
                  {(albumData.images[selectedImageIndex]?.architake || albumData.images[selectedImageIndex]?.aria) && (
                    <div className="flex justify-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                      {albumData.images[selectedImageIndex]?.architake && (
                        <span>{albumData.images[selectedImageIndex].architake}</span>
                      )}
                      {albumData.images[selectedImageIndex]?.aria && (
                        <span>{albumData.images[selectedImageIndex].aria}</span>
                      )}
                    </div>
                  )}
                </div>
                  <button 
                    onClick={handleNext}
                    className="p-3 bg-black/30 rounded-full text-white hover:bg-black/50 hover:text-green-400 transition-all"
                    aria-label="Next image"
                  >
                    <FaChevronRight size={24} />
                  </button>
                </div>
              </div>
            </div>
            {/* Thumbnail Strip - fixed height section below image */}
            <motion.div 
              className="w-full h-24 min-h-[96px] flex gap-2 p-4 bg-black border-t border-gray-800/40 overflow-x-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {albumData.images.map((image, index) => (
                <motion.img
                  key={index}
                  src={image.thumbPhoto}
                  alt={`Thumb ${index + 1}`}
                  className={`w-16 h-16 object-cover rounded cursor-pointer ${
                    index === selectedImageIndex 
                      ? 'border-2 border-green-500' 
                      : 'border-2 border-transparent opacity-70'
                  }`}
                  onClick={() => {
                    setSelectedImageIndex(index);
                  }}
                  whileHover={{ scale: 1.05, opacity: 1 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    scale: index === selectedImageIndex ? 1.1 : 1,
                    opacity: index === selectedImageIndex ? 1 : 0.7
                  }}
                  transition={{ type: 'spring', stiffness: 500 }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100x100?text=Thumb+Not+Found';
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-4 left-0 right-0 flex justify-center gap-4 z-50"
          >
            {/* Your control buttons here */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};