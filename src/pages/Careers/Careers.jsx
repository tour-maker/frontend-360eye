import { useEffect, useState } from "react";
import { fetchOpenRoles, fetchCareerSettings } from "../../services/careerService";
import ApplicationModal from "./ApplicationModal";

const Careers = () => {
  const [roles, setRoles] = useState([]);
  const [settings, setSettings] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [preselectedRoleId, setPreselectedRoleId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchOpenRoles(), fetchCareerSettings()])
      .then(([rolesData, settingsData]) => {
        setRoles(rolesData);
        setSettings(settingsData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const openApplyModal = (roleId = null) => {
    setPreselectedRoleId(roleId);
    setShowModal(true);
  };

  return (
    <div className="w-full bg-[#0a0a0a] text-white py-16 px-4 sm:px-8 lg:px-[10vw]">
      {/* Hero — camera viewfinder framing */}
      <div className="relative max-w-3xl mx-auto py-12 sm:py-20">
        {/* corner brackets */}
        <span className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-[#86BA3A]"></span>
        <span className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[#86BA3A]"></span>
        <span className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[#86BA3A]"></span>
        <span className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-[#86BA3A]"></span>

        <div className="text-center px-6">
          <p className="uppercase tracking-[0.3em] text-xs text-[#86BA3A] mb-6 font-mono">Now Focusing On Talent</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight">
            {settings?.tagline || "We don't just fill roles, we recruit obsessives."}
          </h1>
          <p className="mt-6 text-gray-400 text-base sm:text-lg max-w-xl mx-auto font-light">
            {settings?.subline || "360EYE specializes in immersive virtual tours, 3D visualization, and real estate marketing technology."}
          </p>
          <button
            onClick={() => openApplyModal(null)}
            className="mt-10 border-2 border-[#86BA3A] text-[#86BA3A] px-10 py-3 font-mono uppercase text-sm tracking-widest hover:bg-[#86BA3A] hover:text-black transition-colors duration-200"
          >
            ● Apply Now
          </button>
        </div>
      </div>

      {/* Divider — aperture-style */}
      <div className="max-w-4xl mx-auto my-16 flex items-center gap-4">
        <div className="flex-1 border-t border-gray-800"></div>
        <div className="w-2 h-2 rounded-full border border-gray-700"></div>
        <div className="flex-1 border-t border-gray-800"></div>
      </div>

      {/* Open Roles — film strip */}
      <div className="max-w-3xl mx-auto pb-16">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Open Roles</h2>
          <span className="font-mono text-xs text-gray-500">{roles.length.toString().padStart(2, "0")} POSITIONS</span>
        </div>
        {loading ? (
          <p className="text-center text-gray-500">Loading roles...</p>
        ) : roles.length === 0 ? (
          <p className="text-center text-gray-500">No open roles right now. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {roles.map((role, i) => (
              <button
                key={role._id}
                onClick={() => openApplyModal(role._id)}
                className="text-left border border-gray-800 rounded-lg overflow-hidden hover:border-[#86BA3A] transition-colors group"
              >
                <div className="relative h-40 bg-gray-900 overflow-hidden">
                  {role.image ? (
                    <img src={role.image} alt={role.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                      <span className="font-mono text-4xl text-gray-700">{(i + 1).toString().padStart(2, "0")}</span>
                    </div>
                  )}
                  <span className="absolute top-3 left-3 font-mono text-xs text-[#86BA3A] bg-black/70 px-2 py-1 rounded">{(i + 1).toString().padStart(2, "0")}</span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium group-hover:text-[#86BA3A] transition-colors">{role.title}</h3>
                    {role.description && <p className="text-xs text-gray-500 mt-1 font-light">{role.description}</p>}
                  </div>
                  <span className="text-gray-600 group-hover:text-[#86BA3A] group-hover:translate-x-1 transition-all duration-200 text-xl flex-shrink-0 ml-2">→</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <ApplicationModal
          roles={roles}
          preselectedRoleId={preselectedRoleId}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Careers;
