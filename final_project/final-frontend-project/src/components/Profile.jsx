import React, { useEffect, useState } from "react";
import axios from "axios";
import MyArticles from "./MyArticles";
import ReviewerDashboard from "./ReviewerDashboard";
import SubmitArticleForm from "./SubmitArticleForm"

const Profile = () => {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error(
          "Ошибка при загрузке данных пользователя:",
          error.response?.data || error.message
        );
        alert("Не удалось загрузить данные пользователя.");
      }
    };

    if (!token) {
      window.location.href = "/login";
    } else {
      fetchUserData();
    }
  }, [token]);

  const handleLogout = () => {
    // Удаляем токен из localStorage
    localStorage.removeItem("token");

    // Перенаправляем на страницу входа
    window.location.href = "/login";
  };

  if (!user) {
    return <p>Загрузка...</p>;
  }

  return (
    <div className="profile-container">
      <h1>Личный кабинет</h1>
      <div className="profile-info">
        <p>
          <strong>Имя пользователя:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Роль:</strong> {user.role}
        </p>
        {user.isBlocked && (
          <p style={{ color: "red" }}>Ваш аккаунт заблокирован.</p>
        )}
      </div>
      {!user.isBlocked && user.role === "Author" && (
        <div>
          <h2>Добавить статью</h2>
          <SubmitArticleForm />
        </div>
      )}
      {user.role === "Author" && !user.isBlocked && <MyArticles />}
      {user.role === "Reviewer" && !user.isBlocked && <ReviewerDashboard />}

      {/* Список статей
      {!user.isBlocked && user.role === "Author" && <MyArticles />} */}

      <button onClick={handleLogout}>Выйти</button>
    </div>
  );
};

export default Profile;
