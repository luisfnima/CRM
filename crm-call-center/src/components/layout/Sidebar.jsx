import { useState } from 'react'
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Shield,
    Settings,
    Building2,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    Clock,
    WiFi,
    MapPin,
    UserCog,
    Megaphone,
    MessageSquare,
    FileText,
    LogIn,
    Activity,
    UserSearch,
    Navigation,
    MessageCircle,
    TrendingUp,
    Phone,
    Headphones,
    Radio,
    Eye,
    Settings as SettingsIcon,
    Layers,
    Grid,
    Tag,
    Package,
    Percent,
    Users as UsersIcon,
    Target,
    List,
    Ban,
    CheckSquare,
    BarChart,
    Award,
    Calendar,
    Briefcase,
    PhoneCall,
    Mic,
    Search,
    Clock3,
    Database,
    Download,
    PieChart
} from 'lucide-react'

const Sidebar = ({ isOpen, setIsOpen }) => {
    const menuItems = [
        {
            section: 'Mi Empresa',
            key: 'company',
            items: [
                { name: 'Inicio', icon: LayoutDashboard, path: '/company/main' },
                { name: 'Config de Empresa', icon: Building2, path: '/company/company-config' },
                {
                    name: 'Config. de Asistencia',
                    icon: Clock,
                    subItems: [
                        { name: 'Horarios', icon: LayoutDashboard, path: '/company/attendance/schedules'},
                        { name: 'Tipos de Conexión', icon: 'Wifi', path: '/company/attendance/disconection-types'},
                        { name: 'Sede', icon: MapPin, path: '/company/attendance/branches' }
                    ]
                },
                {
                    name: 'Administración de Usuarios',
                    icon: Users,
                    subItems: [
                        { name: 'Usuarios', icon: Users, path: '/company/users'},
                        { name: 'Grupos de Usuarios', icon: UserCog, pah: '/company/groups' }
                    ]
                },
                {
                    name: 'Colaborativo',
                    icon: Megaphone,
                    subItems: [
                        { name: 'Anuncios', icon: Megaphone, path: '/company/collab/announcements' },
                        { name: 'Popups de Bienvenida', icon: MessageSquare, path: '/company/collab/popups'}
                    ]
                },
                {
                    name: 'Reportes',
                    icon: FileText,
                    subitems: [
                        { name: 'Asistencia', icon: Clock, path: '/company/reports/attendance'},
                        { name: 'Acceso al Sistema', icon: LogIn, path: '/company/reports/access'},
                        { name: 'Movimientos por Usuario', icon: Activity, paath: '/company/reports/sessions'},
                        { name: 'Navegación por Usuario', icon: Navigation, path: '/company/reports/user-navigation'},
                        { name: 'Chats Iniciados', icon: MessageCircle, path: '/company/reports/chats'}
                    ]
                }
            ]
        },
        {
            section: 'Ventas',
            key: 'sales',
            items: [
                { name: 'Inicio', icon: TrendingUp, path: '/sales/main'},
                { name: 'Gestion de Ventas', icon: Target, path: '/sales/sales'},
                {
                    name: 'Gestion de Llamadas',
                    icon: Phone,
                    subitems:[
                        { name: 'Llamadas Manuales', icon: Phone, path: '/sales/calls/manual'},
                        { name: 'Llamadas en Progresivo', icon: Headphones, path: '/sales/calls/progressive'},
                        { name: 'Llamadas en Predictivo', icon: Radio, path: '/sales/calls/predictive'},
                        { name: 'Monitoreo de Llamadas', icon: Eye, path: '/sales/calls/online-report'},
                        { name: 'Campañas Telefónicas (Predictivo)', icon: Radio, path: '/sales/calls/leads-campaigns'},
                        { name: 'Configuración Telefónica', icon: SettingsIcon, path: '/sales/calls/config'}
                    ]
                },
                {
                    name: 'Configuracion de Campañas',
                    icon: Settings,
                    subItems: [
                        { name: 'Campañas', icon: Target, path: '/sales/campaign-config/campaigns'},
                        { name: 'Pestañas de Estados', icon: Layers, path: '/sales/campaign-config/status-tab'},
                        { name: 'Estados', icon: Grid, path: '/sales/campaign-config/status'},
                        { name: 'Bloques de Campos', icon: Layers, path: '/sales/campaign-config/fields-blocks'},
                        { name: 'Campos', icon: Grid, path: '/sales/campaign-config/fields'},
                        { name: 'Categorías', icon: Tag, path: '/sales/campaign-config/categories'},
                        { name: 'Productos', icon: Package, path: '/sales/campaign-config/products'},
                        { name: 'Promociones', icon: Percent, path: '/sales/campaign-config/promotions'},
                        { name: 'Supervisores', icon: UserCog, path: '/sales/campaign-config/supervisors'},
                        { name: 'Agentes', icon: UsersIcon, path: '/sales/campaign-config/agents'},
                        { name: 'Back Office / Jefes de Equipo', icon: Briefcase, path: '/sales/campaign-config/backoffices'},
                        { name: 'Config. de Proyecciones de Venta', icon: TrendingUp, path: '/sales/campaign-config/projections' },
                        { name: 'Listas de Leads', icon: List, path: '/sales/campaign-config/lead-lists' },
                        { name: 'Listas Negras', icon: Ban, path: '/sales/campaign-config/robinson-lists' },
                        { name: 'Tipos de Tipificaciones', icon: Tag, path: '/sales/campaign-config/result-types'},
                        { name: 'Tipificaciones', icon: CheckSquare, path: '/sales/campaign-config/results' }
                    ]
                },
                {
                    name: 'Reportes',
                    icon: BarChart,
                    subItems: [
                        { name: 'Estados de Venta', icon: Grid, path: '/sales/reports/status' },
                        { name: 'Ranking de Vendedores', icon: Award, path: '/sales/reports/ranking' },
                        { name: 'Consolidado de Ventas', icon: BarChart, path: '/sales/reports/consolidated' },
                        { name: 'Monitoreo Diario de Ventas', icon: Calendar, path: '/sales/reports/sales-monitoring' },
                        { name: 'Monitoreo BackOffice', icon: Briefcase, path: '/sales/reports/backoffice-monitoring' },
                        { name: 'Llamadas Tipificadas', icon: PhoneCall, path: '/sales/reports/calls'},
                        { name: 'Grabaciones por Dia', icon: Mic, path: '/sales/reports/recordings'},
                        { name: 'Grabaciones por Telefono', icon: Phone, path: '/sales/reports/recordings-phone'},
                        { name: 'Resúmen de Duracion de Audios', icon: Clock3, path: '/sales/reports/recordings-duration-summary'},
                        { name: 'Resumen Tipificaciones por Lista', icon: List, path: '/sales/reports/result-list-summary'},
                        { name: 'Búsqueda de Leads Gestionados', icon: Search, path: '/sales/reports/leads-search'},
                        { name: 'Leads por Lista', icon: Database, path: '/sales/reports/leads-per-list'},
                        { name: 'Tiempos de Gestión Telefónica', icon: Clock, path: '/sales/reports/call-times'},
                        { name: 'Tiempo Agente sin Vender', icon: Clock3, path: '/sales/reports/agent-without-selling'},
                        { name: 'Ventas Contabilizadas por Campos', icon: Grid, path: '/sales/reports/fields-grouped'},
                        { name: 'Calendarios de Leads Gestionados', icon: Calendar, path: '/sales/reports/leads-calendar' },
                        { name: 'Interaccion de Ventas', icon: Activity, path: '/sales/reports/sales-interaction' },
                        { name: 'Log Exportados de Ventas', icon: Download, path: '/sale/reports/export-sales-log'},
                        { name: 'Proyecciones de Ventas', icon: PieChart, path: '/sales/reports/'}
                    ]
                }
            ]
        },
    ]

    return (
        <>
            {/* version movil? */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/** Sidebar */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-30
                    bg-white border-r border-gray-200
                    transition-all duration-300 ease-in-out
                    ${isOpen ? 'w-64' : 'w-0 lg:w-20'}
                    overflow-hidden
                `}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                        {isOpen && (
                            <div className="flex items-center space-x-2">
                                <Building2 className="w-8 h-8 text-blue-600" />
                                <span className="text-xl font-bold text-gray-800">CRM Call</span>
                            </div>
                        )}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="hidden lg:block p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            {isOpen ? (
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            ) : (
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                            )}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-4 px-2">
                        {menuItems.map((section, idx) => (
                            <div key={idx} className="mb-6">
                                {isOpen && (
                                    <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        {section.section}
                                    </h3>
                                )}

                                <div className="space-y-1">
                                    {section.items.map((item) => (
                                        <NavLink
                                            key={item.path}
                                            to={item.path}
                                            className={({ isActive }) => `
                        flex items-center px-3 py-2.5 rounded-lg
                        transition-colors duration-200
                        ${isActive
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                                }
                        ${!isOpen && 'justify-center'}
                      `}
                                        >
                                            <item.icon className={`w-5 h-5 ${isOpen && 'mr-3'}`} />
                                            {isOpen && (
                                                <span className="text-sm font-medium">{item.name}</span>
                                            )}
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>

                </div>

            </aside >

        </>
    )

}

export default Sidebar