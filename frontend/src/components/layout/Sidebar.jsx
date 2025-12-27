import { useState } from 'react'
import { NavLink } from "react-router-dom";
import { useThemeStore } from '../../store/themeStore';
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
    Wifi,
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
    // Obtener colores del theme store
    const { primaryColor, secondaryColor, companyName } = useThemeStore();

    const [expandedSections, setExpandedSections] = useState({});
    
    // Función para determinar si un color es claro u oscuro
    const isLightColor = (color) => {
        // Convertir hex a RGB
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // Calcular luminosidad
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        return luminance > 0.5;
    };
    
    // Determinar colores de texto basados en el fondo
    const isLight = isLightColor(secondaryColor);
    
    // Colores dinámicos
    const textPrimary = isLight ? '#1f2937' : '#f3f4f6';  // gray-800 : gray-100
    const textSecondary = isLight ? '#4b5563' : '#d1d5db'; // gray-600 : gray-300
    const textMuted = isLight ? '#6b7280' : '#9ca3af';     // gray-500 : gray-400
    const hoverBg = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
    const activeBg = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.1)';
    const borderColor = isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';
    const iconBg = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.1)';
    
    const toggleSection = (sectionKey) => {
        setExpandedSections(prev => {
            const newState = {};
            if (!prev[sectionKey]) {
                newState[sectionKey] = true;
            }
            return newState;
        });
    }

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
                        { name: 'Horarios', icon: LayoutDashboard, path: '/company/attendance/schedules' },
                        { name: 'Desconexiones', icon: Wifi, path: '/company/attendance/disconection-types' },
                        { name: 'Sede', icon: MapPin, path: '/company/attendance/branches' }
                    ]
                },
                {
                    name: 'Administración de Usuarios',
                    icon: Users,
                    subItems: [
                        { name: 'Usuarios', icon: Users, path: '/company/users' },
                        { name: 'Grupos de Usuarios', icon: UserCog, path: '/company/groups' }
                    ]
                },
                {
                    name: 'Colaborativo',
                    icon: Megaphone,
                    subItems: [
                        { name: 'Anuncios', icon: Megaphone, path: '/company/collab/announcements' },
                        { name: 'Popups de Bienvenida', icon: MessageSquare, path: '/company/collab/popups' }
                    ]
                },
                {
                    name: 'Reportes',
                    icon: FileText,
                    subItems: [
                        { name: 'Asistencia', icon: Clock, path: '/company/reports/attendance' },
                        { name: 'Acceso al Sistema', icon: LogIn, path: '/company/reports/access' },
                        { name: 'Movimientos por Usuario', icon: Activity, path: '/company/reports/sessions' },
                        { name: 'Navegación por Usuario', icon: Navigation, path: '/company/reports/user-navigation' },
                        { name: 'Chats Iniciados', icon: MessageCircle, path: '/company/reports/chats' }
                    ]
                }
            ]
        },
        {
            section: 'Ventas',
            key: 'sales',
            items: [
                { name: 'Inicio', icon: TrendingUp, path: '/sales/main' },
                { name: 'Gestion de Ventas', icon: Target, path: '/sales/sales' },
                {
                    name: 'Gestion de Llamadas',
                    icon: Phone,
                    subItems: [
                        { name: 'Llamadas Manuales', icon: Phone, path: '/sales/calls/manual' },
                        { name: 'Llamadas en Progresivo', icon: Headphones, path: '/sales/calls/progressive' },
                        { name: 'Llamadas en Predictivo', icon: Radio, path: '/sales/calls/predictive' },
                        { name: 'Monitoreo de Llamadas', icon: Eye, path: '/sales/calls/online-report' },
                        { name: 'Campañas Telefónicas (Predictivo)', icon: Radio, path: '/sales/calls/leads-campaigns' },
                        { name: 'Configuración Telefónica', icon: SettingsIcon, path: '/sales/calls/config' }
                    ]
                },
                {
                    name: 'Configuracion de Campañas',
                    icon: Settings,
                    subItems: [
                        { name: 'Campañas', icon: Target, path: '/sales/campaign-config/campaigns' },
                        { name: 'Pestañas de Estados', icon: Layers, path: '/sales/campaign-config/status-tab' },
                        { name: 'Estados', icon: Grid, path: '/sales/campaign-config/status' },
                        { name: 'Bloques de Campos', icon: Layers, path: '/sales/campaign-config/fields-blocks' },
                        { name: 'Campos', icon: Grid, path: '/sales/campaign-config/fields-' },
                        { name: 'Categorías', icon: Tag, path: '/sales/campaign-config/categories' },
                        { name: 'Productos', icon: Package, path: '/sales/campaign-config/products' },
                        { name: 'Promociones', icon: Percent, path: '/sales/campaign-config/promotions' },
                        { name: 'Supervisores', icon: UserCog, path: '/sales/campaign-config/supervisors' },
                        { name: 'Agentes', icon: UsersIcon, path: '/sales/campaign-config/agents' },
                        { name: 'Back Office / Jefes de Equipo', icon: Briefcase, path: '/sales/campaign-config/backoffices' },
                        { name: 'Config. de Proyecciones de Venta', icon: TrendingUp, path: '/sales/campaign-config/projections' },
                        { name: 'Listas de Leads', icon: List, path: '/sales/campaign-config/lead-lists' },
                        { name: 'Listas Negras', icon: Ban, path: '/sales/campaign-config/robinson-lists' },
                        { name: 'Tipos de Tipificaciones', icon: Tag, path: '/sales/campaign-config/result-types' },
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
                        { name: 'Llamadas Tipificadas', icon: PhoneCall, path: '/sales/reports/calls' },
                        { name: 'Grabaciones por Dia', icon: Mic, path: '/sales/reports/recordings' },
                        { name: 'Grabaciones por Telefono', icon: Phone, path: '/sales/reports/recordings-phone' },
                        { name: 'Resúmen de Duracion de Audios', icon: Clock3, path: '/sales/reports/recordings-duration-summary' },
                        { name: 'Resumen Tipificaciones por Lista', icon: List, path: '/sales/reports/result-list-summary' },
                        { name: 'Búsqueda de Leads Gestionados', icon: Search, path: '/sales/reports/leads-search' },
                        { name: 'Leads por Lista', icon: Database, path: '/sales/reports/leads-per-list' },
                        { name: 'Tiempos de Gestión Telefónica', icon: Clock, path: '/sales/reports/call-times' },
                        { name: 'Tiempo Agente sin Vender', icon: Clock3, path: '/sales/reports/agent-without-selling' },
                        { name: 'Ventas Contabilizadas por Campos', icon: Grid, path: '/sales/reports/fields-grouped' },
                        { name: 'Calendarios de Leads Gestionados', icon: Calendar, path: '/sales/reports/leads-calendar' },
                        { name: 'Interaccion de Ventas', icon: Activity, path: '/sales/reports/sales-interaction' },
                        { name: 'Log Exportados de Ventas', icon: Download, path: '/sale/reports/export-sales-log' },
                        { name: 'Proyecciones de Ventas', icon: PieChart, path: '/sales/reports/' }
                    ]
                }
            ]
        },
    ];

    const renderMenuItem = (item, isNested = false) => {
        if (item.subItems) {
            const isExpanded = expandedSections[item.name];

            return (
                <div key={item.name} className="mb-0.5">
                    <button
                        onClick={() => toggleSection(item.name)}
                        className={`
                            group flex items-center w-full rounded-md
                            transition-all duration-200 ease-out
                            ${isOpen ? 'justify-between px-3 py-2.5' : 'justify-center py-2.5'}
                        `}
                        style={{
                            color: isExpanded ? textPrimary : textSecondary,
                            backgroundColor: isExpanded ? activeBg : 'transparent',
                            fontWeight: isExpanded ? '600' : '500'
                        }}
                        onMouseEnter={(e) => {
                            if (!isExpanded) {
                                e.currentTarget.style.backgroundColor = hoverBg;
                                e.currentTarget.style.color = textPrimary;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isExpanded) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = textSecondary;
                            }
                        }}
                    >
                        <div className="flex items-center justify-center min-w-0">
                            <div 
                                className="flex items-center justify-center w-9 h-9 rounded-md flex-shrink-0 transition-all duration-200"
                                style={{
                                    backgroundColor: isExpanded ? primaryColor : iconBg,
                                    color: isExpanded ? '#ffffff' : textSecondary
                                }}
                            >
                                <item.icon className="w-5 h-5" strokeWidth={2} />
                            </div>
                            {isOpen && (
                                <span className="ml-3 text-sm text-left truncate">{item.name}</span>
                            )}
                        </div>
                        {isOpen && (
                            <div className={`transition-transform duration-200 flex-shrink-0 ml-2 ${isExpanded ? 'rotate-180' : ''}`}>
                                <ChevronDown className="w-4 h-4" strokeWidth={2} style={{ color: textMuted }} />
                            </div>
                        )}
                    </button>

                    {/* Sub-items */}
                    <div className={`
                        overflow-hidden transition-all duration-300 ease-out
                        ${isOpen && isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
                    `}>
                        <div 
                            className="ml-5 mt-1 pl-4 border-l-2 space-y-0.5"
                            style={{ borderColor: borderColor }}
                        >
                            {item.subItems.map((subItem) => (
                                <NavLink
                                    key={subItem.path}
                                    to={subItem.path}
                                    className="group flex items-center px-3 py-2 rounded-md transition-all duration-200"
                                    style={({ isActive }) => ({
                                        backgroundColor: isActive ? primaryColor : 'transparent',
                                        color: isActive ? '#ffffff' : textSecondary
                                    })}
                                    onMouseEnter={(e) => {
                                        const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
                                        if (!isActive) {
                                            e.currentTarget.style.backgroundColor = hoverBg;
                                            e.currentTarget.style.color = textPrimary;
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
                                        if (!isActive) {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.color = textSecondary;
                                        }
                                    }}
                                >
                                    <div className="flex items-center justify-center w-4 h-4 flex-shrink-0 mr-2.5">
                                        <subItem.icon className="w-4 h-4" strokeWidth={2} />
                                    </div>
                                    <span className="text-sm text-left truncate">{subItem.name}</span>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        // Item simple
        return (
            <NavLink
                key={item.path}
                to={item.path}
                className={`group flex items-center rounded-md mb-0.5 transition-all duration-200 ease-out ${isOpen ? 'px-3 py-2.5' : 'justify-center py-2.5'}`}
                style={({ isActive }) => ({
                    backgroundColor: isActive ? primaryColor : 'transparent',
                    color: isActive ? '#ffffff' : textSecondary
                })}
                onMouseEnter={(e) => {
                    const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
                    if (!isActive) {
                        e.currentTarget.style.backgroundColor = hoverBg;
                        e.currentTarget.style.color = textPrimary;
                    }
                }}
                onMouseLeave={(e) => {
                    const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
                    if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = textSecondary;
                    }
                }}
            >
                {({ isActive }) => (
                    <>
                        <div 
                            className="flex items-center justify-center w-9 h-9 rounded-md flex-shrink-0 transition-all duration-200"
                            style={{
                                backgroundColor: isActive ? `${primaryColor}dd` : iconBg,
                                color: isActive ? '#ffffff' : textSecondary
                            }}
                        >
                            <item.icon className="w-5 h-5" strokeWidth={2} />
                        </div>
                        {isOpen && (
                            <span className="ml-3 text-sm font-medium text-left truncate">{item.name}</span>
                        )}
                    </>
                )}
            </NavLink>
        );
    };

    return (
        <>
            {/* Overlay móvil */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-30
                    border-r
                    transition-all duration-300 ease-in-out
                    shadow-2xl lg:shadow-xl
                    ${isOpen ? 'w-72' : 'w-0 lg:w-20'}
                    overflow-hidden
                `}
                style={{ 
                    backgroundColor: secondaryColor,
                    borderColor: borderColor
                }}
            >
                <div className="flex flex-col h-full">
                    {/* Header / Logo */}
                    <div 
                        className="flex items-center justify-center h-16 px-4 border-b"
                        style={{ 
                            borderColor: borderColor,
                            backgroundColor: isLight ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.02)'
                        }}
                    >
                        {isOpen ? (
                            <div className="flex items-center space-x-3 w-full">
                                <div 
                                    className="flex items-center justify-center w-10 h-10 rounded-lg shadow-lg flex-shrink-0"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    <Building2 className="w-5 h-5 text-white" strokeWidth={2} />
                                </div>
                                <div className="flex flex-col min-w-0 flex-1">
                                    <span 
                                        className="text-lg font-bold tracking-tight truncate"
                                        style={{ color: textPrimary }}
                                    >
                                        {companyName || 'CRM DreamTeam'}
                                    </span>
                                    <span 
                                        className="text-xs font-medium"
                                        style={{ color: textMuted }}
                                    >
                                        Enterprise Suite
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center w-full">
                                <div 
                                    className="flex items-center justify-center w-10 h-10 rounded-lg shadow-lg"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    <Building2 className="w-5 h-5 text-white" strokeWidth={2} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
                        {menuItems.map((section, idx) => (
                            <div key={idx} className="mb-6">
                                {isOpen && (
                                    <div className="flex items-center px-3 mb-3">
                                        <div 
                                            className="h-px flex-1"
                                            style={{ 
                                                background: `linear-gradient(to right, ${borderColor}, transparent)` 
                                            }}
                                        ></div>
                                        <h3 
                                            className="px-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                                            style={{ color: textMuted }}
                                        >
                                            {section.section}
                                        </h3>
                                        <div 
                                            className="h-px flex-1"
                                            style={{ 
                                                background: `linear-gradient(to left, ${borderColor}, transparent)` 
                                            }}
                                        ></div>
                                    </div>
                                )}

                                <div className="space-y-0.5">
                                    {section.items.map((item) => renderMenuItem(item))}
                                </div>
                            </div>
                        ))}
                    </nav>

                    {/* Footer */}
                    {isOpen && (
                        <div 
                            className="p-4 border-t"
                            style={{ 
                                borderColor: borderColor,
                                backgroundColor: isLight ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.02)'
                            }}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse flex-shrink-0"></div>
                                <span className="text-xs" style={{ color: textMuted }}>Sistema Activo</span>
                            </div>
                        </div>
                    )}

                    {/* Estilos del scrollbar */}
                    <style>{`
                        .custom-scrollbar::-webkit-scrollbar {
                            width: 6px;
                        }
                        
                        .custom-scrollbar::-webkit-scrollbar-track {
                            background: transparent;
                        }
                        
                        .custom-scrollbar::-webkit-scrollbar-thumb {
                            background: ${isLight ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)'};
                            border-radius: 10px;
                        }
                        
                        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                            background: ${isLight ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.25)'};
                        }
                        
                        .custom-scrollbar {
                            scrollbar-width: thin;
                            scrollbar-color: ${isLight ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)'} transparent;
                        }
                    `}</style>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;