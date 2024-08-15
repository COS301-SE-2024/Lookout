import { useEffect, useState } from "react";
import { FaHouse, FaMap, FaUsers, FaUser } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaQuestion } from "react-icons/fa";
import HelpModal from "./HelpModal";

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
				<header className="text-white bg-navBkg">
					<nav className="container mx-auto py-4 bg-navBkg">
						<ul className="flex justify-between items-center">
							<li className="flex-grow"></li>
							<li className="px-2">
								<Link to="/" className="text-white">
									<FaHouse className="ml-4" /> Home
								</Link>
							</li>
							<li className="px-2">
								<Link to="/explore" className="text-white">
									<FaMap className="ml-4" /> Explore
								</Link>
							</li>
							<li className="px-2">
								<Link to="/groups" className="text-white">
									<FaUsers className="ml-4" /> Groups
								</Link>
							</li>
							<li className="pl-1">
								<Link to="/profile" className="text-white">
									<FaUser className="ml-4" /> Profile
								</Link>
							</li>
							<li className="flex-grow"></li>
							<li className="relative pr-4 mb-6"> {/* Adjust positioning */}
								<div className="absolute right-16">
									<FaQuestion
										onClick={handleHelpCentreClick}
									/>
									{showHelpCentre && (
										<HelpModal
											onClose={handleCloseHelpCentre}
										/>
									)}
								</div>
							</li>
						</ul>
					</nav>
				</header>
			)}
		</>
	);
};

export default Navigationbar;
