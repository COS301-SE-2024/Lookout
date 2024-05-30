import React from "react";
import { FaChevronRight } from "react-icons/fa";

const GroupsList = ({
	groups
}: {
	groups: { owner: string; name: string; description: string }[];
}) => {
	return (
		<div className="container mx-auto">
			{groups.map((group, index) => (
				<div
					key={index}
					className="flex items-center justify-between mb-4 p-2 border border-gray-300 rounded-lg group-item cursor-pointer hover:bg-gray-100"
					onClick={() => alert(`Clicked on ${group.name}`)}
				>
					<div>
						<h3 className="text-lg font-medium text-gray-800">
							{group.name}
						</h3>
						<p className="text-sm text-gray-600">
							{group.description}
						</p>
					</div>
					<button
						className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
						onClick={() => alert(`Clicked on ${group.name}`)}
					>
						<FaChevronRight className="text-gray-600" />
					</button>
				</div>
			))}
		</div>
	);
};

export default GroupsList;
