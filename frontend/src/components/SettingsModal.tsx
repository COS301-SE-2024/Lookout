import React, { useMemo, useState } from "react";
import { FaChevronRight, FaTimes, FaChevronLeft } from "react-icons/fa";
import ToggleButton from "./ThemeToggleButton";
import { useNavigate } from "react-router-dom";
import { getEmailFromLocalStorage } from "../utils/auth";
import HelpCentreModal from "./HelpModal";
import EditProfile from "./EditProfile";


interface SettingsModalProps {
	onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
	const navigate = useNavigate();
	const modalStyles = {
		modalContainer:
			"fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-start md:justify-center items-center",
		modalContent:
			"bg-bkg rounded-lg p-8 relative w-11/12 md:w-96 h-full md:h-auto overflow-y-auto",
		closeButton: "absolute top-2 left-2 cursor-pointer",
		closeIcon: "text-gray-500 hover:text-gray-700",
		settingsTitle: "text-xl font-semibold mb-4 ml-8",
		sectionTitle: "text-lg font-semibold mt-4 mb-2",
		logoutButton: "bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full"
	};

	const settings = [
		"Edit Profile",
		"Notifications",
		"Profile Visibility",
		"Account Management",
		"Dark Theme"
	];

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

			// Clear localStorage
			localStorage.clear();

			// Clear sessionStorage
			sessionStorage.clear();
			navigate("/login");
			window.location.reload();
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const [isDarkTheme] = useState(
		localStorage.getItem("data-theme") === "dark"
	);

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
		const modalStyles = {
			modalContainer:
				"fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-start md:justify-center items-center",
			modalContent:
				"bg-bkg rounded-lg p-8 relative w-11/12 md:w-96 h-full md:h-auto overflow-y-auto",
			closeButton: "absolute top-2 left-2 cursor-pointer",
			closeIcon: "text-gray-500 hover:text-gray-700",
			settingsTitle: "text-xl font-semibold mb-4 ml-8",
			sectionTitle: "text-lg font-semibold mt-4 mb-2",
			logoutButton:
				"bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full"
		};
		if (selectedIndex === undefined) {
			return undefined;
		}
		if (selectedIndex === 0) {
			return (
				<div className={modalStyles.modalContainer}>
					<div className={modalStyles.modalContent}>
						<div
							className={modalStyles.closeButton}
							onClick={() => {
								setSelectedIndex(undefined);
							}}
						>
							<FaChevronLeft
								className={modalStyles.closeIcon}
								size={24}
							/>
						</div>
						<EditProfile />
					</div>
				</div>
			);
		}
	}, [selectedIndex]);

	return (
		<>
			<div className={modalStyles.modalContainer}>
				{jsx ? (
					jsx
				) : (
					<div className={modalStyles.modalContent}>
						<div
							className={modalStyles.closeButton}
							onClick={onClose}
						>
							<FaTimes
								className={modalStyles.closeIcon}
								size={24}
							/>
						</div>
						<h2 className={modalStyles.settingsTitle}>Settings</h2>
						<ul>
							{settings.map((setting, index) => (
								<li
									key={index}
									onClick={() => setSelectedIndex(index)}
									className="py-2 border-t border-b flex items-center justify-between cursor-pointer"
								>
									<div className="flex items-center">
										{setting}
										{setting === "Dark Theme" && (
											<label className="ml-48 flex items-center">
												<ToggleButton
													onToggle={handleToggle}
													initialState={isDarkTheme}
												/>
											</label>
										)}
									</div>
									{setting !== "Dark Theme" && (
										<FaChevronRight
											className="text-gray-400"
											size={18}
										/>
									)}
								</li>
							))}
							<div className="py-2 border-t border-b flex items-center">
								<h2 className={modalStyles.sectionTitle}>
									Support
								</h2>
							</div>
							<li
								className="py-2 border-t border-b flex items-center justify-between"
								onClick={handleHelpCentreClick}
							>
								<div className="flex items-center">Help</div>
								<FaChevronRight
									className="text-gray-400"
									size={18}
								/>
							</li>
							<li className="py-2 border-t border-b flex items-center justify-between">
								<div className="flex items-center">
									Terms of Service
								</div>
								<FaChevronRight
									className="text-gray-400"
									size={18}
								/>
							</li>
							<li className="py-2 border-t border-b flex items-center justify-between">
								<div className="flex items-center">
									Privacy Policy
								</div>
								<FaChevronRight
									className="text-gray-400"
									size={18}
								/>
							</li>
						</ul>
						<button
							className={modalStyles.logoutButton}
							onClick={handleLogout}
						>
							Logout
						</button>
					</div>
				)}
			</div>
			{showHelpCentre && (
				<HelpCentreModal onClose={handleCloseHelpCentre} />
			)}
		</>
	);
};

export default SettingsModal;
