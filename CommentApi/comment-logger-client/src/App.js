// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "./App.css"

function App() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [logLevel, setLogLevel] = useState('');

  const fetchLogs = useCallback(async () => {
    try {
      const apiBaseUrl = 'http://localhost:5000';
      const response = await axios.get(`${apiBaseUrl}/logs`, { params: { logLevel } });
        setLogs(response.data);
    } catch (error) {
        console.error('Error fetching logs:', error);
    }
}, [logLevel]);

useEffect(() => {
    fetchLogs();
}, [fetchLogs]); 

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLogLevelChange = (e) => {
    setLogLevel(e.target.value);
  };

  const filteredLogs = logs.filter((log) => {
    return (
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (logLevel === '' || log.logLevel === logLevel)
    );
  });

  return (
    <Router>
      <div className="App">
        <h1>Comment Logger</h1>
        <Routes>
          <Route className = "Logs"
            path="/logs"
            element={
              <Logs
                logs={filteredLogs}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                logLevel={logLevel}
                onLogLevelChange={handleLogLevelChange}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

function Logs({ logs, searchTerm, onSearchChange, logLevel, onLogLevelChange }) {
  return (
    <div>
      <h2>Logs</h2>
      <input
        type="text"
        placeholder="Search logs..."
        value={searchTerm}
        onChange={onSearchChange}
      />
      <select value={logLevel} onChange={onLogLevelChange}>
        <option value="">All Levels</option>
        <option value="Information">Information</option>
        <option value="Warning">Warning</option>
        <option value="Error">Error</option>
      </select>
      <ul>
        {logs.map((log) => (
          <li key={log.id}>
            <strong>{log.timestamp}</strong> - {log.logLevel}: {log.message}
            {log.exception && <pre>{log.exception}</pre>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;