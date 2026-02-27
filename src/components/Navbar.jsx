import { useState } from 'react'
import { 
  Menu, 
  Bell, 
  Search, 
  User, 
  Settings, 
  LogOut,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react'

const Navbar = ({ toggleSidebar, pageTitle, notifications, userRole = 'producer' }) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
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

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // In a real app, this would toggle a theme context
    document.documentElement.classList.toggle('dark')
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Mobile menu button and title */}
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Page title */}
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{pageTitle || 'Tableau de bord'}</h1>
              <p className="text-sm text-gray-500 hidden sm:block">
                EcoCollect - {userRole === 'collector' ? 'Espace Collecteur' : 'Plateforme de collecte'}
              </p>
            </div>
          </div>

          {/* Right side - Search, Notifications, User */}
          <div className="flex items-center gap-4">
            {/* Search bar - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 w-64">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {notifications && notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Notifications dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications && notifications.length > 0 ? (
                      notifications.map((notification, index) => (
                        <div key={index} className="p-4 hover:bg-gray-50 border-b last:border-b-0">
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === 'success' ? 'bg-green-500' :
                              notification.type === 'warning' ? 'bg-yellow-500' :
                              notification.type === 'error' ? 'bg-red-500' :
                              'bg-blue-500'
                            }`}></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                              <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Aucune notification</p>
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t">
                    <a href="/notifications" className="text-sm text-green-600 hover:text-green-700 font-medium">
                      Voir toutes les notifications
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              title="Basculer le thème"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {/* User dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b">
                    <p className="font-medium text-gray-900">Jean Dupont</p>
                    <p className="text-sm text-gray-500">
                      {userRole === 'collector' ? 'Collecteur' : 'Producteur'} • jean.dupont@email.com
                    </p>
                  </div>
                  <div className="py-2">
                    <a
                      href={userRole === 'collector' ? '/collector/profile' : '/profile'}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Mon profil
                    </a>
                    <a
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Paramètres
                    </a>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
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

      {/* Mobile search bar */}
      <div className="px-4 pb-3 lg:hidden">
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
          />
        </div>
      </div>
    </header>
  )
}

export default Navbar
