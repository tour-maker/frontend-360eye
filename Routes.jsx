import { createBrowserRouter } from "react-router-dom";
import Main from "./src/pages/main/Main";
import Home from "./src/pages/home/Home"
import Showcase360 from "./src/pages/Showcase360/Showcase360";
import { AboutUs } from "./src/pages/Aboutus.jsx/AboutUs";
import { ContactPage } from "./src/pages/ContactPage/Contactpage";
import { Gallery } from "./src/pages/Gallery/Gallery";
import { CommercialFlims } from "./src/pages/Commercials/CommercialFlims";
import { CommercialPhotography } from "./src/pages/Commercials/CommercialPhotography";
import { AlbumImages } from "./src/pages/Commercials/AlbumImages";
import { GalleryViewer } from './src/components/virtualTour/VirtualTourViewer';
import Blog from "./src/pages/Blog/Blog";
import BlogDetail from "./src/pages/Blog/BlogDetail";
 

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    id: "1",
    children: [
      {
        index: true,  // This is your home page - only one index route
        element: <Home />,
        id: "2",
      },
      {
        path: "showcase360",  // Remove index:true
        element: <Showcase360/>,
        id: "3",
      },
      {
        path: "aboutus",  // Remove index:true
        element: <AboutUs/>,
        id: "4",
      },
      {
        path: "contactus",  // Remove index:true
        element: <ContactPage/>,
        id: "5",
      },
      {       
        path: "gallery-showcase360",
        element: <Gallery/>,
        id: "6",
      },
      {
        path: "commercialflims",  // Remove index:true
        element: <CommercialFlims/>,
        id: "7",
      },
      {
        path: "3darchvizrendering",  // Remove index:true
        element: <CommercialPhotography/>,
        id: "8",
      },
      {
        path: "3darchvizrendering/:albumId",  // Remove index:true
        element: <AlbumImages/>,
        id: "9",
      },
      {
        path: "blog",
        element: <Blog/>,
        id: "10",
      },
      {
        path: "blog/:id",
        element: <BlogDetail/>,
        id: "11",
      },
    ],
  },
  {
    path: "/gallery/:tourPath/*",
    element: <GalleryViewer />,
    id: "gallery-viewer"
  }
]);
