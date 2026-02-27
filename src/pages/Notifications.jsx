import { useState } from 'react'
import { 
  Bell, 
  Check, 
  X, 
  Trash2, 
  Settings, 
  Filter,
  Calendar,
  Package,
  AlertCircle,
  CheckCircle,
  Info,
  Clock,
  User,
  MapPin
} from 'lucide-react'
import Layout from '../components/Layout'

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Collecte terminée',
      message: 'Votre déclaration DEC-123456 a été collectée avec succès',
      time: 'Il y a 2 heures',
      read: false,
      icon: CheckCircle,
      action: {
        text: 'Voir les détails',
        href: '/declaration/DEC-123456'
      }
    },
    {
      id: 2,
      type: 'warning',
      title: 'Rappel de collecte',
      message: 'N\'oubliez pas de préparer vos déchets pour demain matin',
      time: 'Il y a 5 heures',
      read: false,
      icon: AlertCircle,
      action: null
    },
    {
      id: 3,
      type: 'info',
      title: 'Nouveau collecteur assigné',
      message: 'Jean Dupont a été assigné à votre collecte DEC-123457',
      time: 'Hier',
      read: true,
      icon: User,
      action: {
        text: 'Voir le profil',
        href: '/tracking/DEC-123457'
      }
    },
    {
      id: 4,
      type: 'success',
      title: 'Points gagnés',
      message: 'Félicitations ! Vous avez gagné 25 points pour votre dernière collecte',
      time: 'Hier',
      read: true,
      icon: CheckCircle,
      action: {
        text: 'Voir mes récompenses',
        href: '/rewards'
      }
    },
    {
      id: 5,
      type: 'info',
      title: 'Mise à jour de l\'application',
      message: 'Nouvelles fonctionnalités disponibles dans votre espace',
      time: 'Il y a 2 jours',
      read: true,
      icon: Info,
      action: null
    },
    {
      id: 6,
      type: 'warning',
      title: 'Collecte retardée',
      message: 'Votre collecte prévue pour aujourd\'ui est retardée de 30 minutes',
      time: 'Il y a 3 jours',
      read: true,
      icon: Clock,
      action: {
        text: 'Suivre en temps réel',
        href: '/tracking/DEC-123458'
      }
    }
  ])

  const [filter, setFilter] = useState('all')

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.read
    if (filter === 'read') return notification.read
    return notification.type === filter
  })

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-600 border-green-200'
      case 'warning': return 'bg-orange-100 text-orange-600 border-orange-200'
      case 'error': return 'bg-red-100 text-red-600 border-red-200'
      default: return 'bg-blue-100 text-blue-600 border-blue-200'
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <Layout 
      pageTitle="Notifications" 
      currentPage="notifications"
      notifications={notifications.filter(n => !n.read)}
    >
      <div className="max-w-4xl lg:max-w-6xl mx-auto px-2 sm:px-0">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600">
                  {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}` : 'Aucune notification non lue'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Tout marquer comme lu
                </button>
              )}
              
              <button
                onClick={clearAllNotifications}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Tout supprimer
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Toutes ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'unread' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Non lues ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('success')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'success' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Succès
            </button>
            <button
              onClick={() => setFilter('warning')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'warning' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Alertes
            </button>
            <button
              onClick={() => setFilter('info')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'info' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Informations
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {filter === 'all' ? 'Aucune notification' : `Aucune notification ${filter}`}
              </h3>
              <p className="text-gray-500">
                {filter === 'all' 
                  ? 'Vous n\'avez aucune notification pour le moment' 
                  : `Vous n'avez aucune notification de type ${filter}`
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map(notification => {
              const Icon = notification.icon
              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl shadow-sm border p-6 transition-all hover:shadow-md ${
                    !notification.read ? 'border-l-4 border-l-green-500' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className={`font-semibold text-gray-900 mb-1 ${!notification.read ? 'font-bold' : ''}`}>
                            {notification.title}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {notification.time}
                            </div>
                            {!notification.read && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                Non lue
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Marquer comme lu"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {notification.action && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <a
                            href={notification.action.href}
                            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
                          >
                            {notification.action.text}
                            <Package className="w-4 h-4" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Notifications
