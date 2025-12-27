import { useState } from "react";
import { Search, Clock, Download, RefreshCw, Calendar, User, Coffee, Play, Square, Eye, X, Filter, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
//import * as XLSX from 'xlsx';

// Modal de Filtros Avanzados
const FilterModal = ({ isOpen, onClose, onApply, availableUsers }) => {
    const [filters, setFilters] = useState({
        user_id: '',
        date_from: '',
        date_to: '',
        status: 'all'
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
            status: 'all'
        });
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-2xl shadow-2xl">
                    <div className="bg-gray-900 text-white px-6 py-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 flex items-center justify-center">
                                <Filter className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-lg font-semibold">Filtros Avanzados</h2>
                        </div>
                        <button onClick={onClose} className="hover:bg-white/10 p-2 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>

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

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Estado de Asistencia
                            </label>
                            <select
                                name="status"
                                value={filters.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                            >
                                <option value="all">Todas las asistencias</option>
                                <option value="in progress">En progreso</option>
                                <option value="completed">Completadas</option>
                            </select>
                        </div>

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

// Modal de Detalles de Asistencia
const AttendanceDetailModal = ({ isOpen, onClose, attendance }) => {
    if (!isOpen || !attendance) return null;

    const formatTime = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
                    <div className="bg-gray-900 text-white px-6 py-5 flex items-center justify-between sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 flex items-center justify-center">
                                <Eye className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-lg font-semibold">Detalles de Asistencia</h2>
                        </div>
                        <button onClick={onClose} className="hover:bg-white/10 p-2 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Usuario y Fecha */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-gray-50 border border-gray-200 p-4">
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                    Usuario
                                </label>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-800 flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">
                                            {attendance.user_name.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{attendance.user_name}</p>
                                        <p className="text-xs text-gray-500">ID: {attendance.user_id}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 p-4">
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                    Fecha
                                </label>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    <span className="text-sm font-bold text-gray-900">
                                        {formatDate(attendance.date)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Horarios */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-green-50 border border-green-200 p-4">
                                <label className="block text-xs font-semibold text-green-700 uppercase mb-2">
                                    Hora de Entrada
                                </label>
                                <div className="flex items-center gap-2">
                                    <Play className="w-5 h-5 text-green-600" />
                                    <span className="text-lg font-bold text-green-900">
                                        {formatTime(attendance.check_in)}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-red-50 border border-red-200 p-4">
                                <label className="block text-xs font-semibold text-red-700 uppercase mb-2">
                                    Hora de Salida
                                </label>
                                <div className="flex items-center gap-2">
                                    <Square className="w-5 h-5 text-red-600" />
                                    <span className="text-lg font-bold text-red-900">
                                        {attendance.check_out ? formatTime(attendance.check_out) : 'En curso'}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 p-4">
                                <label className="block text-xs font-semibold text-blue-700 uppercase mb-2">
                                    Horas Totales
                                </label>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-blue-600" />
                                    <span className="text-lg font-bold text-blue-900">
                                        {attendance.total_hours ? `${attendance.total_hours}h` : 'Calculando...'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Estado y Tiempo de Descanso */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-purple-50 border border-purple-200 p-4">
                                <label className="block text-xs font-semibold text-purple-700 uppercase mb-2">
                                    Tiempo de Descanso
                                </label>
                                <div className="flex items-center gap-2">
                                    <Coffee className="w-5 h-5 text-purple-600" />
                                    <span className="text-lg font-bold text-purple-900">
                                        {attendance.break_time} minutos
                                    </span>
                                </div>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 p-4">
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                    Estado
                                </label>
                                <span className={`inline-flex items-center px-3 py-1.5 text-sm font-bold ${
                                    attendance.status === 'completed'
                                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                        : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                }`}>
                                    <span className={`w-2 h-2 ${attendance.status === 'completed' ? 'bg-emerald-500' : 'bg-yellow-500'} rounded-full mr-2`}></span>
                                    {attendance.status === 'completed' ? 'Completado' : 'En Progreso'}
                                </span>
                            </div>
                        </div>

                        {/* Descansos */}
                        {attendance.breaks && attendance.breaks.length > 0 && (
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Coffee className="w-5 h-5 text-orange-600" />
                                    Registro de Descansos ({attendance.breaks.length})
                                </h3>
                                <div className="space-y-3">
                                    {attendance.breaks.map((breakItem, index) => (
                                        <div key={breakItem.id} className="bg-orange-50 border border-orange-200 p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-bold text-orange-700 uppercase">
                                                    Descanso #{index + 1}
                                                </span>
                                                <span className="text-xs font-semibold text-orange-900">
                                                    {breakItem.disconnection_type}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-3 text-sm">
                                                <div>
                                                    <span className="text-xs text-gray-600">Inicio:</span>
                                                    <p className="font-mono font-semibold text-gray-900">
                                                        {formatTime(breakItem.started_at)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-gray-600">Fin:</span>
                                                    <p className="font-mono font-semibold text-gray-900">
                                                        {breakItem.ended_at ? formatTime(breakItem.ended_at) : 'En curso'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-gray-600">Duración:</span>
                                                    <p className="font-semibold text-gray-900">
                                                        {breakItem.duration ? `${breakItem.duration} min` : 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                            {breakItem.notes && (
                                                <p className="mt-2 text-xs text-gray-700 italic">
                                                    Nota: {breakItem.notes}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Notas */}
                        {attendance.notes && (
                            <div className="border-t border-gray-200 pt-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-gray-600" />
                                    Notas Adicionales
                                </label>
                                <div className="bg-gray-50 border border-gray-200 p-4">
                                    <p className="text-sm text-gray-700">{attendance.notes}</p>
                                </div>
                            </div>
                        )}
                    </div>

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

const AttendanceReport = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState(null);
    const [activeFilters, setActiveFilters] = useState({
        user_id: '',
        date_from: '',
        date_to: '',
        status: 'all'
    });

    const [availableUsers] = useState([
        { id: 1, name: 'Juan Pablo Segundo' },
        { id: 2, name: 'Alejandro Mango' },
        { id: 3, name: 'Arnulfo Fonseca' }
    ]);

    const [attendances, setAttendances] = useState([
        {
            id: 1,
            user_id: 1,
            user_name: 'Juan Pablo Segundo',
            date: '2025-12-18',
            check_in: '2025-12-18T08:00:00',
            check_out: '2025-12-18T17:30:00',
            disconnection_type_id: null,
            break_time: 45,
            total_hours: 8.75,
            status: 'completed',
            notes: 'Día productivo sin incidencias',
            created_at: '2025-12-18T08:00:00',
            breaks: [
                {
                    id: 1,
                    attendance_id: 1,
                    disconnection_type_id: 3,
                    disconnection_type: 'BREAK',
                    started_at: '2025-12-18T12:00:00',
                    ended_at: '2025-12-18T12:30:00',
                    duration: 30,
                    notes: 'Almuerzo'
                },
                {
                    id: 2,
                    attendance_id: 1,
                    disconnection_type_id: 2,
                    disconnection_type: 'BAÑO',
                    started_at: '2025-12-18T15:00:00',
                    ended_at: '2025-12-18T15:15:00',
                    duration: 15,
                    notes: null
                }
            ]
        },
        {
            id: 2,
            user_id: 2,
            user_name: 'Alejandro Mango',
            date: '2025-12-18',
            check_in: '2025-12-18T09:00:00',
            check_out: null,
            disconnection_type_id: null,
            break_time: 30,
            total_hours: null,
            status: 'in progress',
            notes: null,
            created_at: '2025-12-18T09:00:00',
            breaks: [
                {
                    id: 3,
                    attendance_id: 2,
                    disconnection_type_id: 3,
                    disconnection_type: 'BREAK',
                    started_at: '2025-12-18T13:00:00',
                    ended_at: '2025-12-18T13:30:00',
                    duration: 30,
                    notes: 'Refrigerio'
                }
            ]
        },
        {
            id: 3,
            user_id: 3,
            user_name: 'Arnulfo Fonseca',
            date: '2025-12-17',
            check_in: '2025-12-17T07:15:00',
            check_out: '2025-12-17T16:45:00',
            disconnection_type_id: null,
            break_time: 60,
            total_hours: 8.50,
            status: 'completed',
            notes: 'Entrada anticipada por reunión',
            created_at: '2025-12-17T07:15:00',
            breaks: [
                {
                    id: 4,
                    attendance_id: 3,
                    disconnection_type_id: 3,
                    disconnection_type: 'BREAK',
                    started_at: '2025-12-17T12:30:00',
                    ended_at: '2025-12-17T13:30:00',
                    duration: 60,
                    notes: 'Almuerzo extendido'
                }
            ]
        }
    ]);

    const filteredAttendances = attendances.filter(att => {
        const matchesSearch = 
            att.user_name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesUser = !activeFilters.user_id || att.user_id === parseInt(activeFilters.user_id);

        const matchesDateFrom = !activeFilters.date_from || 
            new Date(att.date) >= new Date(activeFilters.date_from);

        const matchesDateTo = !activeFilters.date_to || 
            new Date(att.date) <= new Date(activeFilters.date_to);

        const matchesStatus = 
            activeFilters.status === 'all' || att.status === activeFilters.status;

        return matchesSearch && matchesUser && matchesDateFrom && matchesDateTo && matchesStatus;
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
            status: 'all'
        });
        toast.info('Filtros eliminados');
    };

    const handleViewDetails = (attendance) => {
        setSelectedAttendance(attendance);
        setDetailModalOpen(true);
    };

    const handleExport = () => {
        try {
            const dataToExport = filteredAttendances.map(att => ({
                'ID': att.id,
                'Usuario': att.user_name,
                'Fecha': new Date(att.date).toLocaleDateString('es-ES'),
                'Entrada': new Date(att.check_in).toLocaleTimeString('es-ES'),
                'Salida': att.check_out ? new Date(att.check_out).toLocaleTimeString('es-ES') : 'En curso',
                'Horas Totales': att.total_hours || 'N/A',
                'Tiempo Descanso (min)': att.break_time,
                'Total Descansos': att.breaks?.length || 0,
                'Estado': att.status === 'completed' ? 'Completado' : 'En Progreso',
                'Notas': att.notes || 'Sin notas'
            }));

            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Asistencias');

            worksheet['!cols'] = [
                { wch: 10 }, { wch: 25 }, { wch: 12 }, { wch: 10 },
                { wch: 10 }, { wch: 12 }, { wch: 15 }, { wch: 12 },
                { wch: 12 }, { wch: 30 }
            ];

            const fecha = new Date().toISOString().split('T')[0];
            XLSX.writeFile(workbook, `asistencias_${fecha}.xlsx`);

            toast.success('Archivo exportado correctamente');
        } catch (error) {
            toast.error('Error al exportar');
        }
    };

    const handleRefresh = () => {
        toast.success('Datos actualizados');
    };

    const formatTime = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-ES');
    };

    const hasActiveFilters = () => {
        return activeFilters.user_id || 
               activeFilters.date_from || 
               activeFilters.date_to || 
               activeFilters.status !== 'all';
    };

    const calculateTotalHours = () => {
        return filteredAttendances
            .filter(a => a.total_hours)
            .reduce((sum, a) => sum + parseFloat(a.total_hours), 0)
            .toFixed(2);
    };

    const calculateTotalBreakTime = () => {
        return filteredAttendances.reduce((sum, a) => sum + a.break_time, 0);
    };

    return (
        <div className="flex justify-center py-8 bg-gray-50">
            <div className="w-full max-w-7xl px-4">
                
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-800 shadow-sm">
                        <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">
                            Reporte de Asistencia
                        </h1>
                        <p className="text-xs text-gray-600">
                            Historial completo de entradas, salidas y descansos
                        </p>
                    </div>
                </div>

                {/* Barra de acciones */}
                <div className="bg-white border border-gray-200 shadow-sm p-5 mb-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-3 lg:space-y-0 gap-4">
                        <div className="relative flex-1 w-full lg:max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por usuario..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                            />
                        </div>

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
                                        Fecha
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Entrada
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Salida
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Horas
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Descansos
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredAttendances.map((att, index) => (
                                    <tr key={att.id} className={`transition-all hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gray-800 flex items-center justify-center mr-3 shadow-sm">
                                                    <span className="text-white font-bold">
                                                        {att.user_name.charAt(0)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900">
                                                        {att.user_name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        ID: {att.user_id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {formatDate(att.date)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Play className="w-4 h-4 text-green-600" />
                                                <span className="text-sm font-mono text-gray-700">
                                                    {formatTime(att.check_in)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {att.check_out ? (
                                                <div className="flex items-center gap-2">
                                                    <Square className="w-4 h-4 text-red-600" />
                                                    <span className="text-sm font-mono text-gray-700">
                                                        {formatTime(att.check_out)}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-yellow-600 font-semibold">
                                                    En curso...
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {att.total_hours ? (
                                                <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {att.total_hours}h
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Calculando...</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Coffee className="w-4 h-4 text-orange-600" />
                                                <span className="text-sm font-semibold text-gray-700">
                                                    {att.break_time} min ({att.breaks?.length || 0})
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span 
                                                className={`inline-flex items-center px-3 py-1.5 text-xs font-bold shadow-sm ${
                                                    att.status === 'completed'
                                                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                        : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                                }`}
                                            >
                                                <span className={`w-2 h-2 ${att.status === 'completed' ? 'bg-emerald-500' : 'bg-yellow-500'} rounded-full mr-2`}></span>
                                                {att.status === 'completed' ? 'Completado' : 'En Progreso'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end">
                                                <button
                                                    onClick={() => handleViewDetails(att)}
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

                    {filteredAttendances.length === 0 && (
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
                        <Clock className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-xs text-gray-300 uppercase tracking-wider mb-1">Total Registros</p>
                        <p className="text-2xl font-bold text-white">{attendances.length}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-5 text-center shadow-lg">
                        <div className="w-6 h-6 bg-white/30 mx-auto mb-2 flex items-center justify-center">
                            <span className="w-3 h-3 bg-white rounded-full"></span>
                        </div>
                        <p className="text-xs text-emerald-100 uppercase tracking-wider mb-1">Completados</p>
                        <p className="text-2xl font-bold text-white">
                            {attendances.filter(a => a.status === 'completed').length}
                        </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 text-center shadow-lg">
                        <Clock className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-xs text-blue-100 uppercase tracking-wider mb-1">Horas Totales</p>
                        <p className="text-2xl font-bold text-white">{calculateTotalHours()}h</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-5 text-center shadow-lg">
                        <Coffee className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-xs text-orange-100 uppercase tracking-wider mb-1">Descansos Totales</p>
                        <p className="text-2xl font-bold text-white">{calculateTotalBreakTime()} min</p>
                    </div>
                </div>

            </div>

            {/* Modales */}
            <FilterModal
                isOpen={filterModalOpen}
                onClose={() => setFilterModalOpen(false)}
                onApply={handleApplyFilters}
                availableUsers={availableUsers}
            />

            <AttendanceDetailModal
                isOpen={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                attendance={selectedAttendance}
            />
        </div>
    );
};

export default AttendanceReport;