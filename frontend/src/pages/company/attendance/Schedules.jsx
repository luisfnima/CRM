import { useState } from "react";
import { Plus, Search, Pencil, Trash2, Download, RefreshCw, Clock, Calendar, X } from 'lucide-react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

// Modal para Crear/Editar Horario
const ScheduleModal = ({ isOpen, onClose, onSave, editingSchedule }) => {
    const [formData, setFormData] = useState({
        name: editingSchedule?.name || '',
        start_time: editingSchedule?.start_time || '09:00',
        end_time: editingSchedule?.end_time || '18:00',
        is_24_hours: editingSchedule?.is_24_hours || false,
        week_days: editingSchedule?.week_days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    });

    const daysOfWeek = [
        { value: 'monday', label: 'Lunes' },
        { value: 'tuesday', label: 'Martes' },
        { value: 'wednesday', label: 'Miércoles' },
        { value: 'thursday', label: 'Jueves' },
        { value: 'friday', label: 'Viernes' },
        { value: 'saturday', label: 'Sábado' },
        { value: 'sunday', label: 'Domingo' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            toast.error('El nombre es obligatorio');
            return;
        }

        if (formData.week_days.length === 0) {
            toast.error('Selecciona al menos un día de la semana');
            return;
        }

        if (!formData.is_24_hours && formData.start_time >= formData.end_time) {
            toast.error('La hora de inicio debe ser menor que la hora de fin');
            return;
        }

        onSave(formData);
        setFormData({ 
            name: '', 
            start_time: '09:00', 
            end_time: '18:00', 
            is_24_hours: false,
            week_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const toggleDay = (day) => {
        setFormData(prev => ({
            ...prev,
            week_days: prev.week_days.includes(day)
                ? prev.week_days.filter(d => d !== day)
                : [...prev.week_days, day]
        }));
    };

    const selectAllDays = () => {
        setFormData(prev => ({
            ...prev,
            week_days: daysOfWeek.map(d => d.value)
        }));
    };

    const clearAllDays = () => {
        setFormData(prev => ({
            ...prev,
            week_days: []
        }));
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="bg-gray-900 text-white px-6 py-5 flex items-center justify-between sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-lg font-semibold">
                                {editingSchedule ? 'Editar Horario' : 'Nuevo Horario'}
                            </h2>
                        </div>
                        <button onClick={onClose} className="hover:bg-white/10 p-2 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Campo: Nombre */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Nombre del Horario *
                            </label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                                    placeholder="Ej: Turno Mañana"
                                    required
                                    maxLength={100}
                                />
                            </div>
                        </div>

                        {/* Checkbox: 24 Horas */}
                        <div className="bg-gray-50 border border-gray-200 p-4">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_24_hours"
                                    checked={formData.is_24_hours}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-gray-900 border-gray-300 focus:ring-gray-400"
                                />
                                <span className="ml-3 text-sm font-semibold text-gray-700">
                                    Horario 24 horas (sin restricción de tiempo)
                                </span>
                            </label>
                        </div>

                        {/* Horarios de Inicio y Fin */}
                        {!formData.is_24_hours && (
                            <div className="grid grid-cols-2 gap-4">
                                {/* Hora Inicio */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Hora de Inicio *
                                    </label>
                                    <input
                                        type="time"
                                        name="start_time"
                                        value={formData.start_time}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                                        required={!formData.is_24_hours}
                                    />
                                </div>

                                {/* Hora Fin */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Hora de Fin *
                                    </label>
                                    <input
                                        type="time"
                                        name="end_time"
                                        value={formData.end_time}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                                        required={!formData.is_24_hours}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Días de la Semana */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Días de la Semana *
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={selectAllDays}
                                        className="text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        Todos
                                    </button>
                                    <span className="text-gray-400">|</span>
                                    <button
                                        type="button"
                                        onClick={clearAllDays}
                                        className="text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        Ninguno
                                    </button>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {daysOfWeek.map((day) => (
                                    <button
                                        key={day.value}
                                        type="button"
                                        onClick={() => toggleDay(day.value)}
                                        className={`py-2.5 px-3 border text-sm font-semibold transition-all ${
                                            formData.week_days.includes(day.value)
                                                ? 'bg-gray-900 text-white border-gray-900'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {day.label}
                                    </button>
                                ))}
                            </div>
                            <p className="mt-2 text-xs text-gray-500">
                                {formData.week_days.length} día(s) seleccionado(s)
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4 border-t border-gray-200">
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
                                {editingSchedule ? 'Guardar Cambios' : 'Crear Horario'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

const Schedules = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showInactive, setShowInactive] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [schedules, setSchedules] = useState([
        {
            id: 1,
            company_id: 1,
            name: 'Turno Mañana',
            start_time: '06:00',
            end_time: '14:00',
            week_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
            is_24_hours: false,
            active: true,
            created_at: '2024-01-15T10:30:00'
        },
        {
            id: 2,
            company_id: 1,
            name: 'Turno Tarde',
            start_time: '14:00',
            end_time: '22:00',
            week_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
            is_24_hours: false,
            active: true,
            created_at: '2024-02-20T14:15:00'
        },
        {
            id: 3,
            company_id: 1,
            name: 'Turno Noche',
            start_time: '22:00',
            end_time: '06:00',
            week_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
            is_24_hours: false,
            active: false,
            created_at: '2024-03-10T09:00:00'
        },
        {
            id: 4,
            company_id: 1,
            name: 'Disponibilidad 24/7',
            start_time: null,
            end_time: null,
            week_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
            is_24_hours: true,
            active: true,
            created_at: '2024-04-05T11:20:00'
        },
    ]);

    const filteredSchedules = schedules.filter(schedule => {
        const matchesSearch = schedule.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = showInactive ? !schedule.active : schedule.active;
        return matchesSearch && matchesStatus;
    });

    const handleOpenModal = (schedule = null) => {
        setEditingSchedule(schedule);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingSchedule(null);
    };

    const handleSave = (formData) => {
        if (editingSchedule) {
            // Editar horario existente
            setSchedules(schedules.map(s =>
                s.id === editingSchedule.id
                    ? { 
                        ...s, 
                        name: formData.name,
                        start_time: formData.is_24_hours ? null : formData.start_time,
                        end_time: formData.is_24_hours ? null : formData.end_time,
                        week_days: formData.week_days,
                        is_24_hours: formData.is_24_hours
                    }
                    : s
            ));
            toast.success('Horario actualizado correctamente');
        } else {
            // Crear nuevo horario
            const newSchedule = {
                id: schedules.length + 1,
                company_id: 1,
                name: formData.name,
                start_time: formData.is_24_hours ? null : formData.start_time,
                end_time: formData.is_24_hours ? null : formData.end_time,
                week_days: formData.week_days,
                is_24_hours: formData.is_24_hours,
                active: true,
                created_at: new Date().toISOString()
            };
            setSchedules([...schedules, newSchedule]);
            toast.success('Horario creado correctamente');
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de eliminar este horario?')) {
            setSchedules(schedules.filter(s => s.id !== id));
            toast.success('Horario eliminado correctamente');
        }
    };

    const toggleStatus = (id) => {
        setSchedules(schedules.map(s =>
            s.id === id ? { ...s, active: !s.active } : s
        ));
        toast.success('Estado actualizado');
    };

    const handleExport = () => {
        try {
            const dataToExport = filteredSchedules.map(schedule => ({
                'ID': schedule.id,
                'Nombre': schedule.name,
                'Hora Inicio': schedule.is_24_hours ? '24 Horas' : schedule.start_time,
                'Hora Fin': schedule.is_24_hours ? '24 Horas' : schedule.end_time,
                'Días': formatWeekDays(schedule.week_days),
                'Tipo': schedule.is_24_hours ? '24 Horas' : 'Horario Fijo',
                'Estado': schedule.active ? 'Activo' : 'Inactivo',
                'Fecha Creación': new Date(schedule.created_at).toLocaleDateString('es-ES'),
            }));

            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Horarios');

            worksheet['!cols'] = [
                { wch: 10 }, { wch: 25 }, { wch: 12 }, { wch: 12 },
                { wch: 30 }, { wch: 15 }, { wch: 10 }, { wch: 15 }
            ];

            const fecha = new Date().toISOString().split('T')[0];
            XLSX.writeFile(workbook, `horarios_${fecha}.xlsx`);

            toast.success('Archivo exportado correctamente');
        } catch (error) {
            toast.error('Error al exportar');
        }
    };

    const handleRefresh = () => {
        toast.success('Datos actualizados');
    };

    const formatWeekDays = (days) => {
        const dayNames = {
            monday: 'Lun',
            tuesday: 'Mar',
            wednesday: 'Mié',
            thursday: 'Jue',
            friday: 'Vie',
            saturday: 'Sáb',
            sunday: 'Dom'
        };
        return days.map(day => dayNames[day] || day).join(', ');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="flex justify-center py-8 bg-gray-50">
            <div className="w-full max-w-6xl px-4">
                
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-800 shadow-sm">
                        <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">
                            Gestión de Horarios
                        </h1>
                        <p className="text-xs text-gray-600">
                            Administra los horarios de trabajo y turnos
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
                                placeholder="Buscar por nombre..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                            <button 
                                onClick={() => handleOpenModal()}
                                className="flex items-center justify-center px-4 py-2.5 bg-gray-800 text-white hover:bg-gray-900 transition-all shadow-md hover:shadow-lg font-semibold text-sm"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Crear Nuevo
                            </button>
                            
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
                            
                            <button 
                                onClick={() => setShowInactive(!showInactive)}
                                className={`flex items-center justify-center px-4 py-2.5 transition-all shadow-md hover:shadow-lg font-semibold text-sm ${
                                    showInactive 
                                        ? 'bg-red-600 text-white hover:bg-red-700' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                <Clock className="w-4 h-4 mr-2" />
                                {showInactive ? 'Ver Activos' : 'Ver Inactivos'}
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
                                        Nombre
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Horario
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Días
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
                                {filteredSchedules.map((schedule, index) => (
                                    <tr key={schedule.id} className={`transition-all hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gray-800 flex items-center justify-center mr-3 shadow-sm">
                                                    <Clock className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900">
                                                        {schedule.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        ID: {schedule.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 text-red-600 mr-2 flex-shrink-0" />
                                                {schedule.is_24_hours ? (
                                                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                                                        24 HORAS
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-gray-700 font-medium">
                                                        {schedule.start_time} - {schedule.end_time}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600 font-medium">
                                                {formatWeekDays(schedule.week_days)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span 
                                                className={`inline-flex items-center px-3 py-1.5 text-xs font-bold shadow-sm ${
                                                    schedule.active
                                                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                        : 'bg-red-100 text-red-700 border border-red-200'
                                                }`}
                                            >
                                                <span className={`w-2 h-2 ${schedule.active ? 'bg-emerald-500' : 'bg-red-500'} rounded-full mr-2`}></span>
                                                {schedule.active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => toggleStatus(schedule.id)}
                                                    className={`p-2 transition-colors border ${
                                                        schedule.active 
                                                            ? 'bg-orange-50 hover:bg-orange-100 border-orange-200'
                                                            : 'bg-green-50 hover:bg-green-100 border-green-200'
                                                    }`}
                                                    title={schedule.active ? 'Desactivar' : 'Activar'}
                                                >
                                                    <Clock className={`w-4 h-4 ${schedule.active ? 'text-orange-600' : 'text-green-600'}`} />
                                                </button>
                                                <button 
                                                    onClick={() => handleOpenModal(schedule)}
                                                    className="p-2 bg-red-50 hover:bg-red-100 transition-colors border border-red-200"
                                                    title="Editar"
                                                >
                                                    <Pencil className="w-4 h-4 text-red-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(schedule.id)}
                                                    className="p-2 bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-300"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4 text-gray-800" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty state */}
                    {filteredSchedules.length === 0 && (
                        <div className="text-center py-16 bg-gray-50">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white border-2 border-gray-200 mb-4 shadow-sm">
                                <Search className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-gray-700 font-bold text-lg">No se encontraron horarios</p>
                            <p className="text-gray-500 text-sm mt-2">
                                {showInactive 
                                    ? 'No hay horarios inactivos' 
                                    : 'Intenta con otros términos de búsqueda'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Stats footer */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 text-center shadow-lg">
                        <Clock className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-xs text-gray-300 uppercase tracking-wider mb-1">Total Horarios</p>
                        <p className="text-2xl font-bold text-white">{schedules.length}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-5 text-center shadow-lg">
                        <div className="w-6 h-6 bg-white/30 mx-auto mb-2 flex items-center justify-center">
                            <span className="w-3 h-3 bg-white rounded-full"></span>
                        </div>
                        <p className="text-xs text-emerald-100 uppercase tracking-wider mb-1">Activos</p>
                        <p className="text-2xl font-bold text-white">{schedules.filter(s => s.active).length}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-red-600 to-red-700 p-5 text-center shadow-lg">
                        <div className="w-6 h-6 bg-white/30 mx-auto mb-2 flex items-center justify-center">
                            <span className="w-3 h-3 bg-white rounded-full"></span>
                        </div>
                        <p className="text-xs text-red-100 uppercase tracking-wider mb-1">Inactivos</p>
                        <p className="text-2xl font-bold text-white">{schedules.filter(s => !s.active).length}</p>
                    </div>
                </div>

            </div>

            {/* Modal */}
            <ScheduleModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                editingSchedule={editingSchedule}
            />
        </div>
    );
};

export default Schedules;