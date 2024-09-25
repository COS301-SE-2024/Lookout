import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ClearDataOnRedirect = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/login") {
      // Clear localStorage
      localStorage.clear();

      // Clear sessionStorage
      sessionStorage.clear();

      // Clear cookies
      document.cookie.split(";").forEach((cookie) => {
        document.cookie = cookie
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // Optionally refresh the page
      window.location.reload();
    }
  }, [location]);

  return null;
};

export default ClearDataOnRedirect;
