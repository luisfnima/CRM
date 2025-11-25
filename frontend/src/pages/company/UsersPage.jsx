import { useState } from "react";
import { Plus, Search, Pencil, Trash2, UserCheck, UserX } from 'lucide-react'
import toast from 'react-hot-toast';

const UsersPage = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [users, setUsers] = useState([
        {
            id: 1,
            name: 'Juan Pablo Segundo',
            email: 'jsegundo@dreamteam.pe',
            role: 'Administrador',
            phone: '999 999 999',
            status: 'Activo',
            lastSession: '2025-10-15 15:58'
        },
        {
            id: 2,
            name: 'Alejandro Mango',
            email: 'amangop@dreamteam.pe',
            role: 'Supervisores Reno JN',
            phone: '999 999 888',
            status: 'Activo',
            lastSession: '2025-10-15 15:00'
        },
        {
            id: 3,
            name: 'Arnulfo Fonseca',
            email: 'sperez@dreamteam.pe',
            role: 'Agentes Covida',
            phone: '999 999 777',
            status: 'Inactivo',
            lastSession: '2025-10-14 12:58'
        },
    ])

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleDelete = (id) => {
        if(window.confirm('¿Estás seguro de querer eliminar al usuario?')){
            setUsers(users.filter(u => u.id !== id))
            toast.success('Usuario eliminado correctamente')
        }
    }

    const toggleStatus = (id) => {
        setUsers(users.map(u =>
            u.id === id
            ? { ...u, status: u.status === 'Activo' ? 'Inactivo' : 'Activo' } : u 
        ))
        toast.success('Estado actualizado')
    }

    return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Gestión de Usuarios
        </h1>
        <p className="text-gray-600">
          Administra los usuarios del call center
        </p>
      </div>

      {/* Actions bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <div className="relative flex-1 w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Add button */}
          <button className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5 mr-2" />
            Agregar Usuario
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último acceso
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-700 font-medium">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.status === 'Activo'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastSession}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => toggleStatus(user.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        title={user.status === 'Activo' ? 'Desactivar' : 'Activar'}
                      >
                        {user.status === 'Activo' ? (
                          <UserX className="w-4 h-4 text-orange-600" />
                        ) : (
                          <UserCheck className="w-4 h-4 text-green-600" />
                        )}
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                        <Pencil className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron usuarios</p>
          </div>
        )}
      </div>

      {/* Stats footer */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <span>
          Mostrando {filteredUsers.length} de {users.length} usuarios
        </span>
        <div className="flex items-center space-x-2">
          <span>Activos: {users.filter(u => u.status === 'Activo').length}</span>
          <span>•</span>
          <span>Inactivos: {users.filter(u => u.status === 'Inactivo').length}</span>
        </div>
      </div>
    </div>
  );
}

export default UsersPage;

