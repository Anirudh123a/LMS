import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// ✅ Set token immediately when module loads — before any component renders
const savedToken = localStorage.getItem('token');
if (savedToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(savedToken);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`)
                .then(res => {
                    setUser(res.data.user);
                })
                .catch(() => {
                    logout();
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401 && error.config?.url?.includes('/api/auth/me')) {
                    logout();
                }
                return Promise.reject(error);
            }
        );
        return () => axios.interceptors.response.eject(interceptor);
    }, []);

    const login = async (identity, password) => {
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, 
            { identity, password }
        );
        
        const { token: backendToken, accessToken, role, user: loggedInUser } = res.data;
        const activeToken = accessToken || backendToken;
        
        localStorage.setItem('token', activeToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${activeToken}`;
        
        setToken(activeToken);
        setUser({ ...loggedInUser, role: role || loggedInUser?.role });
        
        return role || loggedInUser?.role; 
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);