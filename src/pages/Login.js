import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [attempts, setAttempts] = useState(0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!formData.username || !formData.password) {
            setError('Заполните все поля');
            return;
        }

        const result = login(formData.username, formData.password);
        if (result.success) {
            alert('Вход выполнен успешно! Добро пожаловать, ' + formData.username);
            navigate('/');
        } else {
            setAttempts(prev => prev + 1);
            setError(result.message);
        }
    };

    return (
        <div>
            <h1>Вход в систему</h1>
            <p>Система учёта нарушений железнодорожной безопасности</p>
            
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Логин *</label>
                        <input 
                            type="text" 
                            name="username" 
                            value={formData.username} 
                            onChange={handleChange} 
                            placeholder="Введите логин"
                            required 
                            autoComplete="username"
                        />
                    </div>

                    <div className="form-group">
                        <label>Пароль *</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            placeholder="Введите пароль"
                            required 
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <div className="error-message">
                            {error} {attempts >= 3 && 'Слишком много неудачных попыток'}
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">
                            Войти
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;