import React, { useEffect, useState } from "react";
import { FaChevronRight, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ToggleButton from "./ToggleButton";

interface SettingsModalProps {
	onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
	const modalStyles = {
		modalContainer:
			"fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-start md:justify-center items-center",
		modalContent:
			"bg-bkg rounded-lg p-8 relative w-11/12 md:w-96 h-full md:h-auto overflow-y-auto", // Adjust width and height for mobile and larger screens
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

	const handleLogout = () => {
		localStorage.setItem("authToken", "");
		window.location.reload();
	};

	const [isDarkTheme, setIsDarkTheme] = useState(false);

	useEffect(() => {
		document.documentElement.setAttribute(
			"data-theme",
			isDarkTheme ? "dark" : "light"
		);
	}, [isDarkTheme]);

	const handleToggle = (isToggled: boolean) => {
		setIsDarkTheme(isToggled);
	};

	return (
		<div className={modalStyles.modalContainer}>
			<div className={modalStyles.modalContent}>
				<div className={modalStyles.closeButton} onClick={onClose}>
					<FaTimes className={modalStyles.closeIcon} size={24} />
				</div>
				<h2 className={modalStyles.settingsTitle}>Settings</h2>
				<ul>
					{settings.map((setting, index) => (
						<li
							key={index}
							className="py-2 border-t border-b flex items-center justify-between"
						>
							<div className="flex items-center">
								{setting}
								{setting === "Dark Theme" && (
									<label className="ml-48 flex items-center">
										<ToggleButton onToggle={handleToggle} />
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
						<h2 className={modalStyles.sectionTitle}>Support</h2>
					</div>
					<li className="py-2 border-t border-b flex items-center justify-between">
						<div className="flex items-center">Help Centre</div>
						<FaChevronRight className="text-gray-400" size={18} />
					</li>
					<li className="py-2 border-t border-b flex items-center justify-between">
						<div className="flex items-center">
							Terms of Service
						</div>
						<FaChevronRight className="text-gray-400" size={18} />
					</li>
					<li className="py-2 border-t border-b flex items-center justify-between">
						<div className="flex items-center">Privacy Policy</div>
						<FaChevronRight className="text-gray-400" size={18} />
					</li>
				</ul>
				<button
					className={modalStyles.logoutButton}
					onClick={handleLogout}
				>
					Logout
				</button>
			</div>
		</div>
	);
};

export default SettingsModal;
