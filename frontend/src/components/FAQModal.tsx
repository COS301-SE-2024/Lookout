import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

interface FAQModalProps {
	onClose: () => void;
}

const FAQModal: React.FC<FAQModalProps> = ({ onClose }) => {
	const modalStyles = {
		modalContainer:
			"fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-start md:justify-center items-center",
		modalContent:
			"bg-bkg rounded-lg p-8 relative w-11/12 md:w-96 h-full md:h-auto overflow-y-auto", // Adjust width and height for mobile and larger screens
		closeButton: "absolute top-2 left-2 cursor-pointer",
		closeIcon: "text-gray-500 hover:text-gray-700",
		helpTitle: "text-xl font-semibold mb-4 text-center",
		sectionTitle: "text-lg font-semibold mt-4 mb-2",
		logoutButton: "bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full",
		searchBar: "w-full py-2 px-4 border rounded-lg mt-4",
		faqTitle: "text-lg font-semibold mt-4 mb-2"
	};

	const [searchQuery, setSearchQuery] = useState('');
	const [faqItems, setFaqItems] = useState([
		{ question: "Where do I view my profile?", answer: "bla bla bla bla" },
		{ question: "How do I change my password?", answer: "bla bla bla bla" },
		{ question: "Where can I find tutorials?", answer: "bla bla bla bla" },
		// Add more FAQs here
	]);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	const filteredFaqItems = faqItems.filter(item =>
		item.question.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className={modalStyles.modalContainer}>
			<div className={modalStyles.modalContent}>
				<div className={modalStyles.closeButton} onClick={onClose}>
					<FaTimes className={modalStyles.closeIcon} size={24} />
				</div>
				<h2 className={modalStyles.helpTitle}>Frequently Asked Questions</h2>
				<input
					type="text"
					className={modalStyles.searchBar}
					placeholder="Search for a question..."
					value={searchQuery}
					onChange={handleSearchChange}
				/>
				<ul>
					{filteredFaqItems.map((item, index) => (
						<li key={index} className="py-2 border-t border-b mb-4">
							<h1 className="text-xl font-semibold">{item.question}</h1>
							<p>{item.answer}</p>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default FAQModal;
