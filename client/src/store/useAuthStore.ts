import { create } from 'zustand';
import axios from 'axios';

interface User {
    id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
    email: string;
    role: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (accessToken: string, user: User) => void;
    logout: () => void;
    setAuthenticated: (status: boolean) => void;
    setLoading: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    accessToken: localStorage.getItem('accessToken'),
    isAuthenticated: !!localStorage.getItem('accessToken'),
    isLoading: false,

    login: (accessToken, user) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        set({ accessToken, user, isAuthenticated: true });
    },

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        set({ accessToken: null, user: null, isAuthenticated: false });
    },

    setAuthenticated: (status) => set({ isAuthenticated: status }),
    setLoading: (status) => set({ isLoading: status }),
}));
