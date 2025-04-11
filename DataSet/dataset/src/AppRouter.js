// AppRouter.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import TablePage from './TablePage';

const AppRouter = () => {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        {/* Боковая панель */}
        <Sidebar />
        {/* Основной контент */}
        <div style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/comments" element={<TablePage endpoint="comments" />} />
            <Route path="/posts" element={<TablePage endpoint="posts" />} />
            <Route path="/albums" element={<TablePage endpoint="albums" />} />
            <Route path="/todos" element={<TablePage endpoint="todos" />} />
            <Route path="/users" element={<TablePage endpoint="users" />} />
            <Route path="/" element={<TablePage endpoint="comments" />} /> {/* Главная страница */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default AppRouter;