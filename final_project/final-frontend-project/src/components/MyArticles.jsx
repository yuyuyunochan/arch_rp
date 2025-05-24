import React, { useEffect, useState } from "react";
import axios from "axios";
import ReviewList from "./ReviewList";

const MyArticles = () => {
  const token = localStorage.getItem("token");
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/articles/my-articles",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setArticles(response.data);
      } catch (error) {
        console.error(
          "Ошибка при загрузке статей:",
          error.response?.data || error.message
        );
      }
    };

    if (!token) {
      window.location.href = "/login";
    } else {
      fetchArticles();
    }
  }, [token]);

  return (
    <div className="my-articles">
      <h2>Мои статьи</h2>

      {/* Блок: Мои статьи */}
      <section>
        {articles.length === 0 ? (
          <p>Нет статей.</p>
        ) : (
            
          <ul>
            {articles.map((article) => (
              <li key={article.id} className="article-item">
                <h4>{article.title}</h4>
                <p>
                  <strong>Статус:</strong> {article.status}
                </p>
                <p>
                  <strong>Дата создания:</strong>{" "}
                  {new Date(article.createdAt).toLocaleDateString()}
                </p>
                {/* Отображаем рецензии для данной статьи */}
                <ReviewList articleId={article.id} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default MyArticles;
