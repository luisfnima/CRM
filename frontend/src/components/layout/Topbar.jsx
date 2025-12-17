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
import toast from 'react-hot-toast';

const Topbar = ({ toggleSidebar }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [peruTime, setPeruTime] = useState('');
    const [spainTime, setSpainTime] = useState('');
    const { user, logout } = useAuthStore();
    const Navigate = useNavigate();

    useEffect(() => {
        const updateTimes = () => {
            try {
                // Hora de Perú (GMT-5)
                const peruDate = new Intl.DateTimeFormat('es-PE', {
                    timeZone: 'America/Lima',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                }).format(new Date());
                setPeruTime(peruDate);

                // Hora de España (GMT+1)
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
        Navigate('/login');
    }

    return (
        <header className="bg-white border-b border-gray-200 h-16">
            <div className="flex items-center justify-between h-full px-4">
                {/* izq */}
                <div className="flex items-center space-x-4 flex-1">
                    <button 
                        onClick={toggleSidebar} 
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <Menu className="w-5 h-5 text-gray-600" />
                    </button>

                    {/* barra de busqueda */}
                    <div className="hidden md:flex items-center flex-1 max-w-md">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar clientes, telefonos ..."
                                className="w-full pl-10 py-2 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* centro - relojes */}
                <div className="hidden lg:flex items-center space-x-6 mx-8">
                    {/* Hora Perú */}
                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                        <span className="text-lg" title="Perú">🇵🇪</span>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 font-medium">Perú</span>
                            <span className="text-sm font-semibold text-gray-700 tabular-nums">
                                {peruTime || '--:--:--'}
                            </span>
                        </div>
                    </div>

                    {/* Hora España */}
                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                        <span className="text-lg" title="España">🇪🇸</span>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 font-medium">España</span>
                            <span className="text-sm font-semibold text-gray-700 tabular-nums">
                                {spainTime || '--:--:--'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* der */}
                <div className="flex items-center space-x-4">
                    {/* notificaciones */}
                    <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* menu usuario */}
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-medium text-white">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </span>
                            </div>

                            <div className="hidden md:flex flex-col text-left">
                                <p className="text-sm font-medium text-gray-700">
                                    {user?.name || 'User'}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {user?.role?.name || 'Role'}
                                </p>
                            </div>
                            
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                        </button>

                        {/* menu desplegable */}
                        {dropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setDropdownOpen(false)}
                                />

                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        <User className="w-4 h-4 mr-3" />
                                        Mi Perfil
                                    </button>
                                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        <Settings className="w-4 h-4 mr-3" />
                                        Configuracion
                                    </button>
                                    <hr className="my-1" />
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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