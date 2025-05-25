import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import ReviewForm from "./ReviewForm";

const ReviewerDashboard = () => {
  const token = localStorage.getItem("token");
  const [availableArticles, setAvailableArticles] = useState([]);
  const [activeArticles, setActiveArticles] = useState([]);
  const [archivedArticles, setArchivedArticles] = useState([]);
  const [selectedArticleId, setSelectedArticleId] = useState(null);

  const fetchAvailableArticles = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/articles/available-for-review",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAvailableArticles(response.data);
    } catch (error) {
      console.error(
        "Ошибка при загрузке доступных статей:",
        error.response?.data || error.message
      );
    }
  }, [token]);
  const fetchAssignedArticles = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/articles/assigned",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.data.activeArticles || !response.data.archivedArticles) {
        throw new Error("Incorrect data format");
      }

      setActiveArticles(response.data.activeArticles);
      setArchivedArticles(response.data.archivedArticles);
    } catch (error) {
      console.error(
        "Ошибка при загрузке назначенных статей:",
        error.response?.data || error.message
      );
    }
  }, [token]);

  const handleAssign = async (id) => {
    try {
      await axios.post(
        `http://localhost:5000/api/articles/${id}/assign-to-reviewer`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Статья успешно назначена вам.");
      fetchAvailableArticles();
      fetchAssignedArticles();
    } catch (error) {
      console.error(
        "Ошибка при назначении статьи:",
        error.response?.data || error.message
      );
      alert("Не удалось назначить статью.");
    }
  };

const handleSubmitReview = async (reviewData) => {
  try {
    console.log("Отправляемые данные на сервер:", reviewData);

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
    fetchAssignedArticles();
  } catch (error) {
    console.error(
      "Ошибка при отправке рецензии:",
      error.response?.data || error.message
    );
    alert("Не удалось отправить рецензию.");
  }
};
  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    } else {
      fetchAvailableArticles();
      fetchAssignedArticles();
    }
  }, [token, fetchAvailableArticles, fetchAssignedArticles]);

  return (
    <div className="reviewer-dashboard">
      <h2>Панель рецензента</h2>
      <section>
        <h3>Доступные статьи</h3>
        {availableArticles.length === 0 ? (
          <p>Нет доступных статей для рецензии.</p>
        ) : (
          <ul>
            {availableArticles.map((article) => (
              <li key={article.id} className="article-item">
                <h4>{article.title}</h4>
                <p>
                  <strong>Автор:</strong>{" "}
                  {article.author || "Неизвестный автор"}
                </p>
                <p>
                  <strong>Статус:</strong> {article.status}
                </p>
                <p>
                  <strong>Дата создания:</strong>{" "}
                  {new Date(article.createdAt).toLocaleDateString()}
                </p>
                <button onClick={() => handleAssign(article.id)}>
                  Взять на рецензию
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h3>Активные статьи</h3>
        {activeArticles.length === 0 ? (
          <p>Нет активных статей.</p>
        ) : (
          <ul>
            {activeArticles.map((article) => (
              <li key={article.id} className="article-item">
                <h4>{article.title}</h4>
                <p>
                  <strong>Автор:</strong>{" "}
                  {article.author || "Неизвестный автор"}
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
      </section>
      {selectedArticleId && (
        <ReviewForm
          articleId={selectedArticleId}
          onSubmit={handleSubmitReview}
          onClose={() => setSelectedArticleId(null)}
        />
      )}
      <section>
        <h3>Архивные статьи</h3>
        {archivedArticles.length === 0 ? (
          <p>Нет архивных статей.</p>
        ) : (
          <ul>
            {archivedArticles.map((article) => (
              <li key={article.id} className="article-item">
                <h4>{article.title}</h4>
                <p>
                  <strong>Автор:</strong>{" "}
                  {article.author || "Неизвестный автор"}
                </p>
                <p>
                  <strong>Статус:</strong> {article.status}
                </p>
                <p>
                  <strong>Дата создания:</strong>{" "}
                  {new Date(article.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default ReviewerDashboard;
