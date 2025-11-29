import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            company: null,
            isAuthenticated: false,

            login: (userData, token, companyData) => {
                set({
                    user: userData,
                    token,
                    company: companyData,
                    isAuthenticated: true
                });
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    company: null,
                    isAuthenticated: false
                });
            },

            updateUser: (userData) => {
                set((state) => ({
                    user: { ...state.user, ...userData }
                }));
            },

        }),

        {
            name: 'auth-storage'
        }
    )

);