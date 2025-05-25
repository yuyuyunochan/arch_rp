import React, { useEffect, useState } from "react";
import axios from "axios";

const AvailableArticles = () => {
  const token = localStorage.getItem("token");
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchAvailableArticles = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/articles/available-for-review",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setArticles(response.data);
      } catch (error) {
        console.error(
          "Ошибка при загрузке доступных статей:",
          error.response?.data || error.message
        );
      }
    };

    fetchAvailableArticles();
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
      window.location.reload();
    } catch (error) {
      console.error(
        "Ошибка при назначении статьи:",
        error.response?.data || error.message
      );
      alert("Не удалось назначить статью.");
    }
  };

  return (
    <section className="Avaliable">
      <h3>Доступные статьи</h3>
      {articles.length === 0 ? (
        <p>Нет доступных статей для рецензии.</p>
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
              <button onClick={() => handleAssign(article.id)}>
                Взять на рецензию
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default AvailableArticles;
