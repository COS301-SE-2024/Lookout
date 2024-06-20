import React, { useState, useEffect, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

interface Article {
  title: string;
  author: string;
  description: string;
  url: string;
  urlToImage: string;
}

const ExploreArticles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10; // Number of articles per page

  const fetchArticles = useCallback(() => {
    const apiKey = process.env.REACT_APP_API_KEY;
    const apiUrl = `https://newsapi.org/v2/everything?q=wildlife&pageSize=${pageSize}&page=${page}&apiKey=${apiKey}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.articles) {
          setArticles(prevArticles => {
            const newArticles: Article[] = data.articles;
            return [...prevArticles, ...newArticles];
          });
          setHasMore(data.articles.length > 0);
          setPage(prevPage => prevPage + 1); // Use function form to ensure correct state update
        }
      })
      .catch(error => console.error('Error fetching articles:', error));
  }, [page, pageSize]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]); // Include fetchArticles in the dependency array

  return (
    <div className="container mx-auto p-4">
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchArticles}
        hasMore={hasMore}
        loader={<h4>Loading articles...</h4>}
        endMessage={<p style={{ textAlign: 'center' }}>No more articles to show</p>}
      >
        <div className="space-y-4">
          {articles.map((article, index) => (
            <a key={index} href={article.url} target="_blank" rel="noopener noreferrer" className="block border rounded-lg shadow-sm overflow-hidden hover:shadow-md">
              <div className="p-4">
                <div className="text-lg font-semibold">{article.title}</div>
                <div className="text-gray-500">By {article.author}</div>
                <img src={article.urlToImage} alt={article.title} className="w-full h-48 object-cover mt-2 rounded-lg" />
                <p className="text-sm text-gray-600 mt-2">{article.description}</p>
              </div>
            </a>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default ExploreArticles;
