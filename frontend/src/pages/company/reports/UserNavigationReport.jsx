import { useState } from "react";
import { Search, Navigation, Download, RefreshCw, Calendar, Clock, MousePointer, Monitor, ExternalLink, X, Filter, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

// Modal de Filtros Avanzados
const FilterModal = ({ isOpen, onClose, onApply, availableUsers, availableActions }) => {
    const [filters, setFilters] = useState({
        user_id: '',
        action: '',
        date_from: '',
        date_to: '',
        page_url: ''
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
            action: '',
            date_from: '',
            date_to: '',
            page_url: ''
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

                        {/* Tipo de Acción */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Tipo de Acción
                            </label>
                            <select
                                name="action"
                                value={filters.action}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                            >
                                <option value="">Todas las acciones</option>
                                {availableActions.map(action => (
                                    <option key={action} value={action}>
                                        {action}
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

                        {/* URL de Página */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                URL de Página
                            </label>
                            <input
                                type="text"
                                name="page_url"
                                value={filters.page_url}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                                placeholder="Ej: /dashboard, /usuarios"
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

// Modal de Detalles de Navegación
const NavigationDetailModal = ({ isOpen, onClose, navigation }) => {
    if (!isOpen || !navigation) return null;

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-3xl shadow-2xl">
                    {/* Header */}
                    <div className="bg-gray-900 text-white px-6 py-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 flex items-center justify-center">
                                <Eye className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-lg font-semibold">
                                Detalles de Navegación
                            </h2>
                        </div>
                        <button onClick={onClose} className="hover:bg-white/10 p-2 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                    ID de Navegación
                                </label>
                                <p className="text-sm font-mono text-gray-900">#{navigation.id}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                    ID de Sesión
                                </label>
                                <p className="text-sm font-mono text-gray-900">#{navigation.session_id}</p>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                Usuario
                            </label>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-800 flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">
                                        {navigation.user_name.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{navigation.user_name}</p>
                                    <p className="text-xs text-gray-500">{navigation.user_email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                Página Visitada
                            </label>
                            <p className="text-lg font-bold text-gray-900 mb-1">{navigation.page_title || 'Sin título'}</p>
                            <p className="text-sm font-mono text-blue-600 break-all">{navigation.page_url}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                    Acción Realizada
                                </label>
                                <span className="inline-flex items-center px-3 py-1.5 text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                                    <MousePointer className="w-3 h-3 mr-1" />
                                    {navigation.action || 'N/A'}
                                </span>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                    Fecha y Hora
                                </label>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm font-mono text-gray-900">
                                        {new Date(navigation.visited_at).toLocaleString('es-ES')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                        <button
                            onClick={onClose}
                            className="w-full px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm transition-all"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

const UserNavigationReport = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedNavigation, setSelectedNavigation] = useState(null);
    const [activeFilters, setActiveFilters] = useState({
        user_id: '',
        action: '',
        date_from: '',
        date_to: '',
        page_url: ''
    });

    // Usuarios disponibles
    const [availableUsers] = useState([
        { id: 1, name: 'Juan Pablo Segundo', email: 'jsegundo@dreamteam.pe' },
        { id: 2, name: 'Alejandro Mango', email: 'amangop@dreamteam.pe' },
        { id: 3, name: 'Arnulfo Fonseca', email: 'afonseca@dreamteam.pe' }
    ]);

    // Acciones disponibles
    const [availableActions] = useState([
        'view', 'click', 'submit', 'edit', 'delete', 'create', 'search', 'export', 'download'
    ]);

    const [navigations, setNavigations] = useState([
        {
            id: 1,
            session_id: 1,
            user_id: 1,
            user_name: 'Juan Pablo Segundo',
            user_email: 'jsegundo@dreamteam.pe',
            page_url: '/dashboard',
            page_title: 'Panel Principal',
            action: 'view',
            visited_at: '2025-12-18T08:30:15'
        },
        {
            id: 2,
            session_id: 1,
            user_id: 1,
            user_name: 'Juan Pablo Segundo',
            user_email: 'jsegundo@dreamteam.pe',
            page_url: '/usuarios',
            page_title: 'Gestión de Usuarios',
            action: 'view',
            visited_at: '2025-12-18T08:35:22'
        },
        {
            id: 3,
            session_id: 1,
            user_id: 1,
            user_name: 'Juan Pablo Segundo',
            user_email: 'jsegundo@dreamteam.pe',
            page_url: '/usuarios/crear',
            page_title: 'Crear Usuario',
            action: 'create',
            visited_at: '2025-12-18T08:40:10'
        },
        {
            id: 4,
            session_id: 2,
            user_id: 2,
            user_name: 'Alejandro Mango',
            user_email: 'amangop@dreamteam.pe',
            page_url: '/reportes/sesiones',
            page_title: 'Reporte de Sesiones',
            action: 'view',
            visited_at: '2025-12-18T09:05:30'
        },
        {
            id: 5,
            session_id: 2,
            user_id: 2,
            user_name: 'Alejandro Mango',
            user_email: 'amangop@dreamteam.pe',
            page_url: '/reportes/sesiones',
            page_title: 'Reporte de Sesiones',
            action: 'export',
            visited_at: '2025-12-18T09:10:45'
        },
        {
            id: 6,
            session_id: 3,
            user_id: 3,
            user_name: 'Arnulfo Fonseca',
            user_email: 'afonseca@dreamteam.pe',
            page_url: '/config/empresa',
            page_title: 'Configuración de Empresa',
            action: 'view',
            visited_at: '2025-12-18T07:20:00'
        },
        {
            id: 7,
            session_id: 3,
            user_id: 3,
            user_name: 'Arnulfo Fonseca',
            user_email: 'afonseca@dreamteam.pe',
            page_url: '/config/empresa',
            page_title: 'Configuración de Empresa',
            action: 'edit',
            visited_at: '2025-12-18T07:25:30'
        }
    ]);

    const filteredNavigations = navigations.filter(nav => {
        // Búsqueda por texto
        const matchesSearch = 
            nav.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            nav.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            nav.page_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
            nav.page_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            nav.action?.toLowerCase().includes(searchTerm.toLowerCase());

        // Filtro por usuario
        const matchesUser = !activeFilters.user_id || nav.user_id === parseInt(activeFilters.user_id);

        // Filtro por acción
        const matchesAction = !activeFilters.action || nav.action === activeFilters.action;

        // Filtro por fecha desde
        const matchesDateFrom = !activeFilters.date_from || 
            new Date(nav.visited_at) >= new Date(activeFilters.date_from);

        // Filtro por fecha hasta
        const matchesDateTo = !activeFilters.date_to || 
            new Date(nav.visited_at) <= new Date(activeFilters.date_to + 'T23:59:59');

        // Filtro por URL
        const matchesUrl = !activeFilters.page_url || 
            nav.page_url.toLowerCase().includes(activeFilters.page_url.toLowerCase());

        return matchesSearch && matchesUser && matchesAction && matchesDateFrom && matchesDateTo && matchesUrl;
    });

    const handleApplyFilters = (filters) => {
        setActiveFilters(filters);
        toast.success('Filtros aplicados');
    };

    const handleClearFilters = () => {
        setActiveFilters({
            user_id: '',
            action: '',
            date_from: '',
            date_to: '',
            page_url: ''
        });
        toast.info('Filtros eliminados');
    };

    const handleViewDetails = (navigation) => {
        setSelectedNavigation(navigation);
        setDetailModalOpen(true);
    };

    const handleExport = () => {
        try {
            const dataToExport = filteredNavigations.map(nav => ({
                'ID': nav.id,
                'Sesión': nav.session_id,
                'Usuario': nav.user_name,
                'Email': nav.user_email,
                'Página': nav.page_title || 'Sin título',
                'URL': nav.page_url,
                'Acción': nav.action || 'N/A',
                'Fecha y Hora': new Date(nav.visited_at).toLocaleString('es-ES'),
            }));

            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Navegación');

            worksheet['!cols'] = [
                { wch: 10 }, { wch: 10 }, { wch: 25 }, { wch: 30 },
                { wch: 30 }, { wch: 40 }, { wch: 15 }, { wch: 20 }
            ];

            const fecha = new Date().toISOString().split('T')[0];
            XLSX.writeFile(workbook, `navegacion_usuarios_${fecha}.xlsx`);

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
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getActionColor = (action) => {
        const colors = {
            view: 'bg-blue-100 text-blue-700 border-blue-200',
            click: 'bg-purple-100 text-purple-700 border-purple-200',
            submit: 'bg-green-100 text-green-700 border-green-200',
            edit: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            delete: 'bg-red-100 text-red-700 border-red-200',
            create: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            search: 'bg-cyan-100 text-cyan-700 border-cyan-200',
            export: 'bg-indigo-100 text-indigo-700 border-indigo-200',
            download: 'bg-pink-100 text-pink-700 border-pink-200'
        };
        return colors[action] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const hasActiveFilters = () => {
        return activeFilters.user_id || 
               activeFilters.action || 
               activeFilters.date_from || 
               activeFilters.date_to || 
               activeFilters.page_url;
    };

    return (
        <div className="flex justify-center py-8 bg-gray-50">
            <div className="w-full max-w-7xl px-4">
                
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-800 shadow-sm">
                        <Navigation className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">
                            Navegación de Usuarios
                        </h1>
                        <p className="text-xs text-gray-600">
                            Registro completo de movimientos y acciones en el sistema
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
                                placeholder="Buscar por usuario, página, acción..."
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
                                        Página Visitada
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        URL
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Acción
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Fecha y Hora
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredNavigations.map((nav, index) => (
                                    <tr key={nav.id} className={`transition-all hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gray-800 flex items-center justify-center mr-3 shadow-sm">
                                                    <span className="text-white font-bold">
                                                        {nav.user_name.charAt(0)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900">
                                                        {nav.user_name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Sesión #{nav.session_id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Monitor className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {nav.page_title || 'Sin título'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-mono text-gray-700">
                                                {nav.page_url}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {nav.action ? (
                                                <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold border ${getActionColor(nav.action)}`}>
                                                    <MousePointer className="w-3 h-3 mr-1" />
                                                    {nav.action}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-gray-600" />
                                                <span className="text-sm font-mono text-gray-700">
                                                    {formatDateTime(nav.visited_at)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end">
                                                <button
                                                    onClick={() => handleViewDetails(nav)}
                                                    className="p-2 bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200"
                                                    title="Ver detalles"
                                                >
                                                    <Eye className="w-4 h-4 text-blue-600" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty state */}
                    {filteredNavigations.length === 0 && (
                        <div className="text-center py-16 bg-gray-50">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white border-2 border-gray-200 mb-4 shadow-sm">
                                <Search className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-gray-700 font-bold text-lg">No se encontraron registros</p>
                            <p className="text-gray-500 text-sm mt-2">
                                Intenta ajustar los filtros o términos de búsqueda
                            </p>
                        </div>
                    )}
                </div>

                {/* Stats footer */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 text-center shadow-lg">
                        <Navigation className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-xs text-gray-300 uppercase tracking-wider mb-1">Total Navegaciones</p>
                        <p className="text-2xl font-bold text-white">{navigations.length}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 text-center shadow-lg">
                        <Monitor className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-xs text-blue-100 uppercase tracking-wider mb-1">Páginas Únicas</p>
                        <p className="text-2xl font-bold text-white">
                            {new Set(navigations.map(n => n.page_url)).size}
                        </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 text-center shadow-lg">
                        <MousePointer className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-xs text-purple-100 uppercase tracking-wider mb-1">Acciones Realizadas</p>
                        <p className="text-2xl font-bold text-white">
                            {navigations.filter(n => n.action).length}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 text-center shadow-lg">
                        <ExternalLink className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-xs text-green-100 uppercase tracking-wider mb-1">Resultados Filtrados</p>
                        <p className="text-2xl font-bold text-white">{filteredNavigations.length}</p>
                    </div>
                </div>

            </div>

            {/* Modales */}
            <FilterModal
                isOpen={filterModalOpen}
                onClose={() => setFilterModalOpen(false)}
                onApply={handleApplyFilters}
                availableUsers={availableUsers}
                availableActions={availableActions}
            />

            <NavigationDetailModal
                isOpen={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                navigation={selectedNavigation}
            />
        </div>
    );
};

export default UserNavigationReport;