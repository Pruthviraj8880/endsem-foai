import axios from "axios";
import { useEffect, useState } from "react";

export default function NewsSection({ setNews }) {

  const [articles, setArticles] = useState([]);

  async function fetchNews() {

    try {

      const res = await axios.get(
        `https://newsapi.org/v2/top-headlines?country=us&pageSize=10&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`
      );

      setArticles(res.data.articles);

      setNews(res.data.articles);

      localStorage.setItem(
        "news",
        JSON.stringify(res.data.articles)
      );

    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {

    const saved = localStorage.getItem("news");

    if (saved) {
      setArticles(JSON.parse(saved));
    } else {
      fetchNews();
    }

  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-4 mb-5">

      {articles.map((article, index) => (

        <div
          key={index}
          className="bg-white p-4 rounded shadow"
        >

          <img
            src={article.urlToImage}
            className="h-40 w-full object-cover"
          />

          <h2 className="font-bold mt-2">
            {article.title}
          </h2>

          <p>{article.source.name}</p>

          <a
            href={article.url}
            target="_blank"
            className="text-blue-500"
          >
            Read More
          </a>

        </div>
      ))}
    </div>
  );
}