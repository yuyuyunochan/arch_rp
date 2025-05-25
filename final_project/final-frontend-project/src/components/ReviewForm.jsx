import React, { useState } from "react";
import "../style/Profile.css"

const ReviewForm = ({ articleId, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    Recommendation: "",
    TechnicalMerit: "",
    Originality: "",
    PresentationQuality: "",
    AdditionalComments: "",
    ConfidentialCommentsToEditor: "",
    Status: "Under Revision",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

   const handleSubmit = (e) => {
    e.preventDefault();

    if (!articleId) {
      console.error('Article ID is missing in ReviewForm');
      return;
    }

    onSubmit(formData, articleId);
  };

  return (
    <div className="review-form-overlay">
      <div className="review-form">
        <h2>Написать рецензию</h2>
        <form onSubmit={handleSubmit}>
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

          <div className="Recommendation">
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

          <div className="Technical">
            <label>
              <strong >Техническая ценность:</strong>
            </label>
            <input
              type="text"
              name="TechnicalMerit"
              value={formData.TechnicalMerit}
              onChange={handleChange}
              required
            />
          </div>

          <div className="Origin">
            <label>
              <strong >Оригинальность:</strong>
            </label>
            <input
              type="text"
              name="Originality"
              value={formData.Originality}
              onChange={handleChange}
              required
            />
          </div>

          <div className="Quality">
            <label>
              <strong >Качество презентации:</strong>
            </label>
            <input
              type="text"
              name="PresentationQuality"
              value={formData.PresentationQuality}
              onChange={handleChange}
              required
            />
          </div>

          <div className="DopComm">
            <label>
              <strong >Дополнительные комментарии:</strong>
            </label>
            <textarea
              name="AdditionalComments"
              value={formData.AdditionalComments}
              onChange={handleChange}
            />
          </div>
          <div className="ConfComm">
            <label>
              <strong >Конфиденциальные комментарии редактору:</strong>
            </label>
            <textarea
              name="ConfidentialCommentsToEditor"
              value={formData.ConfidentialCommentsToEditor}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginTop: "16px" }}>
            <button className="but-review" type="submit">Отправить рецензию</button>
            <button className="but-review" type="button" onClick={onClose}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;