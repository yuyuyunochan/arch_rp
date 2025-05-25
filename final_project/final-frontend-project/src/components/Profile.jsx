import React, { useEffect, useState } from "react";
import axios from "axios";
import AvailableArticles from "./AvailableArticles"; // Компонент доступных статей
import ActiveReviews from "./ActiveReviews"; // Компонент активных рецензий
import ArchivedReviews from "./ArchivedReviews"; // Компонент архивных рецензий
import MyArticles from "./MyArticles"; // Компонент моих статей
import SubmitArticleForm from "./SubmitArticleForm"; // Форма отправки статьи
import "../style/Profile.css";

const Profile = () => {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("profile"); // Активная секция по умолчанию - "profile"

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
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (!user) {
    return <p>Загрузка...</p>;
  }

  const sections = [
    { name: "Профиль", key: "profile" },
    ...(user.role === "Reviewer"
      ? [
          { name: "Доступные статьи", key: "available-articles" },
          { name: "Активные рецензии", key: "active-reviews" },
          { name: "Архив рецензий", key: "archived-reviews" },
        ]
      : []),
    ...(user.role === "Author"
      ? [
          { name: "Мои статьи", key: "my-articles" },
          { name: "Отправить статью", key: "submit-article" },
        ]
      : []),
  ];

  return (
    <div className="profile-container">
      {/* Боковая панель */}
      <aside className="sidebar">
        <nav>
          <ul>
            {sections.map((section) => (
              <li
                key={section.key}
                className={activeSection === section.key ? "active" : ""}
                onClick={() => setActiveSection(section.key)}
              >
                {section.name}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Основное содержимое */}
      <main className="main-content">
        {activeSection === "profile" && (
          <div className="profile-info">
            <h1>{user.username}</h1>
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
        )}
        {activeSection === "available-articles" && user.role === "Reviewer" && (
          <AvailableArticles />
        )}
        {activeSection === "active-reviews" && user.role === "Reviewer" && (
          <ActiveReviews />
        )}
        {activeSection === "archived-reviews" && user.role === "Reviewer" && (
          <ArchivedReviews />
        )}
        {activeSection === "my-articles" && user.role === "Author" && (
          <MyArticles />
        )}
        {activeSection === "submit-article" && user.role === "Author" && (
          <SubmitArticleForm />
        )}
      </main>

      <button className="logout" onClick={handleLogout}>Выйти</button>
    </div>
  );
};

export default Profile;
