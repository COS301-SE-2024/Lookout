import { useState, useEffect } from "react";
import EditProfile from "../components/EditProfile";
import Tutorials from "../components/Tutorials";
import FAQ from "../components/FAQ";
import { FaArrowLeft,// FaChevronLeft 
} from "react-icons/fa"; // Import icons
import { useNavigate } from "react-router-dom";
import { getEmailFromLocalStorage } from "../utils/auth";
import { LuLogOut } from "react-icons/lu";
import AboutUs from "../components/AboutUs";
import ThemeSwitcher from "../components/ThemeSwitcher";

const Settings = () => {
  const menuItems = [
    { id: 1, name: "Profile" },
    { id: 2, name: "Appearance" },
    { id: 4, name: "Tutorials" },
    { id: 5, name: "FAQS" },
    { id: 8, name: "About Us" },
    { id: 9, name: "Logout", icon: <LuLogOut size={20} /> },
  ];

  const navigate = useNavigate();
  const [isDarkTheme] = useState(localStorage.getItem("data-theme") === "dark");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  // Set activeMenu to null by default on mobile and Profile by default on desktop
  const [activeMenu, setActiveMenu] = useState<number | null>(
    window.innerWidth < 768 ? null : menuItems[0].id
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDarkTheme ? "dark" : "light");
    localStorage.setItem("data-theme", isDarkTheme ? "dark" : "light");
  }, [isDarkTheme]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      // Set the active menu to null on mobile if resizing from desktop
      if (window.innerWidth < 768) {
        setActiveMenu(null);
      } else {
        setActiveMenu(menuItems[0].id); // Default to Profile on desktop
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    // Logout logic
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 1:
        return <EditProfile />;
      case 2:
        return <ThemeSwitcher />;
      case 4:
        return <Tutorials />;
      case 5:
        return <FAQ />;
      case 8:
        return <AboutUs />;
      case 9:
        return null; // Logout case
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-bkg ml-6 mt-4 md:mt-0">
      {/* Heading */}
      <div className={`p-4 ${isMobileView && activeMenu ? 'hidden' : ''}`}>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-sm text-content2">Manage your account settings, get help or find additional information.</p>
        <hr className="mr-6" />
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left-hand Menu */}
        <div className={`w-full md:w-1/5 p-2 ${isMobileView && activeMenu ? 'hidden' : 'block'}`}>
          <ul>
            {menuItems.map((item) => (
              <li
                key={item.id}
                onClick={() => {
                  if (item.id === 9) {
                    handleLogout();
                  } else {
                    setActiveMenu(item.id);
                  }
                }}
                className={`p-2 cursor-pointer rounded flex items-center ${activeMenu === item.id ? "bg-hver" : "bg-bkg"} hover:bg-hver`}
              >
                <span className={`flex-1 ${isMobileView ? 'text-lg' : 'text-base'}`}>
                  {item.name}
                </span>
                {item.icon && <span className="ml-2">{item.icon}</span>}
              </li>
            ))}
          </ul>
        </div>

        {/* Content Panel */}
        <div className={`w-full md:w-4/5 ml-4 ${isMobileView ? 'block' : 'hidden md:block'}`}>
          {isMobileView && activeMenu && (
            <button
              className="text-content2 hover:text-gray-700 mb-2 flex items-center mt-6 mb-4"
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
