import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMenu } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import '../assets/styles/home.css';
import { APIProvider } from '@vis.gl/react-google-maps';

interface CreatePostsProps {
  onCreatePost: (newPost: Post) => void;
}

interface Post {
  userid: number;
  groupid: number;
  categoryid: number;
  picture: string;
  latitude: number;
  longitude: number;
  caption: string;
}

type Group = { id: number, name: string, categories: { id: number, name: string }[] };

const apicode = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const HomeScreen: React.FC<CreatePostsProps> = ({ onCreatePost }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // State for success modal
  const [groups, setGroups] = useState<Group[]>([]);
  const [caption, setCaption] = useState("");
  const [picture, setPicture] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const navigate = useNavigate();

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleAddPinClick = async () => {
    if (selectedGroup === null) {
      alert("Please select a group.");
      return;
    }
    if (selectedCategory === null) {
      alert("Please select a category.");
      return;
    }

    const newPost = {
      userid: 52,
      groupid: selectedGroup,
      categoryid: selectedCategory,
      picture: picture || "https://animalmicrochips.co.uk/images/default_no_animal.jpg",
      latitude: 3.4,
      longitude: 3.4,
      caption: caption
    };

    try {
      const response = await fetch('/api/posts/CreatePost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });
      

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const createdPost = await response.json();
      //console.log('Post created successfully:', createdPost);
      setCaption("");
      setPicture("");
      setSelectedGroup(null);
      setSelectedCategory(null);
      closeModal();

      onCreatePost(createdPost);
      
      setIsSuccessModalOpen(true); // Open success modal
      // setIsModalOpen(false); // Close modal after successful pin addition
      // setIsSuccessModalOpen(true); // Open success modal
      
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleAddPhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPicture(fileUrl);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openMenuModal = () => {
    setIsMenuModalOpen(true);
  };

  const closeMenuModal = () => {
    setIsMenuModalOpen(false);
  };

  // const closeSuccessModal = () => {
  //   setIsSuccessModalOpen(false);
  // };

  useEffect(() => {
    fetch('/api/groups/user/1', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log(data); // Log the data to check the response format
        setGroups(data);
      })
      .catch((error) => console.error('Error fetching groups:', error));
  }, []);

  const categories = [
    { id: 1, name: "Animal Sighting" },
    { id: 2, name: "Campsite" },
    { id: 3, name: "Hiking Trail" },
    { id: 4, name: "Security Concern" },
    { id: 5, name: "POI" },
  ];

  return (
    <APIProvider apiKey={apicode || ''} onLoad={() => console.log('Maps API has loaded.')}>
      <div className="map-container">
        {/* Your map component or placeholder */}
      </div>
      <div className="fixed top-8 left-4 z-10">
        <IoMenu size={32} onClick={openMenuModal} />
      </div>
      <button
        className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-500 text-white py-2 px-4 rounded-full hover:bg-gray-800 sm:bottom-24 md:bottom-20"
        onClick={openModal}
      >
        +
      </button>

      {/* Add pin modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white p-6 rounded-lg w-full max-w-md mx-auto">
            <button className="absolute top-2 right-2 text-xl" onClick={closeModal}>
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Add a Pin</h2>

            <div className="flex justify-center mb-3">
              <button
                className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-lg"
                onClick={handleAddPhotoClick}
              >
                <FaPlus />
              </button>
            </div>

            <div className="text-center mb-3">
              <span className="text-lg">Add a photo</span>
              <input
                type="file"
                accept="image/jpeg, image/png"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              {picture && (
                <img src={picture} alt="Selected" className="w-32 h-32 mt-2 mx-auto" />
              )}
            </div>

            <form>
              <div className="mb-3">
                <label
                  htmlFor="groupSelect"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Group:
                </label>
                <select
                  id="groupSelect"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedGroup ?? ""}
                  onChange={(e) => setSelectedGroup(Number(e.target.value))}
                >
                  <option value="" disabled>Select a group</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>{group.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label
                  htmlFor="categorySelect"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Category:
                </label>
                <select
                  id="categorySelect"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedCategory ?? ""}
                  onChange={(e) => setSelectedCategory(Number(e.target.value))}
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label
                  htmlFor="formDescription"
                  className="block text-sm font-medium text-gray-700"
                >
                  Caption:
                </label>
                <textarea
                  id="formDescription"
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter description"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                ></textarea>
              </div>
            </form>

            <div>
              <button
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handleAddPinClick}
              >
                Add Pin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Post Created Successfully!</h2>
            <button
              className="block mx-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => {
                setIsSuccessModalOpen(false);
                navigate('/'); // Redirect or navigate as needed
              }}
            >
              Okay
            </button>
          </div>
        </div>
      )}

      {/* Menu modal */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white p-4 rounded-lg" style={{ width: "80%", maxHeight: "80vh", overflowY: "auto" }}>
            <button className="absolute top-0 left-0 mt-1 ml-1 p-2" onClick={closeMenuModal}>X</button>
            <div className="mt-4">
              <h2 className="text-lg font-semibold">Pins Displaying</h2>
              <div className="mt-2">
                <button
                  className="w-full text-left p-2 bg-gray-200 rounded mb-2"
                >
                  All Pins
                </button>
                {/* {groups.map((group) => (
                  <div key={group.id}>
                    <button
                      className="w-full text-left p-2 bg-gray-200 rounded mb-2"
                      onClick={() => toggleGroup(group.id)}
                    >
                      {group.name}
                    </button>
                    {expandedGroups[group.id] && (
                      <div className="pl-4 mt-2">
                        {group.pins.map((pin) => (
                          <div key={pin.id} className="p-2 bg-gray-100 rounded mb-2">
                            {pin.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))} */}
              </div>
              <div className="flex justify-center mt-4">
                <button className="py-2 px-4 bg-gray-500 text-white rounded-full hover:bg-gray-800" onClick={closeMenuModal}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </APIProvider>
  );
};

export default HomeScreen;
