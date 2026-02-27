// ForgotPassword.js
import { useState } from 'react'
import { Mail, Phone, ArrowLeft, Send } from 'lucide-react'

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    contact: ''
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [serverMessage, setServerMessage] = useState({ type: '', text: '' })

  // Configuration API
  // const API_URL = 'https://ecobackendnadoi.vercel.app' // À ajuster selon votre environnement
   const API_URL = 'http://localhost:3000'
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    
    // Clear server message when user types
    if (serverMessage.text) {
      setServerMessage({ type: '', text: '' })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.contact.trim()) {
      newErrors.contact = 'L\'email ou le téléphone est requis'
    } else if (formData.contact.includes('@') && !/\S+@\S+\.\S+/.test(formData.contact)) {
      newErrors.contact = 'L\'email n\'est pas valide'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setServerMessage({ type: 'info', text: 'Envoi du code en cours...' })
    
    try {
      const response = await fetch(`${API_URL}/api/auth/demande-reinitialisation-mdp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.contact })
      })

      const data = await response.json()

      if (data.success) {
        setServerMessage({ type: 'success', text: data.message })
        
        // Stocker l'email pour la page de réinitialisation
        sessionStorage.setItem('reset_email', formData.contact)
        
        // Rediriger vers la page de saisie du code après 1.5 secondes
        setTimeout(() => {
          window.location.href = '/verify-code'
        }, 1500)
      } else {
        throw new Error(data.message || 'Erreur lors de la demande')
      }
      
    } catch (error) {
      console.error('❌ Erreur:', error)
      setServerMessage({ 
        type: 'error', 
        text: error.message || 'Une erreur est survenue. Veuillez réessayer.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isEmail = (contact) => contact.includes('@')

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Send className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Code envoyé !</h1>
            <p className="text-gray-600">
              Un code de réinitialisation a été envoyé à {formData.contact}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">Instructions :</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Vérifiez votre {isEmail(formData.contact) ? 'boîte de réception' : 'messages SMS'}</li>
                <li>• Le code est valide pendant 15 minutes</li>
                <li>• Si vous ne recevez rien, vérifiez vos spams</li>
              </ul>
            </div>

            <div className="space-y-3">
              <a
                href="/verify-code"
                className="block w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-center"
              >
                Saisir le code reçu
              </a>
              
              <button
                onClick={() => setIsSubmitted(false)}
                className="block w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Renvoyer le code
              </button>
            </div>

            <div className="text-center">
              <a href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                <ArrowLeft className="inline w-4 h-4 mr-1" />
                Retour à la connexion
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mot de passe oublié</h1>
          <p className="text-gray-600">
            Recevez un code pour réinitialiser votre mot de passe
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          {/* Contact Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email ou Téléphone <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              {isEmail(formData.contact) ? (
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              ) : (
                <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              )}
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.contact ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="votre@email.com"
              />
            </div>
            {errors.contact && (
              <p className="text-red-500 text-xs mt-1">{errors.contact}</p>
            )}
          </div>

          {/* Server Message */}
          {serverMessage.text && (
            <div className={`p-3 rounded-lg ${
              serverMessage.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' :
              serverMessage.type === 'error' ? 'bg-red-50 border border-red-200 text-red-600' :
              'bg-blue-50 border border-blue-200 text-blue-700'
            }`}>
              <p className="text-sm">{serverMessage.text}</p>
            </div>
          )}

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Recevoir le code
              </>
            )}
          </button>

          {/* Back to Login */}
          <div className="text-center">
            <a href="/login" className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Retour à la connexion
            </a>
          </div>
        </form>

        {/* Help Section */}
        <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-medium text-gray-900 mb-2">Besoin d'aide ?</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Assurez-vous que l'email est bien celui de votre compte</li>
            <li>• Le code arrivera dans les 2 minutes maximum</li>
            <li>• Contactez le support si vous ne recevez rien</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword