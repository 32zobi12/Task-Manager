import React, { useEffect, useState } from 'react';
import TaskEditForm from './TaskEditForm';// Импортируйте компонент для редактирования задачи
import '../styles/TaskList.css';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const [editingTaskId, setEditingTaskId] = useState(null); // Состояние для редактируемой задачи
    const [loading, setLoading] = useState(true); // Состояние загрузки

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const token = localStorage.getItem('access');

        if (!token) {
            setError('Токен не найден. Пожалуйста, войдите в систему.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/tasks/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Не удалось получить задачи');
            }

            const data = await response.json();
            console.log('Fetched tasks:', data); // Логирование полученных задач
            setTasks(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false); // Сброс состояния загрузки
        }
    };

    const handleDelete = async (id) => {
        console.log(`Attempting to delete task with ID: ${id}`); // Логирование ID задачи для удаления
        if (typeof id !== 'number' || id <= 0) {
            console.error(`Invalid task ID: ${id}`);
            setError('Некорректный ID задачи');
            return;
        }

        const token = localStorage.getItem('access');
        console.log(`URL for deletion: http://127.0.0.1:8000/api/tasks/${id}/`);
        if (!token) {
            setError('Токен не найден. Пожалуйста, войдите в систему.');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/tasks/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setTasks(tasks.filter(task => task.id !== id));
                console.log(`Task with ID ${id} deleted successfully`);
            } else {
                const errorData = await response.json();
                console.error('Delete error response:', errorData);
                throw new Error(errorData.detail || 'Не удалось удалить задачу');
            }
        } catch (error) {
            console.error('Delete error:', error.message);
            setError(error.message);
        }
    };

    const handleEdit = (id) => {
        setEditingTaskId(id);
    };

    const handleUpdate = () => {
        setEditingTaskId(null); // Закрыть форму редактирования
        fetchTasks(); // Перезапросить задачи, чтобы обновить список
    };

    if (loading) {
        return <div>Загрузка задач...</div>; // Индикатор загрузки
    }

    if (editingTaskId) {
        return (
            <TaskEditForm
                taskId={editingTaskId}
                onCancel={() => setEditingTaskId(null)}
                onUpdate={handleUpdate}
            />
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="task-list">
            <h2>Список задач</h2>
            {tasks.map((task) => (
                <div className="task-item" key={task.id}>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <button onClick={() => handleEdit(task.id)}>Редактировать</button>
                    <button onClick={() => handleDelete(task.id)}>Удалить</button>
                </div>
            ))}
        </div>
    );
};

export default TaskList;

