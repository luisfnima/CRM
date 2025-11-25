import { Users, UserCheck, TrendingUp, Clock } from 'lucide-react'

const DashboardMain = () => {
    const stats = [{
        title: 'Total Usuarios',
        value: '24',
        change: '+3',
        changeType: 'positive',
        icon: Users,
        color: 'blue'
    },
    {
        title: 'Usuarios Activos',
        value: '21',
        change: '+2',
        changeType: 'positive',
        icon: UserCheck,
        color: 'green'
    },
    {
        title: 'Llamadas Hoy',
        value: '3750',
        change: '+2%',
        changeType: 'positive',
        icon: TrendingUp,
        color: 'purple'
    },
    {
        title: ':Tiempo Promedio',
        value: '8:34',
        change: '-0:45',
        changeType: 'negative',
        icon: Clock,
        color: 'orange'
    }
    ]

    return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Dashboard - Mi Empresa
        </h1>
        <p className="text-gray-600">
          Resumen general del call center
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-600">
              {stat.title}
            </p>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actividad Reciente */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Actividad Reciente
          </h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    Nuevo usuario agregado al sistema
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Hace 2 horas
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Agentes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Agentes del Día
          </h3>
          <div className="space-y-4">
            {['Carlos López', 'Ana Martínez', 'Pedro Ramírez'].map((name, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-green-700">
                      {name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{name}</p>
                    <p className="text-xs text-gray-500">{25 - idx * 3} llamadas</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-green-600">
                  {95 - idx * 2}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardMain
