import { useEffect, useState } from "react";
import { fetchOpenRoles, fetchCareerSettings } from "../../services/careerService";
import ApplicationModal from "./ApplicationModal";

const CARD_TINTS = [
  "radial-gradient(circle at 30% 20%, #2a3a1c, #141a0e 70%)",
  "radial-gradient(circle at 70% 20%, #1c2e33, #0e161a 70%)",
  "radial-gradient(circle at 30% 70%, #332a1c, #1a150e 70%)",
  "radial-gradient(circle at 60% 40%, #331c26, #1a0e14 70%)",
  "radial-gradient(circle at 40% 30%, #2c1c33, #16121a 70%)",
  "radial-gradient(circle at 50% 50%, #1c3033, #0e181a 70%)",
  "radial-gradient(circle at 30% 60%, #33291c, #1a140e 70%)",
  "radial-gradient(circle at 60% 30%, #331c1c, #1a0e0e 70%)",
  "radial-gradient(circle at 40% 40%, #1c2c33, #0e161a 70%)",
];

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
    <div className="w-full bg-[#0a0a0a] text-white py-12 px-4 sm:px-8 lg:px-[10vw]">
      <div className="relative max-w-3xl mx-auto py-8 sm:py-11 px-5 sm:px-8">
        {/* corner brackets — now wrap the whole section, hero through roles */}
        <span className="absolute top-0 left-0 w-8 h-8 sm:w-9 sm:h-9 border-t-2 border-l-2 border-[#86BA3A]"></span>
        <span className="absolute top-0 right-0 w-8 h-8 sm:w-9 sm:h-9 border-t-2 border-r-2 border-[#86BA3A]"></span>
        <span className="absolute bottom-0 left-0 w-8 h-8 sm:w-9 sm:h-9 border-b-2 border-l-2 border-[#86BA3A]"></span>
        <span className="absolute bottom-0 right-0 w-8 h-8 sm:w-9 sm:h-9 border-b-2 border-r-2 border-[#86BA3A]"></span>

        <div className="text-center pb-9 sm:pb-11">
          <p className="uppercase tracking-[0.3em] text-[10px] sm:text-xs text-[#86BA3A] mb-5 font-mono">
            {roles.length || 9} positions open
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold leading-[1.2] tracking-tight max-w-xl mx-auto">
            {settings?.tagline || "Join the team that makes spaces convincing before anyone steps inside"}
          </h1>
          <p className="mt-4 text-gray-400 text-sm font-light max-w-md mx-auto leading-relaxed">
            {settings?.subline || "360EYE specializes in immersive virtual tours, 3D visualization, and real estate marketing technology."}
          </p>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 text-sm">Loading roles...</p>
        ) : roles.length === 0 ? (
          <p className="text-center text-gray-500 text-sm">No open roles right now. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3.5">
            {roles.map((role, i) => (
              <button
                key={role._id}
                onClick={() => openApplyModal(role._id)}
                className="text-left rounded-lg overflow-hidden relative aspect-square group"
                style={{ background: CARD_TINTS[i % CARD_TINTS.length] }}
              >
                <span
                  className="absolute -top-2 -left-0.5 font-serif font-bold leading-none pointer-events-none"
                  style={{ fontSize: "clamp(34px,7vw,60px)", color: "rgba(255,255,255,0.07)" }}
                >
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                <div
                  className="absolute left-0 right-0 bottom-0 p-2.5 sm:p-3.5"
                  style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.85))" }}
                >
                  <p className="text-[11px] sm:text-[13px] font-bold leading-tight group-hover:text-[#86BA3A] transition-colors">
                    {role.title}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="text-center pt-9 sm:pt-11">
          <button
            onClick={() => openApplyModal(null)}
            className="w-full sm:w-auto bg-[#86BA3A] text-black px-9 py-3 font-mono uppercase text-xs sm:text-[13px] tracking-widest rounded-sm font-semibold hover:bg-[#75a52f] transition-colors"
          >
            Apply now
          </button>
        </div>
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
