import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";
import queryClient from "../queryClient";

type LoginCreds = {
    email: string
    first_name: string
    last_name: string
    department_name: string
    company: string
    password: string
}

interface AuthContextType {
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    userRegister: (credentials: LoginCreds) => Promise<void>;
}

export const AuthenticationContext = createContext<AuthContextType>({
    token: null,
    login: async () => { throw new Error('login method not implemented'); },
    logout: async () => { throw new Error('logout method not implemented'); },
    userRegister: async () => { throw new Error('register method not implemented'); },
});

const EXCLUDED_PATHS = ["/sign-in"];

export const Authentication = ({ children }: PropsWithChildren<{}>) => {
    const [token, setToken] = useState<string | null>(null);
    const location = useLocation();
    const navigate = useNavigate();

    const login = async (email: string, password: string): Promise<void> => {
        try {
            const response = await api.post('/auth/sign-in', { email, password })
            localStorage.setItem("CLIENT_TOKEN", response.data.access_token)
            navigate('/')
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            setToken(null);
            queryClient.clear(); // Clear all queries and cache
            localStorage.clear();
        } catch (error) {
            console.error("Logout failed", error);
            throw error;
        }
    };

    const userRegister = async (credentials: LoginCreds) => {
        try {
            const response = await api.post('user', credentials)
            console.log(response)
            if (response.status) {
                navigate('/sign-in');
            }
        } catch (error) {
            console.error("Registration failed", error);
            throw error;
        }
    };

    useEffect(() => {
        const user_token = localStorage.getItem("CLIENT_TOKEN")
        if (user_token) setToken(user_token)
        if (!token && !EXCLUDED_PATHS.includes(location.pathname)) {
            navigate('/sign-in')
            return
        }
        if (token && EXCLUDED_PATHS.includes(location.pathname)) navigate('/')
    })

    return (
        <AuthenticationContext.Provider value={{ token, login, logout, userRegister }}>
            {children}
        </AuthenticationContext.Provider>
    );
};
