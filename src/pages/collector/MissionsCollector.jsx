import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Package, MapPin, Clock, DollarSign, Navigation, 
  Filter, Search, Calendar, AlertCircle, CheckCircle,
  Truck, Star, Phone, MessageSquare, Eye, ChevronRight,
  Target, Activity, TrendingUp, ArrowRight, X, Navigation2,
  Camera, Check, Flag, Info, User, Scale
} from 'lucide-react'
import Layout from '../../components/Layout'

const MissionsCollector = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMission, setSelectedMission] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const [showDepotModal, setShowDepotModal] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [pointsDepot, setPointsDepot] = useState([])
  const [depotSearchTerm, setDepotSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [missions, setMissions] = useState([])
  const [error, setError] = useState(null)
  const [missionForm, setMissionForm] = useState({
    photoPreuve: '',
    codeConfirmation: '',
    notes: '',
    conformiteTri: 'true',
    pointDepotId: ''
  })

  // const API_URL = import.meta.env.VITE_API_URL || 'https://ecobackend-7tuh.vercel.app'
    const API_URL = 'https://ecobackend-zeds.vercel.app';
  const STORAGE_KEYS = {
    TOKEN: 'ecocollect_token',
    USER: 'ecocollect_user',
    ROLE: 'ecocollect_role'
  }

  const getToken = () => localStorage.getItem(STORAGE_KEYS.TOKEN)

  // Charger les missions
  const loadMissions = async () => {
    const token = getToken()
    if (!token) {
      navigate('/login')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Charger les missions disponibles
      const disponibleResponse = await fetch(`${API_URL}/api/collecteurs/missions/disponibles`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      const disponibleData = await disponibleResponse.json()
      const disponibles = disponibleData.missions || []

      // Charger mes missions
      const mesMissionsResponse = await fetch(`${API_URL}/api/collecteurs/missions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      const mesMissionsData = await mesMissionsResponse.json()
      const mesMissions = mesMissionsData.missions || []

      // Combiner et formater les missions
      const allMissions = [...disponibles.map(m => ({ ...m, status: 'new' })), ...mesMissions]
      
      const formattedMissions = allMissions.map((m, index) => {
        const now = new Date()
        const created = new Date(m.date_creation)
        const diffMs = now - created
        const diffMins = Math.round(diffMs / 60000)
        
        let timeAgo = ''
        if (diffMins < 60) timeAgo = `Il y a ${diffMins} min`
        else if (diffMins < 1440) timeAgo = `Il y a ${Math.round(diffMins / 60)}h`
        else timeAgo = `Il y a ${Math.round(diffMins / 1440)}j`

        return {
          id: m.id,
          status: m.statut === 'disponible' ? 'new' :
                  m.statut === 'acceptee' ? 'accepted' :
                  m.statut === 'en_cours' ? 'in_progress' :
                  m.statut === 'deposee' ? 'completed' :
                  m.statut === 'validee' ? 'completed' : 'new',
          producerName: m.producteur_nom || 'Producteur',
          producerPhone: m.producteur_telephone || '+237 XXX XXX XXX',
          location: m.producteur_adresse || 'Adresse non spécifiée',
          coordinates: { lat: 4.0581, lng: 9.7043 },
          wasteType: m.type_dechet || 'Déchets',
          estimatedQuantity: `${m.quantite || 0} ${m.unite || 'kg'}`,
          distance: m.distance || '2.3 km',
          estimatedEarnings: m.gain_montant || m.estimation_gain || 0,
          urgency: m.urgence || 'medium',
          timeAgo,
          description: m.notes || 'Collecte de déchets',
          producerRating: m.producteur_note || 4.5,
          specialInstructions: m.instructions || '',
          acceptedAt: m.date_acceptation ? new Date(m.date_acceptation).toLocaleString() : null,
          startedAt: m.date_debut ? new Date(m.date_debut).toLocaleString() : null,
          completedAt: m.date_fin ? new Date(m.date_fin).toLocaleString() : null,
          depositedAt: m.date_depot ? new Date(m.date_depot).toLocaleString() : null,
          actualQuantity: m.poids_depose ? `${m.poids_depose} kg` : null,
          finalEarnings: m.gain_montant || 0,
          depositPoint: m.point_depot_nom || null,
          producerFeedback: m.commentaires || null
        }
      })

      setMissions(formattedMissions)
    } catch (error) {
      console.error('Erreur chargement missions:', error)
      setError('Impossible de charger les missions')
    } finally {
      setIsLoading(false)
    }
  }

  // Charger les points de dépôt
  const loadPointsDepot = async () => {
    const token = getToken()
    try {
      const response = await fetch(`${API_URL}/api/points-depot`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })

      if (response.ok) {
        const data = await response.json()
        setPointsDepot(data.points || [])
      }
    } catch (error) {
      console.error('Erreur chargement points dépôt:', error)
    }
  }

  useEffect(() => {
    loadMissions()
    loadPointsDepot()
    
    const interval = setInterval(loadMissions, 30000)
    return () => clearInterval(interval)
  }, [])

  const tabs = [
    { id: 'all', label: 'Toutes', count: missions.length },
    { id: 'new', label: 'Nouvelles', count: missions.filter(m => m.status === 'new').length },
    { id: 'accepted', label: 'Acceptées', count: missions.filter(m => m.status === 'accepted').length },
    { id: 'in_progress', label: 'En cours', count: missions.filter(m => m.status === 'in_progress').length },
    { id: 'completed', label: 'Terminées', count: missions.filter(m => ['completed'].includes(m.status)).length }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'accepted': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'in_progress': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'completed': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'new': return 'Nouvelle'
      case 'accepted': return 'Acceptée'
      case 'in_progress': return 'En cours'
      case 'completed': return 'Terminée'
      default: return status
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getUrgencyLabel = (urgency) => {
    switch (urgency) {
      case 'high': return 'Urgent'
      case 'medium': return 'Normal'
      case 'low': return 'Faible'
      default: return urgency
    }
  }

  const filteredMissions = missions.filter(mission => {
    const matchesTab = activeTab === 'all' || mission.status === activeTab
    const matchesSearch = mission.producerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.wasteType.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesTab && matchesSearch
  })

  const handleMissionAction = async (missionId, action) => {
    const token = getToken()
    if (!token) return

    setIsLoading(true)

    try {
      switch (action) {
        case 'accept':
          const acceptResponse = await fetch(`${API_URL}/api/collecteurs/missions/${missionId}/accepter`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          })
          
          if (acceptResponse.ok) {
            setMissions(prev => 
              prev.map(m => m.id === missionId ? { ...m, status: 'accepted', acceptedAt: 'Maintenant' } : m)
            )
          }
          break

        case 'start':
          const startResponse = await fetch(`${API_URL}/api/collecteurs/missions/${missionId}/demarrer`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          })
          
          if (startResponse.ok) {
            setMissions(prev => 
              prev.map(m => m.id === missionId ? { ...m, status: 'in_progress', startedAt: 'Maintenant' } : m)
            )
            setShowDetail(false)
          }
          break

        case 'terminer':
          if (!missionForm.pointDepotId) {
            setSelectedMission(missions.find(m => m.id === missionId))
            setShowDepotModal(true)
            setIsLoading(false)
            return
          }

          // D'abord choisir le point de dépôt
          const depotResponse = await fetch(`${API_URL}/api/collecteurs/missions/${missionId}/depot`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ pointDepotId: missionForm.pointDepotId })
          })

          const depotResult = await depotResponse.json()
          if (!depotResult.success) {
            throw new Error(depotResult.message || 'Erreur choix point dépôt')
          }

          // Ensuite terminer la mission
          const completeResponse = await fetch(`${API_URL}/api/collecteurs/missions/${missionId}/terminer`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              photoPreuveUrl: missionForm.photoPreuve,
              codeConfirmation: missionForm.codeConfirmation,
              notes: missionForm.notes,
              conformiteTri: missionForm.conformiteTri === 'true'
            })
          })

          if (completeResponse.ok) {
            setMissions(prev => 
              prev.map(m => m.id === missionId ? { ...m, status: 'completed', completedAt: 'Maintenant' } : m)
            )
            setShowDetail(false)
            setShowDepotModal(false)
            setShowCompleteModal(false)
            setMissionForm({
              photoPreuve: '',
              codeConfirmation: '',
              notes: '',
              conformiteTri: 'true',
              pointDepotId: ''
            })
          }
          break

        case 'navigate':
          const mission = missions.find(m => m.id === missionId)
          if (mission) {
            window.open(`https://maps.google.com/?q=${mission.coordinates.lat},${mission.coordinates.lng}`, '_blank')
          }
          break
      }
    } catch (error) {
      console.error('Erreur action mission:', error)
      alert(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const openMissionDetail = (mission) => {
    setSelectedMission(mission)
    setShowDetail(true)
  }

  const openCompleteModal = (mission) => {
    setSelectedMission(mission)
    setShowCompleteModal(true)
  }

  const filteredPointsDepot = pointsDepot.filter(point => 
    point.nom?.toLowerCase().includes(depotSearchTerm.toLowerCase()) ||
    point.adresse?.toLowerCase().includes(depotSearchTerm.toLowerCase()) ||
    point.ville?.toLowerCase().includes(depotSearchTerm.toLowerCase())
  )

  const MissionCard = ({ mission }) => (
    <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-bold text-gray-900 text-lg">{mission.producerName}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(mission.status)}`}>
              {getStatusLabel(mission.status)}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getUrgencyColor(mission.urgency)}`}>
              {getUrgencyLabel(mission.urgency)}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {mission.location}
            </div>
            <div className="flex items-center gap-1">
              <Navigation className="h-4 w-4" />
              {mission.distance}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {mission.timeAgo}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-2xl font-bold text-green-600">{mission.estimatedEarnings.toLocaleString()} FCFA</p>
          <p className="text-xs text-gray-500">Gain estimé</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{mission.wasteType}</span>
        </div>
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{mission.estimatedQuantity}</span>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">{mission.description}</p>

      <div className="flex items-center gap-2">
        {mission.status === 'new' && (
          <>
            <button
              onClick={() => handleMissionAction(mission.id, 'accept')}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              Accepter
            </button>
            <button
              onClick={() => openMissionDetail(mission)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold hover:border-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              <Eye className="h-4 w-4" />
            </button>
          </>
        )}
        
        {mission.status === 'accepted' && (
          <>
            <button
              onClick={() => handleMissionAction(mission.id, 'start')}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              Commencer
            </button>
            <button
              onClick={() => handleMissionAction(mission.id, 'navigate')}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold hover:border-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              <Navigation2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => openMissionDetail(mission)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold hover:border-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              <Eye className="h-4 w-4" />
            </button>
          </>
        )}
        
        {mission.status === 'in_progress' && (
          <>
            <button
              onClick={() => openCompleteModal(mission)}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              Terminer
            </button>
            <button
              onClick={() => handleMissionAction(mission.id, 'navigate')}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold hover:border-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              <Navigation2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => openMissionDetail(mission)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold hover:border-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              <Eye className="h-4 w-4" />
            </button>
          </>
        )}
        
        {mission.status === 'completed' && (
          <button
            onClick={() => openMissionDetail(mission)}
            className="flex-1 bg-gray-100 text-gray-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Voir détails
          </button>
        )}
      </div>
    </div>
  )

  const MissionDetailModal = () => {
    if (!selectedMission) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Détails de la mission</h2>
              <button
                onClick={() => setShowDetail(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                Informations producteur
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Nom</p>
                  <p className="font-semibold text-lg text-gray-900">{selectedMission.producerName}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Téléphone</p>
                  <p className="font-semibold text-lg text-gray-900">{selectedMission.producerPhone}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Note</p>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-lg text-gray-900">{selectedMission.producerRating}/5</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                Localisation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Adresse</p>
                  <p className="font-semibold text-lg text-gray-900">{selectedMission.location}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Distance</p>
                  <p className="font-semibold text-lg text-gray-900">{selectedMission.distance}</p>
                </div>
              </div>
              <button
                onClick={() => handleMissionAction(selectedMission.id, 'navigate')}
                className="mt-4 w-full flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Navigation2 className="h-4 w-4" />
                <span>Ouvrir dans Google Maps</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
                Détails des déchets
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Type</p>
                  <p className="font-semibold text-lg text-gray-900">{selectedMission.wasteType}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Quantité estimée</p>
                  <p className="font-semibold text-lg text-gray-900">{selectedMission.estimatedQuantity}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Gain estimé</p>
                  <p className="font-semibold text-2xl text-green-600">{selectedMission.estimatedEarnings?.toLocaleString() || 0} FCFA</p>
                </div>
              </div>
            </div>

            {selectedMission.specialInstructions && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-yellow-800 mb-3 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  Instructions spéciales
                </h3>
                <p className="text-yellow-800">{selectedMission.specialInstructions}</p>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Clock className="h-5 w-5 text-indigo-600" />
                </div>
                Historique
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="h-3 w-3 bg-blue-600 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-blue-900">Mission créée</p>
                    <p className="text-sm text-blue-700">{selectedMission.timeAgo}</p>
                  </div>
                </div>
                {selectedMission.acceptedAt && (
                  <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="h-3 w-3 bg-yellow-600 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-yellow-900">Mission acceptée</p>
                      <p className="text-sm text-yellow-700">{selectedMission.acceptedAt}</p>
                    </div>
                  </div>
                )}
                {selectedMission.startedAt && (
                  <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="h-3 w-3 bg-purple-600 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-purple-900">Collecte commencée</p>
                      <p className="text-sm text-purple-700">{selectedMission.startedAt}</p>
                    </div>
                  </div>
                )}
                {selectedMission.completedAt && (
                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="h-3 w-3 bg-green-600 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-green-900">Collecte terminée</p>
                      <p className="text-sm text-green-700">{selectedMission.completedAt}</p>
                    </div>
                  </div>
                )}
                {selectedMission.depositedAt && (
                  <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="h-3 w-3 bg-emerald-600 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-emerald-900">Déposée au centre</p>
                      <p className="text-sm text-emerald-700">{selectedMission.depositedAt}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {selectedMission.producerFeedback && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  Feedback producteur
                </h3>
                <p className="text-green-800">{selectedMission.producerFeedback}</p>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0 bg-white">
            <div className="flex gap-3">
              <button
                onClick={() => setShowDetail(false)}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Fermer
              </button>
              {selectedMission.status === 'new' && (
                <button
                  onClick={() => {
                    handleMissionAction(selectedMission.id, 'accept')
                    setShowDetail(false)
                  }}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  Accepter la mission
                </button>
              )}
              {selectedMission.status === 'accepted' && (
                <button
                  onClick={() => {
                    handleMissionAction(selectedMission.id, 'start')
                    setShowDetail(false)
                  }}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  Commencer la collecte
                </button>
              )}
              {selectedMission.status === 'in_progress' && (
                <button
                  onClick={() => {
                    setShowDetail(false)
                    openCompleteModal(selectedMission)
                  }}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  Terminer la collecte
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const CompleteMissionModal = () => {
    if (!selectedMission) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 sticky top-0 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Terminer la mission</h2>
              <button
                onClick={() => {
                  setShowCompleteModal(false)
                  setMissionForm({
                    photoPreuve: '',
                    codeConfirmation: '',
                    notes: '',
                    conformiteTri: 'true',
                    pointDepotId: ''
                  })
                }}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Sélectionner un point de dépôt</h3>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={depotSearchTerm}
                  onChange={(e) => setDepotSearchTerm(e.target.value)}
                  placeholder="Rechercher un point de dépôt..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {filteredPointsDepot.length > 0 ? (
                  filteredPointsDepot.map(point => (
                    <label
                      key={point.id}
                      className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                        missionForm.pointDepotId === point.id
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="pointDepot"
                        value={point.id}
                        checked={missionForm.pointDepotId === point.id}
                        onChange={(e) => setMissionForm({...missionForm, pointDepotId: e.target.value})}
                        className="mt-1 mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{point.nom}</h4>
                          {missionForm.pointDepotId === point.id && (
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{point.adresse}</p>
                        {point.ville && (
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {point.ville}
                          </p>
                        )}
                      </div>
                    </label>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Aucun point de dépôt trouvé</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Informations de collecte</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photo preuve (URL)
                  </label>
                  <input
                    type="url"
                    value={missionForm.photoPreuve}
                    onChange={(e) => setMissionForm({...missionForm, photoPreuve: e.target.value})}
                    placeholder="https://..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code confirmation
                  </label>
                  <input
                    type="text"
                    value={missionForm.codeConfirmation}
                    onChange={(e) => setMissionForm({...missionForm, codeConfirmation: e.target.value})}
                    placeholder="Code reçu du producteur"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conformité tri
                  </label>
                  <select
                    value={missionForm.conformiteTri}
                    onChange={(e) => setMissionForm({...missionForm, conformiteTri: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    <option value="true">Conforme</option>
                    <option value="false">Non conforme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    rows="3"
                    value={missionForm.notes}
                    onChange={(e) => setMissionForm({...missionForm, notes: e.target.value})}
                    placeholder="Observations..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0 bg-white">
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCompleteModal(false)
                  setMissionForm({
                    photoPreuve: '',
                    codeConfirmation: '',
                    notes: '',
                    conformiteTri: 'true',
                    pointDepotId: ''
                  })
                }}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Annuler
              </button>
              <button
                onClick={() => handleMissionAction(selectedMission.id, 'terminer')}
                disabled={isLoading || !missionForm.pointDepotId}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Traitement...' : 'Valider et terminer'}
              </button>
            </div>
            {!missionForm.pointDepotId && (
              <p className="text-xs text-red-600 mt-3 text-center">
                Veuillez sélectionner un point de dépôt
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (isLoading && missions.length === 0) {
    return (
      <Layout pageTitle="Mes missions" currentPage="missions" userRole="collector">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des missions...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout pageTitle="Mes missions" currentPage="missions" userRole="collector">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">{error}</p>
          <button onClick={loadMissions} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Réessayer
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout pageTitle="Mes missions" currentPage="missions" userRole="collector">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <Target className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">
                {missions.filter(m => m.status === 'new').length}
              </span>
            </div>
            <p className="text-sm text-gray-600">Nouvelles missions</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-8 w-8 text-yellow-600" />
              <span className="text-2xl font-bold text-gray-900">
                {missions.filter(m => m.status === 'in_progress').length}
              </span>
            </div>
            <p className="text-sm text-gray-600">En cours</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">
                {missions.filter(m => m.status === 'completed').length}
              </span>
            </div>
            <p className="text-sm text-gray-600">Terminées</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">
                {missions.reduce((sum, m) => sum + m.estimatedEarnings, 0).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-600">Gain potentiel (FCFA)</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex items-center gap-6 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher une mission..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        </div>

        {/* Missions List */}
        <div className="space-y-4">
          {filteredMissions.length > 0 ? (
            filteredMissions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune mission trouvée</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Essayez une autre recherche' : 'Aucune mission ne correspond à ce filtre'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showDetail && <MissionDetailModal />}
      {showCompleteModal && <CompleteMissionModal />}
    </Layout>
  )
}

export default MissionsCollector