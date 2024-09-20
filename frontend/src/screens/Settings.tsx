import { useState, useEffect, useMemo } from "react";
import EditProfile from "../components/EditProfile";
import Tutorials from "../components/Tutorials";
import FAQ from "../components/FAQ";
import { FaArrowLeft, FaChevronLeft } from "react-icons/fa"; // Import icons
import { useNavigate } from "react-router-dom";
import { getEmailFromLocalStorage } from "../utils/auth";
import { LuLogOut } from "react-icons/lu";
import AboutUs from "../components/AboutUs";
import ThemeSwitcher from "../components/ThemeSwitcher";

const Settings = () => {
  const menuItems = [
    { id: 1, name: "Profile" },
    { id: 2, name: "Appearance" },
    // { id: 3, name: "Help Centre" },
    { id: 4, name: "Tutorials" },
    { id: 5, name: "FAQS" },
    // { id: 6, name: "Terms of Service" },
    // { id: 7, name: "Privacy Policy" },
    { id: 8, name: "About Us" },
    { id: 9, name: "Logout", icon: <LuLogOut size={20} /> },
  ];

  const navigate = useNavigate();
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

  const handleLogout = async () => {
    localStorage.setItem("authToken", "");
    const email = getEmailFromLocalStorage();
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email
        })
      });

      if (!response.ok) {
        throw new Error("Logout failed!");
      }

      localStorage.setItem("authToken", "");
      localStorage.removeItem("userEmail");
      navigate("/login");
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleToggle = (isToggled: boolean) => {
    document.documentElement.setAttribute(
      "data-theme",
      isToggled ? "dark" : "light"
    );
    localStorage.setItem("data-theme", isToggled ? "dark" : "light");
  };

  const [showHelpCentre, setShowHelpCentre] = useState(false);

  const handleHelpCentreClick = () => {
    setShowHelpCentre(true);
  };

  const handleCloseHelpCentre = () => {
    setShowHelpCentre(false);
  };

  const [selectedIndex, setSelectedIndex] = useState<undefined | number>(
    undefined
  );

  const jsx = useMemo(() => {
    if (selectedIndex === undefined) {
      return undefined;
    }
    if (selectedIndex === 0) {
      return (
        <div>
          <div
            className="cursor-pointer"
            onClick={() => setSelectedIndex(undefined)}
          >
            <FaChevronLeft size={24} />
          </div>
          <EditProfile />
        </div>
      );
    }
  }, [selectedIndex]);

  const renderContent = () => {
    switch (activeMenu) {
      case 1:
        return <EditProfile />;
      case 2:
        return <ThemeSwitcher />;
      // case 3:
      //   return <HelpCentre />;
      case 4:
        return <Tutorials />;
      case 5:
        return <FAQ />;
      // case 6:
      //   return <div>Terms of Service</div>;
      // case 7:
      //   return <div>Privacy Policy</div>;
      case 8:
        return <AboutUs />;
      case 9:
        return null; // Logout does not have content
    }
  };

  return (
    <div className="flex flex-col h-full ml-6 mt-4 md:mt-0">
      {/* Heading */}
      <div className={`p-4 ${isMobileView && (activeMenu === 1 || activeMenu === 2 || activeMenu === 4 || activeMenu === 5
        || activeMenu === 8) ? 'hidden' : ''}`}>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-sm text-content2 text-content2">Manage your account settings, get help or find additional information.</p>
        <hr className="mr-6" />
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left-hand Menu */}
        <div
          className={`w-full md:w-1/5 p-2 ${isMobileView && activeMenu !== null ? 'hidden' : 'block'}`}
        >
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
                className={`p-2 cursor-pointer rounded flex items-center ${activeMenu === item.id ? "bg-hver" : "bg-bkg"
                  } hover:bg-hver`}
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
        <div
          className={`w-full md:w-4/5 ml-4 ${isMobileView ? 'block' : 'hidden md:block'}`}
        >
          {isMobileView && activeMenu !== null && (
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
