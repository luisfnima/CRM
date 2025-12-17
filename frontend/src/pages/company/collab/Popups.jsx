import { useState } from "react";
import { Plus, Search, Pencil, Trash2, Download, RefreshCw, UserX, MessageSquare, Image, ArrowUp, ArrowDown } from 'lucide-react'
import toast from 'react-hot-toast';

const Popups = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [showInactive, setShowInactive] = useState(false)
    const [popups, setPopups] = useState([
        {
            id: 1,
            multimedia: 'bienvenida_navidad_2024.jpg',
            priority: 1,
            status: 'Activo'
        },
        {
            id: 2,
            multimedia: 'promocion_especial.png',
            priority: 2,
            status: 'Activo'
        },
        {
            id: 3,
            multimedia: 'mensaje_ano_nuevo.gif',
            priority: 3,
            status: 'Activo'
        },
        {
            id: 4,
            multimedia: 'mantenimiento_programado.jpg',
            priority: 4,
            status: 'Inactivo'
        },
    ])

    const filteredPopups = popups.filter(popup => {
        const matchesSearch = popup.multimedia.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = showInactive ? popup.status === 'Inactivo' : true
        return matchesSearch && matchesStatus
    })

    const handleDelete = (id) => {
        if(window.confirm('¿Estás seguro de eliminar este popup?')){
            setPopups(popups.filter(p => p.id !== id))
            toast.success('Popup eliminado correctamente')
        }
    }

    const toggleStatus = (id) => {
        setPopups(popups.map(p =>
            p.id === id
            ? { ...p, status: p.status === 'Activo' ? 'Inactivo' : 'Activo' } : p 
        ))
        toast.success('Estado actualizado')
    }

    const handleExport = () => {
        toast.success('Exportando popups...')
    }

    const handleRefresh = () => {
        toast.success('Datos actualizados')
    }

    const getPriorityColor = (priority) => {
        if (priority === 1) return 'bg-red-100 text-red-700 border-red-200'
        if (priority === 2) return 'bg-orange-100 text-orange-700 border-orange-200'
        if (priority === 3) return 'bg-yellow-100 text-yellow-700 border-yellow-200'
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }

    const getPriorityIcon = (priority) => {
        if (priority <= 2) return <ArrowUp className="w-3 h-3" />
        return <ArrowDown className="w-3 h-3" />
    }

    return (
        <div className="flex justify-center py-8">
            <div className="w-full max-w-6xl px-4">
                
                {/* Header en una línea */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-lg shadow-sm">
                        <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">
                            Popups de Bienvenida
                        </h1>
                        <p className="text-xs text-gray-600">
                            Mensajes al iniciar sesión
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
                                placeholder="Buscar popups..."
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
                                        Archivo Multimedia
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Prioridad
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
                                {filteredPopups.map((popup, index) => (
                                    <tr key={popup.id} className={`transition-all hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center mr-3 shadow-sm">
                                                    <Image className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900">
                                                        {popup.multimedia}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Archivo de imagen
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span 
                                                className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-full shadow-sm border ${getPriorityColor(popup.priority)}`}
                                            >
                                                {getPriorityIcon(popup.priority)}
                                                Prioridad {popup.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span 
                                                className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full shadow-sm ${
                                                    popup.status === 'Activo'
                                                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                        : 'bg-red-100 text-red-700 border border-red-200'
                                                }`}
                                            >
                                                <span className={`w-2 h-2 ${popup.status === 'Activo' ? 'bg-emerald-500' : 'bg-red-500'} rounded-full mr-2`}></span>
                                                {popup.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => toggleStatus(popup.id)}
                                                    className="p-2 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors border border-orange-200"
                                                    title={popup.status === 'Activo' ? 'Desactivar' : 'Activar'}
                                                >
                                                    <UserX className="w-4 h-4 text-orange-600" />
                                                </button>
                                                <button 
                                                    onClick={() => toast.success('Editando popup...')}
                                                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors border border-red-200"
                                                    title="Editar"
                                                >
                                                    <Pencil className="w-4 h-4 text-red-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(popup.id)}
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
                    {filteredPopups.length === 0 && (
                        <div className="text-center py-16 bg-gray-50">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white border-2 border-gray-200 mb-4 shadow-sm">
                                <Search className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-gray-700 font-bold text-lg">No se encontraron popups</p>
                            <p className="text-gray-500 text-sm mt-2">Intenta con otros términos de búsqueda</p>
                        </div>
                    )}
                </div>

                {/* Stats footer */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 text-center shadow-lg">
                        <MessageSquare className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-xs text-gray-300 uppercase tracking-wider mb-1">Total Popups</p>
                        <p className="text-2xl font-bold text-white">{popups.length}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-5 text-center shadow-lg">
                        <div className="w-6 h-6 rounded-full bg-white/30 mx-auto mb-2 flex items-center justify-center">
                            <span className="w-3 h-3 bg-white rounded-full"></span>
                        </div>
                        <p className="text-xs text-emerald-100 uppercase tracking-wider mb-1">Activos</p>
                        <p className="text-2xl font-bold text-white">{popups.filter(p => p.status === 'Activo').length}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-5 text-center shadow-lg">
                        <div className="w-6 h-6 rounded-full bg-white/30 mx-auto mb-2 flex items-center justify-center">
                            <span className="w-3 h-3 bg-white rounded-full"></span>
                        </div>
                        <p className="text-xs text-red-100 uppercase tracking-wider mb-1">Inactivos</p>
                        <p className="text-2xl font-bold text-white">{popups.filter(p => p.status === 'Inactivo').length}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Popups;