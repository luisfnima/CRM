import { useState } from "react";
import { Search, Activity, Download, RefreshCw, Calendar, Clock, Monitor, MapPin, X, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

// Modal de Filtros Avanzados
const FilterModal = ({ isOpen, onClose, onApply, availableUsers }) => {
    const [filters, setFilters] = useState({
        user_id: '',
        date_from: '',
        date_to: '',
        is_active: 'all',
        ip_address: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onApply(filters);
        onClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleReset = () => {
        setFilters({
            user_id: '',
            date_from: '',
            date_to: '',
            is_active: 'all',
            ip_address: ''
        });
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-2xl shadow-2xl">
                    {/* Header */}
                    <div className="bg-gray-900 text-white px-6 py-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 flex items-center justify-center">
                                <Filter className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-lg font-semibold">
                                Filtros Avanzados
                            </h2>
                        </div>
                        <button onClick={onClose} className="hover:bg-white/10 p-2 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Usuario */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Filtrar por Usuario
                            </label>
                            <select
                                name="user_id"
                                value={filters.user_id}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                            >
                                <option value="">Todos los usuarios</option>
                                {availableUsers.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Rango de Fechas */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Fecha Desde
                                </label>
                                <input
                                    type="date"
                                    name="date_from"
                                    value={filters.date_from}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Fecha Hasta
                                </label>
                                <input
                                    type="date"
                                    name="date_to"
                                    value={filters.date_to}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {/* Estado de Sesión */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Estado de Sesión
                            </label>
                            <select
                                name="is_active"
                                value={filters.is_active}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                            >
                                <option value="all">Todas las sesiones</option>
                                <option value="active">Solo activas</option>
                                <option value="inactive">Solo finalizadas</option>
                            </select>
                        </div>

                        {/* IP Address */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Dirección IP
                            </label>
                            <input
                                type="text"
                                name="ip_address"
                                value={filters.ip_address}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                                placeholder="Ej: 192.168.1.1"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm transition-all"
                            >
                                Limpiar Filtros
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm transition-all"
                            >
                                Aplicar Filtros
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

const SessionsReport = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({
        user_id: '',
        date_from: '',
        date_to: '',
        is_active: 'all',
        ip_address: ''
    });

    // Usuarios disponibles (normalmente vendría de una API)
    const [availableUsers] = useState([
        { id: 1, name: 'Juan Pablo Segundo', email: 'jsegundo@dreamteam.pe' },
        { id: 2, name: 'Alejandro Mango', email: 'amangop@dreamteam.pe' },
        { id: 3, name: 'Arnulfo Fonseca', email: 'afonseca@dreamteam.pe' }
    ]);

    const [sessions, setSessions] = useState([
        {
            id: 1,
            user_id: 1,
            user_name: 'Juan Pablo Segundo',
            user_email: 'jsegundo@dreamteam.pe',
            ip_address: '192.168.1.101',
            user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            started_at: '2025-12-18T08:30:00',
            ended_at: '2025-12-18T17:45:00',
            is_active: false,
            created_at: '2025-12-18T08:30:00'
        },
        {
            id: 2,
            user_id: 2,
            user_name: 'Alejandro Mango',
            user_email: 'amangop@dreamteam.pe',
            ip_address: '192.168.1.102',
            user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            started_at: '2025-12-18T09:00:00',
            ended_at: null,
            is_active: true,
            created_at: '2025-12-18T09:00:00'
        },
        {
            id: 3,
            user_id: 3,
            user_name: 'Arnulfo Fonseca',
            user_email: 'afonseca@dreamteam.pe',
            ip_address: '192.168.1.103',
            user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
            started_at: '2025-12-18T07:15:00',
            ended_at: '2025-12-18T16:30:00',
            is_active: false,
            created_at: '2025-12-18T07:15:00'
        },
        {
            id: 4,
            user_id: 1,
            user_name: 'Juan Pablo Segundo',
            user_email: 'jsegundo@dreamteam.pe',
            ip_address: '192.168.1.101',
            user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            started_at: '2025-12-17T08:45:00',
            ended_at: '2025-12-17T18:00:00',
            is_active: false,
            created_at: '2025-12-17T08:45:00'
        }
    ]);

    const filteredSessions = sessions.filter(session => {
        // Búsqueda por texto
        const matchesSearch = 
            session.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.ip_address.toLowerCase().includes(searchTerm.toLowerCase());

        // Filtro por usuario
        const matchesUser = !activeFilters.user_id || session.user_id === parseInt(activeFilters.user_id);

        // Filtro por fecha desde
        const matchesDateFrom = !activeFilters.date_from || 
            new Date(session.started_at) >= new Date(activeFilters.date_from);

        // Filtro por fecha hasta
        const matchesDateTo = !activeFilters.date_to || 
            new Date(session.started_at) <= new Date(activeFilters.date_to + 'T23:59:59');

        // Filtro por estado
        const matchesStatus = 
            activeFilters.is_active === 'all' ||
            (activeFilters.is_active === 'active' && session.is_active) ||
            (activeFilters.is_active === 'inactive' && !session.is_active);

        // Filtro por IP
        const matchesIp = !activeFilters.ip_address || 
            session.ip_address.includes(activeFilters.ip_address);

        return matchesSearch && matchesUser && matchesDateFrom && matchesDateTo && matchesStatus && matchesIp;
    });

    const handleApplyFilters = (filters) => {
        setActiveFilters(filters);
        toast.success('Filtros aplicados');
    };

    const handleClearFilters = () => {
        setActiveFilters({
            user_id: '',
            date_from: '',
            date_to: '',
            is_active: 'all',
            ip_address: ''
        });
        toast.info('Filtros eliminados');
    };

    const handleExport = () => {
        try {
            const dataToExport = filteredSessions.map(session => ({
                'ID': session.id,
                'Usuario': session.user_name,
                'Email': session.user_email,
                'IP': session.ip_address,
                'Navegador': getBrowserName(session.user_agent),
                'Inicio Sesión': formatDateTime(session.started_at),
                'Fin Sesión': session.ended_at ? formatDateTime(session.ended_at) : 'Activa',
                'Duración': session.ended_at ? calculateDuration(session.started_at, session.ended_at) : 'En curso',
                'Estado': session.is_active ? 'Activa' : 'Finalizada',
            }));

            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sesiones');

            worksheet['!cols'] = [
                { wch: 10 }, { wch: 25 }, { wch: 30 }, { wch: 15 },
                { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 12 }
            ];

            const fecha = new Date().toISOString().split('T')[0];
            XLSX.writeFile(workbook, `sesiones_${fecha}.xlsx`);

            toast.success('Archivo exportado correctamente');
        } catch (error) {
            toast.error('Error al exportar');
        }
    };

    const handleRefresh = () => {
        toast.success('Datos actualizados');
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateDuration = (start, end) => {
        if (!start || !end) return 'N/A';
        const diffMs = new Date(end) - new Date(start);
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    const getBrowserName = (userAgent) => {
        if (!userAgent) return 'Desconocido';
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Safari')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Edge';
        return 'Otro';
    };

    const getOSName = (userAgent) => {
        if (!userAgent) return 'Desconocido';
        if (userAgent.includes('Windows')) return 'Windows';
        if (userAgent.includes('Mac OS')) return 'MacOS';
        if (userAgent.includes('Linux')) return 'Linux';
        if (userAgent.includes('Android')) return 'Android';
        if (userAgent.includes('iOS')) return 'iOS';
        return 'Otro';
    };

    const hasActiveFilters = () => {
        return activeFilters.user_id || 
               activeFilters.date_from || 
               activeFilters.date_to || 
               activeFilters.is_active !== 'all' || 
               activeFilters.ip_address;
    };

    return (
        <div className="flex justify-center py-8 bg-gray-50">
            <div className="w-full max-w-7xl px-4">
                
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-800 shadow-sm">
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">
                            Reporte de Sesiones
                        </h1>
                        <p className="text-xs text-gray-600">
                            Movimientos y actividad de usuarios en el sistema
                        </p>
                    </div>
                </div>

                {/* Barra de acciones */}
                <div className="bg-white border border-gray-200 shadow-sm p-5 mb-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-3 lg:space-y-0 gap-4">
                        {/* Search */}
                        <div className="relative flex-1 w-full lg:max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por usuario, email o IP..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                            <button 
                                onClick={() => setFilterModalOpen(true)}
                                className={`flex items-center justify-center px-4 py-2.5 transition-all shadow-md hover:shadow-lg font-semibold text-sm ${
                                    hasActiveFilters()
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-800 text-white hover:bg-gray-900'
                                }`}
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Filtros {hasActiveFilters() && '(Activos)'}
                            </button>

                            {hasActiveFilters() && (
                                <button 
                                    onClick={handleClearFilters}
                                    className="flex items-center justify-center px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 transition-all shadow-md hover:shadow-lg font-semibold text-sm"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Limpiar
                                </button>
                            )}
                            
                            <button 
                                onClick={handleRefresh}
                                className="flex items-center justify-center px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 transition-all shadow-md hover:shadow-lg font-semibold text-sm"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Actualizar
                            </button>
                            
                            <button 
                                onClick={handleExport}
                                className="flex items-center justify-center px-4 py-2.5 bg-gray-800 text-white hover:bg-gray-900 transition-all shadow-md hover:shadow-lg font-semibold text-sm"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Exportar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabla */}
                <div className="bg-white border border-gray-200 shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-900">
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Usuario
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        IP / Dispositivo
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Inicio Sesión
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Fin Sesión
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Duración
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Estado
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredSessions.map((session, index) => (
                                    <tr key={session.id} className={`transition-all hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gray-800 flex items-center justify-center mr-3 shadow-sm">
                                                    <span className="text-white font-bold">
                                                        {session.user_name.charAt(0)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900">
                                                        {session.user_name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {session.user_email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-blue-600" />
                                                    <span className="text-sm font-mono text-gray-700">
                                                        {session.ip_address}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Monitor className="w-4 h-4 text-gray-600" />
                                                    <span className="text-xs text-gray-600">
                                                        {getBrowserName(session.user_agent)} / {getOSName(session.user_agent)}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-green-600" />
                                                <span className="text-sm text-gray-700 font-mono">
                                                    {formatDateTime(session.started_at)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {session.ended_at ? (
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-red-600" />
                                                    <span className="text-sm text-gray-700 font-mono">
                                                        {formatDateTime(session.ended_at)}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400 italic">
                                                    En curso...
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-purple-600" />
                                                <span className="text-sm font-semibold text-gray-700">
                                                    {session.ended_at 
                                                        ? calculateDuration(session.started_at, session.ended_at)
                                                        : 'En curso'
                                                    }
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span 
                                                className={`inline-flex items-center px-3 py-1.5 text-xs font-bold shadow-sm ${
                                                    session.is_active
                                                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                                                }`}
                                            >
                                                <span className={`w-2 h-2 ${session.is_active ? 'bg-emerald-500' : 'bg-gray-500'} rounded-full mr-2`}></span>
                                                {session.is_active ? 'Activa' : 'Finalizada'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty state */}
                    {filteredSessions.length === 0 && (
                        <div className="text-center py-16 bg-gray-50">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white border-2 border-gray-200 mb-4 shadow-sm">
                                <Search className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-gray-700 font-bold text-lg">No se encontraron sesiones</p>
                            <p className="text-gray-500 text-sm mt-2">
                                Intenta ajustar los filtros o términos de búsqueda
                            </p>
                        </div>
                    )}
                </div>

                {/* Stats footer */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 text-center shadow-lg">
                        <Activity className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-xs text-gray-300 uppercase tracking-wider mb-1">Total Sesiones</p>
                        <p className="text-2xl font-bold text-white">{sessions.length}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-5 text-center shadow-lg">
                        <div className="w-6 h-6 bg-white/30 mx-auto mb-2 flex items-center justify-center">
                            <span className="w-3 h-3 bg-white rounded-full"></span>
                        </div>
                        <p className="text-xs text-emerald-100 uppercase tracking-wider mb-1">Activas</p>
                        <p className="text-2xl font-bold text-white">{sessions.filter(s => s.is_active).length}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-gray-500 to-gray-600 p-5 text-center shadow-lg">
                        <div className="w-6 h-6 bg-white/30 mx-auto mb-2 flex items-center justify-center">
                            <span className="w-3 h-3 bg-white rounded-full"></span>
                        </div>
                        <p className="text-xs text-gray-100 uppercase tracking-wider mb-1">Finalizadas</p>
                        <p className="text-2xl font-bold text-white">{sessions.filter(s => !s.is_active).length}</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 text-center shadow-lg">
                        <Monitor className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-xs text-blue-100 uppercase tracking-wider mb-1">Resultados Filtrados</p>
                        <p className="text-2xl font-bold text-white">{filteredSessions.length}</p>
                    </div>
                </div>

            </div>

            {/* Modal de Filtros */}
            <FilterModal
                isOpen={filterModalOpen}
                onClose={() => setFilterModalOpen(false)}
                onApply={handleApplyFilters}
                availableUsers={availableUsers}
            />
        </div>
    );
};

export default SessionsReport;