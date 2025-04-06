import React, { useState, useEffect, useOptimistic } from 'react';
import DataSet from './DataSet';
import './App.css';

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [optimisticData, addOptimisticData] = useOptimistic(data, (state, newItem) => [...state, newItem]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editingComment, setEditingComment] = useState(null);
  const [newComment, setNewComment] = useState({ name: '', email: '', body: '' });
  const [isAddingComment, setIsAddingComment] = useState(false);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/comments')
      .then((response) => response.json())
      .then((comments) => {
        setData(comments);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Ошибка загрузки данных:', error);
        setLoading(false);
      });
  }, []);

  const handleAddComment = async () => {
    if (!newComment.name || !newComment.email || !newComment.body) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }

    const optimisticItem = { ...newComment, id: Date.now() };
    addOptimisticData(optimisticItem);

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/comments', {
        method: 'POST',
        body: JSON.stringify(newComment),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка при добавлении комментария');
      }

      const result = await response.json();
      setData((prevData) => [...prevData, result]);
      setNewComment({ name: '', email: '', body: '' });
      setIsAddingComment(false);
    } catch (error) {
      console.error(error);
      setData((prevData) => prevData.filter((item) => item.id !== optimisticItem.id));
    }
  };

  const handleDeleteSelected = async () => {
    const idsToDelete = selectedRows.map((index) => data[index].id);

    setData((prevData) => prevData.filter((_, index) => !selectedRows.includes(index)));

    try {
      for (const id of idsToDelete) {
        const response = await fetch(`https://jsonplaceholder.typicode.com/comments/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Ошибка при удалении комментария');
        }
      }
    } catch (error) {
      console.error(error);
      fetch('https://jsonplaceholder.typicode.com/comments')
        .then((response) => response.json())
        .then((comments) => setData(comments));
    }

    setSelectedRows([]);
  };

  const handleEditClick = (comment) => {
    setEditingComment(comment);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/comments/${editingComment.id}`, {
        method: 'PATCH',
        body: JSON.stringify(editingComment),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка при редактировании комментария');
      }

      setData((prevData) =>
        prevData.map((item) => (item.id === editingComment.id ? editingComment : item))
      );
      setEditingComment(null);
    } catch (error) {
      console.error(error);
      alert('Ошибка при сохранении изменений. Попробуйте снова.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingComment((prev) => ({ ...prev, [name]: value }));
  };

  const renderEditForm = () => {
    if (!editingComment) return null;

    return (
      <div className="edit-form">
        <h3>Редактировать комментарий</h3>
        <input
          type="text"
          name="name"
          value={editingComment.name}
          onChange={handleChange}
          placeholder="Имя"
        />
        <input
          type="email"
          name="email"
          value={editingComment.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <textarea
          name="body"
          value={editingComment.body}
          onChange={handleChange}
          placeholder="Текст комментария"
        />
        <button onClick={handleSave}>Сохранить</button>
        <button onClick={() => setEditingComment(null)}>Отмена</button>
      </div>
    );
  };

  const headers = [
    { label: 'ID' },
    { label: 'Name' },
    { label: 'Email' },
    { label: 'Body' },
  ];

  const rowRenderer = (item, onEdit) => (
    <>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>{item.email}</td>
      <td>{item.body}</td>
      <td>
        <button onClick={() => onEdit(item)}>Редактировать</button>
      </td>
    </>
  );

  if (loading) {
    return <div className='load'>Загрузка данных...</div>;
  }

  return (
    <div className="App">
      <h1>Comments Table</h1>

      <button onClick={() => setIsAddingComment(true)}>Добавить комментарий</button>

      {isAddingComment && (
        <div className="add-comment-form">
          <h3>Добавить новый комментарий</h3>
          <input
            type="text"
            name="name"
            value={newComment.name}
            onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
            placeholder="Имя"
          />
          <input
            type="email"
            name="email"
            value={newComment.email}
            onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
            placeholder="Email"
          />
          <textarea
            name="body"
            value={newComment.body}
            onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
            placeholder="Текст комментария"
          />
          <button onClick={handleAddComment}>Добавить</button>
          <button onClick={() => setIsAddingComment(false)}>Отмена</button>
        </div>
      )}

      <button onClick={handleDeleteSelected} disabled={selectedRows.length === 0}>
        Удалить выбранные
      </button>

      {renderEditForm()}

      <DataSet
        headers={headers}
        data={optimisticData}
        rowRenderer={(item) => rowRenderer(item, handleEditClick)}
        selectedRows={selectedRows}
        onRowSelect={setSelectedRows}
      />
    </div>
  );
};

export default App;