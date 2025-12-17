import { useState } from "react";
import { Plus, Search, Pencil, Trash2, UserCheck, UserX, Users, X, Eye, EyeOff, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast';

// Modal Component (para agregar Y editar)
const UserModal = ({ isOpen, onClose, onSubmit, editingUser }) => {
    const [formData, setFormData] = useState({
        fullName: editingUser?.name || '',
        email: editingUser?.email || '',
        role: editingUser?.role || '',
        branch: editingUser?.branch || '',
        password: '',
        phone: editingUser?.phone || ''
    });

    const [showPassword, setShowPassword] = useState(false);

    const generatePassword = () => {
        const length = 12;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let password = "";
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setFormData({ ...formData, password });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({
            fullName: '',
            email: '',
            role: '',
            branch: '',
            password: '',
            phone: ''
        });
        onClose();
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                    <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">
                            {editingUser ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
                        </h2>
                        <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre Completo <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                    placeholder="Ej: Juan Pérez García"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Correo Electrónico <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                    placeholder="ejemplo@correo.com"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rol <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                    >
                                        <option value="">Seleccionar rol</option>
                                        <option value="Administrador">Administrador</option>
                                        <option value="Supervisor">Supervisor</option>
                                        <option value="Agente">Agente</option>
                                        <option value="Back Office">Back Office</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sucursal <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        name="branch"
                                        value={formData.branch}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                    >
                                        <option value="">Seleccionar sucursal</option>
                                        <option value="Izaguirre">Izaguirre</option>
                                        <option value="Huandoy">Huandoy</option>
                                        <option value="Covida">Covida</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contraseña {editingUser && <span className="text-gray-500 text-xs">(dejar en blanco para no cambiar)</span>} {!editingUser && <span className="text-red-600">*</span>}
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required={!editingUser}
                                            className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                            placeholder={editingUser ? "Dejar en blanco para no cambiar" : "Ingrese contraseña"}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={generatePassword}
                                        className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2 font-medium whitespace-nowrap"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Generar
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Teléfono <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                    placeholder="999 999 999"
                                />
                            </div>
                        </div>
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
                                {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

// Main Component
const UsersPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [users, setUsers] = useState([
        {
            id: 1,
            name: 'Juan Pablo Segundo',
            email: 'jsegundo@dreamteam.pe',
            role: 'Administrador',
            branch: 'Izaguirre',
            phone: '999 999 999',
            status: 'Activo',
            lastSession: '2025-10-15 15:58'
        },
        {
            id: 2,
            name: 'Alejandro Mango',
            email: 'amangop@dreamteam.pe',
            role: 'Supervisores Reno JN',
            branch: 'Huandoy',
            phone: '999 999 888',
            status: 'Activo',
            lastSession: '2025-10-15 15:00'
        },
        {
            id: 3,
            name: 'Arnulfo Fonseca',
            email: 'sperez@dreamteam.pe',
            role: 'Agentes Covida',
            branch: 'Covida',
            phone: '999 999 777',
            status: 'Inactivo',
            lastSession: '2025-10-14 12:58'
        },
    ]);

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddUser = (formData) => {
        const newUser = {
            id: users.length + 1,
            name: formData.fullName,
            email: formData.email,
            role: formData.role,
            branch: formData.branch,
            phone: formData.phone,
            status: 'Activo',
            lastSession: new Date().toLocaleString('es-PE', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit' 
            })
        };
        setUsers([...users, newUser]);
        toast.success('Usuario creado correctamente');
    };

    const handleEditUser = (formData) => {
        setUsers(users.map(u => 
            u.id === editingUser.id 
                ? {
                    ...u,
                    name: formData.fullName,
                    email: formData.email,
                    role: formData.role,
                    branch: formData.branch,
                    phone: formData.phone
                }
                : u
        ));
        toast.success('Usuario actualizado correctamente');
        setEditingUser(null);
    };

    const handleDelete = (id) => {
        if(window.confirm('¿Estás seguro de querer eliminar al usuario?')){
            setUsers(users.filter(u => u.id !== id));
            toast.success('Usuario eliminado correctamente');
        }
    };

    const toggleStatus = (id) => {
        setUsers(users.map(u =>
            u.id === id
            ? { ...u, status: u.status === 'Activo' ? 'Inactivo' : 'Activo' } : u 
        ));
        toast.success('Estado actualizado');
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-red-600 rounded-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            Gestión de Usuarios
          </h1>
        </div>
        <p className="text-gray-600 ml-14">
          Administra los usuarios del call center
        </p>
      </div>

      <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-md border border-gray-200 p-5 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1 w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-white"
            />
          </div>
          <button 
            onClick={openAddModal}
            className="w-full sm:w-auto flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-md hover:shadow-lg font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Agregar Usuario
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-red-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Rol</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Teléfono</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Último acceso</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-red-50 transition-all">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-red-700 font-bold">{user.name.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">{user.role}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{user.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full shadow-sm ${
                        user.status === 'Activo'
                          ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-white'
                          : 'bg-gradient-to-r from-red-400 to-red-500 text-white'
                      }`}>
                      <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">{user.lastSession}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => toggleStatus(user.id)} className="p-2 rounded-lg hover:bg-orange-50 transition-colors group" title={user.status === 'Activo' ? 'Desactivar' : 'Activar'}>
                        {user.status === 'Activo' ? <UserX className="w-4 h-4 text-orange-600 group-hover:text-orange-700" /> : <UserCheck className="w-4 h-4 text-emerald-600 group-hover:text-emerald-700" />}
                      </button>
                      <button 
                        onClick={() => openEditModal(user)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors group"
                        title="Editar usuario"
                      >
                        <Pencil className="w-4 h-4 text-red-600 group-hover:text-red-700" />
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="p-2 rounded-lg hover:bg-red-50 transition-colors group" title="Eliminar usuario">
                        <Trash2 className="w-4 h-4 text-red-600 group-hover:text-red-700" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
              <Search className="w-10 h-10 text-red-600" />
            </div>
            <p className="text-gray-700 font-semibold text-lg">No se encontraron usuarios</p>
            <p className="text-gray-500 text-sm mt-1">Intenta con otros términos de búsqueda</p>
          </div>
        )}
      </div>

      <div className="mt-6 bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-md border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between text-sm gap-3">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-red-600" />
            <span className="font-semibold text-gray-700">Total: <span className="text-red-600">{filteredUsers.length}</span> de <span className="text-red-600">{users.length}</span> usuarios</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-green-500"></div>
              <span className="text-gray-600">Activos: <span className="font-bold text-gray-800">{users.filter(u => u.status === 'Activo').length}</span></span>
            </div>
            <span className="text-gray-400">•</span>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-400 to-red-500"></div>
              <span className="text-gray-600">Inactivos: <span className="font-bold text-gray-800">{users.filter(u => u.status === 'Inactivo').length}</span></span>
            </div>
          </div>
        </div>
      </div>

      <UserModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingUser ? handleEditUser : handleAddUser}
        editingUser={editingUser}
      />
    </div>
  );
}

export default UsersPage;