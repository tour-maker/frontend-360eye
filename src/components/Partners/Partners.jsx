import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/public/partners`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPartners(data.partners || []);
      })
      .catch((err) => console.error("Error fetching partners:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || partners.length === 0) return null;

  return (
    <div className="w-full bg-black py-10 px-4 sm:px-8 lg:px-[10vw]">
      <h2 className="text-center text-xl sm:text-2xl font-bold text-white mb-8">
        Our Business Partners
      </h2>
      <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
        {partners.map((p) => (
          <div key={p._id} className="flex flex-col items-center gap-2">
            <img
              src={`${API_URL}${p.logo}`}
              alt={p.name}
              className="h-14 sm:h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300"
            />
            <span className="text-xs text-gray-400">{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Partners;
