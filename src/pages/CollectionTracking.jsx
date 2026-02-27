import { useState } from 'react'
import { ArrowLeft, Clock, CheckCircle, User, Phone, MapPin, Calendar, Package, Scale, AlertCircle, Star, MessageCircle } from 'lucide-react'
import Layout from '../components/Layout'

const CollectionTracking = () => {
  // Simulated declaration data (in real app, this would come from API params)
  const [declaration] = useState({
    id: 'DEC-123456',
    wasteTypes: ['plastic', 'paper'],
    quantity: '5.2',
    quantityUnit: 'kg',
    collectionMode: 'home',
    specialInstructions: 'Sonnette à droite, portail bleu',
    createdAt: '2024-01-15T10:30:00Z',
    status: 'in_progress',
    collector: {
      id: 'COL-789',
      name: 'Paul Mbarga',
      phone: '+237 698 234 567',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      rating: 4.8,
      vehicle: 'Camionnette bennes',
      plateNumber: 'CE 1234 AB'
    },
    scheduledDate: '2024-01-15T14:00:00Z',
    estimatedDuration: '30 minutes',
    actualWeight: null,
    pointsEarned: null
  })

  const statusTimeline = [
    {
      id: 'pending',
      label: 'En attente d\'affectation',
      description: 'Nous recherchons un collecteur disponible',
      timestamp: declaration.createdAt,
      completed: true,
      icon: Clock,
      color: 'amber'
    },
    {
      id: 'assigned',
      label: 'Collecteur affecté',
      description: `${declaration.collector.name} a été assigné à votre demande`,
      timestamp: '2024-01-15T11:15:00Z',
      completed: true,
      icon: User,
      color: 'blue'
    },
    {
      id: 'scheduled',
      label: 'Collecte programmée',
      description: `Rendez-vous fixé pour le ${new Date(declaration.scheduledDate).toLocaleString('fr-FR')}`,
      timestamp: '2024-01-15T11:20:00Z',
      completed: true,
      icon: Calendar,
      color: 'purple'
    },
    {
      id: 'in_progress',
      label: 'En cours de collecte',
      description: 'Le collecteur est en route',
      timestamp: '2024-01-15T13:45:00Z',
      completed: true,
      icon: Package,
      color: 'orange'
    },
    {
      id: 'completed',
      label: 'Collecte effectuée',
      description: 'La collecte a été réalisée avec succès',
      timestamp: null,
      completed: false,
      icon: CheckCircle,
      color: 'green'
    }
  ]

  const wasteTypes = {
    plastic: { label: 'Plastique', icon: '♻️', color: 'blue' },
    paper: { label: 'Papier / Carton', icon: '📄', color: 'yellow' },
    metal: { label: 'Métal', icon: '🔧', color: 'gray' },
    glass: { label: 'Verre', icon: '🍾', color: 'green' },
    organic: { label: 'Déchets organiques', icon: '🌱', color: 'orange' },
    electronic: { label: 'Déchets électroniques', icon: '📱', color: 'purple' }
  }

  const quantityUnits = {
    kg: 'Kilogrammes',
    bags: 'Sacs',
    units: 'Unités'
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
      pending: 'En attente d\'affectation',
      assigned: 'Collecteur affecté',
      scheduled: 'Collecte programmée',
      in_progress: 'En cours de collecte',
      completed: 'Collecte effectuée'
    }
    return texts[status] || 'Inconnu'
  }

  const currentStatus = statusTimeline.find(step => !step.completed) || statusTimeline[statusTimeline.length - 1]

  return (
    <Layout 
      pageTitle="Suivi de la collecte" 
      currentPage="tracking"
      notifications={[]}
    >
      <div className="max-w-4xl lg:max-w-6xl mx-auto px-2 sm:px-0">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a 
                href="/dashboard" 
                className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour
              </a>
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-green-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Suivi de la collecte</h1>
                  <p className="text-gray-600">Déclaration #{declaration.id}</p>
                </div>
              </div>
            </div>
            
            <div className={`px-4 py-2 rounded-full bg-${getStatusColor(declaration.status)}-100 text-${getStatusColor(declaration.status)}-800 font-medium`}>
              {getStatusText(declaration.status)}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                Progression de la collecte
              </h2>
              
              <div className="space-y-4">
                {statusTimeline.map((step, index) => {
                  const Icon = step.icon
                  const isLast = index === statusTimeline.length - 1
                  
                  return (
                    <div key={step.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step.completed 
                            ? `bg-${step.color}-100 text-${step.color}-600` 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        {!isLast && (
                          <div className={`w-0.5 h-16 mt-2 ${
                            step.completed ? 'bg-green-200' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                      
                      <div className="flex-1 pb-8">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className={`font-semibold ${
                              step.completed ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              {step.label}
                            </h3>
                            <p className={`text-sm mt-1 ${
                              step.completed ? 'text-gray-600' : 'text-gray-400'
                            }`}>
                              {step.description}
                            </p>
                          </div>
                          {step.timestamp && (
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                              {new Date(step.timestamp).toLocaleString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Declaration Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-green-600" />
                Détails de la déclaration
              </h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Types de déchets</h3>
                  <div className="space-y-2">
                    {declaration.wasteTypes.map(wasteTypeId => {
                      const wasteType = wasteTypes[wasteTypeId]
                      return (
                        <div key={wasteTypeId} className="flex items-center gap-2">
                          <span className="text-lg">{wasteType.icon}</span>
                          <span className="text-sm text-gray-700">{wasteType.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Quantité</h3>
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">
                      {declaration.quantity} {quantityUnits[declaration.quantityUnit]}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Mode de collecte</h3>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">
                      {declaration.collectionMode === 'home' ? 'Collecte à domicile' : 'Dépôt volontaire'}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Date de création</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">
                      {new Date(declaration.createdAt).toLocaleString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>

              {declaration.specialInstructions && (
                <div className="max-w-4xl lg:max-w-6xl mx-auto px-2 sm:px-0 border-t">
                  <h3 className="font-medium text-gray-900 mb-2">Instructions spéciales</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                    {declaration.specialInstructions}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Collector Info */}
          <div className="space-y-6">
            {/* Collector Information */}
            {declaration.collector && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-green-600" />
                  Collecteur assigné
                </h2>
                
                <div className="text-center mb-6">
                  <img 
                    src={declaration.collector.photo} 
                    alt={declaration.collector.name}
                    className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                  />
                  <h3 className="font-semibold text-gray-900">{declaration.collector.name}</h3>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">{declaration.collector.rating}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{declaration.collector.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{declaration.collector.vehicle}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{declaration.collector.plateNumber}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contacter
                  </button>
                  <button className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </button>
                </div>
              </div>
            )}

            {/* Scheduled Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Programmation
              </h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Date et heure</p>
                  <p className="font-medium text-gray-900">
                    {new Date(declaration.scheduledDate).toLocaleString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Durée estimée</p>
                  <p className="font-medium text-gray-900">{declaration.estimatedDuration}</p>
                </div>
              </div>
            </div>

            {/* Result (if completed) */}
            {declaration.status === 'completed' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Résultat de la collecte
                </h2>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Poids réel</p>
                    <p className="font-medium text-gray-900">
                      {declaration.actualWeight || 'Non pesé'} kg
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Points gagnés</p>
                    <p className="font-medium text-green-600">
                      {declaration.pointsEarned || '0'} points
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Help */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Besoin d'aide ?</p>
                  <p>Contactez notre support si vous avez des questions sur cette collecte.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CollectionTracking
