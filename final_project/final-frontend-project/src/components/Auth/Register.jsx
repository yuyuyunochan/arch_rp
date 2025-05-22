import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'Author', // По умолчанию выбрана роль Author
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/users/register', formData);
            console.log(response.data);
            window.location.href = "/login";
        } catch (error) {
            console.error('Ошибка при регистрации:', error.response?.data || error.message);
            alert('Не удалось зарегистрироваться.');
        }
    };

    return (
        <div className="register-container">
            <h2>Регистрация</h2>
            <form onSubmit={handleSubmit}>
                {/* Поле для имени пользователя */}
                <div>
                    <label htmlFor="username">Имя пользователя</label>
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

                {/* Поле для email */}
                <div>
                    <label htmlFor="email">Email</label>
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

                {/* Поле для пароля */}
                <div>
                    <label htmlFor="password">Пароль</label>
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

                {/* Выбор роли */}
                <div>
                    <label htmlFor="role">Роль</label>
                    <select
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

                {/* Кнопка регистрации */}
                <button type="submit">Зарегистрироваться</button>
            </form>
        </div>
    );
};

export default Register;