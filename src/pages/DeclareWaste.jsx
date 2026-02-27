import { useState } from 'react'
import { 
  Trash2, Package, Scale, Home, MapPin, Clock, CheckCircle, 
  AlertCircle, Plus, Minus, ArrowRight, Leaf, Recycle, 
  Droplets, Battery, Cpu, Box, Truck, Calendar, Bell,
  Shield, Sparkles, ChevronRight, Info
} from 'lucide-react'
import Layout from '../components/Layout'

const DeclareWaste = () => {
  const [formData, setFormData] = useState({
    wasteTypes: [],
    quantity: '',
    quantityUnit: 'kg',
    collectionMode: 'home',
    specialInstructions: '',
    preferredDate: '',
    preferredTime: '',
    photos: []
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [declarationId, setDeclarationId] = useState('')
  const [estimatedPoints, setEstimatedPoints] = useState(0)

  const wasteTypes = [
    { 
      id: 'plastic', 
      label: 'Plastique', 
      icon: Recycle,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      points: 2,
      examples: ['Bouteilles', 'Sacs', 'Emballages']
    },
    { 
      id: 'paper', 
      label: 'Papier / Carton', 
      icon: Box,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200',
      points: 1,
      examples: ['Journaux', 'Cartons', 'Papier bureau']
    },
    { 
      id: 'metal', 
      label: 'Métal', 
      icon: Package,
      color: 'gray',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-200',
      points: 5,
      examples: ['Canettes', 'Ferraille', 'Objets métalliques']
    },
    { 
      id: 'glass', 
      label: 'Verre', 
      icon: Droplets,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      points: 3,
      examples: ['Bouteilles', 'Pots', 'Verre plat']
    },
    { 
      id: 'organic', 
      label: 'Organique', 
      icon: Leaf,
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-200',
      points: 4,
      examples: ['Restes alimentaires', 'Déchets jardin']
    },
    { 
      id: 'electronic', 
      label: 'Électronique', 
      icon: Cpu,
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
      points: 10,
      examples: ['Appareils', 'Batteries', 'Câbles']
    }
  ]

  const quantityUnits = [
    { id: 'kg', label: 'Kilogrammes', icon: Scale, short: 'kg' },
    { id: 'bags', label: 'Sacs', icon: Package, short: 'sac' },
    { id: 'units', label: 'Unités', icon: Box, short: 'unité' }
  ]

  const collectionModes = [
    { 
      id: 'home', 
      label: 'Collecte à domicile', 
      icon: Home,
      description: 'Le collecteur passe chez vous',
      time: 'Sous 24-48h',
      badge: 'Recommandé'
    },
    { 
      id: 'deposit', 
      label: 'Dépôt volontaire', 
      icon: MapPin,
      description: 'Vous déposez au point de collecte',
      time: 'Immédiat',
      badge: '+20% points'
    }
  ]

  const timeSlots = [
    '08:00 - 10:00',
    '10:00 - 12:00',
    '14:00 - 16:00',
    '16:00 - 18:00'
  ]

  // Calculer les points estimés
  const calculatePoints = () => {
    if (!formData.wasteTypes.length || !formData.quantity) return 0
    
    const basePoints = formData.wasteTypes.reduce((total, typeId) => {
      const wasteType = wasteTypes.find(w => w.id === typeId)
      return total + (wasteType?.points || 0)
    }, 0)

    const quantity = parseFloat(formData.quantity) || 0
    const multiplier = formData.collectionMode === 'deposit' ? 1.2 : 1
    
    return Math.round(basePoints * quantity * multiplier)
  }

  // Mettre à jour les points quand les données changent
  useState(() => {
    setEstimatedPoints(calculatePoints())
  }, [formData.wasteTypes, formData.quantity, formData.collectionMode])

  const handleWasteTypeToggle = (wasteTypeId) => {
    setFormData(prev => ({
      ...prev,
      wasteTypes: prev.wasteTypes.includes(wasteTypeId)
        ? prev.wasteTypes.filter(id => id !== wasteTypeId)
        : [...prev.wasteTypes, wasteTypeId]
    }))

    if (errors.wasteTypes && formData.wasteTypes.length > 0) {
      setErrors(prev => ({ ...prev, wasteTypes: '' }))
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
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

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files)
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...files]
    }))
  }

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (formData.wasteTypes.length === 0) {
      newErrors.wasteTypes = 'Veuillez sélectionner au moins un type de déchet'
    }

    if (!formData.quantity.trim() || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'La quantité doit être supérieure à 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const id = `DEC-${Date.now().toString().slice(-6)}`
      setDeclarationId(id)
      
      console.log('Déclaration créée:', { ...formData, id })
      setIsSubmitted(true)
      
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: 'Une erreur est survenue. Veuillez réessayer.'
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewDeclaration = () => {
    setFormData({
      wasteTypes: [],
      quantity: '',
      quantityUnit: 'kg',
      collectionMode: 'home',
      specialInstructions: '',
      preferredDate: '',
      preferredTime: '',
      photos: []
    })
    setIsSubmitted(false)
    setDeclarationId('')
    setErrors({})
  }

  if (isSubmitted) {
    return (
      <Layout pageTitle="Déclaration réussie" currentPage="declare">
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-12 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Animation de succès */}
            <div className="text-center mb-8 animate-fadeIn">
              <div className="relative inline-flex mb-6">
                <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
                <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-xl">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Déclaration enregistrée ! ✨
              </h1>
              <p className="text-gray-600 text-lg">
                Votre déclaration a été soumise avec succès
              </p>
            </div>

            {/* Carte récapitulative */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 mb-6 animate-slideUp">
              {/* En-tête avec ID */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Numéro de déclaration</p>
                  <p className="text-2xl font-mono font-bold text-gray-900">{declarationId}</p>
                </div>
                <div className="bg-green-100 rounded-full px-4 py-2">
                  <span className="text-sm font-medium text-green-700">En attente</span>
                </div>
              </div>

              {/* Points verts gagnés */}
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-700 mb-1">Points verts estimés</p>
                    <p className="text-3xl font-bold text-emerald-600">+{estimatedPoints}</p>
                  </div>
                  <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-emerald-600" />
                  </div>
                </div>
              </div>

              {/* Détails de la déclaration */}
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Package className="h-4 w-4 text-green-600" />
                  Récapitulatif
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Types de déchets</p>
                    <div className="flex flex-wrap gap-1">
                      {formData.wasteTypes.map(id => {
                        const waste = wasteTypes.find(w => w.id === id)
                        const Icon = waste?.icon
                        return (
                          <div key={id} className={`${waste?.bgColor} rounded-full px-2 py-1 flex items-center gap-1`}>
                            <Icon className={`h-3 w-3 ${waste?.textColor}`} />
                            <span className={`text-xs ${waste?.textColor}`}>{waste?.label}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Quantité</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formData.quantity} {quantityUnits.find(u => u.id === formData.quantityUnit)?.short}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Mode de collecte</p>
                    <p className="font-medium text-gray-900">
                      {collectionModes.find(m => m.id === formData.collectionMode)?.label}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Statut</p>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-amber-500" />
                      <span className="font-medium text-amber-600">En attente</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prochaines étapes */}
              <div className="bg-blue-50 rounded-xl p-5 mb-6">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-blue-100 p-2">
                    <Bell className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Prochaines étapes</h4>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                        Un collecteur sera affecté dans les plus brefs délais
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                        Vous recevrez une notification avec les détails
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                                Suivez le statut en temps réel dans votre tableau de bord
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-3">
                        <a
                          href="/dashboard"
                          className="group block w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all hover:scale-[1.02] text-center"
                        >
                          Voir mon tableau de bord
                        </a>
                        
                        <button
                          onClick={handleNewDeclaration}
                          className="group block w-full py-4 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                        >
                          <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                          Nouvelle déclaration
                        </button>
                      </div>
                    </div>

                    {/* Support */}
                    <div className="text-center">
                      <p className="text-sm text-gray-500">
                        Besoin d'aide ?{' '}
                        <a href="/support" className="text-emerald-600 font-medium hover:underline">
                          Contacter le support
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
      </Layout>
    )
  }

  return (
    <Layout 
      pageTitle="Déclarer mes déchets" 
      currentPage="declare"
      notifications={[]}
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header avec stats */}
        <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 p-8 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-300 blur-3xl" />
          </div>
          
          <div className="relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Recycle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Déclarer mes déchets</h1>
                <p className="text-white/90">Contribuez à un environnement plus propre et gagnez des points</p>
              </div>
            </div>

            {/* Points estimés en direct */}
            {formData.wasteTypes.length > 0 && formData.quantity && (
              <div className="inline-flex items-center gap-3 rounded-full bg-white/20 backdrop-blur-sm px-6 py-3">
                <Sparkles className="h-5 w-5 text-yellow-300" />
                <span className="font-medium">Points estimés :</span>
                <span className="text-2xl font-bold">{estimatedPoints}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire principal */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Types de déchets */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="rounded-lg bg-green-100 p-2">
                    <Trash2 className="h-5 w-5 text-green-600" />
                  </div>
                  Types de déchets <span className="text-red-500">*</span>
                </h2>
                
                <p className="text-sm text-gray-600 mb-4">
                  Sélectionnez tous les types de déchets que vous souhaitez faire collecter
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {wasteTypes.map(wasteType => {
                    const Icon = wasteType.icon
                    const isSelected = formData.wasteTypes.includes(wasteType.id)
                    
                    return (
                      <button
                        key={wasteType.id}
                        type="button"
                        onClick={() => handleWasteTypeToggle(wasteType.id)}
                        className={`group relative overflow-hidden rounded-xl p-4 transition-all ${
                          isSelected
                            ? `${wasteType.bgColor} ${wasteType.borderColor} border-2 scale-[1.02] shadow-md`
                            : 'bg-gray-50 border-2 border-transparent hover:border-gray-200 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`rounded-lg p-2.5 ${
                            isSelected ? wasteType.bgColor : 'bg-white'
                          }`}>
                            <Icon className={`h-5 w-5 ${wasteType.textColor}`} />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-gray-900">{wasteType.label}</h3>
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                isSelected ? 'bg-white' : 'bg-gray-200'
                              }`}>
                                {wasteType.points} pts/kg
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              {wasteType.examples.join(' • ')}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
                {errors.wasteTypes && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.wasteTypes}
                  </p>
                )}
              </div>

              {/* Quantité et unité */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="rounded-lg bg-green-100 p-2">
                    <Scale className="h-5 w-5 text-green-600" />
                  </div>
                  Quantité estimée <span className="text-red-500">*</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantité
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        min="0.1"
                        step="0.1"
                        className={`w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-green-600 transition-all ${
                          errors.quantity ? 'ring-2 ring-red-500' : ''
                        }`}
                        placeholder="0.0"
                      />
                    </div>
                    {errors.quantity && (
                      <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unité
                    </label>
                    <select
                      name="quantityUnit"
                      value={formData.quantityUnit}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-green-600 transition-all"
                    >
                      {quantityUnits.map(unit => {
                        const Icon = unit.icon
                        return (
                          <option key={unit.id} value={unit.id}>
                            {unit.label}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-amber-600 mt-0.5" />
                    <p className="text-xs text-amber-800">
                      <span className="font-medium">Conseil :</span> Soyez le plus précis possible pour faciliter l'organisation de la collecte
                    </p>
                  </div>
                </div>
              </div>

              {/* Mode de collecte */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="rounded-lg bg-green-100 p-2">
                    <Truck className="h-5 w-5 text-green-600" />
                  </div>
                  Mode de collecte <span className="text-red-500">*</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {collectionModes.map(mode => {
                    const Icon = mode.icon
                    const isSelected = formData.collectionMode === mode.id
                    
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, collectionMode: mode.id }))}
                        className={`relative overflow-hidden rounded-xl p-5 transition-all ${
                          isSelected
                            ? 'bg-gradient-to-br from-green-50 to-emerald-50 ring-2 ring-green-600 shadow-lg'
                            : 'bg-gray-50 ring-1 ring-gray-200 hover:ring-green-300 hover:shadow-md'
                        }`}
                      >
                        {mode.badge && (
                          <span className="absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded-full bg-green-600 text-white">
                            {mode.badge}
                          </span>
                        )}
                        <div className="flex items-start gap-3">
                          <div className={`rounded-lg p-3 ${
                            isSelected ? 'bg-green-600 text-white' : 'bg-white text-green-600'
                          }`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-semibold text-gray-900">{mode.label}</h3>
                            <p className="text-sm text-gray-600 mt-1">{mode.description}</p>
                            <p className="text-xs text-green-600 mt-2">{mode.time}</p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Options avancées */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="rounded-lg bg-green-100 p-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  Options avancées (optionnel)
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date préférée
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-green-600 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Créneau horaire
                      </label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-green-600 transition-all"
                      >
                        <option value="">Sélectionner un créneau</option>
                        {timeSlots.map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instructions spéciales
                    </label>
                    <textarea
                      name="specialInstructions"
                      value={formData.specialInstructions}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-green-600 transition-all"
                      placeholder="Informations complémentaires pour le collecteur..."
                    />
                  </div>

                  {/* Upload photos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Photos (optionnel)
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {formData.photos.map((photo, index) => (
                        <div key={index} className="relative">
                          <div className="h-20 w-20 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                            <img
                              src={URL.createObjectURL(photo)}
                              alt={`Photo ${index + 1}`}
                              className="h-full w-full object-cover rounded-lg"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white p-1 hover:bg-red-600 transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      <label className="h-20 w-20 rounded-lg border-2 border-dashed border-gray-300 hover:border-green-500 transition-colors flex flex-col items-center justify-center cursor-pointer bg-gray-50">
                        <Plus className="h-6 w-6 text-gray-400" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          multiple
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Ajoutez des photos pour aider le collecteur à identifier les déchets
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <p className="text-sm text-red-800">{errors.submit}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
              >
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Traitement en cours...</span>
                  </>
                ) : (
                  <>
                    <span>Déclarer mes déchets</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Sidebar d'information */}
          <div className="space-y-6">
            {/* Carte des avantages */}
            <div className="bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-300" />
                Programme de fidélité
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Points par kg de plastique</span>
                  <span className="font-bold">2 pts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Points par kg de métal</span>
                  <span className="font-bold">5 pts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Points par kg d'électronique</span>
                  <span className="font-bold">10 pts</span>
                </div>
                <div className="pt-4 border-t border-white/20">
                  <div className="flex items-center justify-between">
                    <span>Bonus dépôt volontaire</span>
                    <span className="font-bold text-yellow-300">+20%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations utiles */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">À savoir</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-blue-100 p-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Délai de traitement</p>
                    <p className="text-xs text-gray-600">24-48h maximum</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-green-100 p-2">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Collecteurs certifiés</p>
                    <p className="text-xs text-gray-600">Tous nos partenaires sont vérifiés</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-purple-100 p-2">
                    <Bell className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Notifications en temps réel</p>
                    <p className="text-xs text-gray-600">Suivez l'avancement de votre déclaration</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Badge d'engagement */}
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
              <div className="flex items-center gap-3 mb-3">
                <Leaf className="h-6 w-6 text-emerald-600" />
                <h3 className="font-semibold text-emerald-900">Impact environnemental</h3>
              </div>
              <p className="text-sm text-emerald-800">
                Chaque déclaration contribue à réduire l'empreinte carbone et à promouvoir l'économie circulaire.
              </p>
              {formData.wasteTypes.length > 0 && formData.quantity && (
                <div className="mt-4 pt-4 border-t border-emerald-200">
                  <p className="text-xs text-emerald-700">
                    🌱 Cette déclaration pourrait éviter l'émission de{' '}
                    <span className="font-bold">{(parseFloat(formData.quantity) * 2.5).toFixed(1)} kg</span> de CO₂
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
      `}</style>
    </Layout>
  )
}

export default DeclareWaste