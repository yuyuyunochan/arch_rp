import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SubmitArticleForm from './SubmitArticleForm'; // Импортируем форму

const Profile = () => {
    const token = localStorage.getItem('token');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке данных пользователя:', error.response?.data || error.message);
                alert('Не удалось загрузить данные пользователя.');
            }
        };

        if (!token) {
            window.location.href = '/login';
        } else {
            fetchUserData();
        }
    }, [token]);

    if (!user) {
        return <p>Загрузка...</p>;
    }

    return (
        <div className="profile-container">
            <h1>Личный кабинет</h1>
            <div className="profile-info">
                <p><strong>Имя пользователя:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Роль:</strong> {user.role}</p>
            </div>

            {user.role === 'Author' && (
                <div>
                    <h2>Добавить статью</h2>
                    <SubmitArticleForm /> {/* Вставляем форму здесь */}
                </div>
            )}
        </div>
    );
};

export default Profile;