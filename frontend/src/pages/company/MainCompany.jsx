import { useState } from 'react';
import { LayoutDashboard, Users, Target, Clock, AlertTriangle, CheckCircle, Building2, Calendar, TrendingUp, UserCheck, UserX } from 'lucide-react';

const MainCompany = () => {
  const [showInactive, setShowInactive] = useState(false);

  // Datos de ejemplo
  const companyInfo = {
    name: 'DREAM TEAM',
    logo_url: '',
  };

  const campaignsData = [
    {
      id: 1,
      name: 'Campaña Black Friday 2025',
      active_users: 12,
      total_users: 15,
      status: 'active'
    },
    {
      id: 2,
      name: 'Cobranzas Q4 2025',
      active_users: 8,
      total_users: 10,
      status: 'active'
    },
    {
      id: 3,
      name: 'Encuesta de Satisfacción 2025',
      active_users: 0,
      total_users: 5,
      status: 'paused'
    },
    {
      id: 4,
      name: 'Retención de Clientes Premium',
      active_users: 0,
      total_users: 8,
      status: 'completed'
    },
    {
      id: 5,
      name: 'Telemarketing Navidad',
      active_users: 0,
      total_users: 12,
      status: 'inactive'
    }
  ];

  const attendanceData = {
    tardanzas: 5,
    faltas: 2,
    presentes: 45,
    total_usuarios: 52
  };

  const filteredCampaigns = campaignsData.filter(campaign => {
    if (showInactive) {
      return campaign.status === 'inactive' || campaign.status === 'paused' || campaign.status === 'completed';
    }
    return campaign.status === 'active';
  });

  const totalActiveUsers = campaignsData
    .filter(c => c.status === 'active')
    .reduce((sum, c) => sum + c.active_users, 0);

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      paused: 'bg-orange-100 text-orange-700 border-orange-200',
      completed: 'bg-blue-100 text-blue-700 border-blue-200',
      inactive: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[status] || colors.inactive;
  };

  const getStatusLabel = (status) => {
    const labels = {
      active: 'Activa',
      paused: 'Pausada',
      completed: 'Completada',
      inactive: 'Inactiva'
    };
    return labels[status] || 'Desconocido';
  };

  return (
    <div className="flex justify-center py-8 bg-gray-50 min-h-screen">
      <div className="w-full max-w-7xl px-4">
        
        {/* Header con nombre de empresa */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {companyInfo.name}
            </h1>
            <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard Principal - Mi Empresa
            </p>
          </div>
        </div>

        {/* Stats Cards Principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Usuarios Activos */}
          <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <UserCheck className="w-8 h-8 text-white" />
              <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-xs text-emerald-100 uppercase tracking-wider mb-1">Usuarios Activos</p>
            <p className="text-3xl font-bold text-white">{totalActiveUsers}</p>
            <p className="text-xs text-emerald-100 mt-2">En campañas activas</p>
          </div>

          {/* Presentes Hoy */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <CheckCircle className="w-8 h-8 text-white" />
              <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-xs text-blue-100 uppercase tracking-wider mb-1">Presentes Hoy</p>
            <p className="text-3xl font-bold text-white">{attendanceData.presentes}</p>
            <p className="text-xs text-blue-100 mt-2">de {attendanceData.total_usuarios} usuarios</p>
          </div>

          {/* Tardanzas */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <Clock className="w-8 h-8 text-white" />
              <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-xs text-orange-100 uppercase tracking-wider mb-1">Tardanzas Hoy</p>
            <p className="text-3xl font-bold text-white">{attendanceData.tardanzas}</p>
            <p className="text-xs text-orange-100 mt-2">Usuarios con retraso</p>
          </div>

          {/* Faltas */}
          <div className="bg-gradient-to-br from-red-600 to-red-700 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <UserX className="w-8 h-8 text-white" />
              <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-xs text-red-100 uppercase tracking-wider mb-1">Faltas Hoy</p>
            <p className="text-3xl font-bold text-white">{attendanceData.faltas}</p>
            <p className="text-xs text-red-100 mt-2">Usuarios ausentes</p>
          </div>
        </div>

        {/* Mini Dashboard de Campañas */}
        <div className="bg-white border border-gray-200 shadow-lg mb-8">
          {/* Header */}
          <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-white" />
              <h2 className="text-lg font-bold text-white">
                Usuarios Activos por Campaña
              </h2>
            </div>
            <button
              onClick={() => setShowInactive(!showInactive)}
              className={`flex items-center gap-2 px-4 py-2 font-semibold text-sm transition-all shadow-md ${
                showInactive
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {showInactive ? (
                <>
                  <UserCheck className="w-4 h-4" />
                  Ver Activas
                </>
              ) : (
                <>
                  <UserX className="w-4 h-4" />
                  Ver Inactivas
                </>
              )}
            </button>
          </div>

          {/* Lista de Campañas */}
          <div className="p-6">
            {filteredCampaigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="border border-gray-200 p-4 hover:shadow-md transition-shadow bg-gray-50"
                  >
                    {/* Header de campaña */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-gray-900 line-clamp-2">
                          {campaign.name}
                        </h3>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-bold border ml-2 ${getStatusColor(campaign.status)}`}>
                        {getStatusLabel(campaign.status)}
                      </span>
                    </div>

                    {/* Usuarios activos */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-600">
                          Usuarios Activos
                        </span>
                        <span className="text-xs font-bold text-gray-900">
                          {campaign.active_users} / {campaign.total_users}
                        </span>
                      </div>
                      
                      {/* Barra de progreso */}
                      <div className="w-full bg-gray-200 h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-green-600 transition-all duration-300"
                          style={{
                            width: `${(campaign.active_users / campaign.total_users) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1 text-emerald-600">
                        <UserCheck className="w-4 h-4" />
                        <span className="font-bold">{campaign.active_users}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Users className="w-4 h-4" />
                        <span className="font-bold">{campaign.total_users}</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-600 ml-auto">
                        <span className="font-bold">
                          {campaign.total_users > 0 
                            ? Math.round((campaign.active_users / campaign.total_users) * 100)
                            : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 border border-gray-200">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white border-2 border-gray-200 mb-4 shadow-sm">
                  <Target className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-700 font-bold text-lg">
                  No hay campañas {showInactive ? 'inactivas' : 'activas'}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {showInactive 
                    ? 'Todas las campañas están activas' 
                    : 'Crea una campaña para comenzar'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Resumen de Asistencia */}
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-sm font-bold text-gray-700 uppercase">
                Resumen de Asistencia
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Usuarios</span>
                <span className="text-lg font-bold text-gray-900">
                  {attendanceData.total_usuarios}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Presentes
                </span>
                <span className="text-lg font-bold text-emerald-600">
                  {attendanceData.presentes}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  Tardanzas
                </span>
                <span className="text-lg font-bold text-orange-600">
                  {attendanceData.tardanzas}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <UserX className="w-4 h-4 text-red-600" />
                  Faltas
                </span>
                <span className="text-lg font-bold text-red-600">
                  {attendanceData.faltas}
                </span>
              </div>
            </div>

            {/* Porcentaje de asistencia */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-600">
                  Porcentaje de Asistencia
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  {Math.round((attendanceData.presentes / attendanceData.total_usuarios) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-600"
                  style={{
                    width: `${(attendanceData.presentes / attendanceData.total_usuarios) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Resumen de Campañas */}
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-sm font-bold text-gray-700 uppercase">
                Estado de Campañas
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Campañas</span>
                <span className="text-lg font-bold text-gray-900">
                  {campaignsData.length}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  Activas
                </span>
                <span className="text-lg font-bold text-emerald-600">
                  {campaignsData.filter(c => c.status === 'active').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Pausadas
                </span>
                <span className="text-lg font-bold text-orange-600">
                  {campaignsData.filter(c => c.status === 'paused').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Completadas
                </span>
                <span className="text-lg font-bold text-blue-600">
                  {campaignsData.filter(c => c.status === 'completed').length}
                </span>
              </div>
            </div>
          </div>

          {/* Usuarios Totales por Campaña */}
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-sm font-bold text-gray-700 uppercase">
                Distribución de Usuarios
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Asignados</span>
                <span className="text-lg font-bold text-gray-900">
                  {campaignsData.reduce((sum, c) => sum + c.total_users, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  Activos
                </span>
                <span className="text-lg font-bold text-emerald-600">
                  {totalActiveUsers}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <UserX className="w-4 h-4 text-gray-600" />
                  Inactivos
                </span>
                <span className="text-lg font-bold text-gray-600">
                  {campaignsData.reduce((sum, c) => sum + c.total_users, 0) - totalActiveUsers}
                </span>
              </div>
            </div>

            {/* Porcentaje activo */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-600">
                  Tasa de Actividad
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  {Math.round((totalActiveUsers / campaignsData.reduce((sum, c) => sum + c.total_users, 0)) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-600"
                  style={{
                    width: `${(totalActiveUsers / campaignsData.reduce((sum, c) => sum + c.total_users, 0)) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MainCompany;