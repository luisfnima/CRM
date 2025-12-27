import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Menu,
    Search,
    Bell,
    User,
    LogOut,
    Settings,
    ChevronDown
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import toast from 'react-hot-toast';

const Topbar = ({ toggleSidebar }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [peruTime, setPeruTime] = useState('');
    const [spainTime, setSpainTime] = useState('');
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    
    // SUSCRIPCIÓN EXPLÍCITA AL STORE
    const primaryColor = useThemeStore((state) => state.primaryColor);
    const secondaryColor = useThemeStore((state) => state.secondaryColor);

    // Función para determinar si un color es claro u oscuro
    const isLightColor = (color) => {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5;
    };
    
    // Determinar colores de texto basados en el fondo del topbar
    const isLight = isLightColor(secondaryColor);
    const textPrimary = isLight ? '#1f2937' : '#f3f4f6';
    const textSecondary = isLight ? '#4b5563' : '#d1d5db';
    const borderColor = isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';
    const hoverBg = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';

    useEffect(() => {
        const updateTimes = () => {
            try {
                const peruDate = new Intl.DateTimeFormat('es-PE', {
                    timeZone: 'America/Lima',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                }).format(new Date());
                setPeruTime(peruDate);

                const spainDate = new Intl.DateTimeFormat('es-ES', {
                    timeZone: 'Europe/Madrid',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                }).format(new Date());
                setSpainTime(spainDate);
            } catch (error) {
                console.error('Error al actualizar las horas:', error);
            }
        };

        updateTimes();
        const interval = setInterval(updateTimes, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        logout();
        toast.success('Sesion cerrada correctamente');
        navigate('/login');
    }

    const hexToRgba = (hex, alpha) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    return (
        <header 
            className="h-16 border-b transition-all duration-300"
            style={{ 
                backgroundColor: secondaryColor,
                borderColor: borderColor
            }}
        >
            <div className="flex items-center justify-between h-full px-4">
                {/* izq */}
                <div className="flex items-center space-x-4 flex-1">
                    <button 
                        onClick={toggleSidebar} 
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: textSecondary }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = hoverBg;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* barra de busqueda */}
                    <div className="hidden md:flex items-center flex-1 max-w-md">
                        <div className="relative w-full">
                            <Search 
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                                style={{ color: textSecondary }}
                            />
                            <input
                                type="text"
                                placeholder="Buscar clientes, telefonos ..."
                                className="w-full pl-10 py-2 pr-4 rounded-lg focus:outline-none transition-all"
                                style={{
                                    backgroundColor: isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)',
                                    border: `1px solid ${borderColor}`,
                                    color: textPrimary
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = primaryColor;
                                    e.target.style.boxShadow = `0 0 0 3px ${hexToRgba(primaryColor, 0.1)}`;
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = borderColor;
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* centro - relojes */}
                <div className="hidden lg:flex items-center space-x-6 mx-8">
                    {/* Hora Perú */}
                    <div 
                        className="flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors"
                        style={{ 
                            backgroundColor: isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)'
                        }}
                    >
                        <span className="text-lg" title="Perú">🇵🇪</span>
                        <div className="flex flex-col">
                            <span 
                                className="text-xs font-medium"
                                style={{ color: textSecondary }}
                            >
                                Perú
                            </span>
                            <span 
                                className="text-sm font-semibold tabular-nums"
                                style={{ color: textPrimary }}
                            >
                                {peruTime || '--:--:--'}
                            </span>
                        </div>
                    </div>

                    {/* Hora España */}
                    <div 
                        className="flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors"
                        style={{ 
                            backgroundColor: isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)'
                        }}
                    >
                        <span className="text-lg" title="España">🇪🇸</span>
                        <div className="flex flex-col">
                            <span 
                                className="text-xs font-medium"
                                style={{ color: textSecondary }}
                            >
                                España
                            </span>
                            <span 
                                className="text-sm font-semibold tabular-nums"
                                style={{ color: textPrimary }}
                            >
                                {spainTime || '--:--:--'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* der */}
                <div className="flex items-center space-x-4">
                    {/* notificaciones */}
                    <button 
                        className="relative p-2 rounded-lg transition-colors"
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = hoverBg;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        <Bell className="w-5 h-5" style={{ color: textSecondary }} />
                        <span 
                            className="absolute top-1 right-1 w-2 h-2 rounded-full transition-colors duration-300"
                            style={{ backgroundColor: primaryColor }}
                        />
                    </button>

                    {/* menu usuario */}
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center space-x-3 p-2 rounded-lg transition-colors"
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = hoverBg;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            <div 
                                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                                style={{ backgroundColor: primaryColor }}
                            >
                                <span className="text-sm font-medium text-white">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </span>
                            </div>

                            <div className="hidden md:flex flex-col text-left">
                                <p 
                                    className="text-sm font-medium"
                                    style={{ color: textPrimary }}
                                >
                                    {user?.name || 'User'}
                                </p>
                                <p 
                                    className="text-xs"
                                    style={{ color: textSecondary }}
                                >
                                    {user?.role?.name || 'Role'}
                                </p>
                            </div>
                            
                            <ChevronDown className="w-4 h-4" style={{ color: textSecondary }} />
                        </button>

                        {/* menu desplegable */}
                        {dropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setDropdownOpen(false)}
                                />

                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                        <User className="w-4 h-4 mr-3" />
                                        Mi Perfil
                                    </button>
                                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                        <Settings className="w-4 h-4 mr-3" />
                                        Configuracion
                                    </button>
                                    <hr className="my-1" />
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full px-4 py-2 text-sm transition-all"
                                        style={{ color: primaryColor }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = hexToRgba(primaryColor, 0.1);
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        <LogOut className="w-4 h-4 mr-3" />
                                        Cerrar Sesion
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Topbar;