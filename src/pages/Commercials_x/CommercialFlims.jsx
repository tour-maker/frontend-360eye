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
      <div className={'w-full h-screen  bg-black flex flex-col justify-start sm:justify-center items-center pt-12 ' + css}>
        <CommercialFlimsCarousel
          title="Video Production"
          button="Show Playlist"
        />
      </div>
    </>
  );
};