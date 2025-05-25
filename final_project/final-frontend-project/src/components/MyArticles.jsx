import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import ReviewList from "./ReviewList"; 
import "../style/Profile.css";

const MyArticles = () => {
  const token = localStorage.getItem("token");
  const [articles, setArticles] = useState([]);

  const fetchArticles = useCallback(async () => {
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
  }, [token]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleResubmitArticle = async (articleId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Токен отсутствует.");
        throw new Error("Токен отсутствует.");
      }

      const response = await axios.put(
        `http://localhost:5000/api/articles/${articleId}/update-status`,
        { status: "Not Reviewed" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(response.data);
      alert("Статья успешно отправлена на повторное рассмотрение.");
      fetchArticles(); 
    } catch (error) {
      console.error(
        "Ошибка при повторной отправке статьи:",
        error.response?.data || error.message
      );
      alert(`Ошибка при повторной отправке статьи: ${error.message}`);
    }
  };

  return (
    <div className="my-articles">
      <h2>Мои статьи</h2>
      <section>
        {articles.length === 0 ? (
          <p>Нет статей.</p>
        ) : (
          <ul>
            {articles.map((article) => (
              <li key={article.id} className="article-item">
                <div className="article-card">
                  <h4>{article.title}</h4>
                  <p>
                    <strong>Дата создания:</strong>{" "}
                    {new Date(article.createdAt).toLocaleDateString()}
                  </p>
                  {article.status === "Under Revision" && (
                    <button onClick={() => handleResubmitArticle(article.id)}>
                      Отправить на повторное рассмотрение
                    </button>
                  )}
                </div>
                <div className="review-section">
                  <ReviewList articleId={article.id} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default MyArticles;
