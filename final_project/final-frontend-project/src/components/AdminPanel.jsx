import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [admin, setAdmin] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(response.data);
        const response1 = await axios.get(
          "http://localhost:5000/api/users/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAdmin(response1.data);
      } catch (error) {
        console.error(
          (window.location.href = "/profile"), // Перенаправляем обычного пользователя
          "Ошибка при загрузке пользователей:",
          error.response?.data || error.message || error.response1.data
        );
        // alert("Не удалось загрузить пользователей.");
      }
    };

    if (!token) {
      window.location.href = "/login";
    } else {
      fetchUsers();
    }
  }, [token]);

  const blockUser = async (userId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/users/${userId}/block`,
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

  const unblockUser = async (userId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/users/${userId}/unblock`,
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

  return (
    <div className="admin-panel">
      <h1>Панель администратора</h1>
      <div className="profile-info">
        <p>
          <strong>Имя пользователя:</strong> {admin.username}
        </p>
        <p>
          <strong>Email:</strong> {admin.email}
        </p>
        <p>
          <strong>Роль:</strong> {admin.role}
        </p>
      </div>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
