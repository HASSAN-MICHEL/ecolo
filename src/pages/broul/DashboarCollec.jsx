// // import { useState, useEffect, useCallback } from 'react'
// // import { useNavigate } from 'react-router-dom'
// // import { 
// //   Package, Clock, CheckCircle, TrendingUp, Award, 
// //   BarChart3, Target, DollarSign, Bell, ArrowRight,
// //   Truck, MapPin, Star, Activity, Users, Calendar,
// //   Menu, X, LogOut, User, Settings, HelpCircle,
// //   Home, Wallet, History, Map, Navigation
// // } from 'lucide-react'
// // import Layout from '../../components/Layout'

// // const DashboardCollector = () => {
// //   const navigate = useNavigate()
// //   const [userData, setUserData] = useState({
// //     firstName: '',
// //     lastName: '',
// //     businessStatus: 'independent',
// //     nomComplet: ''
// //   })

// //   const [stats, setStats] = useState({
// //     totalMissions: 0,
// //     availableMissions: 0,
// //     inProgressMissions: 0,
// //     completedMissions: 0,
// //     totalEarnings: 0,
// //     thisMonthEarnings: 0,
// //     averageEarnings: 0,
// //     rating: 0
// //   })

// //   const [recentMissions, setRecentMissions] = useState([])
// //   const [notifications, setNotifications] = useState([])
// //   const [isLoading, setIsLoading] = useState(true)
// //   const [error, setError] = useState(null)
// //   const [sidebarOpen, setSidebarOpen] = useState(false)

// //   const API_URL = import.meta.env.VITE_API_URL || 'https://ecobackend-7tuh.vercel.app'
// //   const STORAGE_KEYS = {
// //     TOKEN: 'ecocollect_token',
// //     USER: 'ecocollect_user',
// //     ROLE: 'ecocollect_role'
// //   }

// //   const getToken = () => localStorage.getItem(STORAGE_KEYS.TOKEN)
// //   const getUser = () => {
// //     const userJson = localStorage.getItem(STORAGE_KEYS.USER)
// //     return userJson ? JSON.parse(userJson) : null
// //   }

// //   const handleLogout = () => {
// //     if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
// //       localStorage.removeItem(STORAGE_KEYS.TOKEN)
// //       localStorage.removeItem(STORAGE_KEYS.USER)
// //       localStorage.removeItem(STORAGE_KEYS.ROLE)
// //       navigate('/login')
// //     }
// //   }

// //   const getInitials = (name) => {
// //     if (!name) return 'C'
// //     return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
// //   }

// //   const loadDashboardData = useCallback(async () => {
// //     const token = getToken()
// //     if (!token) {
// //       navigate('/login')
// //       return
// //     }

// //     setIsLoading(true)
// //     setError(null)

// //     try {
// //       // Charger le tableau de bord
// //       const dashboardResponse = await fetch(`${API_URL}/api/collecteurs/tableau-bord`, {
// //         headers: { 'Authorization': `Bearer ${token}` }
// //       })

// //       if (!dashboardResponse.ok) throw new Error('Erreur chargement dashboard')
// //       const dashboardData = await dashboardResponse.json()
      
// //       // Charger les missions disponibles
// //       const missionsDisponiblesResponse = await fetch(`${API_URL}/api/collecteurs/missions/disponibles`, {
// //         headers: { 'Authorization': `Bearer ${token}` }
// //       })
      
// //       let availableMissions = 0
// //       if (missionsDisponiblesResponse.ok) {
// //         const data = await missionsDisponiblesResponse.json()
// //         availableMissions = data.missions?.length || 0
// //       }

// //       // Charger les missions du collecteur
// //       const mesMissionsResponse = await fetch(`${API_URL}/api/collecteurs/missions`, {
// //         headers: { 'Authorization': `Bearer ${token}` }
// //       })

// //       let mesMissions = []
// //       if (mesMissionsResponse.ok) {
// //         const data = await mesMissionsResponse.json()
// //         mesMissions = data.missions || []
// //       }

// //       // Charger les gains
// //       const gainsResponse = await fetch(`${API_URL}/api/collecteurs/gains`, {
// //         headers: { 'Authorization': `Bearer ${token}` }
// //       })

// //       let gainsData = { total: 0, valides: 0, enAttente: 0 }
// //       if (gainsResponse.ok) {
// //         const data = await gainsResponse.json()
// //         gainsData = data.resume || { total: 0, valides: 0, enAttente: 0 }
// //       }

// //       // Charger les notifications
// //       const notifResponse = await fetch(`${API_URL}/api/notifications`, {
// //         headers: { 'Authorization': `Bearer ${token}` }
// //       })

// //       let notificationsList = []
// //       if (notifResponse.ok) {
// //         const data = await notifResponse.json()
// //         notificationsList = data.notifications || []
// //       }

// //       // Charger le profil
// //       const profilResponse = await fetch(`${API_URL}/api/collecteurs/profil`, {
// //         headers: { 'Authorization': `Bearer ${token}` }
// //       })

// //       let profilData = null
// //       if (profilResponse.ok) {
// //         const data = await profilResponse.json()
// //         profilData = data.collecteur || data
// //       }

// //       // Mettre à jour l'utilisateur
// //       const user = getUser()
// //       if (profilData) {
// //         setUserData({
// //           firstName: profilData.nom_complet?.split(' ')[0] || user?.nomComplet?.split(' ')[0] || 'Collecteur',
// //           lastName: profilData.nom_complet?.split(' ').slice(1).join(' ') || '',
// //           businessStatus: profilData.type_collecteur || 'independant',
// //           nomComplet: profilData.nom_complet || user?.nomComplet || 'Collecteur'
// //         })
// //       } else if (user) {
// //         setUserData({
// //           firstName: user.nomComplet?.split(' ')[0] || 'Collecteur',
// //           lastName: user.nomComplet?.split(' ').slice(1).join(' ') || '',
// //           businessStatus: user.typeCollecteur || 'independant',
// //           nomComplet: user.nomComplet || 'Collecteur'
// //         })
// //       }

// //       // Calculer les stats
// //       const missionsEnCours = mesMissions.filter(m => m.statut === 'en_cours' || m.statut === 'acceptee').length
// //       const missionsValidees = mesMissions.filter(m => m.statut === 'validee' || m.statut === 'terminee').length

// //       setStats({
// //         totalMissions: dashboardData.dashboard?.total_missions || mesMissions.length || 0,
// //         availableMissions: availableMissions,
// //         inProgressMissions: missionsEnCours,
// //         completedMissions: missionsValidees,
// //         totalEarnings: gainsData.total || 0,
// //         thisMonthEarnings: gainsData.valides || 0,
// //         averageEarnings: mesMissions.length ? Math.round((gainsData.total || 0) / mesMissions.length) : 0,
// //         rating: 4.8
// //       })

// //       // Formater les missions récentes
// //       const formattedMissions = mesMissions.slice(0, 3).map(m => {
// //         const now = new Date()
// //         const created = new Date(m.date_creation)
// //         const diffMs = now - created
// //         const diffMins = Math.round(diffMs / 60000)
        
// //         let timeAgo = ''
// //         if (diffMins < 60) timeAgo = `Il y a ${diffMins} min`
// //         else if (diffMins < 1440) timeAgo = `Il y a ${Math.round(diffMins / 60)}h`
// //         else timeAgo = `Il y a ${Math.round(diffMins / 1440)}j`

// //         return {
// //           id: m.id,
// //           producerName: m.producteur_nom || 'Producteur',
// //           location: m.producteur_adresse || 'Adresse non spécifiée',
// //           wasteType: m.type_dechet || 'Déchets',
// //           quantity: `${m.quantite || 0} ${m.unite || 'kg'}`,
// //           status: m.statut === 'disponible' ? 'new' :
// //                   m.statut === 'acceptee' ? 'in_progress' :
// //                   m.statut === 'en_cours' ? 'in_progress' :
// //                   m.statut === 'validee' ? 'completed' : 
// //                   m.statut === 'terminee' ? 'completed' : 'new',
// //           earnings: m.gain_montant || m.estimation_gain || 0,
// //           timeAgo,
// //           urgency: m.urgence || 'medium'
// //         }
// //       })

// //       setRecentMissions(formattedMissions)

// //       // Formater les notifications
// //       const formattedNotifications = notificationsList.slice(0, 3).map((n, index) => ({
// //         id: index + 1,
// //         type: n.type === 'nouvelle_mission' ? 'new_mission' :
// //               n.type === 'paiement' ? 'payment' : 'mission_completed',
// //         title: n.titre || 'Notification',
// //         message: n.message || '',
// //         time: n.cree_le ? formatTimeAgo(new Date(n.cree_le)) : 'Récemment',
// //         read: n.lu || false
// //       }))

// //       setNotifications(formattedNotifications)

// //     } catch (error) {
// //       console.error('Erreur chargement données:', error)
// //       setError('Impossible de charger les données')
// //     } finally {
// //       setIsLoading(false)
// //     }
// //   }, [navigate])

// //   const formatTimeAgo = (date) => {
// //     const now = new Date()
// //     const diffMs = now - date
// //     const diffMins = Math.round(diffMs / 60000)
    
// //     if (diffMins < 60) return `Il y a ${diffMins} min`
// //     if (diffMins < 1440) return `Il y a ${Math.round(diffMins / 60)}h`
// //     return `Il y a ${Math.round(diffMins / 1440)}j`
// //   }

// //   useEffect(() => {
// //     loadDashboardData()
// //     const interval = setInterval(loadDashboardData, 30000)
// //     return () => clearInterval(interval)
// //   }, [loadDashboardData])

// //   useEffect(() => {
// //     const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
// //     const role = localStorage.getItem(STORAGE_KEYS.ROLE)
// //     if (!token || role !== 'collecteur') {
// //       navigate('/login')
// //     }
// //   }, [navigate])

// //   // Sidebar Component
// //   const Sidebar = () => (
// //     <>
// //       {/* Mobile Sidebar */}
// //       <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ease-in-out ${
// //         sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
// //       }`}>
// //         <div 
// //           className={`absolute inset-0 bg-black transition-opacity duration-300 ${
// //             sidebarOpen ? 'opacity-50' : 'opacity-0'
// //           }`}
// //           onClick={() => setSidebarOpen(false)}
// //         />
        
// //         <div className={`absolute top-0 left-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
// //           sidebarOpen ? 'translate-x-0' : '-translate-x-full'
// //         }`}>
// //           <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
// //             <div className="flex items-center justify-between">
// //               <div className="flex items-center gap-2">
// //                 <Truck className="w-8 h-8 text-white" />
// //                 <span className="text-xl font-bold text-white">EcoCollect</span>
// //               </div>
// //               <button
// //                 onClick={() => setSidebarOpen(false)}
// //                 className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
// //               >
// //                 <X className="w-5 h-5" />
// //               </button>
// //             </div>
// //           </div>

// //           <div className="p-4 border-b">
// //             <div className="flex items-center gap-3">
// //               <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
// //                 {getInitials(userData.nomComplet)}
// //               </div>
// //               <div>
// //                 <p className="font-medium text-gray-900">{userData.nomComplet || 'Collecteur'}</p>
// //                 <p className="text-xs text-gray-500">{userData.businessStatus === 'independant' ? 'Indépendant' : 'Coopérative'}</p>
// //               </div>
// //             </div>
// //           </div>

// //           <nav className="flex-1 p-4 overflow-y-auto">
// //             <div className="mb-6">
// //               <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
// //                 Principal
// //               </h3>
// //               <ul className="space-y-2">
// //                 <li>
// //                   <a href="/collecteur" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors bg-blue-50 text-blue-700 border-l-4 border-blue-600">
// //                     <Home className="w-5 h-5 text-blue-600" />
// //                     <span className="font-medium">Tableau de bord</span>
// //                   </a>
// //                 </li>
// //                 <li>
// //                   <a href="/collector/missions" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
// //                     <Package className="w-5 h-5 text-gray-400" />
// //                     <span className="font-medium">Missions</span>
// //                     {stats.availableMissions > 0 && (
// //                       <span className="ml-auto px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
// //                         {stats.availableMissions}
// //                       </span>
// //                     )}
// //                   </a>
// //                 </li>
// //                 <li>
// //                   <a href="/collector/wallet" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
// //                     <Wallet className="w-5 h-5 text-gray-400" />
// //                     <span className="font-medium">Mes gains</span>
// //                     {stats.totalEarnings > 0 && (
// //                       <span className="ml-auto px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
// //                         {stats.totalEarnings.toLocaleString()} FCFA
// //                       </span>
// //                     )}
// //                   </a>
// //                 </li>
// //                 <li>
// //                   <a href="/collector/history" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
// //                     <History className="w-5 h-5 text-gray-400" />
// //                     <span className="font-medium">Historique</span>
// //                   </a>
// //                 </li>
// //               </ul>
// //             </div>

// //             <div className="mb-6">
// //               <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
// //                 Compte
// //               </h3>
// //               <ul className="space-y-2">
// //                 <li>
// //                   <a href="/collector/profile" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
// //                     <User className="w-5 h-5 text-gray-400" />
// //                     <span className="font-medium">Mon profil</span>
// //                   </a>
// //                 </li>
// //                 <li>
// //                   <a href="/collector/settings" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
// //                     <Settings className="w-5 h-5 text-gray-400" />
// //                     <span className="font-medium">Paramètres</span>
// //                   </a>
// //                 </li>
// //                 <li>
// //                   <a href="/collector/help" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
// //                     <HelpCircle className="w-5 h-5 text-gray-400" />
// //                     <span className="font-medium">Aide</span>
// //                   </a>
// //                 </li>
// //               </ul>
// //             </div>

// //             <div className="mt-auto p-4 border-t">
// //               <button
// //                 onClick={handleLogout}
// //                 className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
// //               >
// //                 <LogOut className="w-5 h-5" />
// //                 <span className="font-medium">Déconnexion</span>
// //               </button>
// //             </div>
// //           </nav>
// //         </div>
// //       </div>

// //       {/* Desktop Sidebar */}
// //       <div className="hidden lg:block fixed top-0 left-0 h-screen bg-white shadow-xl z-50 w-72 overflow-hidden flex flex-col">
// //         <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
// //           <div className="flex items-center gap-2">
// //             <Truck className="w-8 h-8 text-white" />
// //             <span className="text-xl font-bold text-white">EcoCollect</span>
// //           </div>
// //         </div>

// //         <div className="p-4 border-b">
// //           <div className="flex items-center gap-3">
// //             <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
// //               {getInitials(userData.nomComplet)}
// //             </div>
// //             <div>
// //               <p className="font-medium text-gray-900">{userData.nomComplet || 'Collecteur'}</p>
// //               <p className="text-xs text-gray-500">{userData.businessStatus === 'independant' ? 'Indépendant' : 'Coopérative'}</p>
// //             </div>
// //           </div>
// //         </div>

// //         <nav className="flex-1 p-4 overflow-y-auto">
// //           <div className="mb-6">
// //             <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
// //               Principal
// //             </h3>
// //             <ul className="space-y-1">
// //               <li>
// //                 <a href="/collecteur" className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors bg-blue-50 text-blue-700 border-l-4 border-blue-600">
// //                   <div className="flex items-center gap-3">
// //                     <Home className="w-5 h-5 text-blue-600" />
// //                     <span className="font-medium">Tableau de bord</span>
// //                   </div>
// //                 </a>
// //               </li>
// //               <li>
// //                 <a href="/collector/missions" className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
// //                   <div className="flex items-center gap-3">
// //                     <Package className="w-5 h-5 text-gray-400" />
// //                     <span className="font-medium">Missions</span>
// //                   </div>
// //                   {stats.availableMissions > 0 && (
// //                     <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
// //                       {stats.availableMissions}
// //                     </span>
// //                   )}
// //                 </a>
// //               </li>
// //               <li>
// //                 <a href="/collector/wallet" className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
// //                   <div className="flex items-center gap-3">
// //                     <Wallet className="w-5 h-5 text-gray-400" />
// //                     <span className="font-medium">Mes gains</span>
// //                   </div>
// //                   {stats.totalEarnings > 0 && (
// //                     <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
// //                       {stats.totalEarnings.toLocaleString()} FCFA
// //                     </span>
// //                   )}
// //                 </a>
// //               </li>
// //               <li>
// //                 <a href="/collector/history" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
// //                   <History className="w-5 h-5 text-gray-400" />
// //                   <span className="font-medium">Historique</span>
// //                 </a>
// //               </li>
// //             </ul>
// //           </div>

// //           <div className="mb-6">
// //             <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
// //               Compte
// //             </h3>
// //             <ul className="space-y-1">
// //               <li>
// //                 <a href="/collector/profile" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
// //                   <User className="w-5 h-5 text-gray-400" />
// //                   <span className="font-medium">Mon profil</span>
// //                 </a>
// //               </li>
// //               <li>
// //                 <a href="/collector/settings" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
// //                   <Settings className="w-5 h-5 text-gray-400" />
// //                   <span className="font-medium">Paramètres</span>
// //                 </a>
// //               </li>
// //               <li>
// //                 <a href="/collector/help" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
// //                   <HelpCircle className="w-5 h-5 text-gray-400" />
// //                   <span className="font-medium">Aide</span>
// //                 </a>
// //               </li>
// //             </ul>
// //           </div>

// //           <div className="mt-auto p-4 border-t">
// //             <button
// //               onClick={handleLogout}
// //               className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
// //             >
// //               <LogOut className="w-5 h-5" />
// //               <span className="font-medium">Déconnexion</span>
// //             </button>
// //           </div>
// //         </nav>
// //       </div>
// //     </>
// //   )

// //   if (isLoading) {
// //     return (
// //       <div className="min-h-screen bg-gray-50">
// //         <Sidebar />
// //         <div className="lg:ml-72 min-h-screen">
// //           <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
// //             <div className="px-4 py-3 flex items-center justify-between">
// //               <button
// //                 onClick={() => setSidebarOpen(true)}
// //                 className="p-2 hover:bg-gray-100 rounded-lg"
// //               >
// //                 <Menu className="w-6 h-6 text-gray-600" />
// //               </button>
// //               <div className="flex items-center gap-2">
// //                 <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
// //                   {getInitials(userData.nomComplet)}
// //                 </div>
// //               </div>
// //             </div>
// //           </header>
// //           <div className="flex items-center justify-center h-[calc(100vh-64px)]">
// //             <div className="text-center">
// //               <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
// //               <p className="text-gray-600">Chargement de votre tableau de bord...</p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     )
// //   }

// //   if (error) {
// //     return (
// //       <div className="min-h-screen bg-gray-50">
// //         <Sidebar />
// //         <div className="lg:ml-72 min-h-screen">
// //           <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
// //             <div className="px-4 py-3 flex items-center justify-between">
// //               <button
// //                 onClick={() => setSidebarOpen(true)}
// //                 className="p-2 hover:bg-gray-100 rounded-lg"
// //               >
// //                 <Menu className="w-6 h-6 text-gray-600" />
// //               </button>
// //               <div className="flex items-center gap-2">
// //                 <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
// //                   {getInitials(userData.nomComplet)}
// //                 </div>
// //               </div>
// //             </div>
// //           </header>
// //           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //             <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
// //               <p className="text-red-600">{error}</p>
// //               <button onClick={loadDashboardData} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
// //                 Réessayer
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <Sidebar />
      
// //       {/* Header mobile */}
// //       <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
// //         <div className="px-4 py-3 flex items-center justify-between">
// //           <button
// //             onClick={() => setSidebarOpen(true)}
// //             className="p-2 hover:bg-gray-100 rounded-lg"
// //           >
// //             <Menu className="w-6 h-6 text-gray-600" />
// //           </button>
// //           <div className="flex items-center gap-2">
// //             <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
// //               {getInitials(userData.nomComplet)}
// //             </div>
// //           </div>
// //         </div>
// //       </header>

// //       {/* Main Content */}
// //       <div className="lg:ml-72 min-h-screen">
// //         <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //           {/* Welcome Section */}
// //           <div className="mb-8">
// //             <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
// //               <div className="flex items-center justify-between">
// //                 <div>
// //                   <h1 className="text-2xl font-bold mb-2">
// //                     Bienvenue, {userData.firstName} ! 👋
// //                   </h1>
// //                   <p className="text-blue-100">
// //                     {userData.businessStatus === 'independant' 
// //                       ? 'Prêt pour de nouvelles missions aujourd\'hui ?' 
// //                       : 'Votre équipe est prête pour de nouvelles missions ?'}
// //                   </p>
// //                 </div>
// //                 <div className="text-right">
// //                   <p className="text-3xl font-bold">{stats.availableMissions}</p>
// //                   <p className="text-blue-100 text-sm">Missions disponibles</p>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Stats Grid */}
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
// //             <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
// //               <div className="flex items-center justify-between mb-4">
// //                 <div className="p-3 bg-blue-100 rounded-lg">
// //                   <Target className="h-6 w-6 text-blue-600" />
// //                 </div>
// //                 <span className="text-2xl font-bold text-gray-900">{stats.totalMissions}</span>
// //               </div>
// //               <p className="text-sm text-gray-600">Total missions</p>
// //               <div className="mt-2 flex items-center text-xs text-green-600">
// //                 <TrendingUp className="h-3 w-3 mr-1" />
// //                 +{stats.totalMissions > 0 ? Math.round((stats.completedMissions / stats.totalMissions) * 100) : 0}% terminées
// //               </div>
// //             </div>

// //             <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
// //               <div className="flex items-center justify-between mb-4">
// //                 <div className="p-3 bg-green-100 rounded-lg">
// //                   <DollarSign className="h-6 w-6 text-green-600" />
// //                 </div>
// //                 <span className="text-2xl font-bold text-gray-900">{stats.totalEarnings.toLocaleString()}</span>
// //               </div>
// //               <p className="text-sm text-gray-600">Gains totaux (FCFA)</p>
// //               <div className="mt-2 flex items-center text-xs text-green-600">
// //                 <TrendingUp className="h-3 w-3 mr-1" />
// //                 {stats.thisMonthEarnings.toLocaleString()} FCFA ce mois
// //               </div>
// //             </div>

// //             <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
// //               <div className="flex items-center justify-between mb-4">
// //                 <div className="p-3 bg-purple-100 rounded-lg">
// //                   <Activity className="h-6 w-6 text-purple-600" />
// //                 </div>
// //                 <span className="text-2xl font-bold text-gray-900">{stats.inProgressMissions}</span>
// //               </div>
// //               <p className="text-sm text-gray-600">En cours</p>
// //               <div className="mt-2 flex items-center text-xs text-purple-600">
// //                 <Clock className="h-3 w-3 mr-1" />
// //                 {stats.availableMissions} disponibles
// //               </div>
// //             </div>

// //             <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
// //               <div className="flex items-center justify-between mb-4">
// //                 <div className="p-3 bg-yellow-100 rounded-lg">
// //                   <Star className="h-6 w-6 text-yellow-600" />
// //                 </div>
// //                 <span className="text-2xl font-bold text-gray-900">{stats.rating}</span>
// //               </div>
// //               <p className="text-sm text-gray-600">Note moyenne</p>
// //               <div className="mt-2 flex items-center text-xs text-yellow-600">
// //                 <Award className="h-3 w-3 mr-1" />
// //                 {stats.completedMissions} missions validées
// //               </div>
// //             </div>
// //           </div>

// //           {/* Recent Missions & Notifications */}
// //           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
// //             <div className="lg:col-span-2">
// //               <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
// //                 <div className="flex items-center justify-between mb-6">
// //                   <h3 className="text-lg font-bold text-gray-900">Missions récentes</h3>
// //                   <a href="/collector/missions" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
// //                     Voir tout
// //                   </a>
// //                 </div>
                
// //                 <div className="space-y-4">
// //                   {recentMissions.length > 0 ? (
// //                     recentMissions.slice(0, 3).map((mission) => (
// //                       <div key={mission.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
// //                         <div className="flex items-start justify-between">
// //                           <div className="flex-1">
// //                             <div className="flex items-center gap-2 mb-2">
// //                               <h4 className="font-semibold text-gray-900">{mission.producerName}</h4>
// //                               <span className={`px-2 py-1 rounded-full text-xs font-medium ${
// //                                 mission.status === 'new' ? 'bg-blue-100 text-blue-700' :
// //                                 mission.status === 'in_progress' ? 'bg-purple-100 text-purple-700' :
// //                                 'bg-green-100 text-green-700'
// //                               }`}>
// //                                 {mission.status === 'new' ? 'Nouvelle' :
// //                                  mission.status === 'in_progress' ? 'En cours' : 'Terminée'}
// //                               </span>
// //                             </div>
                            
// //                             <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
// //                               <div className="flex items-center gap-1">
// //                                 <MapPin className="h-3 w-3" />
// //                                 {mission.location}
// //                               </div>
// //                               <div className="flex items-center gap-1">
// //                                 <Package className="h-3 w-3" />
// //                                 {mission.wasteType} • {mission.quantity}
// //                               </div>
// //                             </div>
                            
// //                             <div className="flex items-center justify-between">
// //                               <span className="text-xs text-gray-500">{mission.timeAgo}</span>
// //                               <span className="text-sm font-semibold text-green-600">{mission.earnings.toLocaleString()} FCFA</span>
// //                             </div>
// //                           </div>
                          
// //                           <a href={`/collector/missions/${mission.id}`} className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
// //                             <ArrowRight className="h-4 w-4" />
// //                           </a>
// //                         </div>
// //                       </div>
// //                     ))
// //                   ) : (
// //                     <p className="text-center text-gray-500 py-4">Aucune mission récente</p>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>

// //             <div>
// //               <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
// //                 <div className="flex items-center justify-between mb-6">
// //                   <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
// //                   <a href="/collector/notifications" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
// //                     Voir tout
// //                   </a>
// //                 </div>
                
// //                 <div className="space-y-4">
// //                   {notifications.length > 0 ? (
// //                     notifications.map((notification) => (
// //                       <div key={notification.id} className={`p-3 rounded-lg border ${
// //                         !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
// //                       }`}>
// //                         <div className="flex items-start gap-3">
// //                           <div className={`p-2 rounded-lg ${
// //                             notification.type === 'new_mission' ? 'bg-blue-100' :
// //                             notification.type === 'payment' ? 'bg-green-100' :
// //                             'bg-purple-100'
// //                           }`}>
// //                             {notification.type === 'new_mission' ? <Package className="h-4 w-4 text-blue-600" /> :
// //                              notification.type === 'payment' ? <DollarSign className="h-4 w-4 text-green-600" /> :
// //                              <CheckCircle className="h-4 w-4 text-purple-600" />}
// //                           </div>
// //                           <div className="flex-1">
// //                             <p className="text-sm font-medium text-gray-900">{notification.title}</p>
// //                             <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
// //                             <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     ))
// //                   ) : (
// //                     <p className="text-center text-gray-500 py-4">Aucune notification</p>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Quick Actions */}
// //           <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
// //             <h3 className="text-lg font-bold text-gray-900 mb-6">Actions rapides</h3>
            
// //             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //               <a href="/collector/missions" className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group">
// //                 <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors">
// //                   <Target className="h-5 w-5 text-white" />
// //                 </div>
// //                 <div>
// //                   <p className="font-medium text-gray-900">Voir missions</p>
// //                   <p className="text-xs text-gray-600">{stats.availableMissions} disponibles</p>
// //                 </div>
// //               </a>

// //               <a href="/collector/wallet" className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group">
// //                 <div className="p-2 bg-green-600 rounded-lg group-hover:bg-green-700 transition-colors">
// //                   <DollarSign className="h-5 w-5 text-white" />
// //                 </div>
// //                 <div>
// //                   <p className="font-medium text-gray-900">Mes gains</p>
// //                   <p className="text-xs text-gray-600">{stats.totalEarnings.toLocaleString()} FCFA</p>
// //                 </div>
// //               </a>

// //               <a href="/collector/depot" className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group">
// //                 <div className="p-2 bg-purple-600 rounded-lg group-hover:bg-purple-700 transition-colors">
// //                   <Package className="h-5 w-5 text-white" />
// //                 </div>
// //                 <div>
// //                   <p className="font-medium text-gray-900">Points de dépôt</p>
// //                   <p className="text-xs text-gray-600">Voir la liste</p>
// //                 </div>
// //               </a>

// //               <a href="/collector/profile" className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors group">
// //                 <div className="p-2 bg-yellow-600 rounded-lg group-hover:bg-yellow-700 transition-colors">
// //                   <Users className="h-5 w-5 text-white" />
// //                 </div>
// //                 <div>
// //                   <p className="font-medium text-gray-900">Mon profil</p>
// //                   <p className="text-xs text-gray-600">Gérer compte</p>
// //                 </div>
// //               </a>
// //             </div>
// //           </div>
// //         </main>
// //       </div>
// //     </div>
// //   )
// // }

// // export default DashboardCollector



// import { useState, useEffect, useCallback } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { 
//   Package, Clock, CheckCircle, TrendingUp, Award, 
//   BarChart3, Target, DollarSign, Bell, ArrowRight,
//   Truck, MapPin, Star, Activity, Users, Calendar,
//   Menu, X, LogOut, User, Settings, HelpCircle,
//   Home, Wallet, History, Map, Navigation, LayoutDashboard
// } from 'lucide-react'

// const DashboardCollector = () => {
//   const navigate = useNavigate()
//   const [userData, setUserData] = useState({
//     firstName: '',
//     lastName: '',
//     businessStatus: 'independent',
//     nomComplet: ''
//   })

//   const [stats, setStats] = useState({
//     totalMissions: 0,
//     availableMissions: 0,
//     inProgressMissions: 0,
//     completedMissions: 0,
//     totalEarnings: 0,
//     thisMonthEarnings: 0,
//     averageEarnings: 0,
//     rating: 0
//   })

//   const [recentMissions, setRecentMissions] = useState([])
//   const [notifications, setNotifications] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [sidebarOpen, setSidebarOpen] = useState(false)

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

//   const handleLogout = () => {
//     if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
//       localStorage.removeItem(STORAGE_KEYS.TOKEN)
//       localStorage.removeItem(STORAGE_KEYS.USER)
//       localStorage.removeItem(STORAGE_KEYS.ROLE)
//       navigate('/login')
//     }
//   }

//   const getInitials = (name) => {
//     if (!name) return 'C'
//     return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
//   }

//   const formatTimeAgo = (date) => {
//     const now = new Date()
//     const diffMs = now - date
//     const diffMins = Math.round(diffMs / 60000)
    
//     if (diffMins < 60) return `Il y a ${diffMins} min`
//     if (diffMins < 1440) return `Il y a ${Math.round(diffMins / 60)}h`
//     return `Il y a ${Math.round(diffMins / 1440)}j`
//   }

//   const loadDashboardData = useCallback(async () => {
//     const token = getToken()
//     if (!token) {
//       navigate('/login')
//       return
//     }

//     setIsLoading(true)
//     setError(null)

//     try {
//       // Charger le tableau de bord
//       const dashboardResponse = await fetch(`${API_URL}/api/collecteurs/tableau-bord`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       })

//       if (!dashboardResponse.ok) throw new Error('Erreur chargement dashboard')
//       const dashboardData = await dashboardResponse.json()
      
//       // Charger les missions disponibles
//       const missionsDisponiblesResponse = await fetch(`${API_URL}/api/collecteurs/missions/disponibles`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       })
      
//       let availableMissions = 0
//       if (missionsDisponiblesResponse.ok) {
//         const data = await missionsDisponiblesResponse.json()
//         availableMissions = data.missions?.length || 0
//       }

//       // Charger les missions du collecteur
//       const mesMissionsResponse = await fetch(`${API_URL}/api/collecteurs/missions`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       })

//       let mesMissions = []
//       if (mesMissionsResponse.ok) {
//         const data = await mesMissionsResponse.json()
//         mesMissions = data.missions || []
//       }

//       // Charger les gains
//       const gainsResponse = await fetch(`${API_URL}/api/collecteurs/gains`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       })

//       let gainsData = { total: 0, valides: 0, enAttente: 0 }
//       if (gainsResponse.ok) {
//         const data = await gainsResponse.json()
//         gainsData = data.resume || { total: 0, valides: 0, enAttente: 0 }
//       }

//       // Charger les notifications
//       const notifResponse = await fetch(`${API_URL}/api/notifications`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       })

//       let notificationsList = []
//       if (notifResponse.ok) {
//         const data = await notifResponse.json()
//         notificationsList = data.notifications || []
//       }

//       // Charger le profil
//       const profilResponse = await fetch(`${API_URL}/api/collecteurs/profil`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       })

//       let profilData = null
//       if (profilResponse.ok) {
//         const data = await profilResponse.json()
//         profilData = data.collecteur || data
//       }

//       // Mettre à jour l'utilisateur
//       const user = getUser()
//       if (profilData) {
//         setUserData({
//           firstName: profilData.nom_complet?.split(' ')[0] || user?.nomComplet?.split(' ')[0] || 'Collecteur',
//           lastName: profilData.nom_complet?.split(' ').slice(1).join(' ') || '',
//           businessStatus: profilData.type_collecteur || 'independant',
//           nomComplet: profilData.nom_complet || user?.nomComplet || 'Collecteur'
//         })
//       } else if (user) {
//         setUserData({
//           firstName: user.nomComplet?.split(' ')[0] || 'Collecteur',
//           lastName: user.nomComplet?.split(' ').slice(1).join(' ') || '',
//           businessStatus: user.typeCollecteur || 'independant',
//           nomComplet: user.nomComplet || 'Collecteur'
//         })
//       }

//       // Calculer les stats
//       const missionsEnCours = mesMissions.filter(m => m.statut === 'en_cours' || m.statut === 'acceptee').length
//       const missionsValidees = mesMissions.filter(m => m.statut === 'validee' || m.statut === 'terminee').length

//       setStats({
//         totalMissions: dashboardData.dashboard?.total_missions || mesMissions.length || 0,
//         availableMissions: availableMissions,
//         inProgressMissions: missionsEnCours,
//         completedMissions: missionsValidees,
//         totalEarnings: gainsData.total || 0,
//         thisMonthEarnings: gainsData.valides || 0,
//         averageEarnings: mesMissions.length ? Math.round((gainsData.total || 0) / mesMissions.length) : 0,
//         rating: 4.8
//       })

//       // Formater les missions récentes
//       const formattedMissions = mesMissions.slice(0, 3).map(m => {
//         const now = new Date()
//         const created = new Date(m.date_creation)
//         const diffMs = now - created
//         const diffMins = Math.round(diffMs / 60000)
        
//         let timeAgo = ''
//         if (diffMins < 60) timeAgo = `Il y a ${diffMins} min`
//         else if (diffMins < 1440) timeAgo = `Il y a ${Math.round(diffMins / 60)}h`
//         else timeAgo = `Il y a ${Math.round(diffMins / 1440)}j`

//         return {
//           id: m.id,
//           producerName: m.producteur_nom || 'Producteur',
//           location: m.producteur_adresse || 'Adresse non spécifiée',
//           wasteType: m.type_dechet || 'Déchets',
//           quantity: `${m.quantite || 0} ${m.unite || 'kg'}`,
//           status: m.statut === 'disponible' ? 'new' :
//                   m.statut === 'acceptee' ? 'in_progress' :
//                   m.statut === 'en_cours' ? 'in_progress' :
//                   m.statut === 'validee' ? 'completed' : 
//                   m.statut === 'terminee' ? 'completed' : 'new',
//           earnings: m.gain_montant || m.estimation_gain || 0,
//           timeAgo,
//           urgency: m.urgence || 'medium'
//         }
//       })

//       setRecentMissions(formattedMissions)

//       // Formater les notifications
//       const formattedNotifications = notificationsList.slice(0, 3).map((n, index) => ({
//         id: index + 1,
//         type: n.type === 'nouvelle_mission' ? 'new_mission' :
//               n.type === 'paiement' ? 'payment' : 'mission_completed',
//         title: n.titre || 'Notification',
//         message: n.message || '',
//         time: n.cree_le ? formatTimeAgo(new Date(n.cree_le)) : 'Récemment',
//         read: n.lu || false
//       }))

//       setNotifications(formattedNotifications)

//     } catch (error) {
//       console.error('Erreur chargement données:', error)
//       setError('Impossible de charger les données')
//     } finally {
//       setIsLoading(false)
//     }
//   }, [navigate])

//   useEffect(() => {
//     loadDashboardData()
//     const interval = setInterval(loadDashboardData, 30000)
//     return () => clearInterval(interval)
//   }, [loadDashboardData])

//   useEffect(() => {
//     const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
//     const role = localStorage.getItem(STORAGE_KEYS.ROLE)
//     if (!token || role !== 'collecteur') {
//       navigate('/login')
//     }
//   }, [navigate])

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
//                 <p className="text-xs text-gray-500">{userData.businessStatus === 'independant' ? 'Indépendant' : 'Coopérative'}</p>
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
//                   <a href="/collecteur" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors bg-blue-50 text-blue-700 border-l-4 border-blue-600">
//                     <LayoutDashboard className="w-5 h-5 text-blue-600" />
//                     <span className="font-medium">Tableau de bord</span>
//                   </a>
//                 </li>
//                 <li>
//                   <a href="/collector/missions" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
//                     <Package className="w-5 h-5 text-gray-400" />
//                     <span className="font-medium">Missions</span>
//                     {stats.availableMissions > 0 && (
//                       <span className="ml-auto px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
//                         {stats.availableMissions}
//                       </span>
//                     )}
//                   </a>
//                 </li>
//                 <li>
//                   <a href="/collector/wallet" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
//                     <Wallet className="w-5 h-5 text-gray-400" />
//                     <span className="font-medium">Mes gains</span>
//                     {stats.totalEarnings > 0 && (
//                       <span className="ml-auto px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
//                         {stats.totalEarnings.toLocaleString()} FCFA
//                       </span>
//                     )}
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
//               <p className="text-xs text-gray-500">{userData.businessStatus === 'independant' ? 'Indépendant' : 'Coopérative'}</p>
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
//                 <a href="/collecteur" className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors bg-blue-50 text-blue-700 border-l-4 border-blue-600">
//                   <div className="flex items-center gap-3">
//                     <LayoutDashboard className="w-5 h-5 text-blue-600" />
//                     <span className="font-medium">Tableau de bord</span>
//                   </div>
//                 </a>
//               </li>
//               <li>
//                 <a href="/collector/missions" className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
//                   <div className="flex items-center gap-3">
//                     <Package className="w-5 h-5 text-gray-400" />
//                     <span className="font-medium">Missions</span>
//                   </div>
//                   {stats.availableMissions > 0 && (
//                     <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
//                       {stats.availableMissions}
//                     </span>
//                   )}
//                 </a>
//               </li>
//               <li>
//                 <a href="/collector/wallet" className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900">
//                   <div className="flex items-center gap-3">
//                     <Wallet className="w-5 h-5 text-gray-400" />
//                     <span className="font-medium">Mes gains</span>
//                   </div>
//                   {stats.totalEarnings > 0 && (
//                     <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
//                       {stats.totalEarnings.toLocaleString()} FCFA
//                     </span>
//                   )}
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

//   if (isLoading) {
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
//               <p className="text-gray-600">Chargement de votre tableau de bord...</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
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
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//             <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
//               <p className="text-red-600">{error}</p>
//               <button 
//                 onClick={loadDashboardData} 
//                 className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//               >
//                 Réessayer
//               </button>
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
//           {/* Welcome Section */}
//           <div className="mb-8">
//             <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h1 className="text-2xl font-bold mb-2">
//                     Bienvenue, {userData.firstName} ! 👋
//                   </h1>
//                   <p className="text-blue-100">
//                     {userData.businessStatus === 'independant' 
//                       ? 'Prêt pour de nouvelles missions aujourd\'hui ?' 
//                       : 'Votre équipe est prête pour de nouvelles missions ?'}
//                   </p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-3xl font-bold">{stats.availableMissions}</p>
//                   <p className="text-blue-100 text-sm">Missions disponibles</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Stats Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="p-3 bg-blue-100 rounded-lg">
//                   <Target className="h-6 w-6 text-blue-600" />
//                 </div>
//                 <span className="text-2xl font-bold text-gray-900">{stats.totalMissions}</span>
//               </div>
//               <p className="text-sm text-gray-600">Total missions</p>
//               <div className="mt-2 flex items-center text-xs text-green-600">
//                 <TrendingUp className="h-3 w-3 mr-1" />
//                 +{stats.totalMissions > 0 ? Math.round((stats.completedMissions / stats.totalMissions) * 100) : 0}% terminées
//               </div>
//             </div>

//             <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="p-3 bg-green-100 rounded-lg">
//                   <DollarSign className="h-6 w-6 text-green-600" />
//                 </div>
//                 <span className="text-2xl font-bold text-gray-900">{stats.totalEarnings.toLocaleString()}</span>
//               </div>
//               <p className="text-sm text-gray-600">Gains totaux (FCFA)</p>
//               <div className="mt-2 flex items-center text-xs text-green-600">
//                 <TrendingUp className="h-3 w-3 mr-1" />
//                 {stats.thisMonthEarnings.toLocaleString()} FCFA ce mois
//               </div>
//             </div>

//             <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="p-3 bg-purple-100 rounded-lg">
//                   <Activity className="h-6 w-6 text-purple-600" />
//                 </div>
//                 <span className="text-2xl font-bold text-gray-900">{stats.inProgressMissions}</span>
//               </div>
//               <p className="text-sm text-gray-600">En cours</p>
//               <div className="mt-2 flex items-center text-xs text-purple-600">
//                 <Clock className="h-3 w-3 mr-1" />
//                 {stats.availableMissions} disponibles
//               </div>
//             </div>

//             <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="p-3 bg-yellow-100 rounded-lg">
//                   <Star className="h-6 w-6 text-yellow-600" />
//                 </div>
//                 <span className="text-2xl font-bold text-gray-900">{stats.rating}</span>
//               </div>
//               <p className="text-sm text-gray-600">Note moyenne</p>
//               <div className="mt-2 flex items-center text-xs text-yellow-600">
//                 <Award className="h-3 w-3 mr-1" />
//                 {stats.completedMissions} missions validées
//               </div>
//             </div>
//           </div>

//           {/* Recent Missions & Notifications */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//             <div className="lg:col-span-2">
//               <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-lg font-bold text-gray-900">Missions récentes</h3>
//                   <a href="/collector/missions" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
//                     Voir tout
//                   </a>
//                 </div>
                
//                 <div className="space-y-4">
//                   {recentMissions.length > 0 ? (
//                     recentMissions.slice(0, 3).map((mission) => (
//                       <div key={mission.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
//                         <div className="flex items-start justify-between">
//                           <div className="flex-1">
//                             <div className="flex items-center gap-2 mb-2">
//                               <h4 className="font-semibold text-gray-900">{mission.producerName}</h4>
//                               <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                 mission.status === 'new' ? 'bg-blue-100 text-blue-700' :
//                                 mission.status === 'in_progress' ? 'bg-purple-100 text-purple-700' :
//                                 'bg-green-100 text-green-700'
//                               }`}>
//                                 {mission.status === 'new' ? 'Nouvelle' :
//                                  mission.status === 'in_progress' ? 'En cours' : 'Terminée'}
//                               </span>
//                             </div>
                            
//                             <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
//                               <div className="flex items-center gap-1">
//                                 <MapPin className="h-3 w-3" />
//                                 {mission.location}
//                               </div>
//                               <div className="flex items-center gap-1">
//                                 <Package className="h-3 w-3" />
//                                 {mission.wasteType} • {mission.quantity}
//                               </div>
//                             </div>
                            
//                             <div className="flex items-center justify-between">
//                               <span className="text-xs text-gray-500">{mission.timeAgo}</span>
//                               <span className="text-sm font-semibold text-green-600">{mission.earnings.toLocaleString()} FCFA</span>
//                             </div>
//                           </div>
                          
//                           <a href={`/collector/missions/${mission.id}`} className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
//                             <ArrowRight className="h-4 w-4" />
//                           </a>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-center text-gray-500 py-4">Aucune mission récente</p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div>
//               <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
//                   <a href="/collector/notifications" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
//                     Voir tout
//                   </a>
//                 </div>
                
//                 <div className="space-y-4">
//                   {notifications.length > 0 ? (
//                     notifications.map((notification) => (
//                       <div key={notification.id} className={`p-3 rounded-lg border ${
//                         !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
//                       }`}>
//                         <div className="flex items-start gap-3">
//                           <div className={`p-2 rounded-lg ${
//                             notification.type === 'new_mission' ? 'bg-blue-100' :
//                             notification.type === 'payment' ? 'bg-green-100' :
//                             'bg-purple-100'
//                           }`}>
//                             {notification.type === 'new_mission' ? <Package className="h-4 w-4 text-blue-600" /> :
//                              notification.type === 'payment' ? <DollarSign className="h-4 w-4 text-green-600" /> :
//                              <CheckCircle className="h-4 w-4 text-purple-600" />}
//                           </div>
//                           <div className="flex-1">
//                             <p className="text-sm font-medium text-gray-900">{notification.title}</p>
//                             <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
//                             <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-center text-gray-500 py-4">Aucune notification</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Quick Actions */}
//           <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
//             <h3 className="text-lg font-bold text-gray-900 mb-6">Actions rapides</h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <a href="/collector/missions" className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group">
//                 <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors">
//                   <Target className="h-5 w-5 text-white" />
//                 </div>
//                 <div>
//                   <p className="font-medium text-gray-900">Voir missions</p>
//                   <p className="text-xs text-gray-600">{stats.availableMissions} disponibles</p>
//                 </div>
//               </a>

//               <a href="/collector/wallet" className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group">
//                 <div className="p-2 bg-green-600 rounded-lg group-hover:bg-green-700 transition-colors">
//                   <DollarSign className="h-5 w-5 text-white" />
//                 </div>
//                 <div>
//                   <p className="font-medium text-gray-900">Mes gains</p>
//                   <p className="text-xs text-gray-600">{stats.totalEarnings.toLocaleString()} FCFA</p>
//                 </div>
//               </a>

//               <a href="/collector/depot" className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group">
//                 <div className="p-2 bg-purple-600 rounded-lg group-hover:bg-purple-700 transition-colors">
//                   <Package className="h-5 w-5 text-white" />
//                 </div>
//                 <div>
//                   <p className="font-medium text-gray-900">Points de dépôt</p>
//                   <p className="text-xs text-gray-600">Voir la liste</p>
//                 </div>
//               </a>

//               <a href="/collector/profile" className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors group">
//                 <div className="p-2 bg-yellow-600 rounded-lg group-hover:bg-yellow-700 transition-colors">
//                   <Users className="h-5 w-5 text-white" />
//                 </div>
//                 <div>
//                   <p className="font-medium text-gray-900">Mon profil</p>
//                   <p className="text-xs text-gray-600">Gérer compte</p>
//                 </div>
//               </a>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }

// export default DashboardCollector



import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Routes, Route, Link } from 'react-router-dom'
import { 
  Package, Clock, CheckCircle, TrendingUp, Award, 
  BarChart3, Target, DollarSign, Bell, ArrowRight,
  Truck, MapPin, Star, Activity, Users, Calendar,
  Menu, X, LogOut, User, Settings, HelpCircle,
  Home, Wallet, History, Map, Navigation, LayoutDashboard,
  Filter, Search, Phone, MessageSquare, Eye, ChevronRight,
  Navigation2, Camera, Check, Flag, Scale,
  Edit2, Save, Upload, Building, Shield,
  Download, ArrowUpRight, ArrowDownRight, CreditCard, Banknote, 
  PiggyBank, Receipt, AlertCircle, Trash2, Archive, Volume2, VolumeX,
  Wifi, WifiOff, PhoneCall ,  Info
} from 'lucide-react'

// ==================== COMPOSANT PRINCIPAL ====================
const DashboardCollector = () => {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [userData, setUserData] = useState({
    nomComplet: '',
    email: '',
    telephone: '',
    type_collecteur: 'independant',
    zone_intervention_nom: '',
    photo_profil_url: '',
    points_total: 0,
    rating: 4.8,
    totalMissions: 0
  })

  // const API_URL = import.meta.env.VITE_API_URL || 'https://ecobackend-7tuh.vercel.app'   http://localhost:3000
  const API_URL = 'http://localhost:3000';
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
  useEffect(() => {
    const token = getToken()
    const role = localStorage.getItem(STORAGE_KEYS.ROLE)
    
    if (!token || role !== 'collecteur') {
      navigate('/login')
      return
    }

    const loadUserData = async () => {
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
            telephone: profil.telephone || '',
            type_collecteur: profil.type_collecteur || 'independant',
            zone_intervention_nom: profil.zone_intervention_nom || '',
            photo_profil_url: profil.photo_profil_url || '',
            points_total: profil.points_total || 0,
            rating: profil.note_moyenne || 4.8,
            totalMissions: profil.nombre_missions || 0
          })
        }
      } catch (error) {
        console.error('Erreur chargement utilisateur:', error)
      }
    }

    loadUserData()
  }, [navigate])

  // ==================== SIDEBAR COMPOSANT ====================
  const Sidebar = () => {
    const menuItems = {
      principal: [
        { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, path: '/collecteur' },
        { id: 'missions', label: 'Missions', icon: Package, path: '/collecteur/missions', badge: 'new' },
        { id: 'wallet', label: 'Mes gains', icon: Wallet, path: '/collecteur/wallet' },
        { id: 'history', label: 'Historique', icon: History, path: '/collecteur/history' }
      ],
      compte: [
        { id: 'profile', label: 'Mon profil', icon: User, path: '/collecteur/profile' },
        { id: 'notifications', label: 'Notifications', icon: Bell, path: '/collecteur/notifications', badge: 'unread' },
        { id: 'settings', label: 'Paramètres', icon: Settings, path: '/collecteur/settings' },
        { id: 'help', label: 'Aide', icon: HelpCircle, path: '/collecteur/help' }
      ]
    }

    const NavSection = ({ title, items }) => (
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
          {title}
        </h3>
        <ul className="space-y-1">
          {items.map(item => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            
            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  onClick={() => {
                    setCurrentPage(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item.badge === 'new' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {item.badge === 'new' ? 'Nouveau' : '3'}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    )

    return (
      <>
        {/* Mobile Sidebar */}
        <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
          <div 
            className={`absolute inset-0 bg-black transition-opacity duration-300 ${
              sidebarOpen ? 'opacity-50' : 'opacity-0'
            }`}
            onClick={() => setSidebarOpen(false)}
          />
          
          <div className={`absolute top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            {/* Header */}
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

            {/* User Info */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {getInitials(userData.nomComplet)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{userData.nomComplet || 'Collecteur'}</p>
                  <p className="text-xs text-gray-500">{userData.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-600">{userData.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              <NavSection title="Principal" items={menuItems.principal} />
              <NavSection title="Compte" items={menuItems.compte} />

              {/* Logout Button */}
              <div className="mt-6 pt-6 border-t">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Déconnexion</span>
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block fixed top-0 left-0 h-screen bg-white shadow-xl z-40 w-80 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
            <div className="flex items-center gap-2">
              <Truck className="w-8 h-8 text-white" />
              <span className="text-xl font-bold text-white">EcoCollect</span>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {getInitials(userData.nomComplet)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{userData.nomComplet || 'Collecteur'}</p>
                <p className="text-xs text-gray-500">{userData.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-600">{userData.rating}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <NavSection title="Principal" items={menuItems.principal} />
            <NavSection title="Compte" items={menuItems.compte} />

            {/* Logout Button */}
            <div className="mt-6 pt-6 border-t">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Déconnexion</span>
              </button>
            </div>
          </nav>
        </div>
      </>
    )
  }

  // ==================== PAGE TABLEAU DE BORD ====================
  const DashboardPage = () => {
    const [stats, setStats] = useState({
      totalMissions: 0,
      availableMissions: 0,
      inProgressMissions: 0,
      completedMissions: 0,
      totalEarnings: 0,
      thisMonthEarnings: 0,
      averageEarnings: 0,
      rating: 4.8
    })
    const [recentMissions, setRecentMissions] = useState([])
    const [notifications, setNotifications] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const loadDashboardData = useCallback(async () => {
      const token = getToken()
      if (!token) return

      setIsLoading(true)
      setError(null)

      try {
        const dashboardResponse = await fetch(`${API_URL}/api/collecteurs/tableau-bord`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (!dashboardResponse.ok) throw new Error('Erreur chargement dashboard')
        const dashboardData = await dashboardResponse.json()
        
        const missionsDisponiblesResponse = await fetch(`${API_URL}/api/collecteurs/missions/disponibles`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        let availableMissions = 0
        if (missionsDisponiblesResponse.ok) {
          const data = await missionsDisponiblesResponse.json()
          availableMissions = data.missions?.length || 0
        }

        const mesMissionsResponse = await fetch(`${API_URL}/api/collecteurs/missions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        let mesMissions = []
        if (mesMissionsResponse.ok) {
          const data = await mesMissionsResponse.json()
          mesMissions = data.missions || []
        }

        const gainsResponse = await fetch(`${API_URL}/api/collecteurs/gains`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        let gainsData = { total: 0, valides: 0, enAttente: 0 }
        if (gainsResponse.ok) {
          const data = await gainsResponse.json()
          gainsData = data.resume || { total: 0, valides: 0, enAttente: 0 }
        }

        const notifResponse = await fetch(`${API_URL}/api/notifications`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        let notificationsList = []
        if (notifResponse.ok) {
          const data = await notifResponse.json()
          notificationsList = data.notifications || []
        }

        const missionsEnCours = mesMissions.filter(m => m.statut === 'en_cours' || m.statut === 'acceptee').length
        const missionsValidees = mesMissions.filter(m => m.statut === 'validee' || m.statut === 'terminee').length

        setStats({
          totalMissions: dashboardData.dashboard?.total_missions || mesMissions.length || 0,
          availableMissions: availableMissions,
          inProgressMissions: missionsEnCours,
          completedMissions: missionsValidees,
          totalEarnings: gainsData.total || 0,
          thisMonthEarnings: gainsData.valides || 0,
          averageEarnings: mesMissions.length ? Math.round((gainsData.total || 0) / mesMissions.length) : 0,
          rating: 4.8
        })

        const formatTimeAgo = (date) => {
          const now = new Date()
          const diffMs = now - date
          const diffMins = Math.round(diffMs / 60000)
          
          if (diffMins < 60) return `Il y a ${diffMins} min`
          if (diffMins < 1440) return `Il y a ${Math.round(diffMins / 60)}h`
          return `Il y a ${Math.round(diffMins / 1440)}j`
        }

        const formattedMissions = mesMissions.slice(0, 3).map(m => {
          const now = new Date()
          const created = new Date(m.date_creation)
          const diffMins = Math.round((now - created) / 60000)
          
          let timeAgo = ''
          if (diffMins < 60) timeAgo = `Il y a ${diffMins} min`
          else if (diffMins < 1440) timeAgo = `Il y a ${Math.round(diffMins / 60)}h`
          else timeAgo = `Il y a ${Math.round(diffMins / 1440)}j`

          return {
            id: m.id,
            producerName: m.producteur_nom || 'Producteur',
            location: m.producteur_adresse || 'Adresse non spécifiée',
            wasteType: m.type_dechet || 'Déchets',
            quantity: `${m.quantite || 0} ${m.unite || 'kg'}`,
            status: m.statut === 'disponible' ? 'new' :
                    m.statut === 'acceptee' ? 'in_progress' :
                    m.statut === 'en_cours' ? 'in_progress' :
                    m.statut === 'validee' || m.statut === 'terminee' ? 'completed' : 'new',
            earnings: m.gain_montant || m.estimation_gain || 0,
            timeAgo
          }
        })

        setRecentMissions(formattedMissions)

        const formattedNotifications = notificationsList.slice(0, 3).map((n, index) => ({
          id: index + 1,
          type: n.type === 'nouvelle_mission' ? 'new_mission' :
                n.type === 'paiement' ? 'payment' : 'mission_completed',
          title: n.titre || 'Notification',
          message: n.message || '',
          time: n.cree_le ? formatTimeAgo(new Date(n.cree_le)) : 'Récemment',
          read: n.lu || false
        }))

        setNotifications(formattedNotifications)

      } catch (error) {
        console.error('Erreur chargement données:', error)
        setError('Impossible de charger les données')
      } finally {
        setIsLoading(false)
      }
    }, [])

    useEffect(() => {
      loadDashboardData()
      const interval = setInterval(loadDashboardData, 30000)
      return () => clearInterval(interval)
    }, [loadDashboardData])

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de votre tableau de bord...</p>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">{error}</p>
          <button onClick={loadDashboardData} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Réessayer
          </button>
        </div>
      )
    }

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  Bienvenue, {userData.nomComplet?.split(' ')[0] || 'Collecteur'} ! 👋
                </h1>
                <p className="text-blue-100">
                  {userData.type_collecteur === 'independant' 
                    ? 'Prêt pour de nouvelles missions aujourd\'hui ?' 
                    : 'Votre équipe est prête pour de nouvelles missions ?'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{stats.availableMissions}</p>
                <p className="text-blue-100 text-sm">Missions disponibles</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.totalMissions}</span>
            </div>
            <p className="text-sm text-gray-600">Total missions</p>
            <div className="mt-2 flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{stats.totalMissions > 0 ? Math.round((stats.completedMissions / stats.totalMissions) * 100) : 0}% terminées
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.totalEarnings.toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-600">Gains totaux (FCFA)</p>
            <div className="mt-2 flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              {stats.thisMonthEarnings.toLocaleString()} FCFA ce mois
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.inProgressMissions}</span>
            </div>
            <p className="text-sm text-gray-600">En cours</p>
            <div className="mt-2 flex items-center text-xs text-purple-600">
              <Clock className="h-3 w-3 mr-1" />
              {stats.availableMissions} disponibles
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.rating}</span>
            </div>
            <p className="text-sm text-gray-600">Note moyenne</p>
            <div className="mt-2 flex items-center text-xs text-yellow-600">
              <Award className="h-3 w-3 mr-1" />
              {stats.completedMissions} missions validées
            </div>
          </div>
        </div>

        {/* Recent Missions & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Missions récentes</h3>
                <Link to="/collecteur/missions" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Voir tout
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentMissions.length > 0 ? (
                  recentMissions.map((mission) => (
                    <div key={mission.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{mission.producerName}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              mission.status === 'new' ? 'bg-blue-100 text-blue-700' :
                              mission.status === 'in_progress' ? 'bg-purple-100 text-purple-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {mission.status === 'new' ? 'Nouvelle' :
                               mission.status === 'in_progress' ? 'En cours' : 'Terminée'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {mission.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              {mission.wasteType} • {mission.quantity}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{mission.timeAgo}</span>
                            <span className="text-sm font-semibold text-green-600">{mission.earnings.toLocaleString()} FCFA</span>
                          </div>
                        </div>
                        
                        <Link to={`/collecteur/missions/${mission.id}`} className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">Aucune mission récente</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                <Link to="/collecteur/notifications" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Voir tout
                </Link>
              </div>
              
              <div className="space-y-4">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div key={notification.id} className={`p-3 rounded-lg border ${
                      !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          notification.type === 'new_mission' ? 'bg-blue-100' :
                          notification.type === 'payment' ? 'bg-green-100' :
                          'bg-purple-100'
                        }`}>
                          {notification.type === 'new_mission' ? <Package className="h-4 w-4 text-blue-600" /> :
                           notification.type === 'payment' ? <DollarSign className="h-4 w-4 text-green-600" /> :
                           <CheckCircle className="h-4 w-4 text-purple-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">Aucune notification</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Actions rapides</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link to="/collecteur/missions" className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group">
              <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Voir missions</p>
                <p className="text-xs text-gray-600">{stats.availableMissions} disponibles</p>
              </div>
            </Link>

            <Link to="/collecteur/wallet" className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group">
              <div className="p-2 bg-green-600 rounded-lg group-hover:bg-green-700 transition-colors">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Mes gains</p>
                <p className="text-xs text-gray-600">{stats.totalEarnings.toLocaleString()} FCFA</p>
              </div>
            </Link>

            <Link to="/collecteur/profile" className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group">
              <div className="p-2 bg-purple-600 rounded-lg group-hover:bg-purple-700 transition-colors">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Mon profil</p>
                <p className="text-xs text-gray-600">Gérer compte</p>
              </div>
            </Link>

            <Link to="/collecteur/history" className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors group">
              <div className="p-2 bg-yellow-600 rounded-lg group-hover:bg-yellow-700 transition-colors">
                <History className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Historique</p>
                <p className="text-xs text-gray-600">Voir les missions</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    )
  }
// ==================== PAGE MISSIONS (VERSION COMPLÈTE) ====================
const MissionsPage = () => {
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

  const loadMissions = async () => {
    const token = getToken()
    if (!token) {
      navigate('/login')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const disponibleResponse = await fetch(`${API_URL}/api/collecteurs/missions/disponibles`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      const disponibleData = await disponibleResponse.json()
      const disponibles = disponibleData.missions || []

      const mesMissionsResponse = await fetch(`${API_URL}/api/collecteurs/missions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      const mesMissionsData = await mesMissionsResponse.json()
      const mesMissions = mesMissionsData.missions || []

      const allMissions = [...disponibles.map(m => ({ ...m, status: 'new' })), ...mesMissions]
      
      const formattedMissions = allMissions.map((m) => {
        const now = new Date()
        const created = new Date(m.cree_le)
        const diffMins = Math.round((now - created) / 60000)
        
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
                  m.statut === 'validee' ? 'termine' : 'new',
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

  const filteredMissions = missions.filter(mission => {
    const matchesTab = activeTab === 'all' || mission.status === activeTab
    const matchesSearch = mission.producerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.wasteType.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesTab && matchesSearch
  })

  // ========== MISSION CARD ==========
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

  // ========== MISSION DETAIL MODAL ==========
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
            {/* Informations producteur */}
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

            {/* Localisation */}
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

            {/* Détails des déchets */}
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

            {/* Instructions spéciales */}
            {selectedMission.specialInstructions && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-yellow-800 mb-3 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  Instructions spéciales
                </h3>
                <p className="text-yellow-800">{selectedMission.specialInstructions}</p>
              </div>
            )}

            {/* Historique */}
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

            {/* Feedback producteur */}
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

  // ========== COMPLETE MISSION MODAL ==========
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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des missions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button onClick={loadMissions} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Réessayer
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Package className="h-6 w-6 text-blue-600" />
          Mes missions
        </h1>
        <p className="text-gray-600">Gérez vos missions de collecte</p>
      </div>

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
              {missions.filter(m => m.status === 'accepted').length}
            </span>
          </div>
          <p className="text-sm text-gray-600">Acceptées</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-8 w-8 text-purple-600" />
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
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
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

      {/* Modals */}
      {showDetail && <MissionDetailModal />}
      {showCompleteModal && <CompleteMissionModal />}
    </div>
  )
}
  // ==================== PAGE GAINS ====================
  const WalletPage = () => {
    const [walletData, setWalletData] = useState({
      totalEarnings: 0,
      thisMonthEarnings: 0,
      pendingEarnings: 0,
      averageEarnings: 0,
      totalMissions: 0,
      successRate: 0,
      rating: 4.8
    })
    const [transactions, setTransactions] = useState([])
    const [isLoading, setIsLoading] = useState(true)

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
          const gainsList = result.gains || []
          
          const totalEarnings = gainsList
            .filter(g => g.statut === 'valide')
            .reduce((sum, g) => sum + (parseFloat(g.montant) || 0), 0)
          
          const pendingEarnings = gainsList
            .filter(g => g.statut !== 'valide')
            .reduce((sum, g) => sum + (parseFloat(g.montant) || 0), 0)

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

          const totalMissions = gainsList.length
          const completedMissions = gainsList.filter(g => g.statut === 'valide').length

          setWalletData({
            totalEarnings: totalEarnings,
            thisMonthEarnings: thisMonthGains,
            pendingEarnings: pendingEarnings,
            averageEarnings: completedMissions ? Math.round(totalEarnings / completedMissions) : 0,
            totalMissions: totalMissions,
            successRate: totalMissions ? Math.round((completedMissions / totalMissions) * 100) : 0,
            rating: 4.8
          })

          const formattedTransactions = gainsList.slice(0, 10).map((gain, index) => ({
            id: gain.id || index + 1,
            title: `Mission #${gain.mission_id?.substring(0, 5) || 'XXX'}`,
            amount: parseFloat(gain.montant) || 0,
            status: gain.statut === 'valide' ? 'completed' : 'pending',
            date: gain.cree_le ? new Date(gain.cree_le).toLocaleDateString('fr-FR') : '',
            time: gain.cree_le ? new Date(gain.cree_le).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''
          }))

          setTransactions(formattedTransactions)
        }
      } catch (error) {
        console.error('Erreur chargement gains:', error)
      } finally {
        setIsLoading(false)
      }
    }

    useEffect(() => {
      loadGains()
      const interval = setInterval(loadGains, 30000)
      return () => clearInterval(interval)
    }, [])

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de vos gains...</p>
          </div>
        </div>
      )
    }

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <Target className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">{walletData.totalMissions}</span>
            </div>
            <p className="text-sm text-gray-600">Total missions</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">{walletData.averageEarnings.toLocaleString()} FCFA</span>
            </div>
            <p className="text-sm text-gray-600">Gain moyen/mission</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">{walletData.successRate}%</span>
            </div>
            <p className="text-sm text-gray-600">Taux de réussite</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <Star className="h-8 w-8 text-yellow-600" />
              <span className="text-2xl font-bold text-gray-900">{walletData.rating}/5</span>
            </div>
            <p className="text-sm text-gray-600">Note moyenne</p>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Historique des transactions</h3>
              <p className="text-gray-600">Dernières 10 transactions</p>
            </div>
          </div>

          <div className="space-y-4">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <h4 className="font-medium text-gray-900">{transaction.title}</h4>
                    <p className="text-sm text-gray-600">{transaction.date} à {transaction.time}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${transaction.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {transaction.amount.toLocaleString()} FCFA
                    </p>
                    <p className={`text-xs ${transaction.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {transaction.status === 'completed' ? 'Terminé' : 'En attente'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Receipt className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Aucune transaction</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ==================== PAGE PROFIL ====================
  const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false)
    const [profileData, setProfileData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      serviceArea: ''
    })
    const [editData, setEditData] = useState(profileData)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      setProfileData({
        firstName: userData.nomComplet?.split(' ')[0] || '',
        lastName: userData.nomComplet?.split(' ').slice(1).join(' ') || '',
        email: userData.email || '',
        phone: userData.telephone || '',
        serviceArea: userData.zone_intervention_nom || ''
      })
      setEditData({
        firstName: userData.nomComplet?.split(' ')[0] || '',
        lastName: userData.nomComplet?.split(' ').slice(1).join(' ') || '',
        email: userData.email || '',
        phone: userData.telephone || '',
        serviceArea: userData.zone_intervention_nom || ''
      })
      setIsLoading(false)
    }, [userData])

    const handleInputChange = (e) => {
      const { name, value } = e.target
      setEditData(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = async () => {
      const token = getToken()
      if (!token) return

      try {
        await fetch(`${API_URL}/api/collecteurs/profil/infos`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            nomComplet: `${editData.firstName} ${editData.lastName}`,
            telephone: editData.phone,
            zoneInterventionNom: editData.serviceArea
          })
        })
        
        setProfileData({ ...editData })
        setIsEditing(false)
      } catch (error) {
        console.error('Erreur mise à jour:', error)
      }
    }

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de votre profil...</p>
          </div>
        </div>
      )
    }

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <User className="h-6 w-6 text-blue-600" />
            Mon Profil
          </h1>
          <p className="text-gray-600">Gérez vos informations personnelles</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Photo Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
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
                </div>
                
                <h2 className="mt-4 text-xl font-bold text-gray-900">
                  {userData.nomComplet}
                </h2>
                
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-700">{userData.rating}</span>
                  <span className="text-sm text-gray-500">({userData.totalMissions} missions)</span>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Statut</span>
                  <span className="text-sm font-medium text-gray-900">
                    {userData.type_collecteur === 'independant' ? 'Indépendant' : 'Coopérative'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Points</span>
                  <span className="text-sm font-medium text-gray-900">{userData.points_total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Card */}
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
                      onClick={() => {
                        setEditData(profileData)
                        setIsEditing(false)
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Enregistrer
                    </button>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nom</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={editData.firstName}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-gray-900 ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-600"
                    />
                  ) : (
                    <p className="text-gray-900 py-3.5 px-4 bg-gray-50 rounded-xl">{profileData.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Prénom</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={editData.lastName}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-gray-900 ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-600"
                    />
                  ) : (
                    <p className="text-gray-900 py-3.5 px-4 bg-gray-50 rounded-xl">{profileData.lastName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      disabled
                      className="w-full rounded-xl border-0 bg-gray-100 px-4 py-3.5 text-gray-500 ring-1 ring-gray-200 cursor-not-allowed"
                    />
                  ) : (
                    <p className="text-gray-900 py-3.5 px-4 bg-gray-50 rounded-xl">{profileData.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Téléphone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editData.phone}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-gray-900 ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-600"
                    />
                  ) : (
                    <p className="text-gray-900 py-3.5 px-4 bg-gray-50 rounded-xl">{profileData.phone}</p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Zone d'intervention</label>
                  {isEditing ? (
                    <textarea
                      name="serviceArea"
                      value={editData.serviceArea}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-gray-900 ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-600"
                    />
                  ) : (
                    <p className="text-gray-900 py-3.5 px-4 bg-gray-50 rounded-xl">{profileData.serviceArea || 'Non spécifiée'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ==================== PAGE NOTIFICATIONS ====================
  const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      const loadNotifications = async () => {
        const token = getToken()
        if (!token) return

        setIsLoading(true)
        try {
          const response = await fetch(`${API_URL}/api/notifications`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })

          if (response.ok) {
            const data = await response.json()
            const notificationsList = data.notifications || []
            
            const formatTimeAgo = (date) => {
              const diffMins = Math.round((new Date() - new Date(date)) / 60000)
              if (diffMins < 60) return `Il y a ${diffMins} min`
              if (diffMins < 1440) return `Il y a ${Math.round(diffMins / 60)}h`
              return `Il y a ${Math.round(diffMins / 1440)}j`
            }

            const formattedNotifications = notificationsList.map((n, index) => ({
              id: n.id || index + 1,
              type: n.type || 'info',
              title: n.titre || 'Notification',
              message: n.message || '',
              time: n.cree_le ? formatTimeAgo(n.cree_le) : 'Récemment',
              read: n.lu || false
            }))

            setNotifications(formattedNotifications)
          }
        } catch (error) {
          console.error('Erreur chargement notifications:', error)
        } finally {
          setIsLoading(false)
        }
      }

      loadNotifications()
      const interval = setInterval(loadNotifications, 30000)
      return () => clearInterval(interval)
    }, [])

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des notifications...</p>
          </div>
        </div>
      )
    }

    const getNotificationIcon = (type) => {
      switch (type) {
        case 'nouvelle_mission': return <Package className="h-5 w-5 text-blue-600" />
        case 'paiement': return <DollarSign className="h-5 w-5 text-green-600" />
        default: return <Bell className="h-5 w-5 text-purple-600" />
      }
    }

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="h-6 w-6 text-blue-600" />
            Notifications
          </h1>
          <p className="text-gray-600">Restez informé de vos missions et paiements</p>
        </div>

        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.id} className={`bg-white rounded-xl shadow-lg border-2 p-4 ${
                !notification.read ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'
              }`}>
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-gray-100">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className={`font-semibold text-gray-900 ${!notification.read ? 'text-blue-900' : ''}`}>
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      </div>
                      
                      {!notification.read && (
                        <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune notification</h3>
              <p className="text-gray-600">Vous n'avez pas encore de notifications</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ==================== PAGE PARAMÈTRES ====================
  const SettingsPage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Paramètres</h1>
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Page en construction</h3>
        <p className="text-gray-600">Les paramètres seront bientôt disponibles</p>
      </div>
    </div>
  )
// ==================== PAGE AIDE ====================
const HelpPage = () => {
  const [activeSection, setActiveSection] = useState('guide')
  const [searchTerm, setSearchTerm] = useState('')
  const [openFaq, setOpenFaq] = useState(null)

  const faqData = [
    {
      id: 1,
      question: "Comment accepter une nouvelle mission ?",
      answer: "Rendez-vous dans l'onglet 'Missions', consultez la liste des missions disponibles et cliquez sur 'Accepter' pour celle qui vous intéresse. Vous pouvez voir les détails (localisation, type de déchets, gain estimé) avant d'accepter."
    },
    {
      id: 2,
      question: "Comment démarrer une collecte ?",
      answer: "Une fois la mission acceptée, rendez-vous sur place, puis dans l'application cliquez sur 'Commencer la collecte' dans les détails de la mission. Assurez-vous d'être bien à l'adresse indiquée."
    },
    {
      id: 3,
      question: "Comment terminer une mission ?",
      answer: "Après avoir collecté les déchets, sélectionnez un point de dépôt dans la liste, prenez une photo preuve, saisissez le code de confirmation du producteur et validez. La mission passera alors en statut 'Terminée'."
    },
    {
      id: 4,
      question: "Comment sont calculés mes gains ?",
      answer: "Vos gains sont calculés automatiquement par le système : 100 FCFA par kg de déchets collectés. Les missions validées par le gestionnaire de point de collecte sont créditées directement sur votre compte."
    },
    {
      id: 5,
      question: "Quand mes gains sont-ils disponibles ?",
      answer: "Les gains sont disponibles immédiatement après validation de la mission par le gestionnaire du point de collecte. Vous pouvez les consulter dans l'onglet 'Mes gains'."
    },
    {
      id: 6,
      question: "Comment modifier mon profil ?",
      answer: "Allez dans 'Mon profil', cliquez sur 'Modifier' pour mettre à jour vos informations personnelles (nom, téléphone, zone d'intervention). L'email ne peut pas être modifié."
    },
    {
      id: 7,
      question: "Que faire en cas de problème avec une mission ?",
      answer: "Contactez le support via l'email support@ecocollect.com ou par téléphone au +221 77 123 45 67. Notre équipe vous répondra dans les plus brefs délais."
    },
    {
      id: 8,
      question: "Comment voir l'historique de mes missions ?",
      answer: "Rendez-vous dans l'onglet 'Historique' pour consulter toutes vos missions terminées et validées, avec les détails des gains et des feedbacks."
    }
  ]

  const guides = [
    {
      title: "Premiers pas",
      icon: "🚀",
      items: [
        "Complétez votre profil",
        "Activez les notifications",
        "Vérifiez votre zone d'intervention"
      ]
    },
    {
      title: "Gestion des missions",
      icon: "📋",
      items: [
        "Acceptez les missions proches",
        "Suivez vos missions en cours",
        "Terminez correctement chaque collecte"
      ]
    },
    {
      title: "Maximiser vos gains",
      icon: "💰",
      items: [
        "Privilégiez les missions avec bonus",
        "Soyez ponctuel et professionnel",
        "Obtenez de bonnes notes"
      ]
    },
    {
      title: "Dépannage",
      icon: "🔧",
      items: [
        "Problème de connexion ?",
        "Mission non visible ?",
        "Gain non crédité ?"
      ]
    }
  ]

  const tips = [
    {
      icon: "⭐",
      title: "Soyez ponctuel",
      description: "Les producteurs apprécient la ponctualité. Arrivez à l'heure pour chaque collecte."
    },
    {
      icon: "📸",
      title: "Photos de qualité",
      description: "Prenez des photos claires pour prouver la collecte et faciliter la validation."
    },
    {
      icon: "🗣️",
      title: "Communication",
      description: "Prévenez le producteur de votre arrivée et soyez courtois."
    },
    {
      icon: "🧤",
      title: "Équipement",
      description: "Munissez-vous de gants et de sacs supplémentaires pour chaque collecte."
    },
    {
      icon: "📍",
      title: "Points de dépôt",
      description: "Familiarisez-vous avec les points de dépôt de votre zone."
    },
    {
      icon: "📊",
      title: "Suivi des gains",
      description: "Consultez régulièrement vos gains pour suivre votre progression."
    }
  ]

  const filteredFaq = faqData.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-blue-600" />
          Centre d'aide
        </h1>
        <p className="text-gray-600">Trouvez des réponses à vos questions</p>
      </div>

      {/* Barre de recherche */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher dans l'aide..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-lg"
          />
        </div>
      </div>

      {/* Navigation des sections */}
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveSection('guide')}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeSection === 'guide'
              ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Guide d'utilisation
        </button>
        <button
          onClick={() => setActiveSection('faq')}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeSection === 'faq'
              ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Questions fréquentes
        </button>
        <button
          onClick={() => setActiveSection('tips')}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeSection === 'tips'
              ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Conseils et astuces
        </button>
        <button
          onClick={() => setActiveSection('contact')}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeSection === 'contact'
              ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Contact support
        </button>
      </div>

      {/* Section Guide */}
      {activeSection === 'guide' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.map((guide, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
              <div className="text-4xl mb-4">{guide.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{guide.title}</h3>
              <ul className="space-y-3">
                {guide.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-blue-600 rounded-full mt-2"></div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Section FAQ */}
      {activeSection === 'faq' && (
        <div className="space-y-4">
          {filteredFaq.length > 0 ? (
            filteredFaq.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === item.id ? null : item.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{item.question}</span>
                  <ChevronRight
                    className={`h-5 w-5 text-gray-500 transition-transform ${
                      openFaq === item.id ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {openFaq === item.id && (
                  <div className="px-6 pb-4 pt-2 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700">{item.answer}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun résultat</h3>
              <p className="text-gray-600">Aucune question ne correspond à votre recherche</p>
            </div>
          )}
        </div>
      )}

      {/* Section Conseils */}
      {activeSection === 'tips' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="text-3xl mb-3">{tip.icon}</div>
              <h4 className="font-bold text-gray-900 mb-2">{tip.title}</h4>
              <p className="text-sm text-gray-700">{tip.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Section Contact */}
      {activeSection === 'contact' && (
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Comment pouvons-nous vous aider ?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <PhoneCall className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Téléphone</h4>
              <p className="text-gray-600">+221 77 123 45 67</p>
              <p className="text-sm text-gray-500">Lun-Ven, 8h-18h</p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
              <p className="text-gray-600">support@ecocollect.com</p>
              <p className="text-sm text-gray-500">Réponse sous 24h</p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">WhatsApp</h4>
              <p className="text-gray-600">+221 78 123 45 67</p>
              <p className="text-sm text-gray-500">Support instantané</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
            <h4 className="text-lg font-bold mb-2">Besoin d'aide urgente ?</h4>
            <p className="text-blue-100 mb-4">
              Notre équipe est disponible pour répondre à toutes vos questions
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Démarrer un chat
              </button>
              <button className="px-6 py-2 border border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Centre d'aide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
// ==================== PAGE HISTORIQUE ====================
const HistoryPage = () => {
  const [historyMissions, setHistoryMissions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMission, setSelectedMission] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const [stats, setStats] = useState({
    totalMissions: 0,
    totalEarnings: 0,
    totalWeight: 0,
    averageRating: 4.8
  })

  const API_URL = 'http://localhost:3000'

  const getToken = () => localStorage.getItem('ecocollect_token')

  const loadHistory = async () => {
    const token = getToken()
    if (!token) return

    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/collecteurs/missions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        const missions = data.missions || []
        
        const completedMissions = missions.filter(m => 
          ['validee', 'terminee', 'completed'].includes(m.statut)
        )

        const formatDate = (dateString) => {
          if (!dateString) return 'Date inconnue'
          const date = new Date(dateString)
          return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
        }

        const formatTime = (dateString) => {
          if (!dateString) return ''
          const date = new Date(dateString)
          return date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          })
        }

        const formatDateTime = (dateString) => {
          if (!dateString) return null
          const date = new Date(dateString)
          return date.toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        }

        const formattedMissions = await Promise.all(completedMissions.map(async (m) => {
          const earnings = parseFloat(m.gains_attribues || m.gain_montant || 0)
          const weight = parseFloat(m.poids_depose || 0)
          
          let validatedBy = null
          if (m.valide_par) {
            try {
              const gestionnaireResponse = await fetch(`${API_URL}/api/gestionnaires/${m.valide_par}`, {
                headers: { 'Authorization': `Bearer ${token}` }
              })
              if (gestionnaireResponse.ok) {
                const gestionnaireData = await gestionnaireResponse.json()
                validatedBy = gestionnaireData.nom_complet || gestionnaireData.nom || 'Gestionnaire'
              }
            } catch (error) {
              console.error('Erreur chargement gestionnaire:', error)
              validatedBy = 'Gestionnaire'
            }
          }

          return {
            id: m.id,
            date: formatDate(m.date_validation || m.date_fin || m.cree_le),
            time: formatTime(m.date_validation || m.date_fin || m.cree_le),
            acceptedAt: formatDateTime(m.date_acceptation),
            startedAt: formatDateTime(m.date_debut_collecte),
            completedAt: formatDateTime(m.date_fin_collecte),
            producerName: m.producteur_nom || 'Producteur',
            producerPhone: m.producteur_telephone || 'Non spécifié',
            wasteType: m.type_dechet || 'Déchets',
            quantity: `${m.quantite || 0} ${m.unite || 'kg'}`,
            weight: weight,
            earnings: earnings,
            status: m.statut === 'validee' ? 'validated' : 
                    m.statut === 'terminee' ? 'completed' : 'other',
            location: m.producteur_adresse || 'Adresse non spécifiée',
            depositPoint: m.point_depot_nom || 'Non spécifié',
            validationDate: formatDate(m.date_validation),
            validatedBy: validatedBy,
            collectorFeedback: m.notes_collecte || '',
            producerFeedback: m.commentaires || '',
            rating: m.note || 4.5,
            distance: m.distance,
            urgency: m.urgence
          }
        }))

        const totalEarnings = formattedMissions.reduce((sum, m) => sum + m.earnings, 0)
        const totalWeight = formattedMissions.reduce((sum, m) => sum + m.weight, 0)

        setStats({
          totalMissions: formattedMissions.length,
          totalEarnings: totalEarnings,
          totalWeight: totalWeight,
          averageRating: 4.8
        })

        setHistoryMissions(formattedMissions)
      }
    } catch (error) {
      console.error('Erreur chargement historique:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadHistory()
    const interval = setInterval(loadHistory, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'validated':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
            Validée ✓
          </span>
        )
      case 'completed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
            Terminée
          </span>
        )
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            Autre
          </span>
        )
    }
  }

  const filteredMissions = historyMissions.filter(mission => {
    const matchesFilter = filter === 'all' || mission.status === filter
    const matchesSearch = 
      mission.producerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.wasteType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.location.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // ========== MODAL DE DÉTAILS ==========
  const HistoryDetailModal = () => {
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

          <div className="p-6 space-y-6">
            {/* En-tête avec statut */}
            <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl">
              <div>
                <p className="text-sm text-gray-600">Mission du {selectedMission.date}</p>
                <p className="text-xs text-gray-500">{selectedMission.time}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedMission.status)}
                <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 rounded-full">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-semibold text-yellow-700">{selectedMission.rating}/5</span>
                </div>
              </div>
            </div>

            {/* Grille d'informations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Producteur
                </h4>
                <p className="font-semibold text-gray-900">{selectedMission.producerName}</p>
                <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {selectedMission.producerPhone}
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-green-800 mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Gains
                </h4>
                <p className="text-2xl font-bold text-green-600">{selectedMission.earnings.toLocaleString()} FCFA</p>
                <p className="text-sm text-gray-600 mt-1">Poids: {selectedMission.weight} kg</p>
              </div>

              <div className="bg-purple-50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-purple-800 mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Déchets
                </h4>
                <p className="font-semibold text-gray-900">{selectedMission.wasteType}</p>
                <p className="text-sm text-gray-600 mt-1">Quantité: {selectedMission.quantity}</p>
              </div>

              <div className="bg-orange-50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-orange-800 mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Point de dépôt
                </h4>
                <p className="font-semibold text-gray-900">{selectedMission.depositPoint}</p>
                <p className="text-sm text-gray-600 mt-1">{selectedMission.location}</p>
              </div>

              {selectedMission.validatedBy && (
                <div className="bg-indigo-50 rounded-xl p-4 md:col-span-2">
                  <h4 className="text-sm font-medium text-indigo-800 mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Validé par
                  </h4>
                  <p className="font-semibold text-gray-900">{selectedMission.validatedBy}</p>
                  <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {selectedMission.validationDate}
                  </p>
                </div>
              )}
            </div>

            {/* Feedback */}
            <div className="space-y-4">
              {selectedMission.collectorFeedback && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Votre note
                  </h4>
                  <p className="text-gray-700">{selectedMission.collectorFeedback}</p>
                </div>
              )}

              {selectedMission.producerFeedback && (
                <div className="bg-indigo-50 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-indigo-800 mb-2 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Feedback du producteur
                  </h4>
                  <p className="text-indigo-700">{selectedMission.producerFeedback}</p>
                </div>
              )}
            </div>

            {/* Chronologie */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Chronologie
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {selectedMission.acceptedAt && (
                  <p className="text-gray-600"><span className="font-medium">Acceptée:</span> {selectedMission.acceptedAt}</p>
                )}
                {selectedMission.startedAt && (
                  <p className="text-gray-600"><span className="font-medium">Démarrée:</span> {selectedMission.startedAt}</p>
                )}
                {selectedMission.completedAt && (
                  <p className="text-gray-600"><span className="font-medium">Terminée:</span> {selectedMission.completedAt}</p>
                )}
                {selectedMission.validationDate && (
                  <p className="text-gray-600"><span className="font-medium">Validée:</span> {selectedMission.validationDate}</p>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0 bg-white">
            <div className="flex gap-3">
              <button
                onClick={() => setShowDetail(false)}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Fermer
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                Exporter PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'historique...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <History className="h-6 w-6 text-blue-600" />
          Historique des missions
        </h1>
        <p className="text-gray-600">Consultez toutes vos missions terminées</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
          <p className="text-sm text-blue-100 mb-1">Total missions</p>
          <p className="text-3xl font-bold">{stats.totalMissions}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Gains totaux</p>
          <p className="text-2xl font-bold text-green-600">{stats.totalEarnings.toLocaleString()} FCFA</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Déchets collectés</p>
          <p className="text-2xl font-bold text-purple-600">{stats.totalWeight} kg</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Note moyenne</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-yellow-600">{stats.averageRating}</p>
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher une mission..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilter('validated')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'validated'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Validées
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'completed'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Terminées
          </button>
        </div>
      </div>

      {/* Liste des missions */}
      <div className="space-y-4">
        {filteredMissions.length > 0 ? (
          filteredMissions.map((mission) => (
            <div
              key={mission.id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all cursor-pointer"
              onClick={() => {
                setSelectedMission(mission)
                setShowDetail(true)
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">{mission.producerName}</h3>
                    {getStatusBadge(mission.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {mission.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {mission.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {mission.location}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-600">{mission.earnings.toLocaleString()} FCFA</p>
                  <p className="text-sm text-gray-500">{mission.weight} kg</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{mission.wasteType}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{mission.quantity}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{mission.depositPoint}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <History className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune mission dans l'historique</h3>
            <p className="text-gray-600">Les missions terminées apparaîtront ici</p>
          </div>
        )}
      </div>

      {/* Modal de détails */}
      {showDetail && <HistoryDetailModal />}
    </div>
  )
}
}
  // ==================== ROUTAGE ====================
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Header mobile */}
      <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-semibold text-sm">
              {getInitials(userData.nomComplet)}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content avec routage interne */}
      <div className="lg:ml-80 min-h-screen">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/missions" element={<MissionsPage />} />
          <Route path="/wallet" element={<WalletPage />} />
           <Route path="/history" element={<HistoryPage/>} />
           <Route path="/help" element={<HelpPage/>} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        
       
        </Routes>
      </div>
    </div>
  )
}

export default DashboardCollector