// TablePage.js
import React, { useState, useEffect } from 'react';
import DataSet from './DataSet';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const TablePage = ({ endpoint }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  // Загрузка данных
  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/${endpoint}`)
      .then((response) => response.json())
      .then((items) => {
        setData(items);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Ошибка загрузки данных:', error);
        setLoading(false);
      });
  }, [endpoint]);

  // Конфигурация полей для каждой таблицы
  const tableConfigs = {
    comments: {
      fields: [
        { name: 'postId', label: 'Post ID', type: 'number' },
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'body', label: 'Body', type: 'textarea' },
      ],
    },
    posts: {
      fields: [
        { name: 'id', label: 'ID', type: 'number' },
        { name: 'userId', label: 'User ID', type: 'number' },
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'body', label: 'Body', type: 'textarea' },
      ],
    },
    albums: {
      fields: [
        { name: 'id', label: 'ID', type: 'number' },
        { name: 'userId', label: 'User ID', type: 'number' },
        { name: 'title', label: 'Title', type: 'text' },
      ],
    },
    todos: {
      fields: [
        { name: 'id', label: 'ID', type: 'number' },
        { name: 'userId', label: 'User ID', type: 'number' },
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'completed', label: 'Completed', type: 'checkbox' },
      ],
    },
    users: {
      fields: [
        { name: 'id', label: 'ID', type: 'number' },
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'username', label: 'Username', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'address', label: 'Address', type: 'json' },
        { name: 'phone', label: 'Phone', type: 'text' },
        { name: 'website', label: 'Website', type: 'text' },
        { name: 'company', label: 'Company', type: 'json' },
      ],
    },
  };

  const config = tableConfigs[endpoint];

  // Создаем схему валидации для Yup
  const validationSchema = Yup.object(
    config.fields.reduce((schema, field) => {
      if (field.type === 'number') {
        schema[field.name] = Yup.number().required(`${field.label} is required`);
      } else if (field.type === 'email') {
        schema[field.name] = Yup.string().email('Invalid email').required(`${field.label} is required`);
      } else if (field.type === 'checkbox') {
        schema[field.name] = Yup.boolean();
      } else {
        schema[field.name] = Yup.string().required(`${field.label} is required`);
      }
      return schema;
    }, {})
  );

  // Форма для добавления данных
  const formik = useFormik({
    initialValues: config.fields.reduce((values, field) => {
      values[field.name] = '';
      return values;
    }, {}),
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Генерация уникального временного id
        const tempId = Date.now(); // Используем временную метку
        const newItem = { ...values, id: tempId }; // Добавляем временный id
        setData((prevData) => [...prevData, newItem]);

        const response = await fetch(`https://jsonplaceholder.typicode.com/${endpoint}`, {
          method: 'POST',
          body: JSON.stringify(values),
          headers: { 'Content-type': 'application/json; charset=UTF-8' },
        });

        if (!response.ok) throw new Error('Ошибка при добавлении');

        const result = await response.json();

        // Заменяем временное значение id на реальное
        setData((prevData) =>
          prevData.map((item) => (item.id === tempId ? { ...item, id: result.id } : item))
        );

        // Очищаем форму
        formik.resetForm();
      } catch (error) {
        console.error(error);
        alert('Ошибка при добавлении. Попробуйте снова.');
      }
    },
  });

  // Удаление выбранных элементов
  const handleDeleteSelected = async () => {
    const idsToDelete = selectedRows;

    try {
      for (const id of idsToDelete) {
        await fetch(`https://jsonplaceholder.typicode.com/${endpoint}/${id}`, {
          method: 'DELETE',
        });
      }

      setData((prevData) => prevData.filter((item) => !idsToDelete.includes(item.id)));
      setSelectedRows([]);
    } catch (error) {
      console.error(error);
      alert('Ошибка при удалении. Попробуйте снова.');
    }
  };

  // Выбор строки
  const handleRowSelect = (id, event) => {
    const isCtrlPressed = event.ctrlKey;

    if (isCtrlPressed) {
      setSelectedRows((prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((selectedId) => selectedId !== id)
          : [...prevSelected, id]
      );
    } else {
      if (selectedRows.includes(id)) {
        setSelectedRows([]);
      } else {
        setSelectedRows([id]);
      }
    }
  };

  // Редактирование элемента
  const handleEditClick = (item) => {
    setEditingItem(item);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/${endpoint}/${editingItem.id}`, {
        method: 'PATCH',
        body: JSON.stringify(editingItem),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      });

      if (!response.ok) throw new Error('Ошибка при редактировании');

      setData((prevData) =>
        prevData.map((item) => (item.id === editingItem.id ? editingItem : item))
      );
      setEditingItem(null);
    } catch (error) {
      console.error(error);
      alert('Ошибка при сохранении изменений. Попробуйте снова.');
    }
  };

  const handleChangeEdit = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingItem((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Генерация строк таблицы
  const rowRenderer = (item) => {
    return config.fields.map((field) => {
      const value = item[field.name];
      if (typeof value === 'object' && value !== null) {
        return <td key={field.name}>{JSON.stringify(value)}</td>;
      }
      return <td key={field.name}>{value || '—'}</td>;
    });
  };

  // Генерация заголовков динамически
  const headers = config.fields.map((field) => ({ label: field.label }));

  if (loading) return <div>Загрузка данных...</div>;

  return (
    <div>
      <h2>{endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}</h2>

      {/* Форма для добавления */}
      <form onSubmit={formik.handleSubmit}>
        {config.fields.map((field) => {
          if (field.type === 'textarea') {
            return (
              <div key={field.name}>
                <textarea
                  name={field.name}
                  placeholder={field.label}
                  onChange={formik.handleChange}
                  value={formik.values[field.name]}
                />
                {formik.errors[field.name] && <div>{formik.errors[field.name]}</div>}
              </div>
            );
          } else if (field.type === 'checkbox') {
            return (
              <div key={field.name}>
                <label>
                  <input
                    type="checkbox"
                    name={field.name}
                    onChange={formik.handleChange}
                    checked={formik.values[field.name]}
                  />
                  {field.label}
                </label>
              </div>
            );
          } else if (field.type === 'json') {
            return (
              <div key={field.name}>
                <input
                  type="text"
                  name={field.name}
                  placeholder={field.label}
                  onChange={formik.handleChange}
                  value={formik.values[field.name]}
                />
                {formik.errors[field.name] && <div>{formik.errors[field.name]}</div>}
              </div>
            );
          } else {
            return (
              <div key={field.name}>
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.label}
                  onChange={formik.handleChange}
                  value={formik.values[field.name]}
                />
                {formik.errors[field.name] && <div>{formik.errors[field.name]}</div>}
              </div>
            );
          }
        })}
        <button type="submit">Добавить</button>
      </form>

      {/* Кнопка удаления выбранных элементов */}
      <button onClick={handleDeleteSelected} disabled={selectedRows.length === 0}>
        Удалить выбранные
      </button>

      {/* Форма редактирования */}
      {editingItem && (
        <div className="edit-form">
          <h3>Редактировать элемент</h3>
          {config.fields.map((field) => {
            if (field.type === 'textarea') {
              return (
                <textarea
                  key={field.name}
                  name={field.name}
                  placeholder={field.label}
                  onChange={handleChangeEdit}
                  value={editingItem[field.name] || ''}
                />
              );
            } else if (field.type === 'checkbox') {
              return (
                <label key={field.name}>
                  <input
                    type="checkbox"
                    name={field.name}
                    onChange={handleChangeEdit}
                    checked={editingItem[field.name] || false}
                  />
                  {field.label}
                </label>
              );
            } else if (field.type === 'json') {
              return (
                <input
                  key={field.name}
                  type="text"
                  name={field.name}
                  placeholder={field.label}
                  onChange={handleChangeEdit}
                  value={JSON.stringify(editingItem[field.name] || '')}
                />
              );
            } else {
              return (
                <input
                  key={field.name}
                  type={field.type}
                  name={field.name}
                  placeholder={field.label}
                  onChange={handleChangeEdit}
                  value={editingItem[field.name] || ''}
                />
              );
            }
          })}
          <button onClick={handleSaveEdit}>Сохранить</button>
          <button onClick={() => setEditingItem(null)}>Отмена</button>
        </div>
      )}

      {/* Таблица */}
      <DataSet
        headers={headers}
        data={data}
        rowRenderer={(item) => (
          <>
            {rowRenderer(item)}
            <td>
              <button onClick={() => handleEditClick(item)}>Редактировать</button>
            </td>
          </>
        )}
        selectedRows={selectedRows}
        onRowSelect={handleRowSelect}
      />
    </div>
  );
};

export default TablePage;