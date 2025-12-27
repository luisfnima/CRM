// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            token: null,
            user: null,
            company: null,
            isAuthenticated: false,

            login: (user, token, company) => {
                set({
                    token,
                    user,
                    company,
                    isAuthenticated: true
                });
            },

            logout: () => {
                set({
                    token: null,
                    user: null,
                    company: null,
                    isAuthenticated: false
                });
                localStorage.removeItem('auth-store');
            },

            updateUser: (user) => {
                set({ user });
            }
        }),
        {
            name: 'auth-store' // Nombre en localStorage
        }
    )
);