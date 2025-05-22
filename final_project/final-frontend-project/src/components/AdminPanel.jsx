import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [admin, setAdmin] = useState([]);
  const [articles, setArticles] = useState([]);

  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Загрузка списка пользователей
        const usersResponse = await axios.get(
          "http://localhost:5000/api/users/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(usersResponse.data);

        // Загрузка данных администратора
        const adminResponse = await axios.get(
          "http://localhost:5000/api/users/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAdmin(adminResponse.data);

        // Загрузка списка статей
        const articlesResponse = await axios.get(
          "http://localhost:5000/api/articles",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setArticles(articlesResponse.data);
      } catch (error) {
        console.error(
          "Ошибка при загрузке данных:",
          error.response?.data || error.message
        );
        alert("Не удалось загрузить данные.");
      }
    };

    if (!token) {
      window.location.href = "/login";
    } else {
      fetchData();
    }
  }, [token]);

  // Блокировка пользователя
  const blockUser = async (userId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/admin/block-user/${userId}/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(
        users.map((user) =>
          user.id === userId
            ? { ...user, lockoutEnd: new Date().toISOString() }
            : user
        )
      );
      alert("Пользователь заблокирован.");
    } catch (error) {
      console.error(
        "Ошибка при блокировке пользователя:",
        error.response?.data || error.message
      );
      alert("Не удалось заблокировать пользователя.");
    }
  };
  const deleteArticle = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить эту статью?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArticles(articles.filter((article) => article.id !== id));
      alert("Статья успешно удалена.");
    } catch (error) {
      console.error(
        "Ошибка при удалении статьи:",
        error.response?.data || error.message
      );
      alert("Не удалось удалить статью.");
    }
  };
  const handleLogout = () => {
    // Удаляем токен из localStorage
    localStorage.removeItem("token");

    // Перенаправляем на страницу входа
    window.location.href = "/login";
  };

  // Разблокировка пользователя
  const unblockUser = async (userId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/admin/unblock-user/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, lockoutEnd: null } : user
        )
      );
      alert("Пользователь разблокирован.");
    } catch (error) {
      console.error(
        "Ошибка при разблокировке пользователя:",
        error.response?.data || error.message
      );
      alert("Не удалось разблокировать пользователя.");
    }
  };

  // Удаление пользователя
  const deleteUser = async (userId) => {
    if (!window.confirm("Вы уверены, что хотите удалить этого пользователя?"))
      return;

    try {
      await axios.delete(
        `http://localhost:5000/api/admin/delete-user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(users.filter((user) => user.id !== userId));
      alert("Пользователь успешно удален.");
    } catch (error) {
      console.error(
        "Ошибка при удалении пользователя:",
        error.response?.data || error.message
      );
      alert("Не удалось удалить пользователя.");
    }
  };

  // Создание нового пользователя
  const createUser = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      userName: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
    };

    try {
      await axios.post("http://localhost:5000/api/admin/create-user", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Пользователь успешно создан.");
      window.location.reload(); // Обновляем страницу
    } catch (error) {
      console.error(
        "Ошибка при создании пользователя:",
        error.response?.data || error.message
      );
      alert("Не удалось создать пользователя.");
    }
  };

  return (
    <div className="admin-panel">
      <h1>Панель администратора</h1>

      {/* Информация о текущем администраторе */}
      <div className="profile-info">
        <p>
          <strong>Имя пользователя:</strong> {admin.userName}
        </p>
        <p>
          <strong>Email:</strong> {admin.email}
        </p>
        <p>
          <strong>Роль:</strong> {admin.role}
        </p>
      </div>

      {/* Форма создания нового пользователя */}
      <form onSubmit={createUser} className="create-user-form">
        <h3>Создать нового пользователя</h3>
        <input
          type="text"
          name="username"
          placeholder="Имя пользователя"
          required
        />
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Пароль" required />
        <select name="role" required>
          <option value="Author">Автор</option>
          <option value="Reviewer">Рецензент</option>
        </select>
        <button type="submit">Создать</button>
      </form>

      {/* Таблица пользователей */}
      <h2>Управление пользователями</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя пользователя</th>
            <th>Email</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.userName}</td>
              <td>{user.email}</td>
              <td>{user.lockoutEnd ? "Заблокирован" : "Активен"}</td>
              <td>
                {user.lockoutEnd ? (
                  <button onClick={() => unblockUser(user.id)}>
                    Разблокировать
                  </button>
                ) : (
                  <button onClick={() => blockUser(user.id)}>
                    Заблокировать
                  </button>
                )}
                <button onClick={() => deleteUser(user.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Таблица статей */}
      <h2>Управление статьями</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Статус</th>
            <th>Автор</th>
            <th>Рецензент</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.id}>
              <td>{article.id}</td>
              <td>{article.title}</td>
              <td>{article.status}</td>
              <td>{article.authorName}</td>
              <td>
                {article.reviewerName}
              </td>
              <td>
                <button onClick={() => deleteArticle(article.id)}>
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
       <button onClick={handleLogout}>Выйти</button>
    </div>
  );
};

export default AdminPanel;
