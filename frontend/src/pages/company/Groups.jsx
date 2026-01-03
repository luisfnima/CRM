// frontend/src/pages/RolesPage.jsx
import { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, Download, RefreshCw, Shield, X, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import roleService from "../../services/roleService";
import scheduleService from "../../services/scheduleService";

// Modal para Crear/Editar Rol
const RoleModal = ({ isOpen, onClose, onSave, editingRole, availableSchedules }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        role_type: 'agent',
        permissions: {},
        schedules: []
    });

    const roleTypes = [
        { value: 'admin', label: 'Administrador' },
        { value: 'supervisor', label: 'Supervisor' },
        { value: 'backoffice', label: 'Back Office' },
        { value: 'agent', label: 'Agente' }
    ];

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
                name: editingRole.name || '',
                description: editingRole.description || '',
                role_type: editingRole.role_type || 'agent',
                permissions: editingRole.permissions || {},
                schedules: editingRole.schedules || []
            });
        } else {
            setFormData({
                name: '',
                description: '',
                role_type: 'agent',
                permissions: {},
                schedules: []
            });
        }
    }, [editingRole, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            toast.error('El nombre es obligatorio');
            return;
        }

        if (!formData.role_type) {
            toast.error('El tipo de rol es obligatorio');
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
        
        setFormData({ 
            name: '', 
            description: '', 
            role_type: 'agent',
            permissions: {}, 
            schedules: [] 
        });
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
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-4xl shadow-2xl max-h-[90vh] flex flex-col rounded-lg">
                    <div className="bg-gray-900 text-white px-6 py-5 flex items-center justify-between rounded-t-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 flex items-center justify-center rounded">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-lg font-semibold">
                                {editingRole ? 'Editar Rol' : 'Nuevo Rol'}
                            </h2>
                        </div>
                        <button onClick={onClose} className="hover:bg-white/10 p-2 transition-colors rounded">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nombre del Rol *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all rounded"
                                        placeholder="Ej: Agente de Ventas"
                                        required
                                        maxLength={100}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Tipo de Rol *
                                    </label>
                                    <select
                                        name="role_type"
                                        value={formData.role_type}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all rounded"
                                        required
                                    >
                                        {roleTypes.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Descripción
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all rounded resize-none"
                                        placeholder="Breve descripción del rol"
                                        rows="2"
                                        maxLength={300}
                                    />
                                </div>
                            </div>

                            {/* Horarios */}
                            {availableSchedules && availableSchedules.length > 0 && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Horarios Asignados
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 border border-gray-200 p-4 rounded-lg">
                                        {availableSchedules.map((schedule) => (
                                            <label
                                                key={schedule.id}
                                                className={`flex items-center p-3 border-2 cursor-pointer transition-all rounded ${
                                                    formData.schedules.includes(schedule.id)
                                                        ? 'bg-blue-50 border-blue-500'
                                                        : 'bg-white border-gray-200 hover:border-blue-300'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.schedules.includes(schedule.id)}
                                                    onChange={() => toggleSchedule(schedule.id)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded"
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
                                            <div key={category} className="border border-gray-200 bg-white rounded-lg overflow-hidden">
                                                <div 
                                                    className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${
                                                        isChecked || isPartial ? 'bg-gray-900' : 'bg-gray-100 hover:bg-gray-200'
                                                    }`}
                                                    onClick={() => toggleCategory(category)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-5 h-5 border-2 flex items-center justify-center transition-all rounded ${
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
                                                                <div className="w-2 h-2 bg-white rounded-sm"></div>
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

                                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    {Object.entries(categoryData.permissions).map(([permKey, permLabel]) => (
                                                        <label
                                                            key={permKey}
                                                            className="flex items-center p-2 hover:bg-gray-50 cursor-pointer transition-colors rounded"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.permissions[category]?.[permKey] || false}
                                                                onChange={() => togglePermission(category, permKey)}
                                                                className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-400 rounded"
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

                        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-lg">
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold text-sm transition-all rounded"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm transition-all rounded"
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

const RolesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('active');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState([]);
    const [availableSchedules, setAvailableSchedules] = useState([]);

    useEffect(() => {
        loadData();
    }, [statusFilter]);

    const loadData = async () => {
        try {
            setLoading(true);
            
            const [rolesResponse, schedulesResponse] = await Promise.all([
                roleService.getAll(),
                scheduleService.getAll()
            ]);

            // Extraer data según la estructura de respuesta
            const rolesData = rolesResponse.data || rolesResponse || [];
            const schedulesData = schedulesResponse.data || schedulesResponse || [];

            // Filtrar por status
            const filteredRoles = statusFilter === 'all' 
                ? rolesData 
                : rolesData.filter(role => {
                    const isActive = role.active !== false; // Por defecto true si no existe
                    return statusFilter === 'active' ? isActive : !isActive;
                });

            setRoles(filteredRoles);
            setAvailableSchedules(schedulesData);
            
            toast.success('Datos cargados correctamente');
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error(error.response?.data?.error || error.message || 'Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    const filteredRoles = roles.filter(role => {
        const matchesSearch = 
            role.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            role.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            role.role_type?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const handleOpenModal = (role = null) => {
        setEditingRole(role);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingRole(null);
    };

    const handleSave = async (formData) => {
        try {
            if (editingRole) {
                await roleService.update(editingRole.id, formData);
                toast.success('Rol actualizado correctamente');
            } else {
                await roleService.create(formData);
                toast.success('Rol creado correctamente');
            }
            
            loadData();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving role:', error);
            const errorMessage = error.response?.data?.error || error.message || 'Error al guardar rol';
            toast.error(errorMessage);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este rol?')) {
            try {
                await roleService.delete(id);
                toast.success('Rol eliminado correctamente');
                loadData();
            } catch (error) {
                console.error('Error deleting role:', error);
                toast.error(error.response?.data?.error || error.message || 'Error al eliminar rol');
            }
        }
    };

    const toggleFilter = () => {
        setStatusFilter(prev => prev === 'active' ? 'inactive' : 'active');
    };

    const handleExport = () => {
        try {
            const dataToExport = filteredRoles.map(role => ({
                'Nombre': role.name,
                'Tipo': getRoleTypeLabel(role.role_type),
                'Descripción': role.description || 'Sin descripción',
                'Permisos': countPermissions(role.permissions),
                'Estado': role.active !== false ? 'Activo' : 'Inactivo',
                'Usuarios': role._count?.users || 0,
                'Creado': new Date(role.created_at).toLocaleDateString('es-ES')
            }));

            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Roles');

            const fecha = new Date().toISOString().split('T')[0];
            XLSX.writeFile(workbook, `roles_${fecha}.xlsx`);

            toast.success('Archivo exportado correctamente');
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Error al exportar');
        }
    };

    const countPermissions = (permissions) => {
        if (!permissions || typeof permissions !== 'object') return 0;
        let count = 0;
        Object.values(permissions).forEach(category => {
            if (category && typeof category === 'object') {
                Object.values(category).forEach(value => {
                    if (value === true) count++;
                });
            }
        });
        return count;
    };

    const getRoleTypeLabel = (type) => {
        const types = {
            'admin': 'Administrador',
            'supervisor': 'Supervisor',
            'backoffice': 'Back Office',
            'agent': 'Agente'
        };
        return types[type] || type;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600 font-semibold">Cargando roles...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center py-4 bg-gray-50 min-h-screen">
            <div className="w-full max-w-7xl px-4">
                
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-l-4 border-red-600 px-6 py-4 mb-4 shadow-md rounded-tr-lg rounded-br-lg">
                    <div className="flex items-center gap-3">
                        <Shield className="w-7 h-7 text-white" />
                        <h1 className="text-2xl font-bold text-white">
                            Gestión de Roles
                        </h1>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 shadow-sm p-4 mb-4 rounded-lg">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-3 lg:space-y-0 gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre, tipo o descripción..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all rounded text-sm"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                            <button 
                                onClick={toggleFilter}
                                className={`flex items-center justify-center px-4 py-2.5 text-white font-semibold transition-all shadow-md hover:shadow-lg rounded text-sm ${
                                    statusFilter === 'active' 
                                        ? 'bg-emerald-600 hover:bg-emerald-700'
                                        : 'bg-red-600 hover:bg-red-700'
                                }`}
                            >
                                <Shield className="w-4 h-4 mr-2" />
                                {statusFilter === 'active' ? 'Ver Inactivos' : 'Ver Activos'}
                            </button>

                            <button 
                                onClick={() => handleOpenModal()}
                                className="flex items-center justify-center px-4 py-2.5 bg-gray-800 text-white hover:bg-gray-900 transition-all shadow-md hover:shadow-lg font-semibold text-sm rounded"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Crear Rol
                            </button>
                            
                            <button 
                                onClick={loadData}
                                className="flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-semibold text-sm rounded"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Actualizar
                            </button>
                            
                            <button 
                                onClick={handleExport}
                                className="flex items-center justify-center px-4 py-2.5 bg-gray-800 text-white hover:bg-gray-900 transition-all shadow-md hover:shadow-lg font-semibold text-sm rounded"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Exportar
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 shadow-lg overflow-hidden mb-4 rounded-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-900">
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider rounded-tl-lg">
                                        Rol
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Tipo
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Descripción
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Permisos
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Usuarios
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider rounded-tr-lg">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredRoles.map((role, index) => (
                                    <tr key={role.id} className={`transition-all hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-purple-600 flex items-center justify-center mr-3 shadow-sm rounded">
                                                    <Shield className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900">
                                                        {role.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200 rounded">
                                                {getRoleTypeLabel(role.role_type)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-700">
                                                {role.description || 'Sin descripción'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200 rounded">
                                                <Shield className="w-3 h-3 mr-1" />
                                                {countPermissions(role.permissions)} permisos
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600">
                                                {role._count?.users || 0} usuario(s)
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button 
                                                    onClick={() => handleOpenModal(role)}
                                                    className="p-2 bg-red-50 hover:bg-red-100 transition-colors border border-red-200 rounded"
                                                    title="Editar"
                                                >
                                                    <Pencil className="w-4 h-4 text-red-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(role.id)}
                                                    className="p-2 bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-300 rounded"
                                                    title="Eliminar"
                                                    disabled={role._count?.users > 0}
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

                    {filteredRoles.length === 0 && (
                        <div className="text-center py-16 bg-gray-50">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white border-2 border-gray-200 mb-4 shadow-sm rounded">
                                <Search className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-gray-700 font-bold text-lg">No se encontraron roles</p>
                            <p className="text-gray-500 text-sm mt-2">
                                Intenta con otros términos de búsqueda
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end">
                    <div className="bg-white border border-gray-200 shadow-md px-6 py-3 inline-flex items-center gap-6 rounded-lg">
                        <div className="text-center">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total</p>
                            <p className="text-lg font-bold text-gray-800">{roles.length}</p>
                        </div>
                        <div className="w-px h-10 bg-gray-300"></div>
                        <div className="text-center">
                            <p className="text-xs text-emerald-600 uppercase tracking-wider mb-1">Activos</p>
                            <p className="text-lg font-bold text-emerald-600">
                                {roles.filter(r => r.active !== false).length}
                            </p>
                        </div>
                        <div className="w-px h-10 bg-gray-300"></div>
                        <div className="text-center">
                            <p className="text-xs text-red-600 uppercase tracking-wider mb-1">Inactivos</p>
                            <p className="text-lg font-bold text-red-600">
                                {roles.filter(r => r.active === false).length}
                            </p>
                        </div>
                    </div>
                </div>

            </div>

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

export default RolesPage;