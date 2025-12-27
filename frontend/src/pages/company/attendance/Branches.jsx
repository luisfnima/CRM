import { useState } from "react";
//import * as XLSX from 'xlsx';
import { Plus, Search, Pencil, Trash2, Download, RefreshCw, Building2, MapPin, X } from 'lucide-react'
import toast from 'react-hot-toast';

// Modal para Crear/Editar Sucursal
const BranchModal = ({ isOpen, onClose, onSave, editingBranch }) => {
    const [formData, setFormData] = useState({
        name: editingBranch?.name || '',
        address: editingBranch?.address || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            toast.error('El nombre es obligatorio');
            return;
        }

        onSave(formData);
        setFormData({ name: '', address: '' });
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
                                <Building2 className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-lg font-semibold">
                                {editingBranch ? 'Editar Sucursal' : 'Nueva Sucursal'}
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
                                Nombre de la Sucursal *
                            </label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                                    placeholder="Ej: Sucursal Centro"
                                    required
                                    maxLength={100}
                                />
                            </div>
                        </div>

                        {/* Campo: Dirección */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Dirección
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all resize-none"
                                    placeholder="Ej: Av. Principal 123, Lima"
                                    rows="3"
                                    maxLength={300}
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                {formData.address.length}/300 caracteres
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
                                {editingBranch ? 'Guardar Cambios' : 'Crear Sucursal'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
    // Función para exportar a Excel desde el frontend
    const handleExport = () => {
        try {
            // 1. Preparar los datos para exportar
            const dataToExport = branches.map(branch => ({
                'ID': branch.id,
                'Nombre': branch.name,
                'Dirección': branch.address || 'Sin dirección',
                'Estado': branch.active ? 'Activo' : 'Inactivo',
                'Fecha Creación': new Date(branch.created_at).toLocaleDateString('es-ES'),
            }));

            // 2. Crear el libro de Excel
            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sucursales');

            // 3. Ajustar ancho de columnas automáticamente
            const maxWidth = dataToExport.reduce((w, r) => Math.max(w, r.Nombre?.length || 0), 10);
            worksheet['!cols'] = [
                { wch: 10 },  // ID
                { wch: maxWidth + 5 },  // Nombre
                { wch: 40 },  // Dirección
                { wch: 10 },  // Estado
                { wch: 15 },  // Fecha
            ];

            // 4. Generar el archivo y descargarlo
            const fecha = new Date().toISOString().split('T')[0];
            XLSX.writeFile(workbook, `sucursales_${fecha}.xlsx`);

            toast.success('Archivo exportado correctamente');
        } catch (error) {
            console.error('Error al exportar:', error);
            toast.error('Error al exportar el archivo');
        }
        };
};

const Branches = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [showInactive, setShowInactive] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [editingBranch, setEditingBranch] = useState(null)
    const [branches, setBranches] = useState([
        {
            id: 1,
            company_id: 1,
            name: 'Sucursal Centro',
            address: 'Av. Javier Prado 123, San Isidro, Lima',
            active: true,
            created_at: '2024-01-15T10:30:00'
        },
        {
            id: 2,
            company_id: 1,
            name: 'Sucursal Norte',
            address: 'Av. Túpac Amaru 456, Los Olivos, Lima',
            active: true,
            created_at: '2024-02-20T14:15:00'
        },
        {
            id: 3,
            company_id: 1,
            name: 'Sucursal Sur',
            address: 'Av. Benavides 789, Miraflores, Lima',
            active: false,
            created_at: '2024-03-10T09:00:00'
        },
    ])

    const filteredBranches = branches.filter(branch => {
        const matchesSearch = branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             branch.address?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = showInactive ? !branch.active : branch.active
        return matchesSearch && matchesStatus
    })

    const handleOpenModal = (branch = null) => {
        setEditingBranch(branch);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingBranch(null);
    };

    const handleSave = (formData) => {
        if (editingBranch) {
            // Editar sucursal existente
            setBranches(branches.map(b =>
                b.id === editingBranch.id
                    ? { ...b, name: formData.name, address: formData.address }
                    : b
            ));
            toast.success('Sucursal actualizada correctamente');
        } else {
            // Crear nueva sucursal
            const newBranch = {
                id: branches.length + 1,
                company_id: 1, // Este vendría del contexto de la empresa
                name: formData.name,
                address: formData.address,
                active: true,
                created_at: new Date().toISOString()
            };
            setBranches([...branches, newBranch]);
            toast.success('Sucursal creada correctamente');
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if(window.confirm('¿Estás seguro de eliminar esta sucursal?')){
            setBranches(branches.filter(b => b.id !== id))
            toast.success('Sucursal eliminada correctamente')
        }
    }

    const toggleStatus = (id) => {
        setBranches(branches.map(b =>
            b.id === id
            ? { ...b, active: !b.active } : b 
        ))
        toast.success('Estado actualizado')
    }

    const handleExport = () => {
        toast.success('Exportando sucursales...')
    }

    const handleRefresh = () => {
        toast.success('Datos actualizados')
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    return (
        <div className="flex justify-center py-8">
            <div className="w-full max-w-6xl px-4">
                
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-800 shadow-sm">
                        <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">
                            Gestión de Sucursales
                        </h1>
                        <p className="text-xs text-gray-600">
                            Administra las sucursales de tu empresa
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
                                placeholder="Buscar por nombre o dirección..."
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
                                Crear Nueva
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
                                <Building2 className="w-4 h-4 mr-2" />
                                {showInactive ? 'Ver Activas' : 'Ver Inactivas'}
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
                                        Sucursal
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Dirección
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Fecha Creación
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
                                {filteredBranches.map((branch, index) => (
                                    <tr key={branch.id} className={`transition-all hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gray-800 flex items-center justify-center mr-3 shadow-sm">
                                                    <Building2 className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900">
                                                        {branch.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        ID: {branch.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start">
                                                <MapPin className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm text-gray-700 font-medium">
                                                    {branch.address || 'Sin dirección'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600 font-medium">
                                                {formatDate(branch.created_at)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span 
                                                className={`inline-flex items-center px-3 py-1.5 text-xs font-bold shadow-sm ${
                                                    branch.active
                                                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                        : 'bg-red-100 text-red-700 border border-red-200'
                                                }`}
                                            >
                                                <span className={`w-2 h-2 ${branch.active ? 'bg-emerald-500' : 'bg-red-500'} rounded-full mr-2`}></span>
                                                {branch.active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => toggleStatus(branch.id)}
                                                    className={`p-2 transition-colors border ${
                                                        branch.active 
                                                            ? 'bg-orange-50 hover:bg-orange-100 border-orange-200'
                                                            : 'bg-green-50 hover:bg-green-100 border-green-200'
                                                    }`}
                                                    title={branch.active ? 'Desactivar' : 'Activar'}
                                                >
                                                    <Building2 className={`w-4 h-4 ${branch.active ? 'text-orange-600' : 'text-green-600'}`} />
                                                </button>
                                                <button 
                                                    onClick={() => handleOpenModal(branch)}
                                                    className="p-2 bg-red-50 hover:bg-red-100 transition-colors border border-red-200"
                                                    title="Editar"
                                                >
                                                    <Pencil className="w-4 h-4 text-red-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(branch.id)}
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
                    {filteredBranches.length === 0 && (
                        <div className="text-center py-16 bg-gray-50">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white border-2 border-gray-200 mb-4 shadow-sm">
                                <Search className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-gray-700 font-bold text-lg">No se encontraron sucursales</p>
                            <p className="text-gray-500 text-sm mt-2">
                                {showInactive 
                                    ? 'No hay sucursales inactivas' 
                                    : 'Intenta con otros términos de búsqueda'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Stats footer */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 text-center shadow-lg">
                        <Building2 className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-xs text-gray-300 uppercase tracking-wider mb-1">Total Sucursales</p>
                        <p className="text-2xl font-bold text-white">{branches.length}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-5 text-center shadow-lg">
                        <div className="w-6 h-6 bg-white/30 mx-auto mb-2 flex items-center justify-center">
                            <span className="w-3 h-3 bg-white rounded-full"></span>
                        </div>
                        <p className="text-xs text-emerald-100 uppercase tracking-wider mb-1">Activas</p>
                        <p className="text-2xl font-bold text-white">{branches.filter(b => b.active).length}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-red-600 to-red-700 p-5 text-center shadow-lg">
                        <div className="w-6 h-6 bg-white/30 mx-auto mb-2 flex items-center justify-center">
                            <span className="w-3 h-3 bg-white rounded-full"></span>
                        </div>
                        <p className="text-xs text-red-100 uppercase tracking-wider mb-1">Inactivas</p>
                        <p className="text-2xl font-bold text-white">{branches.filter(b => !b.active).length}</p>
                    </div>
                </div>

            </div>

            {/* Modal */}
            <BranchModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                editingBranch={editingBranch}
            />
        </div>
    );
};

export default Branches;