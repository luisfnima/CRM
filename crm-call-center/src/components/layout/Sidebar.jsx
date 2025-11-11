import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Shield,
    Settings,
    TrendingUp,
    UserPlus,
    UsersRound,
    Megaphone,
    Phone,
    Building2,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'

const Sidebar = ({ isOpen, setIsOpen }) => {
    const menuItems = [
        {
            section: 'Mi Empresa',
            items: [
                { name: 'Dashboard', icon: LayoutDashboard, path: '/empresa/dashboard' },
                { name: 'Users', icon: Users, path: '/empresa/users' },
                { name: 'Roles', icon: Shield, path: '/empresa/roles' },
                { name: 'Config', icon: Settings, path: '/empresa/config' },
            ]
        },
        {
            section: 'Sales',
            items: [
                { name: 'Dashboard', icon: TrendingUp, path: '/sales/dashboard' },
                { name: 'Leads', icon: UserPlus, path: '/sales/leads' },
                { name: 'Campaigns', icon: Megaphone, path: '/sales/campaigns' },
                { name: 'Calls', icon: Phone, path: 'sales/calls' },
            ]
        },
    ]

    return (
        <>
            {/* version movil? */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => isOpen(false)}
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