import React, { useState } from "react";
import SearchGroups from "../components/SearchGroups";
import CreateGroups from "../components/CreateGroups";
import GroupsList from '../components/GroupsList';

type Group = {
	id: number;
	name: string;
	owner: string;
	imageUrl: string;
	description: string;
	isPrivate: boolean;
	createdAt: string;
};

const GroupScreen = () => {
	const [activeTab, setActiveTab] = useState("your-groups");
	const [groups, setGroups] = useState<Group[]>([
		{ id: 1, name: 'Hidden Gems', owner: 'Evelyn Smith', imageUrl: 'https://i.pinimg.com/originals/80/4c/82/804c82e561475688f6c115e3df2d8288.jpg', description: 'Explore the hidden gems of the wilderness.', isPrivate: false, createdAt: new Date().toISOString() },
		{ id: 2, name: 'For the Love of Trees', owner: 'Alex Anderson', imageUrl: 'https://i.pinimg.com/originals/4d/d7/c0/4dd7c0f68fd9d0d51f13cba3a8f24163.jpg', description: 'A group for tree lovers and conservationists.', isPrivate: false, createdAt: new Date().toISOString() },
		{ id: 3, name: 'Sunset Moments', owner: 'Harper Garcia', imageUrl: 'https://i.pinimg.com/originals/51/c2/d2/51c2d29f95977f38e9be0d20a599d42c.jpg', description: 'Capture and share beautiful sunset moments.', isPrivate: false, createdAt: new Date().toISOString() },
		{ id: 4, name: 'Elephant Fanatics', owner: 'Ava Jackson', imageUrl: 'https://i.pinimg.com/originals/62/5b/0e/625b0e73e60198e123ba03a6ae1bc574.jpg', description: 'Dedicated to the protection and admiration of elephants.', isPrivate: false, createdAt: new Date().toISOString() },
		{ id: 5, name: 'Stripe Savvy Syndicate', owner: 'Anthony Harris', imageUrl: 'https://i.pinimg.com/originals/cb/e7/d3/cbe7d319fa566e5d19d25921d2ec7ca5.jpg', description: 'A group for those passionate about striped animals.', isPrivate: false, createdAt: new Date().toISOString() },
	]);

	const handleAddGroup = (newGroup: Omit<Group, 'id'>) => {
		setGroups(prevGroups => [...prevGroups, { ...newGroup, id: prevGroups.length + 1 }]);
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Group Screen</h1>
			<ul className="flex border-b mb-4">
				<li className="mr-1">
					<button
						className={`px-4 py-2 ${
							activeTab === "your-groups"
								? "border-b-2 border-blue-500 text-blue-500"
								: "text-gray-500"
						}`}
						onClick={() => setActiveTab("your-groups")}
					>
						Your Groups
					</button>
				</li>
				<li className="mr-1">
					<button
						className={`px-4 py-2 ${
							activeTab === "search"
								? "border-b-2 border-blue-500 text-blue-500"
								: "text-gray-500"
						}`}
						onClick={() => setActiveTab("search")}
					>
						Search
					</button>
				</li>
				<li className="mr-1">
					<button
						className={`px-4 py-2 ${
							activeTab === "create"
								? "border-b-2 border-blue-500 text-blue-500"
								: "text-gray-500"
						}`}
						onClick={() => setActiveTab("create")}
					>
						Create
					</button>
				</li>
			</ul>

			<div className="tab-content">
				{activeTab === "your-groups" && <GroupsList groups={groups} />}
				{activeTab === "search" && <SearchGroups />}
				{activeTab === "create" && <CreateGroups onCreateGroup={handleAddGroup} />}
			</div>
		</div>
	);
};

export default GroupScreen;
