import React from 'react';
import { format } from 'date-fns';

interface NewsCardProps {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  description,
  url,
  source,
  publishedAt,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>{source}</span>
        <span>{format(new Date(publishedAt), 'PP')}</span>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block text-blue-500 hover:text-blue-600 transition-colors"
      >
        Read more →
      </a>
    </div>
  );
};

export default NewsCard; 