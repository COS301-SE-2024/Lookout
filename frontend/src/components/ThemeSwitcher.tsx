import React, { useEffect, useState } from 'react';

const ThemeSwitcher = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(
    localStorage.getItem("data-theme") === "dark"
  );
  
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkTheme ? "dark" : "light"
    );
    localStorage.setItem("data-theme", isDarkTheme ? "dark" : "light");
  }, [isDarkTheme]);

  const [selectedTheme, setSelectedTheme] = useState(isDarkTheme ? 'dark' : 'light');
  const [isConfirming, setIsConfirming] = useState(false);

  // Handle theme change
  const handleThemeChange = (theme: React.SetStateAction<string>) => {
    setSelectedTheme(theme);
    setIsConfirming(true); // Show confirmation button
  };

  // Confirm theme change
  const confirmThemeChange = () => {
    setIsDarkTheme(selectedTheme === 'dark');
    setIsConfirming(false);
  };

  // Button styles
  const buttonStyles = isDarkTheme
    ? 'bg-gray-200 text-gray-800'
    : 'bg-gray-200 text-gray-800';

  // Block border styles
  const blockBorderStyles = (theme: string) => 
    `p-6 cursor-pointer border-4 rounded ${selectedTheme === theme ? 'border-content2' : 'border-bkg'} ${theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-800 text-gray-300'}`;
  
  return (
    <div className="flex flex-col h-screen bg-bkg">
      <h2 className="text-xl font-bold">Appearance</h2>
      <p className="text-sm text-content2">Edit the appearance of the site.</p>
      <hr className="mr-10" />

      <h2 className="text-xl font-bold mt-4">Theme</h2>
      <p className="text-sm text-content2">Select the theme for the app:</p>
      <div className="flex items-center py-2 space-x-4">
        {/* Light Theme Block */}
        <div
          className={blockBorderStyles('light')}
          onClick={() => handleThemeChange('light')}
        >
          <p className="font-bold">Light Theme</p>
        </div>

        {/* Dark Theme Block */}
        <div
          className={blockBorderStyles('dark')}
          onClick={() => handleThemeChange('dark')}
        >
          <p className="font-bold">Dark Theme</p>
        </div>
      </div>

      {isConfirming && (
        <div className="py-4">
          <button
            onClick={confirmThemeChange}
            className={`py-2 px-4 rounded ${buttonStyles}`}
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
