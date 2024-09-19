import React, { useState } from "react";
import { FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import images from "../assets/styles/images/images"; // Adjust the path as necessary
import DOMPurify from "dompurify";

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
      "fixed inset-0 z-50 flex items-center justify-center bg-nav bg-opacity-50",
    modalContent:
      "bg-nav text-content rounded-lg p-8 relative w-11/12 md:w-96 max-h-screen h-[80vh] overflow-y-auto scrollbar scrollbar-thumb-gray-400 scrollbar-track-gray-200",
    closeButton: "absolute top-2 left-2 cursor-pointer",
    closeIcon: "text-content hover:text-gray-700",
    helpTitle: "text-xl font-semibold mb-4 text-center text-content",
    searchBar:
      "w-full py-2 px-4 bg-gray-200 border rounded-lg mt-4 text-content mb-6",
    questionItem:
      "py-4 border-b border-gray-200 cursor-pointer flex justify-between items-center",
    questionTitle: "text-lg font-medium text-content",
    arrowIcon: "text-content",
    answerSection: "mt-4 ml-4 text-sm text-content2",
    image: "w-full h-auto mt-4 rounded-md border border-gray-200",
    answerList: "list-decimal list-inside mt-2",
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  const [tutorialItems] = useState<FaqItem[]>([
    {
      question: "How to Signup?",
      image: images.signup,
      answer:
        "Click “Sign Up with Google” if you have a Google account. \n If not, enter your email address in the Email address field. \nEnter your desired password.\nConfirm your password. \n Click Sign Up to finalize your account creation.",
    },
    {
      question: "How to Login?",
      image: images.login,
      answer:
        "Click “Sign in with Google” if you have a Google account registered with Lookout.\nEnter your registered email address.\nEnter your password.\nIf you don't have an account, click “Sign Up” to register.\nClick “Submit” to log in and go to the home page..",
    },
    {
      question: "How to create a Pin?",
      image: images.createAPin,
      answer:
        "Click the add photo box to upload an image.\nEnter a title for the pin.\nEnter a description for the pin.\nSelect the group to add the pin to.\nClick Add Pin. If all fields are filled, you can view the pin on the map, within the group, and on your profile page.",
    },
    {
      question: "How to find pins on the Explore Page?",
      image: images.explore,
      answer:
        "You can search for posts and groups by simply clicking on this field and then typing \n To navigate between posts you can click on the arrows to scroll between posts.\n If you click on a post you will be brought to a page like this. There is also a back button to take you back to the explore page. \nIf you want to view this post on a map then simply click on this View on Map button. \n If you want to see which group this post belongs to click on the View Group button. You can also see more posts from the group in the carousel below.",
    },
    {
      question: "How to find groups on the Explore Page?",
      image: images.exploreGroups,
      answer:
        "To learn more about a group, click on it (e.g., Squid Squad). \n On this page, you can see related posts. If interested, click the Join button to view more posts from this group.",
    },
    {
      question: "How to find articles on the Explore Page?",
      image: images.exploreArticles,
      answer:
        "This is an example of an article on this page. Click on the article to be redirected to the original website for reading.",
    },
    {
      question: "How to view your groups on the Groups Page?",
      image: images.groupsYourGroups,
      answer:
        "On the Your Groups tab, you can find groups you're part of. \nClicking on a group will take you to its page where you can see all related posts.",
    },
    {
      question: "How to search for a group on the Groups Page?",
      image: images.groupsSearch,
      answer:
        "You can use the search bar to find a specific group by typing its name. For instance, typing koal suggested the Koalas group, where you can choose to join or continue searching for other groups.",
    },
    {
      question: "How to create a group on the Groups Page?",
      image: images.groupsCreate,
      answer:
        "Click the plus sign to select a group picture.\nEnter a title, which will also serve as the group's name.\nWrite a description to inform others about the group's content.\nClick Create to finalize the creation of your new group. An example of how to fill out these fields is shown on the right-hand side.",
    },
    {
      question: "How to edit a post on the profile page?",
      image: images.profileEditPost,
      answer:
        "If you would like to edit your post then click on the edit button. \n If you would like to cancel the editing process click on the cancel button.\n If you would like to edit your post's title then you can type the updated title in this text area.\n If you would like to edit your post's caption then you can type your updated caption in this text area.\n If you are satisfied with the updated post then you can click on the Done button.",
    },
    {
      question: "How to edit a group on the profile page?",
      image: images.editGroup,
      answer:
        "If you would like to edit a group then simply click on the pencil icon. \nAs a group admin you also have the ability to remove a member from your group and if you would like to do so then simply click on this button to remove that member.\nIf you would like to cancel the editing process then simply click on the Cancel button.\nIf you would like to edit your group’s title then simply click on the text area below this blue dot and then start typing your new title. \nIf you would like to edit your group’s description then simply click on the text area to the left of this blue dot and start typing the new description. \nIf you are happy with the changes you have made then you can click on the Done button and all changes made to your group will be saved.",
    },
    {
      question: "How to use settings?",
      image: images.profileSettings,
      answer:
        "To activate dark mode, click on the slider. The background will change to a darker color.\nTo switch back to light mode, click on the slider again. The background will change to white.\nTo logout of Lookout, click on the Logout button. You will be redirected to the Login screen.",
    },
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(DOMPurify.sanitize(e.target.value));
    setSelectedQuestion(null);
  };

  const handleQuestionClick = (question: string) => {
    setSelectedQuestion(question === selectedQuestion ? null : question);
  };

  const filteredTutorialItems = tutorialItems.filter((item) =>
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
          {filteredTutorialItems.map((item, index) => (
            <div key={index}>
              <li
                className={modalStyles.questionItem}
                onClick={() => handleQuestionClick(item.question)}
              >
                <h1 className={modalStyles.questionTitle}>{item.question}</h1>
                {selectedQuestion === item.question ? (
                  <FaChevronUp className={modalStyles.arrowIcon} />
                ) : (
                  <FaChevronDown className={modalStyles.arrowIcon} />
                )}
              </li>
              {/* This section is now outside the li element */}
              {selectedQuestion === item.question && (
                <div className={modalStyles.answerSection}>
                  <img
                    src={item.image}
                    alt={item.question}
                    className={modalStyles.image}
                  />
                  <ol className={modalStyles.answerList}>
                    {item.answer.split("\n").map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TutorialsModal;
