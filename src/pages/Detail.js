import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Detail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        status: 'Новое',
        severity: 'Средний'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadIncident = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/incidents/${id}`);
                setFormData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Ошибка загрузки:', error);
                setLoading(false);
            }
        };

        loadIncident();
    }, [id]);

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
            await axios.put(`http://localhost:5000/incidents/${id}`, formData);
            alert('Запись успешно обновлена!');
            navigate('/');
        } catch (error) {
            console.error('Ошибка обновления:', error);
            alert('Не удалось обновить запись');
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="loading-spinner"></div>
                <p>Загрузка данных...</p>
            </div>
        );
    }

    return (
        <div>
            <h1>Редактирование записи</h1>
            <p>ID записи: #{id}</p>
            
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Название *</label>
                        <input 
                            type="text" 
                            name="title" 
                            value={formData.title} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Описание *</label>
                        <textarea 
                            name="description" 
                            value={formData.description} 
                            onChange={handleChange} 
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
                        <button type="submit" className="btn btn-primary">
                            Сохранить изменения
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

export default Detail;
