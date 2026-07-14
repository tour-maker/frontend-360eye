import React, { useEffect } from 'react'
import { CommercialFlimsCarousel } from '../../components/Carousel/CommercialFlimsCarousel'
import Footer from '../../components/footer/Footer'
import Fullpage, { FullPageSections, FullpageSection } from "@ap.cx/react-fullpage";
import { useOutletContext } from "react-router-dom";
export const CommercialPhotography = () => {
  const css = useOutletContext();
    const data = [
        {
            heading: "Project Location Video 1",
            video: "https://360eye.in/upload/product/4390/thumb_zqnn3wqbia2.jpg",
            playlist: "https://360eye.in//video/1_showcase360%20desktop_comp.mp4",
            description:
              "An immersive way to introduce project location with routes and surroundings."
          },
          {
            heading: "Project Location Video 2",
            video: "https://360eye.in/upload/product/4390/thumb_zqnn3wqbia2.jpg",
            playlist: "https://360eye.in//video/2_showcase360%20desktop_comp.mp4",
            description:
              "Showcase the project location using a detailed walkthrough of the area."
          },
          {
            heading: "Project Location Video 3",
            video: "https://360eye.in/upload/product/4390/thumb_zqnn3wqbia2.jpg",
            playlist: "https://360eye.in//video/3_showcase360%20desktop_comp.mp4",
            description:
              "Highlight surrounding routes and landmarks to emphasize the project's connectivity."
          },
          {
            heading: "Project Location Video 4",
            video: "https://360eye.in/upload/product/4390/thumb_zqnn3wqbia2.jpg",
            playlist: "https://360eye.in//video/4_showcase360%20desktop_comp.mp4",
            description:
              "A stunning visualization of the project's location and neighborhood environment."
          },
          {
            heading: "Project Location Video 5",
            video: "https://360eye.in/upload/product/4390/thumb_zqnn3wqbia2.jpg",
            playlist: "https://360eye.in//video/5_showcase360%20desktop_comp.mp4",
            description:
              "Explore the project with a focus on surrounding routes and points of interest."
          },
          {
            heading: "Project Location Video 5",
            video: "https://360eye.in/upload/product/4390/thumb_zqnn3wqbia2.jpg",
            playlist: "https://360eye.in//video/5_showcase360%20desktop_comp.mp4",
            description:
              "Explore the project with a focus on surrounding routes and points of interest."
          }
       ];

       useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

  return (
    <>
    <div className={'w-screen h-fit sm:h-screen lg:h-fit bg-black' + css}> 
      <CommercialFlimsCarousel
      title = "3D ArchViz Rendering"
      items={data}
      button="Show Portfolio"/>
    </div>

    {/* <Footer css="w-screen h-screen" /> */}

    </>
  )
}


