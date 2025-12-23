import { createContext, useState, useEffect, useContext } from 'react';
import { getMe, login as apiLogin, register as apiRegister, logout as apiLogout } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const userData = await getMe();
                    setUser(userData);
                }
            } catch (error) {
                // Token invalid or expired and refresh failed
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        const data = await apiLogin(email, password);
        setUser(data.data.user);
    };

    const register = async (name, email, password) => {
        const data = await apiRegister(name, email, password);
        setUser(data.data.user);
    };

    const logout = async () => {
        await apiLogout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
