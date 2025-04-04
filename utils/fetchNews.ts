import axios from 'axios';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
}

export const fetchNewsData = async (): Promise<NewsItem[]> => {
  try {
    const response = await axios.get(
      `https://newsdata.io/api/1/news?apikey=${process.env.NEXT_PUBLIC_NEWSDATA_API_KEY}&q=cryptocurrency&language=en`
    );

    return response.data.results.map((item: any) => ({
      id: item.article_id,
      title: item.title,
      description: item.description,
      url: item.link,
      source: item.source_id,
      publishedAt: item.pubDate,
    }));
  } catch (error) {
    console.error('Error fetching news data:', error);
    throw new Error('Failed to fetch news data');
  }
}; 