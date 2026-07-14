import React, { useEffect } from 'react';
import { CommercialFlimsCarousel } from '../../components/Carousel/CommercialFlimsCarousel';
import { useOutletContext } from 'react-router-dom';

export const CommercialFlims = () => {
  const css = useOutletContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <>
      <div className={'w-full h-[calc(100svh-9.2svh)] overflow-y-auto bg-black' + css}>
        <CommercialFlimsCarousel
          title="Video Production"
          button="Show Playlist"
        />
      </div>
    </>
  );
};