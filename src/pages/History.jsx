import { useState } from 'react'
import { 
  Trash2, 
  Package, 
  Clock, 
  CheckCircle, 
  Calendar, 
  Filter, 
  Search, 
  Download,
  Eye,
  ArrowRight,
  Users,
  Star,
  TrendingUp,
  BarChart3
} from 'lucide-react'
import Layout from '../components/Layout'

const History = () => {
  // Simulated declarations history
  const [declarations] = useState([
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
        rating: 4.8
      },
      actualWeight: null,
      pointsEarned: null
    },
    {
      id: 'DEC-123455',
      wasteTypes: ['glass'],
      quantity: '3',
      quantityUnit: 'kg',
      status: 'pending',
      createdAt: '2024-01-14T16:20:00Z',
      scheduledDate: null,
      collector: null,
      actualWeight: null,
      pointsEarned: null
    },
    {
      id: 'DEC-123454',
      wasteTypes: ['metal', 'electronic'],
      quantity: '8',
      quantityUnit: 'kg',
      status: 'completed',
      createdAt: '2024-01-13T09:15:00Z',
      scheduledDate: '2024-01-13T11:00:00Z',
      collector: {
        name: 'Marie Tchuenté',
        rating: 4.9
      },
      actualWeight: 7.8,
      pointsEarned: 25
    },
    {
      id: 'DEC-123453',
      wasteTypes: ['organic'],
      quantity: '4',
      quantityUnit: 'bags',
      status: 'completed',
      createdAt: '2024-01-12T14:30:00Z',
      scheduledDate: '2024-01-12T16:00:00Z',
      collector: {
        name: 'Jean Pierre',
        rating: 4.7
      },
      actualWeight: 12.5,
      pointsEarned: 18
    },
    {
      id: 'DEC-123452',
      wasteTypes: ['plastic', 'metal'],
      quantity: '6.5',
      quantityUnit: 'kg',
      status: 'completed',
      createdAt: '2024-01-11T08:45:00Z',
      scheduledDate: '2024-01-11T10:30:00Z',
      collector: {
        name: 'Sophie Ngono',
        rating: 4.6
      },
      actualWeight: 6.3,
      pointsEarned: 22
    },
    {
      id: 'DEC-123451',
      wasteTypes: ['paper'],
      quantity: '12',
      quantityUnit: 'kg',
      status: 'completed',
      createdAt: '2024-01-10T11:20:00Z',
      scheduledDate: '2024-01-10T13:00:00Z',
      collector: {
        name: 'Alain Foe',
        rating: 4.8
      },
      actualWeight: 11.8,
      pointsEarned: 20
    },
    {
      id: 'DEC-123450',
      wasteTypes: ['glass', 'plastic'],
      quantity: '4.2',
      quantityUnit: 'kg',
      status: 'completed',
      createdAt: '2024-01-09T15:30:00Z',
      scheduledDate: '2024-01-09T17:00:00Z',
      collector: {
        name: 'Estelle Mballa',
        rating: 4.9
      },
      actualWeight: 4.0,
      pointsEarned: 15
    },
    {
      id: 'DEC-123449',
      wasteTypes: ['electronic'],
      quantity: '2',
      quantityUnit: 'units',
      status: 'completed',
      createdAt: '2024-01-08T09:00:00Z',
      scheduledDate: '2024-01-08T11:30:00Z',
      collector: {
        name: 'Michel Kamga',
        rating: 4.5
      },
      actualWeight: 3.2,
      pointsEarned: 30
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  const wasteTypes = {
    plastic: { label: 'Plastique', icon: '♻️', color: 'blue' },
    paper: { label: 'Papier / Carton', icon: '📄', color: 'yellow' },
    metal: { label: 'Métal', icon: '🔧', color: 'gray' },
    glass: { label: 'Verre', icon: '🍾', color: 'green' },
    organic: { label: 'Déchets organiques', icon: '🌱', color: 'orange' },
    electronic: { label: 'Déchets électroniques', icon: '📱', color: 'purple' }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'amber',
      assigned: 'blue',
      scheduled: 'purple',
      in_progress: 'orange',
      completed: 'green'
    }
    return colors[status] || 'gray'
  }

  const getStatusText = (status) => {
    const texts = {
      pending: 'En attente',
      assigned: 'Assigné',
      scheduled: 'Programmé',
      in_progress: 'En cours',
      completed: 'Terminé'
    }
    return texts[status] || 'Inconnu'
  }

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      assigned: Users,
      scheduled: Calendar,
      in_progress: Package,
      completed: CheckCircle
    }
    return icons[status] || Clock
  }

  // Filter declarations
  const filteredDeclarations = declarations.filter(declaration => {
    const matchesSearch = declaration.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      declaration.wasteTypes.some(type => wasteTypes[type].label.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || declaration.status === statusFilter
    
    const matchesDate = dateFilter === 'all' || 
      (dateFilter === 'week' && new Date(declaration.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (dateFilter === 'month' && new Date(declaration.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    
    return matchesSearch && matchesStatus && matchesDate
  })

  // Calculate statistics
  const stats = {
    total: declarations.length,
    completed: declarations.filter(d => d.status === 'completed').length,
    pending: declarations.filter(d => d.status === 'pending').length,
    inProgress: declarations.filter(d => d.status === 'in_progress').length,
    totalWeight: declarations.filter(d => d.actualWeight).reduce((sum, d) => sum + d.actualWeight, 0),
    totalPoints: declarations.filter(d => d.pointsEarned).reduce((sum, d) => sum + d.pointsEarned, 0)
  }

  const handleExport = () => {
    // Simulate export functionality
    alert('Export des données en cours...')
  }

  return (
    <Layout 
      pageTitle="Historique des déclarations" 
      currentPage="history"
      notifications={[]}
    >
      <div className="max-w-4xl lg:max-w-6xl mx-auto">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
            </div>
            <p className="text-gray-600 font-medium">Total déclarations</p>
            <p className="text-sm text-gray-500 mt-1">Depuis le début</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.completed}</span>
            </div>
            <p className="text-gray-600 font-medium">Collectes terminées</p>
            <p className="text-sm text-gray-500 mt-1">Avec succès</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.totalWeight.toFixed(1)}</span>
            </div>
            <p className="text-gray-600 font-medium">Poids total collecté</p>
            <p className="text-sm text-gray-500 mt-1">Kilogrammes</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.totalPoints}</span>
            </div>
            <p className="text-gray-600 font-medium">Points cumulés</p>
            <p className="text-sm text-gray-500 mt-1">Récompenses</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par numéro, type de déchet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminé</option>
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Toutes les dates</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
              </select>

              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Exporter
              </button>
            </div>
          </div>
        </div>

        {/* Declarations List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-green-600" />
                Liste des déclarations ({filteredDeclarations.length})
              </h2>
              <div className="text-sm text-gray-500">
                {filteredDeclarations.length} résultat{filteredDeclarations.length > 1 ? 's' : ''}
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredDeclarations.map(declaration => {
              const StatusIcon = getStatusIcon(declaration.status)
              const statusColor = getStatusColor(declaration.status)
              
              return (
                <div key={declaration.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-mono text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          #{declaration.id}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${statusColor}-100 text-${statusColor}-800`}>
                          {getStatusText(declaration.status)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          {declaration.wasteTypes.map(wasteTypeId => {
                            const wasteType = wasteTypes[wasteTypeId]
                            return (
                              <span key={wasteTypeId} className="text-lg" title={wasteType.label}>
                                {wasteType.icon}
                              </span>
                            )
                          })}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {declaration.quantity} {declaration.quantityUnit === 'kg' ? 'kg' : declaration.quantityUnit === 'bags' ? 'sacs' : 'unités'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(declaration.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                        
                        {declaration.scheduledDate && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(declaration.scheduledDate).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                        
                        {declaration.collector && (
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {declaration.collector.name}
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span>{declaration.collector.rating}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {declaration.status === 'completed' && (
                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 text-sm">
                          <span className="text-green-600 font-medium">
                            <CheckCircle className="w-3 h-3 inline mr-1" />
                            Poids: {declaration.actualWeight} kg
                          </span>
                          <span className="text-purple-600 font-medium">
                            +{declaration.pointsEarned} points
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <a
                        href={`/declaration/${declaration.id}`}
                        className="flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">Détails</span>
                      </a>
                      <a
                        href={`/tracking/${declaration.id}`}
                        className="flex items-center gap-1 text-gray-600 hover:text-gray-700 transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredDeclarations.length === 0 && (
            <div className="text-center py-12">
              <Trash2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucune déclaration trouvée</p>
              <p className="text-sm text-gray-400 mt-1">
                Essayez de modifier vos filtres de recherche
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default History
