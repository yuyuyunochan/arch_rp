// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={{ width: '200px', background: '#f4f4f4', padding: '20px' }}>
      <h3>Навигация</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li><Link to="/comments">Comments</Link></li>
        <li><Link to="/posts">Posts</Link></li>
        <li><Link to="/albums">Albums</Link></li>
        <li><Link to="/todos">Todos</Link></li>
        <li><Link to="/users">Users</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;