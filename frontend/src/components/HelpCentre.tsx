import React from "react";
//import { FaArrowLeft } from "react-icons/fa";
import images from "../assets/styles/images/images"; // Adjust the path as necessary

const HelpCentreScreen: React.FC = () => {
  const screenStyles = {
    container: "flex flex-col h-screen p-8 bg-gray-100",
    header: "flex items-center mb-6",
    backButton: "cursor-pointer text-gray-500 hover:text-gray-700 mr-4",
    backIcon: "text-gray-500 hover:text-gray-700",
    title: "text-2xl font-semibold text-black",
    content: "flex-1 overflow-y-auto bg-white p-8 rounded-lg shadow-lg",
    sectionTitle: "text-lg font-semibold mt-4 mb-2 text-black",
    contactInfo: "mt-4 text-black",
    linkList: "mt-2 text-black",
    forumImage: "w-64 h-32 object-cover rounded-lg mb-2", // Adjust width and height as needed
    forumDescription: "text-sm mt-1 text-black mr-4",
  };

  return (
    <>
      <h2 className="text-xl font-bold">Help Centre</h2>
      <p className="text-sm text-gray-500">Useful resources for us and external sources to assist you.</p>
      <hr className="mr-10"></hr>
      <div className="flex flex-col items-center">
        <ul className="w-full">
          <li className="flex flex-col py-2 mr-4">
            <label
              htmlFor="username"
              className=" text-gray-700 font-bold mb-2"
            >
              Have any queries?
            </label>

            <a
              href="https://forms.gle/dc4i9pd2GNLZKm2h6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-800 text-sm hover:underline mr-4"
            >
              Click here to fill out the form for us to assist you.
            </a>
          </li>

          <li className="flex flex-col py-2 ">
            <label
              htmlFor="username"
              className=" text-gray-700 font-bold mb-2 mr-4"
            >
              External Safari and Nature Forums
            </label>


            <a
              href="https://safaritalk.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-800 hover:underline"
            >
              1. SafariTalk
            </a>
            <p className={screenStyles.forumDescription}>
              Dedicated to African safaris, wildlife conservation, and safari
              travel.
            </p>
            <img
              src={images.safari}
              alt="SafariTalk Community Forum"
              className={screenStyles.forumImage}
            />


            <a
              href="https://wildlifegardeners.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-800 hover:underline"
            >
              2. Wildlife Gardeners
            </a>
            <p className={screenStyles.forumDescription}>
              Community for wildlife gardening, habitat creation, and
              environmental stewardship.
            </p>
            <img
              src={images.gardener}
              alt="Wildlife Gardeners Community Forum"
              className={screenStyles.forumImage}
            />


            <a
              href="https://wildlifewarriors.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-800 hover:underline"
            >
              3. Wildlife Warriors
            </a>
            <p className={screenStyles.forumDescription}>
              Global network for wildlife conservationists and advocates.
            </p>
            <img
              src={images.activist}
              alt="Wildlife Warriors Community Forum"
              className={screenStyles.forumImage}
            />


          </li>


          <li className="flex flex-col py-2">

          </li>

        </ul>
      </div>
    </>
  );
};

export default HelpCentreScreen;
