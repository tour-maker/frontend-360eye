import React, { useEffect, useState } from "react";
import { fetchProducts } from "../../services/galleryService";

export const CommercialFlimsCarousel = ({ title, button }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchPlaylistProducts = async () => {
      try {
        const response = await fetchProducts("Playlist");
        if (response.success) {
          const playlistProducts = response.products.filter(
            (product) => product.categoryType === "Playlist"
          );
          setProducts(playlistProducts);
        }
      } catch (error) {
        console.error("Error fetching playlist products:", error);
      }
    };

    fetchPlaylistProducts();
  }, []);

  return (
    <div className="w-full bg-black">
      {/* Header */}
      <div className="w-full  text-white py-10 px-4 sm:px-8 lg:px-[5vw] xl:px-[10vw]">
        <h1 className="text-center text-[clamp(20px,1.5vw,1.5vw)] text-white font-montserrat font-extralight">
          {title}
        </h1>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-7xl mx-auto px-4 sm:px-8">
        {products.map((product, index) => (
          <div
            key={index}
            className="bg-gray-900 flex flex-col h-full min-h-[320px] max-w-sm sm:max-w-md lg:max-w-lg mx-auto border border-gray-800 hover:border-[#87BA3A]/50 transition-all rounded-xl overflow-hidden"
          >
            {/* Image Container with Play Button Overlay */}
            <div className="relative h-40 sm:h-44 md:h-48 lg:h-52">
              <img
                // src={`http://192.168.29.36:5001${product.thumbImage}`}
                src={`${import.meta.env.VITE_BACKEND_URL}${product.thumbImage}`}
                alt={product.tourName}
                className="w-full h-full object-cover"
              />
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow p-4 text-center">
              <h2 className="text-lg font-medium text-white">{product.tourName}</h2>
              <p className="text-gray-400 text-sm mb-1 line-clamp-2">
                {product.productSmallDetail}
              </p>

              {/* Sleek Centered Button */}
              <div className="mt-auto flex justify-center">
              <a
                    href={product.tourURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-transparent rounded-lg px-4 py-2 gap-2 text-sm sm:text-base text-white border border-[#87BA3A] hover:bg-[#87BA3A]/10 transition-all"
                  >
                  {button}
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
