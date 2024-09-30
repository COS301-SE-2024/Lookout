import React, { startTransition, useState, useEffect } from "react";
import GroupsGridFix from "./GroupsGridFix";
import CreatedGroupsGridFix from "./CreatedGroupsGridFix";
import CreateGroups from "./CreateGroups"; // Import CreateGroups component
import { FaPlus } from "react-icons/fa6";

const GroupsProfile = () => {
	const [selectedOption, setSelectedOption] = useState(() => {
		return localStorage.getItem("selectedOption") || "groups";
	});
	const [searchQuery] = useState<string>("");
	const [isCreateGroupsOpen, setIsCreateGroupsOpen] =
		useState<boolean>(false);

	useEffect(() => {
		localStorage.setItem("selectedOption", selectedOption);
	}, [selectedOption]);

	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		startTransition(() => {
			setSelectedOption(event.target.value);
		});
	};

	const [groupCount, setGroupCount] = useState(0); // State to track the number of created groups

const handleCreateGroup = (newGroup: any) => {
	console.log("New group created:", newGroup);
	startTransition(() => {
		setIsCreateGroupsOpen(false);
		setGroupCount(prevCount => prevCount + 1); // Increment the count
	});
};

	const handleCloseModal = () => {
		setIsCreateGroupsOpen(false);
	};

	return (
		<div className="w-full">
			<div className="mb-4 flex flex-col space-y-4">
				{/* Search Bar and Filter Dropdown on the Same Line */}
				<div className="flex items-center  justify-between space-x-2">
					{/* Filter Dropdown */}
					<select
						id="groupFilter"
						value={selectedOption}
						onChange={handleChange}
						className="border p-2 rounded bg-hver border-hver"
					>
						<option value="groups">Groups Joined</option>
						<option value="created">Groups Created</option>
					</select>
					{/* Create Group Button */}
					<button
						className="p-2 h-12 w-12 rounded-md hover:bg-hver flex items-center justify-center"
						onClick={() => setIsCreateGroupsOpen(true)}
					>
						<FaPlus size={24} className="text-content" />
					</button>
				</div>
			</div>

			{/* Display Groups */}
			{selectedOption === "groups" ? (
	<GroupsGridFix searchQuery={searchQuery} />
) : (
	<CreatedGroupsGridFix key={groupCount} searchQuery={searchQuery} /> // Use groupCount as key
)}

			{/* Create Groups Modal */}
			{isCreateGroupsOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
					<div className="bg-nav p-4 rounded-lg shadow-lg w-full max-w-md relative">
						<CreateGroups
							onCreateGroup={handleCreateGroup}
							onClose={handleCloseModal}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default GroupsProfile;
