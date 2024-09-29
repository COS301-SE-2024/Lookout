import React, { useState } from "react";
import { FaChevronDown, FaChevronRight} from "react-icons/fa";
import images from "../assets/styles/images/images"; // Adjust the path as necessary
import DOMPurify from "dompurify";

interface FaqItem {
  question: string;
  image: string;
  answer: string;
}

const TutorialsPage: React.FC = () => {
  const pageStyles = {
    pageContainer: "w-full min-h-screen p-4", 
    contentContainer:
      "text-content rounded-lg w-11/12 md:w-3/4 pb-16", // Add bottom padding
    helpTitle: "text-xl font-bold",
    searchBar:
      "w-full py-2 px-4 bg-gray-200 border rounded-lg mt-4 text-black mb-6",
    questionItem:
      "py-4 border-b border-gray-200 cursor-pointer flex justify-between items-center",
    questionTitle: "text-lg font-medium",
    arrowIcon: "text-gray-500",
    answerSection: "mt-4 ml-4 text-sm",
    image: "w-full sm:w-3/4 md:w-1/2 lg:w-1/3 h-auto mt-4 rounded-md border border-gray-200",
    answerList: "list-decimal list-inside mt-2",
  };  

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [tutorialItems] = useState<FaqItem[]>([
    {
      question: "How to Signup?",
      image: images.signup,
      answer:
        "If you do not have a Google account you have the option to create your account by first entering your email address in the “Email address” field.\nEnter a password you would like to associate with this account.\nThen re-enter that password that you chose to confirm it.\nOnce those steps have been completed you can click on the “Sign Up” button to finalise the creation of your account.\nIf you have a Google account you can create a new Lookout account by simply clicking on the “Sign Up with Google” button.",
    },
    {
      question: "How to Login?",
      image: images.login,
      answer:
        "The second option requires you to first enter your email address that you used during registration.\nThen enter the password that you chose during registration.\nFinally, click on the Login button. If the credentials you entered are correct then you will be directed to the home page.\nIf you have a Google account registered with Lookout you can simply click on the “Sign in with Google” button to be logged in.\nIf you do not have an account you have to option to click on the “Signup” link in order to register a new account",
    },
    {
      question: "What options do you have on the home page?",
      image: images.home,
      answer:
        "If you would like to filter pins then click on this filter icon\nIf you would like to search for pins on the map then you should click on this search bar and begin typing.\nIf you would like to create a pin of your own then first start by clicking on this plus sign. The rest of the steps will be explained below.",
    },
    {
      question: "How to create a Pin?",
      image: images.createAPin,
      answer:
        "The first step to creating a pin is to choose which category the image will fit into. Clicking on Select Category will give you a dropdown menu of which categories you may choose from.\nHere you need to click on the menu and select the group which you would like to add this pin to.\nThe next step to creating a pin is to choose an image to upload or by taking a photo.\nEnter a title here for the pin.\nEnter a caption here for the pin.\nWe use your current location as the location of the sighting but if you want to upload an image from somewhere else you can always specify the actual location of the image here.\nFinally, click on the Add Pin button and if you have filled in all the fields then you will be able to view your pin on the map and within the group in which you posted. You can also find this pin on your profile page in the pins section.",
    },
    {
      question: "How to filter on the map?",
      image: images.filter,
      answer:
        "After clicking on the filter icon on the homepage you will then see this pop-up modal which will allow you to filter the pins that you see on the map. You have the option to view all pins, animal sightings, campsites, hiking trails, points of interest and security concerns",
    },
    {
      question: "How to find pins on the Explore Page?",
      image: images.explore,
      answer:
        "You can search for posts and groups by simply clicking on this field and then typing \n To navigate between posts you can click on the arrows to scroll between posts.\n If you click on a post you will be brought to a page like this. There is also a back button to take you back to the explore page. \nIf you want to view this post on a map then simply click on this View on Map button. \n If you want to see which group this post belongs to click on the View Group button. You can also see more posts from the group in the carousel below.",
    },
    {
      question: "What do the view on map and view group buttons do?",
      image: images.views,
      answer:
        "If you click on the View on Map or the View Group buttons as shown above you will be brought to pages like these.",
    },
    {
      question: "How to edit a post on the profile page?",
      image: images.profileEditPost,
      answer:
      "If you would like to edit your post then click on the edit button. \n If you would like to cancel the editing process click on the cancel button.\n If you would like to edit your post's title then you can type the updated title in this text area.\n If you would like to edit your post's caption then you can type your updated caption in this text area.\n If you are satisfied with the updated post then you can click on the Done button.",
    },
    {
      question: "How to create a group on the profile page?",
      image: images.groupsCreate,
      answer:
        "If you would like to create your own group then first start by clicking on this plus icon\nIt will then open up this modal that you see on the right hand side\nFirst start by adding a group icon\nThen set a group title by clicking on the Enter title field and typing\nThen click on the Enter description field and then enter a group description\nFinally click on the create button and if you have filled in all the fields then the group will be created successfully",
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
        "If you click on the settings icon on the navigation bar then you will see this page below pop-up on your screen with different options to improve your user experience",
    },
    {
      question: "How to edit your profile in settings?",
      image: images.updateProfile,
      answer:
        "If you would like to change your username then click on this field and type in your new username and then click on the Update Profile button (3) \nIf you would like to update your email address then click on this field and type in the email address that you would like to change to then click on the Update Profile button (3).\nIf you would like to update your profile then click on this button\nIf you would like to reset your password then click on this button",
    },
    {
      question: "How to edit your theme in settings?",
      image: images.editTheme,
      answer:
        "In order to change your theme preferences first click on either the Light Theme or Dark Theme block\nFinally to confirm your theme settings click on the confirm button",
    },
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
    <div className="bg-bkg">
      <div className={pageStyles.contentContainer}>
      <h2 className={pageStyles.helpTitle}>Tutorials</h2>
      <p className="text-sm text-content2">Step-by-step instructions to guide you.</p>
      <hr className="mr-10" />
         <input
          type="text"
          className={pageStyles.searchBar}
          placeholder="Search for a question..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <ul>
          {filteredTutorialItems.map((item, index) => (
            <div key={index}>
              <li
                className={pageStyles.questionItem}
                onClick={() => handleQuestionClick(item.question)}
              >
                <h1 className={pageStyles.questionTitle}>{item.question}</h1>
                {selectedQuestion === item.question ? (
                  <FaChevronDown className={pageStyles.arrowIcon} />
                ) : (
                  <FaChevronRight className={pageStyles.arrowIcon} />
                )}
              </li>
              {selectedQuestion === item.question && (
                <div className={pageStyles.answerSection}>
                  <img
                    src={item.image}
                    alt={item.question}
                    className={pageStyles.image}
                  />
                  <ol className={pageStyles.answerList}>
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

export default TutorialsPage;
