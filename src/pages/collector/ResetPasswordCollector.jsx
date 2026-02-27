// import { useState } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import { 
//   Mail, Phone, ArrowLeft, Lock, Eye, EyeOff, 
//   CheckCircle, AlertCircle, Shield, ArrowRight
// } from 'lucide-react'

// const ResetPasswordCollector = () => {
//   const navigate = useNavigate()
//   const [step, setStep] = useState(1)
//   const [contactMethod, setContactMethod] = useState('')
//   const [contactValue, setContactValue] = useState('')
//   const [code, setCode] = useState('')
//   const [newPassword, setNewPassword] = useState('')
//   const [confirmPassword, setConfirmPassword] = useState('')
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [errors, setErrors] = useState({})

//   const passwordRequirements = [
//     { id: 'minLength', label: 'Au moins 6 caractères', regex: /.{6,}/ },
//     { id: 'number', label: 'Au moins 1 chiffre', regex: /\d/ },
//     { id: 'letter', label: 'Au moins 1 lettre', regex: /[a-zA-Z]/ }
//   ]

//   const checkPasswordStrength = () => {
//     const password = newPassword
//     if (!password) return { strength: 0, label: 'Faible', color: 'red' }
    
//     const checks = passwordRequirements.map(req => req.regex.test(password))
//     const strength = checks.filter(Boolean).length
    
//     if (strength === 0) return { strength: 0, label: 'Très faible', color: 'red' }
//     if (strength === 1) return { strength: 1, label: 'Faible', color: 'orange' }
//     if (strength === 2) return { strength: 2, label: 'Moyen', color: 'yellow' }
//     return { strength: 3, label: 'Fort', color: 'green' }
//   }

//   const validateStep1 = () => {
//     const newErrors = {}
    
//     if (!contactMethod) {
//       newErrors.contactMethod = 'Veuillez choisir une méthode de contact'
//     }
    
//     if (!contactValue.trim()) {
//       newErrors.contactValue = 'Veuillez saisir votre email ou téléphone'
//     } else if (contactMethod === 'email' && !/\S+@\S+\.\S+/.test(contactValue)) {
//       newErrors.contactValue = 'L\'email n\'est pas valide'
//     } else if (contactMethod === 'phone' && !/^\+?[0-9]{9,15}$/.test(contactValue.replace(/\s/g, ''))) {
//       newErrors.contactValue = 'Le numéro de téléphone n\'est pas valide'
//     }
    
//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const validateStep2 = () => {
//     const newErrors = {}
    
//     if (!code.trim()) {
//       newErrors.code = 'Veuillez saisir le code reçu'
//     } else if (code.length !== 6) {
//       newErrors.code = 'Le code doit contenir 6 chiffres'
//     }
    
//     if (!newPassword) {
//       newErrors.newPassword = 'Le nouveau mot de passe est requis'
//     } else if (newPassword.length < 6) {
//       newErrors.newPassword = 'Le mot de passe doit contenir au moins 6 caractères'
//     }
    
//     if (newPassword !== confirmPassword) {
//       newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
//     }
    
//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSendCode = async (e) => {
//     e.preventDefault()
    
//     if (!validateStep1()) return
    
//     setIsLoading(true)
    
//     try {
//       await new Promise(resolve => setTimeout(resolve, 2000))
//       console.log('Code envoyé à:', contactValue)
//       setStep(2)
//     } catch (error) {
//       setErrors(prev => ({
//         ...prev,
//         submit: 'Une erreur est survenue. Veuillez réessayer.'
//       }))
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleResetPassword = async (e) => {
//     e.preventDefault()
    
//     if (!validateStep2()) return
    
//     setIsLoading(true)
    
//     try {
//       await new Promise(resolve => setTimeout(resolve, 2000))
//       console.log('Mot de passe réinitialisé')
//       navigate('/collector/login')
//     } catch (error) {
//       setErrors(prev => ({
//         ...prev,
//         submit: 'Une erreur est survenue. Veuillez réessayer.'
//       }))
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const passwordStrength = checkPasswordStrength()

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4">
//       <div className="max-w-md w-full">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <button
//             onClick={() => navigate('/collector/login')}
//             className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4 transition-colors"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Retour à la connexion
//           </button>
          
//           <div className="relative inline-flex mb-6">
//             <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-75 blur-lg animate-pulse" />
//             <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl">
//               <Shield className="h-8 w-8 text-white" />
//             </div>
//           </div>
          
//           <h1 className="text-2xl font-bold text-gray-900 mb-2">
//             {step === 1 ? 'Réinitialiser le mot de passe' : 'Nouveau mot de passe'}
//           </h1>
//           <p className="text-gray-600">
//             {step === 1 
//               ? 'Choisissez comment recevoir votre code de vérification'
//               : 'Saisissez le code reçu et votre nouveau mot de passe'
//             }
//           </p>
//         </div>

//         {/* Progress Steps */}
//         <div className="mb-8">
//           <div className="flex items-center justify-center gap-4">
//             <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
//               step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
//             }`}>
//               1
//             </div>
//             <div className={`h-0.5 w-16 transition-all ${
//               step >= 2 ? 'bg-blue-600' : 'bg-gray-200'
//             }`} />
//             <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
//               step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
//             }`}>
//               2
//             </div>
//           </div>
//           <div className="flex justify-center gap-8 mt-2">
//             <span className={`text-xs ${step >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
//               Demande
//             </span>
//             <span className={`text-xs ${step >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
//               Validation
//             </span>
//           </div>
//         </div>

//         {/* Formulaire */}
//         <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          
//           {/* Étape 1: Demande de code */}
//           {step === 1 && (
//             <form onSubmit={handleSendCode} className="space-y-6">
//               <div className="space-y-4">
//                 <label className="text-sm font-medium text-gray-700">
//                   Comment recevoir votre code ?
//                 </label>
                
//                 <div className="grid grid-cols-2 gap-3">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setContactMethod('email')
//                       setErrors(prev => ({ ...prev, contactMethod: '' }))
//                     }}
//                     className={`p-3 rounded-xl border-2 transition-all ${
//                       contactMethod === 'email'
//                         ? 'border-blue-600 bg-blue-50 text-blue-700'
//                         : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
//                     }`}
//                   >
//                     <Mail className="h-5 w-5 mx-auto mb-2" />
//                     <span className="text-sm font-medium">Email</span>
//                   </button>
                  
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setContactMethod('phone')
//                       setErrors(prev => ({ ...prev, contactMethod: '' }))
//                     }}
//                     className={`p-3 rounded-xl border-2 transition-all ${
//                       contactMethod === 'phone'
//                         ? 'border-blue-600 bg-blue-50 text-blue-700'
//                         : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
//                     }`}
//                   >
//                     <Phone className="h-5 w-5 mx-auto mb-2" />
//                     <span className="text-sm font-medium">Téléphone</span>
//                   </button>
//                 </div>
                
//                 {errors.contactMethod && (
//                   <p className="text-red-500 text-xs mt-1">{errors.contactMethod}</p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700">
//                   {contactMethod === 'email' ? 'Adresse email' : 'Numéro de téléphone'}
//                 </label>
//                 <div className="relative">
//                   {contactMethod === 'email' ? (
//                     <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
//                   ) : (
//                     <Phone className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
//                   )}
//                   <input
//                     type={contactMethod === 'email' ? 'email' : 'tel'}
//                     value={contactValue}
//                     onChange={(e) => {
//                       setContactValue(e.target.value)
//                       setErrors(prev => ({ ...prev, contactValue: '' }))
//                     }}
//                     className={`w-full rounded-xl border-0 bg-gray-50 pl-11 pr-4 py-3.5 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 transition-all ${
//                       errors.contactValue ? 'ring-2 ring-red-500' : ''
//                     }`}
//                     placeholder={contactMethod === 'email' ? 'vous@exemple.com' : '+237 6XX XXX XXX'}
//                   />
//                 </div>
//                 {errors.contactValue && (
//                   <p className="text-red-500 text-xs mt-1">{errors.contactValue}</p>
//                 )}
//               </div>

//               {errors.submit && (
//                 <div className="rounded-xl bg-red-50 border border-red-200 p-4">
//                   <div className="flex items-start gap-3">
//                     <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
//                     <p className="text-sm text-red-700">{errors.submit}</p>
//                   </div>
//                 </div>
//               )}

//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
//               >
//                 {isLoading ? (
//                   <>
//                     <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
//                     Envoi en cours...
//                   </>
//                 ) : (
//                   <>
//                     Recevoir le code
//                     <ArrowRight className="h-5 w-5" />
//                   </>
//                 )}
//               </button>
//             </form>
//           )}

//           {/* Étape 2: Nouveau mot de passe */}
//           {step === 2 && (
//             <form onSubmit={handleResetPassword} className="space-y-6">
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700">
//                   Code reçu par {contactMethod === 'email' ? 'email' : 'SMS'}
//                 </label>
//                 <input
//                   type="text"
//                   value={code}
//                   onChange={(e) => {
//                     setCode(e.target.value.replace(/\D/g, ''))
//                     setErrors(prev => ({ ...prev, code: '' }))
//                   }}
//                   maxLength={6}
//                   className={`w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 transition-all text-center text-2xl font-mono ${
//                     errors.code ? 'ring-2 ring-red-500' : ''
//                   }`}
//                   placeholder="000000"
//                 />
//                 {errors.code && (
//                   <p className="text-red-500 text-xs mt-1">{errors.code}</p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700">
//                   Nouveau mot de passe
//                 </label>
//                 <div className="relative">
//                   <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     value={newPassword}
//                     onChange={(e) => {
//                       setNewPassword(e.target.value)
//                       setErrors(prev => ({ ...prev, newPassword: '' }))
//                     }}
//                     className={`w-full rounded-xl border-0 bg-gray-50 pl-11 pr-12 py-3.5 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 transition-all ${
//                       errors.newPassword ? 'ring-2 ring-red-500' : ''
//                     }`}
//                     placeholder="••••••••"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
//                   >
//                     {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                   </button>
//                 </div>
                
//                 {newPassword && (
//                   <div className="mt-2 space-y-2">
//                     <div className="flex items-center gap-2">
//                       <div className={`h-1.5 w-full rounded-full bg-gray-200 overflow-hidden`}>
//                         <div 
//                           className={`h-full rounded-full transition-all ${
//                             passwordStrength.strength === 0 ? 'w-1/4 bg-red-500' :
//                             passwordStrength.strength === 1 ? 'w-2/4 bg-orange-500' :
//                             passwordStrength.strength === 2 ? 'w-3/4 bg-yellow-500' :
//                             'w-full bg-green-500'
//                           }`} 
//                         />
//                       </div>
//                       <span className={`text-xs font-medium text-${passwordStrength.color}-600`}>
//                         {passwordStrength.label}
//                       </span>
//                     </div>
//                     <div className="grid grid-cols-1 gap-1">
//                       {passwordRequirements.map(req => {
//                         const isValid = req.regex.test(newPassword)
//                         return (
//                           <div key={req.id} className="flex items-center gap-2 text-xs">
//                             {isValid ? (
//                               <CheckCircle className="h-3 w-3 text-green-500" />
//                             ) : (
//                               <AlertCircle className="h-3 w-3 text-gray-400" />
//                             )}
//                             <span className={isValid ? 'text-green-600' : 'text-gray-500'}>
//                               {req.label}
//                             </span>
//                           </div>
//                         )
//                       })}
//                     </div>
//                   </div>
//                 )}
                
//                 {errors.newPassword && (
//                   <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700">
//                   Confirmer le mot de passe
//                 </label>
//                 <div className="relative">
//                   <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
//                   <input
//                     type={showConfirmPassword ? "text" : "password"}
//                     value={confirmPassword}
//                     onChange={(e) => {
//                       setConfirmPassword(e.target.value)
//                       setErrors(prev => ({ ...prev, confirmPassword: '' }))
//                     }}
//                     className={`w-full rounded-xl border-0 bg-gray-50 pl-11 pr-12 py-3.5 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 transition-all ${
//                       errors.confirmPassword ? 'ring-2 ring-red-500' : ''
//                     }`}
//                     placeholder="••••••••"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
//                   >
//                     {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                   </button>
//                 </div>
//                 {errors.confirmPassword && (
//                   <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
//                 )}
//               </div>

//               {errors.submit && (
//                 <div className="rounded-xl bg-red-50 border border-red-200 p-4">
//                   <div className="flex items-start gap-3">
//                     <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
//                     <p className="text-sm text-red-700">{errors.submit}</p>
//                   </div>
//                 </div>
//               )}

//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
//               >
//                 {isLoading ? (
//                   <>
//                     <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
//                     Réinitialisation...
//                   </>
//                 ) : (
//                   <>
//                     Valider
//                     <CheckCircle className="h-5 w-5" />
//                   </>
//                 )}
//               </button>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ResetPasswordCollector
