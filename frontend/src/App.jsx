// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// Layout
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/auth/LoginPage';

// Mi Empresa (Company)
import MainCompany from './pages/company/MainCompany';
import CompanyConfig from './pages/company/CompanyConfig';
// Attendance
import Schedules from './pages/company/attendance/Schedules';
import DisconectionTypes from './pages/company/attendance/DisconectionTypes';
import Branches from './pages/company/attendance/Branches';
// Users
import UsersPage from './pages/company/UsersPage';
import Groups from './pages/company/Groups';
// Collaborative
import Announcements from './pages/company/collab/Announcements';
import Popups from './pages/company/collab/Popups';
// Reports Company
import AttendanceReport from './pages/company/reports/AttendanceReport';
import AccessReport from './pages/company/reports/AccessReport';
import SessionsReport from './pages/company/reports/SessionsReport';
import UserNavigationReport from './pages/company/reports/UserNavigationReport';
import ChatsReport from './pages/company/reports/ChatsReport';

// Ventas (Sales)
import MainSales from './pages/sales/MainSales';
import SalesManagement from './pages/sales/SalesManagement';
import SalesManagementCampaign from './pages/sales/SalesManagementCampaign';
// Calls
import ManualCalls from './pages/sales/calls/ManualCalls';
import ProgressiveCalls from './pages/sales/calls/ProgressiveCalls';
import PredictiveCalls from './pages/sales/calls/PredictiveCalls';
import OnlineReport from './pages/sales/calls/OnlineReport';
import LeadsCampaigns from './pages/sales/calls/LeadsCampaigns';
import CallsConfig from './pages/sales/calls/CallsConfig';
// Campaign Config
import Campaigns from './pages/sales/campaign-config/Campaigns';
import StatusTab from './pages/sales/campaign-config/StatusTab';
import Status from './pages/sales/campaign-config/Status';
import FieldsBlocks from './pages/sales/campaign-config/FieldsBlocks';
import Fields from './pages/sales/campaign-config/Fields';
import Categories from './pages/sales/campaign-config/Categories';
import Products from './pages/sales/campaign-config/Products';
import Promotions from './pages/sales/campaign-config/Promotions';
import Supervisors from './pages/sales/campaign-config/Supervisors';
import Agents from './pages/sales/campaign-config/Agents';
import Backoffices from './pages/sales/campaign-config/Backoffices';
import Projections from './pages/sales/campaign-config/Projections';
import LeadLists from './pages/sales/campaign-config/LeadLists';
import RobinsonLists from './pages/sales/campaign-config/RobinsonLists';
import ResultTypes from './pages/sales/campaign-config/ResultTypes';
import Results from './pages/sales/campaign-config/Results';
// Reports Sales
import StatusReport from './pages/sales/reports/StatusReport';
import RankingReport from './pages/sales/reports/RankingReport';
import ConsolidatedReport from './pages/sales/reports/ConsolidatedReport';
import SalesMonitoring from './pages/sales/reports/SalesMonitoring';
import BackofficeMonitoring from './pages/sales/reports/BackofficeMonitoring';
import CallsReport from './pages/sales/reports/CallsReport';
import RecordingsReport from './pages/sales/reports/RecordingsReport';
import RecordingsPhoneReport from './pages/sales/reports/RecordingsPhoneReport';
import RecordingsDurationSummary from './pages/sales/reports/RecordingsDurationSummary';
import ResultListSummary from './pages/sales/reports/ResultListSummary';
import LeadsSearch from './pages/sales/reports/LeadsSearch';
import LeadsPerList from './pages/sales/reports/LeadsPerList';
import CallTimes from './pages/sales/reports/CallTimes';
import AgentWithoutSelling from './pages/sales/reports/AgentWithoutSelling';
import FieldsGrouped from './pages/sales/reports/FieldsGrouped';
import LeadsCalendar from './pages/sales/reports/LeadsCalendar';
import SalesInteraction from './pages/sales/reports/SalesInteraction';
import ExportSalesLog from './pages/sales/reports/ExportSalesLog';
import SalesProjections from './pages/sales/reports/SalesProjections';

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rutas protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Redirect por defecto */}
          <Route index element={<Navigate to="/company/main" replace />} />
          
          {/* MI EMPRESA (COMPANY) */}
          <Route path="company">
            <Route path="main" element={<MainCompany />} />
            <Route path="company-config" element={<CompanyConfig />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="groups" element={<Groups />} />
            
            {/* Attendance */}
            <Route path="attendance">
              <Route path="schedules" element={<Schedules />} />
              <Route path="disconection-types" element={<DisconectionTypes />} />
              <Route path="branches" element={<Branches />} />
            </Route>
            
            {/* Collaborative */}
            <Route path="collab">
              <Route path="announcements" element={<Announcements />} />
              <Route path="popups" element={<Popups />} />
            </Route>
            
            {/* Reports */}
            <Route path="reports">
              <Route path="attendance" element={<AttendanceReport />} />
              <Route path="access" element={<AccessReport />} />
              <Route path="sessions" element={<SessionsReport />} />
              <Route path="user-navigation" element={<UserNavigationReport />} />
              <Route path="chats" element={<ChatsReport />} />
            </Route>
          </Route>
          
          {/* VENTAS (SALES) */}
          <Route path="sales">
            <Route path="main" element={<MainSales />} />
            <Route path="sales" element={<SalesManagement />} />
            <Route path="sales/:campaignId" element={<SalesManagementCampaign />} />
            
            {/* Calls */}
            <Route path="calls">
              <Route path="manual" element={<ManualCalls />} />
              <Route path="progressive" element={<ProgressiveCalls />} />
              <Route path="predictive" element={<PredictiveCalls />} />
              <Route path="online-report" element={<OnlineReport />} />
              <Route path="leads-campaigns" element={<LeadsCampaigns />} />
              <Route path="config" element={<CallsConfig />} />
            </Route>
            
            {/* Campaign Config */}
            <Route path="campaign-config">
              <Route path="campaigns" element={<Campaigns />} />
              <Route path="status-tab" element={<StatusTab />} />
              <Route path="status" element={<Status />} />
              <Route path="fields-blocks" element={<FieldsBlocks />} />
              <Route path="fields" element={<Fields />} />
              <Route path="categories" element={<Categories />} />
              <Route path="products" element={<Products />} />
              <Route path="promotions" element={<Promotions />} />
              <Route path="supervisors" element={<Supervisors />} />
              <Route path="agents" element={<Agents />} />
              <Route path="backoffices" element={<Backoffices />} />
              <Route path="projections" element={<Projections />} />
              <Route path="lead-lists" element={<LeadLists />} />
              <Route path="robinson-lists" element={<RobinsonLists />} />
              <Route path="result-types" element={<ResultTypes />} />
              <Route path="results" element={<Results />} />
            </Route>
            
            {/* Reports */}
            <Route path="reports">
              <Route path="status" element={<StatusReport />} />
              <Route path="ranking" element={<RankingReport />} />
              <Route path="consolidated" element={<ConsolidatedReport />} />
              <Route path="sales-monitoring" element={<SalesMonitoring />} />
              <Route path="backoffice-monitoring" element={<BackofficeMonitoring />} />
              <Route path="calls" element={<CallsReport />} />
              <Route path="recordings" element={<RecordingsReport />} />
              <Route path="recordings-phone" element={<RecordingsPhoneReport />} />
              <Route path="recordings-duration-summary" element={<RecordingsDurationSummary />} />
              <Route path="result-list-summary" element={<ResultListSummary />} />
              <Route path="leads-search" element={<LeadsSearch />} />
              <Route path="leads-per-list" element={<LeadsPerList />} />
              <Route path="call-times" element={<CallTimes />} />
              <Route path="agent-without-selling" element={<AgentWithoutSelling />} />
              <Route path="fields-grouped" element={<FieldsGrouped />} />
              <Route path="leads-calendar" element={<LeadsCalendar />} />
              <Route path="sales-interaction" element={<SalesInteraction />} />
              <Route path="export-sales-log" element={<ExportSalesLog />} />
              <Route path="sales-projections" element={<SalesProjections />} />
            </Route>
          </Route>
        </Route>
        
        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;