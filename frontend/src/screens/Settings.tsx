import { useState, useEffect } from "react";
import EditProfile from "../components/EditProfile";
import HelpCentre from "../components/HelpCentre";
import Tutorials from "../components/Tutorials";
import FAQ from "../components/FAQ";
import ToggleButton from "../components/ThemeToggleButton"; // Import ToggleButton component
import { FaArrowLeft } from "react-icons/fa"; // Import back arrow icon

const Settings = () => {
  const menuItems = [
    { id: 1, name: "Profile" },
    { id: 2, name: "Appearance" },
    { id: 3, name: "Help Centre" },
    { id: 4, name: "Tutorials" },
    { id: 5, name: "FAQS" },
    { id: 6, name: "Terms of Service" },
    { id: 7, name: "Privacy Policy" },
    { id: 8, name: "About Us" },
  ];

  const [activeMenu, setActiveMenu] = useState<number | null>(menuItems[0].id);
  const [isDarkTheme, setIsDarkTheme] = useState(
    localStorage.getItem("data-theme") === "dark"
  );
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkTheme ? "dark" : "light"
    );
    localStorage.setItem("data-theme", isDarkTheme ? "dark" : "light");
  }, [isDarkTheme]);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderContent = () => {
    switch (activeMenu) {
      case 1:
        return <EditProfile />;
      case 2:
        return (
          <div>
            <h2 className="text-xl font-bold">Appearance</h2>
            <p className="text-sm text-gray-500">Edit the appearance of the site.</p>
            <hr className="mr-10"/>
            <div className="flex items-center py-2">
              <label
                htmlFor="dark-theme-toggle"
                className="font-bold mr-4"
              >
                Enable Dark Theme
              </label>
              <ToggleButton
                onToggle={(isToggled) => setIsDarkTheme(isToggled)}
                initialState={isDarkTheme}
              />
            </div>
          </div>
        );
      case 3:
        return <HelpCentre />;
      case 4:
        return <Tutorials />;
      case 5:
        return <FAQ />;
      case 6:
        return <div>Terms of Service</div>;
      case 7:
        return <div>Privacy Policy</div>;
      case 8:
        return <div>About Us</div>;
     
    }
  };

  return (
    <div className="flex flex-col h-screen ml-6">
      {/* Heading */}
      <div className="p-4">
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-sm text-gray-500">Manage your account settings, get help or find additional information.</p>
        <hr className="mr-6" />
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left-hand Menu */}
        <div
          className={`w-full md:w-1/5 p-4 ${isMobileView && activeMenu !== null ? 'hidden' : 'block'}`}
        >
          <ul>
            {menuItems.map((item) => (
              <li
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`p-2 cursor-pointer rounded ${activeMenu === item.id ? "bg-gray-200" : "bg-bkg"} hover:bg-gray-200`}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Content Panel */}
        <div
  className={`w-full md:w-4/5 ml-4 ${isMobileView ? 'block' : 'hidden md:block'}`}
>
  {isMobileView && activeMenu !== null && (
    <button
      className="text-gray-500 hover:text-gray-700 mb-2 flex items-center"
      onClick={() => setActiveMenu(null)}
    >
      <FaArrowLeft className="mr-2" />
      Back to menu
    </button>
  )}
  {renderContent()}
</div>

      </div>
    </div>
  );
};

export default Settings;
