import { useState, useEffect } from "react";
import "./App.css";
import { router } from "../Routes";
import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import RedirectHandler from './components/RedirectHandler';

function App() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault();
    };
    
    const handleKeyDown = (event) => {
      const key = event.key?.toLowerCase();
      
      // Block developer tools
      if ((event.ctrlKey || event.metaKey) && event.shiftKey) {
        if (key === "i" || key === "c" || key === "j" || key === "k") {
          event.preventDefault();
          event.stopPropagation();
        }
      }
      if ((event.ctrlKey || event.metaKey) && key === "u") {
        event.preventDefault();
        event.stopPropagation();
      }
      if (event.key === "F12") {
        event.preventDefault();
        event.stopPropagation();
      }
      
      // Attempt to block common screenshot shortcuts (limited effectiveness)
      if ((event.ctrlKey || event.metaKey) && event.shiftKey) {
        if (key === "3" || key === "4" || key === "5") {
          event.preventDefault();
          event.stopPropagation();
        }
      }
      if (event.key === "PrintScreen") {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Blur content when tab becomes hidden (potential recording detection)
        document.body.style.filter = "blur(10px)";
      } else {
        document.body.style.filter = "none";
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  return (
    <HelmetProvider>
      <RedirectHandler />
      {/* naved */}
      <RouterProvider router={router} />
    </HelmetProvider>
  );
}

export default App;
