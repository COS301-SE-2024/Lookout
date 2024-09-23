import React, { useEffect, useState } from "react";
import SearchGroups from "../components/SearchGroups";
import CreateGroups from "../components/CreateGroups";
import GroupsList from '../components/GroupsList';

type Group = {
	id: number;
	name: string;
	owner: string;
	picture: string;
	description: string;
	isPrivate: boolean;
	createdAt: string;
};

const GroupScreen = () => {
	const [activeTab, setActiveTab] = useState("your-groups");
	const [,setGroups] = useState<Group[]>([]);
	useEffect(() => {
		fetch('/api/groups/user/1', {
			method: 'GET',
			headers: {
				'Accept': 'application/json'
			}
		})
		.then(response => response.json())
		.then(data => setGroups(data))
		.catch(error => console.error('Error:', error));
	}, []);
	

	const handleAddGroup = (newGroup: Group) => {
		setGroups(prevGroups => [...prevGroups, newGroup]);
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Group Screen</h1>
			<ul className="flex border-b mb-4">
				<li className="mr-1">
					<button
						className={`px-4 py-2 focus:outline-none ${
							activeTab === "your-groups"
								? "border-b-4 border-[#6A994E] font-bold"
								: "text-gray-500"
						}`}
						onClick={() => setActiveTab("your-groups")}
					>
						Your Groups
					</button>
				</li>
				<li className="mr-1">
					<button
						className={`px-4 py-2 focus:outline-none${
							activeTab === "search"
								? "border-b-4 border-[#6A994E] font-bold"
								: "text-gray-500"
						}`}
						onClick={() => setActiveTab("search")}
					>
						Search
					</button>
				</li>
				<li className="mr-1">
					<button
						className={`px-4 py-2 focus:outline-none ${
							activeTab === "create"
								? "border-b-4 border-[#6A994E] font-bold"
								: "text-gray-500"
						}`}
						onClick={() => setActiveTab("create")}
					>
						Create
					</button>
				</li>
			</ul>

			<div className="tab-content">
				{activeTab === "your-groups" && <GroupsList />}
				{activeTab === "search" && <SearchGroups />}
				{activeTab === "create" && <CreateGroups onCreateGroup={handleAddGroup} />}
			</div>
		</div>
	);
};

export default GroupScreen;
