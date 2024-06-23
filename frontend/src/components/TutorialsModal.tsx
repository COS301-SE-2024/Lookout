import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import images from '../assets/styles/images/images'; // Adjust the path as necessary

interface FaqItem {
  question: string;
  image: string;
  answer: string;
}

interface TutorialsModalProps {
  onClose: () => void;
}

const TutorialsModal: React.FC<TutorialsModalProps> = ({ onClose }) => {
  const modalStyles = {
    modalContainer:
      "fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-start md:justify-center items-center",
    modalContent:
      "bg-bkg rounded-lg p-8 relative w-11/12 md:w-96 h-full md:h-auto overflow-y-auto", // Adjust width and height for mobile and larger screens
    closeButton: "absolute top-2 left-2 cursor-pointer",
    closeIcon: "text-gray-500 hover:text-gray-700",
    helpTitle: "text-xl font-semibold mb-4 text-center",
    searchBar: "w-full py-2 px-4 border rounded-lg mt-4",
    questionItem: "py-2 border-t border-b mb-4 cursor-pointer",
    questionTitle: "text-xl font-semibold",
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [faqItems, setFaqItems] = useState<FaqItem[]>([
    { question: "How to Signup?", image: images.signup , answer: "Click “Sign Up with Google” if you have a Google account. \n If not, enter your email address in the Email address field. \nEnter your desired password.\nConfirm your password. \n Click Sign Up to finalize your account creation." },
    { question: "How to Login?", image: images.login, answer: "Click “Sign in with Google” if you have a Google account registered with Lookout.\nEnter your registered email address.\nEnter your password.\nIf you don't have an account, click “Sign Up” to register.\nClick “Submit” to log in and go to the home page.." },
    { question: "How to create a Pin?", image: images.createAPin, answer: "Click the add photo box to upload an image.\nEnter a title for the pin.\nEnter a description for the pin.\nSelect the group to add the pin to.\nClick Add Pin. If all fields are filled, you can view the pin on the map, within the group, and on your profile page."},
    { question: "How to find pins on the Explore Page?", image: images.explore, answer: "This pin's caption is “Early Risers”, the category is “Hiking Trail”, and it shows the posting date. \n Click the pin to view details like who posted it and their group." },
    { question: "How to find groups on the Explore Page?", image: images.exploreGroups, answer: "To learn more about a group, click on it (e.g., Squid Squad). \n On this page, you can see related posts. If interested, click the Join button to view more posts from this group."},
    { question: "How to find articles on the Explore Page?", image: images.exploreArticles, answer: "This is an example of an article on this page. Click on the article to be redirected to the original website for reading."},
    { question: "How to view your groups on the Groups Page?", image: images.groupsYourGroups, answer: "On the Your Groups tab, you can find groups you're part of. \nClicking on a group will take you to its page where you can see all related posts."},
    { question: "How to search for a group on the Groups Page?", image: images.groupsSearch, answer: "You can use the search bar to find a specific group by typing its name. For instance, typing koal suggested the Koalas group, where you can choose to join or continue searching for other groups."},
    { question: "How to create a group on the Groups Page?", image: images.groupsCreate, answer: "Click the plus sign to select a group picture.\nEnter a title, which will also serve as the group's name.\nWrite a description to inform others about the group's content.\nClick Create to finalize the creation of your new group. An example of how to fill out these fields is shown on the right-hand side."},
    { question: "How to edit a post on the profile page?", image: images.profileEditPost, answer: "Click on the edit button.\nYou can now make changes to your caption.After editing, click Save to update your post. If you decide not to make any changes, click Cancel.\nThis demonstrates how the caption was successfully updated."},
    { question: "How to use settings?", image: images.profileSettings, answer: "To activate dark mode, click on the slider. The background will change to a darker color.\nTo switch back to light mode, click on the slider again. The background will change to white.\nTo logout of Lookout, click on the Logout button. You will be redirected to the Login screen."},
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedQuestion(null); // Clear selected question when searching
  };

  const handleQuestionClick = (question: string) => {
    setSelectedQuestion(question === selectedQuestion ? null : question);
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
        <h2 className={modalStyles.helpTitle}>Tutorials</h2>
        <input
          type="text"
          className={modalStyles.searchBar}
          placeholder="Search for a question..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <ul>
          {filteredFaqItems.map((item, index) => (
            <li key={index} className={modalStyles.questionItem} onClick={() => handleQuestionClick(item.question)}>
              <h1 className={modalStyles.questionTitle}>{item.question}</h1>
              {selectedQuestion === item.question && (
                <>
                  <img src={item.image} alt={item.question} className="w-full h-auto mb-2" />
                  <ol className="list-decimal list-inside">
                    {item.answer.split('\n').map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ol>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TutorialsModal;
