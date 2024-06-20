import React, { useState } from "react";
import { FaToggleOn, FaToggleOff, FaPlus } from "react-icons/fa";

interface CreateGroupsProps {
  onCreateGroup: (newGroup: Group) => void;
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

const CreateGroups: React.FC<CreateGroupsProps> = ({ onCreateGroup }) => {
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
      user: { id: 1 } // Replace with the actual user ID
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

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create</h2>

      <div className="flex justify-center mb-3">
        <button
          className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-lg"
          onClick={handleAddPhotoClick}
          data-testid="add-photo-button"
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
          data-testid="file-input"
          onChange={handleFileChange}
        />
        {picture && (
          <img src={picture} alt="Selected" className="w-32 h-32 mt-2 mx-auto" />
        )}
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
            <label htmlFor="visibilityToggle" className="text-sm font-medium text-gray-700">
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
            </button>
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
