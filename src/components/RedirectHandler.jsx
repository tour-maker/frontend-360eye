import { useEffect } from 'react';
import axios from 'axios';

const RedirectHandler = () => {
  useEffect(() => {
    const checkAndRedirect = async () => {
      try {
        // Get current URL path and query string
        const currentPath = window.location.pathname + window.location.search;
        
        // Check if there's a redirect for this URL
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://stageapi.360eye.in';
        const response = await axios.get(`${backendUrl}/admin/page-redirects/check`, {
          params: { url: currentPath },
          timeout: 3000 // 3 second timeout
        });

        if (response.data.success && response.data.hasRedirect) {
          console.log(`[Redirect] ${currentPath} -> ${response.data.newUrl}`);
          // Perform the redirect
          window.location.href = response.data.newUrl;
        }
      } catch (error) {
        // Silently fail - don't break the site if redirect check fails
        if (error.code !== 'ECONNABORTED') {
          console.error('[Redirect] Check failed:', error.message);
        }
      }
    };

    checkAndRedirect();
  }, []);

  return null; // This component doesn't render anything
};

export default RedirectHandler;
