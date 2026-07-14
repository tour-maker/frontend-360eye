import React, { useState, useEffect } from 'react';
import { fetchClientLogos, removeDuplicateLogos, getLogoImageUrl } from './clientsApi';
import './clients.css';

const Clients = ({ css }) => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch client logos from API using our service
  useEffect(() => {
    const getClientLogos = async () => {
      try {
        setLoading(true);
        setError(null); // Clear any previous errors
        const data = await fetchClientLogos();
        setSliders(data);
      } catch (err) {
        console.error('Error fetching client logos:', err);
        
        // Provide a user-friendly error message based on the error type
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
          setError('Network error: Please check your internet connection and try again.');
        } else if (err.message.includes('API request failed')) {
          setError('Server error: Unable to retrieve client logos. Please try again later.');
        } else {
          setError(`Error loading client logos: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    getClientLogos();
  }, []);

  // Handle logo click to open link in new tab
  const handleLogoClick = (link) => {
    if (link) window.open(link, "_blank", "noopener,noreferrer");
  };

  // Render client logos in an auto-adjusting grid layout
  const renderClientLogos = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading client logos...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3 className="error-title">Unable to Load Clients</h3>
          <p className="error-message">{error}</p>
          <button 
            className="error-retry-button" 
            onClick={() => {
              setLoading(true);
              fetchClientLogos()
                .then(data => {
                  setSliders(data);
                  setError(null);
                })
                .catch(err => {
                  console.error('Error on retry:', err);
                  if (err.name === 'TypeError' && err.message.includes('fetch')) {
                    setError('Network error: Please check your internet connection and try again.');
                  } else if (err.message.includes('API request failed')) {
                    setError('Server error: Unable to retrieve client logos. Please try again later.');
                  } else {
                    setError(`Error loading client logos: ${err.message}`);
                  }
                })
                .finally(() => setLoading(false));
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    if (sliders.length === 0) {
      return (
        <div className="empty-container">
          <p>No client logos available</p>
        </div>
      );
    }

    // Remove duplicates using the utility function
    const uniqueSliders = removeDuplicateLogos(sliders);
    
    return uniqueSliders.map(slider => (
      <div
        key={slider._id}
        onClick={() => handleLogoClick(slider.sliderLink)}
        className="client-logo-item"
        tabIndex="0"
        role="button"
        aria-label={`Client: ${slider.title}`}
      >
        <img
          src={getLogoImageUrl(slider.clientLogo)}
          alt={slider.title || 'Client Logo'}
          loading="lazy"
          onError={(e) => {
            e.target.style.opacity = 0.5;
            e.target.style.filter = "none";
          }}
        />
        {/* Company name removed as requested */}
      </div>
    ));
  };

  return (
    <div className="w-full h-[calc(100svh-9.2svh)] bg-black overflow-y-auto pt-8">
    {/* Header */}
    <div className="w-full text-white py-2 px-2 sm:px-8 lg:px-[5vw] xl:px-[10vw]">
      <h1 className="text-center text-xl sm:text-2xl font-bold text-white">
        Our Clients
      </h1>
    </div>

        {/* Container with no padding for single row */}
        <div className="client-logos-container flex-grow pb-0 pt-0 mt-0 px-4 sm:px-8 lg:px-[5vw] xl:px-[10vw]">
          <div className="client-container h-auto pt-0">
            <div className="client-grid-vertical">
              {renderClientLogos()}
            </div>
          </div>
          <div className="text-center py-2 sm:py-3 md:py-4">
        
     
        
      </div>

        </div>
        <div className="w-full flex justify-center items-center pb-4">
          <a href="/aboutus" className="text-center inline-flex items-center justify-center h-10 px-6 bg-black rounded-lg text-gray-200 hover:text-white transition-colors duration-200 shadow-md">
            <span className="text-[#87BA3A] mr-1 text-center">Read more</span> About Us
          </a>
        </div>
    </div>
  );
};

export default Clients;
