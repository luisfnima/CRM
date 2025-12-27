import { useState } from "react";
import { Plus, Search, Pencil, Trash2, Download, RefreshCw, Target, X, Eye, Calendar, Users, TrendingUp, PlayCircle, PauseCircle, CheckCircle, XCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

// Modal para Crear/Editar Campaña
const CampaignModal = ({ isOpen, onClose, onSave, editingCampaign, availableUsers }) => {
    const [formData, setFormData] = useState({
        name: editingCampaign?.name || '',
        description: editingCampaign?.description || '',
        type: editingCampaign?.type || '',
        start_date: editingCampaign?.start_date || '',
        end_date: editingCampaign?.end_date || '',
        target_sales: editingCampaign?.target_sales || 0,
        status: editingCampaign?.status || 'draft'
    });

    const [selectedUsers, setSelectedUsers] = useState({
        supervisors: editingCampaign?.supervisors || [],
        agents: editingCampaign?.agents || [],
        backoffices: editingCampaign?.backoffices || []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            toast.error('El nombre de la campaña es obligatorio');
            return;
        }

        if (!formData.start_date) {
            toast.error('La fecha de inicio es obligatoria');
            return;
        }

        onSave({ ...formData, ...selectedUsers });
        setFormData({ 
            name: '', 
            description: '', 
            type: '', 
            start_date: '', 
            end_date: '', 
            target_sales: 0,
            status: 'draft'
        });
        setSelectedUsers({ supervisors: [], agents: [], backoffices: [] });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUserSelection = (role, userId) => {
        setSelectedUsers(prev => ({
            ...prev,
            [role]: prev[role].includes(userId)
                ? prev[role].filter(id => id !== userId)
                : [...prev[role], userId]
        }));
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-4xl shadow-2xl max-h-[90vh] flex flex-col">
                    <div className="bg-gray-900 text-white px-6 py-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 flex items-center justify-center">
                                <Target className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-lg font-semibold">
                                {editingCampaign ? 'Editar Campaña' : 'Nueva Campaña'}
                            </h2>
                        </div>
                        <button onClick={onClose} className="hover:bg-white/10 p-2 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                        <div className="p-6 space-y-5">
                            {/* Información Básica */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nombre de la Campaña *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                                        placeholder="Ej: Campaña Black Friday 2025"
                                        required
                                        maxLength={200}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Descripción
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all resize-none"
                                        placeholder="Describe los objetivos y alcance de la campaña..."
                                        rows="3"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Tipo de Campaña
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                                    >
                                        <option value="">Seleccionar tipo</option>
                                        <option value="Ventas">Ventas</option>
                                        <option value="Telemarketing">Telemarketing</option>
                                        <option value="Cobranzas">Cobranzas</option>
                                        <option value="Encuestas">Encuestas</option>
                                        <option value="Atención al Cliente">Atención al Cliente</option>
                                        <option value="Retención">Retención</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Meta de Ventas
                                    </label>
                                    <input
                                        type="number"
                                        name="target_sales"
                                        value={formData.target_sales}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                                        placeholder="0"
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Fecha de Inicio *
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
                                        Fecha de Fin
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

                            {/* Estado */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Estado
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                                >
                                    <option value="draft">Borrador</option>
                                    <option value="active">Activa</option>
                                    <option value="paused">Pausada</option>
                                    <option value="completed">Completada</option>
                                    <option value="cancelled">Cancelada</option>
                                </select>
                            </div>

                            {/* Asignación de Usuarios */}
                            <div className="border-t border-gray-200 pt-5">
                                <h3 className="text-sm font-bold text-gray-700 uppercase mb-4">
                                    Asignación de Equipo
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Supervisores */}
                                    <div className="border border-gray-200 p-4 bg-gray-50">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Supervisores</h4>
                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                            {availableUsers.filter(u => u.role_name === 'Supervisor').map(user => (
                                                <label key={user.id} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedUsers.supervisors.includes(user.id)}
                                                        onChange={() => handleUserSelection('supervisors', user.id)}
                                                        className="w-4 h-4 text-gray-800 border-gray-300 focus:ring-gray-400"
                                                    />
                                                    <span className="text-sm text-gray-700">{user.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Agentes */}
                                    <div className="border border-gray-200 p-4 bg-gray-50">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Agentes</h4>
                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                            {availableUsers.filter(u => u.role_name === 'Agente de Ventas').map(user => (
                                                <label key={user.id} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedUsers.agents.includes(user.id)}
                                                        onChange={() => handleUserSelection('agents', user.id)}
                                                        className="w-4 h-4 text-gray-800 border-gray-300 focus:ring-gray-400"
                                                    />
                                                    <span className="text-sm text-gray-700">{user.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Back Office */}
                                    <div className="border border-gray-200 p-4 bg-gray-50">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Back Office</h4>
                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                            {availableUsers.filter(u => u.role_name === 'Back Office').map(user => (
                                                <label key={user.id} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedUsers.backoffices.includes(user.id)}
                                                        onChange={() => handleUserSelection('backoffices', user.id)}
                                                        className="w-4 h-4 text-gray-800 border-gray-300 focus:ring-gray-400"
                                                    />
                                                    <span className="text-sm text-gray-700">{user.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
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
                                    {editingCampaign ? 'Guardar Cambios' : 'Crear Campaña'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

// Modal de Detalles de Campaña
const CampaignDetailModal = ({ isOpen, onClose, campaign }) => {
    if (!isOpen || !campaign) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            draft: 'bg-gray-100 text-gray-700 border-gray-200',
            active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            paused: 'bg-orange-100 text-orange-700 border-orange-200',
            completed: 'bg-blue-100 text-blue-700 border-blue-200',
            cancelled: 'bg-red-100 text-red-700 border-red-200'
        };
        return colors[status] || colors.draft;
    };

    const getStatusLabel = (status) => {
        const labels = {
            draft: 'Borrador',
            active: 'Activa',
            paused: 'Pausada',
            completed: 'Completada',
            cancelled: 'Cancelada'
        };
        return labels[status] || 'Desconocido';
    };

    const getStatusIcon = (status) => {
        const icons = {
            draft: FileText,
            active: PlayCircle,
            paused: PauseCircle,
            completed: CheckCircle,
            cancelled: XCircle
        };
        const Icon = icons[status] || FileText;
        return <Icon className="w-4 h-4" />;
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
                    <div className="bg-gray-900 text-white px-6 py-5 flex items-center justify-between sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 flex items-center justify-center">
                                <Eye className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-lg font-semibold">Detalles de la Campaña</h2>
                        </div>
                        <button onClick={onClose} className="hover:bg-white/10 p-2 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Header con nombre y estado */}
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                {campaign.name}
                            </h3>
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border ${getStatusColor(campaign.status)}`}>
                                    {getStatusIcon(campaign.status)}
                                    {getStatusLabel(campaign.status)}
                                </span>
                                {campaign.type && (
                                    <span className="inline-flex items-center px-3 py-1.5 text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                                        <Target className="w-3 h-3 mr-1" />
                                        {campaign.type}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Descripción */}
                        {campaign.description && (
                            <div className="border-t border-gray-200 pt-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Descripción
                                </label>
                                <div className="bg-gray-50 border border-gray-200 p-4">
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                        {campaign.description}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Fechas y Meta */}
                        <div className="border-t border-gray-200 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-green-50 border border-green-200 p-4">
                                    <label className="block text-xs font-semibold text-green-700 uppercase mb-2">
                                        Fecha de Inicio
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-green-600" />
                                        <span className="text-sm font-bold text-green-900">
                                            {formatDate(campaign.start_date)}
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
                                            {campaign.end_date ? formatDate(campaign.end_date) : 'Sin definir'}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 p-4">
                                    <label className="block text-xs font-semibold text-blue-700 uppercase mb-2">
                                        Meta de Ventas
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm font-bold text-blue-900">
                                            {campaign.target_sales || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Equipo Asignado */}
                        <div className="border-t border-gray-200 pt-6">
                            <h4 className="text-sm font-bold text-gray-700 uppercase mb-4 flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Equipo Asignado
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Supervisores */}
                                <div className="bg-purple-50 border border-purple-200 p-4">
                                    <h5 className="text-xs font-semibold text-purple-700 uppercase mb-3">
                                        Supervisores ({campaign.supervisors?.length || 0})
                                    </h5>
                                    <div className="space-y-1">
                                        {campaign.supervisors?.map((name, idx) => (
                                            <div key={idx} className="text-sm text-purple-900">• {name}</div>
                                        )) || <div className="text-sm text-purple-600">Sin asignar</div>}
                                    </div>
                                </div>

                                {/* Agentes */}
                                <div className="bg-green-50 border border-green-200 p-4">
                                    <h5 className="text-xs font-semibold text-green-700 uppercase mb-3">
                                        Agentes ({campaign.agents?.length || 0})
                                    </h5>
                                    <div className="space-y-1 max-h-32 overflow-y-auto">
                                        {campaign.agents?.map((name, idx) => (
                                            <div key={idx} className="text-sm text-green-900">• {name}</div>
                                        )) || <div className="text-sm text-green-600">Sin asignar</div>}
                                    </div>
                                </div>

                                {/* Back Office */}
                                <div className="bg-blue-50 border border-blue-200 p-4">
                                    <h5 className="text-xs font-semibold text-blue-700 uppercase mb-3">
                                        Back Office ({campaign.backoffices?.length || 0})
                                    </h5>
                                    <div className="space-y-1">
                                        {campaign.backoffices?.map((name, idx) => (
                                            <div key={idx} className="text-sm text-blue-900">• {name}</div>
                                        )) || <div className="text-sm text-blue-600">Sin asignar</div>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Información adicional */}
                        <div className="border-t border-gray-200 pt-6">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-xs text-gray-500 uppercase">Creado por:</span>
                                    <p className="font-semibold text-gray-900">
                                        {campaign.created_by_name || 'Sistema'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 uppercase">Fecha de creación:</span>
                                    <p className="font-semibold text-gray-900">
                                        {formatDate(campaign.created_at)}
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

const Campaigns = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [modalOpen, setModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState(null);
    const [selectedCampaign, setSelectedCampaign] = useState(null);

    const [availableUsers] = useState([
        { id: 1, name: 'Juan Supervisor', role_name: 'Supervisor' },
        { id: 2, name: 'María Supervisora', role_name: 'Supervisor' },
        { id: 3, name: 'Carlos Agente', role_name: 'Agente de Ventas' },
        { id: 4, name: 'Ana Agente', role_name: 'Agente de Ventas' },
        { id: 5, name: 'Luis Agente', role_name: 'Agente de Ventas' },
        { id: 6, name: 'Pedro BackOffice', role_name: 'Back Office' },
        { id: 7, name: 'Laura BackOffice', role_name: 'Back Office' }
    ]);

    const [campaigns, setCampaigns] = useState([
        {
            id: 1,
            company_id: 1,
            name: 'Campaña Black Friday 2025',
            description: 'Campaña especial de ventas para el Black Friday con descuentos de hasta 70% en productos seleccionados.',
            type: 'Ventas',
            start_date: '2025-11-25',
            end_date: '2025-11-29',
            target_sales: 500,
            status: 'active',
            created_by: 1,
            created_by_name: 'Juan Pablo Segundo',
            created_at: '2025-11-01T10:00:00',
            updated_at: '2025-11-01T10:00:00',
            supervisors: ['Juan Supervisor', 'María Supervisora'],
            agents: ['Carlos Agente', 'Ana Agente', 'Luis Agente'],
            backoffices: ['Pedro BackOffice']
        },
        {
            id: 2,
            company_id: 1,
            name: 'Cobranzas Q4 2025',
            description: 'Recuperación de cartera vencida del último trimestre del año.',
            type: 'Cobranzas',
            start_date: '2025-10-01',
            end_date: '2025-12-31',
            target_sales: 200,
            status: 'active',
            created_by: 2,
            created_by_name: 'Alejandro Mango',
            created_at: '2025-09-25T14:00:00',
            updated_at: '2025-09-25T14:00:00',
            supervisors: ['Juan Supervisor'],
            agents: ['Carlos Agente', 'Ana Agente'],
            backoffices: ['Laura BackOffice']
        },
        {
            id: 3,
            company_id: 1,
            name: 'Encuesta de Satisfacción 2025',
            description: 'Encuesta anual para medir la satisfacción de nuestros clientes.',
            type: 'Encuestas',
            start_date: '2025-12-01',
            end_date: '2025-12-15',
            target_sales: 0,
            status: 'paused',
            created_by: 1,
            created_by_name: 'Juan Pablo Segundo',
            created_at: '2025-11-20T09:00:00',
            updated_at: '2025-11-20T09:00:00',
            supervisors: ['María Supervisora'],
            agents: ['Luis Agente'],
            backoffices: []
        },
        {
            id: 4,
            company_id: 1,
            name: 'Retención de Clientes Premium',
            description: 'Campaña para retener a clientes de alto valor que están en riesgo de cancelación.',
            type: 'Retención',
            start_date: '2025-09-01',
            end_date: '2025-09-30',
            target_sales: 50,
            status: 'completed',
            created_by: 2,
            created_by_name: 'Alejandro Mango',
            created_at: '2025-08-15T11:00:00',
            updated_at: '2025-09-30T18:00:00',
            supervisors: ['Juan Supervisor'],
            agents: ['Carlos Agente'],
            backoffices: ['Pedro BackOffice']
        }
    ]);

    const filteredCampaigns = campaigns.filter(campaign => {
        const matchesSearch = 
            campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            campaign.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            campaign.type?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleOpenModal = (campaign = null) => {
        setEditingCampaign(campaign);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingCampaign(null);
    };

    const handleViewDetails = (campaign) => {
        setSelectedCampaign(campaign);
        setDetailModalOpen(true);
    };

    const handleSave = (formData) => {
        if (editingCampaign) {
            setCampaigns(campaigns.map(c =>
                c.id === editingCampaign.id
                    ? {
                        ...c,
                        ...formData,
                        updated_at: new Date().toISOString()
                    }
                    : c
            ));
            toast.success('Campaña actualizada correctamente');
        } else {
            const newCampaign = {
                id: campaigns.length + 1,
                company_id: 1,
                ...formData,
                created_by: 1,
                created_by_name: 'Usuario Actual',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            setCampaigns([...campaigns, newCampaign]);
            toast.success('Campaña creada correctamente');
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta campaña?')) {
            setCampaigns(campaigns.filter(c => c.id !== id));
            toast.success('Campaña eliminada correctamente');
        }
    };

    const handleExport = () => {
        try {
            const dataToExport = filteredCampaigns.map(campaign => ({
                'ID': campaign.id,
                'Nombre': campaign.name,
                'Tipo': campaign.type || 'N/A',
                'Descripción': campaign.description || 'N/A',
                'Fecha Inicio': new Date(campaign.start_date).toLocaleDateString('es-ES'),
                'Fecha Fin': campaign.end_date ? new Date(campaign.end_date).toLocaleDateString('es-ES') : 'Sin definir',
                'Meta Ventas': campaign.target_sales,
                'Estado': getStatusLabel(campaign.status),
                'Supervisores': campaign.supervisors?.length || 0,
                'Agentes': campaign.agents?.length || 0,
                'Back Office': campaign.backoffices?.length || 0,
                'Creado Por': campaign.created_by_name || 'Sistema',
                'Fecha Creación': new Date(campaign.created_at).toLocaleDateString('es-ES')
            }));

            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Campañas');

            worksheet['!cols'] = [
                { wch: 10 }, { wch: 40 }, { wch: 20 }, { wch: 50 },
                { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 15 },
                { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 20 }, { wch: 15 }
            ];

            const fecha = new Date().toISOString().split('T')[0];
            XLSX.writeFile(workbook, `campañas_${fecha}.xlsx`);

            toast.success('Archivo exportado correctamente');
        } catch (error) {
            toast.error('Error al exportar');
        }
    };

    const handleRefresh = () => {
        toast.success('Datos actualizados');
    };

    const getStatusColor = (status) => {
        const colors = {
            draft: 'bg-gray-100 text-gray-700 border-gray-200',
            active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            paused: 'bg-orange-100 text-orange-700 border-orange-200',
            completed: 'bg-blue-100 text-blue-700 border-blue-200',
            cancelled: 'bg-red-100 text-red-700 border-red-200'
        };
        return colors[status] || colors.draft;
    };

    const getStatusLabel = (status) => {
        const labels = {
            draft: 'Borrador',
            active: 'Activa',
            paused: 'Pausada',
            completed: 'Completada',
            cancelled: 'Cancelada'
        };
        return labels[status] || 'Desconocido';
    };

    const getStatusIcon = (status) => {
        const icons = {
            draft: FileText,
            active: PlayCircle,
            paused: PauseCircle,
            completed: CheckCircle,
            cancelled: XCircle
        };
        const Icon = icons[status] || FileText;
        return <Icon className="w-3 h-3" />;
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
            <div className="w-full max-w-7xl px-4">
                
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-800 shadow-sm">
                        <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">
                            Gestión de Campañas
                        </h1>
                        <p className="text-xs text-gray-600">
                            Administra las campañas comerciales del sistema
                        </p>
                    </div>
                </div>

                {/* Barra de acciones */}
                <div className="bg-white border border-gray-200 shadow-sm p-5 mb-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-3 lg:space-y-0 gap-4">
                        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre, tipo o descripción..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Filtro de Estado */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2.5 border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all font-semibold"
                            >
                                <option value="all">Todos los Estados</option>
                                <option value="draft">Borrador</option>
                                <option value="active">Activas</option>
                                <option value="paused">Pausadas</option>
                                <option value="completed">Completadas</option>
                                <option value="cancelled">Canceladas</option>
                            </select>
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
                                        Campaña
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Tipo
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Período
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Meta
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        Equipo
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
                                {filteredCampaigns.map((campaign, index) => (
                                    <tr key={campaign.id} className={`transition-all hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-red-600 flex items-center justify-center mr-3 shadow-sm">
                                                    <Target className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-bold text-gray-900">
                                                        {campaign.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 line-clamp-1">
                                                        {campaign.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {campaign.type ? (
                                                <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                                                    {campaign.type}
                                                </span>
                                            ) : (
                                                <span className="text-sm text-gray-400">Sin tipo</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm">
                                                <div className="flex items-center gap-1 text-gray-700">
                                                    <Calendar className="w-3 h-3" />
                                                    <span className="font-semibold">{formatDate(campaign.start_date)}</span>
                                                </div>
                                                {campaign.end_date && (
                                                    <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                                                        <span>hasta</span>
                                                        <span className="font-medium">{formatDate(campaign.end_date)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <TrendingUp className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm font-bold text-blue-900">
                                                    {campaign.target_sales}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="px-2 py-1 bg-purple-100 text-purple-700 font-bold border border-purple-200">
                                                    {campaign.supervisors?.length || 0} S
                                                </span>
                                                <span className="px-2 py-1 bg-green-100 text-green-700 font-bold border border-green-200">
                                                    {campaign.agents?.length || 0} A
                                                </span>
                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 font-bold border border-blue-200">
                                                    {campaign.backoffices?.length || 0} B
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold shadow-sm ${getStatusColor(campaign.status)}`}>
                                                {getStatusIcon(campaign.status)}
                                                {getStatusLabel(campaign.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleViewDetails(campaign)}
                                                    className="p-2 bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200"
                                                    title="Ver detalles"
                                                >
                                                    <Eye className="w-4 h-4 text-blue-600" />
                                                </button>
                                                <button 
                                                    onClick={() => handleOpenModal(campaign)}
                                                    className="p-2 bg-red-50 hover:bg-red-100 transition-colors border border-red-200"
                                                    title="Editar"
                                                >
                                                    <Pencil className="w-4 h-4 text-red-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(campaign.id)}
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

                    {filteredCampaigns.length === 0 && (
                        <div className="text-center py-16 bg-gray-50">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white border-2 border-gray-200 mb-4 shadow-sm">
                                <Search className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-gray-700 font-bold text-lg">No se encontraron campañas</p>
                            <p className="text-gray-500 text-sm mt-2">
                                Intenta con otros términos de búsqueda o filtros
                            </p>
                        </div>
                    )}
                </div>

                {/* Stats footer */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 text-center shadow-lg">
                        <Target className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-xs text-gray-300 uppercase tracking-wider mb-1">Total Campañas</p>
                        <p className="text-2xl font-bold text-white">{campaigns.length}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-5 text-center shadow-lg">
                        <PlayCircle className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-xs text-emerald-100 uppercase tracking-wider mb-1">Activas</p>
                        <p className="text-2xl font-bold text-white">{campaigns.filter(c => c.status === 'active').length}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-5 text-center shadow-lg">
                        <PauseCircle className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-xs text-orange-100 uppercase tracking-wider mb-1">Pausadas</p>
                        <p className="text-2xl font-bold text-white">{campaigns.filter(c => c.status === 'paused').length}</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 text-center shadow-lg">
                        <CheckCircle className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-xs text-blue-100 uppercase tracking-wider mb-1">Completadas</p>
                        <p className="text-2xl font-bold text-white">{campaigns.filter(c => c.status === 'completed').length}</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 text-center shadow-lg">
                        <TrendingUp className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-xs text-purple-100 uppercase tracking-wider mb-1">Meta Total</p>
                        <p className="text-2xl font-bold text-white">
                            {campaigns.reduce((sum, c) => sum + (c.target_sales || 0), 0)}
                        </p>
                    </div>
                </div>

            </div>

            {/* Modales */}
            <CampaignModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                editingCampaign={editingCampaign}
                availableUsers={availableUsers}
            />

            <CampaignDetailModal
                isOpen={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                campaign={selectedCampaign}
            />
        </div>
    );
};

export default Campaigns;