import React, { useState } from "react";
import { FaChevronRight, FaTimes } from "react-icons/fa";
import FAQModal from "./FAQModal";
import TutorialsModal from "./TutorialsModal";
import HelpCentreModal from "./HelpCentreModal";

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const modalStyles = {
    modalContainer:
      "fixed inset-0 z-50 flex items-center justify-center bg-nav bg-opacity-50",
    modalContent:
      "bg-nav text-gray-900 rounded-2xl shadow-lg p-8 relative w-11/12 md:w-96 h-auto transition-all transform duration-300",
    closeButton: "text-content absolute top-3 right-3 cursor-pointer",
    closeIcon:
      "hover:text-gray-700 transition-colors duration-200",
    helpTitle: "text-2xl font-bold mb-6 text-center text-content",
    sectionTitle: "text-lg font-semibold mt-4 mb-2 text-content",
    listItem:
      "text-content py-4 border-b border-gray-200 flex items-center justify-between hover:bg-bkg rounded-lg transition-colors duration-200 cursor-pointer",
    listItemText: "text-content flex items-center text-lg ",
    chevronIcon: "text-content",
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
          <h2 className={modalStyles.helpTitle}>Help Menu</h2>
          <ul>
            {/* <li
              className={modalStyles.listItem}
              onClick={handleHelpCentreModalClick}
            >
              <div className={modalStyles.listItemText}>Help Centre</div>
              <FaChevronRight className={modalStyles.chevronIcon} size={18} />
            </li> */}
            <li
              className={modalStyles.listItem}
              onClick={handleTutorialsModalClick}
            >
              <div className={modalStyles.listItemText}>Tutorials</div>
              <FaChevronRight className={modalStyles.chevronIcon} size={18} />
            </li>
            <li className={modalStyles.listItem} onClick={handleFAQModalClick}>
              <div className={modalStyles.listItemText}>FAQs</div>
              <FaChevronRight className={modalStyles.chevronIcon} size={18} />
            </li>
            <li className={modalStyles.listItem}>
              <div className={modalStyles.listItemText}>
                <a
                  href="https://forms.gle/dc4i9pd2GNLZKm2h6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-content underline hover:underline"
                >
                  Send us your feedback
                </a>
              </div>
              {/* <FaChevronRight className={modalStyles.chevronIcon} size={18} /> */}
            </li>
          </ul>
        </div>
      </div>
      {showFAQModal && <FAQModal onClose={handleCloseFAQModal} />}
      {showTutorialsModal && (
        <TutorialsModal onClose={handleCloseTutorialsModal} />
      )}
      {showHelpCentreModal && (
        <HelpCentreModal onClose={handleCloseHelpCentreModal} />
      )}
    </>
  );
};

export default SettingsModal;
