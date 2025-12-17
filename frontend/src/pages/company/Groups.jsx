import { useState } from "react";
import { Plus, Search, Pencil, Trash2, Download, RefreshCw, UserX, UserCheck, X, Shield } from 'lucide-react'
import toast from 'react-hot-toast';

// Modal Component
const GroupModal = ({ isOpen, onClose, onSubmit, editingGroup }) => {
    const [formData, setFormData] = useState({
        name: editingGroup?.name || '',
        schedule: editingGroup?.schedule || '',
        ips: editingGroup?.ips || '',
        permissions: editingGroup?.permissions || []
    });

    const availablePermissions = [
        { id: 'users', label: 'Gestión de Usuarios', description: 'Crear, editar y eliminar usuarios' },
        { id: 'groups', label: 'Gestión de Grupos', description: 'Administrar grupos de usuarios' },
        { id: 'campaigns', label: 'Gestión de Campañas', description: 'Crear y modificar campañas' },
        { id: 'reports', label: 'Ver Reportes', description: 'Acceso a todos los reportes' },
        { id: 'calls', label: 'Gestión de Llamadas', description: 'Realizar y gestionar llamadas' },
        { id: 'leads', label: 'Gestión de Leads', description: 'Ver y editar información de leads' },
        { id: 'config', label: 'Configuración', description: 'Acceso a configuración del sistema' },
        { id: 'monitoring', label: 'Monitoreo', description: 'Monitorear actividad en tiempo real' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({
            name: '',
            schedule: '',
            ips: '',
            permissions: []
        });
        onClose();
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const togglePermission = (permissionId) => {
        setFormData(prev => ({
            ...prev,
            permissions: prev.permissions.includes(permissionId)
                ? prev.permissions.filter(p => p !== permissionId)
                : [...prev.permissions, permissionId]
        }));
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">
                            {editingGroup ? 'Editar Grupo' : 'Crear Nuevo Grupo'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                        <div className="space-y-5">
                            {/* Nombre */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre del Grupo <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                    placeholder="Ej: Agentes de Ventas"
                                />
                            </div>

                            {/* Horario e IPs en la misma fila */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Horario */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Horario
                                    </label>
                                    <input
                                        type="text"
                                        name="schedule"
                                        value={formData.schedule}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                        placeholder="Ej: 8:00 AM - 5:00 PM"
                                    />
                                </div>

                                {/* IPs */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rango de IPs <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="ips"
                                        value={formData.ips}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                        placeholder="Ej: 192.168.1.1 - 192.168.1.50"
                                    />
                                </div>
                            </div>

                            {/* Permisos */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Permisos <span className="text-red-600">*</span>
                                </label>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {availablePermissions.map((permission) => (
                                            <label
                                                key={permission.id}
                                                className={`
                                                    flex items-start p-3 rounded-lg border-2 cursor-pointer transition-all
                                                    ${formData.permissions.includes(permission.id)
                                                        ? 'bg-red-50 border-red-500'
                                                        : 'bg-white border-gray-200 hover:border-red-300'
                                                    }
                                                `}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.permissions.includes(permission.id)}
                                                    onChange={() => togglePermission(permission.id)}
                                                    className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                                />
                                                <div className="ml-3">
                                                    <div className="flex items-center gap-2">
                                                        <Shield className="w-4 h-4 text-red-600" />
                                                        <span className="text-sm font-semibold text-gray-900">
                                                            {permission.label}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {permission.description}
                                                    </p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <p className="mt-2 text-xs text-gray-500">
                                    Selecciona los permisos que tendrá este grupo de usuarios
                                </p>
                            </div>

                            {/* Resumen de permisos seleccionados */}
                            {formData.permissions.length > 0 && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Shield className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm font-semibold text-blue-900">
                                            Permisos seleccionados: {formData.permissions.length}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.permissions.map(permId => {
                                            const perm = availablePermissions.find(p => p.id === permId);
                                            return (
                                                <span
                                                    key={permId}
                                                    className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium"
                                                >
                                                    {perm?.label}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer con botones */}
                        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold shadow-lg hover:shadow-xl"
                            >
                                {editingGroup ? 'Guardar Cambios' : 'Crear Grupo'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

// Main Component
const Groups = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showInactive, setShowInactive] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
    const [groups, setGroups] = useState([
        {
            id: 1,
            name: 'Agentes Energía',
            ips: '192.168.1.10 - 192.168.1.50',
            schedule: '8:00 AM - 5:00 PM',
            permissions: ['calls', 'leads', 'reports'],
            status: 'Activo'
        },
        {
            id: 2,
            name: 'Agentes Telefonía',
            ips: '192.168.2.10 - 192.168.2.50',
            schedule: '9:00 AM - 6:00 PM',
            permissions: ['calls', 'leads'],
            status: 'Activo'
        },
    ]);

    const filteredGroups = groups.filter(group => {
        const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             group.ips.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = showInactive ? group.status === 'Inactivo' : true;
        return matchesSearch && matchesStatus;
    });

    const handleAddGroup = (formData) => {
        const newGroup = {
            id: groups.length + 1,
            name: formData.name,
            ips: formData.ips,
            schedule: formData.schedule,
            permissions: formData.permissions,
            status: 'Activo'
        };
        setGroups([...groups, newGroup]);
        toast.success('Grupo creado correctamente');
    };

    const handleEditGroup = (formData) => {
        setGroups(groups.map(g => 
            g.id === editingGroup.id 
                ? {
                    ...g,
                    name: formData.name,
                    ips: formData.ips,
                    schedule: formData.schedule,
                    permissions: formData.permissions
                }
                : g
        ));
        toast.success('Grupo actualizado correctamente');
        setEditingGroup(null);
    };

    const handleDelete = (id) => {
        if(window.confirm('¿Estás seguro de eliminar este grupo?')){
            setGroups(groups.filter(g => g.id !== id));
            toast.success('Grupo eliminado correctamente');
        }
    };

    const toggleStatus = (id) => {
        setGroups(groups.map(g =>
            g.id === id
            ? { ...g, status: g.status === 'Activo' ? 'Inactivo' : 'Activo' } : g 
        ));
        toast.success('Estado actualizado');
    };

    const openEditModal = (group) => {
        setEditingGroup(group);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setEditingGroup(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingGroup(null);
    };

    const handleExport = () => {
        toast.success('Exportando datos...');
    };

    const handleRefresh = () => {
        toast.success('Datos actualizados');
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-red-600 rounded-lg">
                        <UserCheck className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Grupos de Usuarios
                    </h1>
                </div>
                <p className="text-gray-600 ml-14">
                    Define roles y permisos para grupos de usuarios
                </p>
            </div>

            {/* Actions bar */}
            <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-md border border-gray-200 p-5 mb-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-3 lg:space-y-0 gap-4">
                    {/* Search */}
                    <div className="relative flex-1 w-full lg:max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar grupos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-white"
                        />
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                        <button 
                            onClick={openAddModal}
                            className="flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-md hover:shadow-lg font-semibold"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Crear Nuevo
                        </button>
                        
                        <button 
                            onClick={handleRefresh}
                            className="flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-md hover:shadow-lg font-semibold"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Actualizar
                        </button>
                        
                        <button 
                            onClick={handleExport}
                            className="flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-md hover:shadow-lg font-semibold"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Exportar
                        </button>
                        
                        <button 
                            onClick={() => setShowInactive(!showInactive)}
                            className={`flex items-center justify-center px-4 py-3 rounded-lg transition-all shadow-md hover:shadow-lg font-semibold ${
                                showInactive 
                                    ? 'bg-red-600 text-white hover:bg-red-700' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            <UserX className="w-4 h-4 mr-2" />
                            Inactivos
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-red-600">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                    Nombre
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                    IPs
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                    Horario
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
                            {filteredGroups.map((group) => (
                                <tr key={group.id} className="hover:bg-red-50 transition-all">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                                                <span className="text-red-700 font-bold text-sm">
                                                    {group.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {group.name}
                                                </div>
                                                <div className="flex gap-1 mt-1">
                                                    {group.permissions?.slice(0, 2).map((perm) => (
                                                        <span key={perm} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                                                            {perm}
                                                        </span>
                                                    ))}
                                                    {group.permissions?.length > 2 && (
                                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                                            +{group.permissions.length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-700 font-mono bg-gray-50 px-3 py-1 rounded-md">
                                            {group.ips}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {group.schedule ? (
                                            <span className="text-sm text-gray-700">
                                                {group.schedule}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-gray-400 italic">
                                                Sin horario
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span 
                                            className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full shadow-sm ${
                                                group.status === 'Activo'
                                                    ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-white'
                                                    : 'bg-gradient-to-r from-red-400 to-red-500 text-white'
                                            }`}
                                        >
                                            <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                                            {group.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => toggleStatus(group.id)}
                                                className="p-2 rounded-lg hover:bg-orange-50 transition-colors group"
                                                title={group.status === 'Activo' ? 'Desactivar' : 'Activar'}
                                            >
                                                {group.status === 'Activo' ? (
                                                    <UserX className="w-4 h-4 text-orange-600 group-hover:text-orange-700" />
                                                ) : (
                                                    <UserCheck className="w-4 h-4 text-emerald-600 group-hover:text-emerald-700" />
                                                )}
                                            </button>
                                            <button 
                                                onClick={() => openEditModal(group)}
                                                className="p-2 rounded-lg hover:bg-red-50 transition-colors group"
                                                title="Editar"
                                            >
                                                <Pencil className="w-4 h-4 text-red-600 group-hover:text-red-700" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(group.id)}
                                                className="p-2 rounded-lg hover:bg-red-50 transition-colors group"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-600 group-hover:text-red-700" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty state */}
                {filteredGroups.length === 0 && (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
                            <Search className="w-10 h-10 text-red-600" />
                        </div>
                        <p className="text-gray-700 font-semibold text-lg">No se encontraron grupos</p>
                        <p className="text-gray-500 text-sm mt-1">Intenta con otros términos de búsqueda</p>
                    </div>
                )}
            </div>

            {/* Stats footer */}
            <div className="mt-6 bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-md border border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between text-sm gap-3">
                    <div className="flex items-center space-x-2">
                        <UserCheck className="w-5 h-5 text-red-600" />
                        <span className="font-semibold text-gray-700">
                            Total: <span className="text-red-600">{filteredGroups.length}</span> de <span className="text-red-600">{groups.length}</span> grupos
                        </span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-green-500"></div>
                            <span className="text-gray-600">Activos: <span className="font-bold text-gray-800">{groups.filter(g => g.status === 'Activo').length}</span></span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-400 to-red-500"></div>
                            <span className="text-gray-600">Inactivos: <span className="font-bold text-gray-800">{groups.filter(g => g.status === 'Inactivo').length}</span></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <GroupModal 
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={editingGroup ? handleEditGroup : handleAddGroup}
                editingGroup={editingGroup}
            />
        </div>
    );
};

export default Groups;