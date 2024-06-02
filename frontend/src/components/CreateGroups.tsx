import React, { useState } from "react";
import { FaToggleOn, FaToggleOff, FaPlus } from "react-icons/fa";

interface CreateGroupsProps {
  onCreateGroup: (newGroup: Omit<Group, 'id'>) => void;
}

interface Group {
  id: number;
  name: string;
  owner: string;
  imageUrl: string;
  description: string;
  isPrivate: boolean;
  createdAt: string;
}

const CreateGroups: React.FC<CreateGroupsProps> = ({ onCreateGroup }) => {
  const [isToggled, setIsToggled] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const toggleSwitch = () => {
    setIsToggled(!isToggled);
  };

  const handleClick = () => {
    console.log("Square clicked!");
  };

  const handleCreateClick = () => {
    const newGroup: Omit<Group, 'id'> = {
      name: title,
      owner: "Aliyah", // Provide default value if needed
      imageUrl: imageUrl,
      description: description,
      isPrivate: isToggled, // Include isPrivate property
      createdAt: new Date().toISOString(), // Include createdAt property
    };
    onCreateGroup(newGroup);
    setTitle("");
    setDescription("");
    setImageUrl("");
    setIsToggled(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create</h2>

      <div className="flex justify-center mb-3">
        <button
          className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-lg"
          onClick={handleClick}
        >
          <FaPlus />
        </button>
      </div>

      <div className="text-center mb-3">
        <span className="text-lg">Add a photo</span>
        <input
          type="text"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
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
            <label className="text-sm font-medium text-gray-700">
              Visibility - set your group to private:
            </label>
            <div onClick={toggleSwitch} className="cursor-pointer">
              {isToggled ? (
                <FaToggleOn className="text-2xl text-green-500" />
              ) : (
                <FaToggleOff className="text-2xl text-gray-500" />
              )}
            </div>
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
