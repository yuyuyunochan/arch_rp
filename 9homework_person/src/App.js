import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import FormPage from "./FormPage";
import DataPage from "./DataPage";
import "./App.css"

function App() {
  const [people, setPeople] = useState([]);

  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link className="link_form" to="/">Форма для ввода данных</Link>
          </li>
          <li>
            <Link className="link_data" to="/data">Данные</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route
          path="/"
          element={<FormPage onFormSubmit={(data) => setPeople([...people, data])} />}
        />
        <Route path="/data" element={<DataPage people={people} />} />
      </Routes>
    </Router>
  );
}

export default App;