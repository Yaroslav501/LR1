import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Detail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const BIN_ID = '69ad45e2ae596e708f6c5416';
    const API_KEY = '$2a$10$RXqthTfr5oH0p4Knha6oe.A64Sl1yetsQy.rzh8qGjAlFV/w1pihu';
    
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
                const response = await axios.get(
                    `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`,
                    { headers: { 'X-Master-Key': API_KEY } }
                );
                
                const incident = response.data.record.incidents.find(i => i.id == id);
                
                if (incident) {
                    setFormData(incident);
                }
                
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
            const current = await axios.get(
                `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`,
                { headers: { 'X-Master-Key': API_KEY } }
            );
            
            const updated = current.data.record.incidents.map(i => 
                i.id == id ? { ...formData, id } : i
            );
            
            await axios.put(
                `https://api.jsonbin.io/v3/b/${BIN_ID}`,
                { incidents: updated },
                { headers: { 'X-Master-Key': API_KEY } }
            );
            
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
