import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const { login } = useAuthStore()
    const { setTheme } = useThemeStore()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await authAPI.login(email, password);

            // Guardar datos en stores
            login(response.data.user, response.data.token, response.data.company);
            setTheme(response.data.company);

            toast.success('¡Bienvenido de nuevo!');
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.error || 'Error al iniciar sesión';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }

    }

    return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            CRM Call Center
          </h1>
          <p className="text-gray-600">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin@dreamteam.pe"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800 font-medium mb-1">
              Credenciales de prueba:
            </p>
            <p className="text-xs text-blue-600">
              Email: admin@dreamteam.pe
            </p>
            <p className="text-xs text-blue-600">
              Password: admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

