// TaskEditForm.js
import React, { useEffect, useState } from 'react';

const TaskEditForm = ({ taskId, onCancel, onUpdate }) => {
    const [taskData, setTaskData] = useState({ title: '', description: '' });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTask = async () => {
            const token = localStorage.getItem('access');
            if (!token) {
                setError('Токен не найден. Пожалуйста, войдите в систему.');
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Не удалось получить задачу');
                }

                const data = await response.json();
                setTaskData(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchTask();
    }, [taskId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskData({ ...taskData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access');
        if (!token) {
            setError('Токен не найден. Пожалуйста, войдите в систему.');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });

            if (!response.ok) {
                throw new Error('Не удалось обновить задачу');
            }

            onUpdate(); // Вызов функции обновления после успешного редактирования
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h2>Редактировать задачу</h2>
            {error && <div>{error}</div>}
            <form onSubmit={handleSubmit}>
                <label>
                    Заголовок:
                    <input
                        type="text"
                        name="title"
                        value={taskData.title}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Описание:
                    <textarea
                        name="description"
                        value={taskData.description}
                        onChange={handleChange}
                        required
                    />
                </label>
                <button type="submit">Сохранить</button>
                <button type="button" onClick={onCancel}>Отмена</button>
            </form>
        </div>
    );
};

export default TaskEditForm;


