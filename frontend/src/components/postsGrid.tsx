import React from "react";
interface PostsGridProps {
	posts: string[];
}

const PostsGrid: React.FC<PostsGridProps> = ({ posts }) => {
	const rows: React.ReactNode[] = [];

	const numRows = Math.ceil(posts.length / 3);

	for (let i = 0; i < numRows; i++) {
		rows.push(
			<div className="flex mb-4" key={i}>
				{posts.slice(i * 3, i * 3 + 3).map((post, index) => (
					<div key={index} className="w-1/3 p-2">
						<div className="grid-container">
							<img
								src="https://via.placeholder.com/150"
								alt="group"
								className="group-image w-full h-auto"
							/>
							<div className="mt-2">{post}</div>
						</div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div
			className="container mx-auto overflow-y-auto"
			style={{ maxHeight: "400px" }}
		>
			{rows}
		</div>
	);
};

export default PostsGrid;
