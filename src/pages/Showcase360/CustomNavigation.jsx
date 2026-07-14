import React from 'react';

// Custom navigation component that works with Fullpage
const CustomNavigation = ({ activeSection, onDotClick }) => {
  const sections = [0, 1, 2]; // For 3 sections

  return (
    <div className="fixed right-5 top-1/2 transform -translate-y-1/2 z-[9999] flex flex-col gap-3">
      {sections.map((index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={`w-3 h-3 rounded-full border-0 transition-all duration-300 ${
            index === activeSection ? 'bg-white scale-110' : 'bg-white/30 hover:bg-white/60'
          }`}
          aria-label={`Navigate to section ${index + 1}`}
          aria-current={index === activeSection ? 'true' : undefined}
        />
      ))}
    </div>
  );
};

export default CustomNavigation;
