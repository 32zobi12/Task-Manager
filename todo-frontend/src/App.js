import React, { useState } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import './App.css';

const App = () => {
    const [view, setView] = useState('login');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
        setView('list');
    };

    const handleRegisterSuccess = () => {
        handleLoginSuccess();
    };

    const handleLogout = () => {
        localStorage.removeItem('access');
        setIsAuthenticated(false);
        setView('login');
    };

    const renderNavigation = () => {
        return (
            <nav className="navigation">
                {isAuthenticated ? (
                    <>
                        <button className="nav-button" onClick={() => setView('list')}>Просмотр задач</button>
                        <button className="nav-button" onClick={() => setView('create')}>Создать задачу</button>
                        <button className="nav-button logout-button" onClick={handleLogout}>Выйти</button>
                    </>
                ) : (
                    <>
                        <button className="nav-button" onClick={() => setView('login')}>Вход</button>
                        <button className="nav-button" onClick={() => setView('register')}>Регистрация</button>
                    </>
                )}
            </nav>
        );
    };

    return (
        <div className="app-container">
            <h1 className="app-title">Task Manager</h1>
            {renderNavigation()}
            <div className="content">
                {view === 'list' && isAuthenticated && <TaskList />}
                {view === 'create' && isAuthenticated && <TaskForm />}
                {view === 'login' && <LoginForm onLoginSuccess={handleLoginSuccess} />}
                {view === 'register' && <RegisterForm onRegisterSuccess={handleRegisterSuccess} />}
            </div>
        </div>
    );
};

export default App;

