import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        if (token && userData) {
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, []);

    const login = (username, password) => {
        if (username === 'admin' && password === '65890708') {
            const fakeToken = 'fake-jwt-token-' + Date.now();
            const userData = { username, role: 'admin' };
            
            localStorage.setItem('authToken', fakeToken);
            localStorage.setItem('userData', JSON.stringify(userData));
            setUser(userData);
            return { success: true };
        }
        return { success: false, message: 'Неверный логин или пароль' };
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setUser(null);
    };

    const isAuthenticated = () => {
        return !!localStorage.getItem('authToken');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
