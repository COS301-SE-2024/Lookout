import React, { useState } from "react";
import GroupsGridFix from "./GroupsGridFix";
import CreatedGroupsGridFix from "./CreatedGroupsGridFix";


const GroupsProfile = () => {
  const [selectedOption, setSelectedOption] = useState<string>('groups');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const placeholderText = selectedOption === 'groups'
    ? 'Search groups you joined'
    : 'Search groups you own';


  return (
    <div className="container mx-auto p-4">
      <div className="mb-1 flex flex-col space-y-4 ml-4">
        {/* Search Bar and Filter Dropdown on the Same Line */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <input
            type="text"
            placeholder={placeholderText}
            value={searchQuery}
            onChange={handleSearchChange}
            className="border p-2 rounded w-full max-w-md bg-gray-200"
          />
          {/* Filter Dropdown */}
          <select
            id="groupFilter"
            value={selectedOption}
            onChange={handleChange}
            className="border p-2 rounded bg-gray-200" // Added styling
          >
            <option value="groups">Joined Groups</option>
            <option value="ownedGroups">Owned Groups</option>
          </select>
        </div>
      </div>
      
      {/* Display Groups */}
      {selectedOption === 'groups' ? <GroupsGridFix searchQuery={searchQuery} /> : <CreatedGroupsGridFix searchQuery={searchQuery} />}
    </div>
  );
};

export default GroupsProfile;
