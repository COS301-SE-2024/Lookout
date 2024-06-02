export const getEmailFromLocalStorage = () => {
    return localStorage.getItem('userEmail') || '';
  };
  