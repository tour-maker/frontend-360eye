import React from 'react';
import './clients.css';

// Demo component using the same data structure as the API
const ClientsDemo = ({ css }) => {
  // Sample data from the API
  const mockData = {
    "success": true,
    "sliders": [
    
      // Add more mock items as needed
    ]
  };

  // Handle logo click to open link in new tab
  const handleLogoClick = (link) => {
    if (link) window.open(link, "_blank", "noopener,noreferrer");
  };

  // Render client logos in auto-adjusting grid layout
  const renderClientLogos = () => {
    return mockData.sliders.map((slider) => (
      <div
        key={slider._id}
        onClick={() => handleLogoClick(slider.sliderLink)}
        className="client-logo-item"
        tabIndex="0"
        role="button"
        aria-label={`Client: ${slider.title}`}
      >
        {/* For demo, use placeholder images */}
        <div className="demo-logo">
          <span>{slider.title.charAt(0)}</span>
        </div>
        <div className="client-name">{slider.title}</div>
      </div>
    ));
  };

  return (
    <div className={`client-section text-white flex flex-col justify-between h-full ${css}`}>
      <div className="section-container w-full h-full flex flex-col">
        <div className="section-header px-4 pt-4 md:pt-6 md:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Our Clients (Demo)</h2>
          <p className="text-sm md:text-base text-gray-300 mb-4">
            Auto-adjusting grid layout demonstration
          </p>
        </div>

        <div className="client-logos-container flex-grow">
          <div className="client-container h-full">
            <div className="client-grid">
              {renderClientLogos()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientsDemo;

// Add additional styling for the demo version
const additionalStyles = `
  .demo-logo {
    width: 60%;
    height: 60%;
    background: linear-gradient(45deg, #1a1a1a, #333);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
    color: rgba(135, 186, 58, 0.8);
    margin-bottom: 0.5rem;
  }
  
  .client-logo-item:hover .demo-logo {
    background: linear-gradient(45deg, #222, #444);
    color: rgba(135, 186, 58, 1);
  }
  
  @media (max-width: 767px) {
    .demo-logo {
      font-size: 1.5rem;
    }
  }
  
  @media (max-width: 479px) {
    .demo-logo {
      font-size: 1.2rem;
    }
  }
`;

// Add the styles to the document
const styleElement = document.createElement('style');
styleElement.textContent = additionalStyles;
document.head.appendChild(styleElement);
