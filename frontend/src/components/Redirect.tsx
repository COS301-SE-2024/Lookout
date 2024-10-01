import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ClearDataOnRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if "cleardata=true" is in the query string
    const urlParams = new URLSearchParams(location.search);
    const clearData = urlParams.get('cleardata');

    if (clearData === 'true') {
      // Clear localStorage
      localStorage.clear();

      // Clear sessionStorage
      sessionStorage.clear();

      // Remove "cleardata=true" from the URL to prevent loop
      urlParams.delete('cleardata');
      navigate({
        pathname: '/login',
        search: urlParams.toString()
      }, { replace: true });
    }
  }, [location, navigate]);

  return null;
};

export default ClearDataOnRedirect;
