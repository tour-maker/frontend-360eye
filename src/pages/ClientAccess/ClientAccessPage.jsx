import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const getGalleryRelativePath = (tourURL) => {
  if (!tourURL) return "";
  try {
    const url = new URL(tourURL);
    return url.pathname.replace(/^\/gallery\//, "").replace(/^\//, "");
  } catch {
    return tourURL.replace(/^\/gallery\//, "").replace(/^\//, "");
  }
};

export const ClientAccessPage = () => {
  const { slug } = useParams();
  const [status, setStatus] = useState("loading"); // loading | ok | invalid
  const [clientName, setClientName] = useState("");
  const [tours, setTours] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const validate = async () => {
      try {
        const res = await axios.get(`${API_URL}/client-access/${slug}`);
        if (res.data.success) {
          setClientName(res.data.clientName);
          setTours(res.data.tours || []);
          setStatus("ok");
        } else {
          setStatus("invalid");
        }
      } catch {
        setStatus("invalid");
      }
    };
    validate();
  }, [slug]);

  if (status === "loading") {
    return (
      <div className="fixed inset-0 top-[9.2svh] bg-black flex items-center justify-center z-40">
        <p className="text-[#9B9B9B]">Loading...</p>
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className="fixed inset-0 top-[9.2svh] bg-black flex flex-col items-center justify-center gap-4 z-40">
        <p className="text-white text-lg">This page is not available.</p>
        <Link to="/" className="text-[#87BA3A] hover:underline text-sm">
          Go to homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 top-[9.2svh] bg-black overflow-y-auto z-40">
      <div className="w-full flex flex-col items-center justify-center text-center py-14 px-4 border-b border-white/10">
        <p className="text-[#87BA3A] text-xs font-medium tracking-widest uppercase mb-3">
          Private Access
        </p>
        <h1 className="text-3xl md:text-4xl text-white font-light tracking-wide">
          Welcome, {clientName}
        </h1>
        <p className="text-[#9B9B9B] text-sm mt-3">
          Here are the virtual tours shared with you
        </p>
      </div>

      <div className="w-[90vw] md:w-[80vw] mx-auto py-12">
        {tours.length === 0 ? (
          <p className="text-center text-[#9B9B9B] py-16">No tours have been assigned yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour) => {
              const galleryPath = getGalleryRelativePath(tour.tourURL);
              const tourWebUrl = galleryPath ? `/gallery/${galleryPath}` : tour.tourURL;
              return (
                <a
                  key={tour._id}
                  href={tourWebUrl}
                  className="group block bg-white/5 border border-white/15 rounded-lg overflow-hidden hover:border-[#87BA3A] transition-all duration-300"
                >
                  <div className="relative h-48 bg-black flex items-center justify-center overflow-hidden">
                    {tour.thumbImage ? (
                      <img
                        src={`${API_URL}${tour.thumbImage}`}
                        alt={tour.tourName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <span className="text-[#87BA3A] text-xl font-light">360</span>
                    )}
                  </div>
                  <div className="p-5">
                    <h2 className="text-white text-base font-medium group-hover:text-[#87BA3A] transition-colors">
                      {tour.tourName}
                    </h2>
                    {tour.area && <p className="text-[#9B9B9B] text-sm mt-1">{tour.area}</p>}
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientAccessPage;
