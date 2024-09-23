import { useEffect } from 'react';

const EmailHandler = () => {
  useEffect(() => {
    // Extract email from query parameters
    const queryParams = new URLSearchParams(window.location.search);
    const email = queryParams.get('email');

    if (email) {
      // Store email in local storage
      localStorage.setItem('userEmail', email);
    }
  }, []);

  return null; // This component does not render anything
};

export default EmailHandler;
