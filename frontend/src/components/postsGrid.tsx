import React from 'react';
import { Link } from 'react-router-dom';

interface PostsGridProps {
  posts: { id: number; imageUrl: string; description: string }[];
}

const PostsGrid: React.FC<PostsGridProps> = ({ posts }) => {
  return (
    <div className="container mx-auto p-4">
      {/* <h2 className="text-xl font-bold mb-4">Posts</h2> */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map(post => (
          <div key={post.id} className="w-full overflow-hidden rounded-md">
            <Link to={`/post/${post.id}`}>
              <img
                src={post.imageUrl}
                alt={`Post ${post.id}`}
                className="w-full h-full object-cover"
                style={{ height: '150px' }}
              />
              <div className="mt-2 text-center">{post.description}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsGrid;
