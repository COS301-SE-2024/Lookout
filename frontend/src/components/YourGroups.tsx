import {
	Key,
	ReactElement,
	JSXElementConstructor,
	ReactNode,
	ReactPortal
} from "react";
import { FaChevronRight } from "react-icons/fa";

const groups: any = [
	{ owner: "Owner 1", name: "Group 1", description: "This is Group 1" },
	{ owner: "Owner 2", name: "Group 2", description: "This is Group 2" },
	{ owner: "Owner 3", name: "Group 3", description: "This is Group 3" }
];

const YourGroups = () => {
	return (
		<div className="container mx-auto p-4">
			<h2 className="text-xl font-bold mb-4">Your Groups</h2>

			{groups.map(
				(group: {
					owner: Key | null | undefined;
					name:
						| string
						| number
						| boolean
						| ReactElement<any, string | JSXElementConstructor<any>>
						| Iterable<ReactNode>
						| ReactPortal
						| null
						| undefined;
					description:
						| string
						| number
						| boolean
						| ReactElement<any, string | JSXElementConstructor<any>>
						| Iterable<ReactNode>
						| ReactPortal
						| null
						| undefined;
				}) => (
					<div
						key={group.owner}
						className="flex items-center justify-between mb-4 p-4 border border-gray-300 rounded"
					>
						<div>
							<h3 className="text-lg font-semibold">
								{group.name}
							</h3>
							<p className="text-gray-600">{group.description}</p>
						</div>
						<button
							className="flex items-center"
							style={{
								backgroundColor: "transparent",
								border: "none"
							}}
						>
							<div className="ml-3 flex items-center text-gray-500">
								<FaChevronRight />
							</div>
						</button>
					</div>
				)
			)}
		</div>
	);
};

export default YourGroups;
