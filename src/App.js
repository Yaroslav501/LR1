import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Form from './pages/Form';
import Login from './pages/Login';
import './App.css';

const NavBar = () => {
    const { user, logout, isAuthenticated } = useAuth();

    const handleLogout = () => {
        logout();
        alert('Вы вышли из системы');
    };

    return (
        <nav>
            <div className="nav-left">
                <Link to="/" className="logo">
                    <span className="logo-icon">🚄</span>
                    <span className="logo-text">RailSafety</span>
                </Link>
            </div>
            <div className="nav-right">
                {isAuthenticated() ? (
                    <>
                        <div className="user-info">
                            <span className="user-icon">👤</span>
                            <span className="user-name">{user?.username}</span>
                        </div>
                        <button 
                            onClick={handleLogout} 
                            className="btn-logout"
                        >
                            Выход
                        </button>
                    </>
                ) : (
                    <Link to="/login">Вход</Link>
                )}
            </div>
        </nav>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app-container">
                    <NavBar />
                    
                    <div className="content">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route 
                                path="/" 
                                element={
                                    <ProtectedRoute>
                                        <Home />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/detail/:id" 
                                element={
                                    <ProtectedRoute>
                                        <Detail />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/add" 
                                element={
                                    <ProtectedRoute>
                                        <Form />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
