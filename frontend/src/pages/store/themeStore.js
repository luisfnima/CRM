import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set) => ({
      primaryColor: '#dc2626', // Rojo por defecto
      secondaryColor: '#e5e7eb', // Gris por defecto
      companyName: 'DreamTeam',
      logoUrl: '',
      
      // Función para actualizar los colores
      setColors: (primaryColor, secondaryColor) => {
        set({ primaryColor, secondaryColor });
        
        // Actualizar variables CSS globales
        document.documentElement.style.setProperty('--color-primary', primaryColor);
        document.documentElement.style.setProperty('--color-secondary', secondaryColor);
      },
      
      // Función para setear toda la configuración de la empresa
      setTheme: (companyConfig) => {
        set({
          primaryColor: companyConfig.primary_color || '#dc2626',
          secondaryColor: companyConfig.secondary_color || '#e5e7eb',
          companyName: companyConfig.name || 'DreamTeam',
          logoUrl: companyConfig.logo_url || '',
        });
        
        // Actualizar CSS
        document.documentElement.style.setProperty('--color-primary', companyConfig.primary_color || '#dc2626');
        document.documentElement.style.setProperty('--color-secondary', companyConfig.secondary_color || '#e5e7eb');
      },
      
      // Resetear a valores por defecto
      resetTheme: () => {
        set({
          primaryColor: '#dc2626',
          secondaryColor: '#e5e7eb',
          companyName: 'DreamTeam',
          logoUrl: '',
        });
        
        document.documentElement.style.setProperty('--color-primary', '#dc2626');
        document.documentElement.style.setProperty('--color-secondary', '#e5e7eb');
      },
    }),
    {
      name: 'theme-storage', // Nombre en localStorage
    }
  )
);