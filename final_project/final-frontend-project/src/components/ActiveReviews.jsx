import React, { useEffect, useState } from "react";
import axios from "axios";
import ReviewForm from "./ReviewForm";

const ActiveReviews = () => {
  const token = localStorage.getItem("token");
  const [articles, setArticles] = useState([]);
  const [selectedArticleId, setSelectedArticleId] = useState(null);

  useEffect(() => {
    const fetchAssignedArticles = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/articles/assigned",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.data.activeArticles) {
          throw new Error("Incorrect data format");
        }

        setArticles(response.data.activeArticles);
      } catch (error) {
        console.error(
          "Ошибка при загрузке назначенных статей:",
          error.response?.data || error.message
        );
      }
    };

    fetchAssignedArticles();
  }, [token]);

  const handleSubmitReview = async (reviewData) => {
    try {
      await axios.post(
        `http://localhost:5000/api/articles/${selectedArticleId}/review`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Рецензия успешно отправлена.");
      setSelectedArticleId(null);
      window.location.reload();
    } catch (error) {
      console.error(
        "Ошибка при отправке рецензии:",
        error.response?.data || error.message
      );
      alert("Не удалось отправить рецензию.");
    }
  };

  return (
    <section className="active-articles">
      <h3>Активные рецензии</h3>
      {articles.length === 0 ? (
        <p>Нет активных рецензий.</p>
      ) : (
        <ul>
          {articles.map((article) => (
            <li key={article.id} className="article-item">
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
              <button onClick={() => setSelectedArticleId(article.id)}>
                Написать рецензию
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedArticleId && (
        <ReviewForm
          articleId={selectedArticleId}
          onSubmit={handleSubmitReview}
          onClose={() => setSelectedArticleId(null)}
        />
      )}
    </section>
  );
};

export default ActiveReviews;
