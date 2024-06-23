import React from "react";
import { FaTimes } from "react-icons/fa";



import images from '../assets/styles/images/images'; // Adjust the path as necessary


interface HelpCentreModalProps {
	onClose: () => void;
}

const HelpCentreModal: React.FC<HelpCentreModalProps> = ({ onClose }) => {
	const modalStyles = {
		modalContainer:
			"fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-start md:justify-center items-center",
		modalContent:
			"bg-bkg rounded-lg p-8 relative w-11/12 md:w-96 h-full md:h-auto overflow-y-auto", // Adjust width and height for mobile and larger screens
		closeButton: "absolute top-2 left-2 cursor-pointer",
		closeIcon: "text-gray-500 hover:text-gray-700",
		helpTitle: "text-xl font-semibold mb-4 text-center",
		sectionTitle: "text-lg font-semibold mt-4 mb-2",
		contactInfo: "mt-4",
		linkList: "mt-2",
		forumImage: "w-full h-auto rounded-lg mb-2",
		forumDescription: "text-sm mt-1"
	};

	return (
		<div className={modalStyles.modalContainer}>
			<div className={modalStyles.modalContent}>
				<div className={modalStyles.closeButton} onClick={onClose}>
					<FaTimes className={modalStyles.closeIcon} size={24} />
				</div>
				<h2 className={modalStyles.helpTitle}>Help Centre</h2>

				<div className={modalStyles.sectionTitle}>Contact Information:</div>
				<div className={modalStyles.contactInfo}>
					<p>Email: support@lookoutapp.com</p>
					<p>Phone: +27 (079) 456-7890</p>
				</div>



				<div className={modalStyles.sectionTitle}>External Safari and Nature Forums:</div>
				<ul className={modalStyles.linkList}>
					<li>
						<img src={images.safari} alt="Lookout Community Forum" className={modalStyles.forumImage} />
						<a href="https://safaritalk.net" target="_blank" rel="noopener noreferrer">SafariTalk</a>
						<p className={modalStyles.forumDescription}>Dedicated to African safaris, wildlife conservation, and safari travel.</p>
					</li>
					<li>
						<img src={images.gardener} alt="Lookout Community Forum" className={modalStyles.forumImage} />
						<a href="https://wildlifegardeners.org" target="_blank" rel="noopener noreferrer">Wildlife Gardeners</a>
						<p className={modalStyles.forumDescription}>Community for wildlife gardening, habitat creation, and environmental stewardship.</p>
					</li>
					<li>
						<img src={images.activist} alt="Lookout Community Forum" className={modalStyles.forumImage} />
						<a href="https://wildlifewarriors.org" target="_blank" rel="noopener noreferrer">Wildlife Warriors</a>
						<p className={modalStyles.forumDescription}>Global network for wildlife conservationists and advocates.</p>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default HelpCentreModal;
