import { useState } from "react";
import { Plus, Search, Pencil, Trash2, Download, RefreshCw, MessageSquare, X, Image as ImageIcon, Calendar, User, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
//import * as XLSX from 'xlsx';

// Modal para Crear/Editar Popup
const PopupModal = ({ isOpen, onClose, onSave, editingPopup, availableUsers }) => {
    const [formData, setFormData] = useState({
        title: editingPopup?.title || '',
        message: editingPopup?.message || '',
        image_url: editingPopup?.image_url || '',
        button_text: editingPopup?.button_text || 'Entendido',
        start_date: editingPopup?.start_date?.split('T')[0] || '',
        end_date: editingPopup?.end_date?.split('T')[0] || '',
        show_once: editingPopup?.show_once || false
    });

    const [imagePreview, setImagePreview] = useState(editingPopup?.image_url || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.title.trim()) {
            toast.error('El título es obligatorio');
            return;
        }

        if (!formData.message.trim()) {
            toast.error('El mensaje es obligatorio');
            return;
        }

        if (!formData.start_date) {
            toast.error('La fecha de inicio es obligatoria');
            return;
        }

        onSave(formData);
        setFormData({ 
            title: '', 
            message: '', 
            image_url: '', 
            button_text: 'Entendido', 
            start_date: '', 
            end_date: '',
            show_once: false
        });
        setImagePreview('');
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageUrlChange = (e) => {
        const url = e.target.value;
        setFormData(prev => ({ ...prev, image_url: url }));
        setImagePreview(url);
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-3xl shadow-2xl max-h-[90vh] flex flex-col">
                    <div className="bg-gray-900 text-white px-6 py-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-lg font-semibold">
                                {editingPopup ? 'Editar Popup' : 'Nuevo Popup'}
                            </h2>
                        </div>
                        <button onClick={onClose} className="hover:bg-white/10 p-2 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                        <div className="p-6 space-y-5">
                            {/* Título */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Título del Popup *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                                    placeholder="Ej: Bienvenido al Sistema"
                                    required
                                    maxLength={200}
                                />
                            </div>

                            {/* Mensaje */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Mensaje *
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all resize-none"
                                    placeholder="Escribe el mensaje que verán los usuarios..."
                                    rows="5"
                                    required
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    {formData.message.length} caracteres
                                </p>
                            </div>

                            {/* Imagen */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    URL de Imagen
                                </label>
                                <input
                                    type="url"
                                    value={formData.image_url}
                                    onChange={handleImageUrlChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                />
                                {imagePreview && (
                                    <div className="mt-3 border border-gray-200 p-2 bg-gray-50">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="max-h-40 mx-auto object-contain"
                                            onError={() => {
                                                setImagePreview('');
                                                toast.error('Error al cargar la imagen');
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Texto del Botón */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Texto del Botón
                                </label>
                                <input
                                    type="text"
                                    name="button_text"
                                    value={formData.button_text}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                                    placeholder="Ej: Entendido, OK, Cerrar"
                                    maxLength={50}
                                />
                            </div>

                            {/* Fechas */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Fecha Inicio *
                                    </label>
                                    <input
                                        type="date"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Fecha Fin
                                    </label>
                                    <input
                                        type="date"
                                        name="end_date"
                                        value={formData.end_date}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                                        min={formData.start_date}
                                    />
                                </div>
                            </div>

                            {/* Mostrar una sola vez */}
                            <div className="bg-blue-50 border border-blue-200 p-4">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="show_once"
                                        checked={formData.show_once}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <div className="ml-3">
                                        <span className="text-sm font-semibold text-gray-900">
                                            Mostrar solo una vez por usuario
                                        </span>
                                        <p className="text-xs text-gray-600 mt-0.5">
                                            El popup solo se mostrará una vez a cada usuario
                                        </p>
                                    </div>
                                </label>
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
                                    className="flex-1 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm transition-all"
                                >
                                    {editingPopup ? 'Guardar Cambios' : 'Crear Popup'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

// Modal de Detalles del Popup
const PopupDetailModal = ({ isOpen, onClose, popup }) => {
    if (!isOpen || !popup) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
                    <div className="bg-gray-900 text-white px-6 py-5 flex items-center justify-between sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 flex items-center justify-center">
                                <Eye className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-lg font-semibold">Vista Previa del Popup</h2>
                        </div>
                        <button onClick={onClose} className="hover:bg-white/10 p-2 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Preview del Popup */}
                        <div className="border-2 border-gray-300 bg-white p-6 shadow-xl max-w-md mx-auto">
                            {popup.image_url && (
                                <div className="mb-4">
                                    <img
                                        src={popup.image_url}
                                        alt={popup.title}
                                        className="w-full h-48 object-cover"
                                    />
                                </div>
                            )}
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                {popup.title}
                            </h3>
                            <p className="text-sm text-gray-700 mb-4 whitespace-pre-wrap">
                                {popup.message}
                            </p>
                            <button className="w-full px-4 py-2.5 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all">
                                {popup.button_text}
                            </button>
                        </div>

                        {/* Información del Popup */}
                        <div className="border-t border-gray-200 pt-6">
                            <h4 className="text-sm font-bold text-gray-700 uppercase mb-4">
                                Información del Popup
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-green-50 border border-green-200 p-4">
                                    <label className="block text-xs font-semibold text-green-700 uppercase mb-2">
                                        Fecha de Inicio
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-green-600" />
                                        <span className="text-sm font-bold text-green-900">
                                            {formatDate(popup.start_date)}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-red-50 border border-red-200 p-4">
                                    <label className="block text-xs font-semibold text-red-700 uppercase mb-2">
                                        Fecha de Fin
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-red-600" />
                                        <span className="text-sm font-bold text-red-900">
                                            {popup.end_date ? formatDate(popup.end_date) : 'Sin fecha límite'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mt-4">
                                <div className="bg-gray-50 border border-gray-200 p-4 text-center">
                                    <span className={`inline-flex items-center px-3 py-1.5 text-xs font-bold ${
                                        popup.active
                                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                            : 'bg-red-100 text-red-700 border border-red-200'
                                    }`}>
                                        {popup.active ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>

                                <div className="bg-gray-50 border border-gray-200 p-4 text-center">
                                    <span className={`inline-flex items-center px-3 py-1.5 text-xs font-bold ${
                                        popup.show_once
                                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                                    }`}>
                                        {popup.show_once ? (
                                            <>
                                                <EyeOff className="w-3 h-3 mr-1" />
                                                Una vez
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="w-3 h-3 mr-1" />
                                                Siempre
                                            </>
                                        )}
                                    </span>
                                </div>

                                <div className="bg-purple-50 border border-purple-200 p-4 text-center">
                                    <div className="text-xs text-purple-700 font-semibold uppercase">Vistas</div>
                                    <div className="text-lg font-bold text-purple-900">{popup.view_count || 0}</div>
                                </div>
                            </div>
                        </div>

                        {/* Información adicional */}
                        <div className="border-t border-gray-200 pt-6">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-xs text-gray-500 uppercase">Creado por:</span>
                                    <p className="font-semibold text-gray-900">
                                        {popup.created_by_name || 'Sistema'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 uppercase">Fecha de creación:</span>
                                    <p className="font-semibold text-gray-900">
                                        {formatDate(popup.created_at)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                        <button
                            onClick={onClose}
                            className="w-full px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm transition-all"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

const Popups = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showInactive, setShowInactive] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [editingPopup, setEditingPopup] = useState(null);
    const [selectedPopup, setSelectedPopup] = useState(null);

    const [availableUsers] = useState([
        { id: 1, name: 'Juan Pablo Segundo' },
        { id: 2, name: 'Alejandro Mango' }
    ]);

    const [popups, setPopups] = useState([
        {
            id: 1,
            company_id: 1,
            title: 'Bienvenida Navidad 2024',
            message: '¡Felices fiestas! Te deseamos una Navidad llena de alegría y un próspero año nuevo. Gracias por ser parte de nuestro equipo.',
            image_url: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400',
            button_text: 'Entendido',
            start_date: '2025-12-20T00:00:00',
            end_date: '2025-12-26T00:00:00',
            active: true,
            show_once: true,
            created_by: 1,
            created_by_name: 'Juan Pablo Segundo',
            created_at: '2025-12-15T10:00:00',
            view_count: 45
        },
        {
            id: 2,
            company_id: 1,
            title: 'Promoción Especial',
            message: 'Durante este mes tenemos una promoción especial para todos nuestros agentes. Consulta los detalles en el portal interno.',
            image_url: '',
            button_text: 'Ver Promoción',
            start_date: '2025-12-01T00:00:00',
            end_date: '2025-12-31T00:00:00',
            active: true,
            show_once: false,
            created_by: 2,
            created_by_name: 'Alejandro Mango',
            created_at: '2025-12-01T09:00:00',
            view_count: 120
        },
        {
            id: 3,
            company_id: 1,
            title: 'Mensaje de Año Nuevo',
            message: '¡Feliz Año Nuevo 2025! Que este nuevo año esté lleno de éxitos y oportunidades para todos.',
            image_url: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=400',
            button_text: '¡Gracias!',
            start_date: '2026-01-01T00:00:00',
            end_date: '2026-01-05T00:00:00',
            active: true,
            show_once: true,
            created_by: 1,
            created_by_name: 'Juan Pablo Segundo',
            created_at: '2025-12-28T14:00:00',
            view_count: 0
        },
        {
            id: 4,
            company_id: 1,
            title: 'Mantenimiento Programado',
            message: 'El sistema estará en mantenimiento el próximo sábado de 2:00 AM a 6:00 AM. Por favor, planifiquen sus actividades.',
            image_url: '',
            button_text: 'OK',
            start_date: '2025-11-15T00:00:00',
            end_date: '2025-11-16T00:00:00',
            active: false,
            show_once: false,
            created_by: 2,
            created_by_name: 'Alejandro Mango',
            created_at: '2025-11-10T08:00:00',
            view_count: 89
        }
    ]);

    const filteredPopups = popups.filter(popup => {
        const matchesSearch = 
            popup.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            popup.message.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = showInactive ? !popup.active : popup.active;
        return matchesSearch && matchesStatus;
    });

    const handleOpenModal = (popup = null) => {
        setEditingPopup(popup);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingPopup(null);
    };

    const handleViewDetails = (popup) => {
        setSelectedPopup(popup);
        setDetailModalOpen(true);
    };

    const handleSave = (formData) => {
        if (editingPopup) {
            setPopups(popups.map(p =>
                p.id === editingPopup.id
                    ? {
                        ...p,
                        title: formData.title,
                        message: formData.message,
                        image_url: formData.image_url,
                        button_text: formData.button_text,
                        start_date: formData.start_date,
                        end_date: formData.end_date || null,
                        show_once: formData.show_once
                    }
                    : p
            ));
            toast.success('Popup actualizado correctamente');
        } else {
            const newPopup = {
                id: popups.length + 1,
                company_id: 1,
                title: formData.title,
                message: formData.message,
                image_url: formData.image_url,
                button_text: formData.button_text,
                start_date: formData.start_date,
                end_date: formData.end_date || null,
                active: true,
                show_once: formData.show_once,
                created_by: 1,
                created_by_name: 'Usuario Actual',
                created_at: new Date().toISOString(),
                view_count: 0
            };
            setPopups([...popups, newPopup]);
            toast.success('Popup creado correctamente');
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de eliminar este popup?')) {
            setPopups(popups.filter(p => p.id !== id));
            toast.success('Popup eliminado correctamente');
        }
    };

    const toggleStatus = (id) => {
        setPopups(popups.map(p =>
            p.id === id ? { ...p, active: !p.active } : p
        ));
        toast.success('Estado actualizado');
    };

    const handleExport = () => {
        try {
            const dataToExport = filteredPopups.map(popup => ({
                'ID': popup.id,
                'Título': popup.title,
                'Mensaje': popup.message,
                'Botón': popup.button_text,
                'Fecha Inicio': new Date(popup.start_date).toLocaleDateString('es-ES'),
                'Fecha Fin': popup.end_date ? new Date(popup.end_date).toLocaleDateString('es-ES') : 'Sin límite',
                'Mostrar Una Vez': popup.show_once ? 'Sí' : 'No',
                'Vistas': popup.view_count || 0,
                'Estado': popup.active ? 'Activo' : 'Inactivo',
                'Creado Por': popup.created_by_name || 'Sistema',
                'Fecha Creación': new Date(popup.created_at).toLocaleDateString('es-ES')
            }));

            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Popups');

            worksheet['!cols'] = [
                { wch: 10 }, { wch: 30 }, { wch: 50 }, { wch: 15 },
                { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 10 },
                { wch: 10 }, { wch: 20 }, { wch: 15 }
            ];

            const fecha = new Date().toISOString().split('T')[0];
            XLSX.writeFile(workbook, `popups_${fecha}.xlsx`);

            toast.success('Archivo exportado correctamente');
        } catch (error) {
            toast.error('Error al exportar');
        }
    };

    const handleRefresh = () => {
        toast.success('Datos actualizados');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="flex justify-center py-8 bg-gray-50">
            <div className="w-full max-w-6xl px-4">
                
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-800 shadow-sm">
                        <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">
                            Popups de Bienvenida
                        </h1>
                        <p className="text-xs text-gray-600">
                            Mensajes al iniciar sesión en el sistema
                        </p>
                    </div>
                </div>

                {/* Barra de acciones */}
                <div className="bg-white border border-gray-200 shadow-sm p-5 mb-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-3 lg:space-y-0 gap-4">
                        <div className="relative flex-1 w-full lg:max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por título o mensaje..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                            />
                        </div>

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
                                <MessageSquare className="w-4 h-4 mr-2" />
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
                                        Popup
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Vigencia
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Configuración
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Vistas
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
                                                <div className="w-10 h-10 bg-red-600 flex items-center justify-center mr-3 shadow-sm">
                                                    {popup.image_url ? (
                                                        <ImageIcon className="w-5 h-5 text-white" />
                                                    ) : (
                                                        <MessageSquare className="w-5 h-5 text-white" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-bold text-gray-900">
                                                        {popup.title}
                                                    </div>
                                                    <div className="text-xs text-gray-500 line-clamp-1">
                                                        {popup.message}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm">
                                                <div className="flex items-center gap-1 text-gray-700">
                                                    <Calendar className="w-3 h-3" />
                                                    <span className="font-semibold">{formatDate(popup.start_date)}</span>
                                                </div>
                                                {popup.end_date && (
                                                    <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                                                        <span>hasta</span>
                                                        <span className="font-medium">{formatDate(popup.end_date)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold border ${
                                                popup.show_once
                                                    ? 'bg-blue-100 text-blue-700 border-blue-200'
                                                    : 'bg-gray-100 text-gray-700 border-gray-200'
                                            }`}>
                                                {popup.show_once ? (
                                                    <>
                                                        <EyeOff className="w-3 h-3 mr-1" />
                                                        Una vez
                                                    </>
                                                ) : (
                                                    <>
                                                        <Eye className="w-3 h-3 mr-1" />
                                                        Siempre
                                                    </>
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                                                <Eye className="w-3 h-3 mr-1" />
                                                {popup.view_count || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span 
                                                className={`inline-flex items-center px-3 py-1.5 text-xs font-bold shadow-sm ${
                                                    popup.active
                                                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                        : 'bg-red-100 text-red-700 border border-red-200'
                                                }`}
                                            >
                                                <span className={`w-2 h-2 ${popup.active ? 'bg-emerald-500' : 'bg-red-500'} rounded-full mr-2`}></span>
                                                {popup.active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleViewDetails(popup)}
                                                    className="p-2 bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200"
                                                    title="Ver detalles"
                                                >
                                                    <Eye className="w-4 h-4 text-blue-600" />
                                                </button>
                                                <button
                                                    onClick={() => toggleStatus(popup.id)}
                                                    className={`p-2 transition-colors border ${
                                                        popup.active 
                                                            ? 'bg-orange-50 hover:bg-orange-100 border-orange-200'
                                                            : 'bg-green-50 hover:bg-green-100 border-green-200'
                                                    }`}
                                                    title={popup.active ? 'Desactivar' : 'Activar'}
                                                >
                                                    <MessageSquare className={`w-4 h-4 ${popup.active ? 'text-orange-600' : 'text-green-600'}`} />
                                                </button>
                                                <button 
                                                    onClick={() => handleOpenModal(popup)}
                                                    className="p-2 bg-red-50 hover:bg-red-100 transition-colors border border-red-200"
                                                    title="Editar"
                                                >
                                                    <Pencil className="w-4 h-4 text-red-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(popup.id)}
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

                    {filteredPopups.length === 0 && (
                        <div className="text-center py-16 bg-gray-50">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white border-2 border-gray-200 mb-4 shadow-sm">
                                <Search className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-gray-700 font-bold text-lg">No se encontraron popups</p>
                            <p className="text-gray-500 text-sm mt-2">
                                {showInactive 
                                    ? 'No hay popups inactivos' 
                                    : 'Intenta con otros términos de búsqueda'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Stats footer */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 text-center shadow-lg">
                        <MessageSquare className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-xs text-gray-300 uppercase tracking-wider mb-1">Total Popups</p>
                        <p className="text-2xl font-bold text-white">{popups.length}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-5 text-center shadow-lg">
                        <div className="w-6 h-6 bg-white/30 mx-auto mb-2 flex items-center justify-center">
                            <span className="w-3 h-3 bg-white rounded-full"></span>
                        </div>
                        <p className="text-xs text-emerald-100 uppercase tracking-wider mb-1">Activos</p>
                        <p className="text-2xl font-bold text-white">{popups.filter(p => p.active).length}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-red-600 to-red-700 p-5 text-center shadow-lg">
                        <div className="w-6 h-6 bg-white/30 mx-auto mb-2 flex items-center justify-center">
                            <span className="w-3 h-3 bg-white rounded-full"></span>
                        </div>
                        <p className="text-xs text-red-100 uppercase tracking-wider mb-1">Inactivos</p>
                        <p className="text-2xl font-bold text-white">{popups.filter(p => !p.active).length}</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 text-center shadow-lg">
                        <Eye className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-xs text-purple-100 uppercase tracking-wider mb-1">Total Vistas</p>
                        <p className="text-2xl font-bold text-white">
                            {popups.reduce((sum, p) => sum + (p.view_count || 0), 0)}
                        </p>
                    </div>
                </div>

            </div>

            {/* Modales */}
            <PopupModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                editingPopup={editingPopup}
                availableUsers={availableUsers}
            />

            <PopupDetailModal
                isOpen={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                popup={selectedPopup}
            />
        </div>
    );
};

export default Popups;