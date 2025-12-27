import { useState } from "react";
import { Plus, Search, Pencil, Trash2, Download, RefreshCw, Megaphone, X, AlertCircle, Calendar, User, Image as ImageIcon, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
//import * as XLSX from 'xlsx';

// Modal para Crear/Editar Anuncio
const AnnouncementModal = ({ isOpen, onClose, onSave, editingAnnouncement, availableUsers }) => {
    const [formData, setFormData] = useState({
        title: editingAnnouncement?.title || '',
        content: editingAnnouncement?.content || '',
        image_url: editingAnnouncement?.image_url || '',
        priority: editingAnnouncement?.priority || 'normal',
        start_date: editingAnnouncement?.start_date?.split('T')[0] || '',
        end_date: editingAnnouncement?.end_date?.split('T')[0] || ''
    });

    const [imagePreview, setImagePreview] = useState(editingAnnouncement?.image_url || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.title.trim()) {
            toast.error('El título es obligatorio');
            return;
        }

        if (!formData.content.trim()) {
            toast.error('El contenido es obligatorio');
            return;
        }

        if (!formData.start_date) {
            toast.error('La fecha de inicio es obligatoria');
            return;
        }

        onSave(formData);
        setFormData({ 
            title: '', 
            content: '', 
            image_url: '', 
            priority: 'normal', 
            start_date: '', 
            end_date: '' 
        });
        setImagePreview('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
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
                                <Megaphone className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-lg font-semibold">
                                {editingAnnouncement ? 'Editar Anuncio' : 'Nuevo Anuncio'}
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
                                    Título del Anuncio *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                                    placeholder="Ej: Actualización de Sistema"
                                    required
                                    maxLength={200}
                                />
                            </div>

                            {/* Contenido */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Contenido *
                                </label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all resize-none"
                                    placeholder="Describe el anuncio detalladamente..."
                                    rows="6"
                                    required
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    {formData.content.length} caracteres
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

                            {/* Prioridad y Fechas */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Prioridad *
                                    </label>
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                                        required
                                    >
                                        <option value="low">Baja</option>
                                        <option value="normal">Normal</option>
                                        <option value="high">Alta</option>
                                        <option value="urgent">Urgente</option>
                                    </select>
                                </div>

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
                                    {editingAnnouncement ? 'Guardar Cambios' : 'Crear Anuncio'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

// Modal de Detalles del Anuncio
const AnnouncementDetailModal = ({ isOpen, onClose, announcement }) => {
    if (!isOpen || !announcement) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: 'bg-gray-100 text-gray-700 border-gray-200',
            normal: 'bg-blue-100 text-blue-700 border-blue-200',
            high: 'bg-orange-100 text-orange-700 border-orange-200',
            urgent: 'bg-red-100 text-red-700 border-red-200'
        };
        return colors[priority] || colors.normal;
    };

    const getPriorityLabel = (priority) => {
        const labels = {
            low: 'Baja',
            normal: 'Normal',
            high: 'Alta',
            urgent: 'Urgente'
        };
        return labels[priority] || 'Normal';
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
                            <h2 className="text-lg font-semibold">Detalles del Anuncio</h2>
                        </div>
                        <button onClick={onClose} className="hover:bg-white/10 p-2 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Imagen */}
                        {announcement.image_url && (
                            <div className="border border-gray-200 p-4 bg-gray-50">
                                <img
                                    src={announcement.image_url}
                                    alt={announcement.title}
                                    className="max-h-64 mx-auto object-contain"
                                />
                            </div>
                        )}

                        {/* Título */}
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {announcement.title}
                            </h3>
                            <div className="flex items-center gap-3">
                                <span className={`inline-flex items-center px-3 py-1 text-xs font-bold border ${getPriorityColor(announcement.priority)}`}>
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    Prioridad: {getPriorityLabel(announcement.priority)}
                                </span>
                                <span className={`inline-flex items-center px-3 py-1 text-xs font-bold ${
                                    announcement.active
                                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                        : 'bg-red-100 text-red-700 border border-red-200'
                                }`}>
                                    {announcement.active ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                        </div>

                        {/* Contenido */}
                        <div className="border-t border-gray-200 pt-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Contenido del Anuncio
                            </label>
                            <div className="bg-gray-50 border border-gray-200 p-4">
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                    {announcement.content}
                                </p>
                            </div>
                        </div>

                        {/* Fechas */}
                        <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-6">
                            <div className="bg-green-50 border border-green-200 p-4">
                                <label className="block text-xs font-semibold text-green-700 uppercase mb-2">
                                    Fecha de Inicio
                                </label>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-green-600" />
                                    <span className="text-sm font-bold text-green-900">
                                        {formatDate(announcement.start_date)}
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
                                        {announcement.end_date ? formatDate(announcement.end_date) : 'Sin fecha límite'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Información adicional */}
                        <div className="border-t border-gray-200 pt-6">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-xs text-gray-500 uppercase">Creado por:</span>
                                    <p className="font-semibold text-gray-900">
                                        {announcement.created_by_name || 'Sistema'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 uppercase">Fecha de creación:</span>
                                    <p className="font-semibold text-gray-900">
                                        {formatDate(announcement.created_at)}
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

const Announcements = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showInactive, setShowInactive] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

    const [availableUsers] = useState([
        { id: 1, name: 'Juan Pablo Segundo' },
        { id: 2, name: 'Alejandro Mango' }
    ]);

    const [announcements, setAnnouncements] = useState([
        {
            id: 1,
            company_id: 1,
            title: 'Actualización de Sistema - Mantenimiento Programado',
            content: 'Se realizará un mantenimiento programado del sistema el próximo sábado de 2:00 AM a 6:00 AM. Durante este tiempo, el acceso al sistema estará limitado. Por favor, planifiquen sus actividades en consecuencia.',
            image_url: '',
            priority: 'high',
            start_date: '2025-12-20T00:00:00',
            end_date: '2025-12-21T00:00:00',
            active: true,
            created_by: 1,
            created_by_name: 'Juan Pablo Segundo',
            created_at: '2025-12-15T10:00:00',
            updated_at: '2025-12-15T10:00:00'
        },
        {
            id: 2,
            company_id: 1,
            title: 'Nueva Política de Vacaciones 2024',
            content: 'Se ha actualizado la política de vacaciones para el año 2024. Todos los empleados deberán revisar el nuevo reglamento disponible en el portal interno. Las principales cambios incluyen mayor flexibilidad en las fechas y proceso simplificado de solicitud.',
            image_url: '',
            priority: 'normal',
            start_date: '2025-01-01T00:00:00',
            end_date: '2025-12-31T00:00:00',
            active: true,
            created_by: 2,
            created_by_name: 'Alejandro Mango',
            created_at: '2025-12-10T14:30:00',
            updated_at: '2025-12-10T14:30:00'
        },
        {
            id: 3,
            company_id: 1,
            title: 'Capacitación Obligatoria - Atención al Cliente',
            content: 'Recordatorio: Todos los agentes deben completar la capacitación de Atención al Cliente antes del 25 de diciembre. La capacitación está disponible en la plataforma de e-learning.',
            image_url: '',
            priority: 'urgent',
            start_date: '2025-12-18T00:00:00',
            end_date: '2025-12-25T00:00:00',
            active: true,
            created_by: 1,
            created_by_name: 'Juan Pablo Segundo',
            created_at: '2025-12-18T08:00:00',
            updated_at: '2025-12-18T08:00:00'
        },
        {
            id: 4,
            company_id: 1,
            title: 'Horario Especial - Feriados de Fin de Año',
            content: 'Durante los feriados de fin de año (24-26 y 31 dic - 1 ene), el horario de atención será de 9:00 AM a 3:00 PM. Planifiquen sus turnos con anticipación.',
            image_url: '',
            priority: 'high',
            start_date: '2025-12-24T00:00:00',
            end_date: '2026-01-02T00:00:00',
            active: false,
            created_by: 2,
            created_by_name: 'Alejandro Mango',
            created_at: '2025-12-01T09:00:00',
            updated_at: '2025-12-01T09:00:00'
        }
    ]);

    const filteredAnnouncements = announcements.filter(announcement => {
        const matchesSearch = 
            announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = showInactive ? !announcement.active : announcement.active;
        return matchesSearch && matchesStatus;
    });

    const handleOpenModal = (announcement = null) => {
        setEditingAnnouncement(announcement);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingAnnouncement(null);
    };

    const handleViewDetails = (announcement) => {
        setSelectedAnnouncement(announcement);
        setDetailModalOpen(true);
    };

    const handleSave = (formData) => {
        if (editingAnnouncement) {
            setAnnouncements(announcements.map(a =>
                a.id === editingAnnouncement.id
                    ? {
                        ...a,
                        title: formData.title,
                        content: formData.content,
                        image_url: formData.image_url,
                        priority: formData.priority,
                        start_date: formData.start_date,
                        end_date: formData.end_date || null,
                        updated_at: new Date().toISOString()
                    }
                    : a
            ));
            toast.success('Anuncio actualizado correctamente');
        } else {
            const newAnnouncement = {
                id: announcements.length + 1,
                company_id: 1,
                title: formData.title,
                content: formData.content,
                image_url: formData.image_url,
                priority: formData.priority,
                start_date: formData.start_date,
                end_date: formData.end_date || null,
                active: true,
                created_by: 1,
                created_by_name: 'Usuario Actual',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            setAnnouncements([...announcements, newAnnouncement]);
            toast.success('Anuncio creado correctamente');
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de eliminar este anuncio?')) {
            setAnnouncements(announcements.filter(a => a.id !== id));
            toast.success('Anuncio eliminado correctamente');
        }
    };

    const toggleStatus = (id) => {
        setAnnouncements(announcements.map(a =>
            a.id === id ? { ...a, active: !a.active } : a
        ));
        toast.success('Estado actualizado');
    };

    const handleExport = () => {
        try {
            const dataToExport = filteredAnnouncements.map(ann => ({
                'ID': ann.id,
                'Título': ann.title,
                'Contenido': ann.content,
                'Prioridad': ann.priority,
                'Fecha Inicio': new Date(ann.start_date).toLocaleDateString('es-ES'),
                'Fecha Fin': ann.end_date ? new Date(ann.end_date).toLocaleDateString('es-ES') : 'Sin límite',
                'Estado': ann.active ? 'Activo' : 'Inactivo',
                'Creado Por': ann.created_by_name || 'Sistema',
                'Fecha Creación': new Date(ann.created_at).toLocaleDateString('es-ES')
            }));

            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Anuncios');

            worksheet['!cols'] = [
                { wch: 10 }, { wch: 40 }, { wch: 60 }, { wch: 12 },
                { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 20 }, { wch: 15 }
            ];

            const fecha = new Date().toISOString().split('T')[0];
            XLSX.writeFile(workbook, `anuncios_${fecha}.xlsx`);

            toast.success('Archivo exportado correctamente');
        } catch (error) {
            toast.error('Error al exportar');
        }
    };

    const handleRefresh = () => {
        toast.success('Datos actualizados');
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: 'bg-gray-100 text-gray-700 border-gray-200',
            normal: 'bg-blue-100 text-blue-700 border-blue-200',
            high: 'bg-orange-100 text-orange-700 border-orange-200',
            urgent: 'bg-red-100 text-red-700 border-red-200'
        };
        return colors[priority] || colors.normal;
    };

    const getPriorityLabel = (priority) => {
        const labels = {
            low: 'Baja',
            normal: 'Normal',
            high: 'Alta',
            urgent: 'Urgente'
        };
        return labels[priority] || 'Normal';
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
                        <Megaphone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">
                            Gestión de Anuncios
                        </h1>
                        <p className="text-xs text-gray-600">
                            Administra los anuncios y comunicados internos
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
                                placeholder="Buscar por título o contenido..."
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
                                <Megaphone className="w-4 h-4 mr-2" />
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
                                        Anuncio
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Prioridad
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Vigencia
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
                                {filteredAnnouncements.map((announcement, index) => (
                                    <tr key={announcement.id} className={`transition-all hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-red-600 flex items-center justify-center mr-3 shadow-sm">
                                                    <Megaphone className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-bold text-gray-900">
                                                        {announcement.title}
                                                    </div>
                                                    <div className="text-xs text-gray-500 line-clamp-1">
                                                        {announcement.content}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold border ${getPriorityColor(announcement.priority)}`}>
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {getPriorityLabel(announcement.priority)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm">
                                                <div className="flex items-center gap-1 text-gray-700">
                                                    <Calendar className="w-3 h-3" />
                                                    <span className="font-semibold">{formatDate(announcement.start_date)}</span>
                                                </div>
                                                {announcement.end_date && (
                                                    <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                                                        <span>hasta</span>
                                                        <span className="font-medium">{formatDate(announcement.end_date)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span 
                                                className={`inline-flex items-center px-3 py-1.5 text-xs font-bold shadow-sm ${
                                                    announcement.active
                                                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                        : 'bg-red-100 text-red-700 border border-red-200'
                                                }`}
                                            >
                                                <span className={`w-2 h-2 ${announcement.active ? 'bg-emerald-500' : 'bg-red-500'} rounded-full mr-2`}></span>
                                                {announcement.active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleViewDetails(announcement)}
                                                    className="p-2 bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200"
                                                    title="Ver detalles"
                                                >
                                                    <Eye className="w-4 h-4 text-blue-600" />
                                                </button>
                                                <button
                                                    onClick={() => toggleStatus(announcement.id)}
                                                    className={`p-2 transition-colors border ${
                                                        announcement.active 
                                                            ? 'bg-orange-50 hover:bg-orange-100 border-orange-200'
                                                            : 'bg-green-50 hover:bg-green-100 border-green-200'
                                                    }`}
                                                    title={announcement.active ? 'Desactivar' : 'Activar'}
                                                >
                                                    <Megaphone className={`w-4 h-4 ${announcement.active ? 'text-orange-600' : 'text-green-600'}`} />
                                                </button>
                                                <button 
                                                    onClick={() => handleOpenModal(announcement)}
                                                    className="p-2 bg-red-50 hover:bg-red-100 transition-colors border border-red-200"
                                                    title="Editar"
                                                >
                                                    <Pencil className="w-4 h-4 text-red-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(announcement.id)}
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

                    {filteredAnnouncements.length === 0 && (
                        <div className="text-center py-16 bg-gray-50">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white border-2 border-gray-200 mb-4 shadow-sm">
                                <Search className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-gray-700 font-bold text-lg">No se encontraron anuncios</p>
                            <p className="text-gray-500 text-sm mt-2">
                                {showInactive 
                                    ? 'No hay anuncios inactivos' 
                                    : 'Intenta con otros términos de búsqueda'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Stats footer */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 text-center shadow-lg">
                        <Megaphone className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-xs text-gray-300 uppercase tracking-wider mb-1">Total Anuncios</p>
                        <p className="text-2xl font-bold text-white">{announcements.length}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-5 text-center shadow-lg">
                        <div className="w-6 h-6 bg-white/30 mx-auto mb-2 flex items-center justify-center">
                            <span className="w-3 h-3 bg-white rounded-full"></span>
                        </div>
                        <p className="text-xs text-emerald-100 uppercase tracking-wider mb-1">Activos</p>
                        <p className="text-2xl font-bold text-white">{announcements.filter(a => a.active).length}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-red-600 to-red-700 p-5 text-center shadow-lg">
                        <div className="w-6 h-6 bg-white/30 mx-auto mb-2 flex items-center justify-center">
                            <span className="w-3 h-3 bg-white rounded-full"></span>
                        </div>
                        <p className="text-xs text-red-100 uppercase tracking-wider mb-1">Inactivos</p>
                        <p className="text-2xl font-bold text-white">{announcements.filter(a => !a.active).length}</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-5 text-center shadow-lg">
                        <AlertCircle className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-xs text-orange-100 uppercase tracking-wider mb-1">Urgentes</p>
                        <p className="text-2xl font-bold text-white">{announcements.filter(a => a.priority === 'urgent').length}</p>
                    </div>
                </div>

            </div>

            {/* Modales */}
            <AnnouncementModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                editingAnnouncement={editingAnnouncement}
                availableUsers={availableUsers}
            />

            <AnnouncementDetailModal
                isOpen={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                announcement={selectedAnnouncement}
            />
        </div>
    );
};

export default Announcements;