import { useEffect, useState } from "react";
import { FaHouse, FaMap, FaUsers, FaUser } from "react-icons/fa6";
import { Link } from "react-router-dom";
//import '../assets/styles/nav.css'
//import { FaSignInAlt } from "react-icons/fa";

const Navigationbar = () => {
	const [isAuthed, setIsAuthed] = useState(
		localStorage.getItem("authToken") !== "" &&
			localStorage.getItem("authToken") !== null
	);

	useEffect(() => {
		console.log("isAuthed", isAuthed);
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

	return (
		<>
			{isAuthed && (
				<header className="text-white bg-navBkg">
					<nav className="container mx-auto py-4 bg-navBkg">
						<ul className="flex justify-center space-x-4">
							<li>
								<Link to="/" className="text-white">
									<FaHouse className="mr-1" /> Home
								</Link>
							</li>
							<li>
								<Link to="/explore" className="text-white">
									<FaMap className="mr-1" /> Explore
								</Link>
							</li>
							<li>
								<Link to="/groups" className="text-white">
									<FaUsers className="mr-1" /> Groups
								</Link>
							</li>
							<li>
								<Link to="/profile" className="text-white">
									<FaUser className="mr-1" /> Profile
								</Link>
							</li>
						</ul>
					</nav>
				</header>
			)}
		</>
	);
};

export default Navigationbar;
