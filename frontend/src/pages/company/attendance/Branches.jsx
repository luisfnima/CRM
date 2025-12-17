import { useState } from "react";
import { Plus, Search, Pencil, Trash2, Download, RefreshCw, UserX, MapPin, Building } from 'lucide-react'
import toast from 'react-hot-toast';

const Branches = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [showInactive, setShowInactive] = useState(false)
    const [branches, setBranches] = useState([
        {
            id: 1,
            name: 'Piso 2',
            address: '',
            status: 'Activo'
        },
        {
            id: 2,
            name: 'Piso 3',
            address: '',
            status: 'Activo'
        },
    ])

    const filteredBranches = branches.filter(branch => {
        const matchesSearch = branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             (branch.address && branch.address.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesStatus = showInactive ? branch.status === 'Inactivo' : true
        return matchesSearch && matchesStatus
    })

    const handleDelete = (id) => {
        if(window.confirm('¿Estás seguro de eliminar esta sede?')){
            setBranches(branches.filter(b => b.id !== id))
            toast.success('Sede eliminada correctamente')
        }
    }

    const toggleStatus = (id) => {
        setBranches(branches.map(b =>
            b.id === id
            ? { ...b, status: b.status === 'Activo' ? 'Inactivo' : 'Activo' } : b 
        ))
        toast.success('Estado actualizado')
    }

    const handleExport = () => {
        toast.success('Exportando sedes...')
    }

    const handleRefresh = () => {
        toast.success('Datos actualizados')
    }

    return (
        <div className="flex justify-center py-8">
            <div className="w-full max-w-6xl px-4">
                
                {/* Header en una línea */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-lg shadow-sm">
                        <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">
                            Gestión de Sedes
                        </h1>
                        <p className="text-xs text-gray-600">
                            Administra las sedes y ubicaciones de la empresa
                        </p>
                    </div>
                </div>

                {/* Barra de acciones */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-3 lg:space-y-0 gap-4">
                        {/* Search */}
                        <div className="relative flex-1 w-full lg:max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar sedes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                            <button 
                                onClick={() => toast.success('Abriendo formulario...')}
                                className="flex items-center justify-center px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all shadow-md hover:shadow-lg font-semibold"
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
                                className="flex items-center justify-center px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all shadow-md hover:shadow-lg font-semibold"
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

                {/* Tabla elegante */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-gray-800 to-gray-900">
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Nombre
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Dirección
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
                                                <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center mr-3 shadow-sm">
                                                    <Building className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900">
                                                        {branch.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {branch.address ? (
                                                <div className="flex items-center">
                                                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                                                    <span className="text-sm text-gray-700">
                                                        {branch.address}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400 italic">
                                                    Sin dirección
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span 
                                                className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full shadow-sm ${
                                                    branch.status === 'Activo'
                                                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                        : 'bg-red-100 text-red-700 border border-red-200'
                                                }`}
                                            >
                                                <span className={`w-2 h-2 ${branch.status === 'Activo' ? 'bg-emerald-500' : 'bg-red-500'} rounded-full mr-2`}></span>
                                                {branch.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => toggleStatus(branch.id)}
                                                    className="p-2 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors border border-orange-200"
                                                    title={branch.status === 'Activo' ? 'Desactivar' : 'Activar'}
                                                >
                                                    <UserX className="w-4 h-4 text-orange-600" />
                                                </button>
                                                <button 
                                                    onClick={() => toast.success('Editando sede...')}
                                                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors border border-red-200"
                                                    title="Editar"
                                                >
                                                    <Pencil className="w-4 h-4 text-red-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(branch.id)}
                                                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-300"
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
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white border-2 border-gray-200 mb-4 shadow-sm">
                                <Search className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-gray-700 font-bold text-lg">No se encontraron sedes</p>
                            <p className="text-gray-500 text-sm mt-2">Intenta con otros términos de búsqueda</p>
                        </div>
                    )}
                </div>

                {/* Stats footer */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 text-center shadow-lg">
                        <MapPin className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-xs text-gray-300 uppercase tracking-wider mb-1">Total Sedes</p>
                        <p className="text-2xl font-bold text-white">{branches.length}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-5 text-center shadow-lg">
                        <div className="w-6 h-6 rounded-full bg-white/30 mx-auto mb-2 flex items-center justify-center">
                            <span className="w-3 h-3 bg-white rounded-full"></span>
                        </div>
                        <p className="text-xs text-emerald-100 uppercase tracking-wider mb-1">Activas</p>
                        <p className="text-2xl font-bold text-white">{branches.filter(b => b.status === 'Activo').length}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-5 text-center shadow-lg">
                        <div className="w-6 h-6 rounded-full bg-white/30 mx-auto mb-2 flex items-center justify-center">
                            <span className="w-3 h-3 bg-white rounded-full"></span>
                        </div>
                        <p className="text-xs text-red-100 uppercase tracking-wider mb-1">Inactivas</p>
                        <p className="text-2xl font-bold text-white">{branches.filter(b => b.status === 'Inactivo').length}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Branches;