import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Bell, CheckCircle, AlertCircle, Info, X, Filter, Search,
  Calendar, Clock, MapPin, Package, DollarSign, Star,
  MessageSquare, Phone, Check, Trash2, Archive, Eye,
  Settings, Volume2, VolumeX, Wifi, WifiOff, Award,
  Menu, LogOut, User, Home, Wallet, History, Truck,
  HelpCircle, ChevronRight
} from 'lucide-react'

const NotificationsCollector = () => {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userData, setUserData] = useState({
    nomComplet: '',
    email: '',
    type_collecteur: '',
    points_total: 0
  })
  const [notifications, setNotifications] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNotifications, setSelectedNotifications] = useState([])
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  const API_URL = import.meta.env.VITE_API_URL ||  'https://ecobackend-zeds.vercel.app';
  const STORAGE_KEYS = {
    TOKEN: 'ecocollect_token',
    USER: 'ecocollect_user',
    ROLE: 'ecocollect_role'
  }

  const getToken = () => localStorage.getItem(STORAGE_KEYS.TOKEN)
  const getUser = () => {
    const userJson = localStorage.getItem(STORAGE_KEYS.USER)
    return userJson ? JSON.parse(userJson) : null
  }

  const getInitials = (name) => {
    if (!name) return 'C'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
  }

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
      localStorage.removeItem(STORAGE_KEYS.ROLE)
      navigate('/login')
    }
  }

  // Charger les données utilisateur
  const loadUserData = async () => {
    const token = getToken()
    if (!token) {
      navigate('/login')
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/collecteurs/profil`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const result = await response.json()
        const profil = result.collecteur || result
        
        setUserData({
          nomComplet: profil.nom_complet || '',
          email: profil.email || '',
          type_collecteur: profil.type_collecteur || '',
          points_total: profil.points_total || 0
        })
      }
    } catch (error) {
      console.error('Erreur chargement utilisateur:', error)
    }
  }

  // Charger les notifications
  const loadNotifications = async () => {
    const token = getToken()
    if (!token) return

    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        const notificationsList = data.notifications || []
        
        // Formater les notifications
        const formattedNotifications = notificationsList.map((n, index) => ({
          id: n.id || index + 1,
          type: getNotificationType(n.type),
          title: n.titre || getNotificationTitle(n.type),
          message: n.message || '',
          time: n.cree_le ? formatTimeAgo(new Date(n.cree_le)) : 'Récemment',
          read: n.lu || false,
          priority: n.priorite || 'medium',
          missionId: n.mission_id,
          producer: n.producteur_nom,
          location: n.adresse,
          estimatedEarnings: n.gain_estime,
          wasteType: n.type_dechet,
          amount: n.montant,
          paymentMethod: n.methode_paiement,
          rating: n.note,
          feedback: n.commentaire,
          level: n.niveau,
          bonus: n.bonus
        }))

        setNotifications(formattedNotifications)
      }
    } catch (error) {
      console.error('Erreur chargement notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getNotificationType = (type) => {
    const types = {
      'nouvelle_mission': 'new_mission',
      'paiement': 'payment',
      'mission_acceptee': 'mission_accepted',
      'mission_terminee': 'mission_completed',
      'mission_deposee': 'mission_deposited',
      'mission_validee': 'mission_validated',
      'rappel': 'reminder',
      'systeme': 'system',
      'succes': 'achievement'
    }
    return types[type] || type
  }

  const getNotificationTitle = (type) => {
    const titles = {
      'nouvelle_mission': 'Nouvelle mission disponible',
      'paiement': 'Paiement reçu',
      'mission_acceptee': 'Mission acceptée',
      'mission_terminee': 'Mission terminée',
      'mission_deposee': 'Mission déposée',
      'mission_validee': 'Mission validée',
      'rappel': 'Rappel de mission',
      'systeme': 'Maintenance système',
      'succes': 'Nouveau palier atteint !'
    }
    return titles[type] || 'Notification'
  }

  const formatTimeAgo = (date) => {
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.round(diffMs / 60000)
    
    if (diffMins < 60) return `Il y a ${diffMins} min`
    if (diffMins < 1440) return `Il y a ${Math.round(diffMins / 60)}h`
    return `Il y a ${Math.round(diffMins / 1440)}j`
  }

  useEffect(() => {
    loadUserData()
    loadNotifications()
    
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_mission': return <Package className="h-5 w-5" />
      case 'payment': return <DollarSign className="h-5 w-5" />
      case 'mission_accepted': return <CheckCircle className="h-5 w-5" />
      case 'mission_completed': return <Star className="h-5 w-5" />
      case 'mission_deposited': return <Archive className="h-5 w-5" />
      case 'mission_validated': return <Award className="h-5 w-5" />
      case 'reminder': return <Clock className="h-5 w-5" />
      case 'system': return <Settings className="h-5 w-5" />
      case 'achievement': return <Award className="h-5 w-5" />
      default: return <Info className="h-5 w-5" />
    }
  }

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'bg-red-100 text-red-600 border-red-200'
    if (priority === 'medium') return 'bg-yellow-100 text-yellow-600 border-yellow-200'
    
    switch (type) {
      case 'new_mission': return 'bg-blue-100 text-blue-600 border-blue-200'
      case 'payment': return 'bg-green-100 text-green-600 border-green-200'
      case 'mission_deposited': return 'bg-purple-100 text-purple-600 border-purple-200'
      case 'mission_validated': return 'bg-indigo-100 text-indigo-600 border-indigo-200'
      case 'achievement': return 'bg-pink-100 text-pink-600 border-pink-200'
      default: return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  const markAsRead = async (notificationId) => {
    const token = getToken()
    try {
      await fetch(`${API_URL}/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      )
    } catch (error) {
      console.error('Erreur marquage notification:', error)
    }
  }

  const markAllAsRead = async () => {
    const token = getToken()
    try {
      await fetch(`${API_URL}/api/notifications/read-all`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (error) {
      console.error('Erreur marquage toutes notifications:', error)
    }
  }

  const deleteNotification = async (notificationId) => {
    const token = getToken()
    try {
      await fetch(`${API_URL}/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      setSelectedNotifications(prev => prev.filter(id => id !== notificationId))
    } catch (error) {
      console.error('Erreur suppression notification:', error)
    }
  }

  const deleteSelected = async () => {
    const token = getToken()
    try {
      await Promise.all(selectedNotifications.map(id => 
        fetch(`${API_URL}/api/notifications/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ))
      
      setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)))
      setSelectedNotifications([])
    } catch (error) {
      console.error('Erreur suppression notifications:', error)
    }
  }

  const handleNotificationAction = (notification) => {
    markAsRead(notification.id)
    
    switch (notification.type) {
      case 'new_mission':
        navigate('/collector/missions', { state: { highlightMission: notification.missionId } })
        break
      case 'payment':
        navigate('/collector/wallet')
        break
      case 'mission_accepted':
      case 'mission_completed':
      case 'mission_deposited':
      case 'reminder':
        navigate(`/collector/missions?mission=${notification.missionId}`)
        break
      case 'mission_validated':
        navigate('/collector/wallet')
        break
      default:
        break
    }
  }

  const toggleSelection = (notificationId) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    )
  }

  // Sidebar Component
  const Sidebar = () => (
    <>
      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            sidebarOpen ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={() => setSidebarOpen(false)}
        />
        
        <div className={`absolute top-0 left-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-8 h-8 text-white" />
                <span className="text-xl font-bold text-white">EcoCollect</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {getInitials(userData.nomComplet)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{userData.nomComplet || 'Collecteur'}</p>
                <p className="text-xs text-gray-500">{userData.email || ''}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Principal
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="/collector/dashboard" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                    <Home className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Tableau de bord</span>
                  </a>
                </li>
                <li>
                  <a href="/collector/missions" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                    <Package className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Missions</span>
                  </a>
                </li>
                <li>
                  <a href="/collector/wallet" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                    <Wallet className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Mes gains</span>
                  </a>
                </li>
                <li>
                  <a href="/collector/history" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                    <History className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Historique</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Compte
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="/collector/profile" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Mon profil</span>
                  </a>
                </li>
                <li>
                  <a href="/collector/notifications" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors bg-blue-50 text-blue-700 border-l-4 border-blue-600">
                    <Bell className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Notifications</span>
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="ml-auto px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-600">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </a>
                </li>
                <li>
                  <a href="/collector/settings" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                    <Settings className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Paramètres</span>
                  </a>
                </li>
                <li>
                  <a href="/collector/help" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                    <HelpCircle className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Aide</span>
                  </a>
                </li>
              </ul>
            </div>

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
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed top-0 left-0 h-screen bg-white shadow-xl z-50 w-72 overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
          <div className="flex items-center gap-2">
            <Truck className="w-8 h-8 text-white" />
            <span className="text-xl font-bold text-white">EcoCollect</span>
          </div>
        </div>

        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {getInitials(userData.nomComplet)}
            </div>
            <div>
              <p className="font-medium text-gray-900">{userData.nomComplet || 'Collecteur'}</p>
              <p className="text-xs text-gray-500">{userData.email || ''}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Principal
            </h3>
            <ul className="space-y-1">
              <li>
                <a href="/collector/dashboard" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                  <Home className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Tableau de bord</span>
                </a>
              </li>
              <li>
                <a href="/collector/missions" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                  <Package className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Missions</span>
                </a>
              </li>
              <li>
                <a href="/collector/wallet" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                  <Wallet className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Mes gains</span>
                </a>
              </li>
              <li>
                <a href="/collector/history" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                  <History className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Historique</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Compte
            </h3>
            <ul className="space-y-1">
              <li>
                <a href="/collector/profile" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Mon profil</span>
                </a>
              </li>
              <li>
                <a href="/collector/notifications" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors bg-blue-50 text-blue-700 border-l-4 border-blue-600">
                  <Bell className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Notifications</span>
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="ml-auto px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-600">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </a>
              </li>
              <li>
                <a href="/collector/settings" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                  <Settings className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Paramètres</span>
                </a>
              </li>
              <li>
                <a href="/collector/help" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                  <HelpCircle className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Aide</span>
                </a>
              </li>
            </ul>
          </div>

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
    </>
  )

  const NotificationCard = ({ notification }) => (
    <div 
      className={`bg-white rounded-xl shadow-lg border-2 p-4 hover:shadow-xl transition-all cursor-pointer ${
        !notification.read ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'
      }`}
      onClick={() => handleNotificationAction(notification)}
    >
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          checked={selectedNotifications.includes(notification.id)}
          onChange={(e) => {
            e.stopPropagation()
            toggleSelection(notification.id)
          }}
          className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
        />
        
        <div className={`p-2 rounded-lg border ${getNotificationColor(notification.type, notification.priority)}`}>
          {getNotificationIcon(notification.type)}
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className={`font-semibold text-gray-900 ${!notification.read ? 'text-blue-900' : ''}`}>
                {notification.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
            </div>
            
            {!notification.read && (
              <div className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
            )}
          </div>
          
          {/* Nouvelle mission */}
          {notification.type === 'new_mission' && notification.producer && (
            <div className="bg-blue-50 rounded-lg p-3 mb-2 border border-blue-200">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">Producteur:</span>
                  <span className="text-blue-900 ml-1">{notification.producer}</span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Localisation:</span>
                  <span className="text-blue-900 ml-1">{notification.location}</span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Type:</span>
                  <span className="text-blue-900 ml-1">{notification.wasteType}</span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Gain:</span>
                  <span className="text-green-600 font-medium ml-1">{notification.estimatedEarnings?.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Mission déposée */}
          {notification.type === 'mission_deposited' && (
            <div className="bg-purple-50 rounded-lg p-3 mb-2 border border-purple-200">
              <div className="flex items-center gap-2">
                <Archive className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-purple-800">
                  Mission déposée en attente de validation
                </span>
              </div>
            </div>
          )}
          
          {/* Mission validée */}
          {notification.type === 'mission_validated' && (
            <div className="bg-indigo-50 rounded-lg p-3 mb-2 border border-indigo-200">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-indigo-600" />
                <span className="text-sm text-indigo-800">
                  Félicitations ! Votre mission a été validée et le paiement est en cours
                </span>
              </div>
            </div>
          )}
          
          {/* Paiement */}
          {notification.type === 'payment' && notification.amount && (
            <div className="bg-green-50 rounded-lg p-3 mb-2 border border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-800">
                  Montant: {notification.amount.toLocaleString()} FCFA
                </span>
                <span className="text-xs text-green-600">
                  {notification.paymentMethod === 'wallet' ? 'Portefeuille' : 'Virement'}
                </span>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {notification.time}
            </span>
            
            <div className="flex items-center gap-2">
              {notification.type === 'new_mission' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNotificationAction(notification)
                  }}
                  className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Voir mission
                </button>
              )}
              
              {!notification.read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    markAsRead(notification.id)
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Marquer comme lu
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = (notification.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (notification.message?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === 'all' || notification.type === filterType
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'read' && notification.read) ||
      (filterStatus === 'unread' && !notification.read)
    
    return matchesSearch && matchesType && matchesStatus
  })

  if (isLoading && notifications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="lg:ml-72 min-h-screen">
          <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
            <div className="px-4 py-3 flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                  {getInitials(userData.nomComplet)}
                </div>
              </div>
            </div>
          </header>
          <div className="flex items-center justify-center h-[calc(100vh-64px)]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des notifications...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Header mobile */}
      <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
              {getInitials(userData.nomComplet)}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="lg:ml-72 min-h-screen">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="h-6 w-6 text-blue-600" />
              Notifications
            </h1>
            <p className="text-gray-600">Restez informé de vos missions et paiements</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher une notification..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="all">Tous les types</option>
                  <option value="new_mission">Nouvelles missions</option>
                  <option value="payment">Paiements</option>
                  <option value="mission_accepted">Missions acceptées</option>
                  <option value="mission_deposited">Missions déposées</option>
                  <option value="mission_validated">Missions validées</option>
                  <option value="reminder">Rappels</option>
                  <option value="system">Système</option>
                  <option value="achievement">Succès</option>
                </select>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="read">Lus</option>
                  <option value="unread">Non lus</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {notifications.filter(n => !n.read).length} non lues sur {notifications.length}
                </span>
                
                {notifications.filter(n => !n.read).length > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Tout marquer comme lu
                  </button>
                )}
              </div>
              
              {selectedNotifications.length > 0 && (
                <button
                  onClick={deleteSelected}
                  className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer ({selectedNotifications.length})
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune notification</h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Essayez une autre recherche' : 'Aucune notification ne correspond à ce filtre'}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default NotificationsCollector