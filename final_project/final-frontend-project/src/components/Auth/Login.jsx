import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "../../style/Login.css"

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
        localStorage.setItem('token', response.data.token);

        const userResponse = await axios.get('http://localhost:5000/api/users/me', {
            headers: { Authorization: `Bearer ${response.data.token}` }
        });

        if (userResponse.data.role === 'Admin') {
            window.location.href = '/admin';
        } else {
            window.location.href = '/profile';
        }
    } catch (error) {
        console.error(error.response?.data || error.message);
        alert('Login failed');
    }
};

    return (
        <div className="container">
            <h1 className='LoginWelcome'>Добро пожаловать на сайт прозрачных рецензий</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <p>Имя пользователя</p>
                    <input className="username" type="text" name="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <p>Пароль</p>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <button type="submit">Войти</button>
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