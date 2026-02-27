import { useState } from 'react'
import { 
  User, MapPin, Mail, Phone, Lock, Camera, Edit2, Save, 
  LogOut, CheckCircle, AlertCircle, Trash2, FileText, 
  Upload, ChevronRight, Home, Building2, Store, 
  MapPinned, Leaf, Droplets, Recycle, Sparkles,
  Shield, Fingerprint, Users, Globe
} from 'lucide-react'
import Layout from '../components/Layout'

const Profile = () => {
  // Simulated user data (in real app, this would come from API/auth context)
  const [userData, setUserData] = useState({
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@email.com',
    phone: '+237 698 123 456',
    producerType: 'household',
    city: 'douala',
    collectionPoint: 'bonanjo',
    neighborhood: 'Bonamoussadi',
    address: '123 Rue Principale, Immeuble ABC',
    landmark: 'Près du marché central',
    cniFront: null,
    cniBack: null,
    selfieCni: null,
    password: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [isEditing, setIsEditing] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [activeTab, setActiveTab] = useState('personal')

  const producerTypes = [
    { id: 'household', label: 'Ménage', icon: Home, color: 'emerald', description: 'Particulier' },
    { id: 'commerce', label: 'Commerce', icon: Store, color: 'green', description: 'Petit commerce' },
    { id: 'enterprise', label: 'Entreprise', icon: Building2, color: 'teal', description: 'Structure professionnelle' }
  ]

  const tabs = [
    { id: 'personal', label: 'Informations', icon: User },
    { id: 'location', label: 'Localisation', icon: MapPin },
    { id: 'documents', label: 'Documents', icon: FileText }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserData(prev => ({
      ...prev,
      [name]: value
    }))

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    
    if (successMessage) {
      setSuccessMessage('')
    }
  }

  const handleLocationClick = () => {
    setLocationLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserData(prev => ({
            ...prev,
            neighborhood: `GPS: ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          }))
          setLocationLoading(false)
          setSuccessMessage('📍 Localisation mise à jour avec succès !')
        },
        (error) => {
          setErrors(prev => ({
            ...prev,
            location: 'Impossible d\'obtenir votre position. Veuillez saisir manuellement.'
          }))
          setLocationLoading(false)
        }
      )
    } else {
      setErrors(prev => ({
        ...prev,
        location: 'La géolocalisation n\'est pas supportée par votre navigateur.'
      }))
      setLocationLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!userData.firstName.trim()) newErrors.firstName = 'Le nom est requis'
    if (!userData.lastName.trim()) newErrors.lastName = 'Le prénom est requis'
    
    if (!userData.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = 'L\'email n\'est pas valide'
    }

    if (!userData.phone.trim()) newErrors.phone = 'Le téléphone est requis'
    if (!userData.city.trim()) newErrors.city = 'La ville est requise'
    if (!userData.collectionPoint.trim()) newErrors.collectionPoint = 'Le point de collecte est requis'
    if (!userData.neighborhood.trim()) newErrors.neighborhood = 'Le quartier est requis'

    if (showPasswordFields) {
      if (userData.password && userData.password.length < 6) {
        newErrors.password = 'Le mot de passe actuel doit contenir au moins 6 caractères'
      }
      
      if (userData.newPassword && userData.newPassword.length < 6) {
        newErrors.newPassword = 'Le nouveau mot de passe doit contenir au moins 6 caractères'
      }

      if (userData.newPassword && userData.newPassword !== userData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Profil mis à jour:', userData)
      setSuccessMessage('✨ Informations enregistrées avec succès !')
      setIsEditing(false)
      setShowPasswordFields(false)
      
      setUserData(prev => ({
        ...prev,
        password: '',
        newPassword: '',
        confirmPassword: ''
      }))
      
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: 'Une erreur est survenue. Veuillez réessayer.'
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setShowPasswordFields(false)
    setErrors({})
    setSuccessMessage('')
    setUserData(prev => ({
      ...prev,
      password: '',
      newPassword: '',
      confirmPassword: ''
    }))
  }

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

  // Statistiques écologiques simulées
  const ecoStats = [
    { label: 'Déchets collectés', value: '234 kg', icon: Recycle, color: 'emerald' },
    { label: 'CO₂ évité', value: '128 kg', icon: Leaf, color: 'green' },
    { label: 'Points verts', value: '1,250', icon: Sparkles, color: 'teal' }
  ]

  return (
    <Layout 
      pageTitle="Mon Profil Écologique" 
      currentPage="profile"
      notifications={[]}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section avec stats écologiques */}
        <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 p-8 text-white">
          {/* Éléments décoratifs */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-300 blur-3xl" />
          </div>
          
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-yellow-300 to-green-300 opacity-75 blur animate-pulse" />
                <div className="relative h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/50">
                  <User className="h-10 w-10 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                  {userData.firstName} {userData.lastName}
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                    <Leaf className="h-4 w-4" />
                    Éco-producteur
                  </span>
                </h1>
                <p className="text-white/90 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {userData.email}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="group flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-green-600 transition-all hover:bg-green-50 hover:shadow-lg"
                >
                  <Edit2 className="h-4 w-4 transition-transform group-hover:rotate-12" />
                  <span className="font-medium">Modifier le profil</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="rounded-xl bg-white/20 px-6 py-3 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/30"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="group flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-green-600 transition-all hover:bg-green-50 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                        <span>Enregistrement...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 transition-transform group-hover:scale-110" />
                        <span className="font-medium">Enregistrer</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stats écologiques */}
          <div className="relative mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ecoStats.map((stat, index) => (
              <div
                key={index}
                className="rounded-xl bg-white/10 backdrop-blur-sm p-4 transition-transform hover:scale-105"
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg bg-${stat.color}-500/30 p-2`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages de succès/erreur */}
        {successMessage && (
          <div className="mb-6 animate-slideDown rounded-xl bg-emerald-50 border border-emerald-200 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-100 p-1">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="text-emerald-800 font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 animate-slideDown rounded-xl bg-red-50 border border-red-200 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-1">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-red-800 font-medium">{errors.submit}</p>
            </div>
          </div>
        )}

        {/* Navigation par onglets */}
        <div className="mb-6 flex gap-2 border-b border-gray-200 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-green-50 text-green-700 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50/50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* Onglet Informations personnelles */}
          {activeTab === 'personal' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="rounded-lg bg-green-100 p-2">
                    <User className="h-5 w-5 text-green-600" />
                  </div>
                  Informations personnelles
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={userData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-green-600 ${
                        errors.firstName ? 'ring-2 ring-red-500' : ''
                      } ${!isEditing ? 'opacity-75 cursor-not-allowed' : ''}`}
                      placeholder="Votre nom"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Prénom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={userData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-green-600 ${
                        errors.lastName ? 'ring-2 ring-red-500' : ''
                      } ${!isEditing ? 'opacity-75 cursor-not-allowed' : ''}`}
                      placeholder="Votre prénom"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full rounded-xl border-0 bg-gray-50 pl-10 pr-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-green-600 ${
                          errors.email ? 'ring-2 ring-red-500' : ''
                        } ${!isEditing ? 'opacity-75 cursor-not-allowed' : ''}`}
                        placeholder="votre@email.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Téléphone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={userData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full rounded-xl border-0 bg-gray-50 pl-10 pr-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-green-600 ${
                          errors.phone ? 'ring-2 ring-red-500' : ''
                        } ${!isEditing ? 'opacity-75 cursor-not-allowed' : ''}`}
                        placeholder="+237 XX XX XX XX"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="rounded-lg bg-green-100 p-2">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  Type de producteur
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {producerTypes.map(type => {
                    const Icon = type.icon
                    const isSelected = userData.producerType === type.id
                    
                    return (
                      <button
                        key={type.id}
                        type="button"
                        disabled={!isEditing}
                        onClick={() => isEditing && setUserData(prev => ({ ...prev, producerType: type.id }))}
                        className={`group relative overflow-hidden rounded-xl p-4 transition-all ${
                          isSelected
                            ? 'bg-gradient-to-br from-green-50 to-emerald-50 ring-2 ring-green-600'
                            : 'bg-gray-50 ring-1 ring-gray-200 hover:ring-green-300'
                        } ${!isEditing ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className={`absolute inset-0 opacity-0 transition-opacity group-hover:opacity-10 ${
                          isSelected ? 'bg-green-600' : 'bg-green-600'
                        }`} />
                        <div className="relative">
                          <div className={`mb-3 inline-flex rounded-lg p-3 ${
                            isSelected ? 'bg-green-600 text-white' : 'bg-white text-green-600'
                          }`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <h3 className="font-semibold text-gray-900">{type.label}</h3>
                          <p className="text-sm text-gray-600">{type.description}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Section mot de passe */}
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <div className="rounded-lg bg-green-100 p-2">
                      <Lock className="h-5 w-5 text-green-600" />
                    </div>
                    Sécurité
                  </h2>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => setShowPasswordFields(!showPasswordFields)}
                      className="text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      {showPasswordFields ? 'Annuler' : 'Changer le mot de passe'}
                    </button>
                  )}
                </div>

                {showPasswordFields && (
                  <div className="space-y-4 animate-slideDown">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Mot de passe actuel
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={userData.password}
                        onChange={handleInputChange}
                        className={`w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-green-600 ${
                          errors.password ? 'ring-2 ring-red-500' : ''
                        }`}
                        placeholder="••••••••"
                      />
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={userData.newPassword}
                        onChange={handleInputChange}
                        className={`w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-green-600 ${
                          errors.newPassword ? 'ring-2 ring-red-500' : ''
                        }`}
                        placeholder="••••••••"
                      />
                      {errors.newPassword && (
                        <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Confirmer le mot de passe
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={userData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-green-600 ${
                          errors.confirmPassword ? 'ring-2 ring-red-500' : ''
                        }`}
                        placeholder="••••••••"
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Onglet Localisation */}
          {activeTab === 'location' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="rounded-lg bg-green-100 p-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  Adresse de collecte
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Ville <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="city"
                      value={userData.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-green-600 ${
                        errors.city ? 'ring-2 ring-red-500' : ''
                      } ${!isEditing ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                      <option value="">Sélectionner une ville</option>
                      <option value="douala">Douala</option>
                      <option value="yaounde">Yaoundé</option>
                      <option value="bafoussam">Bafoussam</option>
                      <option value="buea">Buea</option>
                      <option value="limbe">Limbe</option>
                    </select>
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Point de collecte <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="collectionPoint"
                      value={userData.collectionPoint}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-green-600 ${
                        errors.collectionPoint ? 'ring-2 ring-red-500' : ''
                      } ${!isEditing ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                      <option value="">Sélectionner un point</option>
                      <option value="bonanjo">Bonanjo (Centre-ville)</option>
                      <option value="akwa">Akwa</option>
                      <option value="deido">Deido</option>
                      <option value="bepanda">Bépanda</option>
                      <option value="makepe">Makepe</option>
                    </select>
                    {errors.collectionPoint && (
                      <p className="text-red-500 text-xs mt-1">{errors.collectionPoint}</p>
                    )}
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Quartier <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <MapPinned className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="neighborhood"
                          value={userData.neighborhood}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full rounded-xl border-0 bg-gray-50 pl-10 pr-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-green-600 ${
                            errors.neighborhood ? 'ring-2 ring-red-500' : ''
                          } ${!isEditing ? 'opacity-75 cursor-not-allowed' : ''}`}
                          placeholder="Votre quartier"
                        />
                      </div>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={handleLocationClick}
                          disabled={locationLoading}
                          className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-white transition-all hover:bg-green-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Globe className={`h-5 w-5 ${locationLoading ? 'animate-spin' : ''}`} />
                          <span className="font-medium">GPS</span>
                        </button>
                      )}
                    </div>
                    {errors.neighborhood && (
                      <p className="text-red-500 text-xs mt-1">{errors.neighborhood}</p>
                    )}
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Adresse complète <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={userData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={3}
                      className={`w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-green-600 ${
                        errors.address ? 'ring-2 ring-red-500' : ''
                      } ${!isEditing ? 'opacity-75 cursor-not-allowed' : ''}`}
                      placeholder="Numéro, rue, lotissement, immeuble..."
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Point de repère (optionnel)
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={userData.landmark}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-green-600 ${
                        errors.landmark ? 'ring-2 ring-red-500' : ''
                      } ${!isEditing ? 'opacity-75 cursor-not-allowed' : ''}`}
                      placeholder="Ex: À côté du marché, près de l'église..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Documents */}
          {activeTab === 'documents' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="rounded-lg bg-green-100 p-2">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  Documents d'identité
                </h2>
                
                <div className="space-y-6">
                  {[
                    { id: 'cniFront', label: 'Recto de la CNI', required: true },
                    { id: 'cniBack', label: 'Verso de la CNI', required: true },
                    { id: 'selfieCni', label: 'Selfie avec CNI', required: true }
                  ].map((doc) => (
                    <div key={doc.id} className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        {doc.label} {doc.required && <span className="text-red-500">*</span>}
                      </label>
                      <div
                        className={`group relative rounded-xl border-2 border-dashed p-6 transition-all ${
                          userData[doc.id]
                            ? 'border-green-300 bg-green-50/50'
                            : 'border-gray-300 hover:border-green-400 hover:bg-green-50/30'
                        }`}
                      >
                        {userData[doc.id] ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="rounded-lg bg-white p-3 shadow-sm">
                                <FileText className="h-6 w-6 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{doc.label}.jpg</p>
                                <p className="text-sm text-gray-600">Téléchargé avec succès</p>
                              </div>
                            </div>
                            {isEditing && (
                              <button
                                type="button"
                                onClick={() => setUserData(prev => ({ ...prev, [doc.id]: null }))}
                                className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="text-center">
                            <Upload className="mx-auto h-10 w-10 text-gray-400 group-hover:text-green-600 transition-colors" />
                            <p className="mt-2 text-sm text-gray-600">
                              {isEditing ? (
                                <>
                                  <span className="font-medium text-green-600">Cliquez</span> pour uploader ou glissez-déposez
                                </>
                              ) : (
                                'Aucun fichier téléchargé'
                              )}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              JPG, PNG ou PDF (max 5MB)
                            </p>
                            {isEditing && (
                              <button
                                type="button"
                                className="mt-4 rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-green-700 hover:shadow-lg"
                              >
                                Choisir un fichier
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      {errors[doc.id] && (
                        <p className="text-red-500 text-xs mt-1">{errors[doc.id]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Bouton de déconnexion */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleLogout}
            className="group flex items-center gap-2 rounded-xl border border-red-200 bg-white px-6 py-3 text-red-600 transition-all hover:border-red-300 hover:bg-red-50 hover:shadow-lg"
          >
            <LogOut className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            <span className="font-medium">Se déconnecter</span>
          </button>
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
      </div>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </Layout>
  )
}

export default Profile