import { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, Download, RefreshCw, Shield, X, Clock, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
//import * as XLSX from 'xlsx';

// Modal para Crear/Editar Rol
const RoleModal = ({ isOpen, onClose, onSave, editingRole, availableSchedules }) => {
    const [formData, setFormData] = useState({
        name: editingRole?.name || '',
        description: editingRole?.description || '',
        permissions: editingRole?.permissions || {},
        schedules: editingRole?.schedules || []
    });

    const permissionCategories = {
        users: {
            label: 'Gestión de Usuarios',
            permissions: {
                view_users: 'Ver usuarios',
                create_users: 'Crear usuarios',
                edit_users: 'Editar usuarios',
                delete_users: 'Eliminar usuarios'
            }
        },
        roles: {
            label: 'Gestión de Roles',
            permissions: {
                view_roles: 'Ver roles',
                create_roles: 'Crear roles',
                edit_roles: 'Editar roles',
                delete_roles: 'Eliminar roles'
            }
        },
        campaigns: {
            label: 'Gestión de Campañas',
            permissions: {
                view_campaigns: 'Ver campañas',
                create_campaigns: 'Crear campañas',
                edit_campaigns: 'Editar campañas',
                delete_campaigns: 'Eliminar campañas'
            }
        },
        reports: {
            label: 'Reportes',
            permissions: {
                view_reports: 'Ver reportes',
                export_reports: 'Exportar reportes',
                advanced_reports: 'Reportes avanzados'
            }
        },
        calls: {
            label: 'Llamadas',
            permissions: {
                make_calls: 'Realizar llamadas',
                view_call_history: 'Ver historial',
                listen_recordings: 'Escuchar grabaciones'
            }
        },
        leads: {
            label: 'Leads',
            permissions: {
                view_leads: 'Ver leads',
                edit_leads: 'Editar leads',
                assign_leads: 'Asignar leads',
                delete_leads: 'Eliminar leads'
            }
        },
        config: {
            label: 'Configuración',
            permissions: {
                view_config: 'Ver configuración',
                edit_config: 'Editar configuración',
                system_settings: 'Configuración del sistema'
            }
        },
        monitoring: {
            label: 'Monitoreo',
            permissions: {
                real_time_monitoring: 'Monitoreo en tiempo real',
                view_statistics: 'Ver estadísticas',
                agent_supervision: 'Supervisión de agentes'
            }
        }
    };

    useEffect(() => {
        if (editingRole) {
            setFormData({
                name: editingRole.name,
                description: editingRole.description,
                permissions: editingRole.permissions,
                schedules: editingRole.schedules
            });
        }
    }, [editingRole]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            toast.error('El nombre es obligatorio');
            return;
        }

        const hasPermissions = Object.values(formData.permissions).some(categoryPerms => 
            Object.values(categoryPerms).some(value => value === true)
        );

        if (!hasPermissions) {
            toast.error('Selecciona al menos un permiso');
            return;
        }

        onSave(formData);
        setFormData({ name: '', description: '', permissions: {}, schedules: [] });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const togglePermission = (category, permission) => {
        setFormData(prev => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [category]: {
                    ...prev.permissions[category],
                    [permission]: !prev.permissions[category]?.[permission]
                }
            }
        }));
    };

    const toggleCategory = (category) => {
        const categoryPermissions = permissionCategories[category].permissions;
        const allChecked = Object.keys(categoryPermissions).every(
            perm => formData.permissions[category]?.[perm]
        );

        setFormData(prev => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [category]: Object.keys(categoryPermissions).reduce((acc, perm) => ({
                    ...acc,
                    [perm]: !allChecked
                }), {})
            }
        }));
    };

    const toggleSchedule = (scheduleId) => {
        setFormData(prev => ({
            ...prev,
            schedules: prev.schedules.includes(scheduleId)
                ? prev.schedules.filter(id => id !== scheduleId)
                : [...prev.schedules, scheduleId]
        }));
    };

    const isCategoryChecked = (category) => {
        const categoryPermissions = permissionCategories[category].permissions;
        return Object.keys(categoryPermissions).every(
            perm => formData.permissions[category]?.[perm]
        );
    };

    const isCategoryPartiallyChecked = (category) => {
        const categoryPermissions = permissionCategories[category].permissions;
        const checked = Object.keys(categoryPermissions).filter(
            perm => formData.permissions[category]?.[perm]
        );
        return checked.length > 0 && checked.length < Object.keys(categoryPermissions).length;
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-4xl shadow-2xl max-h-[90vh] flex flex-col">
                    {/* Header */}
                    <div className="bg-gray-900 text-white px-6 py-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-lg font-semibold">
                                {editingRole ? 'Editar Rol' : 'Nuevo Rol'}
                            </h2>
                        </div>
                        <button onClick={onClose} className="hover:bg-white/10 p-2 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body - Scrollable */}
                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                        <div className="p-6 space-y-6">
                            {/* Información Básica */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Nombre */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nombre del Rol *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                                        placeholder="Ej: Agente de Ventas"
                                        required
                                        maxLength={100}
                                    />
                                </div>

                                {/* Descripción */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Descripción
                                    </label>
                                    <input
                                        type="text"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                                        placeholder="Breve descripción del rol"
                                        maxLength={300}
                                    />
                                </div>
                            </div>

                            {/* Horarios Asignados */}
                            {availableSchedules && availableSchedules.length > 0 && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Horarios Asignados
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 border border-gray-200 p-4">
                                        {availableSchedules.map((schedule) => (
                                            <label
                                                key={schedule.id}
                                                className={`flex items-center p-3 border-2 cursor-pointer transition-all ${
                                                    formData.schedules.includes(schedule.id)
                                                        ? 'bg-blue-50 border-blue-500'
                                                        : 'bg-white border-gray-200 hover:border-blue-300'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.schedules.includes(schedule.id)}
                                                    onChange={() => toggleSchedule(schedule.id)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                />
                                                <div className="ml-3 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-blue-600" />
                                                        <span className="text-sm font-semibold text-gray-900">
                                                            {schedule.name}
                                                        </span>
                                                    </div>
                                                    {schedule.start_time && schedule.end_time && (
                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            {schedule.start_time} - {schedule.end_time}
                                                        </p>
                                                    )}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">
                                        {formData.schedules.length} horario(s) seleccionado(s)
                                    </p>
                                </div>
                            )}

                            {/* Permisos */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Permisos del Rol *
                                </label>
                                <div className="space-y-4">
                                    {Object.keys(permissionCategories).map((category) => {
                                        const categoryData = permissionCategories[category];
                                        const isChecked = isCategoryChecked(category);
                                        const isPartial = isCategoryPartiallyChecked(category);

                                        return (
                                            <div key={category} className="border border-gray-200 bg-white">
                                                {/* Category Header */}
                                                <div 
                                                    className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${
                                                        isChecked || isPartial ? 'bg-gray-900' : 'bg-gray-100 hover:bg-gray-200'
                                                    }`}
                                                    onClick={() => toggleCategory(category)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-5 h-5 border-2 flex items-center justify-center transition-all ${
                                                            isChecked 
                                                                ? 'bg-white border-white' 
                                                                : isPartial
                                                                ? 'bg-gray-400 border-gray-400'
                                                                : 'bg-white border-gray-400'
                                                        }`}>
                                                            {isChecked && (
                                                                <svg className="w-3 h-3 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            )}
                                                            {isPartial && (
                                                                <div className="w-2 h-2 bg-white"></div>
                                                            )}
                                                        </div>
                                                        <Shield className={`w-5 h-5 ${isChecked || isPartial ? 'text-white' : 'text-gray-600'}`} />
                                                        <span className={`font-semibold ${isChecked || isPartial ? 'text-white' : 'text-gray-700'}`}>
                                                            {categoryData.label}
                                                        </span>
                                                    </div>
                                                    <span className={`text-xs font-medium ${isChecked || isPartial ? 'text-white' : 'text-gray-500'}`}>
                                                        {Object.keys(categoryData.permissions).filter(
                                                            perm => formData.permissions[category]?.[perm]
                                                        ).length} / {Object.keys(categoryData.permissions).length}
                                                    </span>
                                                </div>

                                                {/* Permissions List */}
                                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    {Object.entries(categoryData.permissions).map(([permKey, permLabel]) => (
                                                        <label
                                                            key={permKey}
                                                            className="flex items-center p-2 hover:bg-gray-50 cursor-pointer transition-colors"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.permissions[category]?.[permKey] || false}
                                                                onChange={() => togglePermission(category, permKey)}
                                                                className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-400"
                                                            />
                                                            <span className="ml-2 text-sm text-gray-700">
                                                                {permLabel}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold text-sm transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm transition-all"
                                >
                                    {editingRole ? 'Guardar Cambios' : 'Crear Rol'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

const Roles = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showInactive, setShowInactive] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    
    // Horarios disponibles (normalmente vendrían de una API)
    const [availableSchedules] = useState([
        { id: 1, name: 'Turno Mañana', start_time: '06:00', end_time: '14:00' },
        { id: 2, name: 'Turno Tarde', start_time: '14:00', end_time: '22:00' },
        { id: 3, name: 'Turno Noche', start_time: '22:00', end_time: '06:00' },
        { id: 4, name: 'Disponibilidad 24/7', start_time: null, end_time: null }
    ]);

    const [roles, setRoles] = useState([
        {
            id: 1,
            company_id: 1,
            name: 'Agente de Ventas',
            description: 'Agente encargado de realizar llamadas de ventas',
            permissions: {
                calls: { make_calls: true, view_call_history: true },
                leads: { view_leads: true, edit_leads: true }
            },
            schedules: [1, 2],
            active: true,
            created_at: '2024-01-15T10:30:00'
        },
        {
            id: 2,
            company_id: 1,
            name: 'Supervisor',
            description: 'Supervisor de equipo con acceso completo',
            permissions: {
                users: { view_users: true, edit_users: true },
                calls: { make_calls: true, view_call_history: true, listen_recordings: true },
                leads: { view_leads: true, edit_leads: true, assign_leads: true },
                monitoring: { real_time_monitoring: true, view_statistics: true, agent_supervision: true }
            },
            schedules: [1, 2, 3],
            active: true,
            created_at: '2024-01-20T11:00:00'
        },
        {
            id: 3,
            company_id: 1,
            name: 'Administrador',
            description: 'Acceso total al sistema',
            permissions: {
                users: { view_users: true, create_users: true, edit_users: true, delete_users: true },
                roles: { view_roles: true, create_roles: true, edit_roles: true, delete_roles: true },
                campaigns: { view_campaigns: true, create_campaigns: true, edit_campaigns: true, delete_campaigns: true },
                reports: { view_reports: true, export_reports: true, advanced_reports: true },
                config: { view_config: true, edit_config: true, system_settings: true }
            },
            schedules: [4],
            active: true,
            created_at: '2024-01-10T09:00:00'
        }
    ]);

    const filteredRoles = roles.filter(role => {
        const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             role.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = showInactive ? !role.active : role.active;
        return matchesSearch && matchesStatus;
    });

    const handleOpenModal = (role = null) => {
        setEditingRole(role);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingRole(null);
    };

    const handleSave = (formData) => {
        if (editingRole) {
            setRoles(roles.map(r =>
                r.id === editingRole.id
                    ? { 
                        ...r, 
                        name: formData.name,
                        description: formData.description,
                        permissions: formData.permissions,
                        schedules: formData.schedules
                    }
                    : r
            ));
            toast.success('Rol actualizado correctamente');
        } else {
            const newRole = {
                id: roles.length + 1,
                company_id: 1,
                name: formData.name,
                description: formData.description,
                permissions: formData.permissions,
                schedules: formData.schedules,
                active: true,
                created_at: new Date().toISOString()
            };
            setRoles([...roles, newRole]);
            toast.success('Rol creado correctamente');
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de eliminar este rol?')) {
            setRoles(roles.filter(r => r.id !== id));
            toast.success('Rol eliminado correctamente');
        }
    };

    const toggleStatus = (id) => {
        setRoles(roles.map(r =>
            r.id === id ? { ...r, active: !r.active } : r
        ));
        toast.success('Estado actualizado');
    };

    const handleExport = () => {
        try {
            const dataToExport = filteredRoles.map(role => ({
                'ID': role.id,
                'Nombre': role.name,
                'Descripción': role.description || 'Sin descripción',
                'Permisos': Object.keys(role.permissions).length,
                'Horarios': role.schedules.length,
                'Estado': role.active ? 'Activo' : 'Inactivo',
                'Fecha Creación': new Date(role.created_at).toLocaleDateString('es-ES'),
            }));

            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Roles');

            worksheet['!cols'] = [
                { wch: 10 }, { wch: 25 }, { wch: 40 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 15 }
            ];

            const fecha = new Date().toISOString().split('T')[0];
            XLSX.writeFile(workbook, `roles_${fecha}.xlsx`);

            toast.success('Archivo exportado correctamente');
        } catch (error) {
            toast.error('Error al exportar');
        }
    };

    const handleRefresh = () => {
        toast.success('Datos actualizados');
    };

    const countPermissions = (permissions) => {
        let count = 0;
        Object.values(permissions).forEach(category => {
            Object.values(category).forEach(value => {
                if (value === true) count++;
            });
        });
        return count;
    };

    const getScheduleNames = (scheduleIds) => {
        return scheduleIds.map(id => {
            const schedule = availableSchedules.find(s => s.id === id);
            return schedule?.name || '';
        }).filter(Boolean);
    };

    return (
        <div className="flex justify-center py-8 bg-gray-50">
            <div className="w-full max-w-6xl px-4">
                
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-800 shadow-sm">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">
                            Gestión de Roles
                        </h1>
                        <p className="text-xs text-gray-600">
                            Administra roles y permisos del sistema
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
                                placeholder="Buscar por nombre o descripción..."
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
                                <Shield className="w-4 h-4 mr-2" />
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
                                        Rol
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Descripción
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Permisos
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Horarios
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
                                {filteredRoles.map((role, index) => (
                                    <tr key={role.id} className={`transition-all hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gray-800 flex items-center justify-center mr-3 shadow-sm">
                                                    <Shield className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900">
                                                        {role.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        ID: {role.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-700">
                                                {role.description || 'Sin descripción'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-3 py-1.5 text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                                                <Shield className="w-3 h-3 mr-1" />
                                                {countPermissions(role.permissions)} permisos
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {getScheduleNames(role.schedules).map((name, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200"
                                                    >
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {name}
                                                    </span>
                                                ))}
                                                {role.schedules.length === 0 && (
                                                    <span className="text-xs text-gray-400 italic">
                                                        Sin horarios
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span 
                                                className={`inline-flex items-center px-3 py-1.5 text-xs font-bold shadow-sm ${
                                                    role.active
                                                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                        : 'bg-red-100 text-red-700 border border-red-200'
                                                }`}
                                            >
                                                <span className={`w-2 h-2 ${role.active ? 'bg-emerald-500' : 'bg-red-500'} rounded-full mr-2`}></span>
                                                {role.active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => toggleStatus(role.id)}
                                                    className={`p-2 transition-colors border ${
                                                        role.active 
                                                            ? 'bg-orange-50 hover:bg-orange-100 border-orange-200'
                                                            : 'bg-green-50 hover:bg-green-100 border-green-200'
                                                    }`}
                                                    title={role.active ? 'Desactivar' : 'Activar'}
                                                >
                                                    <Shield className={`w-4 h-4 ${role.active ? 'text-orange-600' : 'text-green-600'}`} />
                                                </button>
                                                <button 
                                                    onClick={() => handleOpenModal(role)}
                                                    className="p-2 bg-red-50 hover:bg-red-100 transition-colors border border-red-200"
                                                    title="Editar"
                                                >
                                                    <Pencil className="w-4 h-4 text-red-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(role.id)}
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
                    {filteredRoles.length === 0 && (
                        <div className="text-center py-16 bg-gray-50">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white border-2 border-gray-200 mb-4 shadow-sm">
                                <Search className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-gray-700 font-bold text-lg">No se encontraron roles</p>
                            <p className="text-gray-500 text-sm mt-2">
                                {showInactive 
                                    ? 'No hay roles inactivos' 
                                    : 'Intenta con otros términos de búsqueda'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Stats footer */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 text-center shadow-lg">
                        <Shield className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-xs text-gray-300 uppercase tracking-wider mb-1">Total Roles</p>
                        <p className="text-2xl font-bold text-white">{roles.length}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-5 text-center shadow-lg">
                        <div className="w-6 h-6 bg-white/30 mx-auto mb-2 flex items-center justify-center">
                            <span className="w-3 h-3 bg-white rounded-full"></span>
                        </div>
                        <p className="text-xs text-emerald-100 uppercase tracking-wider mb-1">Activos</p>
                        <p className="text-2xl font-bold text-white">{roles.filter(r => r.active).length}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-red-600 to-red-700 p-5 text-center shadow-lg">
                        <div className="w-6 h-6 bg-white/30 mx-auto mb-2 flex items-center justify-center">
                            <span className="w-3 h-3 bg-white rounded-full"></span>
                        </div>
                        <p className="text-xs text-red-100 uppercase tracking-wider mb-1">Inactivos</p>
                        <p className="text-2xl font-bold text-white">{roles.filter(r => !r.active).length}</p>
                    </div>
                </div>

            </div>

            {/* Modal */}
            <RoleModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                editingRole={editingRole}
                availableSchedules={availableSchedules}
            />
        </div>
    );
};

export default Roles;