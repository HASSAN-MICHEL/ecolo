import { useState } from 'react'
import { 
  Trash2, Package, Clock,  CheckCircle,  TrendingUp,  Award,  Plus,  BarChart3,  Users,  MapPin,  Star, ArrowRight, Calendar,Leaf,Recycle, Target
} from 'lucide-react'
import Layout from '../components/Layout'

const Dashboard = () => {
  // Simulated user data (in real app, this would come from API/auth context)
  const [userData] = useState({
    firstName: 'Jean',
    lastName: 'Dupont',
    producerType: 'household'
  })

  // Simulated dashboard statistics
  const [stats] = useState({
    totalDeclarations: 12,
    pendingCollections: 2,
    completedCollections: 10,
    totalWasteCollected: 156.8,
    totalPointsEarned: 480,
    monthlyTrend: {
      declarations: [8, 12, 15, 11, 9, 14, 12],
      collections: [6, 10, 13, 9, 7, 12, 10]
    }
  })

  // Simulated recent declarations
  const [recentDeclarations] = useState([
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
      }
    },
    {
      id: 'DEC-123455',
      wasteTypes: ['glass'],
      quantity: '3',
      quantityUnit: 'kg',
      status: 'pending',
      createdAt: '2024-01-14T16:20:00Z',
      scheduledDate: null,
      collector: null
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
    }
  ])

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
      scheduled: Package,
      in_progress: TrendingUp,
      completed: CheckCircle
    }
    return icons[status] || Clock
  }

  // Simulated notifications
  const [notifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Collecte terminée',
      message: 'Votre déclaration DEC-123456 a été collectée avec succès',
      time: 'Il y a 2 heures'
    },
    {
      id: 2,
      type: 'info',
      title: 'Nouveau collecteur disponible',
      message: 'Un collecteur est disponible dans votre quartier',
      time: 'Il y a 5 heures'
    },
    {
      id: 3,
      type: 'warning',
      title: 'Rappel de collecte',
      message: 'N\'oubliez pas de préparer vos déchets pour demain',
      time: 'Hier'
    }
  ])

  return (
    <Layout 
      pageTitle="Tableau de bord" 
      currentPage="dashboard"
      notifications={notifications}
    >
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold mb-2">
                Bienvenue, {userData.firstName} !
              </h2>
              <p className="text-green-100">
                Prêt à faire une différence aujourd'hui ? Continuez votre excellent travail de tri des déchets.
              </p>
            </div>
            <div className="hidden lg:block flex-shrink-0">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5" />
                  <span className="font-medium">Objectif du mois</span>
                </div>
                <div className="text-2xl font-bold">15 kg</div>
                <div className="text-sm text-green-100">Encore 8.2 kg à atteindre</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.totalDeclarations}</span>
          </div>
          <p className="text-gray-600 font-medium">Total des déclarations</p>
          <p className="text-sm text-gray-500 mt-1">Ce mois</p>
          <div className="mt-3 flex items-center text-green-600 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            +12% vs mois dernier
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.pendingCollections}</span>
          </div>
          <p className="text-gray-600 font-medium">Collectes en attente</p>
          <p className="text-sm text-gray-500 mt-1">En cours</p>
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{width: '40%'}}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.completedCollections}</span>
          </div>
          <p className="text-gray-600 font-medium">Collectes réalisées</p>
          <p className="text-sm text-gray-500 mt-1">Terminées</p>
          <div className="mt-3 flex items-center text-green-600 text-sm">
            <CheckCircle className="w-4 h-4 mr-1" />
            83% de taux de réussite
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.totalPointsEarned}</span>
          </div>
          <p className="text-gray-600 font-medium">Points cumulés</p>
          <p className="text-sm text-gray-500 mt-1">Récompenses</p>
          <div className="mt-3 flex items-center text-purple-600 text-sm">
            <Award className="w-4 h-4 mr-1" />
            Niveau Éco-Héros
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Declarations - Left Aligned */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-green-600" />
                  Historique des collectes
                </h2>
                <a href="/history" className="text-sm text-green-600 hover:text-green-700 font-medium">
                  Voir tout
                </a>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {recentDeclarations.map(declaration => {
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
                              <Award className="w-3 h-3 inline mr-1" />
                              +{declaration.pointsEarned} points
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <a
                        href={`/declaration/${declaration.id}`}
                        className="flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors"
                      >
                        <span className="text-sm font-medium">Détails</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-green-600" />
              Actions rapides
            </h2>
            
            <div className="space-y-3">
              <a
                href="/declare"
                className="block w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center font-medium flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Déclarer des déchets
              </a>
              
              <a
                href="/history"
                className="block w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center font-medium"
              >
                Voir l'historique complet
              </a>
              
              <a
                href="/rewards"
                className="block w-full py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-center font-medium"
              >
                Mes récompenses
              </a>
            </div>
          </div>

          {/* Environmental Impact */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              Impact environnemental
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Total collecté</span>
                  <span className="font-semibold text-gray-900">{stats.totalWasteCollected} kg</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full transition-all duration-500" style={{width: '75%'}}></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Recycle className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">89%</p>
                  <p className="text-xs text-gray-600">Taux de recyclage</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Leaf className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600">12</p>
                  <p className="text-xs text-gray-600">Arbres sauvés</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
            <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Conseil du jour
            </h3>
            <p className="text-sm text-green-800 leading-relaxed">
              Saviez-vous que le tri sélectif peut vous rapporter jusqu'à 50% de points en plus ? 
              Séparez correctement vos déchets pour maximiser vos récompenses !
            </p>
            <div className="mt-3 pt-3 border-t border-green-200">
              <p className="text-xs text-green-700">
                🎯 Objectif : Atteignez 500 points ce mois pour débloquer le niveau "Maître Recycleur"
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
