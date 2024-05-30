import { SetStateAction, useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchGroups = () => {
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearchChange = (event: {
		target: { value: SetStateAction<string> };
	}) => {
		setSearchQuery(event.target.value);
	};

	return (
		<div className="container mx-auto p-4">
			<h2 className="text-xl font-bold mb-4">Search</h2>
			<div className="mb-3">
				<div className="flex">
					<input
						type="text"
						value={searchQuery}
						onChange={handleSearchChange}
						placeholder="Search..."
						aria-label="Search"
						className="flex-grow px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<button className="px-4 py-2 border border-gray-300 border-l-0 rounded-r bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
						<FaSearch />
					</button>
				</div>
			</div>
		</div>
	);
};

export default SearchGroups;
