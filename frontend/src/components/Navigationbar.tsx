import { useEffect, useState } from "react";
import { FaHouse, FaMap, FaUsers, FaUser } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";

const Navigationbar = () => {
	const [isAuthed, setIsAuthed] = useState(
		localStorage.getItem("authToken") !== ""
	);

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

	const [theme, setTheme] = useState("default");
	useEffect(() => {
		const localStoreTheme = localStorage.getItem("data-theme") || "default";
		setTheme(localStoreTheme);
	}, []);

	const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const newTheme = event.target.value;
		localStorage.setItem("data-theme", newTheme);
		setTheme(newTheme);
		document.documentElement.setAttribute("data-theme", newTheme);
	};

	useEffect(() => {
		const handleStorageChange = (event: StorageEvent) => {
			if (event.key === "data-theme") {
				const newTheme =
					localStorage.getItem("data-theme") || "default";
				setTheme(newTheme);
				document.documentElement.setAttribute("data-theme", newTheme);
			}
		};

		window.addEventListener("storage", handleStorageChange);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
		};
	}, []);

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
	}, [theme]);

	return (
		<>
			{isAuthed && (
				<header className="text-white">
					<nav className="container mx-auto py-4">
						<ul className="flex justify-center space-x-6">
							<li>
								<Link to="/" className="text-white">
									<FaHouse className="ml-4" /> Home
								</Link>
							</li>
							<li>
								<Link to="/explore" className="text-white">
									<FaMap className="mr-1" /> Explore
								</Link>
							</li>
							<li>
								<Link to="/groups" className="text-white">
									<FaUsers className="ml-4" /> Groups
								</Link>
							</li>
							<li>
								<Link to="/profile" className="text-white">
									<FaUser className="ml-4" /> Profile
								</Link>
							</li>
						</ul>
						<select
							className="text-black"
							value={theme}
							onChange={handleThemeChange}
						>
							<option value="" disabled hidden>
								{theme}
							</option>
							<option value="default">Default</option>
							<option value="light">Light</option>
							<option value="dark">Dark</option>
						</select>
					</nav>
				</header>
			)}
		</>
	);
};

export default Navigationbar;
