import React, { useState, useEffect, useCallback } from 'react';
import HorizontalCarousel from './HorizontalCarousel'; // Adjust the import path as needed

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

  const loadMoreArticles = useCallback(() => {
    if (hasMore) {
      fetchArticles();
    }
  }, [fetchArticles, hasMore]);

  return (
    <div className="p-4 scrollbar-hide">
      <HorizontalCarousel>
        {articles.map((article, index) => (
          <a key={index} href={article.url} target="_blank" rel="noopener noreferrer" className="min-w-[300px] bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <img src={article.urlToImage} alt={article.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-l font-semibold">{article.title}</h2>
              <p className="text-gray-500">By {article.author}</p>
            </div>
          </a>
        ))}
      </HorizontalCarousel>
    </div>
  );
};

export default ExploreArticles;
