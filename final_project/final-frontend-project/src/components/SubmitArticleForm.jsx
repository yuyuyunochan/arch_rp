import React, { useState } from "react";
import axios from "axios";
import "./SubmitArticleForm"

const SubmitArticleForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    file: null,
    content: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("file", formData.file);
      formDataToSend.append("content", formData.content);

      // Отправляем данные на сервер
      const response = await axios.post(
        "http://localhost:5000/api/articles",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(response.data);
      alert("Статья успешно отправлена на рецензию");
    } catch (error) {
      console.error(
        "Ошибка при отправке статьи:",
        error.response?.data || error.message
      );
      alert("Не удалось отправить статью.");
    }
  };

  return (
    <div className="submit-article-form">
      <h2>Отправить статью на рецензию</h2>
      <p>Заполните поля ниже, чтобы отправить свою статью на рецензию.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <h3>Заголовок статьи</h3>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Введите заголовок статьи"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Загрузка файла */}
        <div>
          <h3 htmlFor="file">Выберите файл статьи (PDF, DOCX)</h3>
          <input
            type="file"
            id="file"
            name="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            required
          />
        </div>

        {/* Редактор содержимого */}
        <div>
                    <h3 htmlFor="content">Содержание статьи</h3>
                    <textarea
                        id="content"
                        name="content"
                        placeholder="Напишите содержание статьи..."
                        value={formData.content}
                        onChange={handleInputChange}
                    ></textarea>
                </div>
                <button className="to-review" type="submit">Отправить на рецензию</button>
      
         </form>

    </div>
  );
};

export default SubmitArticleForm;
