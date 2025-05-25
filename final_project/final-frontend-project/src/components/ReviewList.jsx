import React, { useEffect, useState } from "react";
import axios from "axios";

const ReviewList = ({ articleId }) => {
  const token = localStorage.getItem("token");
  const [reviews, setReviews] = useState({});

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/articles/reviews/${articleId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Ответ от сервера:", response.data);
        setReviews(response.data);
      } catch (error) {
        console.error(
          "Ошибка при загрузке рецензий:",
          error.response?.data || error.message
        );
      }
    };

    if (articleId) {
      fetchReviews();
    }
  }, [articleId, token]);
  return (
    <div>
      <h2>Рецензии на статью</h2>
      {reviews ? (
        <div>
          <li>
            <p>
              Дата создания: {new Date(reviews.createdAt).toLocaleDateString()}
            </p>
            <p>Рецензент: {reviews.reviewerName}</p>
            <p>Рекомендация: {reviews.recommendation || "Не указана"}</p>
            <p>Техническая ценность: {reviews.technicalMerit || "Не указана"}</p>
            <p>Оригинальность: {reviews.originality || "Не указана"}</p>
            <p>
              Качество презентации: {reviews.presentationQuality || "Не указано"}
            </p>
            <p>
              Дополнительные комментарии:{" "}
              {reviews.additionalComments || "Отсутствуют"}
            </p>
            <p>
              Конфиденциальные комментарии редактору:{" "}
              {reviews.confidentialCommentsToEditor || "Отсутствуют"}
            </p>
          </li>
        </div>
      ) : (
        <p>Нет рецензий</p>
      )}
    </div>
  );
};
export default ReviewList;
