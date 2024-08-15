import React from "react";
import { FaTimes } from "react-icons/fa";

import images from "../assets/styles/images/images"; // Adjust the path as necessary

interface HelpCentreModalProps {
  onClose: () => void;
}

const HelpCentreModal: React.FC<HelpCentreModalProps> = ({ onClose }) => {
  const modalStyles = {
    modalContainer:
      "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 flex justify-start md:justify-center items-center",
    modalContent:
      "bg-white text-black rounded-lg p-8 relative w-11/12 md:w-96 max-h-screen h-[80vh] overflow-y-auto", // Ensures good contrast between background and text
    closeButton: "absolute top-2 left-2 cursor-pointer",
    closeIcon: "text-gray-500 hover:text-gray-700",
    helpTitle: "text-xl font-semibold mb-4 text-center text-black", // Ensures text is visible
    sectionTitle: "text-lg font-semibold mt-4 mb-2 text-black", // Ensures text is visible
    contactInfo: "mt-4 text-black", // Ensures text is visible
    linkList: "mt-2 text-black", // Ensures text is visible
    forumImage: "w-full h-auto rounded-lg mb-2", // Image style remains the same
    forumDescription: "text-sm mt-1 text-black", // Ensures text is visible
  };

  return (
    <div className={modalStyles.modalContainer}>
      <div className={modalStyles.modalContent}>
        <div className={modalStyles.closeButton} onClick={onClose}>
          <FaTimes className={modalStyles.closeIcon} size={24} />
        </div>
        <h2 className={modalStyles.helpTitle}>Help Centre</h2>

        <div className={modalStyles.sectionTitle}>
          If you have any queries then let us know by filling in the form below:
        </div>
        <div className={modalStyles.contactInfo}>
          <a
            href="https://forms.gle/dc4i9pd2GNLZKm2h6"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            https://forms.gle/dc4i9pd2GNLZKm2h6
          </a>
        </div>

        <div className={modalStyles.sectionTitle}>
          External Safari and Nature Forums:
        </div>
        <ul className={modalStyles.linkList}>
          <li>
            <img
              src={images.safari}
              alt="Lookout Community Forum"
              className={modalStyles.forumImage}
            />
            <a
              href="https://safaritalk.net"
              target="_blank"
              rel="noopener noreferrer"
            >
              SafariTalk
            </a>
            <p className={modalStyles.forumDescription}>
              Dedicated to African safaris, wildlife conservation, and safari
              travel.
            </p>
          </li>
          <li>
            <img
              src={images.gardener}
              alt="Lookout Community Forum"
              className={modalStyles.forumImage}
            />
            <a
              href="https://wildlifegardeners.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wildlife Gardeners
            </a>
            <p className={modalStyles.forumDescription}>
              Community for wildlife gardening, habitat creation, and
              environmental stewardship.
            </p>
          </li>
          <li>
            <img
              src={images.activist}
              alt="Lookout Community Forum"
              className={modalStyles.forumImage}
            />
            <a
              href="https://wildlifewarriors.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wildlife Warriors
            </a>
            <p className={modalStyles.forumDescription}>
              Global network for wildlife conservationists and advocates.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HelpCentreModal;
