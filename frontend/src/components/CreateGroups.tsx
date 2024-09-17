import React, { useState } from "react";
import { FaToggleOn, FaToggleOff, FaPlus, FaTimes, FaTrash } from "react-icons/fa";

interface CreateGroupsProps {
  onCreateGroup: (newGroup: Group) => void;
  onClose: () => void;  // New prop for closing the modal
}

interface Group {
  id: number;
  name: string;
  owner: string;
  picture: string;
  description: string;
  isPrivate: boolean;
  createdAt: string;
}

const CreateGroups: React.FC<CreateGroupsProps> = ({ onCreateGroup, onClose }) => {
  const [isToggled, setIsToggled] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState("");

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const toggleSwitch = () => {
    setIsToggled(!isToggled);
  };

  const handleCreateClick = async () => {
    const newGroup = {
      name: title,
      description: description,
      picture: picture || "https://animalmicrochips.co.uk/images/default_no_animal.jpg",
      isPrivate: isToggled,
      userId: 2 // Replace with the actual user ID
    };

    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGroup),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const createdGroup = await response.json();
      onCreateGroup(createdGroup);
      setTitle("");
      setDescription("");
      setPicture("");
      setIsToggled(false);
      onClose(); // Close the modal after creating the group
    } catch (error) {
      console.error('Error creating group:', error);
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

  const handleRemovePhoto = () => {
    setPicture("");
  };

  return (
    <div className="relative bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
      {/* Close Button */}
      <button
        className="absolute top-2 right-2 text-gray-600"
        onClick={onClose}  // Use the onClose prop
      >
        <FaTimes className="text-xl" />
      </button>

      <h2 className="text-2xl font-bold mb-4">Create</h2>

      <div className="flex justify-center mb-3">
        <button
          className="flex items-center justify-center w-32 h-32 border border-gray-300 rounded-lg relative overflow-hidden"
          onClick={handleAddPhotoClick}
          data-testid="add-photo-button"
        >
          {picture ? (
            <>
              <img
                src={picture}
                alt="Selected"
                className="object-cover w-full h-full"
              />
              <button
                className="absolute top-2 right-2 bg-gray-800 text-white p-1 rounded-full"
                onClick={handleRemovePhoto}
                data-testid="remove-photo-button"
              >
                <FaTrash />
              </button>
            </>
          ) : (
            <FaPlus className="text-3xl" />
          )}
        </button>
      </div>

      <div className="text-center mb-3">
        <span className="text-lg">Add a photo</span>
        <input
          type="file"
          accept="image/jpeg, image/png"
          style={{ display: "none" }}
          ref={fileInputRef}
          data-testid="file-input"
          onChange={handleFileChange}
        />
      </div>

      <form>
        <div className="mb-3">
          <label
            htmlFor="formTitle"
            className="block text-sm font-medium text-gray-700"
          >
            Title:
          </label>
          <input
            type="text"
            id="formTitle"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="formDescription"
            className="block text-sm font-medium text-gray-700"
          >
            Description:
          </label>
          <textarea
            id="formDescription"
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-3">
          <div className="flex justify-between items-center">
            {/* <label htmlFor="visibilityToggle" className="text-sm font-medium text-gray-700">
              Visibility - set your group to private:
            </label>
            <button
              id="visibilityToggle"
              aria-checked={isToggled}
              role="switch"
              onClick={toggleSwitch}
              className="cursor-pointer"
              data-testid="visibility-toggle"
            >
              {isToggled ? (
                <FaToggleOn className="text-2xl text-green-500" />
              ) : (
                <FaToggleOff className="text-2xl text-gray-500" />
              )}
            </button> */}
          </div>
        </div>
      </form>

      <div>
        <button
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleCreateClick}
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateGroups;
