import React, { useEffect, useState } from "react";
import axios from "axios";

const ArchivedReviews = () => {
  const token = localStorage.getItem("token");
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchAssignedArticles = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/articles/assigned",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.data.archivedArticles) {
          throw new Error("Incorrect data format");
        }

        setArticles(response.data.archivedArticles);
      } catch (error) {
        console.error(
          "Ошибка при загрузке архивных рецензий:",
          error.response?.data || error.message
        );
      }
    };

    fetchAssignedArticles();
  }, [token]);

  return (
    <section className="Archive">
      <h3>Архив рецензий</h3>
      {articles.length === 0 ? (
        <p>Нет архивных рецензий.</p>
      ) : (
        <ul>
          {articles.map((article) => (
            <li key={article.id} className="archived-review-item">
              <div className="review-card">
                <h4>{article.title}</h4>
                <p>
                  <strong>Автор:</strong> {article.author || "Неизвестный автор"}
                </p>
                <p>
                  <strong>Статус:</strong> {article.status}
                </p>
                <p>
                  <strong>Дата создания:</strong>{" "}
                  {new Date(article.createdAt).toLocaleDateString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ArchivedReviews;