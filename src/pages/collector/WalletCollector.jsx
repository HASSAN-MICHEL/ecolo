// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { 
//   Wallet, TrendingUp, DollarSign, Calendar, CheckCircle,
//   ArrowUpRight, ArrowDownRight, Download, Filter, Search,
//   Star, Clock, AlertCircle, Award, Target, Activity,
//   CreditCard, Banknote, PiggyBank, Receipt, Menu, LogOut,
//   User, Home, Package, History, Settings, HelpCircle, Truck,
//   Bell, X
// } from 'lucide-react'

// const WalletCollector = () => {
//   const navigate = useNavigate()
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const [activeTab, setActiveTab] = useState('all')
//   const [searchTerm, setSearchTerm] = useState('')
//   const [dateFilter, setDateFilter] = useState('all')
//   const [isLoading, setIsLoading] = useState(true)

//   const [userData, setUserData] = useState({
//     nomComplet: '',
//     email: '',
//     type_collecteur: '',
//     points_total: 0
//   })

//   const [walletData, setWalletData] = useState({
//     currentBalance: 0,
//     totalEarnings: 0,
//     thisMonthEarnings: 0,
//     lastMonthEarnings: 0,
//     pendingEarnings: 0,
//     averageEarnings: 0,
//     totalMissions: 0,
//     successRate: 0,
//     rating: 0,
//     bestMonth: '',
//     bestMonthEarnings: 0
//   })

//   const [transactions, setTransactions] = useState([])

//   const API_URL = import.meta.env.VITE_API_URL || 'https://ecobackend-7tuh.vercel.app'
//   const STORAGE_KEYS = {
//     TOKEN: 'ecocollect_token',
//     USER: 'ecocollect_user',
//     ROLE: 'ecocollect_role'
//   }

//   const getToken = () => localStorage.getItem(STORAGE_KEYS.TOKEN)
//   const getUser = () => {
//     const userJson = localStorage.getItem(STORAGE_KEYS.USER)
//     return userJson ? JSON.parse(userJson) : null
//   }

//   const getInitials = (name) => {
//     if (!name) return 'C'
//     return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
//   }

//   const handleLogout = () => {
//     if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
//       localStorage.removeItem(STORAGE_KEYS.TOKEN)
//       localStorage.removeItem(STORAGE_KEYS.USER)
//       localStorage.removeItem(STORAGE_KEYS.ROLE)
//       navigate('/login')
//     }
//   }

//   // Charger les données utilisateur
//   const loadUserData = async () => {
//     const token = getToken()
//     if (!token) {
//       navigate('/login')
//       return
//     }

//     try {
//       const response = await fetch(`${API_URL}/api/collecteurs/profil`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       })

//       if (response.ok) {
//         const result = await response.json()
//         const profil = result.collecteur || result
        
//         setUserData({
//           nomComplet: profil.nom_complet || '',
//           email: profil.email || '',
//           type_collecteur: profil.type_collecteur || '',
//           points_total: profil.points_total || 0
//         })
//       }
//     } catch (error) {
//       console.error('Erreur chargement utilisateur:', error)
//     }
//   }

//   // Charger les gains
//   const loadGains = async () => {
//     const token = getToken()
//     if (!token) return

//     setIsLoading(true)
//     try {
//       const response = await fetch(`${API_URL}/api/collecteurs/gains`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       })

//       if (response.ok) {
//         const result = await response.json()
//         console.log('📦 Données gains brutes:', result) // Debug
        
//         const gainsList = result.gains || []
        
//         // Charger aussi les missions pour avoir les détails
//         const missionsResponse = await fetch(`${API_URL}/api/collecteurs/missions`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         })

//         let missionsMap = {}
//         if (missionsResponse.ok) {
//           const missionsData = await missionsResponse.json()
//           missionsMap = (missionsData.missions || []).reduce((acc, m) => {
//             acc[m.id] = m
//             return acc
//           }, {})
//         }

//         // Calculer les totaux
//         const totalEarnings = gainsList
//           .filter(g => g.statut === 'valide')
//           .reduce((sum, g) => sum + (parseFloat(g.montant) || 0), 0)
        
//         const pendingEarnings = gainsList
//           .filter(g => g.statut !== 'valide')
//           .reduce((sum, g) => sum + (parseFloat(g.montant) || 0), 0)

//         console.log('💰 Total gains calculé:', totalEarnings) // Debug
//         console.log('⏳ En attente calculé:', pendingEarnings) // Debug

//         // Calculer les gains du mois
//         const now = new Date()
//         const thisMonth = now.getMonth()
//         const thisYear = now.getFullYear()

//         const thisMonthGains = gainsList
//           .filter(g => {
//             const date = new Date(g.cree_le)
//             return date.getMonth() === thisMonth && 
//                    date.getFullYear() === thisYear && 
//                    g.statut === 'valide'
//           })
//           .reduce((sum, g) => sum + (parseFloat(g.montant) || 0), 0)

//         const lastMonthGains = gainsList
//           .filter(g => {
//             const date = new Date(g.cree_le)
//             return date.getMonth() === thisMonth - 1 && 
//                    date.getFullYear() === thisYear && 
//                    g.statut === 'valide'
//           })
//           .reduce((sum, g) => sum + (parseFloat(g.montant) || 0), 0)

//         // Trouver le meilleur mois
//         const monthlyTotals = gainsList.reduce((acc, g) => {
//           if (g.statut === 'valide') {
//             const date = new Date(g.cree_le)
//             const monthYear = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
//             acc[monthYear] = (acc[monthYear] || 0) + (parseFloat(g.montant) || 0)
//           }
//           return acc
//         }, {})

//         let bestMonth = ''
//         let bestMonthEarnings = 0
//         Object.entries(monthlyTotals).forEach(([month, total]) => {
//           if (total > bestMonthEarnings) {
//             bestMonthEarnings = total
//             bestMonth = month
//           }
//         })

//         // Formater les transactions
//         const formattedTransactions = gainsList.map((gain, index) => {
//           const mission = missionsMap[gain.mission_id] || {}
          
//           return {
//             id: gain.id || index + 1,
//             type: gain.statut === 'valide' ? 'earning' : 'pending',
//             missionId: gain.mission_id ? `#${gain.mission_id.substring(0, 5)}` : '',
//             missionTitle: mission.producteur_nom || 'Mission',
//             amount: parseFloat(gain.montant) || 0,
//             status: gain.statut === 'valide' ? 'completed' : 'pending',
//             date: gain.cree_le ? new Date(gain.cree_le).toLocaleDateString('fr-FR') : '',
//             time: gain.cree_le ? new Date(gain.cree_le).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '',
//             paymentMethod: gain.methode_paiement || 'wallet',
//             wasteType: mission.type_dechet || '',
//             quantity: mission.quantite ? `${mission.quantite} ${mission.unite || 'kg'}` : '',
//             producerRating: mission.producteur_note || 0
//           }
//         })

//         setTransactions(formattedTransactions)

//         const totalMissions = gainsList.length
//         const completedMissions = gainsList.filter(g => g.statut === 'valide').length

//         setWalletData({
//           currentBalance: totalEarnings,
//           totalEarnings: totalEarnings,
//           thisMonthEarnings: thisMonthGains,
//           lastMonthEarnings: lastMonthGains,
//           pendingEarnings: pendingEarnings,
//           averageEarnings: completedMissions ? Math.round(totalEarnings / completedMissions) : 0,
//           totalMissions: totalMissions,
//           successRate: totalMissions ? Math.round((completedMissions / totalMissions) * 100) : 0,
//           rating: 4.8,
//           bestMonth: bestMonth,
//           bestMonthEarnings: bestMonthEarnings
//         })
//       }
//     } catch (error) {
//       console.error('Erreur chargement gains:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     loadUserData()
//     loadGains()
    
//     const interval = setInterval(loadGains, 30000)
//     return () => clearInterval(interval)
//   }, [])

//   const tabs = [
//     { id: 'all', label: 'Tout', count: transactions.length },
//     { id: 'earnings', label: 'Gains', count: transactions.filter(t => t.type === 'earning').length },
//     { id: 'pending', label: 'En attente', count: transactions.filter(t => t.status === 'pending').length },
//     { id: 'withdrawals', label: 'Retraits', count: transactions.filter(t => t.type === 'withdrawal').length },
//     { id: 'bonuses', label: 'Bonus', count: transactions.filter(t => t.type === 'bonus').length }
//   ]

//   const dateFilters = [
//     { id: 'all', label: 'Toutes les périodes' },
//     { id: 'today', label: "Aujourd'hui" },
//     { id: 'week', label: 'Cette semaine' },
//     { id: 'month', label: 'Ce mois' },
//     { id: 'year', label: 'Cette année' }
//   ]

//   const getTransactionIcon = (type) => {
//     switch (type) {
//       case 'earning': return <DollarSign className="h-5 w-5" />
//       case 'withdrawal': return <ArrowUpRight className="h-5 w-5" />
//       case 'bonus': return <Award className="h-5 w-5" />
//       default: return <Receipt className="h-5 w-5" />
//     }
//   }

//   const getTransactionColor = (type, status) => {
//     if (type === 'withdrawal') return status === 'completed' ? 'text-red-600 bg-red-50' : 'text-yellow-600 bg-yellow-50'
//     if (type === 'bonus') return 'text-purple-600 bg-purple-50'
//     if (status === 'pending') return 'text-yellow-600 bg-yellow-50'
//     return 'text-green-600 bg-green-50'
//   }

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'completed': return 'text-green-600 bg-green-50'
//       case 'pending': return 'text-yellow-600 bg-yellow-50'
//       case 'failed': return 'text-red-600 bg-red-50'
//       default: return 'text-gray-600 bg-gray-50'
//     }
//   }

//   const getStatusLabel = (status) => {
//     switch (status) {
//       case 'completed': return 'Terminé'
//       case 'pending': return 'En attente'
//       case 'failed': return 'Échoué'
//       default: return status
//     }
//   }

//   const filteredTransactions = transactions.filter(transaction => {
//     const matchesTab = activeTab === 'all' || 
//       (activeTab === 'earnings' && transaction.type === 'earning') ||
//       (activeTab === 'pending' && transaction.status === 'pending') ||
//       (activeTab === 'withdrawals' && transaction.type === 'withdrawal') ||
//       (activeTab === 'bonuses' && transaction.type === 'bonus')
    
//     const matchesSearch = (transaction.missionTitle?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
//       (transaction.missionId?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    
//     return matchesTab && matchesSearch
//   })

//   // Sidebar Component
//   const Sidebar = () => (
//     <>
//       {/* Mobile Sidebar */}
//       <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ease-in-out ${
//         sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
//       }`}>
//         <div 
//           className={`absolute inset-0 bg-black transition-opacity duration-300 ${
//             sidebarOpen ? 'opacity-50' : 'opacity-0'
//           }`}
//           onClick={() => setSidebarOpen(false)}
//         />
        
//         <div className={`absolute top-0 left-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
//           sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         }`}>
//           <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <Truck className="w-8 h-8 text-white" />
//                 <span className="text-xl font-bold text-white">EcoCollect</span>
//               </div>
//               <button
//                 onClick={() => setSidebarOpen(false)}
//                 className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//           </div>

//           <div className="p-4 border-b">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
//                 {getInitials(userData.nomComplet)}
//               </div>
//               <div>
//                 <p className="font-medium text-gray-900">{userData.nomComplet || 'Collecteur'}</p>
//                 <p className="text-xs text-gray-500">{userData.email || ''}</p>
//               </div>
//             </div>
//           </div>

//           <nav className="flex-1 p-4 overflow-y-auto">
//             <div className="mb-6">
//               <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
//                 Principal
//               </h3>
//               <ul className="space-y-2">
//                 <li>
//                   <a href="/collector/dashboard" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
//                     <Home className="w-5 h-5 text-gray-400" />
//                     <span className="font-medium">Tableau de bord</span>
//                   </a>
//                 </li>
//                 <li>
//                   <a href="/collector/missions" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
//                     <Package className="w-5 h-5 text-gray-400" />
//                     <span className="font-medium">Missions</span>
//                   </a>
//                 </li>
//                 <li>
//                   <a href="/collector/wallet" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors bg-blue-50 text-blue-700 border-l-4 border-blue-600">
//                     <Wallet className="w-5 h-5 text-blue-600" />
//                     <span className="font-medium">Mes gains</span>
//                   </a>
//                 </li>
//                 <li>
//                   <a href="/collector/history" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
//                     <History className="w-5 h-5 text-gray-400" />
//                     <span className="font-medium">Historique</span>
//                   </a>
//                 </li>
//               </ul>
//             </div>

//             <div className="mb-6">
//               <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
//                 Compte
//               </h3>
//               <ul className="space-y-2">
//                 <li>
//                   <a href="/collector/profile" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
//                     <User className="w-5 h-5 text-gray-400" />
//                     <span className="font-medium">Mon profil</span>
//                   </a>
//                 </li>
//                 <li>
//                   <a href="/collector/notifications" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
//                     <Bell className="w-5 h-5 text-gray-400" />
//                     <span className="font-medium">Notifications</span>
//                   </a>
//                 </li>
//                 <li>
//                   <a href="/collector/settings" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
//                     <Settings className="w-5 h-5 text-gray-400" />
//                     <span className="font-medium">Paramètres</span>
//                   </a>
//                 </li>
//                 <li>
//                   <a href="/collector/help" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
//                     <HelpCircle className="w-5 h-5 text-gray-400" />
//                     <span className="font-medium">Aide</span>
//                   </a>
//                 </li>
//               </ul>
//             </div>

//             <div className="mt-auto p-4 border-t">
//               <button
//                 onClick={handleLogout}
//                 className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
//               >
//                 <LogOut className="w-5 h-5" />
//                 <span className="font-medium">Déconnexion</span>
//               </button>
//             </div>
//           </nav>
//         </div>
//       </div>

//       {/* Desktop Sidebar */}
//       <div className="hidden lg:block fixed top-0 left-0 h-screen bg-white shadow-xl z-50 w-72 overflow-hidden flex flex-col">
//         <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
//           <div className="flex items-center gap-2">
//             <Truck className="w-8 h-8 text-white" />
//             <span className="text-xl font-bold text-white">EcoCollect</span>
//           </div>
//         </div>

//         <div className="p-4 border-b">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
//               {getInitials(userData.nomComplet)}
//             </div>
//             <div>
//               <p className="font-medium text-gray-900">{userData.nomComplet || 'Collecteur'}</p>
//               <p className="text-xs text-gray-500">{userData.email || ''}</p>
//             </div>
//           </div>
//         </div>

//         <nav className="flex-1 p-4 overflow-y-auto">
//           <div className="mb-6">
//             <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
//               Principal
//             </h3>
//             <ul className="space-y-1">
//               <li>
//                 <a href="/collector/dashboard" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
//                   <Home className="w-5 h-5 text-gray-400" />
//                   <span className="font-medium">Tableau de bord</span>
//                 </a>
//               </li>
//               <li>
//                 <a href="/collector/missions" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
//                   <Package className="w-5 h-5 text-gray-400" />
//                   <span className="font-medium">Missions</span>
//                 </a>
//               </li>
//               <li>
//                 <a href="/collector/wallet" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors bg-blue-50 text-blue-700 border-l-4 border-blue-600">
//                   <Wallet className="w-5 h-5 text-blue-600" />
//                   <span className="font-medium">Mes gains</span>
//                 </a>
//               </li>
//               <li>
//                 <a href="/collector/history" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
//                   <History className="w-5 h-5 text-gray-400" />
//                   <span className="font-medium">Historique</span>
//                 </a>
//               </li>
//             </ul>
//           </div>

//           <div className="mb-6">
//             <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
//               Compte
//             </h3>
//             <ul className="space-y-1">
//               <li>
//                 <a href="/collector/profile" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
//                   <User className="w-5 h-5 text-gray-400" />
//                   <span className="font-medium">Mon profil</span>
//                 </a>
//               </li>
//               <li>
//                 <a href="/collector/notifications" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
//                   <Bell className="w-5 h-5 text-gray-400" />
//                   <span className="font-medium">Notifications</span>
//                 </a>
//               </li>
//               <li>
//                 <a href="/collector/settings" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
//                   <Settings className="w-5 h-5 text-gray-400" />
//                   <span className="font-medium">Paramètres</span>
//                 </a>
//               </li>
//               <li>
//                 <a href="/collector/help" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
//                   <HelpCircle className="w-5 h-5 text-gray-400" />
//                   <span className="font-medium">Aide</span>
//                 </a>
//               </li>
//             </ul>
//           </div>

//           <div className="mt-auto p-4 border-t">
//             <button
//               onClick={handleLogout}
//               className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
//             >
//               <LogOut className="w-5 h-5" />
//               <span className="font-medium">Déconnexion</span>
//             </button>
//           </div>
//         </nav>
//       </div>
//     </>
//   )

//   const TransactionCard = ({ transaction }) => (
//     <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all">
//       <div className="flex items-start justify-between mb-4">
//         <div className="flex items-center gap-3">
//           <div className={`p-2 rounded-lg ${getTransactionColor(transaction.type, transaction.status)}`}>
//             {getTransactionIcon(transaction.type)}
//           </div>
//           <div>
//             <h3 className="font-semibold text-gray-900">
//               {transaction.missionTitle || 'Mission'}
//             </h3>
//             {transaction.missionId && (
//               <p className="text-sm text-gray-600">{transaction.missionId}</p>
//             )}
//           </div>
//         </div>
        
//         <div className="text-right">
//           <p className={`text-lg font-bold ${
//             transaction.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'
//           }`}>
//             {transaction.type === 'withdrawal' ? '-' : '+'}
//             {transaction.amount.toLocaleString()} FCFA
//           </p>
//           <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
//             {getStatusLabel(transaction.status)}
//           </span>
//         </div>
//       </div>

//       {/* Transaction Details */}
//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           {transaction.wasteType && (
//             <div className="flex items-center gap-2 text-sm text-gray-600">
//               <Target className="h-4 w-4" />
//               {transaction.wasteType} • {transaction.quantity}
//             </div>
//           )}
//           {transaction.producerRating > 0 && (
//             <div className="flex items-center gap-2 text-sm text-gray-600">
//               <Star className="h-4 w-4" />
//               Note: {transaction.producerRating}/5
//             </div>
//           )}
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <CreditCard className="h-4 w-4" />
//             {transaction.paymentMethod === 'wallet' ? 'Portefeuille' : 'Virement bancaire'}
//           </div>
//         </div>
        
//         <div className="space-y-2 text-right">
//           <div className="flex items-center gap-2 text-sm text-gray-600 justify-end">
//             <Calendar className="h-4 w-4" />
//             {transaction.date}
//           </div>
//           <div className="flex items-center gap-2 text-sm text-gray-600 justify-end">
//             <Clock className="h-4 w-4" />
//             {transaction.time}
//           </div>
//         </div>
//       </div>
//     </div>
//   )

//   if (isLoading && transactions.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <Sidebar />
//         <div className="lg:ml-72 min-h-screen">
//           <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
//             <div className="px-4 py-3 flex items-center justify-between">
//               <button
//                 onClick={() => setSidebarOpen(true)}
//                 className="p-2 hover:bg-gray-100 rounded-lg"
//               >
//                 <Menu className="w-6 h-6 text-gray-600" />
//               </button>
//               <div className="flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
//                   {getInitials(userData.nomComplet)}
//                 </div>
//               </div>
//             </div>
//           </header>
//           <div className="flex items-center justify-center h-[calc(100vh-64px)]">
//             <div className="text-center">
//               <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//               <p className="text-gray-600">Chargement de vos gains...</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Sidebar />
      
//       {/* Header mobile */}
//       <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
//         <div className="px-4 py-3 flex items-center justify-between">
//           <button
//             onClick={() => setSidebarOpen(true)}
//             className="p-2 hover:bg-gray-100 rounded-lg"
//           >
//             <Menu className="w-6 h-6 text-gray-600" />
//           </button>
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
//               {getInitials(userData.nomComplet)}
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="lg:ml-72 min-h-screen">
//         <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           {/* Page Title */}
//           <div className="mb-8">
//             <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//               <Wallet className="h-6 w-6 text-blue-600" />
//               Mes gains
//             </h1>
//             <p className="text-gray-600">Suivez vos revenus et transactions</p>
//           </div>

//           {/* Balance Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
//                   <Wallet className="h-6 w-6" />
//                 </div>
//                 <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-lg">
//                   Solde total
//                 </span>
//               </div>
//               <p className="text-3xl font-bold mb-2">{walletData.totalEarnings.toLocaleString()} FCFA</p>
//               <p className="text-blue-100 text-sm">Gains cumulés</p>
//             </div>

//             <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="p-3 bg-green-100 rounded-lg">
//                   <TrendingUp className="h-6 w-6 text-green-600" />
//                 </div>
//                 <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
//                   Ce mois
//                 </span>
//               </div>
//               <p className="text-2xl font-bold text-gray-900 mb-2">{walletData.thisMonthEarnings.toLocaleString()} FCFA</p>
//               {walletData.lastMonthEarnings > 0 && (
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <ArrowUpRight className="h-4 w-4 text-green-600" />
//                   <span>+{((walletData.thisMonthEarnings - walletData.lastMonthEarnings) / walletData.lastMonthEarnings * 100).toFixed(1)}% vs mois dernier</span>
//                 </div>
//               )}
//             </div>

//             <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="p-3 bg-yellow-100 rounded-lg">
//                   <Clock className="h-6 w-6 text-yellow-600" />
//                 </div>
//                 <span className="text-sm font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-lg">
//                   En attente
//                 </span>
//               </div>
//               <p className="text-2xl font-bold text-gray-900 mb-2">{walletData.pendingEarnings.toLocaleString()} FCFA</p>
//               <p className="text-sm text-gray-600">En cours de validation</p>
//             </div>
//           </div>

//           {/* Stats Overview */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//             <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
//               <div className="flex items-center justify-between mb-2">
//                 <Target className="h-8 w-8 text-blue-600" />
//                 <span className="text-2xl font-bold text-gray-900">
//                   {walletData.totalMissions}
//                 </span>
//               </div>
//               <p className="text-sm text-gray-600">Total missions</p>
//             </div>

//             <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
//               <div className="flex items-center justify-between mb-2">
//                 <Activity className="h-8 w-8 text-green-600" />
//                 <span className="text-2xl font-bold text-gray-900">
//                   {walletData.averageEarnings.toLocaleString()} FCFA
//                 </span>
//               </div>
//               <p className="text-sm text-gray-600">Gain moyen/mission</p>
//             </div>

//             <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
//               <div className="flex items-center justify-between mb-2">
//                 <CheckCircle className="h-8 w-8 text-purple-600" />
//                 <span className="text-2xl font-bold text-gray-900">
//                   {walletData.successRate}%
//                 </span>
//               </div>
//               <p className="text-sm text-gray-600">Taux de réussite</p>
//             </div>

//             <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
//               <div className="flex items-center justify-between mb-2">
//                 <Award className="h-8 w-8 text-amber-600" />
//                 <span className="text-2xl font-bold text-gray-900">
//                   {walletData.rating}/5
//                 </span>
//               </div>
//               <p className="text-sm text-gray-600">Note moyenne</p>
//             </div>
//           </div>

//           {/* Best Month Card */}
//           {walletData.bestMonth && (
//             <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl shadow-lg p-4 mb-6 text-white">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <Award className="h-5 w-5" />
//                   <span className="font-medium">Meilleur mois :</span>
//                 </div>
//                 <span className="font-bold">{walletData.bestMonth}</span>
//                 <span className="font-bold">{walletData.bestMonthEarnings.toLocaleString()} FCFA</span>
//               </div>
//             </div>
//           )}

//           {/* Transactions Section */}
//           <div className="bg-white rounded-2xl shadow-lg p-6">
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center gap-3">
//                 <div className="p-3 bg-blue-100 rounded-xl">
//                   <Receipt className="h-6 w-6 text-blue-600" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-bold text-gray-900">Historique des transactions</h3>
//                   <p className="text-gray-600">Suivez tous vos gains et retraits</p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//                   <input
//                     type="text"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     placeholder="Rechercher..."
//                     className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
//                   />
//                 </div>

//                 <select
//                   value={dateFilter}
//                   onChange={(e) => setDateFilter(e.target.value)}
//                   className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
//                 >
//                   {dateFilters.map(filter => (
//                     <option key={filter.id} value={filter.id}>{filter.label}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Tabs */}
//             <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
//                     activeTab === tab.id
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
//                   }`}
//                 >
//                   {tab.label}
//                   <span className={`px-2 py-0.5 rounded-full text-xs ${
//                     activeTab === tab.id
//                       ? 'bg-blue-700 text-white'
//                       : 'bg-gray-100 text-gray-600'
//                   }`}>
//                     {tab.count}
//                   </span>
//                 </button>
//               ))}
//             </div>

//             <div className="space-y-4">
//               {filteredTransactions.length > 0 ? (
//                 filteredTransactions.map((transaction) => (
//                   <TransactionCard key={transaction.id} transaction={transaction} />
//                 ))
//               ) : (
//                 <div className="text-center py-12">
//                   <Receipt className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune transaction trouvée</h3>
//                   <p className="text-gray-600">
//                     {searchTerm ? 'Essayez une autre recherche' : 'Aucune transaction ne correspond à ce filtre'}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }

// export default WalletCollector



import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Wallet, TrendingUp, DollarSign, Calendar, CheckCircle,
  ArrowUpRight, ArrowDownRight, Download, Filter, Search,
  Star, Clock, AlertCircle, Award, Target, Activity,
  CreditCard, Banknote, PiggyBank, Receipt, Menu, LogOut,
  User, Home, Package, History, Settings, HelpCircle, Truck,
  Bell, X
} from 'lucide-react'

const WalletCollector = () => {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  const [userData, setUserData] = useState({
    nomComplet: '',
    email: '',
    type_collecteur: '',
    points_total: 0
  })

  const [walletData, setWalletData] = useState({
    currentBalance: 0,
    totalEarnings: 0,
    thisMonthEarnings: 0,
    lastMonthEarnings: 0,
    pendingEarnings: 0,
    averageEarnings: 0,
    totalMissions: 0,
    successRate: 0,
    rating: 0,
    bestMonth: '',
    bestMonthEarnings: 0
  })

  const [transactions, setTransactions] = useState([])

  const API_URL = import.meta.env.VITE_API_URL ||   'https://ecobackend-zeds.vercel.app';
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

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
      localStorage.removeItem(STORAGE_KEYS.ROLE)
      navigate('/login')
    }
  }

  // Charger les données utilisateur
  const loadUserData = async () => {
    const token = getToken()
    if (!token) {
      navigate('/login')
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/collecteurs/profil`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const result = await response.json()
        const profil = result.collecteur || result
        
        setUserData({
          nomComplet: profil.nom_complet || '',
          email: profil.email || '',
          type_collecteur: profil.type_collecteur || '',
          points_total: profil.points_total || 0
        })
      }
    } catch (error) {
      console.error('Erreur chargement utilisateur:', error)
    }
  }

  // Charger les gains
  const loadGains = async () => {
    const token = getToken()
    if (!token) return

    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/collecteurs/gains`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const result = await response.json()
        console.log('📦 Données gains brutes:', result) // Debug
        
        const gainsList = result.gains || []
        
        // Charger aussi les missions pour avoir les détails
        const missionsResponse = await fetch(`${API_URL}/api/collecteurs/missions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        let missionsMap = {}
        if (missionsResponse.ok) {
          const missionsData = await missionsResponse.json()
          missionsMap = (missionsData.missions || []).reduce((acc, m) => {
            acc[m.id] = m
            return acc
          }, {})
        }

        // Calculer les totaux
        const totalEarnings = gainsList
          .filter(g => g.statut === 'valide')
          .reduce((sum, g) => sum + (parseFloat(g.montant) || 0), 0)
        
        const pendingEarnings = gainsList
          .filter(g => g.statut !== 'valide')
          .reduce((sum, g) => sum + (parseFloat(g.montant) || 0), 0)

        console.log('💰 Total gains calculé:', totalEarnings) // Debug
        console.log('⏳ En attente calculé:', pendingEarnings) // Debug

        // Calculer les gains du mois
        const now = new Date()
        const thisMonth = now.getMonth()
        const thisYear = now.getFullYear()

        const thisMonthGains = gainsList
          .filter(g => {
            const date = new Date(g.cree_le)
            return date.getMonth() === thisMonth && 
                   date.getFullYear() === thisYear && 
                   g.statut === 'valide'
          })
          .reduce((sum, g) => sum + (parseFloat(g.montant) || 0), 0)

        const lastMonthGains = gainsList
          .filter(g => {
            const date = new Date(g.cree_le)
            return date.getMonth() === thisMonth - 1 && 
                   date.getFullYear() === thisYear && 
                   g.statut === 'valide'
          })
          .reduce((sum, g) => sum + (parseFloat(g.montant) || 0), 0)

        // Trouver le meilleur mois
        const monthlyTotals = gainsList.reduce((acc, g) => {
          if (g.statut === 'valide') {
            const date = new Date(g.cree_le)
            const monthYear = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
            acc[monthYear] = (acc[monthYear] || 0) + (parseFloat(g.montant) || 0)
          }
          return acc
        }, {})

        let bestMonth = ''
        let bestMonthEarnings = 0
        Object.entries(monthlyTotals).forEach(([month, total]) => {
          if (total > bestMonthEarnings) {
            bestMonthEarnings = total
            bestMonth = month
          }
        })

        // Formater les transactions
        const formattedTransactions = gainsList.map((gain, index) => {
          const mission = missionsMap[gain.mission_id] || {}
          
          return {
            id: gain.id || index + 1,
            type: gain.statut === 'valide' ? 'earning' : 'pending',
            missionId: gain.mission_id ? `#${gain.mission_id.substring(0, 5)}` : '',
            missionTitle: mission.producteur_nom || 'Mission',
            amount: parseFloat(gain.montant) || 0,
            status: gain.statut === 'valide' ? 'completed' : 'pending',
            date: gain.cree_le ? new Date(gain.cree_le).toLocaleDateString('fr-FR') : '',
            time: gain.cree_le ? new Date(gain.cree_le).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '',
            paymentMethod: gain.methode_paiement || 'wallet',
            wasteType: mission.type_dechet || '',
            quantity: mission.quantite ? `${mission.quantite} ${mission.unite || 'kg'}` : '',
            producerRating: mission.producteur_note || 0
          }
        })

        setTransactions(formattedTransactions)

        const totalMissions = gainsList.length
        const completedMissions = gainsList.filter(g => g.statut === 'valide').length

        setWalletData({
          currentBalance: totalEarnings,
          totalEarnings: totalEarnings,
          thisMonthEarnings: thisMonthGains,
          lastMonthEarnings: lastMonthGains,
          pendingEarnings: pendingEarnings,
          averageEarnings: completedMissions ? Math.round(totalEarnings / completedMissions) : 0,
          totalMissions: totalMissions,
          successRate: totalMissions ? Math.round((completedMissions / totalMissions) * 100) : 0,
          rating: 4.8,
          bestMonth: bestMonth,
          bestMonthEarnings: bestMonthEarnings
        })
      }
    } catch (error) {
      console.error('Erreur chargement gains:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUserData()
    loadGains()
    
    const interval = setInterval(loadGains, 30000)
    return () => clearInterval(interval)
  }, [])

  const tabs = [
    { id: 'all', label: 'Tout', count: transactions.length },
    { id: 'earnings', label: 'Gains', count: transactions.filter(t => t.type === 'earning').length },
    { id: 'pending', label: 'En attente', count: transactions.filter(t => t.status === 'pending').length },
    { id: 'withdrawals', label: 'Retraits', count: transactions.filter(t => t.type === 'withdrawal').length },
    { id: 'bonuses', label: 'Bonus', count: transactions.filter(t => t.type === 'bonus').length }
  ]

  const dateFilters = [
    { id: 'all', label: 'Toutes les périodes' },
    { id: 'today', label: "Aujourd'hui" },
    { id: 'week', label: 'Cette semaine' },
    { id: 'month', label: 'Ce mois' },
    { id: 'year', label: 'Cette année' }
  ]

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'earning': return <DollarSign className="h-5 w-5" />
      case 'withdrawal': return <ArrowUpRight className="h-5 w-5" />
      case 'bonus': return <Award className="h-5 w-5" />
      default: return <Receipt className="h-5 w-5" />
    }
  }

  const getTransactionColor = (type, status) => {
    if (type === 'withdrawal') return status === 'completed' ? 'text-red-600 bg-red-50' : 'text-yellow-600 bg-yellow-50'
    if (type === 'bonus') return 'text-purple-600 bg-purple-50'
    if (status === 'pending') return 'text-yellow-600 bg-yellow-50'
    return 'text-green-600 bg-green-50'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50'
      case 'pending': return 'text-yellow-600 bg-yellow-50'
      case 'failed': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Terminé'
      case 'pending': return 'En attente'
      case 'failed': return 'Échoué'
      default: return status
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'earnings' && transaction.type === 'earning') ||
      (activeTab === 'pending' && transaction.status === 'pending') ||
      (activeTab === 'withdrawals' && transaction.type === 'withdrawal') ||
      (activeTab === 'bonuses' && transaction.type === 'bonus')
    
    const matchesSearch = (transaction.missionTitle?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (transaction.missionId?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    
    return matchesTab && matchesSearch
  })

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
                <p className="text-xs text-gray-500">{userData.email || ''}</p>
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
                  <a href="/collector/wallet" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors bg-blue-50 text-blue-700 border-l-4 border-blue-600">
                    <Wallet className="w-5 h-5 text-blue-600" />
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
                  <a href="/collector/profile" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Mon profil</span>
                  </a>
                </li>
                <li>
                  <a href="/collector/notifications" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Notifications</span>
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
              <p className="text-xs text-gray-500">{userData.email || ''}</p>
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
                <a href="/collector/wallet" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors bg-blue-50 text-blue-700 border-l-4 border-blue-600">
                  <Wallet className="w-5 h-5 text-blue-600" />
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
                <a href="/collector/profile" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Mon profil</span>
                </a>
              </li>
              <li>
                <a href="/collector/notifications" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Notifications</span>
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

  const TransactionCard = ({ transaction }) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${getTransactionColor(transaction.type, transaction.status)}`}>
            {getTransactionIcon(transaction.type)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {transaction.missionTitle || 'Mission'}
            </h3>
            {transaction.missionId && (
              <p className="text-sm text-gray-600">{transaction.missionId}</p>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <p className={`text-lg font-bold ${
            transaction.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'
          }`}>
            {transaction.type === 'withdrawal' ? '-' : '+'}
            {transaction.amount.toLocaleString()} FCFA
          </p>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
            {getStatusLabel(transaction.status)}
          </span>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          {transaction.wasteType && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Target className="h-4 w-4" />
              {transaction.wasteType} • {transaction.quantity}
            </div>
          )}
          {transaction.producerRating > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star className="h-4 w-4" />
              Note: {transaction.producerRating}/5
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CreditCard className="h-4 w-4" />
            {transaction.paymentMethod === 'wallet' ? 'Portefeuille' : 'Virement bancaire'}
          </div>
        </div>
        
        <div className="space-y-2 text-right">
          <div className="flex items-center gap-2 text-sm text-gray-600 justify-end">
            <Calendar className="h-4 w-4" />
            {transaction.date}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 justify-end">
            <Clock className="h-4 w-4" />
            {transaction.time}
          </div>
        </div>
      </div>
    </div>
  )

  if (isLoading && transactions.length === 0) {
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
              <p className="text-gray-600">Chargement de vos gains...</p>
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
              <Wallet className="h-6 w-6 text-blue-600" />
              Mes gains
            </h1>
            <p className="text-gray-600">Suivez vos revenus et transactions</p>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Wallet className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-lg">
                  Solde total
                </span>
              </div>
              <p className="text-3xl font-bold mb-2">{walletData.totalEarnings.toLocaleString()} FCFA</p>
              <p className="text-blue-100 text-sm">Gains cumulés</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                  Ce mois
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2">{walletData.thisMonthEarnings.toLocaleString()} FCFA</p>
              {walletData.lastMonthEarnings > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                  <span>+{((walletData.thisMonthEarnings - walletData.lastMonthEarnings) / walletData.lastMonthEarnings * 100).toFixed(1)}% vs mois dernier</span>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <span className="text-sm font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-lg">
                  En attente
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2">{walletData.pendingEarnings.toLocaleString()} FCFA</p>
              <p className="text-sm text-gray-600">En cours de validation</p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <Target className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">
                  {walletData.totalMissions}
                </span>
              </div>
              <p className="text-sm text-gray-600">Total missions</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <Activity className="h-8 w-8 text-green-600" />
                <span className="text-2xl font-bold text-gray-900">
                  {walletData.averageEarnings.toLocaleString()} FCFA
                </span>
              </div>
              <p className="text-sm text-gray-600">Gain moyen/mission</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="h-8 w-8 text-purple-600" />
                <span className="text-2xl font-bold text-gray-900">
                  {walletData.successRate}%
                </span>
              </div>
              <p className="text-sm text-gray-600">Taux de réussite</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <Award className="h-8 w-8 text-amber-600" />
                <span className="text-2xl font-bold text-gray-900">
                  {walletData.rating}/5
                </span>
              </div>
              <p className="text-sm text-gray-600">Note moyenne</p>
            </div>
          </div>

          {/* Best Month Card */}
          {walletData.bestMonth && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl shadow-lg p-4 mb-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  <span className="font-medium">Meilleur mois :</span>
                </div>
                <span className="font-bold">{walletData.bestMonth}</span>
                <span className="font-bold">{walletData.bestMonthEarnings.toLocaleString()} FCFA</span>
              </div>
            </div>
          )}

          {/* Transactions Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Receipt className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Historique des transactions</h3>
                  <p className="text-gray-600">Suivez tous vos gains et retraits</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  {dateFilters.map(filter => (
                    <option key={filter.id} value={filter.id}>{filter.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
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

            <div className="space-y-4">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TransactionCard key={transaction.id} transaction={transaction} />
                ))
              ) : (
                <div className="text-center py-12">
                  <Receipt className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune transaction trouvée</h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'Essayez une autre recherche' : 'Aucune transaction ne correspond à ce filtre'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default WalletCollector