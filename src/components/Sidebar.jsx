import { useState } from 'react'
import { 
  BarChart3, 
  Trash2, 
  User, 
  Settings as SettingsIcon, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Award,
  History,
  Bell,
  Truck,
  Target,
  Wallet,
  MapPin
} from 'lucide-react'

const Sidebar = ({ isOpen, toggleSidebar, currentPage, userRole = 'producer' }) => {
  const [activeItem, setActiveItem] = useState(currentPage || 'dashboard')
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleLogout = () => {
    setShowLogoutModal(true)
  }

  const confirmLogout = () => {
    console.log('Déconnexion...')
    window.location.href = '/'
  }

  const cancelLogout = () => {
    setShowLogoutModal(false)
  }

  // Menu items based on user role
  const producerMenuItems = [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      icon: BarChart3,
      href: '/collecteur',
      badge: null
    },
    {
      id: 'declare',
      label: 'Déclarer des déchets',
      icon: Trash2,
      href: '/declare',
      badge: 'CTA',
      badgeColor: 'green'
    },
    {
      id: 'tracking',
      label: 'Suivi des collectes',
      icon: Package,
      href: '/tracking',
      badge: null
    },
    {
      id: 'history',
      label: 'Historique',
      icon: History,
      href: '/history',
      badge: null
    },
    {
      id: 'rewards',
      label: 'Récompenses',
      icon: Award,
      href: '/rewards',
      badge: '480',
      badgeColor: 'purple'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      href: '/notifications',
      badge: '3',
      badgeColor: 'green'
    },
  ]

  const collectorMenuItems = [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      icon: BarChart3,
      href: '/collecteur',
      badge: null
    },
    {
      id: 'missions',
      label: 'Missions',
      icon: Target,
      href: '/collector/missions',
      badge: '12',
      badgeColor: 'blue'
    },
    {
      id: 'wallet',
      label: 'Mes gains',
      icon: Wallet,
      href: '/collector/wallet',
      badge: null
    },
    {
      id: 'deposit',
      label: 'Dépôt déchets',
      icon: Package,
      href: '/collector/deposit',
      badge: null
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      href: '/collector/notifications',
      badge: '5',
      badgeColor: 'blue'
    },
  ]

  const menuItems = userRole === 'collecteur' ? collectorMenuItems : producerMenuItems

  const secondaryMenuItems = [
    {
      id: 'profile',
      label: 'Mon profil',
      icon: User,
      href: userRole === 'collecteur' ? '/collector/profile' : '/profile',
      badge: null
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: SettingsIcon,
      href: '/settings',
      badge: null
    }
  ]

  return (
    <>
      {/* Mobile Sidebar - Slide from left */}
      <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ease-in-out ${
        isOpen 
          ? 'opacity-100 pointer-events-auto' 
          : 'opacity-0 pointer-events-none'
      }`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isOpen ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={toggleSidebar}
        />
        
        {/* Sidebar Content */}
        <div className={`absolute top-0 left-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Header */}
          <div className={`p-6 ${
            userRole === 'collecteur' 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
              : 'bg-gradient-to-r from-green-600 to-green-700'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg flex items-center justify-center">
                  
                </div>
                <div>
                  <h1 className="text-white font-bold text-lg">EcoCollect</h1>
                  <p className="text-white/80 text-xs">
                    {userRole === 'collecteur' ? 'Espace Collecteur' : 'Plateforme de collecte'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleSidebar}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                userRole === 'collecteur' ? 'bg-blue-100' : 'bg-gray-200'
              }`}>
                <User className={`w-5 h-5 ${
                  userRole === 'collecteur' ? 'text-blue-600' : 'text-gray-600'
                }`} />
              </div>
              <div>
                <p className="font-medium text-gray-900">Jean Dupont</p>
                <p className="text-xs text-gray-500">
                  {userRole === 'collecteur' ? 'Collecteur • Douala' : 'Ménage • Douala'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            {/* Main Menu */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Principal
              </h3>
              <ul className="space-y-2">
                {menuItems.map(item => {
                  const Icon = item.icon
                  const isActive = activeItem === item.id
                  
                  return (
                    <li key={item.id}>
                      <a
                        href={item.href}
                        onClick={() => setActiveItem(item.id)}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                          ${isActive 
                            ? userRole === 'collector'
                              ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 shadow-sm' 
                              : 'bg-green-50 text-green-700 border-l-4 border-green-600 shadow-sm'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md'
                          }
                        `}
                      >
                        <Icon className={`w-5 h-5 ${isActive 
                          ? userRole === 'collector' ? 'text-blue-600' : 'text-green-600'
                          : 'text-gray-400 group-hover:text-' + (userRole === 'collecteur' ? 'blue-600' : 'green-600')
                        }`} />
                        <span className="font-medium group-hover:text-gray-700">{item.label}</span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Secondary Menu */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Secondaire
              </h3>
              <ul className="space-y-2">
                {secondaryMenuItems.map(item => {
                  const Icon = item.icon
                  const isActive = activeItem === item.id
                  
                  return (
                    <li key={item.id}>
                      <a
                        href={item.href}
                        onClick={() => setActiveItem(item.id)}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                          ${isActive 
                            ? userRole === 'collecteur'
                              ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 shadow-sm' 
                              : 'bg-green-50 text-green-700 border-l-4 border-green-600 shadow-sm'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md'
                          }
                        `}
                      >
                        <Icon className={`w-5 h-5 ${isActive 
                          ? userRole === 'collector' ? 'text-blue-600' : 'text-green-600'
                          : 'text-gray-400 group-hover:text-' + (userRole === 'collector' ? 'blue-600' : 'green-600')
                        }`} />
                        <span className="font-medium group-hover:text-gray-700">{item.label}</span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Footer */}
            <div className="mt-auto p-4 border-t">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium group-hover:text-red-700">Déconnexion</span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar - Fixed */}
      <div className="hidden lg:block fixed top-0 left-0 h-screen bg-white shadow-xl z-50 w-72 overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`p-6 ${
          userRole === 'collecteur' 
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
            : 'bg-gradient-to-r from-green-600 to-green-700'
        }`}>
          <div className="flex items-center gap-3">
            
            <div>
              <h1 className="text-white font-bold text-lg">EcoCollect</h1>
              <p className="text-white/80 text-xs">
                {userRole === 'collecteur' ? 'Espace Collecteur' : 'Plateforme de collecte'}
              </p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              userRole === 'collector' ? 'bg-blue-100' : 'bg-gray-200'
            }`}>
              <User className={`w-5 h-5 ${
                userRole === 'collector' ? 'text-blue-600' : 'text-gray-600'
              }`} />
            </div>
            <div>
              <p className="font-medium text-gray-900">Jean Dupont</p>
              <p className="text-xs text-gray-500">
                {userRole === 'collector' ? 'Collecteur • Douala' : 'Ménage • Douala'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {/* Main Menu */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Principal
            </h3>
            <ul className="space-y-1">
              {menuItems.map(item => {
                const Icon = item.icon
                const isActive = activeItem === item.id
                
                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      onClick={() => setActiveItem(item.id)}
                      className={`
                        flex items-center justify-between px-3 py-2 rounded-lg transition-colors group
                        ${isActive 
                          ? userRole === 'collector'
                            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                            : 'bg-green-50 text-green-700 border-l-4 border-green-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${isActive 
                          ? userRole === 'collecteur' ? 'text-blue-600' : 'text-green-600'
                          : 'text-gray-400 group-hover:text-' + (userRole === 'collecteur' ? 'blue-600' : 'green-600')
                        }`} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      
                      {item.badge && (
                        <span className={`
                          px-2 py-1 text-xs font-medium rounded-full
                          ${item.badgeColor === 'green' 
                            ? 'bg-green-100 text-green-700' 
                            : item.badgeColor === 'purple'
                              ? 'bg-purple-100 text-purple-700'
                              : item.badgeColor === 'blue'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                          }
                        `}>
                          {item.badge}
                        </span>
                      )}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Secondary Menu */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Compte
            </h3>
            <ul className="space-y-1">
              {secondaryMenuItems.map(item => {
                const Icon = item.icon
                const isActive = activeItem === item.id
                
                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      onClick={() => setActiveItem(item.id)}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group
                        ${isActive 
                          ? userRole === 'collector'
                            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                            : 'bg-green-50 text-green-700 border-l-4 border-green-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 ${isActive 
                        ? userRole === 'collector' ? 'text-blue-600' : 'text-green-600'
                        : 'text-gray-400 group-hover:text-' + (userRole === 'collector' ? 'blue-600' : 'green-600')
                      }`} />
                      <span className="font-medium">{item.label}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Footer */}
          <div className="mt-auto p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <LogOut className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Déconnexion</h3>
              <p className="text-gray-600 mb-6">Êtes-vous sûr de vouloir vous déconnecter ?</p>
              <div className="flex gap-3">
                <button
                  onClick={cancelLogout}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar
