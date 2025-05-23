import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import ReviewForm from "./ReviewForm"; // Импортируем форму рецензии

const ReviewerDashboard = () => {
  const token = localStorage.getItem("token");
  const [availableArticles, setAvailableArticles] = useState([]);
  const [activeArticles, setActiveArticles] = useState([]);
  const [archivedArticles, setArchivedArticles] = useState([]);
  const [selectedArticleId, setSelectedArticleId] = useState(null); // ID выбранной статьи для рецензии

  // Загрузка доступных статей
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
  // const handleUpdateStatus = async (id, status) => {
  //   try {
  //     await axios.put(
  //       `http://localhost:5000/api/articles/${id}/update-status`,
  //       { status }, // Отправляем объект
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json", // Явно указываем тип данных
  //         },
  //       }
  //     );
  //     alert("Статус статьи успешно обновлен.");
  //     fetchAssignedArticles(); // Обновляем список статей
  //   } catch (error) {
  //     console.error(
  //       "Ошибка при обновлении статуса:",
  //       error.response?.data || error.message
  //     );
  //     alert("Не удалось обновить статус статьи.");
  //   }
  // };

  // Загрузка назначенных статей
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

  // Назначить статью себе
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

  // Отправка рецензии
const handleSubmitReview = async (reviewData) => {
  try {
    // Логируем отправляемые данные
    console.log("Отправляемые данные на сервер:", reviewData);

    // Отправляем запрос
    await axios.post(
      `http://localhost:5000/api/articles/${selectedArticleId}/review`,
      reviewData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Указываем тип данных
        },
      }
    );

    alert("Рецензия успешно отправлена.");
    setSelectedArticleId(null); // Скрываем форму
    fetchAssignedArticles(); // Обновляем список статей
  } catch (error) {
    console.error(
      "Ошибка при отправке рецензии:",
      error.response?.data || error.message
    );
    alert("Не удалось отправить рецензию.");
  }
};
  // Подключение данных после авторизации
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

      {/* Блок: Доступные статьи */}
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

      {/* Блок: Активные статьи */}
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
                {/* Кнопки изменения статуса */}
                {/* <div>
                  <button
                    onClick={() =>
                      handleUpdateStatus(article.id, "Under Revision")
                    }
                  >
                    Отправить на доработку
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(article.id, "Accepted")}
                  >
                    Принять к публикации
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(article.id, "Rejected")}
                  >
                    Отклонить
                  </button>
                </div> */}
                {/* Кнопка для открытия формы рецензии */}
                <button onClick={() => setSelectedArticleId(article.id)}>
                  Написать рецензию
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Форма рецензии */}
      {selectedArticleId && (
        <ReviewForm
          articleId={selectedArticleId}
          onSubmit={handleSubmitReview}
          onClose={() => setSelectedArticleId(null)} // Закрыть форму
        />
      )}

      {/* Блок: Архивные статьи */}
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
