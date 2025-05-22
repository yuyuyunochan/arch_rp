// Login.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./Login.css"

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:5000/api/users/login', formData);
        console.log(response.data);
        localStorage.setItem('token', response.data.token); // Сохраняем токен

        // Получаем данные текущего пользователя
        const userResponse = await axios.get('http://localhost:5000/api/users/me', {
            headers: { Authorization: `Bearer ${response.data.token}` }
        });

        // Проверяем роль пользователя
        if (userResponse.data.role === 'Admin') {
            window.location.href = '/admin'; // Перенаправляем администратора
        } else {
            window.location.href = '/profile'; // Перенаправляем обычного пользователя
        }
    } catch (error) {
        console.error(error.response?.data || error.message);
        alert('Login failed');
    }
};

    return (
        <div className="container">
            <h1>Login to L1na & k0rses site</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <p>Username</p>
                    <input className="username" type="text" name="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <p>Password</p>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <button type="submit">Login</button>
                  <p>
                Нет аккаунта?{' '}
                <Link to="/register" className="register-link">
                    Зарегистрироваться
                </Link>
            </p>
            </form>
        </div>
    );
};

export default Login;