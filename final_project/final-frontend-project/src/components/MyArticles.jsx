import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyArticles = () => {
    const token = localStorage.getItem('token');
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/articles/my-articles', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setArticles(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке статей:', error.response?.data || error.message);
                alert('Не удалось загрузить список статей.');
            }
        };

        if (!token) {
            window.location.href = '/login';
        } else {
            fetchArticles();
        }
    }, [token]);

    return (
        <div className="my-articles-container">
            <h2>Мои статьи</h2>
            {articles.length === 0 ? (
                <p>У вас пока нет статей.</p>
            ) : (
                <ul>
                    {articles.map((article) => (
                        <li key={article.id}>
                            <h3>{article.title}</h3>
                            <p><strong>Статус:</strong> {article.status}</p>
                            <p><strong>Дата создания:</strong> {new Date(article.createdAt).toLocaleDateString()}</p>
                            <p><strong>Рецензент:</strong>{article.reviewerName}</p>
                            
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyArticles;