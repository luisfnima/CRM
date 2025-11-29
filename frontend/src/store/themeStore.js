import { create } from 'zustand';

export const useThemeStore = create((set) => ({
    primaryColor: '#3b82f6',
    secondaryColor: '#e2e2e2',
    logoUrl: null,
    companyName: 'DreamTeam',

    setTheme: (company) => set({
        primaryColor: company.primary_color,
        secondaryColor: company.secondary_color,
        logoUrl: company.logo_url,
        companyName: company.name
    }),

    resetTheme: () => set({
        primaryColor: '#3b82f6',
        secondaryColor: '#e2e2e2',
        logoUrl: null,
        companyName: 'DreamTeam'
    })


}));