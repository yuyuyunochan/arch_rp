import React, { useState } from "react";
import axios from "axios";
import "../style/Admin.css"

const CreateUserForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "Author",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
      // alert("Имя пользователя может содержать только буквы и цифры.");
      return;
    }

    console.log("Отправляемые данные:", formData); 

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/create-user",
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log(response.data);
      console.log("Пользователь успешно создан.");
    } catch (error) {
      console.error(
        "Ошибка при создании пользователя:",
        error.response?.data || error.message
      );
      alert("Не удалось создать пользователя.");
    }
  };

  return (
    <div className="create-user-form">
      <h2>Создать нового пользователя</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="New-Username" htmlFor="username">Имя пользователя</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Введите имя пользователя"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label className="New-Email" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Введите email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label className="New-Password" htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Введите пароль"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="role">Роль</label>
          <select className="New-Role"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            required
          >
            <option value="Author">Автор</option>
            <option value="Reviewer">Рецензент</option>
          </select>
        </div>
        <button type="submit">Создать пользователя</button>
      </form>
    </div>
  );
};

export default CreateUserForm;
