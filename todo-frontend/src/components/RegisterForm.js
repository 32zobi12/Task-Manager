import React, { useState } from 'react';
import axios from 'axios';

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false); // Для отслеживания успешной регистрации

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Сброс ошибки перед новым запросом
        setSuccess(false); // Сброс успешного состояния

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/register/', {
                username,
                password,
            });

            // Если регистрация успешна, устанавливаем состояние успеха
            if (response.status === 201) {
                setSuccess(true); // Успешная регистрация
                setUsername(''); // Сброс имени пользователя
                setPassword(''); // Сброс пароля
            }
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'Registration failed';
            setError(errorMessage); // Обновление сообщения об ошибке
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Регистрация</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>Registration successful!</p>}
        </form>
    );
};

export default RegisterForm;