import React, { useState } from "react";
import { FaChevronRight, FaTimes } from "react-icons/fa";
import FAQModal from './FAQModal';
import TutorialsModal from './TutorialsModal';
import HelpCentreModal from './HelpCentreModal';

interface SettingsModalProps {
	onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
	const modalStyles = {
		modalContainer: "fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-start md:justify-center items-center",
		modalContent: "bg-bkg rounded-lg p-8 relative w-11/12 md:w-96 h-full md:h-auto overflow-y-auto", // Adjust width and height for mobile and larger screens
		closeButton: "absolute top-2 left-2 cursor-pointer",
		closeIcon: "text-gray-500 hover:text-gray-700",
		helpTitle: "text-xl font-semibold mb-4 text-center",
		sectionTitle: "text-lg font-semibold mt-4 mb-2",
		logoutButton: "bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full",
		searchBar: "w-full py-2 px-4 border rounded-lg mt-4"
	};

	const [searchQuery, setSearchQuery] = useState('');

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	const [showFAQModal, setShowFAQModal] = useState(false);
	const handleFAQModalClick = () => setShowFAQModal(true);
	const handleCloseFAQModal = () => setShowFAQModal(false);

	const [showTutorialsModal, setShowTutorialsModal] = useState(false);
	const handleTutorialsModalClick = () => setShowTutorialsModal(true);
	const handleCloseTutorialsModal = () => setShowTutorialsModal(false);

	const [showHelpCentreModal, setShowHelpCentreModal] = useState(false);
	const handleHelpCentreModalClick = () => setShowHelpCentreModal(true);
	const handleCloseHelpCentreModal = () => setShowHelpCentreModal(false);
	
	return (
		<>
			<div className={modalStyles.modalContainer}>
				<div className={modalStyles.modalContent}>
					<div className={modalStyles.closeButton} onClick={onClose}>
						<FaTimes className={modalStyles.closeIcon} size={24} />
					</div>
					<h2 className={modalStyles.helpTitle}>Need Help?</h2>
					<input
						type="text"
						className={modalStyles.searchBar}
						placeholder="Ask us anything..."
						value={searchQuery}
						onChange={handleSearchChange}
					/>
					<ul>
						<li className="py-2 border-t border-b flex items-center justify-between" onClick={handleHelpCentreModalClick}>
							<div className="flex items-center">Help Centre</div>
							<FaChevronRight className="text-gray-400" size={18} />
						</li>
						<li className="py-2 border-t border-b flex items-center justify-between" onClick={handleTutorialsModalClick}>
							<div className="flex items-center">Tutorials</div>
							<FaChevronRight className="text-gray-400" size={18} />
						</li>
						<li className="py-2 border-t border-b flex items-center justify-between" onClick={handleFAQModalClick}>
							<div className="flex items-center">FAQs</div>
							<FaChevronRight className="text-gray-400" size={18} />
						</li>
					</ul>
				</div>
			</div>
			{showFAQModal && <FAQModal onClose={handleCloseFAQModal} />}
			{showTutorialsModal && <TutorialsModal onClose={handleCloseTutorialsModal} />}
			{showHelpCentreModal && <HelpCentreModal onClose={handleCloseHelpCentreModal} />} {/* Corrected here */}
		</>
	);
};

export default SettingsModal;
