// import { useState, useEffect, useCallback, useRef } from 'react';
// import { useNavigate, Routes, Route, Link } from 'react-router-dom';
// import {
//   // Icônes principales
//   User, Users, UserPlus, UserCheck, UserX, UserCog,
//   Building, MapPin, Phone, Mail, Calendar, Clock,
//   CheckCircle, XCircle, AlertCircle, Info, Eye,
//   Edit2, Trash2, Save, X, Plus, Search, Filter,
//   RefreshCw, Download, Upload, FileText, Printer,
//   BarChart3, PieChart, TrendingUp, Award, Star,
//   Shield, Key, LogOut, Menu, Home, LayoutDashboard,
//   Package, Truck, Wallet, History, HelpCircle, Settings,
//   ChevronRight, ChevronDown, ChevronUp, ArrowLeft,
//   Scale, Gift, AlertTriangle, Check, Copy, ExternalLink
// } from 'lucide-react';

// // ==================== COMPOSANT PRINCIPAL ====================
// const DashboardSuperviseur = () => {
//   const navigate = useNavigate();
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState('dashboard');
//   const [userData, setUserData] = useState({
//     id: '',
//     nomComplet: '',
//     email: '',
//     telephone: '',
//     role: '',
//     photoUrl: ''
//   });

//   // États pour les données
//   const [stats, setStats] = useState({
//     totalCollecteurs: 0,
//     collecteursActifs: 0,
//     collecteursEnAttente: 0,
//     totalGestionnaires: 0,
//     gestionnairesActifs: 0,
//     totalMissions: 0,
//     missionsValidees: 0,
//     totalDechetsCollectes: 0,
//     totalGainsDistribues: 0
//   });

//   const [collecteursEnAttente, setCollecteursEnAttente] = useState([]);
//   const [collecteurs, setCollecteurs] = useState([]);
//   const [gestionnaires, setGestionnaires] = useState([]);
//   const [pointsDepot, setPointsDepot] = useState([]);
//   const [missionsDisponibles, setMissionsDisponibles] = useState([]);
//   const [collecteursActifs, setCollecteursActifs] = useState([]);
  
//   // États pour les statistiques avancées
//   const [evolutionHebdomadaire, setEvolutionHebdomadaire] = useState([]);
  
//   // États pour les modals
//   const [showCollecteurDetails, setShowCollecteurDetails] = useState(false);
//   const [selectedCollecteur, setSelectedCollecteur] = useState(null);
//   const [showGestionnaireModal, setShowGestionnaireModal] = useState(false);
//   const [showPointDepotModal, setShowPointDepotModal] = useState(false);
//   const [editingGestionnaire, setEditingGestionnaire] = useState(null);
//   const [editingPointDepot, setEditingPointDepot] = useState(null);
  
//   // États pour les formulaires
//   const [gestionnaireForm, setGestionnaireForm] = useState({
//     email: '',
//     telephone: '',
//     motDePasse: '',
//     nomComplet: '',
//     pointCollecteId: '',
//     fonction: 'Gestionnaire'
//   });
  
//   const [pointDepotForm, setPointDepotForm] = useState({
//     nom: '',
//     adresse: '',
//     quartier: '',
//     commune: '',
//     typesDechetsAcceptes: []
//   });

//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [validationNotes, setValidationNotes] = useState('');
  
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [dataLoaded, setDataLoaded] = useState(false);

//   // Références
//   const initialLoadDone = useRef(false);
//   const intervalRef = useRef(null);

// //   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
//  const API_URL = 'https://ecobackend-y6nd.vercel.app';
//   const STORAGE_KEYS = {
//     TOKEN: 'ecocollect_token',
//     USER: 'ecocollect_user',
//     ROLE: 'ecocollect_role'
//   };

//   const getToken = () => localStorage.getItem(STORAGE_KEYS.TOKEN);
  
//   const getInitials = (name) => {
//     if (!name) return 'S';
//     return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
//   };

//   const handleLogout = () => {
//     if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//       localStorage.removeItem(STORAGE_KEYS.TOKEN);
//       localStorage.removeItem(STORAGE_KEYS.USER);
//       localStorage.removeItem(STORAGE_KEYS.ROLE);
//       navigate('/login');
//     }
//   };

//   // ==================== CHARGEMENT DES DONNÉES ====================
//   const loadUserData = useCallback(async () => {
//     const token = getToken();
//     if (!token) return;

//     try {
//       const response = await fetch(`${API_URL}/api/superviseurs/profil`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.ok) {
//         const result = await response.json();
//         const profil = result.superviseur || result;
        
//         setUserData({
//           id: profil.id || '',
//           nomComplet: profil.nomComplet || profil.nom_complet || '',
//           email: profil.email || '',
//           telephone: profil.telephone || '',
//           role: profil.role || 'Superviseur',
//           photoUrl: profil.photoUrl || ''
//         });
//       } else {
//         console.warn('Profil non chargé, utilisation des données du localStorage');
//         const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
//         setUserData({
//           id: user.id || '',
//           nomComplet: user.nomComplet || user.nom || 'Superviseur',
//           email: user.email || '',
//           telephone: user.telephone || '',
//           role: 'Superviseur',
//           photoUrl: ''
//         });
//       }
//     } catch (error) {
//       console.error('Erreur chargement utilisateur:', error);
//       // Utiliser les données du localStorage en cas d'erreur
//       const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
//       setUserData({
//         id: user.id || '',
//         nomComplet: user.nomComplet || user.nom || 'Superviseur',
//         email: user.email || '',
//         telephone: user.telephone || '',
//         role: 'Superviseur',
//         photoUrl: ''
//       });
//     }
//   }, [API_URL]);

//   const loadAllData = useCallback(async () => {
//     const token = getToken();
//     if (!token) {
//       navigate('/login');
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       // Charger les données disponibles
//       const promises = [];

//       // Statistiques
//       promises.push(
//         fetch(`${API_URL}/api/superviseurs/statistiques`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         }).then(res => res.ok ? res.json() : null)
//       );

//       // Collecteurs en attente
//       promises.push(
//         fetch(`${API_URL}/api/superviseurs/collecteurs/en-attente`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         }).then(res => res.ok ? res.json() : { collecteurs: [] })
//       );

//       // Gestionnaires
//       promises.push(
//         fetch(`${API_URL}/api/superviseurs/gestionnaires`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         }).then(res => res.ok ? res.json() : { gestionnaires: [] })
//       );

//       // Points de dépôt
//       promises.push(
//         fetch(`${API_URL}/api/points-depot`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         }).then(res => res.ok ? res.json() : { points: [] })
//       );

//       // Missions disponibles
//       promises.push(
//         fetch(`${API_URL}/api/superviseurs/missions/disponibles`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         }).then(res => res.ok ? res.json() : { missions: [] })
//       );

//       // Évolution
//       promises.push(
//         fetch(`${API_URL}/api/superviseurs/statistiques/evolution?jours=7`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         }).then(res => res.ok ? res.json() : { evolution: [] })
//       );

//       const [statsRes, collecteursAttenteRes, gestionnairesRes, pointsRes, missionsRes, evolutionRes] = await Promise.all(promises);

//       // Statistiques
//       if (statsRes?.success) {
//         const s = statsRes.stats || {};
//         setStats({
//           totalCollecteurs: s.total_collecteurs || 0,
//           collecteursActifs: s.collecteurs_actifs || 0,
//           collecteursEnAttente: s.collecteurs_en_attente || 0,
//           totalGestionnaires: s.total_gestionnaires || 0,
//           gestionnairesActifs: s.gestionnaires_actifs || 0,
//           totalMissions: s.total_missions || 0,
//           missionsValidees: s.missions_validees || 0,
//           totalDechetsCollectes: s.total_dechets_collectes || 0,
//           totalGainsDistribues: s.total_gains_distribues || 0
//         });
//       }

//       // Collecteurs en attente
//       if (collecteursAttenteRes?.success) {
//         setCollecteursEnAttente(collecteursAttenteRes.collecteurs || []);
//       }

//       // Gestionnaires
//       if (gestionnairesRes?.success) {
//         setGestionnaires(gestionnairesRes.gestionnaires || []);
//       }

//       // Points de dépôt
//       if (pointsRes?.success) {
//         setPointsDepot(pointsRes.points || []);
//       }

//       // Missions disponibles
//       if (missionsRes?.success) {
//         setMissionsDisponibles(missionsRes.missions || []);
//       }

//       // Évolution
//       if (evolutionRes?.success) {
//         setEvolutionHebdomadaire(evolutionRes.evolution || []);
//       }

//       // Collecteurs actifs (simulés pour l'instant)
//       setCollecteursActifs([
//         { id: '1', nomComplet: 'Collecteur 1', telephone: '771234567' },
//         { id: '2', nomComplet: 'Collecteur 2', telephone: '778765432' }
//       ]);

//       setDataLoaded(true);
//     } catch (error) {
//       console.error('❌ Erreur chargement données:', error);
//       setError('Impossible de charger les données');
      
//       // Données simulées pour le développement
//       setGestionnaires([
//         { id: '1', nomComplet: 'Gestionnaire Test', email: 'test@test.com', telephone: '771234567', fonction: 'Principal', est_actif: true, point_collecte_nom: 'Point Central' }
//       ]);
//       setPointsDepot([
//         { id: '1', nom: 'Point Central', adresse: 'Dakar Centre', types_dechets_acceptes: ['plastique', 'verre'] }
//       ]);
//       setDataLoaded(true);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [API_URL, navigate]);

//   // ==================== CHARGEMENT INITIAL ====================
//   useEffect(() => {
//     const token = getToken();
//     const role = localStorage.getItem(STORAGE_KEYS.ROLE);
    
//     if (!token || role !== 'superviseur') {
//       navigate('/login');
//       return;
//     }

//     if (!initialLoadDone.current) {
//       initialLoadDone.current = true;
      
//       const initializeData = async () => {
//         await loadUserData();
//         await loadAllData();
//       };
      
//       initializeData();
//     }

//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, [navigate, loadUserData, loadAllData]);

//   // ==================== RAFRAÎCHISSEMENT PÉRIODIQUE ====================
//   useEffect(() => {
//     if (dataLoaded && !intervalRef.current) {
//       intervalRef.current = setInterval(() => {
//         loadAllData();
//       }, 60000);
//     }

//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, [dataLoaded, loadAllData]);

//   // ==================== ACTIONS ====================
//   const handleValiderCollecteur = async (collecteurId, notes) => {
//     const token = getToken();
//     try {
//       const response = await fetch(`${API_URL}/api/superviseurs/collecteurs/${collecteurId}/valider`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ notes })
//       });

//       if (response.ok) {
//         alert('✅ Collecteur validé avec succès');
//         setShowCollecteurDetails(false);
//         await loadAllData();
//       } else {
//         throw new Error('Erreur lors de la validation');
//       }
//     } catch (error) {
//       console.error('❌ Erreur:', error);
//       alert(error.message);
//     }
//   };

//   const handleRejeterCollecteur = async (collecteurId, notes) => {
//     const token = getToken();
//     try {
//       const response = await fetch(`${API_URL}/api/superviseurs/collecteurs/${collecteurId}/rejeter`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ notes: notes || 'Rejeté par le superviseur' })
//       });

//       if (response.ok) {
//         alert('❌ Collecteur rejeté');
//         setShowCollecteurDetails(false);
//         await loadAllData();
//       } else {
//         throw new Error('Erreur lors du rejet');
//       }
//     } catch (error) {
//       console.error('❌ Erreur:', error);
//       alert(error.message);
//     }
//   };

//   const handleCreerGestionnaire = async (e) => {
//     e.preventDefault();
//     const token = getToken();
    
//     // Validation des champs requis
//     if (!gestionnaireForm.email || !gestionnaireForm.telephone || !gestionnaireForm.motDePasse || !gestionnaireForm.nomComplet) {
//       alert('Veuillez remplir tous les champs obligatoires');
//       return;
//     }
    
//     try {
//       const response = await fetch(`${API_URL}/api/superviseurs/gestionnaires`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           email: gestionnaireForm.email,
//           telephone: gestionnaireForm.telephone,
//           motDePasse: gestionnaireForm.motDePasse,
//           nomComplet: gestionnaireForm.nomComplet,
//           pointCollecteId: gestionnaireForm.pointCollecteId || null,
//           fonction: gestionnaireForm.fonction || 'Gestionnaire'
//         })
//       });

//       const result = await response.json();

//       if (result.success) {
//         alert('✅ Gestionnaire créé avec succès');
//         setShowGestionnaireModal(false);
//         setGestionnaireForm({
//           email: '',
//           telephone: '',
//           motDePasse: '',
//           nomComplet: '',
//           pointCollecteId: '',
//           fonction: 'Gestionnaire'
//         });
//         await loadAllData();
//       } else {
//         throw new Error(result.message || 'Erreur lors de la création');
//       }
//     } catch (error) {
//       console.error('❌ Erreur:', error);
//       alert(error.message);
//     }
//   };

//   const handleModifierGestionnaire = async (e) => {
//     e.preventDefault();
//     const token = getToken();
    
//     // Vérifier que editingGestionnaire n'est pas null
//     if (!editingGestionnaire || !editingGestionnaire.id) {
//       alert('Erreur : Aucun gestionnaire sélectionné');
//       return;
//     }
    
//     try {
//       const response = await fetch(`${API_URL}/api/superviseurs/gestionnaires/${editingGestionnaire.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           email: editingGestionnaire.email,
//           telephone: editingGestionnaire.telephone,
//           nomComplet: editingGestionnaire.nomComplet,
//           pointCollecteId: editingGestionnaire.pointCollecteId || null,
//           fonction: editingGestionnaire.fonction,
//           estActif: editingGestionnaire.estActif
//         })
//       });

//       const result = await response.json();

//       if (result.success) {
//         alert('✅ Gestionnaire modifié avec succès');
//         setShowGestionnaireModal(false);
//         setEditingGestionnaire(null);
//         await loadAllData();
//       } else {
//         throw new Error(result.message || 'Erreur lors de la modification');
//       }
//     } catch (error) {
//       console.error('❌ Erreur:', error);
//       alert(error.message);
//     }
//   };

//   const handleActiverGestionnaire = async (gestionnaireId, estActif) => {
//     const token = getToken();
//     try {
//       const response = await fetch(`${API_URL}/api/superviseurs/gestionnaires/${gestionnaireId}/activer`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ estActif })
//       });

//       if (response.ok) {
//         alert(estActif ? '✅ Gestionnaire activé' : '✅ Gestionnaire désactivé');
//         await loadAllData();
//       } else {
//         throw new Error('Erreur lors de l\'activation');
//       }
//     } catch (error) {
//       console.error('❌ Erreur:', error);
//       alert(error.message);
//     }
//   };

//   const handleCreerPointDepot = async (e) => {
//     e.preventDefault();
//     const token = getToken();
    
//     if (!pointDepotForm.nom || !pointDepotForm.adresse) {
//       alert('Veuillez remplir tous les champs obligatoires');
//       return;
//     }
    
//     try {
//       const response = await fetch(`${API_URL}/api/points-depot`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(pointDepotForm)
//       });

//       const result = await response.json();

//       if (result.success) {
//         alert('✅ Point de collecte créé avec succès');
//         setShowPointDepotModal(false);
//         setPointDepotForm({
//           nom: '',
//           adresse: '',
//           quartier: '',
//           commune: '',
//           typesDechetsAcceptes: []
//         });
//         await loadAllData();
//       } else {
//         throw new Error(result.message || 'Erreur lors de la création');
//       }
//     } catch (error) {
//       console.error('❌ Erreur:', error);
//       alert(error.message);
//     }
//   };

//   const handleModifierPointDepot = async (e) => {
//     e.preventDefault();
//     const token = getToken();
    
//     if (!editingPointDepot || !editingPointDepot.id) {
//       alert('Erreur : Aucun point de collecte sélectionné');
//       return;
//     }
    
//     try {
//       const response = await fetch(`${API_URL}/api/points-depot/${editingPointDepot.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(editingPointDepot)
//       });

//       const result = await response.json();

//       if (result.success) {
//         alert('✅ Point de collecte modifié avec succès');
//         setShowPointDepotModal(false);
//         setEditingPointDepot(null);
//         await loadAllData();
//       } else {
//         throw new Error(result.message || 'Erreur lors de la modification');
//       }
//     } catch (error) {
//       console.error('❌ Erreur:', error);
//       alert(error.message);
//     }
//   };

//   const handleSupprimerPointDepot = async (id) => {
//     if (!window.confirm('Êtes-vous sûr de vouloir désactiver ce point de collecte ?')) return;
    
//     const token = getToken();
//     try {
//       const response = await fetch(`${API_URL}/api/points-depot/${id}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.ok) {
//         alert('✅ Point de collecte désactivé');
//         await loadAllData();
//       } else {
//         throw new Error('Erreur lors de la désactivation');
//       }
//     } catch (error) {
//       console.error('❌ Erreur:', error);
//       alert(error.message);
//     }
//   };

//   const handleAttribuerMission = async (missionId, collecteurId) => {
//     if (!collecteurId) {
//       alert('Veuillez sélectionner un collecteur');
//       return;
//     }
    
//     const token = getToken();
//     try {
//       const response = await fetch(`${API_URL}/api/superviseurs/missions/${missionId}/attribuer/${collecteurId}`, {
//         method: 'POST',
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.ok) {
//         alert('✅ Mission attribuée avec succès');
//         await loadAllData();
//       } else {
//         throw new Error('Erreur lors de l\'attribution');
//       }
//     } catch (error) {
//       console.error('❌ Erreur:', error);
//       alert(error.message);
//     }
//   };

//   // ==================== UTILITAIRES ====================
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('fr-FR', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     });
//   };

//   const getStatusBadge = (statut) => {
//     switch (statut) {
//       case 'actif':
//         return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Actif</span>;
//       case 'en_attente':
//         return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">En attente</span>;
//       case 'suspendu':
//         return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Suspendu</span>;
//       case 'inactif':
//         return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Inactif</span>;
//       default:
//         return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{statut}</span>;
//     }
//   };

//   // ==================== COMPOSANT SIDEBAR ====================
//   const Sidebar = () => {
//     const menuItems = {
//       principal: [
//         { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, path: '/superviseur' },
//         { id: 'collecteurs', label: 'Gestion collecteurs', icon: Users, path: '/superviseur/collecteurs', badge: stats.collecteursEnAttente },
//         { id: 'gestionnaires', label: 'Gestion gestionnaires', icon: UserCog, path: '/superviseur/gestionnaires' },
//         { id: 'points-depot', label: 'Points de collecte', icon: Building, path: '/superviseur/points-depot' },
//         { id: 'missions', label: 'Gestion missions', icon: Package, path: '/superviseur/missions' }
//       ],
//       compte: [
//         { id: 'profil', label: 'Mon profil', icon: User, path: '/superviseur/profil' },
//         { id: 'securite', label: 'Sécurité', icon: Shield, path: '/superviseur/securite' },
//         { id: 'aide', label: 'Aide', icon: HelpCircle, path: '/superviseur/aide' }
//       ]
//     };

//     const NavSection = ({ title, items }) => (
//       <div className="mb-6">
//         <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
//           {title}
//         </h3>
//         <ul className="space-y-1">
//           {items.map(item => {
//             const Icon = item.icon;
//             const isActive = currentPage === item.id;
            
//             return (
//               <li key={item.id}>
//                 <Link
//                   to={item.path}
//                   onClick={() => {
//                     setCurrentPage(item.id);
//                     setSidebarOpen(false);
//                   }}
//                   className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
//                     isActive
//                       ? 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 border-l-4 border-purple-600'
//                       : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
//                   }`}
//                 >
//                   <div className="flex items-center gap-3">
//                     <Icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : 'text-gray-400'}`} />
//                     <span className="font-medium">{item.label}</span>
//                   </div>
//                   {item.badge > 0 && (
//                     <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
//                       {item.badge}
//                     </span>
//                   )}
//                 </Link>
//               </li>
//             );
//           })}
//         </ul>
//       </div>
//     );

//     return (
//       <>
//         {/* Mobile Sidebar */}
//         <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
//           sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
//         }`}>
//           <div 
//             className={`absolute inset-0 bg-black transition-opacity duration-300 ${
//               sidebarOpen ? 'opacity-50' : 'opacity-0'
//             }`}
//             onClick={() => setSidebarOpen(false)}
//           />
          
//           <div className={`absolute top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ${
//             sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//           }`}>
//             <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <User className="w-8 h-8 text-white" />
//                   <span className="text-xl font-bold text-white">Superviseur</span>
//                 </div>
//                 <button
//                   onClick={() => setSidebarOpen(false)}
//                   className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>

//             <div className="p-4 border-b">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
//                   {getInitials(userData.nomComplet)}
//                 </div>
//                 <div className="flex-1">
//                   <p className="font-semibold text-gray-900">{userData.nomComplet || 'Superviseur'}</p>
//                   <p className="text-xs text-gray-500">{userData.role}</p>
//                   <p className="text-xs text-gray-500 mt-1">{userData.email}</p>
//                 </div>
//               </div>
//             </div>

//             <nav className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
//               <NavSection title="Principal" items={menuItems.principal} />
//               <NavSection title="Compte" items={menuItems.compte} />

//               <div className="mt-6 pt-6 border-t">
//                 <button
//                   onClick={handleLogout}
//                   className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
//                 >
//                   <LogOut className="w-5 h-5" />
//                   <span className="font-medium">Déconnexion</span>
//                 </button>
//               </div>
//             </nav>
//           </div>
//         </div>

//         {/* Desktop Sidebar */}
//         <div className="hidden lg:block fixed top-0 left-0 h-screen bg-white shadow-xl z-40 w-80 overflow-hidden">
//           <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
//             <div className="flex items-center gap-2">
//               <User className="w-8 h-8 text-white" />
//               <span className="text-xl font-bold text-white">Superviseur</span>
//             </div>
//           </div>

//           <div className="p-4 border-b">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
//                 {getInitials(userData.nomComplet)}
//               </div>
//               <div className="flex-1">
//                 <p className="font-semibold text-gray-900">{userData.nomComplet || 'Superviseur'}</p>
//                 <p className="text-xs text-gray-500">{userData.role}</p>
//                 <p className="text-xs text-gray-500 mt-1">{userData.email}</p>
//               </div>
//             </div>
//           </div>

//           <nav className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
//             <NavSection title="Principal" items={menuItems.principal} />
//             <NavSection title="Compte" items={menuItems.compte} />

//             <div className="mt-6 pt-6 border-t">
//               <button
//                 onClick={handleLogout}
//                 className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
//               >
//                 <LogOut className="w-5 h-5" />
//                 <span className="font-medium">Déconnexion</span>
//               </button>
//             </div>
//           </nav>
//         </div>
//       </>
//     );
//   };

//   // ==================== PAGE TABLEAU DE BORD ====================
//   const DashboardPage = () => (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//           <LayoutDashboard className="h-6 w-6 text-purple-600" />
//           Tableau de bord
//         </h1>
//         <p className="text-gray-600">Bienvenue, {userData.nomComplet?.split(' ')[0] || 'Superviseur'} !</p>
//       </div>

//       {/* Statistiques principales */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
//           <div className="flex items-center justify-between mb-4">
//             <Users className="h-8 w-8" />
//             <span className="text-3xl font-bold">{stats.totalCollecteurs}</span>
//           </div>
//           <p className="text-purple-100">Collecteurs</p>
//           <div className="mt-2 flex items-center justify-between text-sm">
//             <span>Actifs: {stats.collecteursActifs}</span>
//             <span className="bg-white/20 px-2 py-1 rounded-full">
//               En attente: {stats.collecteursEnAttente}
//             </span>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-6 text-white">
//           <div className="flex items-center justify-between mb-4">
//             <UserCog className="h-8 w-8" />
//             <span className="text-3xl font-bold">{stats.totalGestionnaires}</span>
//           </div>
//           <p className="text-blue-100">Gestionnaires</p>
//           <div className="mt-2 flex items-center justify-between text-sm">
//             <span>Actifs: {stats.gestionnairesActifs}</span>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
//           <div className="flex items-center justify-between mb-4">
//             <Package className="h-8 w-8" />
//             <span className="text-3xl font-bold">{stats.missionsValidees}</span>
//           </div>
//           <p className="text-green-100">Missions validées</p>
//           <div className="mt-2 flex items-center justify-between text-sm">
//             <span>Total: {stats.totalMissions}</span>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-orange-600 to-amber-600 rounded-2xl shadow-xl p-6 text-white">
//           <div className="flex items-center justify-between mb-4">
//             <Scale className="h-8 w-8" />
//             <span className="text-3xl font-bold">{stats.totalDechetsCollectes} kg</span>
//           </div>
//           <p className="text-orange-100">Déchets collectés</p>
//           <div className="mt-2 flex items-center justify-between text-sm">
//             <span>Gains: {stats.totalGainsDistribues.toLocaleString()} FCFA</span>
//           </div>
//         </div>
//       </div>

//       {/* Collecteurs en attente */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//               <Users className="h-5 w-5 text-purple-600" />
//               Collecteurs en attente
//               {collecteursEnAttente.length > 0 && (
//                 <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
//                   {collecteursEnAttente.length}
//                 </span>
//               )}
//             </h3>
//             <Link to="/superviseur/collecteurs" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
//               Voir tout
//             </Link>
//           </div>
          
//           <div className="space-y-4 max-h-96 overflow-y-auto">
//             {collecteursEnAttente.length > 0 ? (
//               collecteursEnAttente.slice(0, 5).map((collecteur) => (
//                 <div
//                   key={collecteur.id}
//                   className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
//                   onClick={() => {
//                     setSelectedCollecteur(collecteur);
//                     setShowCollecteurDetails(true);
//                   }}
//                 >
//                   <div className="flex items-start justify-between mb-2">
//                     <div>
//                       <p className="font-semibold text-gray-900">{collecteur.nomComplet || collecteur.nom_complet}</p>
//                       <p className="text-sm text-gray-600 mt-1">
//                         <Mail className="inline h-3 w-3 mr-1" /> {collecteur.email}
//                       </p>
//                       <p className="text-sm text-gray-600">
//                         <Phone className="inline h-3 w-3 mr-1" /> {collecteur.telephone}
//                       </p>
//                     </div>
//                     {getStatusBadge(collecteur.statut)}
//                   </div>
//                   <div className="text-sm text-gray-500">
//                     <Calendar className="inline h-3 w-3 mr-1" />
//                     Inscrit le {formatDate(collecteur.cree_le)}
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-center text-gray-500 py-8">Aucun collecteur en attente</p>
//             )}
//           </div>
//         </div>

//         {/* Évolution récente */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//               <TrendingUp className="h-5 w-5 text-purple-600" />
//               Évolution des 7 derniers jours
//             </h3>
//           </div>
          
//           <div className="space-y-4">
//             {evolutionHebdomadaire.length > 0 ? (
//               evolutionHebdomadaire.map((jour, index) => (
//                 <div key={index} className="border border-gray-200 rounded-lg p-4">
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="font-medium text-gray-900">
//                       {new Date(jour.jour).toLocaleDateString('fr-FR', {
//                         weekday: 'long',
//                         day: 'numeric',
//                         month: 'long'
//                       })}
//                     </span>
//                     <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
//                       {jour.missions_validees || 0} missions
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-gray-600">Poids: {jour.poids_total || 0} kg</span>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-center text-gray-500 py-8">Aucune donnée disponible</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Gestionnaires récents */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//             <UserCog className="h-5 w-5 text-purple-600" />
//             Gestionnaires récents
//           </h3>
//           <Link to="/superviseur/gestionnaires" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
//             Voir tout
//           </Link>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {gestionnaires.slice(0, 3).map((gestionnaire) => (
//             <div key={gestionnaire.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
//               <div className="flex items-start justify-between mb-2">
//                 <div>
//                   <p className="font-semibold text-gray-900">{gestionnaire.nomComplet || gestionnaire.nom_complet}</p>
//                   <p className="text-sm text-gray-600 mt-1">{gestionnaire.fonction}</p>
//                 </div>
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                   gestionnaire.est_actif ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                 }`}>
//                   {gestionnaire.est_actif ? 'Actif' : 'Inactif'}
//                 </span>
//               </div>
//               <p className="text-sm text-gray-600 mt-2">
//                 <MapPin className="inline h-3 w-3 mr-1" />
//                 {gestionnaire.point_collecte_nom || 'Non assigné'}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   // ==================== PAGE GESTION GESTIONNAIRES ====================
//   const GestionnairesPage = () => {
//     const [localEditingGestionnaire, setLocalEditingGestionnaire] = useState(null);
//     const [localShowModal, setLocalShowModal] = useState(false);

//     const handleOpenCreateModal = () => {
//       setLocalEditingGestionnaire(null);
//       setGestionnaireForm({
//         email: '',
//         telephone: '',
//         motDePasse: '',
//         nomComplet: '',
//         pointCollecteId: '',
//         fonction: 'Gestionnaire'
//       });
//       setLocalShowModal(true);
//       setShowGestionnaireModal(true);
//     };

//     const handleOpenEditModal = (gestionnaire) => {
//       if (gestionnaire && gestionnaire.id) {
//         setLocalEditingGestionnaire({
//           id: gestionnaire.id,
//           email: gestionnaire.email || '',
//           telephone: gestionnaire.telephone || '',
//           nomComplet: gestionnaire.nomComplet || gestionnaire.nom_complet || '',
//           pointCollecteId: gestionnaire.point_collecte_id || '',
//           fonction: gestionnaire.fonction || 'Gestionnaire',
//           estActif: gestionnaire.est_actif !== undefined ? gestionnaire.est_actif : true
//         });
//         setEditingGestionnaire({
//           id: gestionnaire.id,
//           email: gestionnaire.email || '',
//           telephone: gestionnaire.telephone || '',
//           nomComplet: gestionnaire.nomComplet || gestionnaire.nom_complet || '',
//           pointCollecteId: gestionnaire.point_collecte_id || '',
//           fonction: gestionnaire.fonction || 'Gestionnaire',
//           estActif: gestionnaire.est_actif !== undefined ? gestionnaire.est_actif : true
//         });
//         setLocalShowModal(true);
//         setShowGestionnaireModal(true);
//       } else {
//         console.error('Gestionnaire invalide:', gestionnaire);
//         alert('Erreur : gestionnaire invalide');
//       }
//     };

//     const handleCloseModal = () => {
//       setLocalShowModal(false);
//       setShowGestionnaireModal(false);
//       setLocalEditingGestionnaire(null);
//       setEditingGestionnaire(null);
//     };

//     const filteredGestionnaires = gestionnaires.filter(g => {
//       return (g.nomComplet || g.nom_complet || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//              (g.email || '').toLowerCase().includes(searchTerm.toLowerCase());
//     });

//     return (
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//               <UserCog className="h-6 w-6 text-purple-600" />
//               Gestion des gestionnaires
//             </h1>
//             <p className="text-gray-600 mt-1">{gestionnaires.length} gestionnaires</p>
//           </div>
//           <button
//             onClick={handleOpenCreateModal}
//             className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
//           >
//             <UserPlus className="h-4 w-4" />
//             Nouveau gestionnaire
//           </button>
//         </div>

//         {/* Recherche */}
//         <div className="mb-6">
//           <div className="relative">
//             <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Rechercher un gestionnaire..."
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
//             />
//           </div>
//         </div>

//         {/* Liste des gestionnaires */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <div className="space-y-4">
//             {filteredGestionnaires.length > 0 ? (
//               filteredGestionnaires.map((gestionnaire) => (
//                 <div key={gestionnaire.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-3 mb-2">
//                         <h3 className="font-semibold text-gray-900">
//                           {gestionnaire.nomComplet || gestionnaire.nom_complet}
//                         </h3>
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           gestionnaire.est_actif ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                         }`}>
//                           {gestionnaire.est_actif ? 'Actif' : 'Inactif'}
//                         </span>
//                       </div>
                      
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
//                         <div className="flex items-center gap-2">
//                           <Mail className="h-4 w-4 text-gray-400" />
//                           <span>{gestionnaire.email}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Phone className="h-4 w-4 text-gray-400" />
//                           <span>{gestionnaire.telephone}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <MapPin className="h-4 w-4 text-gray-400" />
//                           <span>{gestionnaire.point_collecte_nom || 'Non assigné'}</span>
//                         </div>
//                       </div>
//                       <p className="text-sm text-gray-500 mt-2">
//                         <UserCog className="inline h-3 w-3 mr-1" />
//                         {gestionnaire.fonction}
//                       </p>
//                     </div>
                    
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => handleOpenEditModal(gestionnaire)}
//                         className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
//                       >
//                         <Edit2 className="h-4 w-4" />
//                       </button>
//                       <button
//                         onClick={() => handleActiverGestionnaire(gestionnaire.id, !gestionnaire.est_actif)}
//                         className={`p-2 ${
//                           gestionnaire.est_actif ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
//                         } rounded-lg`}
//                       >
//                         {gestionnaire.est_actif ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-12">
//                 <UserCog className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun gestionnaire trouvé</h3>
//                 <p className="text-gray-600">Cliquez sur "Nouveau gestionnaire" pour en créer un</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Modal de création/édition */}
//         {showGestionnaireModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
//               <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-2xl font-bold text-gray-900">
//                     {editingGestionnaire ? 'Modifier le gestionnaire' : 'Créer un gestionnaire'}
//                   </h2>
//                   <button
//                     onClick={handleCloseModal}
//                     className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg"
//                   >
//                     <X className="h-6 w-6" />
//                   </button>
//                 </div>
//               </div>

//               <form
//                 onSubmit={editingGestionnaire ? handleModifierGestionnaire : handleCreerGestionnaire}
//                 className="p-6 space-y-4"
//               >
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet *</label>
//                     <input
//                       type="text"
//                       value={editingGestionnaire ? editingGestionnaire.nomComplet : gestionnaireForm.nomComplet}
//                       onChange={(e) => {
//                         if (editingGestionnaire) {
//                           setEditingGestionnaire({...editingGestionnaire, nomComplet: e.target.value});
//                         } else {
//                           setGestionnaireForm({...gestionnaireForm, nomComplet: e.target.value});
//                         }
//                       }}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
//                     <input
//                       type="email"
//                       value={editingGestionnaire ? editingGestionnaire.email : gestionnaireForm.email}
//                       onChange={(e) => {
//                         if (editingGestionnaire) {
//                           setEditingGestionnaire({...editingGestionnaire, email: e.target.value});
//                         } else {
//                           setGestionnaireForm({...gestionnaireForm, email: e.target.value});
//                         }
//                       }}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
//                     <input
//                       type="tel"
//                       value={editingGestionnaire ? editingGestionnaire.telephone : gestionnaireForm.telephone}
//                       onChange={(e) => {
//                         if (editingGestionnaire) {
//                           setEditingGestionnaire({...editingGestionnaire, telephone: e.target.value});
//                         } else {
//                           setGestionnaireForm({...gestionnaireForm, telephone: e.target.value});
//                         }
//                       }}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
//                       required
//                     />
//                   </div>

//                   {!editingGestionnaire && (
//                     <div className="col-span-2">
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe *</label>
//                       <input
//                         type="password"
//                         value={gestionnaireForm.motDePasse}
//                         onChange={(e) => setGestionnaireForm({...gestionnaireForm, motDePasse: e.target.value})}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
//                         required
//                       />
//                     </div>
//                   )}

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Fonction</label>
//                     <input
//                       type="text"
//                       value={editingGestionnaire ? editingGestionnaire.fonction : gestionnaireForm.fonction}
//                       onChange={(e) => {
//                         if (editingGestionnaire) {
//                           setEditingGestionnaire({...editingGestionnaire, fonction: e.target.value});
//                         } else {
//                           setGestionnaireForm({...gestionnaireForm, fonction: e.target.value});
//                         }
//                       }}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Point de collecte</label>
//                     <select
//                       value={editingGestionnaire ? editingGestionnaire.pointCollecteId : gestionnaireForm.pointCollecteId}
//                       onChange={(e) => {
//                         if (editingGestionnaire) {
//                           setEditingGestionnaire({...editingGestionnaire, pointCollecteId: e.target.value});
//                         } else {
//                           setGestionnaireForm({...gestionnaireForm, pointCollecteId: e.target.value});
//                         }
//                       }}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
//                     >
//                       <option value="">Non assigné</option>
//                       {pointsDepot.map(p => (
//                         <option key={p.id} value={p.id}>{p.nom}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="flex gap-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={handleCloseModal}
//                     className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
//                   >
//                     Annuler
//                   </button>
//                   <button
//                     type="submit"
//                     className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
//                   >
//                     {editingGestionnaire ? 'Modifier' : 'Créer'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // ==================== PAGE POINTS DE COLLECTE ====================
//   const PointsDepotPage = () => {
//     const [localEditingPoint, setLocalEditingPoint] = useState(null);
//     const [localShowModal, setLocalShowModal] = useState(false);

//     const handleOpenCreateModal = () => {
//       setLocalEditingPoint(null);
//       setEditingPointDepot(null);
//       setPointDepotForm({
//         nom: '',
//         adresse: '',
//         quartier: '',
//         commune: '',
//         typesDechetsAcceptes: []
//       });
//       setLocalShowModal(true);
//       setShowPointDepotModal(true);
//     };

//     const handleOpenEditModal = (point) => {
//       if (point && point.id) {
//         setLocalEditingPoint(point);
//         setEditingPointDepot({
//           id: point.id,
//           nom: point.nom || '',
//           adresse: point.adresse || '',
//           quartier: point.quartier || '',
//           commune: point.commune || '',
//           typesDechetsAcceptes: point.types_dechets_acceptes || []
//         });
//         setLocalShowModal(true);
//         setShowPointDepotModal(true);
//       }
//     };

//     const handleCloseModal = () => {
//       setLocalShowModal(false);
//       setShowPointDepotModal(false);
//       setLocalEditingPoint(null);
//       setEditingPointDepot(null);
//     };

//     const filteredPoints = pointsDepot.filter(p => 
//       (p.nom || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (p.adresse || '').toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//               <Building className="h-6 w-6 text-purple-600" />
//               Points de collecte
//             </h1>
//             <p className="text-gray-600 mt-1">{pointsDepot.length} points actifs</p>
//           </div>
//           <button
//             onClick={handleOpenCreateModal}
//             className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
//           >
//             <Plus className="h-4 w-4" />
//             Nouveau point
//           </button>
//         </div>

//         {/* Recherche */}
//         <div className="mb-6">
//           <div className="relative">
//             <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Rechercher un point de collecte..."
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
//             />
//           </div>
//         </div>

//         {/* Liste des points */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredPoints.map((point) => (
//             <div key={point.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
//               <div className="flex items-start justify-between mb-4">
//                 <div>
//                   <h3 className="font-bold text-gray-900 text-lg">{point.nom}</h3>
//                   <p className="text-sm text-gray-600 mt-1">{point.adresse}</p>
//                   {point.quartier && <p className="text-sm text-gray-500">{point.quartier}</p>}
//                   {point.commune && <p className="text-sm text-gray-500">{point.commune}</p>}
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => handleOpenEditModal(point)}
//                     className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
//                   >
//                     <Edit2 className="h-4 w-4" />
//                   </button>
//                   <button
//                     onClick={() => handleSupprimerPointDepot(point.id)}
//                     className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>

//               <div className="mt-4">
//                 <p className="text-xs font-medium text-gray-500 mb-2">Déchets acceptés</p>
//                 <div className="flex flex-wrap gap-2">
//                   {point.types_dechets_acceptes && Array.isArray(point.types_dechets_acceptes) && point.types_dechets_acceptes.length > 0 ? (
//                     point.types_dechets_acceptes.map((type, i) => (
//                       <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
//                         {type}
//                       </span>
//                     ))
//                   ) : (
//                     <p className="text-xs text-gray-400">Aucun type spécifié</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Modal de création/édition */}
//         {showPointDepotModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
//               <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-2xl font-bold text-gray-900">
//                     {editingPointDepot ? 'Modifier le point de collecte' : 'Créer un point de collecte'}
//                   </h2>
//                   <button
//                     onClick={handleCloseModal}
//                     className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg"
//                   >
//                     <X className="h-6 w-6" />
//                   </button>
//                 </div>
//               </div>

//               <form
//                 onSubmit={editingPointDepot ? handleModifierPointDepot : handleCreerPointDepot}
//                 className="p-6 space-y-4"
//               >
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
//                     <input
//                       type="text"
//                       value={editingPointDepot ? editingPointDepot.nom : pointDepotForm.nom}
//                       onChange={(e) => {
//                         if (editingPointDepot) {
//                           setEditingPointDepot({...editingPointDepot, nom: e.target.value});
//                         } else {
//                           setPointDepotForm({...pointDepotForm, nom: e.target.value});
//                         }
//                       }}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
//                       required
//                     />
//                   </div>

//                   <div className="col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
//                     <input
//                       type="text"
//                       value={editingPointDepot ? editingPointDepot.adresse : pointDepotForm.adresse}
//                       onChange={(e) => {
//                         if (editingPointDepot) {
//                           setEditingPointDepot({...editingPointDepot, adresse: e.target.value});
//                         } else {
//                           setPointDepotForm({...pointDepotForm, adresse: e.target.value});
//                         }
//                       }}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Quartier</label>
//                     <input
//                       type="text"
//                       value={editingPointDepot ? editingPointDepot.quartier : pointDepotForm.quartier}
//                       onChange={(e) => {
//                         if (editingPointDepot) {
//                           setEditingPointDepot({...editingPointDepot, quartier: e.target.value});
//                         } else {
//                           setPointDepotForm({...pointDepotForm, quartier: e.target.value});
//                         }
//                       }}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Commune</label>
//                     <input
//                       type="text"
//                       value={editingPointDepot ? editingPointDepot.commune : pointDepotForm.commune}
//                       onChange={(e) => {
//                         if (editingPointDepot) {
//                           setEditingPointDepot({...editingPointDepot, commune: e.target.value});
//                         } else {
//                           setPointDepotForm({...pointDepotForm, commune: e.target.value});
//                         }
//                       }}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
//                     />
//                   </div>

//                   <div className="col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Types de déchets acceptés</label>
//                     <select
//                       multiple
//                       value={editingPointDepot ? editingPointDepot.typesDechetsAcceptes : pointDepotForm.typesDechetsAcceptes}
//                       onChange={(e) => {
//                         const values = Array.from(e.target.selectedOptions, option => option.value);
//                         if (editingPointDepot) {
//                           setEditingPointDepot({...editingPointDepot, typesDechetsAcceptes: values});
//                         } else {
//                           setPointDepotForm({...pointDepotForm, typesDechetsAcceptes: values});
//                         }
//                       }}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
//                     >
//                       <option value="plastique_pet">Plastique PET</option>
//                       <option value="plastique_pehd">Plastique PEHD</option>
//                       <option value="papier_carton">Papier/Carton</option>
//                       <option value="metal">Métal</option>
//                       <option value="verre">Verre</option>
//                       <option value="organique">Organique</option>
//                     </select>
//                     <p className="text-xs text-gray-500 mt-1">Maintenez Ctrl pour sélectionner plusieurs types</p>
//                   </div>
//                 </div>

//                 <div className="flex gap-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={handleCloseModal}
//                     className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
//                   >
//                     Annuler
//                   </button>
//                   <button
//                     type="submit"
//                     className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
//                   >
//                     {editingPointDepot ? 'Modifier' : 'Créer'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // ==================== AUTRES PAGES SIMPLIFIÉES ====================
//   const CollecteursPage = () => (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//           <Users className="h-6 w-6 text-purple-600" />
//           Gestion des collecteurs
//         </h1>
//         <p className="text-gray-600">Page en cours de développement</p>
//       </div>
//       <div className="bg-white rounded-xl shadow-lg p-12 text-center">
//         <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//         <h3 className="text-lg font-semibold text-gray-900 mb-2">Fonctionnalité à venir</h3>
//         <p className="text-gray-600">La gestion détaillée des collecteurs sera bientôt disponible</p>
//       </div>
//     </div>
//   );

//   const MissionsPage = () => (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//           <Package className="h-6 w-6 text-purple-600" />
//           Gestion des missions
//         </h1>
//         <p className="text-gray-600">Page en cours de développement</p>
//       </div>
//       <div className="bg-white rounded-xl shadow-lg p-12 text-center">
//         <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//         <h3 className="text-lg font-semibold text-gray-900 mb-2">Fonctionnalité à venir</h3>
//         <p className="text-gray-600">La gestion des missions sera bientôt disponible</p>
//       </div>
//     </div>
//   );

//   const ProfilPage = () => (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//           <User className="h-6 w-6 text-purple-600" />
//           Mon profil
//         </h1>
//         <p className="text-gray-600">Gérez vos informations personnelles</p>
//       </div>
//       <div className="bg-white rounded-xl shadow-lg p-6 max-w-md">
//         <div className="space-y-4">
//           <div>
//             <label className="text-sm font-medium text-gray-500">Nom complet</label>
//             <p className="text-lg font-semibold">{userData.nomComplet}</p>
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-500">Email</label>
//             <p className="text-lg">{userData.email}</p>
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-500">Téléphone</label>
//             <p className="text-lg">{userData.telephone || 'Non renseigné'}</p>
//           </div>
//           <div>
//             <label className="text-sm font-medium text-gray-500">Rôle</label>
//             <p className="text-lg">{userData.role}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const SecuritePage = () => (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//           <Shield className="h-6 w-6 text-purple-600" />
//           Sécurité
//         </h1>
//         <p className="text-gray-600">Gérez la sécurité de votre compte</p>
//       </div>
//       <div className="bg-white rounded-xl shadow-lg p-6 max-w-md">
//         <p className="text-gray-600 mb-4">Fonctionnalité de changement de mot de passe à venir</p>
//       </div>
//     </div>
//   );

//   const AidePage = () => (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//           <HelpCircle className="h-6 w-6 text-purple-600" />
//           Centre d'aide
//         </h1>
//         <p className="text-gray-600">Guide d'utilisation du superviseur</p>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h2 className="text-lg font-bold text-gray-900 mb-4">Gestion des gestionnaires</h2>
//           <ul className="space-y-2 text-gray-600">
//             <li>• Créez de nouveaux comptes gestionnaires</li>
//             <li>• Assignez-les à des points de collecte</li>
//             <li>• Activez ou désactivez leurs comptes</li>
//           </ul>
//         </div>
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h2 className="text-lg font-bold text-gray-900 mb-4">Points de collecte</h2>
//           <ul className="space-y-2 text-gray-600">
//             <li>• Ajoutez de nouveaux points de collecte</li>
//             <li>• Définissez les types de déchets acceptés</li>
//             <li>• Modifiez ou désactivez des points existants</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );

//   // ==================== ROUTAGE ====================
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <Sidebar />
//         <div className="lg:ml-80 min-h-screen">
//           <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
//             <div className="px-4 py-3 flex items-center justify-between">
//               <button
//                 onClick={() => setSidebarOpen(true)}
//                 className="p-2 hover:bg-gray-100 rounded-lg"
//               >
//                 <Menu className="w-6 h-6 text-gray-600" />
//               </button>
//               <div className="flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-semibold text-sm">
//                   {getInitials(userData.nomComplet)}
//                 </div>
//               </div>
//             </div>
//           </header>
//           <div className="flex items-center justify-center h-[calc(100vh-64px)]">
//             <div className="text-center">
//               <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//               <p className="text-gray-600">Chargement du tableau de bord...</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <Sidebar />
//         <div className="lg:ml-80 min-h-screen">
//           <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
//             <div className="px-4 py-3 flex items-center justify-between">
//               <button
//                 onClick={() => setSidebarOpen(true)}
//                 className="p-2 hover:bg-gray-100 rounded-lg"
//               >
//                 <Menu className="w-6 h-6 text-gray-600" />
//               </button>
//               <div className="flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-semibold text-sm">
//                   {getInitials(userData.nomComplet)}
//                 </div>
//               </div>
//             </div>
//           </header>
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//             <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
//               <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//               <p className="text-red-600 text-lg mb-4">{error}</p>
//               <button
//                 onClick={loadAllData}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//               >
//                 Réessayer
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Sidebar />
      
//       {/* Header mobile */}
//       <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
//         <div className="px-4 py-3 flex items-center justify-between">
//           <button
//             onClick={() => setSidebarOpen(true)}
//             className="p-2 hover:bg-gray-100 rounded-lg"
//           >
//             <Menu className="w-6 h-6 text-gray-600" />
//           </button>
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-semibold text-sm">
//               {getInitials(userData.nomComplet)}
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content avec routage interne */}
//       <div className="lg:ml-80 min-h-screen">
//         <Routes>
//           <Route path="/" element={<DashboardPage />} />
//           <Route path="/collecteurs" element={<CollecteursPage />} />
//           <Route path="/gestionnaires" element={<GestionnairesPage />} />
//           <Route path="/points-depot" element={<PointsDepotPage />} />
//           <Route path="/missions" element={<MissionsPage />} />
//           <Route path="/profil" element={<ProfilPage />} />
//           <Route path="/securite" element={<SecuritePage />} />
//           <Route path="/aide" element={<AidePage />} />
//         </Routes>
//       </div>
//     </div>
//   );
// };

// export default DashboardSuperviseur;



import { useState, useEffect, useCallback, useRef, useMemo, useDeferredValue } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import {
  // Icônes principales
  User, Users, UserPlus, UserCheck, UserX, UserCog,
  Building, MapPin, Phone, Mail, Calendar, Clock,
  CheckCircle, XCircle, AlertCircle, Info, Eye,
  Edit2, Trash2, Save, X, Plus, Search, Filter,
  RefreshCw, Download, Upload, FileText, Printer,
  BarChart3, PieChart, TrendingUp, Award, Star,
  Shield, Key, LogOut, Menu, Home, LayoutDashboard,
  Package, Truck, Wallet, History, HelpCircle, Settings,
  ChevronRight, ChevronDown, ChevronUp, ArrowLeft,
  Scale, Gift, AlertTriangle, Check, Copy, ExternalLink
} from 'lucide-react';

// ==================== COMPOSANT PRINCIPAL ====================
const DashboardSuperviseur = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [userData, setUserData] = useState({
    id: '',
    nomComplet: '',
    email: '',
    telephone: '',
    role: '',
    photoUrl: ''
  });

  // États pour les données
  const [stats, setStats] = useState({
    totalCollecteurs: 0,
    collecteursActifs: 0,
    collecteursEnAttente: 0,
    totalGestionnaires: 0,
    gestionnairesActifs: 0,
    totalMissions: 0,
    missionsValidees: 0,
    totalDechetsCollectes: 0,
    totalGainsDistribues: 0
  });

  const [collecteursEnAttente, setCollecteursEnAttente] = useState([]);
  const [collecteurs, setCollecteurs] = useState([]);
  const [gestionnaires, setGestionnaires] = useState([]);
  const [pointsDepot, setPointsDepot] = useState([]);
  const [missionsDisponibles, setMissionsDisponibles] = useState([]);
  const [collecteursActifs, setCollecteursActifs] = useState([]);
  
  // États pour les statistiques avancées
  const [evolutionHebdomadaire, setEvolutionHebdomadaire] = useState([]);
  
  // États pour les modals
  const [showCollecteurDetails, setShowCollecteurDetails] = useState(false);
  const [selectedCollecteur, setSelectedCollecteur] = useState(null);
  const [showGestionnaireModal, setShowGestionnaireModal] = useState(false);
  const [showPointDepotModal, setShowPointDepotModal] = useState(false);
  const [editingGestionnaire, setEditingGestionnaire] = useState(null);
  const [editingPointDepot, setEditingPointDepot] = useState(null);
  
  // États pour les formulaires
  const [gestionnaireForm, setGestionnaireForm] = useState({
    email: '',
    telephone: '',
    motDePasse: '',
    nomComplet: '',
    pointCollecteId: '',
    fonction: 'Gestionnaire'
  });
  
  const [pointDepotForm, setPointDepotForm] = useState({
    nom: '',
    adresse: '',
    quartier: '',
    commune: '',
    typesDechetsAcceptes: []
  });

  // États pour la recherche avec optimisation
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  
  const [filterStatus, setFilterStatus] = useState('all');
  const [validationNotes, setValidationNotes] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Références pour éviter les re-rendus inutiles
  const initialLoadDone = useRef(false);
  const intervalRef = useRef(null);
  const formTimeouts = useRef({});

//   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_URL = 'https://ecobackend-y6nd.vercel.app';
  const STORAGE_KEYS = {
    TOKEN: 'ecocollect_token',
    USER: 'ecocollect_user',
    ROLE: 'ecocollect_role'
  };

  const getToken = () => localStorage.getItem(STORAGE_KEYS.TOKEN);
  
  const getInitials = (name) => {
    if (!name) return 'S';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.ROLE);
      navigate('/login');
    }
  };

  // ==================== CHARGEMENT DES DONNÉES ====================
  const loadUserData = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/superviseurs/profil`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const result = await response.json();
        const profil = result.superviseur || result;
        
        setUserData({
          id: profil.id || '',
          nomComplet: profil.nomComplet || profil.nom_complet || '',
          email: profil.email || '',
          telephone: profil.telephone || '',
          role: profil.role || 'Superviseur',
          photoUrl: profil.photoUrl || ''
        });
      } else {
        console.warn('Profil non chargé, utilisation des données du localStorage');
        const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
        setUserData({
          id: user.id || '',
          nomComplet: user.nomComplet || user.nom || 'Superviseur',
          email: user.email || '',
          telephone: user.telephone || '',
          role: 'Superviseur',
          photoUrl: ''
        });
      }
    } catch (error) {
      console.error('Erreur chargement utilisateur:', error);
      // Utiliser les données du localStorage en cas d'erreur
      const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
      setUserData({
        id: user.id || '',
        nomComplet: user.nomComplet || user.nom || 'Superviseur',
        email: user.email || '',
        telephone: user.telephone || '',
        role: 'Superviseur',
        photoUrl: ''
      });
    }
  }, [API_URL]);

  const loadAllData = useCallback(async () => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Charger les données disponibles
      const promises = [];

      // Statistiques
      promises.push(
        fetch(`${API_URL}/api/superviseurs/statistiques`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.ok ? res.json() : null)
      );

      // Collecteurs en attente
      promises.push(
        fetch(`${API_URL}/api/superviseurs/collecteurs/en-attente`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.ok ? res.json() : { collecteurs: [] })
      );

      // Tous les collecteurs (actifs + en attente)
      promises.push(
        fetch(`${API_URL}/api/superviseurs/collecteurs`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.ok ? res.json() : { collecteurs: [] })
      );

      // Gestionnaires
      promises.push(
        fetch(`${API_URL}/api/superviseurs/gestionnaires`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.ok ? res.json() : { gestionnaires: [] })
      );

      // Points de dépôt
      promises.push(
        fetch(`${API_URL}/api/points-depot`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.ok ? res.json() : { points: [] })
      );

      // Missions disponibles
      promises.push(
        fetch(`${API_URL}/api/superviseurs/missions/disponibles`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.ok ? res.json() : { missions: [] })
      );

      // Évolution
      promises.push(
        fetch(`${API_URL}/api/superviseurs/statistiques/evolution?jours=7`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.ok ? res.json() : { evolution: [] })
      );

      const [statsRes, collecteursAttenteRes, collecteursRes, gestionnairesRes, pointsRes, missionsRes, evolutionRes] = await Promise.all(promises);

      // Statistiques
      if (statsRes?.success) {
        const s = statsRes.stats || {};
        setStats({
          totalCollecteurs: s.total_collecteurs || 0,
          collecteursActifs: s.collecteurs_actifs || 0,
          collecteursEnAttente: s.collecteurs_en_attente || 0,
          totalGestionnaires: s.total_gestionnaires || 0,
          gestionnairesActifs: s.gestionnaires_actifs || 0,
          totalMissions: s.total_missions || 0,
          missionsValidees: s.missions_validees || 0,
          totalDechetsCollectes: s.total_dechets_collectes || 0,
          totalGainsDistribues: s.total_gains_distribues || 0
        });
      }

      // Collecteurs en attente
      if (collecteursAttenteRes?.success) {
        setCollecteursEnAttente(collecteursAttenteRes.collecteurs || []);
      }

      // Tous les collecteurs
      if (collecteursRes?.success) {
        setCollecteurs(collecteursRes.collecteurs || []);
      }

      // Gestionnaires
      if (gestionnairesRes?.success) {
        setGestionnaires(gestionnairesRes.gestionnaires || []);
      }

      // Points de dépôt
      if (pointsRes?.success) {
        setPointsDepot(pointsRes.points || []);
      }

      // Missions disponibles
      if (missionsRes?.success) {
        setMissionsDisponibles(missionsRes.missions || []);
      }

      // Évolution
      if (evolutionRes?.success) {
        setEvolutionHebdomadaire(evolutionRes.evolution || []);
      }

      // Collecteurs actifs (simulés pour l'instant)
      setCollecteursActifs([
        { id: '1', nomComplet: 'Collecteur 1', telephone: '771234567' },
        { id: '2', nomComplet: 'Collecteur 2', telephone: '778765432' }
      ]);

      setDataLoaded(true);
    } catch (error) {
      console.error('❌ Erreur chargement données:', error);
      setError('Impossible de charger les données');
      
      // Données simulées pour le développement
      setCollecteursEnAttente([
        { 
          id: '1', 
          nomComplet: 'Collecteur Test', 
          email: 'test@test.com', 
          telephone: '771234567',
          statut: 'en_attente',
          cree_le: new Date().toISOString()
        }
      ]);
      setCollecteurs([
        { 
          id: '1', 
          nomComplet: 'Collecteur Test', 
          email: 'test@test.com', 
          telephone: '771234567',
          statut: 'en_attente',
          cree_le: new Date().toISOString()
        }
      ]);
      setGestionnaires([
        { id: '1', nomComplet: 'Gestionnaire Test', email: 'test@test.com', telephone: '771234567', fonction: 'Principal', est_actif: true, point_collecte_nom: 'Point Central' }
      ]);
      setPointsDepot([
        { id: '1', nom: 'Point Central', adresse: 'Dakar Centre', types_dechets_acceptes: ['plastique', 'verre'] }
      ]);
      setDataLoaded(true);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, navigate]);

  // ==================== CHARGEMENT INITIAL ====================
  useEffect(() => {
    const token = getToken();
    const role = localStorage.getItem(STORAGE_KEYS.ROLE);
    
    if (!token || role !== 'superviseur') {
      navigate('/login');
      return;
    }

    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      
      const initializeData = async () => {
        await loadUserData();
        await loadAllData();
      };
      
      initializeData();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [navigate, loadUserData, loadAllData]);

  // ==================== RAFRAÎCHISSEMENT PÉRIODIQUE ====================
  useEffect(() => {
    if (dataLoaded && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        loadAllData();
      }, 60000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [dataLoaded, loadAllData]);

  // ==================== ACTIONS ====================
  const handleValiderCollecteur = async (collecteurId, notes) => {
    const token = getToken();
    try {
      const response = await fetch(`${API_URL}/api/superviseurs/collecteurs/${collecteurId}/valider`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notes })
      });

      if (response.ok) {
        alert('✅ Collecteur validé avec succès');
        setShowCollecteurDetails(false);
        await loadAllData();
      } else {
        throw new Error('Erreur lors de la validation');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert(error.message);
    }
  };

  const handleRejeterCollecteur = async (collecteurId, notes) => {
    const token = getToken();
    try {
      const response = await fetch(`${API_URL}/api/superviseurs/collecteurs/${collecteurId}/rejeter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notes: notes || 'Rejeté par le superviseur' })
      });

      if (response.ok) {
        alert('❌ Collecteur rejeté');
        setShowCollecteurDetails(false);
        await loadAllData();
      } else {
        throw new Error('Erreur lors du rejet');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert(error.message);
    }
  };

  // Version optimisée pour les formulaires - avec debounce
  const debouncedSetForm = (setter, field, value) => {
    // Annuler le timeout précédent pour ce champ
    if (formTimeouts.current[field]) {
      clearTimeout(formTimeouts.current[field]);
    }
    
    // Mettre à jour immédiatement l'état local
    setter(prev => ({ ...prev, [field]: value }));
  };

  const handleCreerGestionnaire = async (e) => {
    e.preventDefault();
    const token = getToken();
    
    // Validation des champs requis
    if (!gestionnaireForm.email || !gestionnaireForm.telephone || !gestionnaireForm.motDePasse || !gestionnaireForm.nomComplet) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/superviseurs/gestionnaires`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: gestionnaireForm.email,
          telephone: gestionnaireForm.telephone,
          motDePasse: gestionnaireForm.motDePasse,
          nomComplet: gestionnaireForm.nomComplet,
          pointCollecteId: gestionnaireForm.pointCollecteId || null,
          fonction: gestionnaireForm.fonction || 'Gestionnaire'
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('✅ Gestionnaire créé avec succès');
        setShowGestionnaireModal(false);
        setGestionnaireForm({
          email: '',
          telephone: '',
          motDePasse: '',
          nomComplet: '',
          pointCollecteId: '',
          fonction: 'Gestionnaire'
        });
        await loadAllData();
      } else {
        throw new Error(result.message || 'Erreur lors de la création');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert(error.message);
    }
  };

  const handleModifierGestionnaire = async (e) => {
    e.preventDefault();
    const token = getToken();
    
    // Vérifier que editingGestionnaire n'est pas null
    if (!editingGestionnaire || !editingGestionnaire.id) {
      alert('Erreur : Aucun gestionnaire sélectionné');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/superviseurs/gestionnaires/${editingGestionnaire.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: editingGestionnaire.email,
          telephone: editingGestionnaire.telephone,
          nomComplet: editingGestionnaire.nomComplet,
          pointCollecteId: editingGestionnaire.pointCollecteId || null,
          fonction: editingGestionnaire.fonction,
          estActif: editingGestionnaire.estActif
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('✅ Gestionnaire modifié avec succès');
        setShowGestionnaireModal(false);
        setEditingGestionnaire(null);
        await loadAllData();
      } else {
        throw new Error(result.message || 'Erreur lors de la modification');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert(error.message);
    }
  };

  const handleActiverGestionnaire = async (gestionnaireId, estActif) => {
    const token = getToken();
    try {
      const response = await fetch(`${API_URL}/api/superviseurs/gestionnaires/${gestionnaireId}/activer`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estActif })
      });

      if (response.ok) {
        alert(estActif ? '✅ Gestionnaire activé' : '✅ Gestionnaire désactivé');
        await loadAllData();
      } else {
        throw new Error('Erreur lors de l\'activation');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert(error.message);
    }
  };

  const handleCreerPointDepot = async (e) => {
    e.preventDefault();
    const token = getToken();
    
    if (!pointDepotForm.nom || !pointDepotForm.adresse) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/points-depot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pointDepotForm)
      });

      const result = await response.json();

      if (result.success) {
        alert('✅ Point de collecte créé avec succès');
        setShowPointDepotModal(false);
        setPointDepotForm({
          nom: '',
          adresse: '',
          quartier: '',
          commune: '',
          typesDechetsAcceptes: []
        });
        await loadAllData();
      } else {
        throw new Error(result.message || 'Erreur lors de la création');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert(error.message);
    }
  };

  const handleModifierPointDepot = async (e) => {
    e.preventDefault();
    const token = getToken();
    
    if (!editingPointDepot || !editingPointDepot.id) {
      alert('Erreur : Aucun point de collecte sélectionné');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/points-depot/${editingPointDepot.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingPointDepot)
      });

      const result = await response.json();

      if (result.success) {
        alert('✅ Point de collecte modifié avec succès');
        setShowPointDepotModal(false);
        setEditingPointDepot(null);
        await loadAllData();
      } else {
        throw new Error(result.message || 'Erreur lors de la modification');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert(error.message);
    }
  };

  const handleSupprimerPointDepot = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir désactiver ce point de collecte ?')) return;
    
    const token = getToken();
    try {
      const response = await fetch(`${API_URL}/api/points-depot/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('✅ Point de collecte désactivé');
        await loadAllData();
      } else {
        throw new Error('Erreur lors de la désactivation');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert(error.message);
    }
  };

  const handleAttribuerMission = async (missionId, collecteurId) => {
    if (!collecteurId) {
      alert('Veuillez sélectionner un collecteur');
      return;
    }
    
    const token = getToken();
    try {
      const response = await fetch(`${API_URL}/api/superviseurs/missions/${missionId}/attribuer/${collecteurId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('✅ Mission attribuée avec succès');
        await loadAllData();
      } else {
        throw new Error('Erreur lors de l\'attribution');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert(error.message);
    }
  };

  // ==================== UTILITAIRES ====================
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusBadge = (statut) => {
    switch (statut) {
      case 'actif':
      case 'valide':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Actif</span>;
      case 'en_attente':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">En attente</span>;
      case 'suspendu':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Suspendu</span>;
      case 'inactif':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Inactif</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{statut}</span>;
    }
  };

  // ==================== COMPOSANT SIDEBAR ====================
  const Sidebar = () => {
    const menuItems = {
      principal: [
        { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, path: '/superviseur' },
        { id: 'collecteurs', label: 'Gestion collecteurs', icon: Users, path: '/superviseur/collecteurs', badge: stats.collecteursEnAttente },
        { id: 'gestionnaires', label: 'Gestion gestionnaires', icon: UserCog, path: '/superviseur/gestionnaires' },
        { id: 'points-depot', label: 'Points de collecte', icon: Building, path: '/superviseur/points-depot' },
        { id: 'missions', label: 'Gestion missions', icon: Package, path: '/superviseur/missions' }
      ],
      compte: [
        { id: 'profil', label: 'Mon profil', icon: User, path: '/superviseur/profil' },
        { id: 'securite', label: 'Sécurité', icon: Shield, path: '/superviseur/securite' },
        { id: 'aide', label: 'Aide', icon: HelpCircle, path: '/superviseur/aide' }
      ]
    };

    const NavSection = ({ title, items }) => (
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
          {title}
        </h3>
        <ul className="space-y-1">
          {items.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 border-l-4 border-purple-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : 'text-gray-400'}`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );

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
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-8 h-8 text-white" />
                  <span className="text-xl font-bold text-white">Superviseur</span>
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
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {getInitials(userData.nomComplet)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{userData.nomComplet || 'Superviseur'}</p>
                  <p className="text-xs text-gray-500">{userData.role}</p>
                  <p className="text-xs text-gray-500 mt-1">{userData.email}</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              <NavSection title="Principal" items={menuItems.principal} />
              <NavSection title="Compte" items={menuItems.compte} />

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
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
            <div className="flex items-center gap-2">
              <User className="w-8 h-8 text-white" />
              <span className="text-xl font-bold text-white">Superviseur</span>
            </div>
          </div>

          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {getInitials(userData.nomComplet)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{userData.nomComplet || 'Superviseur'}</p>
                <p className="text-xs text-gray-500">{userData.role}</p>
                <p className="text-xs text-gray-500 mt-1">{userData.email}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <NavSection title="Principal" items={menuItems.principal} />
            <NavSection title="Compte" items={menuItems.compte} />

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
    );
  };

  // ==================== PAGE TABLEAU DE BORD ====================
  const DashboardPage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-purple-600" />
          Tableau de bord
        </h1>
        <p className="text-gray-600">Bienvenue, {userData.nomComplet?.split(' ')[0] || 'Superviseur'} !</p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8" />
            <span className="text-3xl font-bold">{stats.totalCollecteurs}</span>
          </div>
          <p className="text-purple-100">Collecteurs</p>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span>Actifs: {stats.collecteursActifs}</span>
            <span className="bg-white/20 px-2 py-1 rounded-full">
              En attente: {stats.collecteursEnAttente}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <UserCog className="h-8 w-8" />
            <span className="text-3xl font-bold">{stats.totalGestionnaires}</span>
          </div>
          <p className="text-blue-100">Gestionnaires</p>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span>Actifs: {stats.gestionnairesActifs}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Package className="h-8 w-8" />
            <span className="text-3xl font-bold">{stats.missionsValidees}</span>
          </div>
          <p className="text-green-100">Missions validées</p>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span>Total: {stats.totalMissions}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-600 to-amber-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Scale className="h-8 w-8" />
            <span className="text-3xl font-bold">{stats.totalDechetsCollectes} kg</span>
          </div>
          <p className="text-orange-100">Déchets collectés</p>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span>Gains: {stats.totalGainsDistribues.toLocaleString()} FCFA</span>
          </div>
        </div>
      </div>

      {/* Collecteurs en attente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Collecteurs en attente
              {collecteursEnAttente.length > 0 && (
                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                  {collecteursEnAttente.length}
                </span>
              )}
            </h3>
            <Link to="/superviseur/collecteurs" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              Voir tout
            </Link>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {collecteursEnAttente.length > 0 ? (
              collecteursEnAttente.slice(0, 5).map((collecteur) => (
                <div
                  key={collecteur.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedCollecteur(collecteur);
                    setShowCollecteurDetails(true);
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{collecteur.nomComplet || collecteur.nom_complet}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        <Mail className="inline h-3 w-3 mr-1" /> {collecteur.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        <Phone className="inline h-3 w-3 mr-1" /> {collecteur.telephone}
                      </p>
                    </div>
                    {getStatusBadge(collecteur.statut)}
                  </div>
                  <div className="text-sm text-gray-500">
                    <Calendar className="inline h-3 w-3 mr-1" />
                    Inscrit le {formatDate(collecteur.cree_le)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">Aucun collecteur en attente</p>
            )}
          </div>
        </div>

        {/* Évolution récente */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Évolution des 7 derniers jours
            </h3>
          </div>
          
          <div className="space-y-4">
            {evolutionHebdomadaire.length > 0 ? (
              evolutionHebdomadaire.map((jour, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">
                      {new Date(jour.jour).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                      })}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                      {jour.missions_validees || 0} missions
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Poids: {jour.poids_total || 0} kg</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">Aucune donnée disponible</p>
            )}
          </div>
        </div>
      </div>

      {/* Gestionnaires récents */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <UserCog className="h-5 w-5 text-purple-600" />
            Gestionnaires récents
          </h3>
          <Link to="/superviseur/gestionnaires" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
            Voir tout
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gestionnaires.slice(0, 3).map((gestionnaire) => (
            <div key={gestionnaire.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{gestionnaire.nomComplet || gestionnaire.nom_complet}</p>
                  <p className="text-sm text-gray-600 mt-1">{gestionnaire.fonction}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  gestionnaire.est_actif ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {gestionnaire.est_actif ? 'Actif' : 'Inactif'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                <MapPin className="inline h-3 w-3 mr-1" />
                {gestionnaire.point_collecte_nom || 'Non assigné'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ==================== PAGE GESTION COLLECTEURS ====================
  const CollecteursPage = () => {
    // Filtrer les collecteurs avec le terme de recherche différé
    const filteredCollecteurs = useMemo(() => {
      if (!deferredSearchTerm) return collecteurs;
      return collecteurs.filter(c => 
        (c.nomComplet || c.nom_complet || '').toLowerCase().includes(deferredSearchTerm.toLowerCase()) ||
        (c.email || '').toLowerCase().includes(deferredSearchTerm.toLowerCase()) ||
        (c.telephone || '').toLowerCase().includes(deferredSearchTerm.toLowerCase())
      );
    }, [collecteurs, deferredSearchTerm]);

    const collecteursEnAttenteListe = useMemo(() => {
      return filteredCollecteurs.filter(c => c.statut === 'en_attente');
    }, [filteredCollecteurs]);

    const collecteursActifsListe = useMemo(() => {
      return filteredCollecteurs.filter(c => c.statut === 'actif' || c.statut === 'valide');
    }, [filteredCollecteurs]);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-purple-600" />
            Gestion des collecteurs
          </h1>
          <p className="text-gray-600 mt-1">Total: {collecteurs.length} collecteurs</p>
        </div>

        {/* Recherche */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un collecteur..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>

        {/* Collecteurs en attente */}
        {collecteursEnAttenteListe.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              Collecteurs en attente ({collecteursEnAttenteListe.length})
            </h2>
            <div className="space-y-4">
              {collecteursEnAttenteListe.map((collecteur) => (
                <div
                  key={collecteur.id}
                  className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => {
                    setSelectedCollecteur(collecteur);
                    setShowCollecteurDetails(true);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-bold text-gray-900 text-lg">
                          {collecteur.nomComplet || collecteur.nom_complet}
                        </h3>
                        {getStatusBadge(collecteur.statut)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{collecteur.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{collecteur.telephone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>Inscrit le {formatDate(collecteur.cree_le)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCollecteur(collecteur);
                        setShowCollecteurDetails(true);
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Traiter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Collecteurs actifs */}
        {collecteursActifsListe.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-green-600" />
              Collecteurs actifs ({collecteursActifsListe.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {collecteursActifsListe.map((collecteur) => (
                <div key={collecteur.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{collecteur.nomComplet || collecteur.nom_complet}</h3>
                      <p className="text-sm text-gray-600 mt-1">{collecteur.email}</p>
                    </div>
                    {getStatusBadge(collecteur.statut)}
                  </div>
                  <p className="text-sm text-gray-600">
                    <Phone className="inline h-3 w-3 mr-1" /> {collecteur.telephone}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredCollecteurs.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun collecteur trouvé</h3>
            <p className="text-gray-600">Aucun collecteur ne correspond à votre recherche</p>
          </div>
        )}

        {/* Modal de validation */}
        {showCollecteurDetails && selectedCollecteur && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Validation du collecteur</h2>
                  <button
                    onClick={() => setShowCollecteurDetails(false)}
                    className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800">Informations du collecteur</p>
                      <p className="text-sm text-blue-600 mt-1">
                        <span className="font-semibold">Nom:</span> {selectedCollecteur.nomComplet || selectedCollecteur.nom_complet}
                      </p>
                      <p className="text-sm text-blue-600">
                        <span className="font-semibold">Email:</span> {selectedCollecteur.email}
                      </p>
                      <p className="text-sm text-blue-600">
                        <span className="font-semibold">Téléphone:</span> {selectedCollecteur.telephone}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (optionnel)
                  </label>
                  <textarea
                    rows="3"
                    value={validationNotes}
                    onChange={(e) => setValidationNotes(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                    placeholder="Ajouter des notes..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      handleRejeterCollecteur(selectedCollecteur.id, validationNotes);
                      setValidationNotes('');
                    }}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold flex items-center justify-center gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Rejeter
                  </button>
                  <button
                    onClick={() => {
                      handleValiderCollecteur(selectedCollecteur.id, validationNotes);
                      setValidationNotes('');
                    }}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Valider
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==================== PAGE GESTION GESTIONNAIRES (OPTIMISÉE) ====================
  const GestionnairesPage = () => {
    const [localEditingGestionnaire, setLocalEditingGestionnaire] = useState(null);
    const [localShowModal, setLocalShowModal] = useState(false);

    // Version locale du formulaire avec gestion optimisée
    const [localGestionnaireForm, setLocalGestionnaireForm] = useState({
      email: '',
      telephone: '',
      motDePasse: '',
      nomComplet: '',
      pointCollecteId: '',
      fonction: 'Gestionnaire'
    });

    const handleOpenCreateModal = () => {
      setLocalEditingGestionnaire(null);
      setLocalGestionnaireForm({
        email: '',
        telephone: '',
        motDePasse: '',
        nomComplet: '',
        pointCollecteId: '',
        fonction: 'Gestionnaire'
      });
      setGestionnaireForm({
        email: '',
        telephone: '',
        motDePasse: '',
        nomComplet: '',
        pointCollecteId: '',
        fonction: 'Gestionnaire'
      });
      setLocalShowModal(true);
      setShowGestionnaireModal(true);
    };

    const handleOpenEditModal = (gestionnaire) => {
      if (gestionnaire && gestionnaire.id) {
        const editData = {
          id: gestionnaire.id,
          email: gestionnaire.email || '',
          telephone: gestionnaire.telephone || '',
          nomComplet: gestionnaire.nomComplet || gestionnaire.nom_complet || '',
          pointCollecteId: gestionnaire.point_collecte_id || '',
          fonction: gestionnaire.fonction || 'Gestionnaire',
          estActif: gestionnaire.est_actif !== undefined ? gestionnaire.est_actif : true
        };
        setLocalEditingGestionnaire(editData);
        setEditingGestionnaire(editData);
        setLocalShowModal(true);
        setShowGestionnaireModal(true);
      } else {
        console.error('Gestionnaire invalide:', gestionnaire);
        alert('Erreur : gestionnaire invalide');
      }
    };

    const handleCloseModal = () => {
      setLocalShowModal(false);
      setShowGestionnaireModal(false);
      setLocalEditingGestionnaire(null);
      setEditingGestionnaire(null);
    };

    // Filtrer les gestionnaires avec le terme de recherche différé
    const filteredGestionnaires = useMemo(() => {
      if (!deferredSearchTerm) return gestionnaires;
      return gestionnaires.filter(g => 
        (g.nomComplet || g.nom_complet || '').toLowerCase().includes(deferredSearchTerm.toLowerCase()) ||
        (g.email || '').toLowerCase().includes(deferredSearchTerm.toLowerCase()) ||
        (g.telephone || '').toLowerCase().includes(deferredSearchTerm.toLowerCase())
      );
    }, [gestionnaires, deferredSearchTerm]);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <UserCog className="h-6 w-6 text-purple-600" />
              Gestion des gestionnaires
            </h1>
            <p className="text-gray-600 mt-1">{gestionnaires.length} gestionnaires</p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Nouveau gestionnaire
          </button>
        </div>

        {/* Recherche */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un gestionnaire..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>

        {/* Liste des gestionnaires */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="space-y-4">
            {filteredGestionnaires.length > 0 ? (
              filteredGestionnaires.map((gestionnaire) => (
                <div key={gestionnaire.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {gestionnaire.nomComplet || gestionnaire.nom_complet}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          gestionnaire.est_actif ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {gestionnaire.est_actif ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{gestionnaire.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{gestionnaire.telephone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{gestionnaire.point_collecte_nom || 'Non assigné'}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        <UserCog className="inline h-3 w-3 mr-1" />
                        {gestionnaire.fonction}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenEditModal(gestionnaire)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleActiverGestionnaire(gestionnaire.id, !gestionnaire.est_actif)}
                        className={`p-2 ${
                          gestionnaire.est_actif ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
                        } rounded-lg`}
                      >
                        {gestionnaire.est_actif ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <UserCog className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun gestionnaire trouvé</h3>
                <p className="text-gray-600">Cliquez sur "Nouveau gestionnaire" pour en créer un</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal de création/édition */}
        {showGestionnaireModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingGestionnaire ? 'Modifier le gestionnaire' : 'Créer un gestionnaire'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <form
                onSubmit={editingGestionnaire ? handleModifierGestionnaire : handleCreerGestionnaire}
                className="p-6 space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet *</label>
                    <input
                      type="text"
                      value={editingGestionnaire ? editingGestionnaire.nomComplet : gestionnaireForm.nomComplet}
                      onChange={(e) => {
                        if (editingGestionnaire) {
                          setEditingGestionnaire({...editingGestionnaire, nomComplet: e.target.value});
                        } else {
                          setGestionnaireForm({...gestionnaireForm, nomComplet: e.target.value});
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={editingGestionnaire ? editingGestionnaire.email : gestionnaireForm.email}
                      onChange={(e) => {
                        if (editingGestionnaire) {
                          setEditingGestionnaire({...editingGestionnaire, email: e.target.value});
                        } else {
                          setGestionnaireForm({...gestionnaireForm, email: e.target.value});
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                    <input
                      type="tel"
                      value={editingGestionnaire ? editingGestionnaire.telephone : gestionnaireForm.telephone}
                      onChange={(e) => {
                        if (editingGestionnaire) {
                          setEditingGestionnaire({...editingGestionnaire, telephone: e.target.value});
                        } else {
                          setGestionnaireForm({...gestionnaireForm, telephone: e.target.value});
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                      required
                    />
                  </div>

                  {!editingGestionnaire && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe *</label>
                      <input
                        type="password"
                        value={gestionnaireForm.motDePasse}
                        onChange={(e) => setGestionnaireForm({...gestionnaireForm, motDePasse: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fonction</label>
                    <input
                      type="text"
                      value={editingGestionnaire ? editingGestionnaire.fonction : gestionnaireForm.fonction}
                      onChange={(e) => {
                        if (editingGestionnaire) {
                          setEditingGestionnaire({...editingGestionnaire, fonction: e.target.value});
                        } else {
                          setGestionnaireForm({...gestionnaireForm, fonction: e.target.value});
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Point de collecte</label>
                    <select
                      value={editingGestionnaire ? editingGestionnaire.pointCollecteId : gestionnaireForm.pointCollecteId}
                      onChange={(e) => {
                        if (editingGestionnaire) {
                          setEditingGestionnaire({...editingGestionnaire, pointCollecteId: e.target.value});
                        } else {
                          setGestionnaireForm({...gestionnaireForm, pointCollecteId: e.target.value});
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                    >
                      <option value="">Non assigné</option>
                      {pointsDepot.map(p => (
                        <option key={p.id} value={p.id}>{p.nom}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    {editingGestionnaire ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==================== PAGE POINTS DE COLLECTE ====================
  const PointsDepotPage = () => {
    const [localEditingPoint, setLocalEditingPoint] = useState(null);
    const [localShowModal, setLocalShowModal] = useState(false);

    // Version locale du formulaire avec gestion optimisée
    const [localPointDepotForm, setLocalPointDepotForm] = useState({
      nom: '',
      adresse: '',
      quartier: '',
      commune: '',
      typesDechetsAcceptes: []
    });

    const handleOpenCreateModal = () => {
      setLocalEditingPoint(null);
      setEditingPointDepot(null);
      setLocalPointDepotForm({
        nom: '',
        adresse: '',
        quartier: '',
        commune: '',
        typesDechetsAcceptes: []
      });
      setPointDepotForm({
        nom: '',
        adresse: '',
        quartier: '',
        commune: '',
        typesDechetsAcceptes: []
      });
      setLocalShowModal(true);
      setShowPointDepotModal(true);
    };

    const handleOpenEditModal = (point) => {
      if (point && point.id) {
        const editData = {
          id: point.id,
          nom: point.nom || '',
          adresse: point.adresse || '',
          quartier: point.quartier || '',
          commune: point.commune || '',
          typesDechetsAcceptes: point.types_dechets_acceptes || []
        };
        setLocalEditingPoint(point);
        setEditingPointDepot(editData);
        setLocalShowModal(true);
        setShowPointDepotModal(true);
      }
    };

    const handleCloseModal = () => {
      setLocalShowModal(false);
      setShowPointDepotModal(false);
      setLocalEditingPoint(null);
      setEditingPointDepot(null);
    };

    // Filtrer les points avec le terme de recherche différé
    const filteredPoints = useMemo(() => {
      if (!deferredSearchTerm) return pointsDepot;
      return pointsDepot.filter(p => 
        (p.nom || '').toLowerCase().includes(deferredSearchTerm.toLowerCase()) ||
        (p.adresse || '').toLowerCase().includes(deferredSearchTerm.toLowerCase()) ||
        (p.quartier || '').toLowerCase().includes(deferredSearchTerm.toLowerCase())
      );
    }, [pointsDepot, deferredSearchTerm]);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Building className="h-6 w-6 text-purple-600" />
              Points de collecte
            </h1>
            <p className="text-gray-600 mt-1">{pointsDepot.length} points actifs</p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouveau point
          </button>
        </div>

        {/* Recherche */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un point de collecte..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>

        {/* Liste des points */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPoints.length > 0 ? (
            filteredPoints.map((point) => (
              <div key={point.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{point.nom}</h3>
                    <p className="text-sm text-gray-600 mt-1">{point.adresse}</p>
                    {point.quartier && <p className="text-sm text-gray-500">{point.quartier}</p>}
                    {point.commune && <p className="text-sm text-gray-500">{point.commune}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEditModal(point)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleSupprimerPointDepot(point.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">Déchets acceptés</p>
                  <div className="flex flex-wrap gap-2">
                    {point.types_dechets_acceptes && Array.isArray(point.types_dechets_acceptes) && point.types_dechets_acceptes.length > 0 ? (
                      point.types_dechets_acceptes.map((type, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {type}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">Aucun type spécifié</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 bg-white rounded-xl shadow-lg p-12 text-center">
              <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun point de collecte trouvé</h3>
              <p className="text-gray-600">Cliquez sur "Nouveau point" pour en créer un</p>
            </div>
          )}
        </div>

        {/* Modal de création/édition */}
        {showPointDepotModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingPointDepot ? 'Modifier le point de collecte' : 'Créer un point de collecte'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <form
                onSubmit={editingPointDepot ? handleModifierPointDepot : handleCreerPointDepot}
                className="p-6 space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                    <input
                      type="text"
                      value={editingPointDepot ? editingPointDepot.nom : pointDepotForm.nom}
                      onChange={(e) => {
                        if (editingPointDepot) {
                          setEditingPointDepot({...editingPointDepot, nom: e.target.value});
                        } else {
                          setPointDepotForm({...pointDepotForm, nom: e.target.value});
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
                    <input
                      type="text"
                      value={editingPointDepot ? editingPointDepot.adresse : pointDepotForm.adresse}
                      onChange={(e) => {
                        if (editingPointDepot) {
                          setEditingPointDepot({...editingPointDepot, adresse: e.target.value});
                        } else {
                          setPointDepotForm({...pointDepotForm, adresse: e.target.value});
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quartier</label>
                    <input
                      type="text"
                      value={editingPointDepot ? editingPointDepot.quartier : pointDepotForm.quartier}
                      onChange={(e) => {
                        if (editingPointDepot) {
                          setEditingPointDepot({...editingPointDepot, quartier: e.target.value});
                        } else {
                          setPointDepotForm({...pointDepotForm, quartier: e.target.value});
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Commune</label>
                    <input
                      type="text"
                      value={editingPointDepot ? editingPointDepot.commune : pointDepotForm.commune}
                      onChange={(e) => {
                        if (editingPointDepot) {
                          setEditingPointDepot({...editingPointDepot, commune: e.target.value});
                        } else {
                          setPointDepotForm({...pointDepotForm, commune: e.target.value});
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Types de déchets acceptés</label>
                    <select
                      multiple
                      value={editingPointDepot ? editingPointDepot.typesDechetsAcceptes : pointDepotForm.typesDechetsAcceptes}
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, option => option.value);
                        if (editingPointDepot) {
                          setEditingPointDepot({...editingPointDepot, typesDechetsAcceptes: values});
                        } else {
                          setPointDepotForm({...pointDepotForm, typesDechetsAcceptes: values});
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                    >
                      <option value="plastique_pet">Plastique PET</option>
                      <option value="plastique_pehd">Plastique PEHD</option>
                      <option value="papier_carton">Papier/Carton</option>
                      <option value="metal">Métal</option>
                      <option value="verre">Verre</option>
                      <option value="organique">Organique</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Maintenez Ctrl pour sélectionner plusieurs types</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    {editingPointDepot ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==================== AUTRES PAGES ====================
  const MissionsPage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Package className="h-6 w-6 text-purple-600" />
          Gestion des missions
        </h1>
        <p className="text-gray-600">Page en cours de développement</p>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Fonctionnalité à venir</h3>
        <p className="text-gray-600">La gestion des missions sera bientôt disponible</p>
      </div>
    </div>
  );

  const ProfilPage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <User className="h-6 w-6 text-purple-600" />
          Mon profil
        </h1>
        <p className="text-gray-600">Gérez vos informations personnelles</p>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Nom complet</label>
            <p className="text-lg font-semibold">{userData.nomComplet}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-lg">{userData.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Téléphone</label>
            <p className="text-lg">{userData.telephone || 'Non renseigné'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Rôle</label>
            <p className="text-lg">{userData.role}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const SecuritePage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Shield className="h-6 w-6 text-purple-600" />
          Sécurité
        </h1>
        <p className="text-gray-600">Gérez la sécurité de votre compte</p>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md">
        <p className="text-gray-600 mb-4">Fonctionnalité de changement de mot de passe à venir</p>
      </div>
    </div>
  );

  const AidePage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-purple-600" />
          Centre d'aide
        </h1>
        <p className="text-gray-600">Guide d'utilisation du superviseur</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Gestion des gestionnaires</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• Créez de nouveaux comptes gestionnaires</li>
            <li>• Assignez-les à des points de collecte</li>
            <li>• Activez ou désactivez leurs comptes</li>
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Points de collecte</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• Ajoutez de nouveaux points de collecte</li>
            <li>• Définissez les types de déchets acceptés</li>
            <li>• Modifiez ou désactivez des points existants</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // ==================== ROUTAGE ====================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="lg:ml-80 min-h-screen">
          <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="px-4 py-3 flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-semibold text-sm">
                  {getInitials(userData.nomComplet)}
                </div>
              </div>
            </div>
          </header>
          <div className="flex items-center justify-center h-[calc(100vh-64px)]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement du tableau de bord...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="lg:ml-80 min-h-screen">
          <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="px-4 py-3 flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-semibold text-sm">
                  {getInitials(userData.nomComplet)}
                </div>
              </div>
            </div>
          </header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 text-lg mb-4">{error}</p>
              <button
                onClick={loadAllData}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-semibold text-sm">
              {getInitials(userData.nomComplet)}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content avec routage interne */}
      <div className="lg:ml-80 min-h-screen">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/collecteurs" element={<CollecteursPage />} />
          <Route path="/gestionnaires" element={<GestionnairesPage />} />
          <Route path="/points-depot" element={<PointsDepotPage />} />
          <Route path="/missions" element={<MissionsPage />} />
          <Route path="/profil" element={<ProfilPage />} />
          <Route path="/securite" element={<SecuritePage />} />
          <Route path="/aide" element={<AidePage />} />
        </Routes>
      </div>
    </div>
  );
};

export default DashboardSuperviseur;




// Version pour les gestions de campagnes avec plusieur type de dechets :






// // pages/Superviseur/CampagnesPage.jsx - Version corrigée
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Calendar, Target, DollarSign, Map, Package, Plus,
//   Edit2, Trash2, Eye, CheckCircle, XCircle, Clock,
//   Filter, Search, RefreshCw, Download, Users, Award,
//   TrendingUp, BarChart3, PieChart, X
// } from 'lucide-react';
// import toast from 'react-hot-toast';

// const CampagnesPage = () => {
//   const navigate = useNavigate();
//   const [campagnes, setCampagnes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);

//   const [selectedCampagne, setSelectedCampagne] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [campagneDetails, setCampagneDetails] = useState(null);
//   const [evolutionJournaliere, setEvolutionJournaliere] = useState([]);
//   const [pointsDetails, setPointsDetails] = useState([]);
//   const [loadingDetails, setLoadingDetails] = useState(false);
//   const [filtreStatut, setFiltreStatut] = useState('tous');
//   const [promoteurs, setPromoteurs] = useState({
//     sponsors: [],
//     ongs: []
//   });
//   const [user, setUser] = useState(null);

//   // État du formulaire de création
//   const [formData, setFormData] = useState({
//     nom: '',
//     description: '',
//     dateDebut: '',
//     dateFin: '',
//     typesDechets: [],
//     zonesIntervention: [],
//     poidsAttendue: '',
//     prixParKg: '',
//     promoteurs: []
//   });

//   const API_URL = 'http://localhost:3000';
//   const STORAGE_KEYS = {
//     TOKEN: 'ecocollect_token',
//     USER: 'ecocollect_user',
//     ROLE: 'ecocollect_role'
//   };
 

//   const getToken = () => localStorage.getItem(STORAGE_KEYS.TOKEN);

//   useEffect(() => {
//     const userData = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
//     setUser(userData);
//     loadCampagnes();
//     loadPromoteurs();
//   }, [filtreStatut]);

//   const loadCampagnes = async () => {
//     const token = getToken();
//     setLoading(true);

//     try {
//       const url = new URL(`${API_URL}/api/campagnes`);
//       if (filtreStatut !== 'tous') {
//         url.searchParams.append('statut', filtreStatut);
//       }

//       const response = await fetch(url, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       const data = await response.json();

//       if (data.success) {
//         // ✅ S'assurer que types_dechets est toujours un tableau
//         const campagnesFormatees = (data.campagnes || []).map(c => ({
//           ...c,
//           types_dechets: Array.isArray(c.types_dechets) ? c.types_dechets : 
//                          (c.types_dechets ? [c.types_dechets] : [])
//         }));
//         setCampagnes(campagnesFormatees);
//       }
//     } catch (error) {
//       console.error('Erreur chargement campagnes:', error);
//       toast.error('Erreur lors du chargement des campagnes');
//     } finally {
//       setLoading(false);
//     }
//   };
//  const loadCampagneDetails = async (campagneId) => {
//   const token = getToken();
//   setLoadingDetails(true); // ← ACTIVER LE CHARGEMENT
//   try {
//     const response = await fetch(`${API_URL}/api/campagnes/${campagneId}`, {
//       headers: { 'Authorization': `Bearer ${token}` }
//     });
//     const data = await response.json();
    
//     if (data.success) {
//       setCampagneDetails(data.campagne);
//       setEvolutionJournaliere(data.campagne.evolution || []);
//       setPointsDetails(data.campagne.points_couverts || []);
//     }
//   } catch (error) {
//     console.error('Erreur chargement détails:', error);
//     toast.error('Erreur lors du chargement des détails');
//   } finally {
//     setLoadingDetails(false); // ← DÉSACTIVER LE CHARGEMENT
//   }
// };

// // Modifiez le gestionnaire de clic sur le bouton Voir détails
// const handleViewDetails = (campagne) => {
//   setSelectedCampagne(campagne);
//   loadCampagneDetails(campagne.id);
//   setShowDetailsModal(true);
// };

//   const loadPromoteurs = async () => {
//     const token = getToken();
//     try {
//       // ✅ Utiliser les routes superviseurs pour récupérer les promoteurs
//       const [sponsorsRes, ongsRes] = await Promise.all([
//         fetch(`${API_URL}/api/superviseurs/sponsors`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         }),
//         fetch(`${API_URL}/api/superviseurs/ongs`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         })
//       ]);

//       const sponsorsData = sponsorsRes.ok ? await sponsorsRes.json() : { sponsors: [] };
//       const ongsData = ongsRes.ok ? await ongsRes.json() : { ongs: [] };

//       setPromoteurs({
//         sponsors: sponsorsData.sponsors || [],
//         ongs: ongsData.ongs || []
//       });
//     } catch (error) {
//       console.error('Erreur chargement promoteurs:', error);
//       // Données mockées pour le développement
//       setPromoteurs({
//         sponsors: [
//           { id: '1', nom_organisation: 'Sponsor Test 1' },
//           { id: '2', nom_organisation: 'Sponsor Test 2' }
//         ],
//         ongs: [
//           { id: '3', nom_ong: 'ONG Test 1' },
//           { id: '4', nom_ong: 'ONG Test 2' }
//         ]
//       });
//     }
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await loadCampagnes();
//     setRefreshing(false);
//     toast.success('Données actualisées');
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   // ✅ Gestion des checkboxes pour les types de déchets
//   const handleTypeDechetChange = (e) => {
//     const { value, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       typesDechets: checked 
//         ? [...prev.typesDechets, value]
//         : prev.typesDechets.filter(t => t !== value)
//     }));
//   };

//   const handleZoneChange = (e) => {
//     const zones = e.target.value.split(',').map(z => z.trim()).filter(z => z);
//     setFormData(prev => ({ ...prev, zonesIntervention: zones }));
//   };

//   const handlePromoteurChange = (e) => {
//     const { value, checked } = e.target;
//     const [type, id] = value.split(':');
    
//     setFormData(prev => ({
//       ...prev,
//       promoteurs: checked
//         ? [...prev.promoteurs, { type, id }]
//         : prev.promoteurs.filter(p => !(p.type === type && p.id === id))
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validations
//     if (!formData.nom || !formData.dateDebut || !formData.dateFin || 
//         !formData.typesDechets.length || !formData.poidsAttendue || !formData.prixParKg) {
//       toast.error('Veuillez remplir tous les champs obligatoires');
//       return;
//     }

//     if (new Date(formData.dateDebut) > new Date(formData.dateFin)) {
//       toast.error('La date de début doit être antérieure à la date de fin');
//       return;
//     }

//     const token = getToken();
//     try {
//       const response = await fetch(`${API_URL}/api/campagnes`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(formData)
//       });

//       const data = await response.json();

//       if (data.success) {
//         toast.success('✅ Campagne créée avec succès');
//         setShowCreateModal(false);
//         setFormData({
//           nom: '',
//           description: '',
//           dateDebut: '',
//           dateFin: '',
//           typesDechets: [],
//           zonesIntervention: [],
//           poidsAttendue: '',
//           prixParKg: '',
//           promoteurs: []
//         });
//         loadCampagnes();
//       } else {
//         throw new Error(data.message || 'Erreur lors de la création');
//       }
//     } catch (error) {
//       console.error('❌ Erreur:', error);
//       toast.error(error.message);
//     }
//   };

//   const handleChangerStatut = async (campagneId, nouveauStatut) => {
//     const token = getToken();
//     try {
//       const response = await fetch(`${API_URL}/api/campagnes/${campagneId}/statut`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ statut: nouveauStatut })
//       });

//       const data = await response.json();

//       if (data.success) {
//         toast.success(`Campagne ${nouveauStatut === 'active' ? 'activée' : 'mise à jour'}`);
//         loadCampagnes();
//       }
//     } catch (error) {
//       console.error('Erreur:', error);
//       toast.error('Erreur lors du changement de statut');
//     }
//   };

//   const getStatusBadge = (statut) => {
//     const badges = {
//       'planifiee': { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'Planifiée' },
//       'active': { color: 'bg-green-100 text-green-800', icon: TrendingUp, label: 'Active' },
//       'suspendue': { color: 'bg-yellow-100 text-yellow-800', icon: XCircle, label: 'Suspendue' },
//       'terminee': { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Terminée' }
//     };
//     const badge = badges[statut] || badges.planifiee;
//     const Icon = badge.icon;
//     return (
//       <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${badge.color}`}>
//         <Icon size={12} />
//         {badge.label}
//       </span>
//     );
//   };

//   const getTypeLabel = (type) => {
//     const labels = {
//       'plastique_pet': 'Plastique PET',
//       'plastique_pehd': 'Plastique PEHD',
//       'papier_carton': 'Papier/Carton',
//       'metal': 'Métal',
//       'verre': 'Verre',
//       'organique': 'Organique',
//       'plastique': 'Plastique',
//       'papier': 'Papier',
//       'carton': 'Carton'
//     };
//     return labels[type] || type;
//   };

//   const filteredCampagnes = campagnes.filter(c => {
//     if (!searchTerm) return true;
//     return c.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//            c.description?.toLowerCase().includes(searchTerm.toLowerCase());
//   });

//   const typesDechetDisponibles = [
//     { value: 'plastique_pet', label: 'Plastique PET' },
//     { value: 'plastique_pehd', label: 'Plastique PEHD' },
//     { value: 'papier_carton', label: 'Papier/Carton' },
//     { value: 'metal', label: 'Métal' },
//     { value: 'verre', label: 'Verre' },
//     { value: 'organique', label: 'Organique' }
//   ];

//   const styles = `
//     .campagnes-container {
//       padding: 1.5rem;
//     }

//     .header-actions {
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       margin-bottom: 2rem;
//     }

//     .filters-bar {
//       display: flex;
//       gap: 1rem;
//       margin-bottom: 2rem;
//       flex-wrap: wrap;
//       align-items: center;
//     }

//     .filter-btn {
//       padding: 0.6rem 1.5rem;
//       border: 1.5px solid #d9e0d9;
//       border-radius: 100px;
//       background: white;
//       color: #1a1e1a;
//       font-weight: 600;
//       cursor: pointer;
//       transition: all 0.3s;
//       display: flex;
//       align-items: center;
//       gap: 0.5rem;
//     }

//     .filter-btn.active {
//       background: #667eea;
//       color: white;
//       border-color: #667eea;
//     }

//     .search-bar {
//       flex: 1;
//       display: flex;
//       gap: 0.5rem;
//     }

//     .search-input {
//       flex: 1;
//       padding: 0.6rem 1rem;
//       border: 1.5px solid #d9e0d9;
//       border-radius: 0.75rem;
//       font-size: 0.9rem;
//     }

//     .search-input:focus {
//       border-color: #667eea;
//       outline: none;
//     }

//     .refresh-btn {
//       background: white;
//       border: 1px solid #d9e0d9;
//       border-radius: 0.75rem;
//       padding: 0.6rem 1.2rem;
//       display: flex;
//       align-items: center;
//       gap: 0.5rem;
//       cursor: pointer;
//       transition: all 0.3s;
//     }

//     .refresh-btn:hover:not(:disabled) {
//       background: #e8f3e8;
//       border-color: #667eea;
//     }

//     .btn-primary {
//       background: #667eea;
//       color: white;
//       border: none;
//       padding: 0.75rem 1.5rem;
//       border-radius: 0.75rem;
//       font-weight: 600;
//       cursor: pointer;
//       display: flex;
//       align-items: center;
//       gap: 0.5rem;
//     }

//     .btn-primary:hover {
//       background: #5a67d8;
//     }

//     .campagnes-grid {
//       display: grid;
//       grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
//       gap: 1.5rem;
//     }

//     .campagne-card {
//       background: white;
//       border-radius: 1rem;
//       padding: 1.5rem;
//       border: 1px solid #d9e0d9;
//       transition: all 0.3s;
//     }

//     .campagne-card:hover {
//       transform: translateY(-4px);
//       box-shadow: 0 8px 30px -8px rgba(102, 126, 234, 0.15);
//     }

//     .card-header {
//       display: flex;
//       justify-content: space-between;
//       align-items: start;
//       margin-bottom: 1rem;
//     }

//     .campagne-nom {
//       font-size: 1.2rem;
//       font-weight: 700;
//       color: #1a1e1a;
//       margin-bottom: 0.5rem;
//     }

//     .campagne-description {
//       color: #5a655a;
//       font-size: 0.9rem;
//       margin-bottom: 1rem;
//     }

//     .progress-bar {
//       width: 100%;
//       height: 0.5rem;
//       background: #e8f3e8;
//       border-radius: 1rem;
//       overflow: hidden;
//       margin: 1rem 0;
//     }

//     .progress-fill {
//       height: 100%;
//       background: linear-gradient(90deg, #667eea, #764ba2);
//       border-radius: 1rem;
//       transition: width 0.3s ease;
//     }

//     .campagne-stats {
//       display: grid;
//       grid-template-columns: repeat(3, 1fr);
//       gap: 1rem;
//       margin: 1rem 0;
//       padding: 1rem 0;
//       border-top: 1px solid #d9e0d9;
//       border-bottom: 1px solid #d9e0d9;
//     }

//     .stat-item {
//       text-align: center;
//     }

//     .stat-value {
//       font-weight: 700;
//       color: #1a1e1a;
//       font-size: 1.1rem;
//     }

//     .stat-label {
//       font-size: 0.8rem;
//       color: #5a655a;
//     }

//     .types-container {
//       display: flex;
//       flex-wrap: wrap;
//       gap: 0.5rem;
//       margin: 1rem 0;
//     }

//     .type-badge {
//       background: #e8f3e8;
//       color: #2d8a5e;
//       padding: 0.25rem 0.75rem;
//       border-radius: 100px;
//       font-size: 0.8rem;
//     }

//     .modal-overlay {
//       position: fixed;
//       top: 0;
//       left: 0;
//       right: 0;
//       bottom: 0;
//       background: rgba(0, 0, 0, 0.5);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       z-index: 1000;
//     }

//     .modal-content {
//       background: white;
//       border-radius: 1rem;
//       padding: 2rem;
//       max-width: 700px;
//       width: 90%;
//       max-height: 80vh;
//       overflow-y: auto;
//     }

//     .modal-title {
//       font-size: 1.5rem;
//       font-weight: 700;
//       color: #1a1e1a;
//       margin-bottom: 1.5rem;
//     }

//     .form-grid {
//       display: grid;
//       grid-template-columns: repeat(2, 1fr);
//       gap: 1rem;
//       margin-bottom: 1rem;
//     }

//     .form-group {
//       margin-bottom: 1rem;
//     }

//     .form-group.full-width {
//       grid-column: span 2;
//     }

//     .form-group label {
//       display: block;
//       margin-bottom: 0.5rem;
//       font-weight: 600;
//       color: #1a1e1a;
//     }

//     .form-group label span {
//       color: #dc2626;
//       margin-left: 0.25rem;
//     }

//     .form-group input,
//     .form-group select,
//     .form-group textarea {
//       width: 100%;
//       padding: 0.75rem 1rem;
//       border: 1.5px solid #d9e0d9;
//       border-radius: 0.75rem;
//       font-size: 0.95rem;
//       transition: all 0.2s;
//     }

//     .form-group input:focus,
//     .form-group select:focus,
//     .form-group textarea:focus {
//       border-color: #667eea;
//       outline: none;
//       box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
//     }

//     /* ✅ Style pour les checkboxes */
//     .checkbox-group {
//       display: grid;
//       grid-template-columns: repeat(2, 1fr);
//       gap: 0.75rem;
//       padding: 1rem;
//       background: #f8faf8;
//       border-radius: 0.75rem;
//     }

//     .checkbox-item {
//       display: flex;
//       align-items: center;
//       gap: 0.5rem;
//     }

//     .checkbox-item input[type="checkbox"] {
//       width: 1.2rem;
//       height: 1.2rem;
//       accent-color: #667eea;
//     }

//     .modal-actions {
//       display: flex;
//       gap: 1rem;
//       justify-content: flex-end;
//       margin-top: 2rem;
//     }

//     .btn-secondary {
//       background: #f8faf8;
//       color: #1a1e1a;
//       border: 1.5px solid #d9e0d9;
//       padding: 0.75rem 1.5rem;
//       border-radius: 0.75rem;
//       font-weight: 600;
//       cursor: pointer;
//     }

//     .btn-secondary:hover {
//       background: #e8f3e8;
//     }

//     .empty-state {
//       text-align: center;
//       padding: 3rem;
//       background: white;
//       border-radius: 1rem;
//       border: 1px solid #d9e0d9;
//       grid-column: 1 / -1;
//     }

//     .spinner {
//   border: 2px solid #f3f3f3;
//   border-top: 2px solid #667eea;
//   border-radius: 50%;
//   width: 40px;
//   height: 40px;
//   animation: spin 1s linear infinite;
// }

// @keyframes spin {
//   0% { transform: rotate(0deg); }
//   100% { transform: rotate(360deg); }
// }

//     @media (max-width: 768px) {
//       .filters-bar {
//         flex-direction: column;
//       }
      
//       .search-bar {
//         width: 100%;
//       }
      
//       .campagnes-grid {
//         grid-template-columns: 1fr;
//       }
      
//       .form-grid {
//         grid-template-columns: 1fr;
//       }
      
//       .form-group.full-width {
//         grid-column: span 1;
//       }
      
//       .checkbox-group {
//         grid-template-columns: 1fr;
//       }
//     }
//   `;

//   if (loading) {
//     return (
//       <div className="p-8 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Chargement des campagnes...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <style>{styles}</style>
//       <div className="campagnes-container">
//         {/* En-tête */}
//         <div className="header-actions">
//           <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a1e1a' }}>
//             Gestion des campagnes
//           </h1>
//           <div style={{ display: 'flex', gap: '1rem' }}>
//             <button 
//               className="refresh-btn"
//               onClick={handleRefresh}
//               disabled={refreshing}
//             >
//               <RefreshCw size={18} className={refreshing ? 'fa-spin' : ''} />
//               Actualiser
//             </button>
//             <button 
//               className="btn-primary"
//               onClick={() => setShowCreateModal(true)}
//             >
//               <Plus size={18} />
//               Nouvelle campagne
//             </button>
//           </div>
//         </div>

//         {/* Filtres et recherche */}
//         <div className="filters-bar">
//           <button 
//             className={`filter-btn ${filtreStatut === 'tous' ? 'active' : ''}`}
//             onClick={() => setFiltreStatut('tous')}
//           >
//             <Filter size={16} />
//             Toutes
//           </button>
//           <button 
//             className={`filter-btn ${filtreStatut === 'planifiee' ? 'active' : ''}`}
//             onClick={() => setFiltreStatut('planifiee')}
//           >
//             <Clock size={16} />
//             Planifiées
//           </button>
//           <button 
//             className={`filter-btn ${filtreStatut === 'active' ? 'active' : ''}`}
//             onClick={() => setFiltreStatut('active')}
//           >
//             <TrendingUp size={16} />
//             Actives
//           </button>
//           <button 
//             className={`filter-btn ${filtreStatut === 'terminee' ? 'active' : ''}`}
//             onClick={() => setFiltreStatut('terminee')}
//           >
//             <CheckCircle size={16} />
//             Terminées
//           </button>
          
//           <div className="search-bar">
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Rechercher une campagne..."
//               className="search-input"
//             />
//           </div>
//         </div>

//         {/* Liste des campagnes */}
//         {filteredCampagnes.length > 0 ? (
//           <div className="campagnes-grid">
//             {filteredCampagnes.map((campagne) => {
//               const progression = campagne.poids_attendue ? 
//                 ((campagne.poids_collecte_actuel || 0) / campagne.poids_attendue * 100).toFixed(1) : 0;
              
//               return (
//                 <div key={campagne.id} className="campagne-card">
//                   <div className="card-header">
//                     <div>
//                       <div className="campagne-nom">{campagne.nom}</div>
//                       {campagne.description && (
//                         <div className="campagne-description">{campagne.description}</div>
//                       )}
//                     </div>
//                     {getStatusBadge(campagne.statut)}
//                   </div>

//                   <div className="types-container">
//                     {/* ✅ Vérification que types_dechets est un tableau */}
//                     {Array.isArray(campagne.types_dechets) && campagne.types_dechets.map((type, idx) => (
//                       <span key={idx} className="type-badge">{getTypeLabel(type)}</span>
//                     ))}
//                   </div>

//                   <div className="progress-bar">
//                     <div className="progress-fill" style={{ width: `${progression}%` }} />
//                   </div>

//                   <div className="campagne-stats">
//                     <div className="stat-item">
//                       <div className="stat-value">{progression}%</div>
//                       <div className="stat-label">Réalisé</div>
//                     </div>
//                     <div className="stat-item">
//                       <div className="stat-value">{campagne.poids_collecte_actuel || 0} kg</div>
//                       <div className="stat-label">Collecté</div>
//                     </div>
//                     <div className="stat-item">
//                       <div className="stat-value">{campagne.poids_attendue} kg</div>
//                       <div className="stat-label">Objectif</div>
//                     </div>
//                   </div>

//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
//                     <div style={{ display: 'flex', gap: '0.5rem' }}>
//                       <button
//                         className="btn-view"
//                         onClick={() => {
//                           setSelectedCampagne(campagne);
//                           setShowDetailsModal(true);
//                         }}
//                         style={{ padding: '0.5rem', background: '#f8faf8', borderRadius: '0.5rem' }}
//                       >
//                         <Eye size={18} />
//                       </button>
//                       {campagne.statut === 'planifiee' && (
//                         <button
//                           className="btn-view"
//                           onClick={() => handleChangerStatut(campagne.id, 'active')}
//                           style={{ padding: '0.5rem', background: '#f8faf8', borderRadius: '0.5rem', color: '#10b981' }}
//                           title="Activer"
//                         >
//                           <CheckCircle size={18} />
//                         </button>
//                       )}
//                       {campagne.statut === 'active' && (
//                         <button
//                           className="btn-view"
//                           onClick={() => handleChangerStatut(campagne.id, 'suspendue')}
//                           style={{ padding: '0.5rem', background: '#f8faf8', borderRadius: '0.5rem', color: '#f59e0b' }}
//                           title="Suspendre"
//                         >
//                           <XCircle size={18} />
//                         </button>
//                       )}
//                     </div>
//                     <div style={{ display: 'flex', gap: '0.5rem', color: '#5a655a', fontSize: '0.9rem' }}>
//                       <Calendar size={16} />
//                       <span>Fin: {new Date(campagne.date_fin).toLocaleDateString()}</span>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         ) : (
//           <div className="empty-state">
//             <Target size={48} className="mx-auto mb-4 text-gray-300" />
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune campagne trouvée</h3>
//             <p className="text-gray-600 mb-4">Créez votre première campagne pour commencer</p>
//             <button
//               className="btn-primary"
//               onClick={() => setShowCreateModal(true)}
//             >
//               <Plus size={18} />
//               Créer une campagne
//             </button>
//           </div>
//         )}
//     {/* MODAL DE DÉTAILS DE LA CAMPAGNE */}
// {showDetailsModal && selectedCampagne && (
//   <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
//     <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="modal-title">{selectedCampagne.nom}</h2>
//         <button
//           onClick={() => setShowDetailsModal(false)}
//           className="text-gray-400 hover:text-gray-600"
//         >
//           <X size={24} />
//         </button>
//       </div>

//       {loadingDetails ? (  // ← CORRIGÉ : utilise loadingDetails
//         <div className="text-center py-8">
//           <div className="spinner"></div>
//           <p className="mt-4 text-gray-600">Chargement des détails...</p>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {/* Informations générales */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <p className="text-sm text-gray-500">Statut</p>
//               <div className="mt-1">{getStatusBadge(selectedCampagne.statut)}</div>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <p className="text-sm text-gray-500">Période</p>
//               <p className="font-medium">
//                 {new Date(selectedCampagne.date_debut).toLocaleDateString()} - {new Date(selectedCampagne.date_fin).toLocaleDateString()}
//               </p>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <p className="text-sm text-gray-500">Objectif</p>
//               <p className="text-2xl font-bold text-purple-600">{selectedCampagne.poids_attendue} kg</p>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <p className="text-sm text-gray-500">Déjà collecté</p>
//               <p className="text-2xl font-bold text-green-600">{selectedCampagne.poids_collecte_actuel || 0} kg</p>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <p className="text-sm text-gray-500">Reste à collecter</p>
//               <p className="text-2xl font-bold text-orange-600">
//                 {(selectedCampagne.poids_attendue - (selectedCampagne.poids_collecte_actuel || 0)).toFixed(1)} kg
//               </p>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <p className="text-sm text-gray-500">Budget total</p>
//               <p className="text-2xl font-bold text-blue-600">
//                 {((selectedCampagne.poids_attendue || 0) * (selectedCampagne.prix_par_kg || 0)).toLocaleString()} FCFA
//               </p>
//             </div>
//           </div>

//           {/* Types de déchets */}
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <p className="text-sm text-gray-500 mb-2">Types de déchets acceptés</p>
//             <div className="flex flex-wrap gap-2">
//               {selectedCampagne.types_dechets?.map((type, idx) => (
//                 <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
//                   {getTypeLabel(type)}
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* Zones d'intervention */}
//           {selectedCampagne.zones_intervention?.length > 0 && (
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <p className="text-sm text-gray-500 mb-2">Zones couvertes</p>
//               <div className="flex flex-wrap gap-2">
//                 {selectedCampagne.zones_intervention.map((zone, idx) => (
//                   <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
//                     {zone}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Évolution journalière */}
//           {evolutionJournaliere.length > 0 && (
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <p className="text-sm text-gray-500 mb-4">Évolution journalière</p>
//               <div className="space-y-3 max-h-60 overflow-y-auto">
//                 {evolutionJournaliere.map((jour, idx) => (
//                   <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <p className="font-medium">
//                           {new Date(jour.jour).toLocaleDateString('fr-FR', {
//                             weekday: 'long',
//                             day: 'numeric',
//                             month: 'long'
//                           })}
//                         </p>
//                         <p className="text-sm text-gray-500">
//                           {jour.nombre_missions} mission(s) • {jour.points_actifs} point(s) actif(s)
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-xl font-bold text-green-600">{jour.poids_total} kg</p>
//                         <p className="text-sm text-gray-500">{jour.gains_total?.toLocaleString()} FCFA</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Détails par point de collecte */}
//           {pointsDetails.length > 0 && (
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <p className="text-sm text-gray-500 mb-4">Collectes par point</p>
//               <div className="space-y-3 max-h-60 overflow-y-auto">
//                 {pointsDetails.map((point, idx) => (
//                   <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <p className="font-medium">{point.point_nom}</p>
//                         <p className="text-sm text-gray-500">{point.commune} - {point.quartier}</p>
//                         <p className="text-xs text-gray-400 mt-1">
//                           {point.nombre_missions} mission(s) • {point.collecteurs_actifs} collecteur(s)
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-xl font-bold text-green-600">{point.poids_collecte} kg</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Barre de progression détaillée */}
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <p className="text-sm text-gray-500 mb-2">Progression</p>
//             <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
//               <div 
//                 className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
//                 style={{ 
//                   width: `${Math.min((selectedCampagne.poids_collecte_actuel || 0) / selectedCampagne.poids_attendue * 100, 100)}%` 
//                 }}
//               />
//             </div>
//             <div className="flex justify-between text-sm mt-2">
//               <span className="text-gray-600">{selectedCampagne.poids_collecte_actuel || 0} kg collectés</span>
//               <span className="font-medium text-purple-600">
//                 {((selectedCampagne.poids_collecte_actuel || 0) / selectedCampagne.poids_attendue * 100).toFixed(1)}%
//               </span>
//             </div>
//           </div>

//           {/* Boutons d'action */}
//           <div className="flex gap-3 justify-end pt-4 border-t">
//             <button
//               className="btn-secondary"
//               onClick={() => setShowDetailsModal(false)}
//             >
//               Fermer
//             </button>
//             <button
//               className="btn-primary"
//               onClick={() => {
//                 toast.info('Export en cours de développement');
//               }}
//             >
//               <Download size={16} />
//               Exporter le rapport
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   </div>
// )}
//         {/* Modal de création de campagne */}
//         {showCreateModal && (
//           <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
//             <div className="modal-content" onClick={e => e.stopPropagation()}>
//               <h2 className="modal-title">Créer une nouvelle campagne</h2>

//               <form onSubmit={handleSubmit}>
//                 <div className="form-grid">
//                   <div className="form-group full-width">
//                     <label>Nom de la campagne <span>*</span></label>
//                     <input
//                       type="text"
//                       name="nom"
//                       value={formData.nom}
//                       onChange={handleInputChange}
//                       placeholder="Ex: Campagne de recyclage 2024"
//                       required
//                     />
//                   </div>

//                   <div className="form-group full-width">
//                     <label>Description</label>
//                     <textarea
//                       name="description"
//                       value={formData.description}
//                       onChange={handleInputChange}
//                       rows="3"
//                       placeholder="Description de la campagne..."
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label>Date de début <span>*</span></label>
//                     <input
//                       type="date"
//                       name="dateDebut"
//                       value={formData.dateDebut}
//                       onChange={handleInputChange}
//                       min={new Date().toISOString().split('T')[0]}
//                       required
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label>Date de fin <span>*</span></label>
//                     <input
//                       type="date"
//                       name="dateFin"
//                       value={formData.dateFin}
//                       onChange={handleInputChange}
//                       min={formData.dateDebut || new Date().toISOString().split('T')[0]}
//                       required
//                     />
//                   </div>

//                   <div className="form-group full-width">
//                     <label>Types de déchets <span>*</span></label>
//                     <div className="checkbox-group">
//                       {typesDechetDisponibles.map(type => (
//                         <div key={type.value} className="checkbox-item">
//                           <input
//                             type="checkbox"
//                             id={`type-${type.value}`}
//                             value={type.value}
//                             checked={formData.typesDechets.includes(type.value)}
//                             onChange={handleTypeDechetChange}
//                           />
//                           <label htmlFor={`type-${type.value}`}>{type.label}</label>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="form-group full-width">
//                     <label>Zones d'intervention</label>
//                     <input
//                       type="text"
//                       name="zones"
//                       value={formData.zonesIntervention.join(', ')}
//                       onChange={handleZoneChange}
//                       placeholder="Dakar, Pikine, Guédiawaye (séparés par des virgules)"
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label>Poids attendu (kg) <span>*</span></label>
//                     <input
//                       type="number"
//                       name="poidsAttendue"
//                       value={formData.poidsAttendue}
//                       onChange={handleInputChange}
//                       min="1"
//                       step="0.1"
//                       placeholder="1000"
//                       required
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label>Prix par kg (FCFA) <span>*</span></label>
//                     <input
//                       type="number"
//                       name="prixParKg"
//                       value={formData.prixParKg}
//                       onChange={handleInputChange}
//                       min="1"
//                       step="1"
//                       placeholder="250"
//                       required
//                     />
//                   </div>

//                   <div className="form-group full-width">
//                     <label>Promoteurs (sponsors/ONG)</label>
//                     <div className="checkbox-group">
//                       {promoteurs.sponsors.map(sponsor => (
//                         <div key={`sponsor:${sponsor.id}`} className="checkbox-item">
//                           <input
//                             type="checkbox"
//                             id={`sponsor-${sponsor.id}`}
//                             value={`sponsor:${sponsor.id}`}
//                             checked={formData.promoteurs.some(p => p.type === 'sponsor' && p.id === sponsor.id)}
//                             onChange={handlePromoteurChange}
//                           />
//                           <label htmlFor={`sponsor-${sponsor.id}`}>
//                             🏢 Sponsor: {sponsor.nom_organisation}
//                           </label>
//                         </div>
//                       ))}
//                       {promoteurs.ongs.map(ong => (
//                         <div key={`ong:${ong.id}`} className="checkbox-item">
//                           <input
//                             type="checkbox"
//                             id={`ong-${ong.id}`}
//                             value={`ong:${ong.id}`}
//                             checked={formData.promoteurs.some(p => p.type === 'ong' && p.id === ong.id)}
//                             onChange={handlePromoteurChange}
//                           />
//                           <label htmlFor={`ong-${ong.id}`}>
//                             🤝 ONG: {ong.nom_ong}
//                           </label>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="modal-actions">
//                   <button
//                     type="button"
//                     className="btn-secondary"
//                     onClick={() => setShowCreateModal(false)}
//                   >
//                     Annuler
//                   </button>
//                   <button
//                     type="submit"
//                     className="btn-primary"
//                   >
//                     Créer la campagne
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default CampagnesPage;





import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Target, DollarSign, Map, Package, Plus,
  Edit2, Trash2, Eye, CheckCircle, XCircle, Clock,
  Filter, Search, RefreshCw, Download, Users, Award,
  TrendingUp, BarChart3, PieChart, X
} from 'lucide-react';
import toast from 'react-hot-toast';

const CampagnesPage = () => {
  const navigate = useNavigate();
  const [campagnes, setCampagnes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [selectedCampagne, setSelectedCampagne] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [campagneDetails, setCampagneDetails] = useState(null);
  const [evolutionJournaliere, setEvolutionJournaliere] = useState([]);
  const [pointsDetails, setPointsDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [filtreStatut, setFiltreStatut] = useState('tous');
  const [promoteurs, setPromoteurs] = useState({
    sponsors: [],
    ongs: []
  });
  const [user, setUser] = useState(null);
 const [formData, setFormData] = useState({
    nom: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    objectifs: [{ typeDechet: '', poidsAttendue: '', prixParKg: '' }],
    zonesIntervention: [],
    promoteurs: []
  });


  const API_URL = 'http://localhost:3000';
  const STORAGE_KEYS = {
    TOKEN: 'ecocollect_token',
    USER: 'ecocollect_user',
    ROLE: 'ecocollect_role'
  };
 

  const getToken = () => localStorage.getItem(STORAGE_KEYS.TOKEN);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
    setUser(userData);
    loadCampagnes();
    loadPromoteurs();
  }, [filtreStatut]);

  const loadCampagnes = async () => {
    const token = getToken();
    setLoading(true);

    try {
      const url = new URL(`${API_URL}/api/campagnes`);
      if (filtreStatut !== 'tous') {
        url.searchParams.append('statut', filtreStatut);
      }

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.success) {
        // ✅ S'assurer que types_dechets est toujours un tableau
        const campagnesFormatees = (data.campagnes || []).map(c => ({
          ...c,
          types_dechets: Array.isArray(c.types_dechets) ? c.types_dechets : 
                         (c.types_dechets ? [c.types_dechets] : [])
        }));
        setCampagnes(campagnesFormatees);
      }
    } catch (error) {
      console.error('Erreur chargement campagnes:', error);
      toast.error('Erreur lors du chargement des campagnes');
    } finally {
      setLoading(false);
    }
  };
 const loadCampagneDetails = async (campagneId) => {
  const token = getToken();
  setLoadingDetails(true); // ← ACTIVER LE CHARGEMENT
  try {
    const response = await fetch(`${API_URL}/api/campagnes/${campagneId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    
    if (data.success) {
      setCampagneDetails(data.campagne);
      setEvolutionJournaliere(data.campagne.evolution || []);
      setPointsDetails(data.campagne.points_couverts || []);
    }
  } catch (error) {
    console.error('Erreur chargement détails:', error);
    toast.error('Erreur lors du chargement des détails');
  } finally {
    setLoadingDetails(false); // ← DÉSACTIVER LE CHARGEMENT
  }
};

  const handleObjectifChange = (index, field, value) => {
    const nouveauxObjectifs = [...formData.objectifs];
    nouveauxObjectifs[index][field] = value;
    setFormData(prev => ({ ...prev, objectifs: nouveauxObjectifs }));
  };

// Modifiez le gestionnaire de clic sur le bouton Voir détails
const handleViewDetails = (campagne) => {
  setSelectedCampagne(campagne);
  loadCampagneDetails(campagne.id);
  setShowDetailsModal(true);
};

  const loadPromoteurs = async () => {
    const token = getToken();
    try {
      // ✅ Utiliser les routes superviseurs pour récupérer les promoteurs
      const [sponsorsRes, ongsRes] = await Promise.all([
        fetch(`${API_URL}/api/superviseurs/sponsors`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/superviseurs/ongs`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const sponsorsData = sponsorsRes.ok ? await sponsorsRes.json() : { sponsors: [] };
      const ongsData = ongsRes.ok ? await ongsRes.json() : { ongs: [] };

      setPromoteurs({
        sponsors: sponsorsData.sponsors || [],
        ongs: ongsData.ongs || []
      });
    } catch (error) {
      console.error('Erreur chargement promoteurs:', error);
      // Données mockées pour le développement
      setPromoteurs({
        sponsors: [
          { id: '1', nom_organisation: 'Sponsor Test 1' },
          { id: '2', nom_organisation: 'Sponsor Test 2' }
        ],
        ongs: [
          { id: '3', nom_ong: 'ONG Test 1' },
          { id: '4', nom_ong: 'ONG Test 2' }
        ]
      });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCampagnes();
    setRefreshing(false);
    toast.success('Données actualisées');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Gestion des checkboxes pour les types de déchets
  const handleTypeDechetChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      typesDechets: checked 
        ? [...prev.typesDechets, value]
        : prev.typesDechets.filter(t => t !== value)
    }));
  };

  const handleZoneChange = (e) => {
    const zones = e.target.value.split(',').map(z => z.trim()).filter(z => z);
    setFormData(prev => ({ ...prev, zonesIntervention: zones }));
  };

  const handlePromoteurChange = (e) => {
    const { value, checked } = e.target;
    const [type, id] = value.split(':');
    
    setFormData(prev => ({
      ...prev,
      promoteurs: checked
        ? [...prev.promoteurs, { type, id }]
        : prev.promoteurs.filter(p => !(p.type === type && p.id === id))
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Validations
  //   if (!formData.nom || !formData.dateDebut || !formData.dateFin || 
  //       !formData.typesDechets.length || !formData.poidsAttendue || !formData.prixParKg) {
  //     toast.error('Veuillez remplir tous les champs obligatoires');
  //     return;
  //   }

  //   if (new Date(formData.dateDebut) > new Date(formData.dateFin)) {
  //     toast.error('La date de début doit être antérieure à la date de fin');
  //     return;
  //   }

  //   const token = getToken();
  //   try {
  //     const response = await fetch(`${API_URL}/api/campagnes`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`
  //       },
  //       body: JSON.stringify(formData)
  //     });

  //     const data = await response.json();

  //     if (data.success) {
  //       toast.success('✅ Campagne créée avec succès');
  //       setShowCreateModal(false);
  //       setFormData({
  //         nom: '',
  //         description: '',
  //         dateDebut: '',
  //         dateFin: '',
  //         typesDechets: [],
  //         zonesIntervention: [],
  //         poidsAttendue: '',
  //         prixParKg: '',
  //         promoteurs: []
  //       });
  //       loadCampagnes();
  //     } else {
  //       throw new Error(data.message || 'Erreur lors de la création');
  //     }
  //   } catch (error) {
  //     console.error('❌ Erreur:', error);
  //     toast.error(error.message);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!formData.nom || !formData.dateDebut || !formData.dateFin) {
      toast.error('Veuillez remplir le nom et les dates de la campagne');
      return;
    }

    // Valider les objectifs
    if (formData.objectifs.length === 0) {
      toast.error('Ajoutez au moins un objectif');
      return;
    }

    for (const obj of formData.objectifs) {
      if (!obj.typeDechet || !obj.poidsAttendue || !obj.prixParKg) {
        toast.error('Tous les objectifs doivent être complets');
        return;
      }
      if (parseFloat(obj.poidsAttendue) <= 0 || parseFloat(obj.prixParKg) <= 0) {
        toast.error('Les poids et prix doivent être positifs');
        return;
      }
    }

    if (new Date(formData.dateDebut) > new Date(formData.dateFin)) {
      toast.error('La date de début doit être antérieure à la date de fin');
      return;
    }

    const token = getToken();
    try {
      console.log('📤 Envoi campagne:', formData);
      
      const response = await fetch(`${API_URL}/api/campagnes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData) // ← formData ne contient plus poidsAttendue global
      });

      const data = await response.json();

      if (data.success) {
        toast.success('✅ Campagne créée avec succès');
        setShowCreateModal(false);
        setFormData({
          nom: '',
          description: '',
          dateDebut: '',
          dateFin: '',
          objectifs: [{ typeDechet: '', poidsAttendue: '', prixParKg: '' }],
          zonesIntervention: [],
          promoteurs: []
        });
        loadCampagnes();
      } else {
        throw new Error(data.message || 'Erreur lors de la création');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      toast.error(error.message);
    }
  };

  
  // Fonctions pour gérer les objectifs
  const handleAjouterObjectif = () => {
    setFormData(prev => ({
      ...prev,
      objectifs: [...prev.objectifs, { typeDechet: '', poidsAttendue: '', prixParKg: '' }]
    }));
  };

 
  // const handleZoneChange = (e) => {
  //   const zones = e.target.value.split(',').map(z => z.trim()).filter(z => z);
  //   setFormData(prev => ({ ...prev, zonesIntervention: zones }))
  // };

  // const handlePromoteurChange = (e) => {
  //   const { value, checked } = e.target;
  //   const [type, id] = value.split(':');
    
  //   setFormData(prev => ({
  //     ...prev,
  //     promoteurs: checked
  //       ? [...prev.promoteurs, { type, id }]
  //       : prev.promoteurs.filter(p => !(p.type === type && p.id === id))
  //   }));
  // };

  const handleChangerStatut = async (campagneId, nouveauStatut) => {
    const token = getToken();
    try {
      const response = await fetch(`${API_URL}/api/campagnes/${campagneId}/statut`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ statut: nouveauStatut })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Campagne ${nouveauStatut === 'active' ? 'activée' : 'mise à jour'}`);
        loadCampagnes();
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du changement de statut');
    }
  };

  const getStatusBadge = (statut) => {
    const badges = {
      'planifiee': { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'Planifiée' },
      'active': { color: 'bg-green-100 text-green-800', icon: TrendingUp, label: 'Active' },
      'suspendue': { color: 'bg-yellow-100 text-yellow-800', icon: XCircle, label: 'Suspendue' },
      'terminee': { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Terminée' }
    };
    const badge = badges[statut] || badges.planifiee;
    const Icon = badge.icon;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${badge.color}`}>
        <Icon size={12} />
        {badge.label}
      </span>
    );
  };

  const getTypeLabel = (type) => {
    const labels = {
      'plastique_pet': 'Plastique PET',
      'plastique_pehd': 'Plastique PEHD',
      'papier_carton': 'Papier/Carton',
      'metal': 'Métal',
      'verre': 'Verre',
      'organique': 'Organique',
      'plastique': 'Plastique',
      'papier': 'Papier',
      'carton': 'Carton'
    };
    return labels[type] || type;
  };

  const filteredCampagnes = campagnes.filter(c => {
    if (!searchTerm) return true;
    return c.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           c.description?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const typesDechetDisponibles = [
    { value: 'plastique_pet', label: 'Plastique PET' },
    { value: 'plastique_pehd', label: 'Plastique PEHD' },
    { value: 'papier_carton', label: 'Papier/Carton' },
    { value: 'metal', label: 'Métal' },
    { value: 'verre', label: 'Verre' },
    { value: 'organique', label: 'Organique' }
  ];

  const styles = `
    .campagnes-container {
      padding: 1.5rem;
    }

    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .filters-bar {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      align-items: center;
    }

    .filter-btn {
      padding: 0.6rem 1.5rem;
      border: 1.5px solid #d9e0d9;
      border-radius: 100px;
      background: white;
      color: #1a1e1a;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .filter-btn.active {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    .search-bar {
      flex: 1;
      display: flex;
      gap: 0.5rem;
    }

    .search-input {
      flex: 1;
      padding: 0.6rem 1rem;
      border: 1.5px solid #d9e0d9;
      border-radius: 0.75rem;
      font-size: 0.9rem;
    }

    .search-input:focus {
      border-color: #667eea;
      outline: none;
    }

    .refresh-btn {
      background: white;
      border: 1px solid #d9e0d9;
      border-radius: 0.75rem;
      padding: 0.6rem 1.2rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: all 0.3s;
    }

    .refresh-btn:hover:not(:disabled) {
      background: #e8f3e8;
      border-color: #667eea;
    }

    .btn-primary {
      background: #667eea;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-primary:hover {
      background: #5a67d8;
    }

    .campagnes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 1.5rem;
    }

    .campagne-card {
      background: white;
      border-radius: 1rem;
      padding: 1.5rem;
      border: 1px solid #d9e0d9;
      transition: all 0.3s;
    }

    .campagne-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px -8px rgba(102, 126, 234, 0.15);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 1rem;
    }

    .campagne-nom {
      font-size: 1.2rem;
      font-weight: 700;
      color: #1a1e1a;
      margin-bottom: 0.5rem;
    }

    .campagne-description {
      color: #5a655a;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .progress-bar {
      width: 100%;
      height: 0.5rem;
      background: #e8f3e8;
      border-radius: 1rem;
      overflow: hidden;
      margin: 1rem 0;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea, #764ba2);
      border-radius: 1rem;
      transition: width 0.3s ease;
    }

    .campagne-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin: 1rem 0;
      padding: 1rem 0;
      border-top: 1px solid #d9e0d9;
      border-bottom: 1px solid #d9e0d9;
    }

    .stat-item {
      text-align: center;
    }

    .stat-value {
      font-weight: 700;
      color: #1a1e1a;
      font-size: 1.1rem;
    }

    .stat-label {
      font-size: 0.8rem;
      color: #5a655a;
    }

    .types-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin: 1rem 0;
    }

    .type-badge {
      background: #e8f3e8;
      color: #2d8a5e;
      padding: 0.25rem 0.75rem;
      border-radius: 100px;
      font-size: 0.8rem;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      max-width: 700px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }

    .modal-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a1e1a;
      margin-bottom: 1.5rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group.full-width {
      grid-column: span 2;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #1a1e1a;
    }

    .form-group label span {
      color: #dc2626;
      margin-left: 0.25rem;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1.5px solid #d9e0d9;
      border-radius: 0.75rem;
      font-size: 0.95rem;
      transition: all 0.2s;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      border-color: #667eea;
      outline: none;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    /* ✅ Style pour les checkboxes */
    .checkbox-group {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
      padding: 1rem;
      background: #f8faf8;
      border-radius: 0.75rem;
    }

    .checkbox-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .checkbox-item input[type="checkbox"] {
      width: 1.2rem;
      height: 1.2rem;
      accent-color: #667eea;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .btn-secondary {
      background: #f8faf8;
      color: #1a1e1a;
      border: 1.5px solid #d9e0d9;
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-secondary:hover {
      background: #e8f3e8;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      background: white;
      border-radius: 1rem;
      border: 1px solid #d9e0d9;
      grid-column: 1 / -1;
    }

    .spinner {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

    @media (max-width: 768px) {
      .filters-bar {
        flex-direction: column;
      }
      
      .search-bar {
        width: 100%;
      }
      
      .campagnes-grid {
        grid-template-columns: 1fr;
      }
      
      .form-grid {
        grid-template-columns: 1fr;
      }
      
      .form-group.full-width {
        grid-column: span 1;
      }
      
      .checkbox-group {
        grid-template-columns: 1fr;
      }
    }
  `;

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des campagnes...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="campagnes-container">
        {/* En-tête */}
        <div className="header-actions">
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a1e1a' }}>
            Gestion des campagnes
          </h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              className="refresh-btn"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw size={18} className={refreshing ? 'fa-spin' : ''} />
              Actualiser
            </button>
            <button 
              className="btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={18} />
              Nouvelle campagne
            </button>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="filters-bar">
          <button 
            className={`filter-btn ${filtreStatut === 'tous' ? 'active' : ''}`}
            onClick={() => setFiltreStatut('tous')}
          >
            <Filter size={16} />
            Toutes
          </button>
          <button 
            className={`filter-btn ${filtreStatut === 'planifiee' ? 'active' : ''}`}
            onClick={() => setFiltreStatut('planifiee')}
          >
            <Clock size={16} />
            Planifiées
          </button>
          <button 
            className={`filter-btn ${filtreStatut === 'active' ? 'active' : ''}`}
            onClick={() => setFiltreStatut('active')}
          >
            <TrendingUp size={16} />
            Actives
          </button>
          <button 
            className={`filter-btn ${filtreStatut === 'terminee' ? 'active' : ''}`}
            onClick={() => setFiltreStatut('terminee')}
          >
            <CheckCircle size={16} />
            Terminées
          </button>
          
          <div className="search-bar">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher une campagne..."
              className="search-input"
            />
          </div>
        </div>

        {/* Liste des campagnes */}
        {filteredCampagnes.length > 0 ? (
          <div className="campagnes-grid">
            {filteredCampagnes.map((campagne) => {
              const progression = campagne.poids_attendue ? 
                ((campagne.poids_collecte_actuel || 0) / campagne.poids_attendue * 100).toFixed(1) : 0;
              
              return (
                <div key={campagne.id} className="campagne-card">
                  <div className="card-header">
                    <div>
                      <div className="campagne-nom">{campagne.nom}</div>
                      {campagne.description && (
                        <div className="campagne-description">{campagne.description}</div>
                      )}
                    </div>
                    {getStatusBadge(campagne.statut)}
                  </div>

                  <div className="types-container">
                    {/* ✅ Vérification que types_dechets est un tableau */}
                    {Array.isArray(campagne.types_dechets) && campagne.types_dechets.map((type, idx) => (
                      <span key={idx} className="type-badge">{getTypeLabel(type)}</span>
                    ))}
                  </div>

                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progression}%` }} />
                  </div>

                  <div className="campagne-stats">
                    <div className="stat-item">
                      <div className="stat-value">{progression}%</div>
                      <div className="stat-label">Réalisé</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">{campagne.poids_collecte_actuel || 0} kg</div>
                      <div className="stat-label">Collecté</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">{campagne.poids_attendue} kg</div>
                      <div className="stat-label">Objectif</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn-view"
                        onClick={() => {
                          setSelectedCampagne(campagne);
                          setShowDetailsModal(true);
                        }}
                        style={{ padding: '0.5rem', background: '#f8faf8', borderRadius: '0.5rem' }}
                      >
                        <Eye size={18} />
                      </button>
                      {campagne.statut === 'planifiee' && (
                        <button
                          className="btn-view"
                          onClick={() => handleChangerStatut(campagne.id, 'active')}
                          style={{ padding: '0.5rem', background: '#f8faf8', borderRadius: '0.5rem', color: '#10b981' }}
                          title="Activer"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      {campagne.statut === 'active' && (
                        <button
                          className="btn-view"
                          onClick={() => handleChangerStatut(campagne.id, 'suspendue')}
                          style={{ padding: '0.5rem', background: '#f8faf8', borderRadius: '0.5rem', color: '#f59e0b' }}
                          title="Suspendre"
                        >
                          <XCircle size={18} />
                        </button>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', color: '#5a655a', fontSize: '0.9rem' }}>
                      <Calendar size={16} />
                      <span>Fin: {new Date(campagne.date_fin).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <Target size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune campagne trouvée</h3>
            <p className="text-gray-600 mb-4">Créez votre première campagne pour commencer</p>
            <button
              className="btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={18} />
              Créer une campagne
            </button>
          </div>
        )}
        
    {/* MODAL DE DÉTAILS DE LA CAMPAGNE */}
{showDetailsModal && selectedCampagne && (
  <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="modal-title">{selectedCampagne.nom}</h2>
        <button
          onClick={() => setShowDetailsModal(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>
      </div>

      {loadingDetails ? (  // ← CORRIGÉ : utilise loadingDetails
        <div className="text-center py-8">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-600">Chargement des détails...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Statut</p>
              <div className="mt-1">{getStatusBadge(selectedCampagne.statut)}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Période</p>
              <p className="font-medium">
                {new Date(selectedCampagne.date_debut).toLocaleDateString()} - {new Date(selectedCampagne.date_fin).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Objectif</p>
              <p className="text-2xl font-bold text-purple-600">{selectedCampagne.poids_attendue} kg</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Déjà collecté</p>
              <p className="text-2xl font-bold text-green-600">{selectedCampagne.poids_collecte_actuel || 0} kg</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Reste à collecter</p>
              <p className="text-2xl font-bold text-orange-600">
                {(selectedCampagne.poids_attendue - (selectedCampagne.poids_collecte_actuel || 0)).toFixed(1)} kg
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Budget total</p>
              <p className="text-2xl font-bold text-blue-600">
                {((selectedCampagne.poids_attendue || 0) * (selectedCampagne.prix_par_kg || 0)).toLocaleString()} FCFA
              </p>
            </div>
          </div>

          {/* Types de déchets */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-2">Types de déchets acceptés</p>
            <div className="flex flex-wrap gap-2">
              {selectedCampagne.types_dechets?.map((type, idx) => (
                <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  {getTypeLabel(type)}
                </span>
              ))}
            </div>
          </div>

          {/* Zones d'intervention */}
          {selectedCampagne.zones_intervention?.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-2">Zones couvertes</p>
              <div className="flex flex-wrap gap-2">
                {selectedCampagne.zones_intervention.map((zone, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {zone}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Évolution journalière */}
          {evolutionJournaliere.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-4">Évolution journalière</p>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {evolutionJournaliere.map((jour, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          {new Date(jour.jour).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long'
                          })}
                        </p>
                        <p className="text-sm text-gray-500">
                          {jour.nombre_missions} mission(s) • {jour.points_actifs} point(s) actif(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">{jour.poids_total} kg</p>
                        <p className="text-sm text-gray-500">{jour.gains_total?.toLocaleString()} FCFA</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Détails par point de collecte */}
          {pointsDetails.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-4">Collectes par point</p>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {pointsDetails.map((point, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{point.point_nom}</p>
                        <p className="text-sm text-gray-500">{point.commune} - {point.quartier}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {point.nombre_missions} mission(s) • {point.collecteurs_actifs} collecteur(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">{point.poids_collecte} kg</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Barre de progression détaillée */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-2">Progression</p>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
                style={{ 
                  width: `${Math.min((selectedCampagne.poids_collecte_actuel || 0) / selectedCampagne.poids_attendue * 100, 100)}%` 
                }}
              />
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600">{selectedCampagne.poids_collecte_actuel || 0} kg collectés</span>
              <span className="font-medium text-purple-600">
                {((selectedCampagne.poids_collecte_actuel || 0) / selectedCampagne.poids_attendue * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <button
              className="btn-secondary"
              onClick={() => setShowDetailsModal(false)}
            >
              Fermer
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                toast.info('Export en cours de développement');
              }}
            >
              <Download size={16} />
              Exporter le rapport
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
)}
        {showCreateModal && (
          <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2 className="modal-title">Créer une nouvelle campagne</h2>

              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  {/* Informations générales */}
                  <div className="form-group full-width">
                    <label>Nom de la campagne <span>*</span></label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      placeholder="Ex: Campagne de recyclage 2024"
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Description de la campagne..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Date de début <span>*</span></label>
                    <input
                      type="date"
                      name="dateDebut"
                      value={formData.dateDebut}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Date de fin <span>*</span></label>
                    <input
                      type="date"
                      name="dateFin"
                      value={formData.dateFin}
                      onChange={handleInputChange}
                      min={formData.dateDebut || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  {/* ✅ Objectifs par type de déchet (remplace typesDechets, poidsAttendue, prixParKg) */}
                  <div className="form-group full-width">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Objectifs par type de déchet <span className="text-red-500">*</span>
                    </label>
                    
                    {formData.objectifs.map((objectif, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-purple-700">Objectif #{index + 1}</h4>
                          {formData.objectifs.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleSupprimerObjectif(index)}
                              className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                              title="Supprimer cet objectif"
                            >
                              <X size={18} />
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <select
                            value={objectif.typeDechet}
                            onChange={(e) => handleObjectifChange(index, 'typeDechet', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                            required
                          >
                            <option value="">Type de déchet</option>
                            <option value="plastique_pet">Plastique PET</option>
                            <option value="plastique_pehd">Plastique PEHD</option>
                            <option value="papier_carton">Papier/Carton</option>
                            <option value="metal">Métal</option>
                            <option value="verre">Verre</option>
                            <option value="organique">Organique</option>
                          </select>
                          
                          <input
                            type="number"
                            placeholder="Poids (kg)"
                            value={objectif.poidsAttendue}
                            onChange={(e) => handleObjectifChange(index, 'poidsAttendue', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                            min="1"
                            step="0.1"
                            required
                          />
                          
                          <input
                            type="number"
                            placeholder="Prix/kg (FCFA)"
                            value={objectif.prixParKg}
                            onChange={(e) => handleObjectifChange(index, 'prixParKg', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                            min="1"
                            step="1"
                            required
                          />
                        </div>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={handleAjouterObjectif}
                      className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Ajouter un type de déchet
                    </button>
                  </div>

                  {/* Zones d'intervention */}
                  <div className="form-group full-width">
                    <label>Zones d'intervention</label>
                    <input
                      type="text"
                      name="zones"
                      value={formData.zonesIntervention.join(', ')}
                      onChange={handleZoneChange}
                      placeholder="Dakar, Pikine, Guédiawaye (séparés par des virgules)"
                    />
                  </div>

                  {/* Promoteurs */}
                  <div className="form-group full-width">
                    <label>Promoteurs (sponsors/ONG)</label>
                    <div className="checkbox-group">
                      {promoteurs.sponsors.map(sponsor => (
                        <div key={`sponsor:${sponsor.id}`} className="checkbox-item">
                          <input
                            type="checkbox"
                            id={`sponsor-${sponsor.id}`}
                            value={`sponsor:${sponsor.id}`}
                            checked={formData.promoteurs.some(p => p.type === 'sponsor' && p.id === sponsor.id)}
                            onChange={handlePromoteurChange}
                          />
                          <label htmlFor={`sponsor-${sponsor.id}`}>
                            🏢 Sponsor: {sponsor.nom_organisation}
                          </label>
                        </div>
                      ))}
                      {promoteurs.ongs.map(ong => (
                        <div key={`ong:${ong.id}`} className="checkbox-item">
                          <input
                            type="checkbox"
                            id={`ong-${ong.id}`}
                            value={`ong:${ong.id}`}
                            checked={formData.promoteurs.some(p => p.type === 'ong' && p.id === ong.id)}
                            onChange={handlePromoteurChange}
                          />
                          <label htmlFor={`ong-${ong.id}`}>
                            🤝 ONG: {ong.nom_ong}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Créer la campagne
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CampagnesPage;