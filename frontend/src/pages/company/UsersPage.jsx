import { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, Download, RefreshCw, Users, X, Eye, EyeOff, UserCheck, UserX, Key, Copy, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
//import * as XLSX from 'xlsx';

import userService from "../../services/userService";
import roleService from "../../services/roleService";
import scheduleService from "../../services/scheduleService";
import branchService from "../../services/branchService";
import uploadService from "../../services/uploadService";

// Modal para Crear/Editar Usuario
const UserModal = ({ isOpen, onClose, onSave, editingUser, availableRoles, availableSchedules, availableBranches }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        password: '',
        role_id: '',
        branch_id: '',
        schedule_id: '',
        phone: '',
        photo_url: '',
    });



    const [generatedEmail, setGeneratedEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const DOMAIN = '@dreamteam.pe';

    // Cargar datos cuando se edita un usuario
    useEffect(() => {
        if (editingUser) {
            const nameParts = editingUser.name?.split(' ') || ['', ''];

            setFormData({
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || '',
                password: '',
                role_id: editingUser.role_id || '',
                branch_id: editingUser.branch_id || '',
                schedule_id: editingUser.schedule_id || '',
                phone: editingUser.phone || '',
                photo_url: editingUser.photo_url || '',
            });
        } else {
            // Limpiar form al crear nuevo usuario
            setFormData({
                firstName: '',
                lastName: '',
                password: '',
                role_id: '',
                branch_id: '',
                schedule_id: '',
                phone: '',
                photo_url: '',
            });
        }
    }, [editingUser]);

    // Generar email automáticamente
    useEffect(() => {
        if (formData.firstName && formData.lastName) {
            const firstLetter = formData.firstName.charAt(0).toLowerCase();
            const lastName = formData.lastName.toLowerCase().replace(/\s+/g, '');
            setGeneratedEmail(`${firstLetter}${lastName}`);
        } else {
            setGeneratedEmail('');
        }
    }, [formData.firstName, formData.lastName]);

    // Subir imagen a Cloudinary

     const handleImageUpload = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
        
            if (!file.type.startsWith('image/')) {
                toast.error('Por favor selecciona una imagen válida');
                return;
            }
        
            if (file.size > 5 * 1024 * 1024) {
                toast.error('La imagen no debe superar 5MB');
                return;
            }
        
            try {
                setUploadingImage(true);
                const imageUrl = await uploadService.uploadImage(file);
                
                console.log('🖼️ URL de imagen generada:', imageUrl); // ⬅️ AGREGAR
                
                setFormData(prev => ({ ...prev, photo_url: imageUrl }));
                
                console.log('📋 FormData actualizado:', { ...formData, photo_url: imageUrl }); // ⬅️ AGREGAR
                
                toast.success('Imagen subida correctamente');
            } catch (error) {
                console.error('Error uploading image:', error);
                toast.error('Error al subir la imagen');
            } finally {
                setUploadingImage(false);
            }
        };


    // Generar contraseña segura
    const generatePassword = () => {
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*';
        const allChars = lowercase + uppercase + numbers + symbols;

        let password = '';
        
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += symbols[Math.floor(Math.random() * symbols.length)];

        for (let i = password.length; i < 12; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }

        password = password.split('').sort(() => Math.random() - 0.5).join('');

        setFormData(prev => ({ ...prev, password }));
        toast.success('Contraseña generada');
    };

    const copyPassword = async () => {
        if (formData.password) {
            try {
                await navigator.clipboard.writeText(formData.password);
                toast.success('Contraseña copiada al portapapeles');
            } catch (error) {
                toast.error('Error al copiar contraseña');
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.firstName.trim()) {
            toast.error('El nombre es obligatorio');
            return;
        }

        if (!formData.lastName.trim()) {
            toast.error('El apellido es obligatorio');
            return;
        }

        if (!editingUser && !formData.password) {
            toast.error('La contraseña es obligatoria para usuarios nuevos');
            return;
        }

        if (!formData.role_id) {
            toast.error('El rol es obligatorio');
            return;
        }

        const fullEmail = generatedEmail + DOMAIN;
        const fullName = `${formData.firstName} ${formData.lastName}`;

        const dataToSend = { 
            name: fullName,
            email: fullEmail,
            password: formData.password,
            role_id: formData.role_id || null,
            branch_id: formData.branch_id || null,
            schedule_id: formData.schedule_id || null,
            phone: formData.phone,
            photo_url: formData.photo_url,
            status: 'active'
        };
        
        console.log('📤 Datos a enviar al backend:', dataToSend); // ⬅️ AGREGAR

        if (editingUser && !formData.password) {
            delete dataToSend.password;
        }

        onSave(dataToSend);
        
        setFormData({ 
            firstName: '',
            lastName: '',
            password: '', 
            role_id: '', 
            branch_id: '',
            schedule_id: '', 
            phone: '', 
            photo_url: '',
        });
        setGeneratedEmail('');
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
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
                    <div className="bg-gray-900 text-white px-6 py-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 flex items-center justify-center">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-lg font-semibold">
                                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                            </h2>
                        </div>
                        <button onClick={onClose} className="hover:bg-white/10 p-2 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Nombre */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nombre *
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                                        placeholder="Juan"
                                        required
                                        maxLength={50}
                                    />
                                </div>

                                {/* Apellido */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Apellido *
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                                        placeholder="Pérez"
                                        required
                                        maxLength={50}
                                    />
                                </div>

                                {/* Email generado (readonly) */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email (generado automáticamente)
                                    </label>
                                    <input
                                        type="text"
                                        value={generatedEmail ? `${generatedEmail}${DOMAIN}` : ''}
                                        readOnly
                                        className="w-full px-4 py-2.5 border border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
                                        placeholder="Se generará automáticamente desde nombre y apellido"
                                    />
                                    {generatedEmail && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            📧 Email final: <span className="font-semibold">{generatedEmail}{DOMAIN}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Contraseña */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Contraseña {!editingUser && '*'}
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 pr-24 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all font-mono"
                                                placeholder={editingUser ? 'Dejar vacío para no cambiar' : 'Generar contraseña segura'}
                                                required={!editingUser}
                                                minLength={6}
                                            />
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                                {formData.password && (
                                                    <button
                                                        type="button"
                                                        onClick={copyPassword}
                                                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                        title="Copiar contraseña"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                                    title={showPassword ? 'Ocultar' : 'Mostrar'}
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={generatePassword}
                                            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all flex items-center gap-2 shadow-sm"
                                        >
                                            <Key className="w-4 h-4" />
                                            Generar
                                        </button>
                                    </div>
                                    {formData.password && (
                                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                                            <p className="text-xs text-blue-800">
                                                <span className="font-semibold">💡 Importante:</span> Guarda esta contraseña, solo se mostrará una vez.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Teléfono */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Teléfono
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                                        placeholder="+51 999 999 999"
                                        maxLength={20}
                                    />
                                </div>

                                {/* Rol */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Rol *
                                    </label>
                                    <select
                                        name="role_id"
                                        value={formData.role_id}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                                        required
                                    >
                                        <option value="">Seleccionar rol</option>
                                        {availableRoles.map(role => (
                                            <option key={role.id} value={role.id}>
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Sucursal */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Sucursal
                                    </label>
                                    <select
                                        name="branch_id"
                                        value={formData.branch_id}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                                    >
                                        <option value="">Sin sucursal asignada</option>
                                        {availableBranches.map(branch => (
                                            <option key={branch.id} value={branch.id}>
                                                {branch.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Horario */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Horario
                                    </label>
                                    <select
                                        name="schedule_id"
                                        value={formData.schedule_id}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                                    >
                                        <option value="">Sin horario asignado</option>
                                        {availableSchedules.map(schedule => (
                                            <option key={schedule.id} value={schedule.id}>
                                                {schedule.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Cargar Foto */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Foto de Perfil (Opcional)
                                    </label>
                                    
                                    {formData.photo_url ? (
                                        <div className="flex items-center gap-4">
                                            <img 
                                                src={formData.photo_url} 
                                                alt="Preview" 
                                                className="w-20 h-20 object-cover rounded border-2 border-gray-300"
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-600 mb-2">Imagen cargada correctamente</p>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, photo_url: '' }))}
                                                    className="text-sm text-red-600 hover:text-red-700 font-semibold"
                                                >
                                                    Eliminar imagen
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                            <input
                                                type="file"
                                                id="photo-upload"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                disabled={uploadingImage}
                                            />
                                            <label
                                                htmlFor="photo-upload"
                                                className="cursor-pointer flex flex-col items-center"
                                            >
                                                {uploadingImage ? (
                                                    <>
                                                        <div className="animate-spin w-12 h-12 border-4 border-gray-300 border-t-red-600 rounded-full mb-3"></div>
                                                        <p className="text-sm text-gray-600 font-semibold">Subiendo imagen...</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="w-12 h-12 text-gray-400 mb-3" />
                                                        <p className="text-sm text-gray-600 font-semibold mb-1">
                                                            Haz clic para subir una imagen
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            PNG, JPG, GIF hasta 5MB
                                                        </p>
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

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
                                    disabled={uploadingImage}
                                    className="flex-1 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

const UsersPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null); // ⬅️ AGREGAR AQUÍ

    const [users, setUsers] = useState([]);
    const [availableRoles, setAvailableRoles] = useState([]);
    const [availableSchedules, setAvailableSchedules] = useState([]);
    const [availableBranches, setAvailableBranches] = useState([]);


    useEffect(() => {
        // ⬇️ CARGAR USUARIO ACTUAL
        const user = JSON.parse(localStorage.getItem('user'));
        setCurrentUser(user);
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            
            const [usersData, rolesData, schedulesData, branchesData] = await Promise.all([
                userService.getAll(),
                roleService.getAll(),
                scheduleService.getAll(),
                branchService.getAll(),
            ]);

            setUsers(usersData);
            setAvailableRoles(rolesData);
            setAvailableSchedules(schedulesData);
            setAvailableBranches(branchesData);
            
            toast.success('Datos cargados correctamente');
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error(error.response?.data?.error || 'Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = 
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleOpenModal = (user = null) => {
        setEditingUser(user);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingUser(null);
    };

    const handleSave = async (formData) => {
        try {
            if (editingUser) {
                await userService.update(editingUser.id, formData);
                toast.success('Usuario actualizado correctamente');
            } else {
                await userService.create(formData);
                toast.success('Usuario creado correctamente');
            }
            
            loadData();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving user:', error);
            toast.error(error.response?.data?.error || 'Error al guardar usuario');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
            try {
                await userService.delete(id);
                toast.success('Usuario eliminado correctamente');
                loadData();
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error(error.response?.data?.error || 'Error al eliminar usuario');
            }
        }
    };

    const toggleStatus = async (id) => {
        try {
            await userService.toggleStatus(id);
            toast.success('Estado actualizado');
            loadData();
        } catch (error) {
            console.error('Error toggling status:', error);
            toast.error(error.response?.data?.error || 'Error al cambiar estado');
        }
    };

    const handleExport = () => {
        try {
            const dataToExport = filteredUsers.map(user => ({
                'ID': user.id,
                'Nombre': user.name,
                'Email': user.email,
                'Teléfono': user.phone || 'N/A',
                'Rol': user.role?.name || 'N/A',
                'Sucursal': user.branch?.name || 'N/A',
                'Horario': user.schedule?.name || 'N/A',
                'Estado': user.status === 'active' ? 'Activo' : 'Inactivo',
                'Último Acceso': user.last_access ? new Date(user.last_access).toLocaleDateString('es-ES') : 'Nunca'
            }));

            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');

            worksheet['!cols'] = [
                { wch: 10 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
                { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 20 }
            ];

            const fecha = new Date().toISOString().split('T')[0];
            XLSX.writeFile(workbook, `usuarios_${fecha}.xlsx`);

            toast.success('Archivo exportado correctamente');
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Error al exportar');
        }
    };

    const getRoleName = (roleId) => {
        const role = availableRoles.find(r => r.id === roleId);
        return role?.name || 'Sin rol';
    };

    const getBranchName = (branchId) => {
        const branch = availableBranches.find(b => b.id === branchId);
        return branch?.name || 'Sin sucursal';
    };

    const getScheduleName = (scheduleId) => {
        const schedule = availableSchedules.find(s => s.id === scheduleId);
        return schedule?.name || 'Sin horario';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600 font-semibold">Cargando usuarios...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center py-8 bg-gray-50">
            <div className="w-full max-w-7xl px-4">
                
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-800 shadow-sm">
                        <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">
                            Gestión de Usuarios
                        </h1>
                        <p className="text-xs text-gray-600">
                            Administra los usuarios del sistema
                        </p>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 shadow-sm p-5 mb-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-3 lg:space-y-0 gap-4">
                        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre, email o teléfono..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                                />
                            </div>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2.5 border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all font-semibold"
                            >
                                <option value="all">Todos los Estados</option>
                                <option value="active">Activos</option>
                                <option value="inactive">Inactivos</option>
                            </select>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                            <button 
                                onClick={() => handleOpenModal()}
                                className="flex items-center justify-center px-4 py-2.5 bg-gray-800 text-white hover:bg-gray-900 transition-all shadow-md hover:shadow-lg font-semibold text-sm"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Crear Usuario
                            </button>
                            
                            <button 
                                onClick={loadData}
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
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 text-center shadow-lg">
                        <Users className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-xs text-gray-300 uppercase tracking-wider mb-1">Total Usuarios</p>
                        <p className="text-2xl font-bold text-white">{users.length}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-5 text-center shadow-lg">
                        <UserCheck className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-xs text-emerald-100 uppercase tracking-wider mb-1">Activos</p>
                        <p className="text-2xl font-bold text-white">
                            {users.filter(u => u.status === 'active').length}
                        </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-red-600 to-red-700 p-5 text-center shadow-lg">
                        <UserX className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-xs text-red-100 uppercase tracking-wider mb-1">Inactivos</p>
                        <p className="text-2xl font-bold text-white">
                            {users.filter(u => u.status === 'inactive').length}
                        </p>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-900">
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Usuario
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Contacto
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Rol
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Sucursal
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
                                {filteredUsers.map((user, index) => (
                                    <tr key={user.id} className={`transition-all hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-red-600 flex items-center justify-center mr-3 shadow-sm overflow-hidden rounded">
                                                    {user.photo_url ? (
                                                        <img 
                                                            src={user.photo_url} 
                                                            alt={user.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.nextElementSibling.style.display = 'flex';
                                                            }}
                                                        />
                                                    ) : null}
                                                    <span 
                                                        className="text-white font-bold text-sm w-full h-full flex items-center justify-center"
                                                        style={{ display: user.photo_url ? 'none' : 'flex' }}
                                                    >
                                                        {user.name?.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        ID: {user.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{user.email}</div>
                                            <div className="text-xs text-gray-500">{user.phone || 'Sin teléfono'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200 rounded">
                                                {getRoleName(user.role_id)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-700">
                                                {getBranchName(user.branch_id)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleStatus(user.id)}
                                                disabled={user.id === currentUser?.id}
                                                className={`inline-flex items-center px-3 py-1.5 text-xs font-bold shadow-sm transition-all rounded ${
                                                    user.status === 'active'
                                                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200'
                                                        : 'bg-red-100 text-red-700 border border-red-200 hover:bg-red-200'
                                                }`}
                                            >
                                                {user.status === 'active' ? (
                                                    <>
                                                        <UserCheck className="w-3 h-3 mr-1" />
                                                        Activo
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserX className="w-3 h-3 mr-1" />
                                                        Inactivo
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button 
                                                    onClick={() => handleOpenModal(user)}
                                                    className="p-2 bg-red-50 hover:bg-red-100 transition-colors border border-red-200 rounded"
                                                    title="Editar"
                                                >
                                                    <Pencil className="w-4 h-4 text-red-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2 bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-300 rounded"
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

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-16 bg-gray-50">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white border-2 border-gray-200 mb-4 shadow-sm rounded">
                                <Search className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-gray-700 font-bold text-lg">No se encontraron usuarios</p>
                            <p className="text-gray-500 text-sm mt-2">
                                Intenta con otros términos de búsqueda o filtros
                            </p>
                        </div>
                    )}
                </div>

            </div>

            <UserModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                editingUser={editingUser}
                availableRoles={availableRoles}
                availableSchedules={availableSchedules}
                availableBranches={availableBranches}
            />
        </div>
    );
};

export default UsersPage;