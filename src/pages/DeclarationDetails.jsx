import { useState } from 'react'
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  User, 
  Phone, 
  MapPin, Calendar, Package, Scale, AlertCircle, Star, MessageCircle,Edit,Download,Share,Trash2,TrendingUp,Award,Filter
} from 'lucide-react'
import Layout from '../components/Layout'

const DeclarationDetails = () => {
  // Simulated declaration data (in real app, this would come from API params)
  const [declaration] = useState({
    id: 'DEC-123456',
    wasteTypes: ['plastic', 'paper'],
    quantity: '5.2',
    quantityUnit: 'kg',
    collectionMode: 'home',
    specialInstructions: 'Sonnette à droite, portail bleu',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:35:00Z',
    status: 'completed',
    collector: {
      id: 'COL-789',
      name: 'Paul Mbarga',
      phone: '+237 698 234 567',
      email: 'paul.mbarga@ecocollect.cm',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      rating: 4.8,
      vehicle: 'Camionnette bennes',
      plateNumber: 'CE 1234 AB'
    },
    scheduledDate: '2024-01-15T14:00:00Z',
    estimatedDuration: '30 minutes',
    actualWeight: 5.1,
    pointsEarned: 25,
    completionTime: '2024-01-15T14:32:00Z',
    photos: [
      'https://images.unsplash.com/photo-1584292995402-4bc5f973b66?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1584292995402-4bc5f973b66?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1584292995402-4bc5f973b66?w=300&h=200&fit=crop'
    ],
    notes: [
      'Collecte effectuée avec succès',
      'Client satisfait du service',
      'Déchets bien triés'
    ]
  })

  const [activeTab, setActiveTab] = useState('details')
  const [isEditing, setIsEditing] = useState(false)

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
      pending: 'En attente d\'affectation',
      assigned: 'Collecteur affecté',
      scheduled: 'Collecte programmée',
      in_progress: 'En cours de collecte',
      completed: 'Collecte effectuée'
    }
    return texts[status] || 'Inconnu'
  }

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      assigned: User,
      scheduled: Calendar,
      in_progress: Package,
      completed: CheckCircle
    }
    return icons[status] || Clock
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Déclaration ${declaration.id}`,
        text: `Ma déclaration ${declaration.id} a été ${getStatusText(declaration.status)}`,
        url: window.location.href
      })
    } else {
      alert('Lien copié dans le presse-papiers')
    }
  }

  const handleDownload = () => {
    // Simulate download functionality
    alert('Téléchargement du reçu en cours...')
  }

  const handleEdit = () => {
    setIsEditing(!isEditing)
  }

  return (
    <Layout 
      pageTitle={`Détails - ${declaration.id}`} 
      currentPage="details"
      notifications={[]}
    >
      <div className="max-w-4xl lg:max-w-6xl mx-auto px-2 sm:px-0">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a 
                href="/history" 
                className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour à l'historique
              </a>
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-green-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Détails de la déclaration</h1>
                  <p className="text-gray-600">#{declaration.id}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full bg-${getStatusColor(declaration.status)}-100 text-${getStatusColor(declaration.status)}-800 font-medium`}>
                {getStatusText(declaration.status)}
              </span>
              
              <button
                onClick={handleEdit}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Edit className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'details' 
                    ? 'border-green-500 text-green-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Informations générales
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'timeline' 
                    ? 'border-green-500 text-green-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setActiveTab('photos')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'photos' 
                    ? 'border-green-500 text-green-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Photos
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'notes' 
                    ? 'border-green-500 text-green-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Notes
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Declaration Info */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Trash2 className="w-5 h-5 text-green-600" />
                      Informations de la déclaration
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Types de déchets</p>
                        <div className="flex items-center gap-2 mt-1">
                          {declaration.wasteTypes.map(wasteTypeId => {
                            const wasteType = wasteTypes[wasteTypeId]
                            return (
                              <span key={wasteTypeId} className="text-lg" title={wasteType.label}>
                                {wasteType.icon}
                              </span>
                            )
                          })}
                          <span className="text-sm font-medium text-gray-700">
                            {declaration.quantity} {declaration.quantityUnit === 'kg' ? 'kg' : declaration.quantityUnit === 'bags' ? 'sacs' : 'unités'}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Mode de collecte</p>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {declaration.collectionMode === 'home' ? 'Collecte à domicile' : 'Dépôt volontaire'}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Date de création</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {new Date(declaration.createdAt).toLocaleString('fr-FR')}
                          </span>
                        </div>
                      </div>
                      
                      {declaration.specialInstructions && (
                        <div>
                          <p className="text-sm text-gray-600">Instructions spéciales</p>
                          <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 mt-1">
                            {declaration.specialInstructions}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Collector Info */}
                {declaration.collector && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-green-600" />
                      Informations du collecteur
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="text-center">
                        <img 
                          src={declaration.collector.photo} 
                          alt={declaration.collector.name}
                          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                        />
                        <h4 className="font-semibold text-gray-900 text-lg">{declaration.collector.name}</h4>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-600">{declaration.collector.rating}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Téléphone</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{declaration.collector.phone}</span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <div className="flex items-center gap-2 mt-1">
                            <MessageCircle className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{declaration.collector.email}</span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">Véhicule</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Package className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{declaration.collector.vehicle}</span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">Plaque</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Scale className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{declaration.collector.plateNumber}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t">
                        <div className="flex gap-3">
                          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            <Phone className="w-4 h-4" />
                            Contacter
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            Message
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Results */}
                {declaration.status === 'completed' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Résultats de la collecte
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-600">Poids réel</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Scale className="w-4 h-4 text-gray-400" />
                          <span className="text-lg font-bold text-gray-900">
                            {declaration.actualWeight} kg
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Points gagnés</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Award className="w-4 h-4 text-gray-400" />
                          <span className="text-lg font-bold text-green-600">
                            +{declaration.pointsEarned} points
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Temps de collecte</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {declaration.completionTime && 
                              `${new Date(declaration.completionTime).toLocaleString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}`
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'timeline' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  Timeline de la déclaration
                </h3>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="w-0.5 h-16 bg-green-200"></div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Déclaration créée</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(declaration.createdAt).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="w-0.5 h-16 bg-blue-200"></div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Collecteur affecté</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {declaration.collector?.name} a été assigné à votre demande
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="w-0.5 h-16 bg-purple-200"></div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Collecte programmée</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Rendez-vous fixé pour le {new Date(declaration.scheduledDate).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <Package className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="w-0.5 h-16 bg-orange-200"></div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">En cours de collecte</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Le collecteur est en route
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Collecte effectuée</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        La collecte a été réalisée avec succès
                      </p>
                      <p className="text-sm text-green-600 font-medium mt-1">
                        Poids: {declaration.actualWeight} kg • Points: +{declaration.pointsEarned}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'photos' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5 text-green-600" />
                  Photos de la collecte
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {declaration.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={photo} 
                        alt={`Photo ${index + 1} de la collecte`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  Notes de la collecte
                </h3>
                
                <div className="space-y-4">
                  {declaration.notes.map((note, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm text-gray-500">
                          {new Date().toLocaleDateString('fr-FR')} - Note {index + 1}
                        </span>
                        <span className="text-xs text-gray-400">
                          Par: {declaration.collector?.name || 'Système'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Share className="w-4 h-4" />
              Partager
            </button>
            
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Télécharger le reçu
            </button>
            
            <a
              href="/tracking/DEC-123456"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Package className="w-4 h-4" />
              Suivi en temps réel
            </a>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default DeclarationDetails
