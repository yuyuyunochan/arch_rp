import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import AdminPanel from './components/AdminPanel';
import Register from './components/Auth/Register';
import Profile from './components/Profile';
// import Home from './components/Home';
import "./App.css"

const App = () => {
    return (
        
        <Router >
            <Routes>
                {/* Домашняя страница
                <Route path="/" element={<Home />} /> */}

                {/* Страница входа */}
                <Route path="/login" element={<Login />} />

                {/* Страница регистрации */}
                <Route path="/register" element={<Register />} />

                {/* Страница профиля */}
                <Route path="/profile" element={<Profile />} />

                {/* Панель администратора */}
                <Route path="/admin" element={<AdminPanel />} />

                {/* Перенаправление на домашнюю страницу для всех остальных маршрутов */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
};

export default App;