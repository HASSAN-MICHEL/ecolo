import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  User, MapPin, Phone, Mail, Edit2, Save, X, 
  Camera, Upload, CheckCircle, AlertCircle, LogOut,
  Navigation, Building, Shield, Star, Clock, Menu,
  Package, Wallet, History, Home, Settings, HelpCircle,
  Truck
} from 'lucide-react'

const ProfileCollector = () => {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [userData, setUserData] = useState({
    nomComplet: '',
    email: '',
    telephone: '',
    type_collecteur: '',
    zone_intervention_nom: '',
    quartiers_habituels: [],
    communes_intervention: [],
    photo_profil_url: '',
    statut: '',
    points_total: 0,
    gains_total: 0,
    cree_le: '',
    rating: 0,
    totalMissions: 0
  })
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    businessName: '',
    businessLicense: '',
    experience: '',
    serviceArea: '',
    specializations: [],
    description: '',
    location: {
      latitude: 4.0483,
      longitude: 9.7043
    }
  })
  const [editData, setEditData] = useState(profileData)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState('')

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

  // Charger les données du profil
  const loadProfileData = async () => {
    const token = getToken()
    if (!token) {
      navigate('/login')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/collecteurs/profil`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const result = await response.json()
        const profil = result.collecteur || result
        
        // Mettre à jour userData
        setUserData({
          nomComplet: profil.nom_complet || '',
          email: profil.email || '',
          telephone: profil.telephone || '',
          type_collecteur: profil.type_collecteur || '',
          zone_intervention_nom: profil.zone_intervention_nom || '',
          quartiers_habituels: profil.quartiers_habituels || [],
          communes_intervention: profil.communes_intervention || [],
          photo_profil_url: profil.photo_profil_url || '',
          statut: profil.statut || '',
          points_total: profil.points_total || 0,
          gains_total: profil.gains_total || 0,
          cree_le: profil.cree_le || '',
          rating: profil.note_moyenne || 4.8,
          totalMissions: profil.nombre_missions || 47
        })

        // Mettre à jour profileData
        const nameParts = (profil.nom_complet || '').split(' ')
        setProfileData({
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: profil.email || '',
          phone: profil.telephone || '',
          address: profil.zone_intervention_nom || '',
          businessName: profil.nom_entreprise || '',
          businessLicense: profil.numero_licence || '',
          experience: profil.experience || '',
          serviceArea: profil.zone_intervention_nom || '',
          specializations: profil.specialisations || [],
          description: profil.description || '',
          location: {
            latitude: profil.latitude || 4.0483,
            longitude: profil.longitude || 9.7043
          }
        })

        setEditData({
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: profil.email || '',
          phone: profil.telephone || '',
          address: profil.zone_intervention_nom || '',
          businessName: profil.nom_entreprise || '',
          businessLicense: profil.numero_licence || '',
          experience: profil.experience || '',
          serviceArea: profil.zone_intervention_nom || '',
          specializations: profil.specialisations || [],
          description: profil.description || '',
          location: {
            latitude: profil.latitude || 4.0483,
            longitude: profil.longitude || 9.7043
          }
        })
      }
    } catch (error) {
      console.error('Erreur chargement profil:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProfileData()
  }, [])

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
      localStorage.removeItem(STORAGE_KEYS.ROLE)
      navigate('/login')
    }
  }

  const businessStatuses = [
    { id: 'independent', label: 'Indépendant', description: 'Travailleur autonome' },
    { id: 'cooperative', label: 'Coopérative', description: 'Groupe organisé' }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleLocationUpdate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setEditData(prev => ({
            ...prev,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          }))
          setSuccess('Position mise à jour avec succès')
          setTimeout(() => setSuccess(''), 3000)
        },
        (error) => {
          setErrors(prev => ({
            ...prev,
            location: 'Impossible d\'obtenir votre position'
          }))
        }
      )
    }
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          photo: 'La taille du fichier ne doit pas dépasser 5MB'
        }))
        return
      }
      
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          photo: 'Veuillez télécharger une image valide'
        }))
        return
      }

      setEditData(prev => ({
        ...prev,
        photo: file
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!editData.firstName.trim()) newErrors.firstName = 'Le nom est requis'
    if (!editData.lastName.trim()) newErrors.lastName = 'Le prénom est requis'
    
    if (editData.email && !/\S+@\S+\.\S+/.test(editData.email)) {
      newErrors.email = 'L\'email n\'est pas valide'
    }

    if (!editData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    const token = getToken()
    if (!token) return

    setIsLoading(true)
    
    try {
      const response = await fetch(`${API_URL}/api/collecteurs/profil/infos`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nomComplet: `${editData.firstName} ${editData.lastName}`,
          telephone: editData.phone,
          zoneInterventionNom: editData.serviceArea,
          quartiersHabituels: editData.specializations,
          communesIntervention: []
        })
      })

      const result = await response.json()

      if (result.success) {
        setProfileData({ ...editData })
        setIsEditing(false)
        setSuccess('Profil mis à jour avec succès')
        loadProfileData() // Recharger les données
        setTimeout(() => setSuccess(''), 3000)
      } else {
        throw new Error(result.message || 'Erreur mise à jour')
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: error.message
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setEditData({ ...profileData })
    setIsEditing(false)
    setErrors({})
    setSuccess('')
  }

  const openInMaps = () => {
    const { latitude, longitude } = profileData.location
    window.open(`https://maps.google.com/?q=${latitude},${longitude}`, '_blank')
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
                <p className="text-xs text-gray-500">{userData.type_collecteur === 'independant' ? 'Indépendant' : 'Coopérative'}</p>
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
                  <a href="/collector/profile" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors bg-blue-50 text-blue-700 border-l-4 border-blue-600">
                    <User className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Mon profil</span>
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
              <p className="text-xs text-gray-500">{userData.type_collecteur === 'independant' ? 'Indépendant' : 'Coopérative'}</p>
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
                <a href="/collector/profile" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors bg-blue-50 text-blue-700 border-l-4 border-blue-600">
                  <User className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Mon profil</span>
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

  if (isLoading && !userData.nomComplet) {
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
              <p className="text-gray-600">Chargement de votre profil...</p>
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
              <User className="h-6 w-6 text-blue-600" />
              Mon Profil
            </h1>
            <p className="text-gray-600">Gérez vos informations personnelles</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-green-700">{success}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-700">{errors.submit}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Photo et Stats */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                {/* Photo */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    {userData.photo_profil_url ? (
                      <img
                        src={userData.photo_profil_url}
                        alt="Profile"
                        className="h-24 w-24 rounded-full object-cover border-4 border-blue-100"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                        <User className="h-12 w-12 text-white" />
                      </div>
                    )}
                    
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                        <Camera className="h-4 w-4 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  
                  <h2 className="mt-4 text-xl font-bold text-gray-900">
                    {userData.nomComplet}
                  </h2>
                  
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">{userData.rating}</span>
                    <span className="text-sm text-gray-500">({userData.totalMissions} missions)</span>
                  </div>
                  
                  {userData.statut === 'actif' && (
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">Vérifié</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="space-y-3 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Membre depuis</span>
                    <span className="text-sm font-medium text-gray-900">
                      {userData.cree_le ? new Date(userData.cree_le).toLocaleDateString('fr-FR', {
                        month: 'long',
                        year: 'numeric'
                      }) : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total missions</span>
                    <span className="text-sm font-medium text-gray-900">{userData.totalMissions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Points cumulés</span>
                    <span className="text-sm font-medium text-gray-900">{userData.points_total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Informations personnelles</h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                      Modifier
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        <X className="h-4 w-4" />
                        Annuler
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {isLoading ? '...' : <Save className="h-4 w-4" />}
                        Enregistrer
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <User className="h-4 w-4 text-blue-600" />
                      Nom
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={editData.firstName}
                        onChange={handleInputChange}
                        className={`w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 transition-all ${
                          errors.firstName ? 'ring-2 ring-red-500' : ''
                        }`}
                      />
                    ) : (
                      <p className="text-gray-900 py-3.5 px-4 bg-gray-50 rounded-xl">
                        {profileData.firstName}
                      </p>
                    )}
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <User className="h-4 w-4 text-blue-600" />
                      Prénom
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={editData.lastName}
                        onChange={handleInputChange}
                        className={`w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 transition-all ${
                          errors.lastName ? 'ring-2 ring-red-500' : ''
                        }`}
                      />
                    ) : (
                      <p className="text-gray-900 py-3.5 px-4 bg-gray-50 rounded-xl">
                        {profileData.lastName}
                      </p>
                    )}
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Mail className="h-4 w-4 text-blue-600" />
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleInputChange}
                        disabled
                        className={`w-full rounded-xl border-0 bg-gray-100 px-4 py-3.5 text-gray-500 ring-1 ring-inset ring-gray-200 cursor-not-allowed`}
                      />
                    ) : (
                      <p className="text-gray-900 py-3.5 px-4 bg-gray-50 rounded-xl">
                        {profileData.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Phone className="h-4 w-4 text-blue-600" />
                      Téléphone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={editData.phone}
                        onChange={handleInputChange}
                        className={`w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 transition-all ${
                          errors.phone ? 'ring-2 ring-red-500' : ''
                        }`}
                      />
                    ) : (
                      <p className="text-gray-900 py-3.5 px-4 bg-gray-50 rounded-xl">
                        {profileData.phone}
                      </p>
                    )}
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Building className="h-4 w-4 text-blue-600" />
                    Statut professionnel
                  </label>
                  {isEditing ? (
                    <select
                      name="businessStatus"
                      value={userData.type_collecteur}
                      disabled
                      className="w-full rounded-xl border-0 bg-gray-100 px-4 py-3.5 text-gray-500 ring-1 ring-inset ring-gray-200 cursor-not-allowed"
                    >
                      <option value="independant">Indépendant</option>
                      <option value="cooperative">Coopérative</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 py-3.5 px-4 bg-gray-50 rounded-xl">
                      {userData.type_collecteur === 'independant' ? 'Indépendant' : 'Coopérative'}
                    </p>
                  )}
                </div>

                <div className="mt-6 space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    Zone d'intervention
                  </label>
                  {isEditing ? (
                    <textarea
                      name="serviceArea"
                      value={editData.serviceArea}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 transition-all`}
                    />
                  ) : (
                    <p className="text-gray-900 py-3.5 px-4 bg-gray-50 rounded-xl">
                      {profileData.serviceArea || 'Non spécifiée'}
                    </p>
                  )}
                </div>

                <div className="mt-6 space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Navigation className="h-4 w-4 text-blue-600" />
                    Localisation GPS
                  </label>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">
                          Latitude: {profileData.location.latitude.toFixed(6)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Longitude: {profileData.location.longitude.toFixed(6)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isEditing && (
                          <button
                            onClick={handleLocationUpdate}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <Navigation className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={openInMaps}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <MapPin className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {errors.location && (
                    <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ProfileCollector