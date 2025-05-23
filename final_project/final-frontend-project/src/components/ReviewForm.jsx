import React, { useState } from "react";

const ReviewForm = ({ articleId, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    Recommendation: "",
    TechnicalMerit: "",
    Originality: "",
    PresentationQuality: "",
    AdditionalComments: "",
    ConfidentialCommentsToEditor: "",
    Status: "Under Revision", // Начальное значение по умолчанию
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Отправляем данные на сервер
  };

  return (
    <div className="review-form-overlay">
      <div className="review-form">
        <h2>Написать рецензию</h2>
        <form onSubmit={handleSubmit}>
          {/* Выпадающий список для выбора статуса */}
          <div>
            <label>
              <strong>Статус статьи:</strong>
            </label>
            <select
              name="Status"
              value={formData.Status}
              onChange={handleChange}
              required
            >
              <option value="Rejected">Отклонить</option>
              <option value="Under Revision">Отправить на доработку</option>
              <option value="Accepted">Принять к публикации</option>
            </select>
          </div>

          {/* Рекомендация */}
          <div>
            <label>
              <strong>Рекомендация:</strong>
            </label>
            <input
              type="text"
              name="Recommendation"
              value={formData.Recommendation}
              onChange={handleChange}
              required
            />
          </div>

          {/* Техническая ценность */}
          <div>
            <label>
              <strong>Техническая ценность:</strong>
            </label>
            <input
              type="text"
              name="TechnicalMerit"
              value={formData.TechnicalMerit}
              onChange={handleChange}
              required
            />
          </div>

          {/* Оригинальность */}
          <div>
            <label>
              <strong>Оригинальность:</strong>
            </label>
            <input
              type="text"
              name="Originality"
              value={formData.Originality}
              onChange={handleChange}
              required
            />
          </div>

          {/* Качество презентации */}
          <div>
            <label>
              <strong>Качество презентации:</strong>
            </label>
            <input
              type="text"
              name="PresentationQuality"
              value={formData.PresentationQuality}
              onChange={handleChange}
              required
            />
          </div>

          {/* Дополнительные комментарии */}
          <div>
            <label>
              <strong>Дополнительные комментарии:</strong>
            </label>
            <textarea
              name="AdditionalComments"
              value={formData.AdditionalComments}
              onChange={handleChange}
            />
          </div>

          {/* Конфиденциальные комментарии редактору */}
          <div>
            <label>
              <strong>Конфиденциальные комментарии редактору:</strong>
            </label>
            <textarea
              name="ConfidentialCommentsToEditor"
              value={formData.ConfidentialCommentsToEditor}
              onChange={handleChange}
            />
          </div>

          {/* Кнопки действий */}
          <div style={{ marginTop: "16px" }}>
            <button type="submit">Отправить рецензию</button>
            <button type="button" onClick={onClose}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;