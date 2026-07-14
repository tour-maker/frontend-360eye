import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import styles from './VirtualTourViewer.module.css';

/**
 * GalleryViewer component that displays a virtual tour in an iframe
 * Uses URL parameters to determine which tour to load
 * Supports paths in format 'gallery/3d/tourname/index.html'
 */

export const GalleryViewer = () => {

  const { tourPath, projectName } = useParams();
  const location = useLocation();
  const [iframeUrl, setIframeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const defaultTourMeta = {
    title: '360° Virtual Tour - 360EYE',
    description: 'Discover immersive 360° virtual tours with 360EYE.',
    image: 'https://360eye.in/social-share.jpg',
    keywords: '360 virtual tour, 360EYE, immersive experiences'
  };

  const [tourMeta, setTourMeta] = useState(defaultTourMeta);

  useEffect(() => {
    // Extract just the tour path from the URL, regardless of domain
    let path = '';
    
    // If the URL includes /gallery/3d/, extract everything after it
    if (location.pathname.includes('/gallery/')) {
      const pathSegments = location.pathname.split('/gallery/');
      if (pathSegments.length > 1) {
        path = pathSegments[1];
      }
    } else if (tourPath) {
      // Fall back to the route parameter if available
      path = tourPath;
    } else if (projectName) {
      // Handle realestate project routes
      path = `realestate/${projectName}/index.html`;
    }
    
    // Make sure we have the full path including index.html if not present
    // if (path && !path.includes('index.html') && !path.endsWith('/')) {
    // }
    
    console.log('Tour path extracted:', path);
    console.log('Query params:', location.search);
    
    // Reset state
    setHasError(false);
    setErrorMessage('');
    setIframeUrl('');
    setIsLoading(true);

    // Validate that we have a path
    if (!path) {
      setHasError(true);
      setErrorMessage('Invalid gallery URL. Please check the link and try again.');
      setIsLoading(false);
      return;
    }
    
    // Hard-coded base URL exactly as specified by user
    const baseUrl = import.meta.env.VITE_BACKEND_URL;

    // Fetch tour metadata for Open Graph tags
    const ensureAbsoluteUrl = (value = '') => {
      if (!value) return '';
      if (/^https?:\/\//i.test(value)) return value;
      const normalized = value.startsWith('/') ? value : `/${value}`;
      return `${baseUrl}${normalized}`;
    };

    const fetchTourMeta = async () => {
      let matchedTour = null;

      try {
        const searchPath = path.replace('/index.html', '').replace('.html', '');
        const response = await axios.get(`${baseUrl}/products`, {
          params: {
            categoryType: 'Virtual Tour',
            limit: 400,
          },
        });

        if (response.data.success) {
          const tour = response.data.products.find(
            (p) => p.tourURL && p.tourURL.toLowerCase().includes(searchPath.toLowerCase())
          );
          
          console.log(tour);

          if (tour) {
            const fallbackTitle = tour.urlName?.trim()
              || tour.tourName?.trim()
              || tour.name?.trim()
              || defaultTourMeta.title;

            const fallbackDescription = tour.productSmallDetail?.trim()
              || tour.productDescription?.trim()
              || `Explore ${fallbackTitle} in stunning 360° virtual reality.`;

            const imageUrl = ensureAbsoluteUrl(tour.thumbImage) || defaultTourMeta.image;

            const keywordCandidates = [
              tour.urlName,
              tour.tourName,
              tour.name,
              tour.productLocation,
              tour.area,
              tour.keyword,
              tour.tags,
              tour.productKeywords,
              tour.productTags
            ];

            const keywordSet = new Set();

            keywordCandidates.forEach((value) => {
              if (!value) return;

              if (Array.isArray(value)) {
                value.forEach((item) => {
                  const trimmed = String(item).trim();
                  if (trimmed) keywordSet.add(trimmed);
                });
                return;
              }

              String(value)
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean)
                .forEach((item) => keywordSet.add(item));
            });

            const fallbackKeywords = keywordSet.size
              ? Array.from(keywordSet).join(', ')
              : defaultTourMeta.keywords;

            setTourMeta({
              title: fallbackTitle,
              description: fallbackDescription,
              image: imageUrl,
              keywords: fallbackKeywords
            });
          } else {
            setTourMeta({ ...defaultTourMeta });
          }
        }

        setIframeUrl(tourUrl);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching tour metadata:', error);
        setHasError(true);
        setTourMeta({ ...defaultTourMeta });
        setErrorMessage('Unable to load tour information. Please try again later.');
        setIsLoading(false);
      }
    };

    const tourUrl = path.startsWith('http')
      ? path
      : `${baseUrl}/gallery/${path}${location.search}`;

    fetchTourMeta();

    console.log('Loading tour URL:', tourUrl);

  }, [tourPath, projectName, location]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
    setErrorMessage('Failed to load the 3D tour. The tour may not exist or there may be a connection issue.');
  };

  // Add timeout for iframe loading
  useEffect(() => {
    if (iframeUrl && !hasError) {
      const timeout = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
          setHasError(true);
          setErrorMessage('The 3D tour is taking too long to load. Please check your connection and try again.');
        }
      }, 15000); // 15 second timeout

      return () => clearTimeout(timeout);
    }
  }, [iframeUrl, isLoading, hasError]);

  // State to keep track of dynamic viewport height adjustments
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  // Ensure landscape lock is disabled for tour pages
  useEffect(() => {
    // Remove landscape lock class to allow all orientations on tour pages
    document.body.classList.remove('landscape-lock-enabled');
    
    return () => {
      // Don't re-add the class here - let Main.jsx handle it based on route
    };
  }, []);

  // Set up viewport and handle mobile address bar
  useEffect(() => {
    // Save original body and html styles
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPosition = document.body.style.position;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    
    // Prevent scrolling
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Function to update height on resize and orientation change
    const updateViewportHeight = () => {
      // Small delay to get actual height after address bar appears/disappears
      setTimeout(() => {
        setViewportHeight(window.innerHeight);
      }, 100);
    };
    
    // Initial height update
    updateViewportHeight();
    
    // Add event listeners
    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', updateViewportHeight);
    
    // Handle mobile viewport
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      // Save original viewport
      const originalViewport = viewportMeta.getAttribute('content');
      
      // Set viewport to prevent scaling and ensure full coverage
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      
      return () => {
        // Cleanup event listeners
        window.removeEventListener('resize', updateViewportHeight);
        window.removeEventListener('orientationchange', updateViewportHeight);
        
        // Restore original settings
        document.body.style.overflow = originalBodyOverflow;
        document.body.style.position = originalBodyPosition;
        document.documentElement.style.overflow = originalHtmlOverflow;
        viewportMeta.setAttribute('content', originalViewport);
      };
    }
    
    return () => {
      // Cleanup event listeners
      window.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('orientationchange', updateViewportHeight);
      
      // Restore original styles
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.position = originalBodyPosition;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, []);

  return (
    <div className={styles.galleryViewerContainer}>
      <Helmet>
        <title>{tourMeta.title}</title>
        <meta name="description" content={tourMeta.description} />
        <meta name="keywords" content={tourMeta.keywords} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={tourMeta.title} />
        <meta property="og:description" content={tourMeta.description} />
        <meta property="og:image" content={tourMeta.image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="360EYE" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={tourMeta.title} />
        <meta name="twitter:description" content={tourMeta.description} />
        <meta name="twitter:image" content={tourMeta.image} />
        
        {/* WhatsApp */}
        <meta property="og:image:type" content="image/jpeg" />
      </Helmet>
      
      <div 
        className={styles.virtualTourContainer}
        style={{
          height: `${viewportHeight}px`, // Dynamic height based on actual viewport
        }}
      >
        {isLoading && !hasError && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading Virtual Tour...</p>
          </div>
        )}
        
        {hasError && (
          <div className={styles.errorContainer}>
            <div className={styles.errorIcon}>⚠️</div>
            <h2 className={styles.errorTitle}>Unable to Load 3D Tour</h2>
            <p className={styles.errorMessage}>{errorMessage}</p>
            <div className={styles.errorActions}>
              <button 
                className={styles.retryButton}
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
              <button 
                className={styles.backButton}
                onClick={() => window.history.back()}
              >
                Go Back
              </button>
            </div>
            <div className={styles.supportInfo}>
              <p>If the problem persists, please contact support:</p>
              <a href="mailto:contact@360eye.in" className={styles.supportLink}>
                contact@360eye.in
              </a>
            </div>
          </div>
        )}
      
        {!hasError && iframeUrl && (
          <iframe
            src={iframeUrl}
            title="360° Virtual Tour"
            className={styles.tourIframe}
            frameBorder="0"
            scrolling="no"
            allowFullScreen
            allow="gyroscope; accelerometer; xr-spatial-tracking; downloads" 
            sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-popups allow-popups-to-escape-sandbox"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            style={{ opacity: isLoading ? 0 : 1 }}
          />
        )}

      </div>
    </div>
  );
};

export default GalleryViewer;
