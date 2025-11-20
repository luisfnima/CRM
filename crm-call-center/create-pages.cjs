// create-pages.js (ES6 version)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para crear directorios si no existen
function ensureDirectoryExists(filePath) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

// Lista de archivos a crear
const files = [
  // COMPANY
  { path: 'src/pages/company/MainCompany.jsx', name: 'MainCompany', title: 'Inicio - Mi Empresa', desc: 'Dashboard principal', icon: 'LayoutDashboard' },
  { path: 'src/pages/company/CompanyConfig.jsx', name: 'CompanyConfig', title: 'Configuración de Empresa', desc: 'Configura nombre y color primario', icon: 'Building2' },
  { path: 'src/pages/company/Groups.jsx', name: 'Groups', title: 'Grupos de Usuarios', desc: 'Define roles y permisos', icon: 'UserCog' },
  
  // ATTENDANCE
  { path: 'src/pages/company/attendance/Schedules.jsx', name: 'Schedules', title: 'Horarios', desc: 'Gestión de horarios', icon: 'Clock' },
  { path: 'src/pages/company/attendance/DisconectionTypes.jsx', name: 'DisconectionTypes', title: 'Tipos de Conexión', desc: 'Configura tipos de conexión', icon: 'Wifi' },
  { path: 'src/pages/company/attendance/Branches.jsx', name: 'Branches', title: 'Sede', desc: 'Administración de sedes', icon: 'MapPin' },
  
  // COLLAB
  { path: 'src/pages/company/collab/Announcements.jsx', name: 'Announcements', title: 'Anuncios', desc: 'Gestión de anuncios internos', icon: 'Megaphone' },
  { path: 'src/pages/company/collab/Popups.jsx', name: 'Popups', title: 'Popups de Bienvenida', desc: 'Mensajes al iniciar sesión', icon: 'MessageSquare' },
  
  // REPORTS COMPANY
  { path: 'src/pages/company/reports/AttendanceReport.jsx', name: 'AttendanceReport', title: 'Reporte de Asistencia', desc: 'Historial de asistencia', icon: 'Clock' },
  { path: 'src/pages/company/reports/AccessReport.jsx', name: 'AccessReport', title: 'Acceso al Sistema', desc: 'Páginas visitadas en sesión', icon: 'LogIn' },
  { path: 'src/pages/company/reports/SessionsReport.jsx', name: 'SessionsReport', title: 'Movimientos por Usuario', desc: 'Filtro por usuario', icon: 'Activity' },
  { path: 'src/pages/company/reports/UserNavigationReport.jsx', name: 'UserNavigationReport', title: 'Navegación de Usuarios', desc: 'Todos los movimientos', icon: 'Navigation' },
  { path: 'src/pages/company/reports/ChatsReport.jsx', name: 'ChatsReport', title: 'Chats Iniciados', desc: 'Historial de chats', icon: 'MessageCircle' },
  
  // SALES
  { path: 'src/pages/sales/MainSales.jsx', name: 'MainSales', title: 'Inicio - Ventas', desc: 'Dashboard de ventas', icon: 'TrendingUp' },
  { path: 'src/pages/sales/SalesManagement.jsx', name: 'SalesManagement', title: 'Gestión de Ventas', desc: 'Lista de campañas', icon: 'Target' },
  { path: 'src/pages/sales/SalesManagementCampaign.jsx', name: 'SalesManagementCampaign', title: 'Gestión de Campaña', desc: 'Resumen de campaña', icon: 'Target' },
  
  // CALLS
  { path: 'src/pages/sales/calls/ManualCalls.jsx', name: 'ManualCalls', title: 'Llamadas Manuales', desc: 'Gestión de llamadas manuales', icon: 'Phone' },
  { path: 'src/pages/sales/calls/ProgressiveCalls.jsx', name: 'ProgressiveCalls', title: 'Llamadas Progresivo', desc: 'Llamadas progresivas', icon: 'Headphones' },
  { path: 'src/pages/sales/calls/PredictiveCalls.jsx', name: 'PredictiveCalls', title: 'Llamadas Predictivo', desc: 'Llamadas predictivas', icon: 'Radio' },
  { path: 'src/pages/sales/calls/OnlineReport.jsx', name: 'OnlineReport', title: 'Monitoreo de Llamadas', desc: 'Monitoreo en tiempo real', icon: 'Eye' },
  { path: 'src/pages/sales/calls/LeadsCampaigns.jsx', name: 'LeadsCampaigns', title: 'Campañas Telefónicas', desc: 'Campañas predictivo', icon: 'Radio' },
  { path: 'src/pages/sales/calls/CallsConfig.jsx', name: 'CallsConfig', title: 'Configuración Telefónica', desc: 'Ajustes telefónicos', icon: 'Settings' },
  
  // CAMPAIGN CONFIG
  { path: 'src/pages/sales/campaign-config/Campaigns.jsx', name: 'Campaigns', title: 'Campañas', desc: 'Gestión de campañas', icon: 'Target' },
  { path: 'src/pages/sales/campaign-config/StatusTab.jsx', name: 'StatusTab', title: 'Pestañas de Estados', desc: 'Configurar pestañas', icon: 'Layers' },
  { path: 'src/pages/sales/campaign-config/Status.jsx', name: 'Status', title: 'Estados', desc: 'Estados de ventas', icon: 'Grid' },
  { path: 'src/pages/sales/campaign-config/FieldsBlocks.jsx', name: 'FieldsBlocks', title: 'Bloques de Campos', desc: 'Agrupar campos', icon: 'Layers' },
  { path: 'src/pages/sales/campaign-config/Fields.jsx', name: 'Fields', title: 'Campos', desc: 'Campos personalizados', icon: 'Grid' },
  { path: 'src/pages/sales/campaign-config/Categories.jsx', name: 'Categories', title: 'Categorías', desc: 'Categorías de productos', icon: 'Tag' },
  { path: 'src/pages/sales/campaign-config/Products.jsx', name: 'Products', title: 'Productos', desc: 'Catálogo de productos', icon: 'Package' },
  { path: 'src/pages/sales/campaign-config/Promotions.jsx', name: 'Promotions', title: 'Promociones', desc: 'Gestión de promociones', icon: 'Percent' },
  { path: 'src/pages/sales/campaign-config/Supervisors.jsx', name: 'Supervisors', title: 'Supervisores', desc: 'Asignación de supervisores', icon: 'UserCog' },
  { path: 'src/pages/sales/campaign-config/Agents.jsx', name: 'Agents', title: 'Agentes', desc: 'Gestión de agentes', icon: 'Users' },
  { path: 'src/pages/sales/campaign-config/Backoffices.jsx', name: 'Backoffices', title: 'Back Office', desc: 'Jefes de equipo', icon: 'Briefcase' },
  { path: 'src/pages/sales/campaign-config/Projections.jsx', name: 'Projections', title: 'Proyecciones de Ventas', desc: 'Configurar proyecciones', icon: 'TrendingUp' },
  { path: 'src/pages/sales/campaign-config/LeadLists.jsx', name: 'LeadLists', title: 'Listas de Leads', desc: 'Gestión de listas', icon: 'List' },
  { path: 'src/pages/sales/campaign-config/RobinsonLists.jsx', name: 'RobinsonLists', title: 'Listas Negras', desc: 'Números bloqueados', icon: 'Ban' },
  { path: 'src/pages/sales/campaign-config/ResultTypes.jsx', name: 'ResultTypes', title: 'Tipos de Tipificaciones', desc: 'Tipos de resultados', icon: 'Tag' },
  { path: 'src/pages/sales/campaign-config/Results.jsx', name: 'Results', title: 'Tipificaciones', desc: 'Resultados de llamadas', icon: 'CheckSquare' },
  
  // REPORTS SALES
  { path: 'src/pages/sales/reports/StatusReport.jsx', name: 'StatusReport', title: 'Estados de Venta', desc: 'Reporte de estados', icon: 'Grid' },
  { path: 'src/pages/sales/reports/RankingReport.jsx', name: 'RankingReport', title: 'Ranking de Vendedores', desc: 'Top vendedores', icon: 'Award' },
  { path: 'src/pages/sales/reports/ConsolidatedReport.jsx', name: 'ConsolidatedReport', title: 'Consolidado de Ventas', desc: 'Resumen general', icon: 'BarChart' },
  { path: 'src/pages/sales/reports/SalesMonitoring.jsx', name: 'SalesMonitoring', title: 'Monitoreo Diario', desc: 'Seguimiento diario', icon: 'Calendar' },
  { path: 'src/pages/sales/reports/BackofficeMonitoring.jsx', name: 'BackofficeMonitoring', title: 'Monitoreo BackOffice', desc: 'Seguimiento BO', icon: 'Briefcase' },
  { path: 'src/pages/sales/reports/CallsReport.jsx', name: 'CallsReport', title: 'Llamadas Tipificadas', desc: 'Historial de llamadas', icon: 'PhoneCall' },
  { path: 'src/pages/sales/reports/RecordingsReport.jsx', name: 'RecordingsReport', title: 'Grabaciones por Día', desc: 'Audios grabados', icon: 'Mic' },
  { path: 'src/pages/sales/reports/RecordingsPhoneReport.jsx', name: 'RecordingsPhoneReport', title: 'Grabaciones por Teléfono', desc: 'Audios por número', icon: 'Phone' },
  { path: 'src/pages/sales/reports/RecordingsDurationSummary.jsx', name: 'RecordingsDurationSummary', title: 'Duración de Audios', desc: 'Resumen de tiempos', icon: 'Clock' },
  { path: 'src/pages/sales/reports/ResultListSummary.jsx', name: 'ResultListSummary', title: 'Tipificaciones por Lista', desc: 'Resumen por lista', icon: 'List' },
  { path: 'src/pages/sales/reports/LeadsSearch.jsx', name: 'LeadsSearch', title: 'Búsqueda de Leads', desc: 'Buscar leads gestionados', icon: 'Search' },
  { path: 'src/pages/sales/reports/LeadsPerList.jsx', name: 'LeadsPerList', title: 'Leads por Lista', desc: 'Leads por lista', icon: 'Database' },
  { path: 'src/pages/sales/reports/CallTimes.jsx', name: 'CallTimes', title: 'Tiempos de Gestión', desc: 'Tiempos telefónicos', icon: 'Clock' },
  { path: 'src/pages/sales/reports/AgentWithoutSelling.jsx', name: 'AgentWithoutSelling', title: 'Tiempo sin Vender', desc: 'Agentes sin ventas', icon: 'Clock' },
  { path: 'src/pages/sales/reports/FieldsGrouped.jsx', name: 'FieldsGrouped', title: 'Ventas por Campos', desc: 'Contabilizado por campos', icon: 'Grid' },
  { path: 'src/pages/sales/reports/LeadsCalendar.jsx', name: 'LeadsCalendar', title: 'Calendarios de Leads', desc: 'Vista de calendario', icon: 'Calendar' },
  { path: 'src/pages/sales/reports/SalesInteraction.jsx', name: 'SalesInteraction', title: 'Interacción de Ventas', desc: 'Interacciones', icon: 'Activity' },
  { path: 'src/pages/sales/reports/ExportSalesLog.jsx', name: 'ExportSalesLog', title: 'Log de Exportados', desc: 'Historial de exports', icon: 'Download' },
  { path: 'src/pages/sales/reports/SalesProjections.jsx', name: 'SalesProjections', title: 'Proyecciones de Ventas', desc: 'Proyecciones', icon: 'PieChart' },
];

// Crear PlaceholderPage component
const placeholderComponent = `import { Construction } from 'lucide-react';

const PlaceholderPage = ({ title, description, icon: Icon }) => {
  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          {Icon && <Icon className="w-8 h-8 text-blue-600" />}
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
        {description && (
          <p className="text-gray-600">{description}</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Construction className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Módulo en Construcción
          </h3>
          <p className="text-gray-500 max-w-md">
            Esta página estará disponible próximamente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;
`;

console.log('🚀 Iniciando creación de archivos...\n');

// Crear PlaceholderPage
const placeholderPath = 'src/components/common/PlaceholderPage.jsx';
ensureDirectoryExists(placeholderPath);
fs.writeFileSync(placeholderPath, placeholderComponent);
console.log(`✅ Creado: ${placeholderPath}\n`);

// Crear todos los archivos
files.forEach(file => {
  // Ajustar nivel de importación según profundidad
  let importLevel = '../../../components/common/PlaceholderPage';
  const depth = file.path.split('/').length - 3;
  if (depth === 3) importLevel = '../../components/common/PlaceholderPage';
  else if (depth === 4) importLevel = '../../../components/common/PlaceholderPage';
  else if (depth === 5) importLevel = '../../../../components/common/PlaceholderPage';

  const content = `import PlaceholderPage from '${importLevel}';
import { ${file.icon} } from 'lucide-react';

const ${file.name} = () => {
  return (
    <PlaceholderPage 
      title="${file.title}"
      description="${file.desc}"
      icon={${file.icon}}
    />
  );
};

export default ${file.name};
`;

  ensureDirectoryExists(file.path);
  fs.writeFileSync(file.path, content);
  console.log(`✅ Creado: ${file.path}`);
});

console.log('\n🎉 ¡Todos los archivos han sido creados exitosamente!');
console.log('👉 Ahora ejecuta: npm run dev');