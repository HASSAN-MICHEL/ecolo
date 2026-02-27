import { useState } from 'react'
import { 
  Package, 
  Clock, CheckCircle, Calendar, Filter, Search,Eye,ArrowRight,Users,Star,AlertTriangle, TrendingUp,MapPin,ChevronDown, Bell, Truck, Gauge, Leaf, Recycle, Sparkles, Phone, MessageCircle, Navigation, ThumbsUp, Award, Timer, Route,UserCheck
} from 'lucide-react'
import Layout from '../components/Layout'

const TrackingList = () => {
  // Simulated active tracking list
  const [activeTrackings] = useState([
    {
      id: 'DEC-123456',
      wasteTypes: ['plastic', 'paper'],
      quantity: '5.2',
      quantityUnit: 'kg',
      status: 'in_progress',
      createdAt: '2024-01-15T10:30:00Z',
      scheduledDate: '2024-01-15T14:00:00Z',
      collector: {
        name: 'Paul Mbarga',
        rating: 4.8,
        phone: '+237 698 234 567',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        vehicle: 'Camionnette bennes',
        plateNumber: 'CE 1234 AB',
        totalCollects: 1243,
        experience: '3 ans'
      },
      estimatedArrival: '2024-01-15T13:45:00Z',
      currentLocation: 'En route vers Douala',
      progress: 75,
      distance: '5.2 km',
      ecoPoints: 45
    },
    {
      id: 'DEC-123455',
      wasteTypes: ['glass'],
      quantity: '3',
      quantityUnit: 'kg',
      status: 'assigned',
      createdAt: '2024-01-14T16:20:00Z',
      scheduledDate: '2024-01-16T09:00:00Z',
      collector: {
        name: 'Marie Tchuenté',
        rating: 4.9,
        phone: '+237 698 345 678',
        photo: 'https://images.unsplash.com/photo-1494790108755-2616b332c1c4?w=100&h=100&fit=crop&crop=face',
        vehicle: 'Camion benne',
        plateNumber: 'CE 5678 CD',
        totalCollects: 2156,
        experience: '5 ans'
      },
      estimatedArrival: '2024-01-16T09:30:00Z',
      currentLocation: 'Base de Douala',
      progress: 25,
      distance: '12.5 km',
      ecoPoints: 28
    },
    {
      id: 'DEC-123454',
      wasteTypes: ['metal', 'electronic'],
      quantity: '8',
      quantityUnit: 'kg',
      status: 'scheduled',
      createdAt: '2024-01-13T09:15:00Z',
      scheduledDate: '2024-01-17T14:00:00Z',
      collector: {
        name: 'Jean Pierre',
        rating: 4.7,
        phone: '+237 698 456 789',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        vehicle: 'Fourgon',
        plateNumber: 'CE 9012 EF',
        totalCollects: 987,
        experience: '2 ans'
      },
      estimatedArrival: '2024-01-17T14:30:00Z',
      currentLocation: 'En attente de confirmation',
      progress: 10,
      distance: '8.3 km',
      ecoPoints: 62
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [viewMode, setViewMode] = useState('list') // 'list' or 'grid'

  const wasteTypes = {
    plastic: { label: 'Plastique', icon: '♻️', color: 'blue', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
    paper: { label: 'Papier / Carton', icon: '📄', color: 'yellow', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700' },
    metal: { label: 'Métal', icon: '🔧', color: 'gray', bgColor: 'bg-gray-50', textColor: 'text-gray-700' },
    glass: { label: 'Verre', icon: '🍾', color: 'green', bgColor: 'bg-green-50', textColor: 'text-green-700' },
    organic: { label: 'Organique', icon: '🌱', color: 'orange', bgColor: 'bg-orange-50', textColor: 'text-orange-700' },
    electronic: { label: 'Électronique', icon: '📱', color: 'purple', bgColor: 'bg-purple-50', textColor: 'text-purple-700' }
  }

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: 'amber',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200',
        icon: Clock,
        label: 'En attente',
        progressColor: 'bg-amber-500'
      },
      assigned: {
        color: 'blue',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200',
        icon: Users,
        label: 'Collecteur assigné',
        progressColor: 'bg-blue-500'
      },
      scheduled: {
        color: 'purple',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700',
        borderColor: 'border-purple-200',
        icon: Calendar,
        label: 'Programmé',
        progressColor: 'bg-purple-500'
      },
      in_progress: {
        color: 'orange',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-700',
        borderColor: 'border-orange-200',
        icon: Truck,
        label: 'En cours',
        progressColor: 'bg-orange-500'
      },
      completed: {
        color: 'green',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        borderColor: 'border-green-200',
        icon: CheckCircle,
        label: 'Terminé',
        progressColor: 'bg-green-500'
      }
    }
    return configs[status] || configs.pending
  }

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'emerald'
    if (progress >= 50) return 'green'
    if (progress >= 25) return 'yellow'
    return 'orange'
  }

  // Filter and sort trackings
  const filteredTrackings = activeTrackings
    .filter(tracking => {
      const matchesSearch = tracking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tracking.wasteTypes.some(type => wasteTypes[type].label.toLowerCase().includes(searchTerm.toLowerCase())) ||
        tracking.collector?.name.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || tracking.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
      if (sortBy === 'progress') {
        return b.progress - a.progress
      }
      if (sortBy === 'points') {
        return b.ecoPoints - a.ecoPoints
      }
      return 0
    })

  const stats = {
    total: activeTrackings.length,
    inProgress: activeTrackings.filter(t => t.status === 'in_progress').length,
    scheduled: activeTrackings.filter(t => t.status === 'scheduled').length,
    assigned: activeTrackings.filter(t => t.status === 'assigned').length,
    totalPoints: activeTrackings.reduce((acc, t) => acc + (t.ecoPoints || 0), 0),
    totalWaste: activeTrackings.reduce((acc, t) => acc + parseFloat(t.quantity), 0).toFixed(1)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Layout 
      pageTitle="Suivi des collectes" 
      currentPage="tracking"
      notifications={[]}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header avec stats */}
        <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 p-8 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-300 blur-3xl" />
          </div>
          
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Route className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">Suivi des collectes</h1>
                  <p className="text-white/90">Suivez en temps réel l'avancement de vos collectes</p>
                </div>
              </div>
              
              {/* Badge d'impact */}
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3">
                <div className="flex items-center gap-3">
                  <Leaf className="h-5 w-5 text-green-300" />
                  <div>
                    <p className="text-sm opacity-90">Impact total</p>
                    <p className="text-xl font-bold">{stats.totalWaste} kg recyclés</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Package className="h-4 w-4" />
                  </div>
                  <span className="text-sm opacity-90">Total</span>
                </div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs opacity-75">collectes actives</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-orange-500/30 rounded-lg">
                    <Truck className="h-4 w-4" />
                  </div>
                  <span className="text-sm opacity-90">En cours</span>
                </div>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
                <p className="text-xs opacity-75">collecteurs en route</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-500/30 rounded-lg">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <span className="text-sm opacity-90">Programmées</span>
                </div>
                <p className="text-2xl font-bold">{stats.scheduled}</p>
                <p className="text-xs opacity-75">rendez-vous fixés</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-yellow-500/30 rounded-lg">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <span className="text-sm opacity-90">Points</span>
                </div>
                <p className="text-2xl font-bold">{stats.totalPoints}</p>
                <p className="text-xs opacity-75">points gagnés</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par numéro, type de déchet, collecteur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-0 bg-gray-50 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-green-600 transition-all"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 rounded-xl border-0 bg-gray-50 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-green-600 transition-all"
              >
                <option value="all">Tous les statuts</option>
                <option value="assigned">Collecteur assigné</option>
                <option value="scheduled">Programmé</option>
                <option value="in_progress">En cours</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-xl border-0 bg-gray-50 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-green-600 transition-all"
              >
                <option value="date">Plus récent</option>
                <option value="progress">Progression</option>
                <option value="points">Points gagnés</option>
              </select>

              <div className="flex rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Liste
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Grille
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des collectes */}
        <div className={viewMode === 'list' ? 'space-y-6' : 'grid grid-cols-1 md:grid-cols-2 gap-6'}>
          {filteredTrackings.map(tracking => {
            const statusConfig = getStatusConfig(tracking.status)
            const StatusIcon = statusConfig.icon
            const progressColor = getProgressColor(tracking.progress)
            
            return viewMode === 'list' ? (
              // Vue Liste
              <div key={tracking.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* En-tête avec statut */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="font-mono text-sm bg-gray-100 px-3 py-1.5 rounded-xl text-gray-600">
                          #{tracking.id}
                        </span>
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                          <StatusIcon className="h-4 w-4" />
                          <span className="text-sm font-medium">{statusConfig.label}</span>
                        </div>
                        {tracking.status === 'in_progress' && (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-sm font-medium">En route</span>
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          {tracking.wasteTypes.map(wasteTypeId => {
                            const wasteType = wasteTypes[wasteTypeId]
                            return (
                              <div key={wasteTypeId} className={`flex items-center gap-1 px-2 py-1 rounded-lg ${wasteType.bgColor}`}>
                                <span className="text-sm">{wasteType.icon}</span>
                                <span className={`text-xs font-medium ${wasteType.textColor}`}>{wasteType.label}</span>
                              </div>
                            )
                          })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">
                            {tracking.quantity} {tracking.quantityUnit}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>Créé le {formatDate(tracking.createdAt)}</span>
                        </div>
                        
                        {tracking.scheduledDate && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>Prévu le {formatDate(tracking.scheduledDate)}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-sm text-emerald-600">
                          <Sparkles className="h-4 w-4" />
                          <span className="font-medium">{tracking.ecoPoints} points</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <a
                        href={`/declaration/${tracking.id}`}
                        className="p-3 text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                        title="Voir les détails"
                      >
                        <Eye className="h-5 w-5" />
                      </a>
                      <a
                        href={`/tracking/${tracking.id}`}
                        className="p-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        <ArrowRight className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Progression et localisation */}
                <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Barre de progression */}
                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Progression</span>
                        <span className={`text-sm font-bold text-${progressColor}-600`}>
                          {tracking.progress}%
                        </span>
                      </div>
                      <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-${progressColor}-500 rounded-full transition-all duration-500 relative`}
                          style={{width: `${tracking.progress}%`}}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-pulse" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                        <span>Démarrée</span>
                        <span>À mi-chemin</span>
                        <span>Arrivée imminente</span>
                      </div>
                    </div>

                    {/* Localisation */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Position actuelle</span>
                      </div>
                      <p className="text-sm text-gray-600">{tracking.currentLocation}</p>
                      {tracking.distance && (
                        <p className="text-xs text-gray-500 mt-1">À {tracking.distance} de votre position</p>
                      )}
                    </div>

                    {/* Arrivée estimée */}
                    {tracking.estimatedArrival && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Timer className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">Arrivée estimée</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(tracking.estimatedArrival).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {Math.round((new Date(tracking.estimatedArrival) - new Date()) / (1000 * 60))} min
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Informations collecteur */}
                {tracking.collector && (
                  <div className="px-6 py-4 border-t border-gray-100 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img 
                            src={tracking.collector.photo} 
                            alt={tracking.collector.name}
                            className="w-12 h-12 rounded-xl object-cover ring-2 ring-white"
                          />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                            <UserCheck className="h-3 w-3 text-white" />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">{tracking.collector.name}</p>
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-50 rounded-full">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="text-xs font-medium text-yellow-700">{tracking.collector.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                            <span>{tracking.collector.vehicle}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            <span>{tracking.collector.plateNumber}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                            <Award className="h-3 w-3" />
                            <span>{tracking.collector.totalCollects} collectes • {tracking.collector.experience} d'expérience</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button className="p-3 text-green-600 hover:bg-green-50 rounded-xl transition-colors group" title="Appeler">
                          <Phone className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        </button>
                        <button className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors group" title="Message">
                          <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        </button>
                        <button className="p-3 text-purple-600 hover:bg-purple-50 rounded-xl transition-colors group" title="Suivre en direct">
                          <Navigation className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Vue Grille
              <div key={tracking.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                  {/* En-tête */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded-lg text-gray-600">
                      #{tracking.id}
                    </span>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${statusConfig.bgColor}`}>
                      <StatusIcon className={`h-3 w-3 ${statusConfig.textColor}`} />
                      <span className={`text-xs font-medium ${statusConfig.textColor}`}>{statusConfig.label}</span>
                    </div>
                  </div>

                  {/* Types de déchets */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {tracking.wasteTypes.map(wasteTypeId => {
                      const wasteType = wasteTypes[wasteTypeId]
                      return (
                        <div key={wasteTypeId} className={`px-2 py-1 rounded-lg ${wasteType.bgColor}`}>
                          <span className="text-xs font-medium ${wasteType.textColor}">{wasteType.label}</span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Quantité et points */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {tracking.quantity} {tracking.quantityUnit}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600">
                      <Sparkles className="h-4 w-4" />
                      <span className="text-sm font-medium">{tracking.ecoPoints} pts</span>
                    </div>
                  </div>

                  {/* Barre de progression */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Progression</span>
                      <span className={`text-xs font-bold text-${progressColor}-600`}>
                        {tracking.progress}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-${progressColor}-500 rounded-full transition-all`}
                        style={{width: `${tracking.progress}%`}}
                      />
                    </div>
                  </div>

                  {/* Collecteur */}
                  {tracking.collector && (
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                      <img 
                        src={tracking.collector.photo} 
                        alt={tracking.collector.name}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{tracking.collector.name}</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-500">{tracking.collector.rating}</span>
                        </div>
                      </div>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                        <Phone className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <a
                      href={`/declaration/${tracking.id}`}
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      <Eye className="h-4 w-4" />
                      Détails
                    </a>
                    <a
                      href={`/tracking/${tracking.id}`}
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <Route className="h-4 w-4" />
                      Suivre
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* État vide */}
        {filteredTrackings.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="relative inline-flex mb-6">
              <div className="absolute inset-0 rounded-full bg-gray-200 animate-ping opacity-20" />
              <div className="relative w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune collecte en cours</h3>
            <p className="text-gray-500 mb-6">
              Les collectes que vous déclarez apparaîtront ici en temps réel
            </p>
            <a
              href="/declare"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium rounded-xl hover:shadow-lg transition-all hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              Déclarer une collecte
            </a>
          </div>
        )}

        {/* Pagination */}
        {filteredTrackings.length > 0 && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Affichage de <span className="font-medium">{filteredTrackings.length}</span> collectes
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50" disabled>
                Précédent
              </button>
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default TrackingList