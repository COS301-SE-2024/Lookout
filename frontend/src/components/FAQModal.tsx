import DOMPurify from "dompurify";
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

interface FAQModalProps {
	onClose: () => void;
}

const FAQModal: React.FC<FAQModalProps> = ({ onClose }) => {
	const modalStyles = {
		modalContainer:
			"fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 flex justify-start md:justify-center items-center",
			modalContent:
			"bg-white text-black rounded-lg p-8 relative w-11/12 md:w-96 max-h-screen h-[80vh] overflow-y-auto scrollbar scrollbar-thumb-gray-500 scrollbar-track-gray-200", // Adjusted to ensure contrast
		closeButton: "absolute top-2 left-2 cursor-pointer",
		closeIcon: "text-gray-500 hover:text-gray-700",
		helpTitle: "text-xl font-semibold mb-4 text-center text-black", // Ensures text is visible
		sectionTitle: "text-lg font-semibold mt-4 mb-2 text-black", // Ensures text is visible
		logoutButton: "bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full",
		searchBar: "w-full py-2 px-4 border rounded-lg mt-4 mb-8 text-black", // Ensures text is visible
		faqTitle: "text-lg font-semibold mt-4 mb-2 text-black" // Ensures text is visible
	};

	const [searchQuery, setSearchQuery] = useState("");
	const [faqItems] = useState([
		{
			question: "What is Lookout?",
			answer: "Lookout is a modern Progressive Web Application designed for nature enthusiasts, conservationists, and hikers to interact and share information about their outdoor experiences. It focuses on proof of sightings and social interaction."
		},
		{
			question: "How can I download Lookout?",
			answer: "Lookout can be downloaded as a Progressive Web Application (PWA) directly to your mobile device, providing easy access and usage on the go."
		},
		{
			question: "What are the main features of Lookout?",
			answer: "Lookout offers geo-tagging of activities and points of interest, an intuitive user interface, offline accessibility, group creation and management, geographical heat maps, Gmail-based sign-in, and security concern reporting."
		},
		{
			question: "How do I log an animal sighting?",
			answer: "To log an animal sighting, use the geo-tagging feature in the app to accurately log the geographic coordinates of your sighting, even when offline. The data will sync once connectivity is restored."
		},
		{
			question: "Can I use Lookout without an internet connection?",
			answer: "Yes, Lookout provides offline accessibility. You can log points of interest without an active internet connection, and the data will sync once you are online again."
		},
		{
			question: "How do I join or create a group?",
			answer: "You can create, join, search for, and manage groups based on your interests in activities like animal spotting, hiking, and nature conservation through the app's group management feature."
		},
		{
			question: "How does Lookout ensure my data is secure?",
			answer: "Lookout uses OAuth 2.0 for secure Gmail-based authentication and Branca tokens for maintaining secure communication between the frontend and backend to ensure data integrity and prevent unauthorized access."
		},
		{
			question: "What technology stack is Lookout built on?",
			answer: "Lookout uses React for the frontend, SpringBoot with Kotlin for the backend, and PostgreSQL hosted on AWS for data management. The application is deployed on AWS EC2 instances."
		},
		{
			question: "How do I report a security concern?",
			answer: "You can report security concerns such as broken fences or other hazards directly through the app to help enhance the safety of outdoor activities."
		},
		{
			question: "Where do I view my profile?",
			answer: "You can view your profile by navigating to the 'Profile' section in the app menu."
		},
		{
			question: "How do I change my password?",
			answer: "To change your password, go to the 'Settings' section in the app and follow the instructions under 'Change Password'."
		},
		{
			question: "Where can I find tutorials?",
			answer: "Tutorials can be found in the 'Help' section of the app, providing guidance on how to use various features of Lookout."
		}
		// Add more FAQs here
	]);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(DOMPurify.sanitize(e.target.value));
	};

	const filteredFaqItems = faqItems.filter((item) =>
		item.question.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className={modalStyles.modalContainer}>
			<div className={modalStyles.modalContent}>
				<div className={modalStyles.closeButton} onClick={onClose}>
					<FaTimes className={modalStyles.closeIcon} size={24} />
				</div>
				<h2 className={modalStyles.helpTitle}>
					Frequently Asked Questions
				</h2>
				<input
					type="text"
					className={modalStyles.searchBar}
					placeholder="Search for a question..."
					value={searchQuery}
					onChange={handleSearchChange}
				/>
				<ul>
					{filteredFaqItems.map((item, index) => (
						<li key={index} className="py-2 border-t border-b mb-8">
							<h1 className="text-xl font-semibold">
								{item.question}
							</h1>
							<p>{item.answer}</p>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default FAQModal;
