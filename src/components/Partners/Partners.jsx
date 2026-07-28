import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const Partners = () => {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/public/partners`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPartners(data.partners || []);
      })
      .catch((err) => console.error("Error fetching partners:", err));
  }, []);

  if (partners.length === 0) return null;

  return (
    <div className="w-full px-4 sm:px-8 lg:px-[5vw] xl:px-[10vw] pt-6 pb-4">
      <h1 className="text-center text-xl sm:text-2xl font-bold text-white mb-4">
        Our Business Partners
      </h1>
      <div className="client-grid-vertical">
        {partners.map((p) => (
          <div key={p._id} className="client-logo-item">
            <img
              src={`${API_URL}${p.logo}`}
              alt={p.name}
              loading="lazy"
              onError={(e) => {
                e.target.style.opacity = 0.5;
                e.target.style.filter = "none";
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Partners;
