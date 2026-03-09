









// // // pages/ONG/DashboardONG.jsx
// // import React, { useState, useEffect } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import {
// //   TrendingUp, Map, Package, Calendar,
// //   Download, Eye, RefreshCw, Award,
// //   Target, BarChart3, PieChart, Clock, CheckCircle, XCircle,
// //   Users, TreePine, Leaf, Droplets, FileText,
// //   Search, X, Zap, MapPin, Recycle
// // } from 'lucide-react';
// // import toast from 'react-hot-toast';

// // const DashboardONG = () => {
// //   const navigate = useNavigate();
// //   const [loading, setLoading] = useState(true);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [user, setUser] = useState(null);
// //   const [campagnes, setCampagnes] = useState([]);
// //   const [statsGlobales, setStatsGlobales] = useState({
// //     totalCampagnes: 0,
// //     campagnesActives: 0,
// //     poidsTotalCollecte: 0,
// //     pointsCouverts: 0,
// //     collecteursActifs: 0
// //   });
// //   const [poidsParType, setPoidsParType] = useState({});
// //   const [impact, setImpact] = useState({
// //     co2Evite: 0,
// //     arbresSauves: 0,
// //     energieEconomisee: 0,
// //     eauEconomisee: 0
// //   });
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [selectedCampagne, setSelectedCampagne] = useState(null);
// //   const [showDetailsModal, setShowDetailsModal] = useState(false);
// //   const [campagneDetails, setCampagneDetails] = useState(null);
// //   const [pointsDetails, setPointsDetails] = useState([]);
// //   const [loadingDetails, setLoadingDetails] = useState(false);

// //   const API_URL = 'http://localhost:3000';
// //   const STORAGE_KEYS = {
// //     TOKEN: 'ecocollect_token',
// //     USER: 'ecocollect_user',
// //     ROLE: 'ecocollect_role'
// //   };

// //   const getToken = () => localStorage.getItem(STORAGE_KEYS.TOKEN);

// //   useEffect(() => {
// //     const userData = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
// //     setUser(userData);
// //     loadDashboard();
// //   }, []);

// //   const loadDashboard = async () => {
// //     const token = getToken();
// //     setLoading(true);

// //     try {
// //       // Charger les campagnes suivies par l'ONG
// //       const response = await fetch(`${API_URL}/api/ongs/campagnes`, {
// //         headers: { 'Authorization': `Bearer ${token}` }
// //       });
// //       const data = await response.json();

// //       if (data.success) {
// //         setCampagnes(data.campagnes || []);
        
// //         // Calculer les statistiques globales et les poids par type
// //         let totalPoids = 0;
// //         let totalPoints = 0;
// //         let totalCollecteurs = 0;
// //         let campagnesActives = 0;
// //         const poidsTypes = {};

// //         data.campagnes.forEach(c => {
// //           if (c.statut === 'active') campagnesActives++;
// //           totalPoids += parseFloat(c.poids_collecte_actuel || 0);
// //           totalPoints += c.points_couverts || 0;
// //           totalCollecteurs += c.collecteurs_actifs || 0;

// //           // Agrégation des poids par type de déchet
// //           if (c.objectifs && Array.isArray(c.objectifs)) {
// //             c.objectifs.forEach(obj => {
// //               const type = obj.type_dechet;
// //               if (!poidsTypes[type]) {
// //                 poidsTypes[type] = 0;
// //               }
// //               poidsTypes[type] += parseFloat(obj.poids_collecte_actuel || 0);
// //             });
// //           }
// //         });

// //         setStatsGlobales({
// //           totalCampagnes: data.campagnes.length,
// //           campagnesActives,
// //           poidsTotalCollecte: totalPoids,
// //           pointsCouverts: totalPoints,
// //           collecteursActifs: totalCollecteurs
// //         });

// //         setPoidsParType(poidsTypes);

// //         // Calculer l'impact environnemental détaillé
// //         setImpact({
// //           co2Evite: (totalPoids * 0.5).toFixed(1),
// //           arbresSauves: Math.floor(totalPoids / 100),
// //           energieEconomisee: (totalPoids * 2.5).toFixed(1),
// //           eauEconomisee: (totalPoids * 50).toFixed(1)
// //         });
// //       }
// //     } catch (error) {
// //       console.error('Erreur chargement dashboard:', error);
// //       toast.error('Erreur lors du chargement des données');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const loadCampagneDetails = async (campagneId) => {
// //     const token = getToken();
// //     setLoadingDetails(true);
// //     try {
// //       const response = await fetch(`${API_URL}/api/campagnes/${campagneId}`, {
// //         headers: { 'Authorization': `Bearer ${token}` }
// //       });
// //       const data = await response.json();
      
// //       if (data.success) {
// //         setCampagneDetails(data.campagne);
// //         setPointsDetails(data.campagne.points_couverts || []);
// //       }
// //     } catch (error) {
// //       console.error('Erreur chargement détails:', error);
// //       toast.error('Erreur lors du chargement des détails');
// //     } finally {
// //       setLoadingDetails(false);
// //     }
// //   };

// //   const handleRefresh = async () => {
// //     setRefreshing(true);
// //     await loadDashboard();
// //     setRefreshing(false);
// //     toast.success('Données actualisées');
// //   };

// //   const handleViewDetails = (campagne) => {
// //     setSelectedCampagne(campagne);
// //     loadCampagneDetails(campagne.id);
// //     setShowDetailsModal(true);
// //   };

// //   const getStatusBadge = (statut) => {
// //     const badges = {
// //       'planifiee': { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'Planifiée' },
// //       'active': { color: 'bg-green-100 text-green-800', icon: TrendingUp, label: 'Active' },
// //       'suspendue': { color: 'bg-yellow-100 text-yellow-800', icon: XCircle, label: 'Suspendue' },
// //       'terminee': { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Terminée' }
// //     };
// //     const badge = badges[statut] || badges.planifiee;
// //     const Icon = badge.icon;
// //     return (
// //       <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${badge.color}`}>
// //         <Icon size={12} />
// //         {badge.label}
// //       </span>
// //     );
// //   };

// //   const getTypeLabel = (type) => {
// //     const labels = {
// //       'plastique_pet': 'Plastique PET',
// //       'plastique_pehd': 'Plastique PEHD',
// //       'papier_carton': 'Papier/Carton',
// //       'metal': 'Métal',
// //       'verre': 'Verre',
// //       'organique': 'Organique'
// //     };
// //     return labels[type] || type;
// //   };

// //   const getTypeIcon = (type) => {
// //     const icons = {
// //       'plastique_pet': '🥤',
// //       'plastique_pehd': '🧴',
// //       'papier_carton': '📦',
// //       'metal': '🔩',
// //       'verre': '🍾',
// //       'organique': '🥬'
// //     };
// //     return icons[type] || '📊';
// //   };

// //   const getTypeColor = (type) => {
// //     const colors = {
// //       'plastique_pet': 'bg-blue-100 text-blue-800',
// //       'plastique_pehd': 'bg-indigo-100 text-indigo-800',
// //       'papier_carton': 'bg-yellow-100 text-yellow-800',
// //       'metal': 'bg-gray-100 text-gray-800',
// //       'verre': 'bg-green-100 text-green-800',
// //       'organique': 'bg-orange-100 text-orange-800'
// //     };
// //     return colors[type] || 'bg-gray-100 text-gray-800';
// //   };

// //   const filteredCampagnes = campagnes.filter(c => {
// //     if (!searchTerm) return true;
// //     return c.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //            c.description?.toLowerCase().includes(searchTerm.toLowerCase());
// //   });

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
// //         <div className="text-center">
// //           <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
// //           <p className="text-gray-600">Chargement du tableau de bord...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       {/* Header */}
// //       <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
// //           <div className="flex justify-between items-center">
// //             <div className="flex items-center gap-3">
// //               <Leaf className="h-8 w-8 text-green-600" />
// //               <div>
// //                 <h1 className="text-xl font-bold text-gray-900">Espace ONG</h1>
// //                 <p className="text-sm text-gray-500">{user?.nomONG || 'Observateur'}</p>
// //               </div>
// //             </div>
// //             <button
// //               onClick={handleRefresh}
// //               className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
// //               disabled={refreshing}
// //             >
// //               <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
// //               Actualiser
// //             </button>
// //           </div>
// //         </div>
// //       </header>

// //       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //         {/* Statistiques globales */}
// //         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
// //           <div className="bg-white rounded-xl shadow-lg p-6">
// //             <div className="flex items-center justify-between mb-2">
// //               <Target className="h-8 w-8 text-green-600" />
// //               <span className="text-2xl font-bold text-gray-900">{statsGlobales.totalCampagnes}</span>
// //             </div>
// //             <p className="text-sm text-gray-600">Campagnes suivies</p>
// //             <p className="text-xs text-gray-500 mt-2">
// //               {statsGlobales.campagnesActives} actives
// //             </p>
// //           </div>

// //           <div className="bg-white rounded-xl shadow-lg p-6">
// //             <div className="flex items-center justify-between mb-2">
// //               <Package className="h-8 w-8 text-blue-600" />
// //               <span className="text-2xl font-bold text-gray-900">
// //                 {statsGlobales.poidsTotalCollecte.toFixed(1)} kg
// //               </span>
// //             </div>
// //             <p className="text-sm text-gray-600">Déchets collectés</p>
// //           </div>

// //           <div className="bg-white rounded-xl shadow-lg p-6">
// //             <div className="flex items-center justify-between mb-2">
// //               <MapPin className="h-8 w-8 text-purple-600" />
// //               <span className="text-2xl font-bold text-gray-900">
// //                 {statsGlobales.pointsCouverts}
// //               </span>
// //             </div>
// //             <p className="text-sm text-gray-600">Points de collecte</p>
// //           </div>

// //           <div className="bg-white rounded-xl shadow-lg p-6">
// //             <div className="flex items-center justify-between mb-2">
// //               <Users className="h-8 w-8 text-orange-600" />
// //               <span className="text-2xl font-bold text-gray-900">
// //                 {statsGlobales.collecteursActifs}
// //               </span>
// //             </div>
// //             <p className="text-sm text-gray-600">Collecteurs actifs</p>
// //           </div>
// //         </div>

// //         {/* Poids par type de déchet - NOUVEAU */}
// //         {Object.keys(poidsParType).length > 0 && (
// //           <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
// //             <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
// //               <Recycle className="h-5 w-5 text-green-600" />
// //               Répartition par type de déchet
// //             </h2>
// //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// //               {Object.entries(poidsParType).map(([type, poids]) => {
// //                 const pourcentage = statsGlobales.poidsTotalCollecte > 0 
// //                   ? ((poids / statsGlobales.poidsTotalCollecte) * 100).toFixed(1) 
// //                   : 0;
                
// //                 return (
// //                   <div key={type} className="bg-gray-50 rounded-lg p-4">
// //                     <div className="flex items-center justify-between mb-2">
// //                       <div className="flex items-center gap-2">
// //                         <span className="text-2xl">{getTypeIcon(type)}</span>
// //                         <span className="font-medium text-gray-900">{getTypeLabel(type)}</span>
// //                       </div>
// //                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(type)}`}>
// //                         {pourcentage}%
// //                       </span>
// //                     </div>
// //                     <p className="text-2xl font-bold text-green-600">{poids.toFixed(1)} kg</p>
// //                     <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
// //                       <div 
// //                         className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
// //                         style={{ width: `${pourcentage}%` }}
// //                       />
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>
// //         )}

// //         {/* Impact environnemental */}
// //         <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white mb-8">
// //           <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
// //             <Award className="h-5 w-5" />
// //             Impact environnemental estimé
// //           </h2>
// //           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
// //             <div className="bg-white/10 rounded-lg p-4">
// //               <div className="flex items-center gap-2 mb-2">
// //                 <TreePine className="h-5 w-5" />
// //                 <span className="text-sm opacity-90">Arbres sauvés</span>
// //               </div>
// //               <p className="text-2xl font-bold">{impact.arbresSauves}</p>
// //             </div>
// //             <div className="bg-white/10 rounded-lg p-4">
// //               <div className="flex items-center gap-2 mb-2">
// //                 <Droplets className="h-5 w-5" />
// //                 <span className="text-sm opacity-90">Eau économisée</span>
// //               </div>
// //               <p className="text-2xl font-bold">{impact.eauEconomisee} L</p>
// //             </div>
// //             <div className="bg-white/10 rounded-lg p-4">
// //               <div className="flex items-center gap-2 mb-2">
// //                 <TrendingUp className="h-5 w-5" />
// //                 <span className="text-sm opacity-90">CO₂ évité</span>
// //               </div>
// //               <p className="text-2xl font-bold">{impact.co2Evite} kg</p>
// //             </div>
// //             <div className="bg-white/10 rounded-lg p-4">
// //               <div className="flex items-center gap-2 mb-2">
// //                 <Zap className="h-5 w-5" />
// //                 <span className="text-sm opacity-90">Énergie économisée</span>
// //               </div>
// //               <p className="text-2xl font-bold">{impact.energieEconomisee} kWh</p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Recherche */}
// //         <div className="mb-6">
// //           <div className="relative">
// //             <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
// //             <input
// //               type="text"
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //               placeholder="Rechercher une campagne..."
// //               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
// //             />
// //           </div>
// //         </div>

// //         {/* Liste des campagnes */}
// //         {filteredCampagnes.length > 0 ? (
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //             {filteredCampagnes.map((campagne) => {
// //               const progression = campagne.poids_attendue ? 
// //                 ((campagne.poids_collecte_actuel || 0) / campagne.poids_attendue * 100).toFixed(1) : 0;
              
// //               return (
// //                 <div key={campagne.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
// //                   <div className="flex justify-between items-start mb-3">
// //                     <div>
// //                       <h3 className="font-bold text-gray-900 text-lg">{campagne.nom}</h3>
// //                       {campagne.description && (
// //                         <p className="text-sm text-gray-500 mt-1">{campagne.description}</p>
// //                       )}
// //                     </div>
// //                     {getStatusBadge(campagne.statut)}
// //                   </div>

// //                   {/* Types de déchets */}
// //                   <div className="flex flex-wrap gap-1 mb-3">
// //                     {campagne.types_dechets?.map((type, idx) => (
// //                       <span key={idx} className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
// //                         {getTypeLabel(type)}
// //                       </span>
// //                     ))}
// //                   </div>

// //                   {/* Barre de progression */}
// //                   <div className="mb-3">
// //                     <div className="flex justify-between text-sm mb-1">
// //                       <span className="text-gray-600">Progression</span>
// //                       <span className="font-medium text-green-600">{progression}%</span>
// //                     </div>
// //                     <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
// //                       <div 
// //                         className="h-full bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"
// //                         style={{ width: `${progression}%` }}
// //                       />
// //                     </div>
// //                   </div>

// //                   {/* Statistiques */}
// //                   <div className="grid grid-cols-2 gap-3 mb-4">
// //                     <div className="bg-gray-50 p-2 rounded-lg">
// //                       <p className="text-xs text-gray-500">Collecté</p>
// //                       <p className="font-bold text-green-600">{campagne.poids_collecte_actuel || 0} kg</p>
// //                     </div>
// //                     <div className="bg-gray-50 p-2 rounded-lg">
// //                       <p className="text-xs text-gray-500">Objectif</p>
// //                       <p className="font-bold text-gray-900">{campagne.poids_attendue} kg</p>
// //                     </div>
// //                   </div>

// //                   {/* Objectifs par type (mini) */}
// //                   {campagne.objectifs && campagne.objectifs.length > 0 && (
// //                     <div className="mb-4 space-y-2">
// //                       {campagne.objectifs.slice(0, 2).map((obj, idx) => (
// //                         <div key={idx} className="flex items-center justify-between text-xs">
// //                           <span className="text-gray-600">{getTypeLabel(obj.type_dechet)}</span>
// //                           <span className="font-medium text-green-600">{obj.poids_collecte_actuel || 0} / {obj.poids_attendue} kg</span>
// //                         </div>
// //                       ))}
// //                       {campagne.objectifs.length > 2 && (
// //                         <p className="text-xs text-gray-400">+{campagne.objectifs.length - 2} autres types</p>
// //                       )}
// //                     </div>
// //                   )}

// //                   {/* Zones */}
// //                   {campagne.zones_intervention?.length > 0 && (
// //                     <div className="flex flex-wrap gap-1 mb-4">
// //                       {campagne.zones_intervention.slice(0, 2).map((zone, idx) => (
// //                         <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
// //                           {zone}
// //                         </span>
// //                       ))}
// //                       {campagne.zones_intervention.length > 2 && (
// //                         <span className="text-xs text-gray-400">+{campagne.zones_intervention.length - 2}</span>
// //                       )}
// //                     </div>
// //                   )}

// //                   {/* Période */}
// //                   <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
// //                     <Calendar size={16} />
// //                     <span>
// //                       {new Date(campagne.date_debut).toLocaleDateString()} - {new Date(campagne.date_fin).toLocaleDateString()}
// //                     </span>
// //                   </div>

// //                   {/* Bouton détails */}
// //                   <button
// //                     onClick={() => handleViewDetails(campagne)}
// //                     className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
// //                   >
// //                     <Eye size={16} />
// //                     Voir les détails
// //                   </button>
// //                 </div>
// //               );
// //             })}
// //           </div>
// //         ) : (
// //           <div className="bg-white rounded-xl shadow-lg p-12 text-center">
// //             <Leaf size={48} className="mx-auto mb-4 text-gray-300" />
// //             <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune campagne trouvée</h3>
// //             <p className="text-gray-600">
// //               Vous ne suivez encore aucune campagne
// //             </p>
// //           </div>
// //         )}
// //       </main>
// // {/* Modal de détails - Version avec points de collecte filtrés */}
// // {showDetailsModal && selectedCampagne && (
// //   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
// //     <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
// //       <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 sticky top-0">
// //         <div className="flex justify-between items-center">
// //           <h2 className="text-2xl font-bold text-gray-900">{selectedCampagne.nom}</h2>
// //           <button
// //             onClick={() => setShowDetailsModal(false)}
// //             className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg"
// //           >
// //             <X size={24} />
// //           </button>
// //         </div>
// //       </div>

// //       {loadingDetails ? (
// //         <div className="text-center py-8">
// //           <div className="spinner"></div>
// //           <p className="mt-4 text-gray-600">Chargement des détails...</p>
// //         </div>
// //       ) : (
// //         <div className="p-6 space-y-6">
// //           {/* Informations générales */}
// //           <div className="grid grid-cols-2 gap-4">
// //             <div className="bg-gray-50 p-4 rounded-lg">
// //               <p className="text-sm text-gray-500">Statut</p>
// //               <div className="mt-1">{getStatusBadge(selectedCampagne.statut)}</div>
// //             </div>
// //             <div className="bg-gray-50 p-4 rounded-lg">
// //               <p className="text-sm text-gray-500">Période</p>
// //               <p className="font-medium">
// //                 {new Date(selectedCampagne.date_debut).toLocaleDateString()} - {new Date(selectedCampagne.date_fin).toLocaleDateString()}
// //               </p>
// //             </div>
// //           </div>

// //           {/* Objectifs par type avec poids collecté */}
// //           <div className="bg-gray-50 p-4 rounded-lg">
// //             <h3 className="font-medium text-gray-900 mb-4">Collectes par type de déchet</h3>
// //             <div className="space-y-4">
// //               {campagneDetails?.objectifs?.map((obj, idx) => {
// //                 const progression = obj.poids_attendue ? 
// //                   ((obj.poids_collecte_actuel || 0) / obj.poids_attendue * 100).toFixed(1) : 0;
// //                 const reste = obj.poids_attendue - (obj.poids_collecte_actuel || 0);
                
// //                 return (
// //                   <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
// //                     <div className="flex justify-between items-start mb-3">
// //                       <div>
// //                         <span className="font-medium text-green-600">{getTypeLabel(obj.type_dechet)}</span>
// //                         <span className="ml-2 text-sm text-gray-500">Prix: {obj.prix_par_kg} FCFA/kg</span>
// //                       </div>
// //                       <span className="text-sm font-medium text-green-600">{progression}%</span>
// //                     </div>
                    
// //                     <div className="grid grid-cols-3 gap-4 mb-3">
// //                       <div className="bg-green-50 p-2 rounded text-center">
// //                         <p className="text-xs text-gray-500">Objectif</p>
// //                         <p className="text-lg font-bold text-gray-900">{obj.poids_attendue} kg</p>
// //                       </div>
// //                       <div className="bg-blue-50 p-2 rounded text-center">
// //                         <p className="text-xs text-gray-500">Collecté</p>
// //                         <p className="text-lg font-bold text-green-600">{obj.poids_collecte_actuel || 0} kg</p>
// //                       </div>
// //                       <div className="bg-orange-50 p-2 rounded text-center">
// //                         <p className="text-xs text-gray-500">Reste</p>
// //                         <p className="text-lg font-bold text-orange-600">{reste.toFixed(1)} kg</p>
// //                       </div>
// //                     </div>
                    
// //                     <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
// //                       <div 
// //                         className="h-full bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"
// //                         style={{ width: `${progression}%` }}
// //                       />
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>

// //           {/* Points de collecte avec dépôts uniquement - FILTRÉ */}
// //           {pointsDetails.filter(p => p.poids_collecte > 0).length > 0 ? (
// //             <div className="bg-gray-50 p-4 rounded-lg">
// //               <h3 className="font-medium text-gray-900 mb-4">Points de collecte actifs</h3>
// //               <div className="space-y-3 max-h-60 overflow-y-auto">
// //                 {pointsDetails
// //                   .filter(point => point.poids_collecte > 0) // ← FILTRE ICI
// //                   .sort((a, b) => b.poids_collecte - a.poids_collecte) // Trier par poids décroissant
// //                   .map((point, idx) => (
// //                     <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
// //                       <div className="flex justify-between items-start">
// //                         <div>
// //                           <p className="font-medium">{point.point_nom}</p>
// //                           <p className="text-sm text-gray-500">{point.commune} - {point.quartier}</p>
// //                           <p className="text-xs text-gray-400 mt-1">
// //                             {point.nombre_missions || 1} mission(s)
// //                           </p>
// //                         </div>
// //                         <div className="text-right">
// //                           <p className="text-xl font-bold text-green-600">{point.poids_collecte} kg</p>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   ))}
// //               </div>
// //               {/* Résumé des points */}
// //               <div className="mt-4 pt-3 border-t border-gray-200">
// //                 <p className="text-sm text-gray-600">
// //                   Total: <span className="font-bold text-green-600">
// //                     {pointsDetails.filter(p => p.poids_collecte > 0).reduce((acc, p) => acc + p.poids_collecte, 0)} kg
// //                   </span> sur {pointsDetails.filter(p => p.poids_collecte > 0).length} point(s)
// //                 </p>
// //               </div>
// //             </div>
// //           ) : (
// //             <div className="bg-gray-50 p-4 rounded-lg text-center">
// //               <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-2" />
// //               <p className="text-gray-500">Aucun point de collecte actif pour cette campagne</p>
// //               <p className="text-xs text-gray-400 mt-1">Les collectes apparaîtront quand des déchets seront déposés</p>
// //             </div>
// //           )}

// //           {/* Impact estimé pour cette campagne */}
// //           <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-4 text-white">
// //             <h3 className="font-medium mb-3">Impact environnemental estimé</h3>
// //             <div className="grid grid-cols-2 gap-3">
// //               <div>
// //                 <p className="text-xs opacity-90">CO₂ évité</p>
// //                 <p className="text-lg font-bold">{(selectedCampagne.poids_collecte_actuel * 0.5).toFixed(1)} kg</p>
// //               </div>
// //               <div>
// //                 <p className="text-xs opacity-90">Arbres sauvés</p>
// //                 <p className="text-lg font-bold">{Math.floor(selectedCampagne.poids_collecte_actuel / 100)}</p>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Bouton fermer */}
// //           <div className="flex justify-end pt-4 border-t">
// //             <button
// //               className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
// //               onClick={() => setShowDetailsModal(false)}
// //             >
// //               Fermer
// //             </button>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   </div>
// // )}
// //     </div>
// //   );
// // };

// // export default DashboardONG;


// // pages/ONG/DashboardONG.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   TrendingUp, Map, Package, Calendar,
//   Download, Eye, RefreshCw, Award,
//   Target, BarChart3, PieChart, Clock, CheckCircle, XCircle,
//   Users, TreePine, Leaf, Droplets, FileText,
//   Search, X, Zap, MapPin, Recycle,
//   Menu, LogOut, Home, BarChart, Settings, HelpCircle
// } from 'lucide-react';
// import toast from 'react-hot-toast';

// const DashboardONG = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [user, setUser] = useState(null);
//   const [campagnes, setCampagnes] = useState([]);
//   const [statsGlobales, setStatsGlobales] = useState({
//     totalCampagnes: 0,
//     campagnesActives: 0,
//     poidsTotalCollecte: 0,
//     pointsCouverts: 0,
//     collecteursActifs: 0
//   });
//   const [poidsParType, setPoidsParType] = useState({});
//   const [impact, setImpact] = useState({
//     co2Evite: 0,
//     arbresSauves: 0,
//     energieEconomisee: 0,
//     eauEconomisee: 0
//   });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCampagne, setSelectedCampagne] = useState(null);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [campagneDetails, setCampagneDetails] = useState(null);
//   const [pointsDetails, setPointsDetails] = useState([]);
//   const [loadingDetails, setLoadingDetails] = useState(false);
  
//   // Nouveaux états pour la sidebar et le modal de déconnexion
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [showLogoutModal, setShowLogoutModal] = useState(false);

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
//     loadDashboard();
//   }, []);

//   // Nouvelle fonction de déconnexion
//   const handleLogout = () => {
//     // Supprimer les données de session
//     localStorage.removeItem(STORAGE_KEYS.TOKEN);
//     localStorage.removeItem(STORAGE_KEYS.USER);
//     localStorage.removeItem(STORAGE_KEYS.ROLE);
    
//     // Afficher un message de confirmation
//     toast.success('Déconnexion réussie');
    
//     // Rediriger vers la page de connexion
//     navigate('/login');
//   };

//   const loadDashboard = async () => {
//     const token = getToken();
//     setLoading(true);

//     try {
//       // Charger les campagnes suivies par l'ONG
//       const response = await fetch(`${API_URL}/api/ongs/campagnes`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       const data = await response.json();

//       if (data.success) {
//         setCampagnes(data.campagnes || []);
        
//         // Calculer les statistiques globales et les poids par type
//         let totalPoids = 0;
//         let totalPoints = 0;
//         let totalCollecteurs = 0;
//         let campagnesActives = 0;
//         const poidsTypes = {};

//         data.campagnes.forEach(c => {
//           if (c.statut === 'active') campagnesActives++;
//           totalPoids += parseFloat(c.poids_collecte_actuel || 0);
//           totalPoints += c.points_couverts || 0;
//           totalCollecteurs += c.collecteurs_actifs || 0;

//           // Agrégation des poids par type de déchet
//           if (c.objectifs && Array.isArray(c.objectifs)) {
//             c.objectifs.forEach(obj => {
//               const type = obj.type_dechet;
//               if (!poidsTypes[type]) {
//                 poidsTypes[type] = 0;
//               }
//               poidsTypes[type] += parseFloat(obj.poids_collecte_actuel || 0);
//             });
//           }
//         });

//         setStatsGlobales({
//           totalCampagnes: data.campagnes.length,
//           campagnesActives,
//           poidsTotalCollecte: totalPoids,
//           pointsCouverts: totalPoints,
//           collecteursActifs: totalCollecteurs
//         });

//         setPoidsParType(poidsTypes);

//         // Calculer l'impact environnemental détaillé
//         setImpact({
//           co2Evite: (totalPoids * 0.5).toFixed(1),
//           arbresSauves: Math.floor(totalPoids / 100),
//           energieEconomisee: (totalPoids * 2.5).toFixed(1),
//           eauEconomisee: (totalPoids * 50).toFixed(1)
//         });
//       }
//     } catch (error) {
//       console.error('Erreur chargement dashboard:', error);
//       toast.error('Erreur lors du chargement des données');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadCampagneDetails = async (campagneId) => {
//     const token = getToken();
//     setLoadingDetails(true);
//     try {
//       const response = await fetch(`${API_URL}/api/campagnes/${campagneId}`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       const data = await response.json();
      
//       if (data.success) {
//         setCampagneDetails(data.campagne);
//         setPointsDetails(data.campagne.points_couverts || []);
//       }
//     } catch (error) {
//       console.error('Erreur chargement détails:', error);
//       toast.error('Erreur lors du chargement des détails');
//     } finally {
//       setLoadingDetails(false);
//     }
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await loadDashboard();
//     setRefreshing(false);
//     toast.success('Données actualisées');
//   };

//   const handleViewDetails = (campagne) => {
//     setSelectedCampagne(campagne);
//     loadCampagneDetails(campagne.id);
//     setShowDetailsModal(true);
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
//       'organique': 'Organique'
//     };
//     return labels[type] || type;
//   };

//   const getTypeIcon = (type) => {
//     const icons = {
//       'plastique_pet': '🥤',
//       'plastique_pehd': '🧴',
//       'papier_carton': '📦',
//       'metal': '🔩',
//       'verre': '🍾',
//       'organique': '🥬'
//     };
//     return icons[type] || '📊';
//   };

//   const getTypeColor = (type) => {
//     const colors = {
//       'plastique_pet': 'bg-blue-100 text-blue-800',
//       'plastique_pehd': 'bg-indigo-100 text-indigo-800',
//       'papier_carton': 'bg-yellow-100 text-yellow-800',
//       'metal': 'bg-gray-100 text-gray-800',
//       'verre': 'bg-green-100 text-green-800',
//       'organique': 'bg-orange-100 text-orange-800'
//     };
//     return colors[type] || 'bg-gray-100 text-gray-800';
//   };

//   const filteredCampagnes = campagnes.filter(c => {
//     if (!searchTerm) return true;
//     return c.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//            c.description?.toLowerCase().includes(searchTerm.toLowerCase());
//   });

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Chargement du tableau de bord...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* Sidebar */}
//       <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-xl transition-all duration-300 relative flex flex-col`}>
//         {/* Bouton toggle sidebar */}
//         <button
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           className="absolute -right-3 top-10 bg-white rounded-full p-1.5 shadow-lg border border-gray-200 hover:bg-gray-50"
//         >
//           <Menu size={16} className="text-gray-600" />
//         </button>

//         {/* Logo et titre */}
//         <div className="p-4 border-b border-gray-200">
//           <div className="flex items-center gap-2">
//             <Leaf className="h-8 w-8 text-green-600 flex-shrink-0" />
//             {sidebarOpen && (
//               <div>
//                 <h2 className="font-bold text-gray-900">EcoCollect</h2>
//                 <p className="text-xs text-green-600">ONG</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Informations utilisateur */}
//         <div className="p-4 border-b border-gray-200 bg-green-50">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
//               {user?.nomONG?.charAt(0) || 'O'}
//             </div>
//             {sidebarOpen && (
//               <div className="overflow-hidden">
//                 <p className="font-medium text-gray-900 truncate">{user?.nomONG || 'Observateur'}</p>
//                 <p className="text-xs text-gray-500 truncate">{user?.email || 'ong@exemple.com'}</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Menu de navigation */}
//         <nav className="flex-1 p-4">
//           <ul className="space-y-2">
//             <li>
//               <a href="#" className="flex items-center gap-3 px-3 py-2 text-green-600 bg-green-50 rounded-lg">
//                 <Home size={20} />
//                 {sidebarOpen && <span>Tableau de bord</span>}
//               </a>
//             </li>
//             <li>
//               <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
//                 <BarChart size={20} />
//                 {sidebarOpen && <span>Statistiques</span>}
//               </a>
//             </li>
//             <li>
//               <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
//                 <Map size={20} />
//                 {sidebarOpen && <span>Campagnes</span>}
//               </a>
//             </li>
//             <li>
//               <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
//                 <Users size={20} />
//                 {sidebarOpen && <span>Collecteurs</span>}
//               </a>
//             </li>
//             <li>
//               <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
//                 <Settings size={20} />
//                 {sidebarOpen && <span>Paramètres</span>}
//               </a>
//             </li>
//           </ul>
//         </nav>

//         {/* Bouton de déconnexion */}
//         <div className="p-4 border-t border-gray-200">
//           <button
//             onClick={() => setShowLogoutModal(true)}
//             className="flex items-center gap-3 px-3 py-2 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//           >
//             <LogOut size={20} />
//             {sidebarOpen && <span>Déconnexion</span>}
//           </button>
//         </div>

//         {/* Version */}
//         {sidebarOpen && (
//           <div className="p-4 text-xs text-gray-400 text-center border-t border-gray-200">
//             Version 1.0.0
//           </div>
//         )}
//       </div>

//       {/* Contenu principal */}
//       <div className="flex-1">
//         {/* Header */}
//         <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
//           <div className="px-4 sm:px-6 lg:px-8 py-4">
//             <div className="flex justify-between items-center">
//               <h1 className="text-xl font-bold text-gray-900">Tableau de bord</h1>
//               <button
//                 onClick={handleRefresh}
//                 className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
//                 disabled={refreshing}
//               >
//                 <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
//                 Actualiser
//               </button>
//             </div>
//           </div>
//         </header>

//         <main className="px-4 sm:px-6 lg:px-8 py-8">
//           {/* Statistiques globales */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <div className="flex items-center justify-between mb-2">
//                 <Target className="h-8 w-8 text-green-600" />
//                 <span className="text-2xl font-bold text-gray-900">{statsGlobales.totalCampagnes}</span>
//               </div>
//               <p className="text-sm text-gray-600">Campagnes suivies</p>
//               <p className="text-xs text-gray-500 mt-2">
//                 {statsGlobales.campagnesActives} actives
//               </p>
//             </div>

//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <div className="flex items-center justify-between mb-2">
//                 <Package className="h-8 w-8 text-blue-600" />
//                 <span className="text-2xl font-bold text-gray-900">
//                   {statsGlobales.poidsTotalCollecte.toFixed(1)} kg
//                 </span>
//               </div>
//               <p className="text-sm text-gray-600">Déchets collectés</p>
//             </div>

//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <div className="flex items-center justify-between mb-2">
//                 <MapPin className="h-8 w-8 text-purple-600" />
//                 <span className="text-2xl font-bold text-gray-900">
//                   {statsGlobales.pointsCouverts}
//                 </span>
//               </div>
//               <p className="text-sm text-gray-600">Points de collecte</p>
//             </div>

//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <div className="flex items-center justify-between mb-2">
//                 <Users className="h-8 w-8 text-orange-600" />
//                 <span className="text-2xl font-bold text-gray-900">
//                   {statsGlobales.collecteursActifs}
//                 </span>
//               </div>
//               <p className="text-sm text-gray-600">Collecteurs actifs</p>
//             </div>
//           </div>

//           {/* Poids par type de déchet */}
//           {Object.keys(poidsParType).length > 0 && (
//             <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                 <Recycle className="h-5 w-5 text-green-600" />
//                 Répartition par type de déchet
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {Object.entries(poidsParType).map(([type, poids]) => {
//                   const pourcentage = statsGlobales.poidsTotalCollecte > 0 
//                     ? ((poids / statsGlobales.poidsTotalCollecte) * 100).toFixed(1) 
//                     : 0;
                  
//                   return (
//                     <div key={type} className="bg-gray-50 rounded-lg p-4">
//                       <div className="flex items-center justify-between mb-2">
//                         <div className="flex items-center gap-2">
//                           <span className="text-2xl">{getTypeIcon(type)}</span>
//                           <span className="font-medium text-gray-900">{getTypeLabel(type)}</span>
//                         </div>
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(type)}`}>
//                           {pourcentage}%
//                         </span>
//                       </div>
//                       <p className="text-2xl font-bold text-green-600">{poids.toFixed(1)} kg</p>
//                       <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
//                         <div 
//                           className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
//                           style={{ width: `${pourcentage}%` }}
//                         />
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {/* Impact environnemental */}
//           <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white mb-8">
//             <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//               <Award className="h-5 w-5" />
//               Impact environnemental estimé
//             </h2>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               <div className="bg-white/10 rounded-lg p-4">
//                 <div className="flex items-center gap-2 mb-2">
//                   <TreePine className="h-5 w-5" />
//                   <span className="text-sm opacity-90">Arbres sauvés</span>
//                 </div>
//                 <p className="text-2xl font-bold">{impact.arbresSauves}</p>
//               </div>
//               <div className="bg-white/10 rounded-lg p-4">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Droplets className="h-5 w-5" />
//                   <span className="text-sm opacity-90">Eau économisée</span>
//                 </div>
//                 <p className="text-2xl font-bold">{impact.eauEconomisee} L</p>
//               </div>
//               <div className="bg-white/10 rounded-lg p-4">
//                 <div className="flex items-center gap-2 mb-2">
//                   <TrendingUp className="h-5 w-5" />
//                   <span className="text-sm opacity-90">CO₂ évité</span>
//                 </div>
//                 <p className="text-2xl font-bold">{impact.co2Evite} kg</p>
//               </div>
//               <div className="bg-white/10 rounded-lg p-4">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Zap className="h-5 w-5" />
//                   <span className="text-sm opacity-90">Énergie économisée</span>
//                 </div>
//                 <p className="text-2xl font-bold">{impact.energieEconomisee} kWh</p>
//               </div>
//             </div>
//           </div>

//           {/* Recherche */}
//           <div className="mb-6">
//             <div className="relative">
//               <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Rechercher une campagne..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
//               />
//             </div>
//           </div>

//           {/* Liste des campagnes */}
//           {filteredCampagnes.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredCampagnes.map((campagne) => {
//                 const progression = campagne.poids_attendue ? 
//                   ((campagne.poids_collecte_actuel || 0) / campagne.poids_attendue * 100).toFixed(1) : 0;
                
//                 return (
//                   <div key={campagne.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
//                     <div className="flex justify-between items-start mb-3">
//                       <div>
//                         <h3 className="font-bold text-gray-900 text-lg">{campagne.nom}</h3>
//                         {campagne.description && (
//                           <p className="text-sm text-gray-500 mt-1">{campagne.description}</p>
//                         )}
//                       </div>
//                       {getStatusBadge(campagne.statut)}
//                     </div>

//                     {/* Types de déchets */}
//                     <div className="flex flex-wrap gap-1 mb-3">
//                       {campagne.types_dechets?.map((type, idx) => (
//                         <span key={idx} className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
//                           {getTypeLabel(type)}
//                         </span>
//                       ))}
//                     </div>

//                     {/* Barre de progression */}
//                     <div className="mb-3">
//                       <div className="flex justify-between text-sm mb-1">
//                         <span className="text-gray-600">Progression</span>
//                         <span className="font-medium text-green-600">{progression}%</span>
//                       </div>
//                       <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//                         <div 
//                           className="h-full bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"
//                           style={{ width: `${progression}%` }}
//                         />
//                       </div>
//                     </div>

//                     {/* Statistiques */}
//                     <div className="grid grid-cols-2 gap-3 mb-4">
//                       <div className="bg-gray-50 p-2 rounded-lg">
//                         <p className="text-xs text-gray-500">Collecté</p>
//                         <p className="font-bold text-green-600">{campagne.poids_collecte_actuel || 0} kg</p>
//                       </div>
//                       <div className="bg-gray-50 p-2 rounded-lg">
//                         <p className="text-xs text-gray-500">Objectif</p>
//                         <p className="font-bold text-gray-900">{campagne.poids_attendue} kg</p>
//                       </div>
//                     </div>

//                     {/* Objectifs par type (mini) */}
//                     {campagne.objectifs && campagne.objectifs.length > 0 && (
//                       <div className="mb-4 space-y-2">
//                         {campagne.objectifs.slice(0, 2).map((obj, idx) => (
//                           <div key={idx} className="flex items-center justify-between text-xs">
//                             <span className="text-gray-600">{getTypeLabel(obj.type_dechet)}</span>
//                             <span className="font-medium text-green-600">{obj.poids_collecte_actuel || 0} / {obj.poids_attendue} kg</span>
//                           </div>
//                         ))}
//                         {campagne.objectifs.length > 2 && (
//                           <p className="text-xs text-gray-400">+{campagne.objectifs.length - 2} autres types</p>
//                         )}
//                       </div>
//                     )}

//                     {/* Zones */}
//                     {campagne.zones_intervention?.length > 0 && (
//                       <div className="flex flex-wrap gap-1 mb-4">
//                         {campagne.zones_intervention.slice(0, 2).map((zone, idx) => (
//                           <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
//                             {zone}
//                           </span>
//                         ))}
//                         {campagne.zones_intervention.length > 2 && (
//                           <span className="text-xs text-gray-400">+{campagne.zones_intervention.length - 2}</span>
//                         )}
//                       </div>
//                     )}

//                     {/* Période */}
//                     <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
//                       <Calendar size={16} />
//                       <span>
//                         {new Date(campagne.date_debut).toLocaleDateString()} - {new Date(campagne.date_fin).toLocaleDateString()}
//                       </span>
//                     </div>

//                     {/* Bouton détails */}
//                     <button
//                       onClick={() => handleViewDetails(campagne)}
//                       className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
//                     >
//                       <Eye size={16} />
//                       Voir les détails
//                     </button>
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <div className="bg-white rounded-xl shadow-lg p-12 text-center">
//               <Leaf size={48} className="mx-auto mb-4 text-gray-300" />
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune campagne trouvée</h3>
//               <p className="text-gray-600">
//                 Vous ne suivez encore aucune campagne
//               </p>
//             </div>
//           )}
//         </main>
//       </div>

//       {/* Modal de détails */}
//       {showDetailsModal && selectedCampagne && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
//             <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 sticky top-0">
//               <div className="flex justify-between items-center">
//                 <h2 className="text-2xl font-bold text-gray-900">{selectedCampagne.nom}</h2>
//                 <button
//                   onClick={() => setShowDetailsModal(false)}
//                   className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>
//             </div>

//             {loadingDetails ? (
//               <div className="text-center py-8">
//                 <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
//                 <p className="mt-4 text-gray-600">Chargement des détails...</p>
//               </div>
//             ) : (
//               <div className="p-6 space-y-6">
//                 {/* Informations générales */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <p className="text-sm text-gray-500">Statut</p>
//                     <div className="mt-1">{getStatusBadge(selectedCampagne.statut)}</div>
//                   </div>
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <p className="text-sm text-gray-500">Période</p>
//                     <p className="font-medium">
//                       {new Date(selectedCampagne.date_debut).toLocaleDateString()} - {new Date(selectedCampagne.date_fin).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Objectifs par type avec poids collecté */}
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <h3 className="font-medium text-gray-900 mb-4">Collectes par type de déchet</h3>
//                   <div className="space-y-4">
//                     {campagneDetails?.objectifs?.map((obj, idx) => {
//                       const progression = obj.poids_attendue ? 
//                         ((obj.poids_collecte_actuel || 0) / obj.poids_attendue * 100).toFixed(1) : 0;
//                       const reste = obj.poids_attendue - (obj.poids_collecte_actuel || 0);
                      
//                       return (
//                         <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
//                           <div className="flex justify-between items-start mb-3">
//                             <div>
//                               <span className="font-medium text-green-600">{getTypeLabel(obj.type_dechet)}</span>
//                               <span className="ml-2 text-sm text-gray-500">Prix: {obj.prix_par_kg} FCFA/kg</span>
//                             </div>
//                             <span className="text-sm font-medium text-green-600">{progression}%</span>
//                           </div>
                          
//                           <div className="grid grid-cols-3 gap-4 mb-3">
//                             <div className="bg-green-50 p-2 rounded text-center">
//                               <p className="text-xs text-gray-500">Objectif</p>
//                               <p className="text-lg font-bold text-gray-900">{obj.poids_attendue} kg</p>
//                             </div>
//                             <div className="bg-blue-50 p-2 rounded text-center">
//                               <p className="text-xs text-gray-500">Collecté</p>
//                               <p className="text-lg font-bold text-green-600">{obj.poids_collecte_actuel || 0} kg</p>
//                             </div>
//                             <div className="bg-orange-50 p-2 rounded text-center">
//                               <p className="text-xs text-gray-500">Reste</p>
//                               <p className="text-lg font-bold text-orange-600">{reste.toFixed(1)} kg</p>
//                             </div>
//                           </div>
                          
//                           <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//                             <div 
//                               className="h-full bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"
//                               style={{ width: `${progression}%` }}
//                             />
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>

//                 {/* Points de collecte avec dépôts uniquement */}
//                 {pointsDetails.filter(p => p.poids_collecte > 0).length > 0 ? (
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <h3 className="font-medium text-gray-900 mb-4">Points de collecte actifs</h3>
//                     <div className="space-y-3 max-h-60 overflow-y-auto">
//                       {pointsDetails
//                         .filter(point => point.poids_collecte > 0)
//                         .sort((a, b) => b.poids_collecte - a.poids_collecte)
//                         .map((point, idx) => (
//                           <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
//                             <div className="flex justify-between items-start">
//                               <div>
//                                 <p className="font-medium">{point.point_nom}</p>
//                                 <p className="text-sm text-gray-500">{point.commune} - {point.quartier}</p>
//                                 <p className="text-xs text-gray-400 mt-1">
//                                   {point.nombre_missions || 1} mission(s)
//                                 </p>
//                               </div>
//                               <div className="text-right">
//                                 <p className="text-xl font-bold text-green-600">{point.poids_collecte} kg</p>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                     </div>
//                     <div className="mt-4 pt-3 border-t border-gray-200">
//                       <p className="text-sm text-gray-600">
//                         Total: <span className="font-bold text-green-600">
//                           {pointsDetails.filter(p => p.poids_collecte > 0).reduce((acc, p) => acc + p.poids_collecte, 0)} kg
//                         </span> sur {pointsDetails.filter(p => p.poids_collecte > 0).length} point(s)
//                       </p>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="bg-gray-50 p-4 rounded-lg text-center">
//                     <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-2" />
//                     <p className="text-gray-500">Aucun point de collecte actif pour cette campagne</p>
//                     <p className="text-xs text-gray-400 mt-1">Les collectes apparaîtront quand des déchets seront déposés</p>
//                   </div>
//                 )}

//                 {/* Impact estimé pour cette campagne */}
//                 <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-4 text-white">
//                   <h3 className="font-medium mb-3">Impact environnemental estimé</h3>
//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <p className="text-xs opacity-90">CO₂ évité</p>
//                       <p className="text-lg font-bold">{(selectedCampagne.poids_collecte_actuel * 0.5).toFixed(1)} kg</p>
//                     </div>
//                     <div>
//                       <p className="text-xs opacity-90">Arbres sauvés</p>
//                       <p className="text-lg font-bold">{Math.floor(selectedCampagne.poids_collecte_actuel / 100)}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Bouton fermer */}
//                 <div className="flex justify-end pt-4 border-t">
//                   <button
//                     className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
//                     onClick={() => setShowDetailsModal(false)}
//                   >
//                     Fermer
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Modal de déconnexion */}
//       {showLogoutModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition-all">
//             <div className="p-6">
//               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <LogOut size={32} className="text-red-600" />
//               </div>
              
//               <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
//                 Déconnexion
//               </h3>
              
//               <p className="text-gray-600 text-center mb-6">
//                 Êtes-vous sûr de vouloir vous déconnecter ?
//               </p>

//               <div className="flex gap-3">
//                 <button
//                   onClick={() => setShowLogoutModal(false)}
//                   className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
//                 >
//                   Annuler
//                 </button>
//                 <button
//                   onClick={handleLogout}
//                   className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors flex items-center justify-center gap-2"
//                 >
//                   <LogOut size={18} />
//                   Se déconnecter
//                 </button>
//               </div>

//               <button
//                 onClick={() => setShowLogoutModal(false)}
//                 className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
//               >
//                 <X size={20} />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DashboardONG;

// pages/ONG/DashboardONG.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, Map, Package, Calendar,
  Download, Eye, RefreshCw, Award,
  Target, BarChart3, PieChart, Clock, CheckCircle, XCircle,
  Users, TreePine, Leaf, Droplets, FileText,
  Search, X, Zap, MapPin, Recycle,
  Menu, LogOut, Home, BarChart, Settings, HelpCircle,
  Mail, Phone, MapPin as MapIcon, Edit, Save, Camera
} from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardONG = () => {
  const navigate = useNavigate();
  
  // États existants
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [campagnes, setCampagnes] = useState([]);
  const [statsGlobales, setStatsGlobales] = useState({
    totalCampagnes: 0,
    campagnesActives: 0,
    poidsTotalCollecte: 0,
    pointsCouverts: 0,
    collecteursActifs: 0
  });
  const [poidsParType, setPoidsParType] = useState({});
  const [impact, setImpact] = useState({
    co2Evite: 0,
    arbresSauves: 0,
    energieEconomisee: 0,
    eauEconomisee: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampagne, setSelectedCampagne] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [campagneDetails, setCampagneDetails] = useState(null);
  const [pointsDetails, setPointsDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  // États pour la navigation et modals
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  const [evolutionMensuelle, setEvolutionMensuelle] = useState([]);

//   const API_URL = 'http://localhost:3000';
 const API_URL = 'https://ecobackend-zeds.vercel.app';
  const STORAGE_KEYS = {
    TOKEN: 'ecocollect_token',
    USER: 'ecocollect_user',
    ROLE: 'ecocollect_role'
  };

  const getToken = () => localStorage.getItem(STORAGE_KEYS.TOKEN);

  // Charger le profil depuis le serveur
  const loadUserProfile = async () => {
    const token = getToken();
    try {
      const response = await fetch(`${API_URL}/api/ongs/profil`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        const userData = {
          id: data.ong?.id,
          email: data.ong?.email,
          telephone: data.ong?.telephone,
          nomONG: data.ong?.nom_ong,
          numeroAgrement: data.ong?.numero_agrement,
          domaineIntervention: data.ong?.domaine_intervention,
          nomResponsable: data.ong?.nom_responsable,
          adresse: data.ong?.adresse,
          photoLogoUrl: data.ong?.photo_logo_url
        };
        
        setUser(userData);
        setProfileForm(userData);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Erreur chargement profil:', error);
    }
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
    setUser(userData);
    setProfileForm(userData);
    
    loadUserProfile();
    loadDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
    toast.success('Déconnexion réussie');
    navigate('/login');
  };

  // Calculer l'évolution mensuelle du nombre de campagnes
  const calculerEvolutionMensuelle = (campagnes) => {
    const mois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const now = new Date();
    const evolution = [];
    
    // Générer les 6 derniers mois
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const moisIndex = date.getMonth();
      const annee = date.getFullYear();
      
      const count = campagnes.filter(c => {
        const dateCreation = new Date(c.date_creation || c.date_debut);
        return dateCreation.getMonth() === moisIndex && 
               dateCreation.getFullYear() === annee;
      }).length;
      
      evolution.push({
        mois: `${mois[moisIndex]} ${annee}`,
        nombre: count
      });
    }
    
    return evolution;
  };

  const loadDashboard = async () => {
    const token = getToken();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/ongs/campagnes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.success) {
        setCampagnes(data.campagnes || []);
        
        // Calculer l'évolution mensuelle
        const evolution = calculerEvolutionMensuelle(data.campagnes || []);
        setEvolutionMensuelle(evolution);

        let totalPoids = 0;
        let totalPoints = 0;
        let totalCollecteurs = 0;
        let campagnesActives = 0;
        const poidsTypes = {};

        data.campagnes.forEach(c => {
          if (c.statut === 'active') campagnesActives++;
          totalPoids += parseFloat(c.poids_collecte_actuel || 0);
          totalPoints += c.points_couverts || 0;
          totalCollecteurs += c.collecteurs_actifs || 0;

          if (c.objectifs && Array.isArray(c.objectifs)) {
            c.objectifs.forEach(obj => {
              const type = obj.type_dechet;
              if (!poidsTypes[type]) {
                poidsTypes[type] = 0;
              }
              poidsTypes[type] += parseFloat(obj.poids_collecte_actuel || 0);
            });
          }
        });

        setStatsGlobales({
          totalCampagnes: data.campagnes.length,
          campagnesActives,
          poidsTotalCollecte: totalPoids,
          pointsCouverts: totalPoints,
          collecteursActifs: totalCollecteurs
        });

        setPoidsParType(poidsTypes);

        setImpact({
          co2Evite: (totalPoids * 0.5).toFixed(1),
          arbresSauves: Math.floor(totalPoids / 100),
          energieEconomisee: (totalPoids * 2.5).toFixed(1),
          eauEconomisee: (totalPoids * 50).toFixed(1)
        });
      }
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const loadCampagneDetails = async (campagneId) => {
    const token = getToken();
    setLoadingDetails(true);
    try {
      const response = await fetch(`${API_URL}/api/campagnes/${campagneId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setCampagneDetails(data.campagne);
        setPointsDetails(data.campagne.points_couverts || []);
      }
    } catch (error) {
      console.error('Erreur chargement détails:', error);
      toast.error('Erreur lors du chargement des détails');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
    await loadUserProfile();
    setRefreshing(false);
    toast.success('Données actualisées');
  };

  const handleViewDetails = (campagne) => {
    setSelectedCampagne(campagne);
    loadCampagneDetails(campagne.id);
    setShowDetailsModal(true);
  };

  const handleProfileUpdate = async () => {
    const token = getToken();
    try {
      const response = await fetch(`${API_URL}/api/ongs/profil`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileForm)
      });
      const data = await response.json();
      
      if (data.success) {
        setUser(profileForm);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profileForm));
        setEditingProfile(false);
        toast.success('Profil mis à jour avec succès');
        await loadUserProfile();
      }
    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      toast.error('Erreur lors de la mise à jour du profil');
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
      'organique': 'Organique'
    };
    return labels[type] || type;
  };

  const getTypeIcon = (type) => {
    const icons = {
      'plastique_pet': '🥤',
      'plastique_pehd': '🧴',
      'papier_carton': '📦',
      'metal': '🔩',
      'verre': '🍾',
      'organique': '🥬'
    };
    return icons[type] || '📊';
  };

  const getTypeColor = (type) => {
    const colors = {
      'plastique_pet': 'bg-blue-100 text-blue-800',
      'plastique_pehd': 'bg-indigo-100 text-indigo-800',
      'papier_carton': 'bg-yellow-100 text-yellow-800',
      'metal': 'bg-gray-100 text-gray-800',
      'verre': 'bg-green-100 text-green-800',
      'organique': 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  // Composant pour le graphique en barres
  const BarChart = ({ data }) => {
    if (!data || data.length === 0) return null;
    
    const maxValue = Math.max(...data.map(d => d.nombre));
    const height = 200;
    
    return (
      <div className="relative">
        <div className="flex items-end justify-around h-64 gap-2">
          {data.map((item, index) => {
            const barHeight = maxValue > 0 ? (item.nombre / maxValue) * height : 0;
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="relative w-full flex justify-center mb-2">
                  <span className="text-sm font-semibold text-green-600">{item.nombre}</span>
                </div>
                <div 
                  className="w-full bg-green-500 rounded-t-lg transition-all duration-300 hover:bg-green-600"
                  style={{ height: `${barHeight}px` }}
                />
                <div className="mt-2 text-xs text-gray-600 transform -rotate-45 origin-top-left">
                  {item.mois}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const filteredCampagnes = campagnes.filter(c => {
    if (!searchTerm) return true;
    return c.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           c.description?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  // Rendu du contenu en fonction de la page
  const renderContent = () => {
    switch(currentPage) {
      case 'dashboard':
        return (
          <>
            {/* Statistiques globales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <Target className="h-8 w-8 text-green-600" />
                  <span className="text-2xl font-bold text-gray-900">{statsGlobales.totalCampagnes}</span>
                </div>
                <p className="text-sm text-gray-600">Campagnes suivies</p>
                <p className="text-xs text-gray-500 mt-2">
                  {statsGlobales.campagnesActives} actives
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <Package className="h-8 w-8 text-blue-600" />
                  <span className="text-2xl font-bold text-gray-900">
                    {statsGlobales.poidsTotalCollecte.toFixed(1)} kg
                  </span>
                </div>
                <p className="text-sm text-gray-600">Déchets collectés</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <MapPin className="h-8 w-8 text-purple-600" />
                  <span className="text-2xl font-bold text-gray-900">
                    {statsGlobales.pointsCouverts}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Points de collecte</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-8 w-8 text-orange-600" />
                  <span className="text-2xl font-bold text-gray-900">
                    {statsGlobales.collecteursActifs}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Collecteurs actifs</p>
              </div>
            </div>

            {/* Évolution mensuelle */}
            {evolutionMensuelle.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Évolution mensuelle des campagnes
                </h2>
                <BarChart data={evolutionMensuelle} />
              </div>
            )}

            {/* Poids par type de déchet */}
            {Object.keys(poidsParType).length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Recycle className="h-5 w-5 text-green-600" />
                  Répartition par type de déchet
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(poidsParType).map(([type, poids]) => {
                    const pourcentage = statsGlobales.poidsTotalCollecte > 0 
                      ? ((poids / statsGlobales.poidsTotalCollecte) * 100).toFixed(1) 
                      : 0;
                    
                    return (
                      <div key={type} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{getTypeIcon(type)}</span>
                            <span className="font-medium text-gray-900">{getTypeLabel(type)}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(type)}`}>
                            {pourcentage}%
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-green-600">{poids.toFixed(1)} kg</p>
                        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                            style={{ width: `${pourcentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Impact environnemental */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5" />
                Impact environnemental estimé
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TreePine className="h-5 w-5" />
                    <span className="text-sm opacity-90">Arbres sauvés</span>
                  </div>
                  <p className="text-2xl font-bold">{impact.arbresSauves}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="h-5 w-5" />
                    <span className="text-sm opacity-90">Eau économisée</span>
                  </div>
                  <p className="text-2xl font-bold">{impact.eauEconomisee} L</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5" />
                    <span className="text-sm opacity-90">CO₂ évité</span>
                  </div>
                  <p className="text-2xl font-bold">{impact.co2Evite} kg</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5" />
                    <span className="text-sm opacity-90">Énergie économisée</span>
                  </div>
                  <p className="text-2xl font-bold">{impact.energieEconomisee} kWh</p>
                </div>
              </div>
            </div>

            {/* Recherche */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher une campagne..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>

            {/* Liste des campagnes */}
            {filteredCampagnes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCampagnes.map((campagne) => {
                  const progression = campagne.poids_attendue ? 
                    ((campagne.poids_collecte_actuel || 0) / campagne.poids_attendue * 100).toFixed(1) : 0;
                  
                  return (
                    <div key={campagne.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{campagne.nom}</h3>
                          {campagne.description && (
                            <p className="text-sm text-gray-500 mt-1">{campagne.description}</p>
                          )}
                        </div>
                        {getStatusBadge(campagne.statut)}
                      </div>

                      {/* Types de déchets */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {campagne.types_dechets?.map((type, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                            {getTypeLabel(type)}
                          </span>
                        ))}
                      </div>

                      {/* Barre de progression */}
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Progression</span>
                          <span className="font-medium text-green-600">{progression}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"
                            style={{ width: `${progression}%` }}
                          />
                        </div>
                      </div>

                      {/* Statistiques */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-gray-50 p-2 rounded-lg">
                          <p className="text-xs text-gray-500">Collecté</p>
                          <p className="font-bold text-green-600">{campagne.poids_collecte_actuel || 0} kg</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-lg">
                          <p className="text-xs text-gray-500">Objectif</p>
                          <p className="font-bold text-gray-900">{campagne.poids_attendue} kg</p>
                        </div>
                      </div>

                      {/* Objectifs par type (mini) */}
                      {campagne.objectifs && campagne.objectifs.length > 0 && (
                        <div className="mb-4 space-y-2">
                          {campagne.objectifs.slice(0, 2).map((obj, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">{getTypeLabel(obj.type_dechet)}</span>
                              <span className="font-medium text-green-600">{obj.poids_collecte_actuel || 0} / {obj.poids_attendue} kg</span>
                            </div>
                          ))}
                          {campagne.objectifs.length > 2 && (
                            <p className="text-xs text-gray-400">+{campagne.objectifs.length - 2} autres types</p>
                          )}
                        </div>
                      )}

                      {/* Zones */}
                      {campagne.zones_intervention?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {campagne.zones_intervention.slice(0, 2).map((zone, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {zone}
                            </span>
                          ))}
                          {campagne.zones_intervention.length > 2 && (
                            <span className="text-xs text-gray-400">+{campagne.zones_intervention.length - 2}</span>
                          )}
                        </div>
                      )}

                      {/* Période */}
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <Calendar size={16} />
                        <span>
                          {new Date(campagne.date_debut).toLocaleDateString()} - {new Date(campagne.date_fin).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Bouton détails */}
                      <button
                        onClick={() => handleViewDetails(campagne)}
                        className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                      >
                        <Eye size={16} />
                        Voir les détails
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Leaf size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune campagne trouvée</h3>
                <p className="text-gray-600">
                  Vous ne suivez encore aucune campagne
                </p>
              </div>
            )}
          </>
        );

      case 'campagnes':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Toutes mes campagnes</h2>
            <div className="space-y-4">
              {campagnes.map((campagne) => (
                <div key={campagne.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">{campagne.nom}</h3>
                      <p className="text-sm text-gray-600">{campagne.description}</p>
                      <div className="flex gap-4 mt-2">
                        <span className="text-xs text-gray-500">
                          Début: {new Date(campagne.date_debut).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-500">
                          Fin: {new Date(campagne.date_fin).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(campagne.statut)}
                      <button
                        onClick={() => handleViewDetails(campagne)}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                      >
                        Détails
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'statistiques':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Évolution mensuelle</h2>
              {evolutionMensuelle.length > 0 ? (
                <>
                  <p className="text-gray-600 mb-4">
                    Nombre de campagnes suivies par mois
                  </p>
                  <BarChart data={evolutionMensuelle} />
                </>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Aucune donnée d'évolution disponible
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Statistiques de collecte</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total collecté</span>
                    <span className="font-bold text-green-600">{statsGlobales.poidsTotalCollecte.toFixed(1)} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Points de collecte</span>
                    <span className="font-bold text-purple-600">{statsGlobales.pointsCouverts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Collecteurs actifs</span>
                    <span className="font-bold text-orange-600">{statsGlobales.collecteursActifs}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Impact environnemental</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">CO₂ évité</span>
                    <span className="font-bold text-blue-600">{impact.co2Evite} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Arbres sauvés</span>
                    <span className="font-bold text-green-600">{impact.arbresSauves}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Eau économisée</span>
                    <span className="font-bold text-cyan-600">{impact.eauEconomisee} L</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'parametres':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Mon Profil</h2>
              <button
                onClick={() => setEditingProfile(!editingProfile)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                {editingProfile ? <Save size={18} /> : <Edit size={18} />}
                {editingProfile ? 'Sauvegarder' : 'Modifier le profil'}
              </button>
            </div>

            <div className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {user?.nomONG?.charAt(0) || 'O'}
                  </div>
                  {editingProfile && (
                    <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200">
                      <Camera size={16} className="text-gray-600" />
                    </button>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{user?.nomONG}</h3>
                  <p className="text-gray-600">ONG • {user?.numeroAgrement || 'Agrément en attente'}</p>
                </div>
              </div>

              {/* Formulaire */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Mail size={18} className="text-gray-400" />
                    {editingProfile ? (
                      <input
                        type="email"
                        value={profileForm.email || ''}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        className="flex-1 bg-transparent border-none focus:ring-0"
                      />
                    ) : (
                      <span className="flex-1">{user?.email || 'Non renseigné'}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Phone size={18} className="text-gray-400" />
                    {editingProfile ? (
                      <input
                        type="tel"
                        value={profileForm.telephone || ''}
                        onChange={(e) => setProfileForm({...profileForm, telephone: e.target.value})}
                        className="flex-1 bg-transparent border-none focus:ring-0"
                      />
                    ) : (
                      <span className="flex-1">{user?.telephone || 'Non renseigné'}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom du responsable</label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Users size={18} className="text-gray-400" />
                    {editingProfile ? (
                      <input
                        type="text"
                        value={profileForm.nomResponsable || ''}
                        onChange={(e) => setProfileForm({...profileForm, nomResponsable: e.target.value})}
                        className="flex-1 bg-transparent border-none focus:ring-0"
                        placeholder="Nom du responsable"
                      />
                    ) : (
                      <span className="flex-1">{user?.nomResponsable || 'Non renseigné'}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <MapIcon size={18} className="text-gray-400" />
                    {editingProfile ? (
                      <input
                        type="text"
                        value={profileForm.adresse || ''}
                        onChange={(e) => setProfileForm({...profileForm, adresse: e.target.value})}
                        className="flex-1 bg-transparent border-none focus:ring-0"
                      />
                    ) : (
                      <span className="flex-1">{user?.adresse || 'Non renseigné'}</span>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Domaines d'intervention</label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    {editingProfile ? (
                      <input
                        type="text"
                        value={Array.isArray(profileForm.domaineIntervention) ? profileForm.domaineIntervention.join(', ') : profileForm.domaineIntervention || ''}
                        onChange={(e) => setProfileForm({...profileForm, domaineIntervention: e.target.value.split(',').map(d => d.trim())})}
                        className="w-full bg-transparent border-none focus:ring-0"
                        placeholder="Ex: Environnement, Éducation, Santé"
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(user?.domaineIntervention) ? user.domaineIntervention.map((domaine, idx) => (
                          <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            {domaine}
                          </span>
                        )) : (
                          <span className="text-gray-600">{user?.domaineIntervention || 'Non renseigné'}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {editingProfile && (
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => {
                      setEditingProfile(false);
                      setProfileForm(user);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleProfileUpdate}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Sauvegarder
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'aide':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Centre d'aide</h2>
            
            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-semibold text-green-600 mb-3">Bienvenue dans votre espace ONG</h3>
                <p className="text-gray-600">
                  En tant qu'organisation non gouvernementale, vous pouvez suivre l'évolution des campagnes environnementales,
                  consulter des indicateurs clés et mesurer l'impact de vos actions.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Fonctionnalités disponibles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">📊 Tableau de bord</h4>
                    <p className="text-sm text-gray-600">
                      Vue d'ensemble des campagnes suivies avec des indicateurs de performance et l'impact environnemental.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">📈 Statistiques</h4>
                    <p className="text-sm text-gray-600">
                      Graphique d'évolution mensuelle du nombre de campagnes et statistiques détaillées.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-800 mb-2">🎯 Campagnes</h4>
                    <p className="text-sm text-gray-600">
                      Liste complète de toutes les campagnes que vous suivez avec leurs détails.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-800 mb-2">♻️ Impact environnemental</h4>
                    <p className="text-sm text-gray-600">
                      Calcul de l'impact : CO₂ évité, arbres sauvés, eau et énergie économisées.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <h4 className="font-medium text-indigo-800 mb-2">🗺️ Points de collecte</h4>
                    <p className="text-sm text-gray-600">
                      Visualisation des points de collecte actifs et de leurs performances.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-pink-50 rounded-lg">
                    <h4 className="font-medium text-pink-800 mb-2">⚙️ Paramètres</h4>
                    <p className="text-sm text-gray-600">
                      Gestion de votre profil et des informations de votre organisation.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Comment interpréter les données ?</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-sm">1</span>
                    </div>
                    <p className="text-gray-600">
                      <span className="font-medium">Progression des campagnes :</span> Les barres de progression montrent l'avancement par rapport aux objectifs fixés.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-sm">2</span>
                    </div>
                    <p className="text-gray-600">
                      <span className="font-medium">Évolution mensuelle :</span> Le graphique en barres montre le nombre de campagnes suivies chaque mois.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-sm">3</span>
                    </div>
                    <p className="text-gray-600">
                      <span className="font-medium">Impact environnemental :</span> Les indicateurs verts calculent l'impact positif de vos actions sur l'environnement.
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Besoin d'aide supplémentaire ?</h3>
                <p className="text-gray-600 mb-3">
                  Notre équipe est là pour vous accompagner. N'hésitez pas à nous contacter :
                </p>
                <div className="flex gap-4">
                  <a href="mailto:support-ong@ecocollect.com" className="text-green-600 hover:underline">
                    support-ong@ecocollect.com
                  </a>
                  <span className="text-gray-300">|</span>
                  <a href="tel:+2250708091011" className="text-green-600 hover:underline">
                    +225 07 08 09 10 11
                  </a>
                </div>
              </section>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-xl transition-all duration-300 relative flex flex-col`}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-10 bg-white rounded-full p-1.5 shadow-lg border border-gray-200 hover:bg-gray-50"
        >
          <Menu size={16} className="text-gray-600" />
        </button>

        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-green-600 flex-shrink-0" />
            {sidebarOpen && (
              <div>
                <h2 className="font-bold text-gray-900">EcoCollect</h2>
                <p className="text-xs text-green-600">ONG</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-b border-gray-200 bg-green-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              {user?.nomONG?.charAt(0) || 'O'}
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <p className="font-medium text-gray-900 truncate">{user?.nomONG || 'Observateur'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || 'ong@exemple.com'}</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  currentPage === 'dashboard' 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Home size={20} />
                {sidebarOpen && <span>Tableau de bord</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('statistiques')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  currentPage === 'statistiques' 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <BarChart size={20} />
                {sidebarOpen && <span>Statistiques</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('campagnes')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  currentPage === 'campagnes' 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Map size={20} />
                {sidebarOpen && <span>Campagnes</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('parametres')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  currentPage === 'parametres' 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Settings size={20} />
                {sidebarOpen && <span>Paramètres</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('aide')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  currentPage === 'aide' 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <HelpCircle size={20} />
                {sidebarOpen && <span>Aide</span>}
              </button>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 px-3 py-2 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>

        {sidebarOpen && (
          <div className="p-4 text-xs text-gray-400 text-center border-t border-gray-200">
            Version 1.0.0
          </div>
        )}
      </div>

      {/* Contenu principal */}
      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-900">
                {currentPage === 'dashboard' && 'Tableau de bord'}
                {currentPage === 'statistiques' && 'Statistiques'}
                {currentPage === 'campagnes' && 'Mes campagnes'}
                {currentPage === 'parametres' && 'Paramètres'}
                {currentPage === 'aide' && 'Centre d\'aide'}
              </h1>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                disabled={refreshing}
              >
                <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                Actualiser
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </main>
      </div>

      {/* Modal de détails */}
      {showDetailsModal && selectedCampagne && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 sticky top-0">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">{selectedCampagne.nom}</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {loadingDetails ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-600">Chargement des détails...</p>
              </div>
            ) : (
              <div className="p-6 space-y-6">
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
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-4">Collectes par type de déchet</h3>
                  <div className="space-y-4">
                    {campagneDetails?.objectifs?.map((obj, idx) => {
                      const progression = obj.poids_attendue ? 
                        ((obj.poids_collecte_actuel || 0) / obj.poids_attendue * 100).toFixed(1) : 0;
                      const reste = obj.poids_attendue - (obj.poids_collecte_actuel || 0);
                      
                      return (
                        <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <span className="font-medium text-green-600">{getTypeLabel(obj.type_dechet)}</span>
                              <span className="ml-2 text-sm text-gray-500">Prix: {obj.prix_par_kg} FCFA/kg</span>
                            </div>
                            <span className="text-sm font-medium text-green-600">{progression}%</span>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 mb-3">
                            <div className="bg-green-50 p-2 rounded text-center">
                              <p className="text-xs text-gray-500">Objectif</p>
                              <p className="text-lg font-bold text-gray-900">{obj.poids_attendue} kg</p>
                            </div>
                            <div className="bg-blue-50 p-2 rounded text-center">
                              <p className="text-xs text-gray-500">Collecté</p>
                              <p className="text-lg font-bold text-green-600">{obj.poids_collecte_actuel || 0} kg</p>
                            </div>
                            <div className="bg-orange-50 p-2 rounded text-center">
                              <p className="text-xs text-gray-500">Reste</p>
                              <p className="text-lg font-bold text-orange-600">{reste.toFixed(1)} kg</p>
                            </div>
                          </div>
                          
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"
                              style={{ width: `${progression}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {pointsDetails.filter(p => p.poids_collecte > 0).length > 0 ? (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-4">Points de collecte actifs</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {pointsDetails
                        .filter(point => point.poids_collecte > 0)
                        .sort((a, b) => b.poids_collecte - a.poids_collecte)
                        .map((point, idx) => (
                          <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{point.point_nom}</p>
                                <p className="text-sm text-gray-500">{point.commune} - {point.quartier}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {point.nombre_missions || 1} mission(s)
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-bold text-green-600">{point.poids_collecte} kg</p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        Total: <span className="font-bold text-green-600">
                          {pointsDetails.filter(p => p.poids_collecte > 0).reduce((acc, p) => acc + p.poids_collecte, 0)} kg
                        </span> sur {pointsDetails.filter(p => p.poids_collecte > 0).length} point(s)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Aucun point de collecte actif pour cette campagne</p>
                    <p className="text-xs text-gray-400 mt-1">Les collectes apparaîtront quand des déchets seront déposés</p>
                  </div>
                )}

                <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-4 text-white">
                  <h3 className="font-medium mb-3">Impact environnemental estimé</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs opacity-90">CO₂ évité</p>
                      <p className="text-lg font-bold">{(selectedCampagne.poids_collecte_actuel * 0.5).toFixed(1)} kg</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-90">Arbres sauvés</p>
                      <p className="text-lg font-bold">{Math.floor(selectedCampagne.poids_collecte_actuel / 100)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    onClick={() => setShowDetailsModal(false)}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de déconnexion */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition-all">
            <div className="p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut size={32} className="text-red-600" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                Déconnexion
              </h3>
              
              <p className="text-gray-600 text-center mb-6">
                Êtes-vous sûr de vouloir vous déconnecter ?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut size={18} />
                  Se déconnecter
                </button>
              </div>

              <button
                onClick={() => setShowLogoutModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardONG;