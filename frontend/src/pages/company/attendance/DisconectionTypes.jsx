import { useState } from "react";
import { Plus, Search, Pencil, Trash2, Download, RefreshCw, WifiOff, X } from 'lucide-react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

// Modal para Crear/Editar Tipo de Desconexión
const DisconnectionTypeModal = ({ isOpen, onClose, onSave, editingType }) => {
    const [formData, setFormData] = useState({
        name: editingType?.name || '',
        description: editingType?.description || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            toast.error('El nombre es obligatorio');
            return;
        }

        onSave(formData);
        setFormData({ name: '', description: '' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-md shadow-2xl">
                    {/* Header */}
                    <div className="bg-gray-900 text-white px-6 py-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 flex items-center justify-center">
                                <WifiOff className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-lg font-semibold">
                                {editingType ? 'Editar Tipo de Desconexión' : 'Nuevo Tipo de Desconexión'}
                            </h2>
                        </div>
                        <button onClick={onClose} className="hover:bg-white/10 p-2 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Campo: Nombre */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Nombre del Tipo *
                            </label>
                            <div className="relative">
                                <WifiOff className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                                    placeholder="Ej: BAÑO"
                                    required
                                    maxLength={100}
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Usa mayúsculas para mantener consistencia
                            </p>
                        </div>

                        {/* Campo: Descripción */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Descripción
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all resize-none"
                                placeholder="Describe el motivo de desconexión..."
                                rows="3"
                                maxLength={300}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                {formData.description.length}/300 caracteres
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">
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
                                {editingType ? 'Guardar Cambios' : 'Crear Tipo'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

const DisconnectionTypes = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showInactive, setShowInactive] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingType, setEditingType] = useState(null);
    const [types, setTypes] = useState([
        {
            id: 1,
            company_id: 1,
            name: 'APOYO COMPAÑERO',
            description: 'Apoyo a un compañero de trabajo',
            active: true,
            created_at: '2024-01-15T10:30:00'
        },
        {
            id: 2,
            company_id: 1,
            name: 'BAÑO',
            description: 'Uso de servicios higiénicos',
            active: true,
            created_at: '2024-01-15T10:31:00'
        },
        {
            id: 3,
            company_id: 1,
            name: 'BREAK',
            description: 'Descanso programado',
            active: true,
            created_at: '2024-01-15T10:32:00'
        },
        {
            id: 4,
            company_id: 1,
            name: 'CAPACITACION',
            description: 'Sesión de capacitación o entrenamiento',
            active: true,
            created_at: '2024-01-15T10:33:00'
        },
        {
            id: 5,
            company_id: 1,
            name: 'REFRIGERIO',
            description: 'Tiempo de alimentación',
            active: false,
            created_at: '2024-01-15T10:34:00'
        },
    ]);

    const filteredTypes = types.filter(type => {
        const matchesSearch = type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             type.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = showInactive ? !type.active : type.active;
        return matchesSearch && matchesStatus;
    });

    const handleOpenModal = (type = null) => {
        setEditingType(type);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingType(null);
    };

    const handleSave = (formData) => {
        if (editingType) {
            // Editar tipo existente
            setTypes(types.map(t =>
                t.id === editingType.id
                    ? { ...t, name: formData.name, description: formData.description }
                    : t
            ));
            toast.success('Tipo actualizado correctamente');
        } else {
            // Crear nuevo tipo
            const newType = {
                id: types.length + 1,
                company_id: 1,
                name: formData.name,
                description: formData.description,
                active: true,
                created_at: new Date().toISOString()
            };
            setTypes([...types, newType]);
            toast.success('Tipo creado correctamente');
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de eliminar este tipo de desconexión?')) {
            setTypes(types.filter(t => t.id !== id));
            toast.success('Tipo eliminado correctamente');
        }
    };

    const toggleStatus = (id) => {
        setTypes(types.map(t =>
            t.id === id ? { ...t, active: !t.active } : t
        ));
        toast.success('Estado actualizado');
    };

    const handleExport = () => {
        try {
            const dataToExport = filteredTypes.map(type => ({
                'ID': type.id,
                'Nombre': type.name,
                'Descripción': type.description || 'Sin descripción',
                'Estado': type.active ? 'Activo' : 'Inactivo',
                'Fecha Creación': new Date(type.created_at).toLocaleDateString('es-ES'),
            }));

            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Tipos Desconexión');

            worksheet['!cols'] = [
                { wch: 10 }, { wch: 25 }, { wch: 40 }, { wch: 10 }, { wch: 15 }
            ];

            const fecha = new Date().toISOString().split('T')[0];
            XLSX.writeFile(workbook, `tipos_desconexion_${fecha}.xlsx`);

            toast.success('Archivo exportado correctamente');
        } catch (error) {
            toast.error('Error al exportar');
        }
    };

    const handleRefresh = () => {
        toast.success('Datos actualizados');
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
                        <WifiOff className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">
                            Desconexiones
                        </h1>
                        <p className="text-xs text-gray-600">
                            Configura los motivos de desconexión disponibles
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
                                <WifiOff className="w-4 h-4 mr-2" />
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
                                        Descripción
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
                                {filteredTypes.map((type, index) => (
                                    <tr key={type.id} className={`transition-all hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-red-600 flex items-center justify-center mr-3 shadow-sm">
                                                    <WifiOff className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900">
                                                        {type.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        ID: {type.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-700">
                                                {type.description || 'Sin descripción'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span 
                                                className={`inline-flex items-center px-3 py-1.5 text-xs font-bold shadow-sm ${
                                                    type.active
                                                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                        : 'bg-red-100 text-red-700 border border-red-200'
                                                }`}
                                            >
                                                <span className={`w-2 h-2 ${type.active ? 'bg-emerald-500' : 'bg-red-500'} rounded-full mr-2`}></span>
                                                {type.active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => toggleStatus(type.id)}
                                                    className={`p-2 transition-colors border ${
                                                        type.active 
                                                            ? 'bg-orange-50 hover:bg-orange-100 border-orange-200'
                                                            : 'bg-green-50 hover:bg-green-100 border-green-200'
                                                    }`}
                                                    title={type.active ? 'Desactivar' : 'Activar'}
                                                >
                                                    <WifiOff className={`w-4 h-4 ${type.active ? 'text-orange-600' : 'text-green-600'}`} />
                                                </button>
                                                <button 
                                                    onClick={() => handleOpenModal(type)}
                                                    className="p-2 bg-red-50 hover:bg-red-100 transition-colors border border-red-200"
                                                    title="Editar"
                                                >
                                                    <Pencil className="w-4 h-4 text-red-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(type.id)}
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
                    {filteredTypes.length === 0 && (
                        <div className="text-center py-16 bg-gray-50">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white border-2 border-gray-200 mb-4 shadow-sm">
                                <Search className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-gray-700 font-bold text-lg">No se encontraron tipos de desconexión</p>
                            <p className="text-gray-500 text-sm mt-2">
                                {showInactive 
                                    ? 'No hay tipos inactivos' 
                                    : 'Intenta con otros términos de búsqueda'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Stats footer */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 text-center shadow-lg">
                        <WifiOff className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-xs text-gray-300 uppercase tracking-wider mb-1">Total Tipos</p>
                        <p className="text-2xl font-bold text-white">{types.length}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-5 text-center shadow-lg">
                        <div className="w-6 h-6 bg-white/30 mx-auto mb-2 flex items-center justify-center">
                            <span className="w-3 h-3 bg-white rounded-full"></span>
                        </div>
                        <p className="text-xs text-emerald-100 uppercase tracking-wider mb-1">Activos</p>
                        <p className="text-2xl font-bold text-white">{types.filter(t => t.active).length}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-red-600 to-red-700 p-5 text-center shadow-lg">
                        <div className="w-6 h-6 bg-white/30 mx-auto mb-2 flex items-center justify-center">
                            <span className="w-3 h-3 bg-white rounded-full"></span>
                        </div>
                        <p className="text-xs text-red-100 uppercase tracking-wider mb-1">Inactivos</p>
                        <p className="text-2xl font-bold text-white">{types.filter(t => !t.active).length}</p>
                    </div>
                </div>

            </div>

            {/* Modal */}
            <DisconnectionTypeModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                editingType={editingType}
            />
        </div>
    );
};

export default DisconnectionTypes;