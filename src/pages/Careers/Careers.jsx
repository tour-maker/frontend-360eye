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
    <div className="w-full h-full overflow-y-auto bg-black text-white py-16 px-4 sm:px-8 lg:px-[10vw]">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          {settings?.tagline || "We don't just fill roles, we recruit obsessives."}
        </h1>
        <p className="mt-6 text-gray-400 text-base sm:text-lg">
          {settings?.subline || "360EYE specializes in immersive virtual tours, 3D visualization, and real estate marketing technology."}
        </p>
        <button
          onClick={() => openApplyModal(null)}
          className="mt-8 bg-[#86BA3A] text-white px-8 py-3 rounded-full font-medium hover:bg-[#75a32f] transition-colors"
        >
          Apply Now
        </button>
      </div>

      {/* Divider */}
      <div className="max-w-4xl mx-auto my-16 border-t border-gray-800"></div>

      {/* Open Roles */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-8 text-center">Open Roles</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading roles...</p>
        ) : roles.length === 0 ? (
          <p className="text-center text-gray-500">No open roles right now. Check back soon.</p>
        ) : (
          <div className="space-y-3">
            {roles.map((role) => (
              <button
                key={role._id}
                onClick={() => openApplyModal(role._id)}
                className="w-full text-left bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 hover:border-[#86BA3A] transition-colors flex justify-between items-center group"
              >
                <div>
                  <h3 className="text-lg font-medium group-hover:text-[#86BA3A] transition-colors">{role.title}</h3>
                  {role.description && <p className="text-sm text-gray-500 mt-1">{role.description}</p>}
                </div>
                <span className="text-[#86BA3A] text-2xl">→</span>
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
