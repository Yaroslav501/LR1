import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Form = () => {
    const navigate = useNavigate();
    
    const API_URL = 'https://69b00939c63dd197febb0bb0.mockapi.io/incidents';
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        status: 'Новое',
        severity: 'Средний'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(API_URL, formData);
            alert('Запись успешно добавлена!');
            navigate('/');
        } catch (error) {
            console.error('Ошибка при добавлении:', error);
            alert('Не удалось добавить запись');
        }
    };

    return (
        <div>
            <h1>Добавить нарушение</h1>
            <p>Заполните форму для создания новой записи в реестре</p>
            
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Название *</label>
                        <input 
                            type="text" 
                            name="title" 
                            value={formData.title} 
                            onChange={handleChange} 
                            placeholder="Например: Повреждение рельса"
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Описание *</label>
                        <textarea 
                            name="description" 
                            value={formData.description} 
                            onChange={handleChange} 
                            placeholder="Подробное описание нарушения..."
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Дата *</label>
                        <input 
                            type="date" 
                            name="date" 
                            value={formData.date} 
                            onChange={handleChange} 
                            min="2020-01-01"
                            max="2030-12-31"
                            required 
                        />
                        <small>Допустимый диапазон: 2020-2030</small>
                    </div>

                    <div className="form-group">
                        <label>Статус *</label>
                        <select 
                            name="status" 
                            value={formData.status} 
                            onChange={handleChange} 
                        >
                            <option value="Новое">Новое</option>
                            <option value="В работе">В работе</option>
                            <option value="Завершено">Завершено</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Уровень опасности *</label>
                        <select 
                            name="severity" 
                            value={formData.severity} 
                            onChange={handleChange} 
                        >
                            <option value="Низкий">Низкий</option>
                            <option value="Средний">Средний</option>
                            <option value="Высокий">Высокий</option>
                            <option value="Критический">Критический</option>
                        </select>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-success">
                            Сохранить
                        </button>
                        <button 
                            type="button" 
                            onClick={() => navigate('/')} 
                            className="btn btn-secondary"
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Form;
