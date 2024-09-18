import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import images from "../assets/styles/images/images"; // Adjust the path as necessary
import DOMPurify from "dompurify";

interface FaqItem {
  question: string;
  image: string;
  answer: string;
}

const TutorialsPage: React.FC = () => {
  const pageStyles = {
    pageContainer: "w-full h-screen bg-gray-100 p-4", // Full-screen container with padding
    contentContainer: "bg-white text-black rounded-lg p-8 mx-auto max-w-3xl h-full overflow-y-auto", // Centered content with auto scroll
    closeButton: "absolute top-4 right-4 cursor-pointer", // Adjusted position for close button
    closeIcon: "text-gray-500 hover:text-gray-700",
    helpTitle: "text-2xl font-semibold mb-4 text-center text-black", // Larger title
    searchBar: "w-full py-2 px-4 bg-gray-200 border rounded-lg mt-4 mb-2 text-black mr-4",
    questionItem: "py-2 border-t border-b mb-4 cursor-pointer mr-2",
    questionTitle: "text-gray-700 font-bold mb-2 mr-2"
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [tutorialItems] = useState<FaqItem[]>([
    {
      question: "How to Signup?",
      image: images.signup,
      answer: "Click “Sign Up with Google” if you have a Google account. \n If not, enter your email address in the Email address field. \nEnter your desired password.\nConfirm your password. \n Click Sign Up to finalize your account creation."
    },
    {
      question: "How to Login?",
      image: images.login,
      answer: "Click “Sign in with Google” if you have a Google account registered with Lookout.\nEnter your registered email address.\nEnter your password.\nIf you don't have an account, click “Sign Up” to register.\nClick “Submit” to log in and go to the home page."
    },
    // Add the rest of the FAQ items here
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(DOMPurify.sanitize(e.target.value));
    setSelectedQuestion(null); // Clear selected question when searching
  };

  const handleQuestionClick = (question: string) => {
    setSelectedQuestion(question === selectedQuestion ? null : question);
  };

  const filteredTutorialItems = tutorialItems.filter((item) =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
      <div className="mr-8">
    
    <h2 className="text-xl font-bold">Tutorials</h2>
        <input
          type="text"
          className={pageStyles.searchBar}
          placeholder="Search for a question..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <ul>
          {filteredTutorialItems.map((item, index) => (
            <li
              key={index}
              className={pageStyles.questionItem}
              onClick={() => handleQuestionClick(item.question)}
            >
              <h1 className={pageStyles.questionTitle}>
                {item.question}
              </h1>
              {selectedQuestion === item.question && (
                <>
                  <img
                    src={item.image}
                    alt={item.question}
                    className="w-full h-auto mb-2"
                  />
                  <ol className="list-decimal list-inside">
                    {item.answer
                      .split("\n")
                      .map((line, idx) => (
                        <li key={idx}>{line}</li>
                      ))}
                  </ol>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
  );
};

export default TutorialsPage;
