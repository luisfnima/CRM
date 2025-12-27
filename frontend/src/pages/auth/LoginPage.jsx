import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Mail, Lock, Eye, EyeOff, UserCircle } from "lucide-react";
import { authAPI } from "../../services/api";
import { useAuthStore } from "../../store/authStore";      // ← CAMBIO AQUÍ
import { useThemeStore } from "../../store/themeStore";    // ← CAMBIO AQUÍ
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { login } = useAuthStore();
    const { setTheme } = useThemeStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authAPI.login(email, password);
            const { user, token, company } = response.data;

            // Guardar datos en stores
            login(user, token, company);
            setTheme(company);

            toast.success('¡Bienvenido de nuevo!');
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.error || 
                               error.response?.data?.message || 
                               'Error al iniciar sesión';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Panel Izquierdo - Decorativo */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 relative overflow-hidden">
                {/* Formas decorativas */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                
                {/* Contenido del panel */}
                <div className="relative z-10 flex flex-col justify-center px-12 text-white">
                    <div className="mb-8">
                        <Building2 className="w-16 h-16 text-red-500 mb-6" />
                        <h1 className="text-5xl font-black mb-4 leading-tight">
                            Bienvenido a<br />
                            <span className="text-red-500">DreamTeam</span>
                        </h1>
                        <p className="text-xl text-gray-300 leading-relaxed">
                            Sistema de gestión integral para call centers
                        </p>
                    </div>
                    
                    <div className="space-y-4 mt-8">
                        <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Gestión Completa</h3>
                                <p className="text-gray-400 text-sm">Control total de leads, llamadas y campañas</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Reportes en Tiempo Real</h3>
                                <p className="text-gray-400 text-sm">Analíticas avanzadas y KPIs actualizados</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Seguridad Empresarial</h3>
                                <p className="text-gray-400 text-sm">Protección de datos y accesos controlados</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Panel Derecho - Formulario */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6 py-12">
                <div className="max-w-md w-full">
                    {/* Logo y título para móviles */}
                    <div className="text-center mb-8 lg:hidden">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl mb-4 shadow-lg">
                            <Building2 className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            DreamTeam <span className="text-red-600">CRM</span>
                        </h1>
                    </div>

                    {/* Encabezado del formulario */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Iniciar Sesión
                        </h2>
                        <p className="text-gray-600">
                            Ingresa tus credenciales para acceder al sistema
                        </p>
                    </div>

                    {/* Formulario */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Campo Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Correo Electrónico
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                        placeholder="usuario@dreamteam.pe"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Campo Contraseña */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                        placeholder="••••••••"
                                        required
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                        disabled={loading}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Recordar sesión */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                        Recordar sesión
                                    </label>
                                </div>
                                <a href="#" className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </div>

                            {/* Botón de envío */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Ingresando...
                                    </span>
                                ) : (
                                    'Iniciar Sesión'
                                )}
                            </button>
                        </form>

                        {/* Credenciales de prueba */}
                        <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg">
                            <div className="flex items-start">
                                <UserCircle className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                                <div>
                                    <p className="text-xs font-semibold text-red-900 mb-2">
                                        Credenciales de Prueba:
                                    </p>
                                    <p className="text-xs text-red-700 font-mono">
                                        <strong>Email:</strong> admin@dreamteam.pe
                                    </p>
                                    <p className="text-xs text-red-700 font-mono">
                                        <strong>Password:</strong> admin123
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="mt-8 text-center text-sm text-gray-600">
                        © 2025 DreamTeam. Todos los derechos reservados.
                    </p>
                </div>
            </div>

            {/* Estilos para las animaciones - SIN jsx */}
            <style>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                
                .animate-blob {
                    animation: blob 7s infinite;
                }
                
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
};

export default LoginPage;