import { useState } from 'react'
import { 
  User, MapPin, Mail, Phone, Lock, Camera, Upload, 
  Check, AlertCircle, ArrowRight, Truck, Users, Building,
  Leaf, Recycle, Shield, Fingerprint, Globe, Sparkles,
  ChevronRight, Eye, EyeOff, CheckCircle, XCircle
} from 'lucide-react'

const RegisterCollector = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessStatus: '',
    city: '',
    interventionZone: '',
    neighborhood: '',
    cniRecto: null,
    cniVerso: null,
    acceptTerms: false
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadProgress, setUploadProgress] = useState({ recto: 0, verso: 0 })

  const businessStatuses = [
    { id: 'independent', label: 'Indépendant', icon: User, color: 'blue', description: 'Travailleur autonome', capacity: '10-30 collectes/semaine' },
    { id: 'cooperative', label: 'Coopérative', icon: Users, color: 'indigo', description: 'Groupe organisé', capacity: '50+ collectes/semaine' }
  ]

  const steps = [
    { id: 1, label: 'Identité', icon: User },
    { id: 2, label: 'Zone', icon: MapPin },
    { id: 3, label: 'Documents', icon: Shield }
  ]

  const passwordRequirements = [
    { id: 'minLength', label: 'Au moins 6 caractères', regex: /.{6,}/ },
    { id: 'number', label: 'Au moins 1 chiffre', regex: /\d/ },
    { id: 'letter', label: 'Au moins 1 lettre', regex: /[a-zA-Z]/ }
  ]

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }))

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleLocationClick = () => {
    setLocationLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            interventionZone: `Lat: ${position.coords.latitude.toFixed(6)}, Lng: ${position.coords.longitude.toFixed(6)}`
          }))
          setLocationLoading(false)
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

  const handleFileUpload = (e, side) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          [`cni${side}`]: 'La taille du fichier ne doit pas dépasser 5MB'
        }))
        return
      }
      
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          [`cni${side}`]: 'Veuillez télécharger une image valide'
        }))
        return
      }

      setFormData(prev => ({
        ...prev,
        [`cni${side}`]: file
      }))

      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setUploadProgress(prev => ({ ...prev, [side.toLowerCase()]: progress }))
        if (progress >= 100) clearInterval(interval)
      }, 100)

      if (errors[`cni${side}`]) {
        setErrors(prev => ({
          ...prev,
          [`cni${side}`]: ''
        }))
      }
    }
  }

  const checkPasswordStrength = () => {
    const password = formData.password
    if (!password) return { strength: 0, label: 'Faible', color: 'red' }
    
    const checks = passwordRequirements.map(req => req.regex.test(password))
    const strength = checks.filter(Boolean).length
    
    if (strength === 0) return { strength: 0, label: 'Très faible', color: 'red' }
    if (strength === 1) return { strength: 1, label: 'Faible', color: 'orange' }
    if (strength === 2) return { strength: 2, label: 'Moyen', color: 'yellow' }
    return { strength: 3, label: 'Fort', color: 'green' }
  }

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'Le nom est requis'
      if (!formData.lastName.trim()) newErrors.lastName = 'Le prénom est requis'
      
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'L\'email n\'est pas valide'
      }

      if (!formData.password) newErrors.password = 'Le mot de passe est requis'
      else if (formData.password.length < 6) {
        newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères'
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
      }

      if (!formData.businessStatus) newErrors.businessStatus = 'Le statut professionnel est requis'
    }

    if (step === 2) {
      if (!formData.city.trim()) newErrors.city = 'La ville est requise'
      if (!formData.interventionZone.trim()) newErrors.interventionZone = 'La zone d\'intervention est requise'
      if (!formData.neighborhood.trim()) newErrors.neighborhood = 'Le quartier est requis'
    }

    if (step === 3) {
      if (!formData.cniRecto) newErrors.cniRecto = 'La photo recto de la CNI est requise'
      if (!formData.cniVerso) newErrors.cniVerso = 'La photo verso de la CNI est requise'
      if (!formData.acceptTerms) newErrors.acceptTerms = 'Vous devez accepter les conditions générales'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateStep(3)) return

    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Inscription collecteur réussie:', formData)
      window.location.href = '/collector/dashboard'
      
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: 'Une erreur est survenue. Veuillez réessayer.'
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const passwordStrength = checkPasswordStrength()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="relative inline-flex mb-6">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-75 blur-lg animate-pulse" />
            <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl">
              <Truck className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Devenez Collecteur Éco
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Rejoignez notre réseau de collecteurs et contribuez à un environnement plus propre
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex-1 relative">
                <div className="flex items-center">
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      currentStep >= step.id
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-110'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      <step.icon className="h-5 w-5" />
                    </div>
                    {currentStep > step.id && (
                      <div className="absolute -top-1 -right-1">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Étape {step.id}</p>
                    <p className="text-xs text-gray-500">{step.label}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`absolute top-5 left-10 right-0 h-0.5 transition-all ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          
          {/* Étape 1: Informations personnelles et statut */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Qui êtes-vous ?</h2>
                <p className="text-gray-600">Renseignez vos informations et votre statut professionnel</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <User className="h-4 w-4 text-blue-600" />
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 transition-all ${
                      errors.firstName ? 'ring-2 ring-red-500' : ''
                    }`}
                    placeholder="Votre nom"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <User className="h-4 w-4 text-blue-600" />
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 transition-all ${
                      errors.lastName ? 'ring-2 ring-red-500' : ''
                    }`}
                    placeholder="Votre prénom"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Mail className="h-4 w-4 text-blue-600" />
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border-0 bg-gray-50 pl-11 pr-4 py-3.5 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 transition-all ${
                        errors.email ? 'ring-2 ring-red-500' : ''
                      }`}
                      placeholder="vous@exemple.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Phone className="h-4 w-4 text-blue-600" />
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border-0 bg-gray-50 pl-11 pr-4 py-3.5 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 transition-all"
                      placeholder="+237 6XX XXX XXX"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Lock className="h-4 w-4 text-blue-600" />
                    Mot de passe <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border-0 bg-gray-50 pl-11 pr-12 py-3.5 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 transition-all ${
                        errors.password ? 'ring-2 ring-red-500' : ''
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`h-1.5 w-full rounded-full bg-gray-200 overflow-hidden`}>
                          <div 
                            className={`h-full rounded-full transition-all ${
                              passwordStrength.strength === 0 ? 'w-1/4 bg-red-500' :
                              passwordStrength.strength === 1 ? 'w-2/4 bg-orange-500' :
                              passwordStrength.strength === 2 ? 'w-3/4 bg-yellow-500' :
                              'w-full bg-green-500'
                            }`} 
                          />
                        </div>
                        <span className={`text-xs font-medium text-${passwordStrength.color}-600`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-1">
                        {passwordRequirements.map(req => {
                          const isValid = req.regex.test(formData.password)
                          return (
                            <div key={req.id} className="flex items-center gap-2 text-xs">
                              {isValid ? (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              ) : (
                                <XCircle className="h-3 w-3 text-gray-400" />
                              )}
                              <span className={isValid ? 'text-green-600' : 'text-gray-500'}>
                                {req.label}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Lock className="h-4 w-4 text-blue-600" />
                    Confirmer <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border-0 bg-gray-50 pl-11 pr-12 py-3.5 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 transition-all ${
                        errors.confirmPassword ? 'ring-2 ring-red-500' : ''
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Building className="h-4 w-4 text-blue-600" />
                  Informations métier <span className="text-red-500">*</span>
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {businessStatuses.map(status => {
                    const Icon = status.icon
                    const isSelected = formData.businessStatus === status.id
                    
                    return (
                      <button
                        key={status.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, businessStatus: status.id }))}
                        className={`group relative overflow-hidden rounded-xl p-4 transition-all ${
                          isSelected
                            ? 'bg-gradient-to-br from-blue-50 to-indigo-50 ring-2 ring-blue-600 shadow-lg scale-105'
                            : 'bg-gray-50 ring-1 ring-gray-200 hover:ring-blue-300 hover:shadow-md'
                        }`}
                      >
                        <div className="relative">
                          <div className={`mb-3 inline-flex rounded-lg p-2.5 ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'
                          }`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <h3 className="font-semibold text-gray-900">{status.label}</h3>
                          <p className="text-xs text-gray-600 mt-1">{status.description}</p>
                          <p className="text-xs text-blue-600 mt-2 font-medium">{status.capacity}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
                {errors.businessStatus && (
                  <p className="text-red-500 text-xs mt-1">{errors.businessStatus}</p>
                )}
              </div>
            </div>
          )}

          {/* Étape 2: Zone d'intervention */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Où intervenez-vous ?</h2>
                <p className="text-gray-600">Définissez votre zone d'intervention géographique</p>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Ville <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 transition-all ${
                        errors.city ? 'ring-2 ring-red-500' : ''
                      }`}
                    >
                      <option value="">Sélectionner une ville</option>
                      <option value="douala">Douala</option>
                      <option value="yaounde">Yaoundé</option>
                      <option value="bafoussam">Bafoussam</option>
                      <option value="buea">Buea</option>
                      <option value="limbe">Limbe</option>
                      <option value="kribi">Kribi</option>
                    </select>
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Quartier <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 transition-all ${
                        errors.neighborhood ? 'ring-2 ring-red-500' : ''
                      }`}
                      placeholder="Ex: Bonamoussadi, Ndogpassi..."
                    />
                    {errors.neighborhood && (
                      <p className="text-red-500 text-xs mt-1">{errors.neighborhood}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Zone d'intervention <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="interventionZone"
                    value={formData.interventionZone}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 transition-all ${
                      errors.interventionZone ? 'ring-2 ring-red-500' : ''
                    }`}
                    placeholder="Décrivez votre zone d'intervention (quartiers, arrondissements, rayon d'action...)"
                  />
                  {errors.interventionZone && (
                    <p className="text-red-500 text-xs mt-1">{errors.interventionZone}</p>
                  )}
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={handleLocationClick}
                    disabled={locationLoading}
                    className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white font-medium transition-all hover:shadow-xl disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                    <div className="relative flex items-center justify-center gap-3">
                      {locationLoading ? (
                        <>
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Recherche de votre position...</span>
                        </>
                      ) : (
                        <>
                          <Globe className="h-5 w-5" />
                          <span>📍 Utiliser ma position GPS</span>
                        </>
                      )}
                    </div>
                  </button>
                  {errors.location && (
                    <p className="text-red-500 text-xs mt-2">{errors.location}</p>
                  )}
                </div>

                <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-100 p-1.5">
                      <MapPin className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-900">Pourquoi votre zone d'intervention ?</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Elle nous permet de vous attribuer les collectes les plus proches et d'optimiser vos déplacements.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Étape 3: Documents (identique au producteur) */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Vérification d'identité</h2>
                <p className="text-gray-600">Pour la sécurité de tous, nous vérifions votre identité</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Recto CNI */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Recto CNI <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="cniRecto"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'Recto')}
                      className="hidden"
                    />
                    <label
                      htmlFor="cniRecto"
                      className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                        errors.cniRecto 
                          ? 'border-red-300 bg-red-50/50' 
                          : formData.cniRecto 
                            ? 'border-blue-300 bg-blue-50/50' 
                            : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/30'
                      }`}
                    >
                      {formData.cniRecto ? (
                        <>
                          <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20" />
                            <div className="relative rounded-full bg-blue-100 p-3 mb-3">
                              <Check className="h-8 w-8 text-blue-600" />
                            </div>
                          </div>
                          <span className="text-sm font-medium text-blue-700 mb-1">Fichier téléchargé</span>
                          <span className="text-xs text-blue-600">{formData.cniRecto.name}</span>
                          {uploadProgress.recto < 100 && (
                            <div className="w-full mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-600 transition-all duration-300"
                                style={{ width: `${uploadProgress.recto}%` }}
                              />
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="rounded-full bg-gray-100 p-3 mb-3">
                            <Camera className="h-8 w-8 text-gray-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-700 mb-1">Recto de la CNI</span>
                          <span className="text-xs text-gray-500">Cliquez pour télécharger</span>
                          <span className="text-xs text-gray-400 mt-2">PNG, JPG (max 5MB)</span>
                        </>
                      )}
                    </label>
                  </div>
                  {errors.cniRecto && (
                    <p className="text-red-500 text-xs mt-1">{errors.cniRecto}</p>
                  )}
                </div>

                {/* Verso CNI */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Verso CNI <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="cniVerso"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'Verso')}
                      className="hidden"
                    />
                    <label
                      htmlFor="cniVerso"
                      className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                        errors.cniVerso 
                          ? 'border-red-300 bg-red-50/50' 
                          : formData.cniVerso 
                            ? 'border-blue-300 bg-blue-50/50' 
                            : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/30'
                      }`}
                    >
                      {formData.cniVerso ? (
                        <>
                          <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20" />
                            <div className="relative rounded-full bg-blue-100 p-3 mb-3">
                              <Check className="h-8 w-8 text-blue-600" />
                            </div>
                          </div>
                          <span className="text-sm font-medium text-blue-700 mb-1">Fichier téléchargé</span>
                          <span className="text-xs text-blue-600">{formData.cniVerso.name}</span>
                          {uploadProgress.verso < 100 && (
                            <div className="w-full mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-600 transition-all duration-300"
                                style={{ width: `${uploadProgress.verso}%` }}
                              />
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="rounded-full bg-gray-100 p-3 mb-3">
                            <Camera className="h-8 w-8 text-gray-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-700 mb-1">Verso de la CNI</span>
                          <span className="text-xs text-gray-500">Cliquez pour télécharger</span>
                          <span className="text-xs text-gray-400 mt-2">PNG, JPG (max 5MB)</span>
                        </>
                      )}
                    </label>
                  </div>
                  {errors.cniVerso && (
                    <p className="text-red-500 text-xs mt-1">{errors.cniVerso}</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    className={`mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-600 ${
                      errors.acceptTerms ? 'border-red-500' : ''
                    }`}
                  />
                  <span className="text-sm text-gray-600">
                    J'accepte les{' '}
                    <a href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                      conditions générales
                    </a>
                    {' '}et la{' '}
                    <a href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                      politique de confidentialité
                    </a>
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="text-red-500 text-xs mt-1">{errors.acceptTerms}</p>
                )}
              </div>

              {errors.submit && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <p className="text-sm text-red-700">{errors.submit}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Précédent
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
              >
                Suivant
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Inscription...
                  </>
                ) : (
                  <>
                    S'inscrire
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterCollector
