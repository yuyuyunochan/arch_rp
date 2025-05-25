import React, { useState } from "react";
import axios from "axios";
import "../../style/Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const handleLogout = () => {
    window.location.href = "/login";
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
      alert("Имя пользователя может содержать только буквы и цифры.");
      return;
    }

    console.log("Отправляемые данные:", formData);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        formData
      );
      console.log(response.data);
      window.location.href = "/login";
    } catch (error) {
      console.error(
        "Ошибка при регистрации:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="register-container">
      <h1>Регистрация</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="Username" htmlFor="username">
            Имя пользователя
          </label>
          <p><input
            type="text"
            id="username"
            name="username"
            placeholder="Введите имя пользователя"
            value={formData.username}
            onChange={handleInputChange}
            required
          /></p>
        </div>
        <div>
          <label className="Email" htmlFor="email">Email</label>
         <p> <input
            type="email"
            id="email"
            name="email"
            placeholder="Введите email"
            value={formData.email}
            onChange={handleInputChange}
            required
          /></p>
        </div>
        <div>
          <label className="Password" htmlFor="password">Пароль</label>
          <p><input
            type="password"
            id="password"
            name="password"
            placeholder="Введите пароль"
            value={formData.password}
            onChange={handleInputChange}
            required
          /></p>
        </div>
        <div>
          <label className="Role" htmlFor="role">Роль</label>
          <p><select
            className="SelectRole"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            required
          >
            <option value="Author">Автор</option>
            <option value="Reviewer">Рецензент</option>
          </select></p>
        </div>
        <button className="button" type="submit">Зарегистрироваться</button>
        <p><button className="button" onClick={handleLogout}>На страницу входа</button></p>
      </form>
    </div>
  );
};

export default Register;
