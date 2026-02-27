// VerifyCode.js
import { useState, useEffect } from 'react'
import { Key, ArrowLeft, CheckCircle } from 'lucide-react'

const VerifyCode = () => {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [serverMessage, setServerMessage] = useState({ type: '', text: '' })
  const [email, setEmail] = useState('')

  // Configuration API
  const API_URL = 'http://localhost:3000'

  useEffect(() => {
    // Récupérer l'email stocké
    const storedEmail = sessionStorage.getItem('reset_email')
    if (storedEmail) {
      setEmail(storedEmail)
    } else {
      // Rediriger si pas d'email
      window.location.href = '/forgot-password'
    }
  }, [])

  const handleCodeChange = (index, value) => {
    if (value.length > 1) {
      // Si collé, répartir sur les champs
      const digits = value.replace(/\D/g, '').split('')
      const newCode = [...code]
      digits.forEach((digit, i) => {
        if (index + i < 6) newCode[index + i] = digit
      })
      setCode(newCode)
      
      // Focus sur le dernier champ rempli
      const nextIndex = Math.min(index + digits.length, 5)
      document.getElementById(`code-${nextIndex}`)?.focus()
    } else {
      // Si un seul chiffre
      const newCode = [...code]
      newCode[index] = value.replace(/\D/g, '')
      setCode(newCode)

      // Auto-focus sur le champ suivant
      if (value && index < 5) {
        document.getElementById(`code-${index + 1}`)?.focus()
      }
    }

    // Clear errors
    if (errors.code) {
      setErrors({})
    }
    if (serverMessage.text) {
      setServerMessage({ type: '', text: '' })
    }
  }

  const handleKeyDown = (index, e) => {
    // Backspace pour revenir au champ précédent
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '')
    if (pastedData.length >= 6) {
      const digits = pastedData.slice(0, 6).split('')
      setCode(digits)
      document.getElementById('code-5')?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const fullCode = code.join('')
    
    if (fullCode.length !== 6) {
      setErrors({ code: 'Veuillez entrer les 6 chiffres du code' })
      return
    }

    setIsLoading(true)
    setServerMessage({ type: 'info', text: 'Vérification du code...' })

    try {
      const response = await fetch(`${API_URL}/api/auth/verifier-code-reinitialisation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email,
          code: fullCode 
        })
      })

      const data = await response.json()

      if (data.success) {
        setServerMessage({ type: 'success', text: 'Code valide ! Redirection...' })
        
        // Stocker le code validé
        sessionStorage.setItem('reset_code', fullCode)
        
        // Rediriger vers la page de nouveau mot de passe
        setTimeout(() => {
          window.location.href = '/reset-password'
        }, 1500)
      } else {
        throw new Error(data.message || 'Code invalide')
      }
      
    } catch (error) {
      console.error('❌ Erreur:', error)
      setServerMessage({ 
        type: 'error', 
        text: error.message || 'Code invalide ou expiré'
      })
      setCode(['', '', '', '', '', ''])
      document.getElementById('code-0')?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsLoading(true)
    setServerMessage({ type: 'info', text: 'Renvoi du code...' })

    try {
      const response = await fetch(`${API_URL}/api/producteurs/demande-reinitialisation-mdp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (data.success) {
        setServerMessage({ 
          type: 'success', 
          text: 'Nouveau code envoyé ! Vérifiez votre email.' 
        })
        setCode(['', '', '', '', '', ''])
        document.getElementById('code-0')?.focus()
      } else {
        throw new Error(data.message || 'Erreur lors du renvoi')
      }
      
    } catch (error) {
      console.error('❌ Erreur:', error)
      setServerMessage({ 
        type: 'error', 
        text: error.message || 'Erreur lors du renvoi du code'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Vérification du code</h1>
          <p className="text-gray-600">
            Entrez le code à 6 chiffres envoyé à<br />
            <span className="font-medium text-gray-900">{email}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          {/* Code Input */}
          <div onPaste={handlePaste}>
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              Code de réinitialisation
            </label>
            <div className="flex justify-between gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-12 h-12 text-center text-xl font-mono border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.code ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              ))}
            </div>
            {errors.code && (
              <p className="text-red-500 text-xs mt-2 text-center">{errors.code}</p>
            )}
          </div>

          {/* Server Message */}
          {serverMessage.text && (
            <div className={`p-3 rounded-lg ${
              serverMessage.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' :
              serverMessage.type === 'error' ? 'bg-red-50 border border-red-200 text-red-600' :
              'bg-blue-50 border border-blue-200 text-blue-700'
            }`}>
              <p className="text-sm text-center">{serverMessage.text}</p>
            </div>
          )}

          {/* Timer Info */}
          <div className="text-center text-sm text-gray-500">
            <p>Le code expire dans 15 minutes</p>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Vérification...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Vérifier le code
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleResendCode}
              disabled={isLoading}
              className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              Renvoyer le code
            </button>
          </div>

          {/* Back to Forgot Password */}
          <div className="text-center">
            <a href="/forgot-password" className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Modifier mon email
            </a>
          </div>
        </form>

        {/* Help Section */}
        <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-medium text-gray-900 mb-2">Vous ne recevez pas le code ?</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Vérifiez vos spams / courriers indésirables</li>
            <li>• Attendez 2 minutes avant de renvoyer</li>
            <li>• Vérifiez que votre email est correct</li>
            <li>• Contactez le support si le problème persiste</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default VerifyCode