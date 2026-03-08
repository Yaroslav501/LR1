import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Form = () => {
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
            // Получаем текущие данные
            const current = await axios.get(
                `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`,
                { headers: { 'X-Master-Key': API_KEY } }
            );
            
            // Добавляем новую запись с уникальным ID
            const newIncident = { 
                ...formData, 
                id: Date.now().toString() 
            };
            
            const updated = [...current.data.record.incidents, newIncident];
            
            // Отправляем обновлённый массив
            await axios.put(
                `https://api.jsonbin.io/v3/b/${BIN_ID}`,
                { incidents: updated },
                { headers: { 'X-Master-Key': API_KEY } }
            );
            
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
