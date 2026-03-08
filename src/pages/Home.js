import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const BIN_ID = '69ad45e2ae596e708f6c5416';
    const API_KEY = '$2a$10$RXqthTfr5oH0p4Knha6oe.A64Sl1yetsQy.rzh8qGjAlFV/w1pihu';
    
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, new: 0, inWork: 0, done: 0 });

    useEffect(() => {
        loadIncidents();
    }, []);

    const loadIncidents = async () => {
        try {
            const response = await axios.get(
                `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`,
                { headers: { 'X-Master-Key': API_KEY } }
            );
            const data = response.data.record.incidents;
            
            setIncidents(data);
            
            setStats({
                total: data.length,
                new: data.filter(i => i.status === 'Новое').length,
                inWork: data.filter(i => i.status === 'В работе').length,
                done: data.filter(i => i.status === 'Завершено').length
            });
            
            setLoading(false);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            setLoading(false);
            alert('Не удалось загрузить данные. Проверьте API ключ.');
        }
    };

    const deleteIncident = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
            try {
                const current = await axios.get(
                    `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`,
                    { headers: { 'X-Master-Key': API_KEY } }
                );
                
                const updated = current.data.record.incidents.filter(item => item.id !=== id);
                
                await axios.put(
                    `https://api.jsonbin.io/v3/b/${BIN_ID}`,
                    { incidents: updated },
                    { headers: { 'X-Master-Key': API_KEY } }
                );
                
                setIncidents(updated);
                loadIncidents();
            } catch (error) {
                console.error('Ошибка удаления:', error);
                alert('Не удалось удалить запись');
            }
        }
    };

    const getStatusClass = (status) => {
        switch(status) {
            case 'Новое': return 'status-new';
            case 'В работе': return 'status-work';
            case 'Завершено': return 'status-done';
            default: return '';
        }
    };

    const getSeverityClass = (severity) => {
        switch(severity) {
            case 'Низкий': return 'severity-low';
            case 'Средний': return 'severity-medium';
            case 'Высокий': return 'severity-high';
            case 'Критический': return 'severity-critical';
            default: return '';
        }
    };

    const getSeverityText = (severity) => {
        switch(severity) {
            case 'Низкий': return 'Низкий';
            case 'Средний': return 'Средний';
            case 'Высокий': return 'Высокий';
            case 'Критический': return 'Критический';
            default: return severity;
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
            <div className="stats-container">
                <div className="stat-card">
                    <h3>{stats.total}</h3>
                    <p>Всего записей</p>
                </div>
                <div className="stat-card">
                    <h3>{stats.new}</h3>
                    <p>Новые</p>
                </div>
                <div className="stat-card">
                    <h3>{stats.inWork}</h3>
                    <p>В работе</p>
                </div>
                <div className="stat-card">
                    <h3>{stats.done}</h3>
                    <p>Завершено</p>
                </div>
            </div>

            <h1>Реестр нарушений</h1>
            <p>Система учёта и мониторинга инцидентов на железной дороге</p>
            
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th>Статус</th>
                            <th>Уровень</th>
                            <th>Дата</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incidents.length > 0 ? (
                            incidents.map(item => (
                                <tr key={item.id}>
                                    <td>#{item.id}</td>
                                    <td>
                                        <Link to={`/detail/${item.id}`} style={{ color: '#2c3e50', fontWeight: '600' }}>
                                            {item.title}
                                        </Link>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={`severity-container ${getSeverityClass(item.severity)}`}>
                                            <div className="severity-bar">
                                                <div className="severity-fill"></div>
                                            </div>
                                            <span className="severity-text">{getSeverityText(item.severity)}</span>
                                        </div>
                                    </td>
                                    <td>{item.date}</td>
                                    <td>
                                        <button 
                                            onClick={() => deleteIncident(item.id)}
                                            className="btn btn-danger"
                                        >
                                            🗑 Удалить
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{textAlign: 'center', padding: '30px', color: '#666'}}>
                                    Записей не найдено. Добавьте первую запись!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            <Link to="/add" className="btn btn-primary">
                Добавить запись
            </Link>
        </div>
    );
};

export default Home;
