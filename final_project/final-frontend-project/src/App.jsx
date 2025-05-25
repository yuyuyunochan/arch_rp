import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import AdminPanel from './components/AdminPanel';
import Register from './components/Auth/Register';
import Profile from './components/Profile';
// import Home from './components/Home';
import "./style/App.css"

const App = () => {
    return (
        
        <Router >
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
};

export default App;