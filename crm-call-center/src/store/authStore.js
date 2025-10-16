import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const authStore = create(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,

            login: (userData) => {
                set({
                    user: userData,
                    isAuthenticated: true
                });
            },

            logout: () => {
                set({
                    user: null,
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