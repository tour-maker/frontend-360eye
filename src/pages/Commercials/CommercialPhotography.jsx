import React, { useEffect, useState } from 'react';
import { fetchAlbums } from '../../services/albumService'; // Import the service to fetch albums
import { useNavigate } from 'react-router-dom';

export const CommercialPhotography = () => {
  const [albums, setAlbums] = useState([]); // State to store fetched albums
  const [loading, setLoading] = useState(false); // State to handle loading
  const navigate = useNavigate();

  // Fetch albums on component mount
  useEffect(() => {
    const fetchAlbumsData = async () => {
      setLoading(true);
      try {
        const response = await fetchAlbums(); // Fetch albums
        if (response.success) {
          setAlbums(response.albums); // Update state with fetched albums
        }
      } catch (error) {
        console.error('Error fetching albums:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumsData();
  }, []);

  // Handle album click to navigate to its images
  const handleAlbumClick = (albumId, albumType, extraFieldinput) => {
    
    if (albumType === "Gallery") {
      // Navigate to the album's gallery page
      navigate(`/3darchvizrendering/${albumId}`);
    } else if (albumType === "Page") {
      // Redirect to the page specified in extraFieldinput
      if (extraFieldinput) {
        navigate(`/${extraFieldinput}`); // Assuming `extraFieldinput` is the page name
      } else {
        // If `extraFieldinput` is not available, maybe show an alert or handle the case
        console.warn("No page name provided in extraFieldinput");
      }
    } else if (albumType === "Link") {
      // Open the link in a new window
      window.open(extraFieldinput, "_blank");
    }
  };

  return (
    <div className="w-full h-[calc(100svh-9.2svh)] bg-black overflow-y-auto">
      {/* Header */}
      <div className="w-full text-white py-10 px-4 sm:px-8 lg:px-[5vw] xl:px-[10vw]">
        <h1 className="text-center text-[clamp(20px,1.5vw,1.5vw)] text-white font-montserrat font-extralight">
          3D ArchViz Rendering
        </h1>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-7xl mx-auto px-4 sm:px-8">
        {albums.map((album) => (
          <div
            key={album._id}
            className="bg-gray-900 flex flex-col h-auto max-w-sm sm:max-w-md lg:max-w-lg mx-auto border border-gray-800 hover:border-[#87BA3A]/50 transition-all rounded-xl overflow-hidden"
            onClick={() => handleAlbumClick(album._id, album.albumType, album.albumExtraField)}
          >
            {/* Image Container with Play Button Overlay */}
            <div className="relative h-40 sm:h-44 md:h-48 lg:h-52">
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}${album.albumPhoto}`}
                alt={album.albumName}
                className="w-full h-full object-cover"
              />
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col p-4 pb-3 text-center">
              <h2 className="text-sm font-medium text-white whitespace-nowrap">{album.albumName}</h2>
              <p className="text-gray-400 text-sm mb-1 line-clamp-2">
                {album.albumDescription || 'Explore our 3D architectural visualizations'}
              </p>

              {/* Sleek Centered Button */}
              <div className="mt-2 flex justify-center">
                <a
                  className="inline-flex items-center justify-center bg-transparent rounded-lg px-4 py-2 gap-2 text-sm sm:text-base text-white border border-[#87BA3A] hover:bg-[#87BA3A]/10 transition-all"
                >
                  {album.albumType === "Gallery" ? "Show Gallery" : album.albumType === "Page" ? "Show Portfolio" : "Show Playlist"}
                  <svg viewBox="0 0 24 24" fill="#87BA3A" className="w-4 h-4">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};