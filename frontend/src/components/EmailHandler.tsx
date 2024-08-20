import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EmailHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract email from query parameters
    const queryParams = new URLSearchParams(window.location.search);
    const email = queryParams.get('email');

    if (email) {
      // Store email in local storage
      localStorage.setItem('userEmail', email);
      // Redirect to the home page
      navigate('/', { replace: true });
    } else {
      // If no email is found, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  return null; // This component does not render anything
};

export default EmailHandler;
