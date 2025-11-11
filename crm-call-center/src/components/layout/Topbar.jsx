import { useState } from "react";
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
    const { user, logout } = useAuthStore();
    const Navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success('Sesion cerrada correctamente');
        Navigate('/login');
    }

    return (
        <header className="bg-whitebar border-b border-gray-200 h-16" >
            <div className="flex items-center justify-between h-full px-4">
                {/** izq */}
                <div className="flex items-center space-x-4 flex-1">
                    <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Menu className="w-5 h-5 text-gray-600" />
                    </button>

                    {/** barra de busqueda */}
                    <div className="hidden md:flex items-center flex-1 max-w-md">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar clientes, telefonos ..."
                                className="w-full pl-10 py-2 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/** der */}
                <div className="flex items-center space-x-4">

                    {/** notificaciones */}
                    <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/** menu usuario */}
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex item-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justifiy-center">
                                <span className="text-sm font-medium text-white">
                                    {user?.name?.charAt(0) || 'U'}
                                </span>
                            </div>

                            <div className="hidden md:block text-left">
                                <p className="text-xs font-medium text-gray-700">
                                    {user?.name || 'User'}
                                </p>
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-xs font-medium text-gray-700">
                                    {user?.role || 'Role'}
                                </p>
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                        </button>

                        {/** menu desplegable */}
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