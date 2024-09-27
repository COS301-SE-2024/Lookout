import { useEffect, useState } from "react";
import { FaMap, FaBinoculars, FaUser, FaGear, FaQuestion } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import HelpModal from "./HelpModal";
import Tooltip from "./Tooltip";

const Navigationbar = () => {
	const [isAuthed, setIsAuthed] = useState(
		localStorage.getItem("authToken") !== "" &&
		localStorage.getItem("authToken") !== null
	);
	const location = useLocation();

	useEffect(() => {
		//console.log("isAuthed", isAuthed);
	}, [isAuthed]);

	useEffect(() => {
		const handleStorageChange = (event: StorageEvent) => {
			if (event.key === "authToken") {
				setIsAuthed(localStorage.getItem("authToken") !== "");
			}
		};

		window.addEventListener("storage", handleStorageChange);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
		};
	}, []);

	const [showHelpCentre, setShowHelpCentre] = useState(false);

	const handleHelpCentreClick = () => {
		setShowHelpCentre(true);
	};

	const handleCloseHelpCentre = () => {
		setShowHelpCentre(false);
	};

	// Define a helper function to get the color based on the current path
	const getIconColor = (path: string) => {
		return location.pathname === path ? 'text-navBkg2 md:bg-iconShadow ' : 'text-icon';
	};

	return (
		<>
			{isAuthed && (

				<header className="w-full min-w-full relative">
					{/* Mobile View */}
					<div className="md:hidden flex flex-col items-center relative">
						{/* Help icon for mobile view */}
						<FaQuestion
							size={40}
							className="absolute top-3 right-2 text-icon bg-nav p-2 rounded-full cursor-pointer hover:bg-gray-200 hover:text-navBkg z-10"
							onClick={handleHelpCentreClick}
						/>

						{/* Bottom navigation for icons */}
						<nav className="fixed bottom-0 w-full bg-nav shadow-lg py-2 flex justify-around">
							<Link to="/home" className="flex flex-col items-center justify-center">
								<FaMap size={24} className={getIconColor('/')} />
								<span className="text-xs">Map</span>
							</Link>
							<Link to="/explore" className="flex flex-col items-center justify-center">
								<FaBinoculars size={24} className={getIconColor('/explore')} />
								<span className="text-xs">Explore</span>
							</Link>
							<Link to="/profile" className="flex flex-col items-center justify-center">
								<FaUser size={24} className={getIconColor('/profile')} />
								<span className="text-xs">Profile</span>
							</Link>
							<Link to="/settings" className="flex flex-col items-center justify-center">
								<FaGear size={24} className={getIconColor('/settings')} />
								<span className="text-xs">Settings</span>
							</Link>
						</nav>

						{/* Help Modal */}
						{showHelpCentre && <HelpModal onClose={handleCloseHelpCentre} />}
					</div>

					{/* Desktop View */}
					<div className="hidden md:flex flex-col md:flex-row items-center">
						<nav className="container mx-auto py-2 bg-nav w-full min-w-full">
							<div className="flex flex-col md:flex-row items-center">
								{/* Left side icons */}
								<ul className="flex md:justify-start justify-center items-center space-x-2 md:ml-8">
									{/* Icon and text for LOOKOUT */}
									<li className="flex items-center space-x-2 hover:scale-105 transform transition-transform duration-300">
										<Link to="/home" className="flex items-center space-x-2">
											<FaBinoculars size={32} className="text-navBkg2 hover:text-navBkg-dark transition-colors duration-300" />
											<h1 className="text-navBkg2 font-extrabold text-3xl hover:text-navBkg-dark transition-transform duration-300">
												LOOKOUT
											</h1>
										</Link>
									</li>
								</ul>

								{/* Right side icons */}
								<ul className="flex ml-auto md:justify-end justify-center items-center space-x-2 md:mr-8 mt-2 md:mt-0">
									<li>
										<Tooltip text="Help Centre">
											<FaQuestion
												size={42}
												className="text-icon p-2 rounded-full cursor-pointer hover:bg-iconShadow hover:text-navBkg2"
												onClick={handleHelpCentreClick}
											/>
										</Tooltip>

									</li>
									<li>

										<Link to="/home" className={`flex items-center justify-center w-12 h-12 rounded-full hover:text-navBkg2 hover:bg-iconShadow transition-all duration-300 ${getIconColor('/')}`}>
											<Tooltip text="Map">
												<FaMap size={26} />
											</Tooltip>
										</Link>
									</li>
									<li>
										<Link to="/explore" className={`flex items-center justify-center w-12 h-12 rounded-full hover:text-navBkg2 hover:bg-iconShadow transition-all duration-300 ${getIconColor('/explore')}`}>
											<Tooltip text="Explore">
												<FaBinoculars size={26} />
											</Tooltip>
										</Link>
									</li>
									<li>
										<Link to="/profile" className={`flex items-center justify-center w-12 h-12 rounded-full hover:text-navBkg2 hover:bg-iconShadow transition-all duration-300 ${getIconColor('/profile')}`}>
											<Tooltip text="Profile">
												<FaUser size={26} />
											</Tooltip>
										</Link>
									</li>
									<li>
										<Link to="/settings" className={`flex items-center justify-center w-12 h-12 rounded-full hover:text-navBkg2 hover:bg-iconShadow transition-all duration-300 ${getIconColor('/settings')}`}>
											<Tooltip text="Settings">
												<FaGear size={26} />
											</Tooltip>
										</Link>
									</li>
								</ul>
							</div>
						</nav>

						{/* Help Modal */}
						{showHelpCentre && <HelpModal onClose={handleCloseHelpCentre} />}
					</div>
				</header>
			)}
		</>
	);
};

export default Navigationbar;
