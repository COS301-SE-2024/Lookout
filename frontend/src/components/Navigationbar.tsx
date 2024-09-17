import { useEffect, useState } from "react";
import { FaMap, FaBinoculars, FaUser, FaGear, FaQuestion } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import HelpModal from "./HelpModal";
import logoGreen from '../assets/styles/images/LogoGreen.png'; // Import the image

const Navigationbar = () => {
	const [isAuthed, setIsAuthed] = useState(
		localStorage.getItem("authToken") !== "" &&
		localStorage.getItem("authToken") !== null
	);

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

	return (
		<>
			{isAuthed && (
				<header className="text-white bg-white w-full min-w-full relative">
					{/* Mobile View */}
					<div className="md:hidden flex flex-col items-center">
						{/* Search bar at the top */}
						<div className="flex w-full items-center p-2 bg-gray-200">
							<div className="flex-grow mx-2 flex items-center bg-gray-200 rounded-lg">
								<FaSearch className="text-gray-500 ml-3" size={20} />
								<input
									type="text"
									placeholder="Search..."
									className="w-full px-4 py-2 bg-transparent border-none focus:outline-none"
								/>
							</div>
							{/* Help Icon on the right */}
							<FaQuestion
								size={24}
								className="text-gray-500 mx-2 cursor-pointer"
								onClick={handleHelpCentreClick}
							/>
						</div>

						{/* Bottom navigation for icons */}
						<nav className="fixed bottom-0 w-full bg-white shadow-lg py-2 flex justify-around">
							<Link to="/" className="text-gray-500 flex flex-col items-center justify-center">
								<FaMap size={24} />
								<span className="text-xs">Map</span>
							</Link>
							<Link to="/explore" className="text-gray-500 flex flex-col items-center justify-center">
								<FaBinoculars size={24} />
								<span className="text-xs">Explore</span>
							</Link>
							<Link to="/profile" className="text-gray-500 flex flex-col items-center justify-center">
								<FaUser size={24} />
								<span className="text-xs">Profile</span>
							</Link>
							<Link to="/settings" className="text-gray-500 flex flex-col items-center justify-center">
								<FaGear size={24} />
								<span className="text-xs">Settings</span>
							</Link>
						</nav>

						{/* Help Modal */}
						{showHelpCentre && <HelpModal onClose={handleCloseHelpCentre} />}
					</div>

					{/* Desktop View */}
					<div className="hidden md:flex flex-col md:flex-row items-center">
						<nav className="container mx-auto py-2 bg-bkg w-full min-w-full">
							<div className="flex flex-col md:flex-row items-center">
								{/* Left side icons */}
								<ul className="flex md:justify-start justify-center items-center space-x-2 md:ml-8">
									<li>
										<Link to="/" className="text-gray-500 flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-200 transition-all duration-300">
											<FaMap size={26} />
										</Link>
									</li>
									<li>
										<Link to="/explore" className="text-gray-500 flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-200 transition-all duration-300">
											<FaBinoculars size={26} />
										</Link>
									</li>
								</ul>

								{/* Search bar */}
								<div className="flex-grow mx-4 md:mx-8 my-2 md:my-0 flex items-center bg-gray-200 rounded-lg">
									<FaSearch className="text-gray-500 ml-3" size={20} />
									<input
										type="text"
										placeholder="Search..."
										className="w-full px-4 py-2 bg-transparent border-none focus:outline-none"
									/>
								</div>

								{/* Right side icons */}
								<ul className="flex md:justify-end justify-center items-center space-x-2 md:mr-8 mt-2 md:mt-0">
									<li>
										<Link to="/profile" className="text-gray-500 flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-200 transition-all duration-300">
											<FaUser size={26} />
										</Link>
									</li>
									<li>
										<Link to="/settings" className="text-gray-500 flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-200 transition-all duration-300">
											<FaGear size={26} />
										</Link>
									</li>
									<li>
										<FaQuestion
											size={42}
											className="text-gray-500 p-2 rounded-full cursor-pointer hover:bg-gray-200"
											onClick={handleHelpCentreClick}
										/>
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
