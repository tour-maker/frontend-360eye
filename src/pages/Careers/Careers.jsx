import { useEffect, useState } from "react";
import { fetchOpenRoles, fetchCareerSettings } from "../../services/careerService";
import ApplicationModal from "./ApplicationModal";

const ICON_MAP = [
  { match: /3d.*architect|3d.*visualiz.*artist/i, icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0Ij4KPHBvbHlnb24gcG9pbnRzPSIzMiw0IDU0LDE3IDU0LDQ3IDMyLDYwIDEwLDQ3IDEwLDE3IiBmaWxsPSJub25lIiBzdHJva2U9IiM3MGExM2QiIHN0cm9rZS13aWR0aD0iMS41Ii8+CjxwYXRoIGQ9Ik0yMiAzOCBMMjIgMjYgTDMyIDIwIEw0MiAyNiBMNDIgMzggTDMyIDQ0IFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzcwYTEzZCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0yMiAyNiBMMzIgMzIgTDQyIDI2IE0zMiAzMiBMMzIgNDQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzcwYTEzZCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPg==" },
  { match: /3d.*design|3d.*visualiz.*manager/i, icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0Ij4KPHBvbHlnb24gcG9pbnRzPSIzMiw0IDU0LDE3IDU0LDQ3IDMyLDYwIDEwLDQ3IDEwLDE3IiBmaWxsPSJub25lIiBzdHJva2U9IiM3MGExM2QiIHN0cm9rZS13aWR0aD0iMS41Ii8+CjxyZWN0IHg9IjIwIiB5PSIyMiIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBzdHJva2U9IiM3MGExM2QiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8cmVjdCB4PSIzNCIgeT0iMjIiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgc3Ryb2tlPSIjNzBhMTNkIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTI1IDMyIEwyNSAzOCBMMzkgMzggTDM5IDMyIiBzdHJva2U9IiM3MGExM2QiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4=" },
  { match: /project.*manager/i, icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0Ij4KPHBvbHlnb24gcG9pbnRzPSIzMiw0IDU0LDE3IDU0LDQ3IDMyLDYwIDEwLDQ3IDEwLDE3IiBmaWxsPSJub25lIiBzdHJva2U9IiM3MGExM2QiIHN0cm9rZS13aWR0aD0iMS41Ii8+CjxwYXRoIGQ9Ik0xOCAyNCBMNDYgMjQgTTE4IDMyIEwzOCAzMiBNMTggNDAgTDQyIDQwIiBzdHJva2U9IiM3MGExM2QiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxwYXRoIGQ9Ik00MCAzOCBMNDQgNDIgTDQ4IDM0IiBzdHJva2U9IiM3MGExM2QiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPg==" },
  { match: /business|sales|development/i, icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0Ij4KPHBvbHlnb24gcG9pbnRzPSIzMiw0IDU0LDE3IDU0LDQ3IDMyLDYwIDEwLDQ3IDEwLDE3IiBmaWxsPSJub25lIiBzdHJva2U9IiM3MGExM2QiIHN0cm9rZS13aWR0aD0iMS41Ii8+CjxjaXJjbGUgY3g9IjI0IiBjeT0iMjYiIHI9IjUiIHN0cm9rZT0iIzcwYTEzZCIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iMzgiIHI9IjUiIHN0cm9rZT0iIzcwYTEzZCIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CjxwYXRoIGQ9Ik0yOCAzMCBMMzYgMzQiIHN0cm9rZT0iIzcwYTEzZCIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik0yMCA0MCBMMjQgNDQiIHN0cm9rZT0iIzcwYTEzZCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+" },
  { match: /photo/i, icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0Ij4KPHBvbHlnb24gcG9pbnRzPSIzMiw0IDU0LDE3IDU0LDQ3IDMyLDYwIDEwLDQ3IDEwLDE3IiBmaWxsPSJub25lIiBzdHJva2U9IiM3MGExM2QiIHN0cm9rZS13aWR0aD0iMS41Ii8+CjxjaXJjbGUgY3g9IjMyIiBjeT0iMzIiIHI9IjkiIHN0cm9rZT0iIzcwYTEzZCIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CjxjaXJjbGUgY3g9IjMyIiBjeT0iMzIiIHI9IjQiIGZpbGw9IiM3MGExM2QiLz4KPHBhdGggZD0iTTMyIDE5IEwzMiAxNSBNMzIgNDUgTDMyIDQ5IiBzdHJva2U9IiM3MGExM2QiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4=" },
  { match: /video/i, icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0Ij4KPHBvbHlnb24gcG9pbnRzPSIzMiw0IDU0LDE3IDU0LDQ3IDMyLDYwIDEwLDQ3IDEwLDE3IiBmaWxsPSJub25lIiBzdHJva2U9IiM3MGExM2QiIHN0cm9rZS13aWR0aD0iMS41Ii8+Cjxwb2x5Z29uIHBvaW50cz0iMjYsMjIgMjYsNDIgNDIsMzIiIGZpbGw9IiM3MGExM2QiLz4KPC9zdmc+" },
  { match: /web|develop/i, icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0Ij4KPHBvbHlnb24gcG9pbnRzPSIzMiw0IDU0LDE3IDU0LDQ3IDMyLDYwIDEwLDQ3IDEwLDE3IiBmaWxsPSJub25lIiBzdHJva2U9IiM3MGExM2QiIHN0cm9rZS13aWR0aD0iMS41Ii8+CjxwYXRoIGQ9Ik0yOCAyMiBMMjAgMzIgTDI4IDQyIE0zNiAyMiBMNDQgMzIgTDM2IDQyIiBzdHJva2U9IiM3MGExM2QiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPg==" },
  { match: /graphic|ui|visual.*design/i, icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0Ij4KPHBvbHlnb24gcG9pbnRzPSIzMiw0IDU0LDE3IDU0LDQ3IDMyLDYwIDEwLDQ3IDEwLDE3IiBmaWxsPSJub25lIiBzdHJva2U9IiM3MGExM2QiIHN0cm9rZS13aWR0aD0iMS41Ii8+CjxjaXJjbGUgY3g9IjI2IiBjeT0iMjQiIHI9IjQiIGZpbGw9IiM3MGExM2QiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSIzMCIgcj0iNCIgc3Ryb2tlPSIjNzBhMTNkIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPGNpcmNsZSBjeD0iMjQiIGN5PSI0MCIgcj0iNCIgc3Ryb2tlPSIjNzBhMTNkIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTI5IDI2IEwzNyAyOSBNMzcgMzIgTDI3IDM4IiBzdHJva2U9IiM3MGExM2QiIHN0cm9rZS13aWR0aD0iMS41Ii8+Cjwvc3ZnPg==" },
  { match: /social|media/i, icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0Ij4KPHBvbHlnb24gcG9pbnRzPSIzMiw0IDU0LDE3IDU0LDQ3IDMyLDYwIDEwLDQ3IDEwLDE3IiBmaWxsPSJub25lIiBzdHJva2U9IiM3MGExM2QiIHN0cm9rZS13aWR0aD0iMS41Ii8+CjxjaXJjbGUgY3g9IjMyIiBjeT0iMzIiIHI9IjMiIGZpbGw9IiM3MGExM2QiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMiIgcj0iMy41IiBzdHJva2U9IiM3MGExM2QiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8Y2lyY2xlIGN4PSI0NCIgY3k9IjIyIiByPSIzLjUiIHN0cm9rZT0iIzcwYTEzZCIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CjxjaXJjbGUgY3g9IjMyIiBjeT0iNDYiIHI9IjMuNSIgc3Ryb2tlPSIjNzBhMTNkIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTMwIDMwIEwyMiAyNCBNMzQgMzAgTDQyIDI0IE0zMiAzNSBMMzIgNDMiIHN0cm9rZT0iIzcwYTEzZCIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KPC9zdmc+" },
];

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

const getIcon = (title = "") => {
  const found = ICON_MAP.find((f) => f.match.test(title));
  return found ? found.icon : ICON_MAP[0].icon;
};

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
      <div className="relative max-w-5xl mx-auto py-6 sm:py-7 px-6 sm:px-8">
        <span className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#86BA3A]"></span>
        <span className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#86BA3A]"></span>
        <span className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#86BA3A]"></span>
        <span className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#86BA3A]"></span>

        <div className="text-center pb-6">
          <p className="uppercase tracking-[0.3em] text-[10px] text-[#86BA3A] mb-3 font-mono">
            {roles.length || 9} positions open
          </p>
          <h1 className="text-xl sm:text-2xl font-bold leading-[1.25] tracking-tight max-w-xl mx-auto">
            {settings?.tagline || "Join the team that makes spaces convincing before anyone steps inside"}
          </h1>
          <p className="mt-3 text-gray-400 text-xs font-light max-w-md mx-auto leading-relaxed">
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
                <img
                  src={role.iconUrl || getIcon(role.title)}
                  alt=""
                  className="w-10 h-10 sm:w-12 sm:h-12 mb-1.5"
                />
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
