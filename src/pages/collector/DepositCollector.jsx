import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  MapPin, Camera, Upload, CheckCircle, AlertCircle, 
  Navigation, Clock, Package, DollarSign, ArrowRight,
  Search, Filter, Star, Phone, MessageSquare, Home,
  Truck, Check, X, Barcode, Scale, Shield
} from 'lucide-react'
import Layout from '../../components/Layout'

const DepositCollector = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedMission, setSelectedMission] = useState(location.state?.mission || null)
  const [depositPoint, setDepositPoint] = useState('')
  const [actualQuantity, setActualQuantity] = useState('')
  const [depositPhoto, setDepositPhoto] = useState(null)
  const [producerCode, setProducerCode] = useState('')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')

  const depositPoints = [
    { id: 'center1', name: 'Centre de traitement Douala', address: 'Bonanjo, Douala', capacity: '5000 kg', distance: '2.3 km' },
    { id: 'center2', name: 'Centre de tri Akwa', address: 'Akwa, Douala', capacity: '3000 kg', distance: '1.8 km' },
    { id: 'center3', name: 'Point de collecte Deido', address: 'Deido, Douala', capacity: '2000 kg', distance: '4.1 km' },
    { id: 'center4', name: 'Centre Bépanda', address: 'Bépanda, Douala', capacity: '2500 kg', distance: '3.2 km' }
  ]

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

      setDepositPhoto(file)
      setErrors(prev => ({ ...prev, photo: '' }))
    }
  }

  const handleLocationUpdate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Trouver le centre le plus proche
          const nearestCenter = depositPoints.reduce((nearest, center) => {
            // Calcul simple de distance (à remplacer par calcul réel)
            const distance = Math.random() * 10
            return distance < nearest.distance ? { ...center, distance } : nearest
          }, depositPoints[0])
          
          setDepositPoint(nearestCenter.id)
          setSuccess('Centre le plus proche détecté')
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

  const validateForm = () => {
    const newErrors = {}

    if (!depositPoint) newErrors.depositPoint = 'Veuillez sélectionner un point de dépôt'
    if (!actualQuantity.trim()) newErrors.actualQuantity = 'La quantité est requise'
    if (!depositPhoto) newErrors.photo = 'La photo de preuve est requise'
    if (!producerCode.trim()) newErrors.producerCode = 'Le code producteur est requis'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleDeposit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Dépôt effectué:', {
        mission: selectedMission,
        depositPoint,
        actualQuantity,
        producerCode,
        notes
      })
      
      setSuccess('Dépôt enregistré avec succès!')
      setTimeout(() => {
        navigate('/collector/missions')
      }, 2000)
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: 'Une erreur est survenue. Veuillez réessayer.'
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const openInMaps = (center) => {
    window.open(`https://maps.google.com/?q=${center.address}`, '_blank')
  }

  return (
    <Layout 
      pageTitle="Dépôt de déchets" 
      currentPage="deposit" 
      userRole="collector"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Mission Info */}
        {selectedMission && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Détails de la mission</h3>
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                <Truck className="h-4 w-4" />
                <span className="text-sm font-medium">Mission #{selectedMission?.id || 'N/A'}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <p className="text-blue-100 text-sm">Producteur</p>
                <p className="font-semibold text-lg">{selectedMission.producerName}</p>
              </div>
              <div className="space-y-2">
                <p className="text-blue-100 text-sm">Localisation</p>
                <p className="font-semibold text-lg">{selectedMission.location}</p>
              </div>
              <div className="space-y-2">
                <p className="text-blue-100 text-sm">Type déchets</p>
                <p className="font-semibold text-lg">{selectedMission.wasteType}</p>
              </div>
              <div className="space-y-2">
                <p className="text-blue-100 text-sm">Gain estimé</p>
                <p className="font-semibold text-lg text-green-300">{selectedMission.estimatedEarnings?.toLocaleString() || 0} FCFA</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Deposit Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Informations de dépôt</h3>
              <p className="text-gray-600">Complétez les informations pour enregistrer votre dépôt</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Deposit Point Selection */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  Point de dépôt <span className="text-red-500">*</span>
                </label>
                
                <div className="grid grid-cols-1 gap-3">
                  {depositPoints.map((point) => (
                    <div
                      key={point.id}
                      onClick={() => {
                        setDepositPoint(point.id)
                        setErrors(prev => ({ ...prev, depositPoint: '' }))
                      }}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        depositPoint === point.id
                          ? 'border-blue-600 bg-blue-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{point.name}</h4>
                        {depositPoint === point.id && (
                          <div className="p-2 bg-blue-600 rounded-full">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{point.address}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Package className="h-3 w-3" />
                          {point.capacity}
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Navigation className="h-3 w-3" />
                          {point.distance}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => openInMaps(point)}
                        className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                      >
                        <Navigation className="h-3 w-3" />
                        Voir sur la carte
                      </button>
                    </div>
                  ))}
                </div>
                
                <button
                  type="button"
                  onClick={handleLocationUpdate}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors font-medium"
                >
                  <Navigation className="h-4 w-4" />
                  Centre le plus proche
                </button>
              </div>
              {errors.depositPoint && (
                <p className="text-red-500 text-sm mt-1">{errors.depositPoint}</p>
              )}
            </div>
            
            {/* Right Column */}
            <div className="space-y-6">
              {/* Actual Quantity */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Scale className="h-4 w-4 text-blue-600" />
                  Quantité réelle <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={actualQuantity}
                    onChange={(e) => {
                      setActualQuantity(e.target.value)
                      setErrors(prev => ({ ...prev, actualQuantity: '' }))
                    }}
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 focus:border-blue-600 focus:bg-white transition-all text-lg font-semibold"
                    placeholder="0"
                  />
                  <span className="absolute right-4 top-3.5 text-gray-500 font-medium">kg</span>
                </div>
              </div>
              
              {/* Producer Code */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Barcode className="h-4 w-4 text-blue-600" />
                  Code producteur <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={producerCode}
                  onChange={(e) => {
                    setProducerCode(e.target.value)
                    setErrors(prev => ({ ...prev, producerCode: '' }))
                  }}
                  className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 focus:border-blue-600 focus:bg-white transition-all text-lg font-semibold"
                  placeholder="Code à 6 chiffres"
                />
                {errors.producerCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.producerCode}</p>
                )}
              </div>
              
              {/* Deposit Photo */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Camera className="h-4 w-4 text-blue-600" />
                  Photo de preuve <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="depositPhoto"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="depositPhoto"
                    className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                      errors.photo 
                        ? 'border-red-300 bg-red-50/50' 
                        : depositPhoto 
                          ? 'border-blue-300 bg-blue-50/30' 
                          : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    {depositPhoto ? (
                      <>
                        <div className="relative mb-4">
                          <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20" />
                          <div className="relative rounded-full bg-blue-100 p-4">
                            <CheckCircle className="h-8 w-8 text-blue-600" />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-blue-700 mb-2">Photo téléchargée</span>
                        <span className="text-xs text-blue-600">{depositPhoto.name}</span>
                      </>
                    ) : (
                      <>
                        <div className="rounded-full bg-gray-200 p-4 mb-4">
                          <Camera className="h-8 w-8 text-gray-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 mb-2">Photo du dépôt</span>
                        <span className="text-xs text-gray-500">PNG, JPG (max 5MB)</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
              {errors.photo && (
                <p className="text-red-500 text-sm mt-1">{errors.photo}</p>
              )}
            </div>
          </div>

          {/* Notes Section */}
          <div className="mt-8 space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Notes (optionnel)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 focus:border-blue-600 focus:bg-white transition-all"
              placeholder="Informations supplémentaires sur le dépôt..."
            />
          </div>

          {/* Summary Card */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
            <h4 className="font-bold text-blue-900 mb-4 text-lg">Récapitulatif du dépôt</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-3">
                <p className="text-sm text-blue-700 font-medium">Point de dépôt</p>
                <p className="text-sm font-bold text-blue-900">
                  {depositPoints.find(p => p.id === depositPoint)?.name || 'Non sélectionné'}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-sm text-blue-700 font-medium">Quantité</p>
                <p className="text-sm font-bold text-blue-900">{actualQuantity || 0} kg</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-sm text-blue-700 font-medium">Code producteur</p>
                <p className="text-sm font-bold text-blue-900">{producerCode || 'Non saisi'}</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-sm text-blue-700 font-medium">Photo</p>
                <p className="text-sm font-bold text-blue-900">
                  {depositPhoto ? 'Téléchargée ✓' : 'Non téléchargée'}
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              onClick={handleDeposit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
            >
              {isLoading ? (
                <>
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Traitement en cours...
                </>
              ) : (
                <>
                  <CheckCircle className="h-6 w-6" />
                  Confirmer le dépôt
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default DepositCollector
