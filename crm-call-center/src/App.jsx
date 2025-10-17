import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore'; 
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

//styles
import './App.css'

//Layout
import MainLayout from './components/layout/MainLayout'
import LoginPage from './pages/auth/LoginPage';
//Mi Empresa
import DashboardMain from './pages/empresa/DashboardMain';
import UserPage from './pages/empresa/UsersPage';
import RolePage from './pages/empresa/RolePage' ;
import ConfigPage from './pages/empresa/ConfigPage';
//Ventas
import DashboardSales from './pages/sales/DashboardSales';
import LeadsPage from './pages/sales/LeadsPage'
import CampaignsPage from './pages/sales/CampaignsPage';
import CallsPage from './pages/sales/CallsPage';

//protected route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to = "/login" replace />;
  }

  return children;

}

function App(){
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>

        { /*ruta publica -> imagino que es como una landing page*/}
        <Route path = "/login" element={<LoginPage />} />

        {/*rutas protegidas -> solo se puede acceder luego de login*/}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        ></Route>

          {/* ruta default -> redirigir al dashboard  */}
          <Route index element={<Navigate to="/empresa/dashboard" replace />} />

          {/*Mi empresa */}
          <Route path="empresa">
            <Route path="dashboard" element={<DashboardMain />} />
            <Route path="user" element={<UserPage />} />
            <Route path="role" element={<RolePage />} />
            <Route path="config" element={<ConfigPage />} />
          </Route>

          {/* Ventas */}
          <Route path="ventas">
            <Route path="dashboard" element={<DashboardSales />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="campaigns" element={<CampaignsPage />} />
            <Route path="calls" element={<CallsPage />} />
          </Route>

          {/* Mi fav -> 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App
