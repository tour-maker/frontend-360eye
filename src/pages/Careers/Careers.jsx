import { useEffect, useState } from "react";
import { fetchOpenRoles, fetchCareerSettings } from "../../services/careerService";
import ApplicationModal from "./ApplicationModal";

const CARD_TINTS = [
  "linear-gradient(135deg,#1a2e10,#0d1706)",
  "linear-gradient(135deg,#1c2e33,#0e161a)",
  "linear-gradient(135deg,#33291c,#1a140e)",
  "linear-gradient(135deg,#331c1c,#1a0e0e)",
  "linear-gradient(135deg,#221a13,#110d09)",
  "linear-gradient(135deg,#331c26,#1a0e14)",
  "linear-gradient(135deg,#12181d,#090c0e)",
  "linear-gradient(135deg,#2c1c33,#16121a)",
  "linear-gradient(135deg,#1c2c33,#0e161a)",
];

const ICONS = {
  visualizer: (
    <svg width="100%" height="100%" viewBox="0 0 52 52">
      <rect x="6" y="6" width="40" height="30" rx="2" fill="none" stroke="#86BA3A" strokeWidth="1.6" />
      <path className="anim-model3d" d="M16 30 L16 20 L26 15 L36 20 L36 30 L26 35 Z M16 20 L26 25 L36 20 M26 25 L26 35" fill="none" stroke="#86BA3A" strokeWidth="1.6" strokeLinejoin="round" />
      <rect x="16" y="42" width="20" height="4" fill="#86BA3A" />
    </svg>
  ),
  manager3d: (
    <svg width="100%" height="100%" viewBox="0 0 52 52">
      <rect x="6" y="10" width="14" height="10" fill="none" stroke="#86BA3A" strokeWidth="1.4" />
      <rect x="22" y="10" width="14" height="10" fill="none" stroke="#86BA3A" strokeWidth="1.4" />
      <rect x="6" y="24" width="14" height="10" fill="none" stroke="#86BA3A" strokeWidth="1.4" />
      <rect x="22" y="24" width="14" height="10" fill="none" stroke="#86BA3A" strokeWidth="1.4" />
      <rect className="anim-reviewscan" x="4" y="8" width="34" height="14" fill="none" stroke="#fff" strokeWidth="1.6" strokeDasharray="3 2" />
    </svg>
  ),
  projectManager: (
    <svg width="100%" height="100%" viewBox="0 0 52 52">
      <path className="anim-check1" d="M8 14 L12 18 L20 10" fill="none" stroke="#86BA3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 13 L44 13" stroke="#86BA3A" strokeWidth="1.6" />
      <path className="anim-check2" d="M8 26 L12 30 L20 22" fill="none" stroke="#86BA3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 25 L44 25" stroke="#86BA3A" strokeWidth="1.6" />
      <path className="anim-check3" d="M8 38 L12 42 L20 34" fill="none" stroke="#86BA3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 37 L44 37" stroke="#86BA3A" strokeWidth="1.6" />
    </svg>
  ),
  bde: (
    <svg width="100%" height="100%" viewBox="0 0 52 52">
      <rect x="10" y="20" width="32" height="22" rx="2" fill="none" stroke="#86BA3A" strokeWidth="1.8" />
      <path d="M18 20 L18 14 C18 12 19.5 10 22 10 L30 10 C32.5 10 34 12 34 14 L34 20" fill="none" stroke="#86BA3A" strokeWidth="1.8" />
      <path d="M10 26 L42 26" stroke="#86BA3A" strokeWidth="1.4" />
      <g className="anim-cashfloat">
        <rect x="15" y="30" width="11" height="7" rx="1" fill="#86BA3A" opacity="0.85" />
        <text x="20.5" y="35.5" fontSize="6" fill="#0a0a0a" textAnchor="middle" fontWeight="bold">₹</text>
        <rect x="25" y="32" width="11" height="7" rx="1" fill="#86BA3A" />
        <text x="30.5" y="37.5" fontSize="6" fill="#0a0a0a" textAnchor="middle" fontWeight="bold">$</text>
      </g>
    </svg>
  ),
  photoEditor: (
    <svg width="100%" height="100%" viewBox="0 0 52 52">
      <rect x="6" y="8" width="30" height="26" fill="none" stroke="#86BA3A" strokeWidth="1.6" />
      <path d="M6 26 L16 16 L24 22 L36 10" fill="none" stroke="#86BA3A" strokeWidth="1.4" opacity="0.5" />
      <circle cx="16" cy="16" r="2.5" fill="#86BA3A" />
      <g className="anim-cropframe">
        <rect x="18" y="14" width="20" height="20" fill="none" stroke="#fff" strokeWidth="1.6" strokeDasharray="3 2" />
      </g>
    </svg>
  ),
  videoEditor: (
    <svg width="100%" height="100%" viewBox="0 0 52 52">
      <rect x="6" y="8" width="40" height="26" rx="2" fill="none" stroke="#86BA3A" strokeWidth="1.6" />
      <polygon points="21,15 21,27 32,21" fill="#86BA3A" />
      <rect x="6" y="38" width="14" height="4" fill="#86BA3A" />
      <rect x="24" y="38" width="14" height="4" fill="#86BA3A" />
      <rect x="6" y="45" width="6" height="6" fill="#86BA3A" />
      <rect x="14" y="45" width="10" height="6" fill="#86BA3A" />
      <rect x="26" y="45" width="8" height="6" fill="#86BA3A" />
      <rect className="anim-playhead" x="9" y="36" width="2" height="18" fill="#fff" />
    </svg>
  ),
  webDeveloper: (
    <svg width="100%" height="100%" viewBox="0 0 52 52">
      <rect x="6" y="6" width="40" height="30" rx="2" fill="none" stroke="#86BA3A" strokeWidth="1.6" />
      <path className="anim-bracketl" d="M17 16 L11 21 L17 26" fill="none" stroke="#86BA3A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path className="anim-bracketr" d="M35 16 L41 21 L35 26" fill="none" stroke="#86BA3A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect className="anim-cursorblink" x="24" y="16" width="2" height="10" fill="#86BA3A" />
      <rect x="14" y="42" width="24" height="4" fill="#86BA3A" />
    </svg>
  ),
  uiDesigner: (
    <svg width="100%" height="100%" viewBox="0 0 52 52">
      <rect x="6" y="6" width="40" height="30" rx="2" fill="none" stroke="#86BA3A" strokeWidth="1.6" />
      <rect x="14" y="12" width="12" height="12" fill="none" stroke="#86BA3A" strokeWidth="1.4" />
      <g className="anim-dragnode"><rect x="28" y="16" width="10" height="10" fill="#86BA3A" /></g>
      <rect x="14" y="42" width="24" height="4" fill="#86BA3A" />
    </svg>
  ),
  socialMedia: (
    <svg width="100%" height="100%" viewBox="0 0 52 52">
      <path d="M14 14 L38 14 M14 14 L14 38 M38 14 L38 38 M14 38 L38 38" stroke="#86BA3A" strokeWidth="1" opacity="0.3" />
      <circle cx="26" cy="26" r="3" fill="#86BA3A" opacity="0.6" />
      <g className="anim-plat1"><rect x="6" y="6" width="16" height="16" rx="3" fill="#3b5998" /><text x="14" y="19" fontSize="13" fill="#fff" textAnchor="middle" fontWeight="bold">f</text></g>
      <g className="anim-plat2"><rect x="30" y="6" width="16" height="16" rx="4" fill="#c13584" /><rect x="34" y="10" width="8" height="8" rx="2" fill="none" stroke="#fff" strokeWidth="1.3" /><circle cx="38" cy="14" r="2" fill="none" stroke="#fff" strokeWidth="1" /></g>
      <g className="anim-plat3"><rect x="6" y="30" width="16" height="16" rx="3" fill="#ff0000" /><polygon points="12,34 12,42 20,38" fill="#fff" /></g>
      <g className="anim-plat4"><rect x="30" y="30" width="16" height="16" rx="3" fill="#0077b5" /><text x="38" y="43" fontSize="11" fill="#fff" textAnchor="middle" fontWeight="bold">in</text></g>
    </svg>
  ),
};

const ICON_MAP = [
  { match: /3d.*architect|3d.*visualiz.*artist/i, key: "visualizer" },
  { match: /3d.*design|3d.*visualiz.*manager/i, key: "manager3d" },
  { match: /project.*manager/i, key: "projectManager" },
  { match: /business|sales|development/i, key: "bde" },
  { match: /photo/i, key: "photoEditor" },
  { match: /video/i, key: "videoEditor" },
  { match: /web|develop/i, key: "webDeveloper" },
  { match: /graphic|ui|visual.*design/i, key: "uiDesigner" },
  { match: /social|media/i, key: "socialMedia" },
];

const getIconKey = (title = "") => {
  const found = ICON_MAP.find((f) => f.match.test(title));
  return found ? found.key : "visualizer";
};

const iconStyles = `
@keyframes anim-spin3d { from { transform: rotateY(0deg) rotateX(8deg); } to { transform: rotateY(360deg) rotateX(8deg); } }
@keyframes anim-scan { 0%,100% { transform: translateY(0); opacity: 1; } 50% { transform: translateY(16px); opacity: 0.6; } }
@keyframes anim-checkoff { 0%,20% { stroke-dashoffset: 20; opacity: 0.3; } 40%,100% { stroke-dashoffset: 0; opacity: 1; } }
@keyframes anim-cashbob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
@keyframes anim-cropslide { 0%,100% { transform: translateX(0); } 50% { transform: translateX(-8px); } }
@keyframes anim-scrub { 0%,100% { transform: translateX(0); } 50% { transform: translateX(14px); } }
@keyframes anim-blink { 0%,45% { opacity: 1; } 50%,95% { opacity: 0; } 100% { opacity: 1; } }
@keyframes anim-bracket { 0%,100% { transform: translateX(0); } 50% { transform: translateX(3px); } }
@keyframes anim-bracketrev { 0%,100% { transform: translateX(0); } 50% { transform: translateX(-3px); } }
@keyframes anim-drag { 0%,100% { transform: translate(0,0); } 50% { transform: translate(4px,-4px); } }
@keyframes anim-platform { 0%,20% { opacity: 1; transform: scale(1); } 25%,95% { opacity: 0.3; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
.anim-model3d { animation: anim-spin3d 4s linear infinite; transform-style: preserve-3d; transform-origin: 26px 24px; }
.anim-reviewscan { animation: anim-scan 2s ease-in-out infinite; }
.anim-check1 { stroke-dasharray: 20; animation: anim-checkoff 2.4s ease-in-out infinite; }
.anim-check2 { stroke-dasharray: 20; animation: anim-checkoff 2.4s ease-in-out infinite; animation-delay: 0.5s; }
.anim-check3 { stroke-dasharray: 20; animation: anim-checkoff 2.4s ease-in-out infinite; animation-delay: 1s; }
.anim-cashfloat { animation: anim-cashbob 2s ease-in-out infinite; }
.anim-cropframe { animation: anim-cropslide 2.4s ease-in-out infinite; transform-origin: 26px 22px; }
.anim-playhead { animation: anim-scrub 2.4s ease-in-out infinite; }
.anim-cursorblink { animation: anim-blink 1.1s steps(1) infinite; }
.anim-bracketl { animation: anim-bracket 1.8s ease-in-out infinite; }
.anim-bracketr { animation: anim-bracketrev 1.8s ease-in-out infinite; }
.anim-dragnode { animation: anim-drag 2.2s ease-in-out infinite; }
.anim-plat1 { animation: anim-platform 4s ease-in-out infinite; }
.anim-plat2 { animation: anim-platform 4s ease-in-out infinite; animation-delay: 1s; }
.anim-plat3 { animation: anim-platform 4s ease-in-out infinite; animation-delay: 2s; }
.anim-plat4 { animation: anim-platform 4s ease-in-out infinite; animation-delay: 3s; }
`;

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
    <div className="w-full bg-[#0a0a0a] text-white py-8 px-4 sm:px-8 lg:px-[6vw]">
      <style>{iconStyles}</style>
      <div className="relative max-w-5xl mx-auto py-6 sm:py-7 px-6 sm:px-8">
        <span className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#86BA3A]"></span>
        <span className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#86BA3A]"></span>
        <span className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#86BA3A]"></span>
        <span className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#86BA3A]"></span>

        <div className="text-center pb-6">
          <p className="uppercase tracking-[0.3em] text-[10px] text-[#86BA3A] mb-3 font-mono">
            {roles.length || 9} positions open
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold leading-[1.25] tracking-tight max-w-2xl mx-auto">
            {settings?.tagline || "Join the team that makes spaces convincing before anyone steps inside"}
          </h1>
          <p className="mt-3 text-gray-400 text-sm sm:text-base font-light max-w-lg mx-auto leading-relaxed">
            {settings?.subline || "360EYE specializes in immersive virtual tours, 3D visualization, and real estate marketing technology."}
          </p>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 text-sm">Loading roles...</p>
        ) : roles.length === 0 ? (
          <p className="text-center text-gray-500 text-sm">No open roles right now. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {roles.map((role, i) => (
              <button
                key={role._id}
                onClick={() => openApplyModal(role._id)}
                className="text-left rounded-lg overflow-hidden relative border border-[#232320] hover:border-[#86BA3A] transition-colors aspect-square flex flex-col items-center justify-center p-2"
                style={{ background: CARD_TINTS[i % CARD_TINTS.length] }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 mb-1.5">
                  {ICONS[getIconKey(role.title)]}
                </div>
                <p className="text-[9px] sm:text-[10px] font-semibold leading-tight text-center">
                  {role.title}
                </p>
              </button>
            ))}
          </div>
        )}

        <div className="text-center pt-6">
          <button
            onClick={() => openApplyModal(null)}
            className="w-full sm:w-auto bg-[#86BA3A] text-black px-8 py-2.5 font-mono uppercase text-xs tracking-widest rounded-sm font-semibold hover:bg-[#75a52f] transition-colors"
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
