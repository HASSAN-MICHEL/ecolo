


// // pages/Sponsor/DashboardSponsor.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   TrendingUp, DollarSign, Package, Map, Calendar,
//   Download, Eye, Filter, RefreshCw, Award,
//   Target, BarChart3, PieChart, Clock, CheckCircle,
//   XCircle, Users, Building, Plus, Search, Zap, X,
//   Menu, LogOut, Home, BarChart, Settings, HelpCircle,
//   Mail, Phone, MapPin, Edit, Save, Camera
// } from 'lucide-react';
// import toast from 'react-hot-toast';

// const DashboardSponsor = () => {
//   const navigate = useNavigate();
  
//   // États existants
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [user, setUser] = useState(null);
//   const [campagnes, setCampagnes] = useState([]);
//   const [stats, setStats] = useState({
//     totalCampagnes: 0,
//     campagnesActives: 0,
//     campagnesTerminees: 0,
//     budgetTotal: 0,
//     montantUtilise: 0,
//     poidsTotalCollecte: 0,
//     poidsTotalAttendu: 0
//   });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCampagne, setSelectedCampagne] = useState(null);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [campagneDetails, setCampagneDetails] = useState(null);
//   const [pointsDetails, setPointsDetails] = useState([]);
//   const [evolutionJournaliere, setEvolutionJournaliere] = useState([]);
//   const [loadingDetails, setLoadingDetails] = useState(false);
  
//   // États pour la navigation et modals
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [showLogoutModal, setShowLogoutModal] = useState(false);
//   const [currentPage, setCurrentPage] = useState('dashboard');
//   const [editingProfile, setEditingProfile] = useState(false);
//   const [profileForm, setProfileForm] = useState({});
//   const [evolutionData, setEvolutionData] = useState([]);

//   const API_URL = 'http://localhost:3000';
//   const STORAGE_KEYS = {
//     TOKEN: 'ecocollect_token',
//     USER: 'ecocollect_user',
//     ROLE: 'ecocollect_role'
//   };

//   const getToken = () => localStorage.getItem(STORAGE_KEYS.TOKEN);

//   // Charger le profil depuis le serveur
//   const loadUserProfile = async () => {
//     const token = getToken();
//     try {
//       const response = await fetch(`${API_URL}/api/sponsors/profil`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       const data = await response.json();
      
//       if (data.success) {
//         // Mapper les données de la BDD vers le format attendu
//         const userData = {
//           id: data.utilisateur?.id,
//           email: data.utilisateur?.email,
//           telephone: data.utilisateur?.telephone,
//           nomOrganisation: data.utilisateur?.nom_organisation,
//           typeOrganisation: data.utilisateur?.type_organisation,
//           nomResponsable: data.utilisateur?.nom_responsable,
//           adresse: data.utilisateur?.adresse,
//           photoLogoUrl: data.utilisateur?.photo_logo_url
//         };
        
//         setUser(userData);
//         setProfileForm(userData);
//         // Mettre à jour le localStorage
//         localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
//       }
//     } catch (error) {
//       console.error('Erreur chargement profil:', error);
//     }
//   };

//   useEffect(() => {
//     // Charger d'abord depuis le localStorage
//     const userData = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
//     setUser(userData);
//     setProfileForm(userData);
    
//     // Puis charger depuis le serveur pour être à jour
//     loadUserProfile();
//     loadDashboard();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem(STORAGE_KEYS.TOKEN);
//     localStorage.removeItem(STORAGE_KEYS.USER);
//     localStorage.removeItem(STORAGE_KEYS.ROLE);
//     toast.success('Déconnexion réussie');
//     navigate('/login');
//   };

//   const loadDashboard = async () => {
//     const token = getToken();
//     setLoading(true);

//     try {
//       const response = await fetch(`${API_URL}/api/sponsors/campagnes`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       const data = await response.json();

//       if (data.success) {
//         setCampagnes(data.campagnes || []);
        
//         // Générer des données d'évolution simulées puisque l'API n'existe pas
//         const mockEvolutionData = generateMockEvolutionData(data.campagnes || []);
//         setEvolutionData(mockEvolutionData);

//         const statsCalc = (data.campagnes || []).reduce((acc, c) => {
//           acc.totalCampagnes++;
//           if (c.statut === 'active') acc.campagnesActives++;
//           if (c.statut === 'terminee') acc.campagnesTerminees++;
//           acc.budgetTotal += parseFloat(c.budget_total || 0);
//           acc.montantUtilise += parseFloat(c.montant_utilise || 0);
//           acc.poidsTotalCollecte += parseFloat(c.poids_collecte_actuel || 0);
//           acc.poidsTotalAttendu += parseFloat(c.poids_attendue || 0);
//           return acc;
//         }, {
//           totalCampagnes: 0,
//           campagnesActives: 0,
//           campagnesTerminees: 0,
//           budgetTotal: 0,
//           montantUtilise: 0,
//           poidsTotalCollecte: 0,
//           poidsTotalAttendu: 0
//         });

//         setStats(statsCalc);
//       }
//     } catch (error) {
//       console.error('Erreur chargement dashboard:', error);
//       toast.error('Erreur lors du chargement des données');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fonction pour générer des données d'évolution simulées
//   const generateMockEvolutionData = (campagnes) => {
//     const today = new Date();
//     const mockData = [];
    
//     // Générer des données pour les 7 derniers jours
//     for (let i = 6; i >= 0; i--) {
//       const date = new Date(today);
//       date.setDate(date.getDate() - i);
      
//       // Calculer un poids total basé sur les campagnes existantes
//       const poidsTotal = campagnes.reduce((sum, c) => {
//         // Simuler une progression réaliste
//         const basePoids = (c.poids_collecte_actuel || 0) / 7; // Moyenne par jour
//         const variation = Math.random() * 20 - 10; // Variation entre -10 et +10
//         return sum + Math.max(0, basePoids + variation);
//       }, 0);
      
//       mockData.push({
//         jour: date.toISOString().split('T')[0],
//         poids_total: Math.round(poidsTotal * 10) / 10,
//         nombre_missions: Math.floor(Math.random() * 8) + 2,
//         points_actifs: Math.floor(Math.random() * 5) + 1,
//         gains_total: Math.round(poidsTotal * 100) // 100 FCFA/kg
//       });
//     }
    
//     return mockData;
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
//         // Générer des données d'évolution simulées pour cette campagne
//         const mockEvolution = generateMockEvolutionData([data.campagne]);
//         setEvolutionJournaliere(mockEvolution);
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
//     await loadUserProfile(); // Recharger le profil
//     setRefreshing(false);
//     toast.success('Données actualisées');
//   };

//   const handleViewDetails = (campagne) => {
//     setSelectedCampagne(campagne);
//     loadCampagneDetails(campagne.id);
//     setShowDetailsModal(true);
//   };

//   const handleProfileUpdate = async () => {
//     const token = getToken();
//     try {
//       const response = await fetch(`${API_URL}/api/sponsors/profil`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(profileForm)
//       });
//       const data = await response.json();
      
//       if (data.success) {
//         // Mettre à jour l'état user
//         setUser(profileForm);
//         // Mettre à jour le localStorage
//         localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profileForm));
//         setEditingProfile(false);
//         toast.success('Profil mis à jour avec succès');
        
//         // Recharger depuis le serveur pour confirmer
//         await loadUserProfile();
//       }
//     } catch (error) {
//       console.error('Erreur mise à jour profil:', error);
//       toast.error('Erreur lors de la mise à jour du profil');
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
//       'organique': 'Organique'
//     };
//     return labels[type] || type;
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('fr-FR', {
//       style: 'currency',
//       currency: 'XOF',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(amount).replace('XOF', 'FCFA');
//   };

//   // Composant pour le graphique en zigzag
//   const ZigzagChart = ({ data }) => {
//     if (!data || data.length === 0) return null;
    
//     const maxValue = Math.max(...data.map(d => d.poids_total));
//     const minValue = Math.min(...data.map(d => d.poids_total));
//     const height = 200;
//     const width = 800;
    
//     const points = data.map((d, i) => {
//       const x = (i / (data.length - 1)) * width;
//       const y = height - ((d.poids_total - minValue) / (maxValue - minValue || 1)) * height;
//       return `${x},${y}`;
//     }).join(' ');

//     return (
//       <div className="relative">
//         <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
//           {/* Ligne de fond */}
//           <polyline
//             points={points}
//             fill="none"
//             stroke="#3b82f6"
//             strokeWidth="3"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             className="drop-shadow-lg"
//           />
          
//           {/* Points */}
//           {data.map((d, i) => {
//             const x = (i / (data.length - 1)) * width;
//             const y = height - ((d.poids_total - minValue) / (maxValue - minValue || 1)) * height;
//             return (
//               <g key={i}>
//                 <circle
//                   cx={x}
//                   cy={y}
//                   r="6"
//                   fill="#3b82f6"
//                   className="cursor-pointer hover:r-8 transition-all"
//                 />
//                 <circle
//                   cx={x}
//                   cy={y}
//                   r="8"
//                   fill="none"
//                   stroke="#3b82f6"
//                   strokeWidth="2"
//                   strokeOpacity="0.3"
//                 />
//                 <title>{`${new Date(d.jour).toLocaleDateString()}: ${d.poids_total} kg`}</title>
//               </g>
//             );
//           })}
//         </svg>
        
//         {/* Légende */}
//         <div className="flex justify-between mt-4 text-sm text-gray-600">
//           {data.map((d, i) => (
//             <div key={i} className="text-center">
//               <div>{new Date(d.jour).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   // Fonction d'export PDF
//   const handleExportRapport = (campagne) => {
//     const contenuHTML = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="UTF-8">
//         <title>Rapport - ${campagne.nom}</title>
//         <style>
//           body { font-family: Arial, sans-serif; margin: 20px; }
//           h1 { color: #2563eb; }
//           h2 { color: #1f2937; margin-top: 20px; }
//           table { width: 100%; border-collapse: collapse; margin: 10px 0; }
//           th { background: #2563eb; color: white; padding: 8px; text-align: left; }
//           td { padding: 8px; border-bottom: 1px solid #e5e7eb; }
//           .total { font-weight: bold; background: #f3f4f6; }
//           .header { background: #eff6ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
//         </style>
//       </head>
//       <body>
//         <div class="header">
//           <h1>Rapport de campagne</h1>
//           <p><strong>Campagne:</strong> ${campagne.nom}</p>
//           <p><strong>Période:</strong> ${new Date(campagne.date_debut).toLocaleDateString()} - ${new Date(campagne.date_fin).toLocaleDateString()}</p>
//           <p><strong>Statut:</strong> ${campagne.statut}</p>
//           <p><strong>Date de génération:</strong> ${new Date().toLocaleString()}</p>
//         </div>

//         <h2>Objectifs par type de déchet</h2>
//         <table>
//           <thead>
//             <tr>
//               <th>Type</th>
//               <th>Objectif (kg)</th>
//               <th>Collecté (kg)</th>
//               <th>Reste (kg)</th>
//               <th>Progression</th>
//               <th>Prix/kg</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${campagneDetails?.objectifs?.map(obj => {
//               const progression = obj.poids_attendue ? ((obj.poids_collecte_actuel || 0) / obj.poids_attendue * 100).toFixed(1) : 0;
//               return `
//                 <tr>
//                   <td>${getTypeLabel(obj.type_dechet)}</td>
//                   <td>${obj.poids_attendue}</td>
//                   <td>${obj.poids_collecte_actuel || 0}</td>
//                   <td>${(obj.poids_attendue - (obj.poids_collecte_actuel || 0)).toFixed(1)}</td>
//                   <td>${progression}%</td>
//                   <td>${obj.prix_par_kg} FCFA</td>
//                 </tr>
//               `;
//             }).join('')}
//             <tr class="total">
//               <td><strong>TOTAL</strong></td>
//               <td><strong>${campagne.poids_attendue}</strong></td>
//               <td><strong>${campagne.poids_collecte_actuel || 0}</strong></td>
//               <td><strong>${(campagne.poids_attendue - (campagne.poids_collecte_actuel || 0)).toFixed(1)}</strong></td>
//               <td><strong>${campagne.poids_attendue ? ((campagne.poids_collecte_actuel || 0) / campagne.poids_attendue * 100).toFixed(1) : 0}%</strong></td>
//               <td></td>
//             </tr>
//           </tbody>
//         </table>

//         <h2>Points de collecte actifs</h2>
//         <table>
//           <thead>
//             <tr>
//               <th>Point</th>
//               <th>Localisation</th>
//               <th>Poids collecté (kg)</th>
//               <th>Contribution</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${pointsDetails.filter(p => p.poids_collecte > 0).map(point => `
//               <tr>
//                 <td>${point.point_nom}</td>
//                 <td>${point.commune} - ${point.quartier}</td>
//                 <td>${point.poids_collecte}</td>
//                 <td>${campagne.poids_collecte_actuel > 0 ? ((point.poids_collecte / campagne.poids_collecte_actuel) * 100).toFixed(1) : 0}%</td>
//               </tr>
//             `).join('')}
//             <tr class="total">
//               <td colspan="2"><strong>TOTAL</strong></td>
//               <td><strong>${pointsDetails.filter(p => p.poids_collecte > 0).reduce((acc, p) => acc + p.poids_collecte, 0)} kg</strong></td>
//               <td><strong>100%</strong></td>
//             </tr>
//           </tbody>
//         </table>

//         <h2>Évolution journalière</h2>
//         <table>
//           <thead>
//             <tr>
//               <th>Date</th>
//               <th>Missions</th>
//               <th>Points actifs</th>
//               <th>Poids collecté (kg)</th>
//               <th>Gains (FCFA)</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${evolutionJournaliere.map(jour => `
//               <tr>
//                 <td>${new Date(jour.jour).toLocaleDateString()}</td>
//                 <td>${jour.nombre_missions}</td>
//                 <td>${jour.points_actifs}</td>
//                 <td>${jour.poids_total}</td>
//                 <td>${formatCurrency(jour.gains_total)}</td>
//               </tr>
//             `).join('')}
//           </tbody>
//         </table>

//         <h2>Impact environnemental</h2>
//         <table>
//           <thead>
//             <tr>
//               <th>Indicateur</th>
//               <th>Valeur</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td>CO₂ évité</td>
//               <td>${(campagne.poids_collecte_actuel * 0.5).toFixed(1)} kg</td>
//             </tr>
//             <tr>
//               <td>Arbres sauvés</td>
//               <td>${Math.floor(campagne.poids_collecte_actuel / 100)}</td>
//             </tr>
//           </tbody>
//         </table>

//         <p style="text-align: center; margin-top: 30px; color: #6b7280;">
//           Rapport généré automatiquement - EcoCollect
//         </p>
//       </body>
//       </html>
//     `;

//     // Créer un blob et télécharger
//     const blob = new Blob([contenuHTML], { type: 'text/html' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `rapport_${campagne.nom.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     window.URL.revokeObjectURL(url);
    
//     toast.success('Rapport généré avec succès !');
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
//           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Chargement de votre tableau de bord...</p>
//         </div>
//       </div>
//     );
//   }

//   // Rendu du contenu en fonction de la page
//   const renderContent = () => {
//     switch(currentPage) {
//       case 'dashboard':
//         return (
//           <>
//             {/* Statistiques globales */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//               <div className="bg-white rounded-xl shadow-lg p-6">
//                 <div className="flex items-center justify-between mb-2">
//                   <Target className="h-8 w-8 text-blue-600" />
//                   <span className="text-2xl font-bold text-gray-900">{stats.totalCampagnes}</span>
//                 </div>
//                 <p className="text-sm text-gray-600">Total campagnes</p>
//                 <div className="mt-2 flex gap-2 text-xs">
//                   <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
//                     {stats.campagnesActives} actives
//                   </span>
//                   <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
//                     {stats.campagnesTerminees} terminées
//                   </span>
//                 </div>
//               </div>

//               <div className="bg-white rounded-xl shadow-lg p-6">
//                 <div className="flex items-center justify-between mb-2">
//                   <Package className="h-8 w-8 text-green-600" />
//                   <span className="text-2xl font-bold text-gray-900">
//                     {stats.poidsTotalCollecte.toFixed(1)} kg
//                   </span>
//                 </div>
//                 <p className="text-sm text-gray-600">Déchets collectés</p>
//                 <p className="text-xs text-gray-500 mt-2">
//                   Objectif: {stats.poidsTotalAttendu.toFixed(1)} kg
//                 </p>
//               </div>

//               <div className="bg-white rounded-xl shadow-lg p-6">
//                 <div className="flex items-center justify-between mb-2">
//                   <DollarSign className="h-8 w-8 text-orange-600" />
//                   <span className="text-2xl font-bold text-gray-900">
//                     {formatCurrency(stats.montantUtilise)}
//                   </span>
//                 </div>
//                 <p className="text-sm text-gray-600">Fonds utilisés</p>
//                 <p className="text-xs text-gray-500 mt-2">
//                   Budget total: {formatCurrency(stats.budgetTotal)}
//                 </p>
//               </div>

//               <div className="bg-white rounded-xl shadow-lg p-6">
//                 <div className="flex items-center justify-between mb-2">
//                   <Map className="h-8 w-8 text-purple-600" />
//                   <span className="text-2xl font-bold text-gray-900">
//                     {campagnes.reduce((acc, c) => acc + (c.zones_intervention?.length || 0), 0)}
//                   </span>
//                 </div>
//                 <p className="text-sm text-gray-600">Zones couvertes</p>
//                 <p className="text-xs text-gray-500 mt-2">
//                   {campagnes.length} campagne(s)
//                 </p>
//               </div>
//             </div>

//             {/* Évolution des campagnes */}
//             {evolutionData.length > 0 && (
//               <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
//                 <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
//                   <TrendingUp className="h-5 w-5 text-blue-600" />
//                   Évolution comparative des campagnes
//                 </h2>
//                 <ZigzagChart data={evolutionData} />
//               </div>
//             )}

//             {/* Recherche */}
//             <div className="mb-6">
//               <div className="relative">
//                 <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder="Rechercher une campagne..."
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
//                 />
//               </div>
//             </div>

//             {/* Liste des campagnes */}
//             {filteredCampagnes.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {filteredCampagnes.map((campagne) => {
//                   const progression = campagne.poids_attendue ? 
//                     ((campagne.poids_collecte_actuel || 0) / campagne.poids_attendue * 100).toFixed(1) : 0;
                  
//                   return (
//                     <div key={campagne.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
//                       <div className="flex justify-between items-start mb-3">
//                         <div>
//                           <h3 className="font-bold text-gray-900 text-lg">{campagne.nom}</h3>
//                           {campagne.description && (
//                             <p className="text-sm text-gray-500 mt-1">{campagne.description}</p>
//                           )}
//                         </div>
//                         {getStatusBadge(campagne.statut)}
//                       </div>

//                       {/* Types de déchets */}
//                       <div className="flex flex-wrap gap-1 mb-3">
//                         {campagne.types_dechets?.map((type, idx) => (
//                           <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
//                             {getTypeLabel(type)}
//                           </span>
//                         ))}
//                       </div>

//                       {/* Barre de progression */}
//                       <div className="mb-3">
//                         <div className="flex justify-between text-sm mb-1">
//                           <span className="text-gray-600">Progression</span>
//                           <span className="font-medium text-blue-600">{progression}%</span>
//                         </div>
//                         <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//                           <div 
//                             className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
//                             style={{ width: `${progression}%` }}
//                           />
//                         </div>
//                       </div>

//                       {/* Statistiques */}
//                       <div className="grid grid-cols-2 gap-3 mb-4">
//                         <div className="bg-gray-50 p-2 rounded-lg">
//                           <p className="text-xs text-gray-500">Collecté</p>
//                           <p className="font-bold text-green-600">{campagne.poids_collecte_actuel || 0} kg</p>
//                         </div>
//                         <div className="bg-gray-50 p-2 rounded-lg">
//                           <p className="text-xs text-gray-500">Objectif</p>
//                           <p className="font-bold text-gray-900">{campagne.poids_attendue} kg</p>
//                         </div>
//                         <div className="bg-gray-50 p-2 rounded-lg">
//                           <p className="text-xs text-gray-500">Budget</p>
//                           <p className="font-bold text-orange-600">{formatCurrency(campagne.budget_total || 0)}</p>
//                         </div>
//                         <div className="bg-gray-50 p-2 rounded-lg">
//                           <p className="text-xs text-gray-500">Utilisé</p>
//                           <p className="font-bold text-orange-600">{formatCurrency(campagne.montant_utilise || 0)}</p>
//                         </div>
//                       </div>

//                       {/* Période */}
//                       <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
//                         <Calendar size={16} />
//                         <span>
//                           {new Date(campagne.date_debut).toLocaleDateString()} - {new Date(campagne.date_fin).toLocaleDateString()}
//                         </span>
//                       </div>

//                       {/* Boutons d'action */}
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => handleViewDetails(campagne)}
//                           className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
//                         >
//                           <Eye size={16} />
//                           Détails
//                         </button>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             ) : (
//               <div className="bg-white rounded-xl shadow-lg p-12 text-center">
//                 <Target size={48} className="mx-auto mb-4 text-gray-300" />
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune campagne trouvée</h3>
//                 <p className="text-gray-600">
//                   Vous ne participez encore à aucune campagne
//                 </p>
//               </div>
//             )}
//           </>
//         );

//       case 'campagnes':
//         return (
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">Toutes mes campagnes</h2>
//             <div className="space-y-4">
//               {campagnes.map((campagne) => (
//                 <div key={campagne.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <h3 className="font-semibold text-lg">{campagne.nom}</h3>
//                       <p className="text-sm text-gray-600">{campagne.description}</p>
//                       <div className="flex gap-4 mt-2">
//                         <span className="text-xs text-gray-500">
//                           Début: {new Date(campagne.date_debut).toLocaleDateString()}
//                         </span>
//                         <span className="text-xs text-gray-500">
//                           Fin: {new Date(campagne.date_fin).toLocaleDateString()}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       {getStatusBadge(campagne.statut)}
//                       <button
//                         onClick={() => handleViewDetails(campagne)}
//                         className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
//                       >
//                         Détails
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         );

//       case 'statistiques':
//         return (
//           <div className="space-y-6">
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">Évolution comparative</h2>
//               {evolutionData.length > 0 ? (
//                 <>
//                   <p className="text-gray-600 mb-4">
//                     Évolution des collectes sur les 7 derniers jours
//                   </p>
//                   <ZigzagChart data={evolutionData} />
//                 </>
//               ) : (
//                 <p className="text-gray-500 text-center py-8">
//                   Aucune donnée d'évolution disponible
//                 </p>
//               )}
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="bg-white rounded-xl shadow-lg p-6">
//                 <h3 className="font-semibold text-gray-900 mb-4">Statistiques globales</h3>
//                 <div className="space-y-3">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Taux de réussite moyen</span>
//                     <span className="font-bold text-blue-600">
//                       {stats.poidsTotalAttendu > 0 
//                         ? ((stats.poidsTotalCollecte / stats.poidsTotalAttendu) * 100).toFixed(1)
//                         : 0}%
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Budget utilisé / total</span>
//                     <span className="font-bold text-green-600">
//                       {stats.budgetTotal > 0 
//                         ? ((stats.montantUtilise / stats.budgetTotal) * 100).toFixed(1)
//                         : 0}%
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Campagnes actives</span>
//                     <span className="font-bold text-purple-600">{stats.campagnesActives}</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white rounded-xl shadow-lg p-6">
//                 <h3 className="font-semibold text-gray-900 mb-4">Performance par campagne</h3>
//                 <div className="space-y-3 max-h-80 overflow-y-auto">
//                   {campagnes.map(c => (
//                     <div key={c.id} className="border-b border-gray-100 pb-2">
//                       <div className="flex justify-between items-center mb-1">
//                         <span className="text-sm font-medium">{c.nom}</span>
//                         <span className="text-sm text-gray-600">
//                           {c.poids_attendue ? ((c.poids_collecte_actuel || 0) / c.poids_attendue * 100).toFixed(1) : 0}%
//                         </span>
//                       </div>
//                       <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
//                         <div 
//                           className="h-full bg-blue-500 rounded-full"
//                           style={{ width: `${c.poids_attendue ? ((c.poids_collecte_actuel || 0) / c.poids_attendue * 100) : 0}%` }}
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       case 'parametres':
//         return (
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold text-gray-900">Mon Profil</h2>
//               <button
//                 onClick={() => setEditingProfile(!editingProfile)}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
//               >
//                 {editingProfile ? <Save size={18} /> : <Edit size={18} />}
//                 {editingProfile ? 'Sauvegarder' : 'Modifier le profil'}
//               </button>
//             </div>

//             <div className="space-y-6">
//               {/* Avatar */}
//               <div className="flex items-center gap-6">
//                 <div className="relative">
//                   <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
//                     {user?.nomOrganisation?.charAt(0) || 'S'}
//                   </div>
//                   {editingProfile && (
//                     <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200">
//                       <Camera size={16} className="text-gray-600" />
//                     </button>
//                   )}
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-semibold">{user?.nomOrganisation}</h3>
//                   <p className="text-gray-600">{user?.typeOrganisation || 'Organisation'}</p>
//                 </div>
//               </div>

//               {/* Formulaire */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//                   <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
//                     <Mail size={18} className="text-gray-400" />
//                     {editingProfile ? (
//                       <input
//                         type="email"
//                         value={profileForm.email || ''}
//                         onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
//                         className="flex-1 bg-transparent border-none focus:ring-0"
//                       />
//                     ) : (
//                       <span className="flex-1">{user?.email || 'Non renseigné'}</span>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
//                   <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
//                     <Phone size={18} className="text-gray-400" />
//                     {editingProfile ? (
//                       <input
//                         type="tel"
//                         value={profileForm.telephone || ''}
//                         onChange={(e) => setProfileForm({...profileForm, telephone: e.target.value})}
//                         className="flex-1 bg-transparent border-none focus:ring-0"
//                       />
//                     ) : (
//                       <span className="flex-1">{user?.telephone || 'Non renseigné'}</span>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Nom du responsable</label>
//                   <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
//                     <Users size={18} className="text-gray-400" />
//                     {editingProfile ? (
//                       <input
//                         type="text"
//                         value={profileForm.nomResponsable || ''}
//                         onChange={(e) => setProfileForm({...profileForm, nomResponsable: e.target.value})}
//                         className="flex-1 bg-transparent border-none focus:ring-0"
//                         placeholder="Nom du responsable"
//                       />
//                     ) : (
//                       <span className="flex-1">{user?.nomResponsable || 'Non renseigné'}</span>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
//                   <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
//                     <MapPin size={18} className="text-gray-400" />
//                     {editingProfile ? (
//                       <input
//                         type="text"
//                         value={profileForm.adresse || ''}
//                         onChange={(e) => setProfileForm({...profileForm, adresse: e.target.value})}
//                         className="flex-1 bg-transparent border-none focus:ring-0"
//                       />
//                     ) : (
//                       <span className="flex-1">{user?.adresse || 'Non renseigné'}</span>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {editingProfile && (
//                 <div className="flex justify-end gap-3 pt-4">
//                   <button
//                     onClick={() => {
//                       setEditingProfile(false);
//                       setProfileForm(user);
//                     }}
//                     className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
//                   >
//                     Annuler
//                   </button>
//                   <button
//                     onClick={handleProfileUpdate}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                   >
//                     Sauvegarder
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         );

//       case 'aide':
//         return (
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">Centre d'aide</h2>
            
//             <div className="space-y-8">
//               <section>
//                 <h3 className="text-lg font-semibold text-blue-600 mb-3">Bienvenue dans votre espace Sponsor</h3>
//                 <p className="text-gray-600">
//                   En tant que sponsor, vous pouvez suivre l'évolution des campagnes que vous financez,
//                   consulter des rapports détaillés et mesurer l'impact de vos contributions.
//                 </p>
//               </section>

//               <section>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-3">Fonctionnalités disponibles</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="p-4 bg-blue-50 rounded-lg">
//                     <h4 className="font-medium text-blue-800 mb-2">📊 Tableau de bord</h4>
//                     <p className="text-sm text-gray-600">
//                       Vue d'ensemble de vos campagnes avec des indicateurs clés de performance.
//                     </p>
//                   </div>
                  
//                   <div className="p-4 bg-green-50 rounded-lg">
//                     <h4 className="font-medium text-green-800 mb-2">📈 Statistiques</h4>
//                     <p className="text-sm text-gray-600">
//                       Graphiques d'évolution comparative pour suivre la progression en temps réel.
//                     </p>
//                   </div>
                  
//                   <div className="p-4 bg-purple-50 rounded-lg">
//                     <h4 className="font-medium text-purple-800 mb-2">🎯 Campagnes</h4>
//                     <p className="text-sm text-gray-600">
//                       Liste complète de toutes les campagnes que vous soutenez.
//                     </p>
//                   </div>
                  
//                   <div className="p-4 bg-orange-50 rounded-lg">
//                     <h4 className="font-medium text-orange-800 mb-2">💰 Financements</h4>
//                     <p className="text-sm text-gray-600">
//                       Suivi de votre budget, des montants utilisés et des contributions.
//                     </p>
//                   </div>
                  
//                   <div className="p-4 bg-indigo-50 rounded-lg">
//                     <h4 className="font-medium text-indigo-800 mb-2">📄 Rapports</h4>
//                     <p className="text-sm text-gray-600">
//                       Génération de rapports détaillés pour chaque campagne (format HTML téléchargeable).
//                     </p>
//                   </div>
                  
//                   <div className="p-4 bg-pink-50 rounded-lg">
//                     <h4 className="font-medium text-pink-800 mb-2">⚙️ Paramètres</h4>
//                     <p className="text-sm text-gray-600">
//                       Gestion de votre profil et de vos informations personnelles.
//                     </p>
//                   </div>
//                 </div>
//               </section>

//               <section>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-3">Comment interpréter les données ?</h3>
//                 <div className="space-y-3">
//                   <div className="flex items-start gap-3">
//                     <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//                       <span className="text-blue-600 text-sm">1</span>
//                     </div>
//                     <p className="text-gray-600">
//                       <span className="font-medium">Progression des collectes :</span> La barre de progression montre l'avancement par rapport à l'objectif fixé.
//                     </p>
//                   </div>
//                   <div className="flex items-start gap-3">
//                     <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//                       <span className="text-blue-600 text-sm">2</span>
//                     </div>
//                     <p className="text-gray-600">
//                       <span className="font-medium">Graphique en zigzag :</span> Représente l'évolution quotidienne des collectes. Les pics indiquent les jours de forte activité.
//                     </p>
//                   </div>
//                   <div className="flex items-start gap-3">
//                     <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//                       <span className="text-blue-600 text-sm">3</span>
//                     </div>
//                     <p className="text-gray-600">
//                       <span className="font-medium">Points de collecte :</span> Visualisez la répartition des collectes par point et leur contribution à l'objectif global.
//                     </p>
//                   </div>
//                 </div>
//               </section>

//               <section className="bg-gray-50 p-4 rounded-lg">
//                 <h3 className="font-medium text-gray-900 mb-2">Besoin d'aide supplémentaire ?</h3>
//                 <p className="text-gray-600 mb-3">
//                   Notre équipe est là pour vous accompagner. N'hésitez pas à nous contacter :
//                 </p>
//                 <div className="flex gap-4">
//                   <a href="mailto:support@ecocollect.com" className="text-blue-600 hover:underline">
//                     support@ecocollect.com
//                   </a>
//                   <span className="text-gray-300">|</span>
//                   <a href="tel:+2250708091011" className="text-blue-600 hover:underline">
//                     +225 07 08 09 10 11
//                   </a>
//                 </div>
//               </section>
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* Sidebar */}
//       <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-xl transition-all duration-300 relative flex flex-col`}>
//         <button
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           className="absolute -right-3 top-10 bg-white rounded-full p-1.5 shadow-lg border border-gray-200 hover:bg-gray-50"
//         >
//           <Menu size={16} className="text-gray-600" />
//         </button>

//         <div className="p-4 border-b border-gray-200">
//           <div className="flex items-center gap-2">
//             <Building className="h-8 w-8 text-blue-600 flex-shrink-0" />
//             {sidebarOpen && (
//               <div>
//                 <h2 className="font-bold text-gray-900">EcoCollect</h2>
//                 <p className="text-xs text-blue-600">Sponsor</p>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="p-4 border-b border-gray-200 bg-blue-50">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
//               {user?.nomOrganisation?.charAt(0) || 'S'}
//             </div>
//             {sidebarOpen && (
//               <div className="overflow-hidden">
//                 <p className="font-medium text-gray-900 truncate">{user?.nomOrganisation || 'Sponsor'}</p>
//                 <p className="text-xs text-gray-500 truncate">{user?.email || 'sponsor@exemple.com'}</p>
//               </div>
//             )}
//           </div>
//         </div>

//         <nav className="flex-1 p-4">
//           <ul className="space-y-2">
//             <li>
//               <button
//                 onClick={() => setCurrentPage('dashboard')}
//                 className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
//                   currentPage === 'dashboard' 
//                     ? 'text-blue-600 bg-blue-50' 
//                     : 'text-gray-600 hover:bg-gray-50'
//                 }`}
//               >
//                 <Home size={20} />
//                 {sidebarOpen && <span>Tableau de bord</span>}
//               </button>
//             </li>
//             <li>
//               <button
//                 onClick={() => setCurrentPage('statistiques')}
//                 className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
//                   currentPage === 'statistiques' 
//                     ? 'text-blue-600 bg-blue-50' 
//                     : 'text-gray-600 hover:bg-gray-50'
//                 }`}
//               >
//                 <BarChart size={20} />
//                 {sidebarOpen && <span>Statistiques</span>}
//               </button>
//             </li>
//             <li>
//               <button
//                 onClick={() => setCurrentPage('campagnes')}
//                 className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
//                   currentPage === 'campagnes' 
//                     ? 'text-blue-600 bg-blue-50' 
//                     : 'text-gray-600 hover:bg-gray-50'
//                 }`}
//               >
//                 <Target size={20} />
//                 {sidebarOpen && <span>Campagnes</span>}
//               </button>
//             </li>
//             <li>
//               <button
//                 onClick={() => setCurrentPage('parametres')}
//                 className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
//                   currentPage === 'parametres' 
//                     ? 'text-blue-600 bg-blue-50' 
//                     : 'text-gray-600 hover:bg-gray-50'
//                 }`}
//               >
//                 <Settings size={20} />
//                 {sidebarOpen && <span>Paramètres</span>}
//               </button>
//             </li>
//             <li>
//               <button
//                 onClick={() => setCurrentPage('aide')}
//                 className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
//                   currentPage === 'aide' 
//                     ? 'text-blue-600 bg-blue-50' 
//                     : 'text-gray-600 hover:bg-gray-50'
//                 }`}
//               >
//                 <HelpCircle size={20} />
//                 {sidebarOpen && <span>Aide</span>}
//               </button>
//             </li>
//           </ul>
//         </nav>

//         <div className="p-4 border-t border-gray-200">
//           <button
//             onClick={() => setShowLogoutModal(true)}
//             className="flex items-center gap-3 px-3 py-2 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//           >
//             <LogOut size={20} />
//             {sidebarOpen && <span>Déconnexion</span>}
//           </button>
//         </div>

//         {sidebarOpen && (
//           <div className="p-4 text-xs text-gray-400 text-center border-t border-gray-200">
//             Version 1.0.0
//           </div>
//         )}
//       </div>

//       {/* Contenu principal */}
//       <div className="flex-1">
//         <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
//           <div className="px-4 sm:px-6 lg:px-8 py-4">
//             <div className="flex justify-between items-center">
//               <h1 className="text-xl font-bold text-gray-900">
//                 {currentPage === 'dashboard' && 'Tableau de bord'}
//                 {currentPage === 'statistiques' && 'Statistiques'}
//                 {currentPage === 'campagnes' && 'Mes campagnes'}
//                 {currentPage === 'parametres' && 'Paramètres'}
//                 {currentPage === 'aide' && 'Centre d\'aide'}
//               </h1>
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
//           {renderContent()}
//         </main>
//       </div>

//       {/* Modal de détails */}
//       {showDetailsModal && selectedCampagne && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
//             <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0">
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
//                 <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
//                 <p className="mt-4 text-gray-600">Chargement des détails...</p>
//               </div>
//             ) : (
//               <div className="p-6 space-y-6">
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

//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <h3 className="font-medium text-gray-900 mb-4">Objectifs par type de déchet</h3>
//                   <div className="space-y-4">
//                     {campagneDetails?.objectifs?.map((obj, idx) => {
//                       const progression = obj.poids_attendue ? 
//                         ((obj.poids_collecte_actuel || 0) / obj.poids_attendue * 100).toFixed(1) : 0;
//                       const reste = obj.poids_attendue - (obj.poids_collecte_actuel || 0);
                      
//                       return (
//                         <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
//                           <div className="flex justify-between items-start mb-2">
//                             <div>
//                               <span className="font-medium text-blue-600">{getTypeLabel(obj.type_dechet)}</span>
//                               <span className="ml-2 text-sm text-gray-500">Prix: {obj.prix_par_kg} FCFA/kg</span>
//                             </div>
//                             <span className="text-sm font-medium text-blue-600">{progression}%</span>
//                           </div>
                          
//                           <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
//                             <div>
//                               <span className="text-gray-500">Objectif:</span>
//                               <span className="ml-1 font-medium">{obj.poids_attendue} kg</span>
//                             </div>
//                             <div>
//                               <span className="text-gray-500">Collecté:</span>
//                               <span className="ml-1 font-medium text-green-600">{obj.poids_collecte_actuel || 0} kg</span>
//                             </div>
//                             <div>
//                               <span className="text-gray-500">Reste:</span>
//                               <span className="ml-1 font-medium text-orange-600">{reste.toFixed(1)} kg</span>
//                             </div>
//                           </div>
                          
//                           <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//                             <div 
//                               className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
//                               style={{ width: `${progression}%` }}
//                             />
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>

//                 {pointsDetails.filter(p => p.poids_collecte > 0).length > 0 ? (
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <h3 className="font-medium text-gray-900 mb-4">Points de collecte actifs</h3>
//                     <div className="space-y-3 max-h-60 overflow-y-auto">
//                       {pointsDetails
//                         .filter(point => point.poids_collecte > 0)
//                         .sort((a, b) => b.poids_collecte - a.poids_collecte)
//                         .map((point, idx) => {
//                           const pourcentageCampagne = selectedCampagne.poids_collecte_actuel > 0 
//                             ? ((point.poids_collecte / selectedCampagne.poids_collecte_actuel) * 100).toFixed(1)
//                             : 0;
                          
//                           return (
//                             <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
//                               <div className="flex justify-between items-start mb-2">
//                                 <div>
//                                   <p className="font-medium">{point.point_nom}</p>
//                                   <p className="text-sm text-gray-500">{point.commune} - {point.quartier}</p>
//                                 </div>
//                                 <div className="text-right">
//                                   <p className="text-xl font-bold text-green-600">{point.poids_collecte} kg</p>
//                                   <p className="text-xs text-gray-500">{pourcentageCampagne}% de la collecte</p>
//                                 </div>
//                               </div>
//                               <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
//                                 <div 
//                                   className="h-full bg-blue-500 rounded-full"
//                                   style={{ width: `${pourcentageCampagne}%` }}
//                                 />
//                               </div>
//                             </div>
//                           );
//                         })}
//                     </div>
//                     <div className="mt-4 pt-3 border-t border-gray-200">
//                       <div className="flex justify-between items-center">
//                         <p className="text-sm text-gray-600">
//                           Points actifs: <span className="font-bold">{pointsDetails.filter(p => p.poids_collecte > 0).length}</span>
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           Total: <span className="font-bold text-green-600">
//                             {pointsDetails.filter(p => p.poids_collecte > 0).reduce((acc, p) => acc + p.poids_collecte, 0)} kg
//                           </span>
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="bg-gray-50 p-4 rounded-lg text-center">
//                     <Map className="h-8 w-8 text-gray-300 mx-auto mb-2" />
//                     <p className="text-gray-500">Aucun point de collecte actif pour cette campagne</p>
//                     <p className="text-xs text-gray-400 mt-1">Les collectes apparaîtront quand des déchets seront déposés</p>
//                   </div>
//                 )}

//                 {evolutionJournaliere.length > 0 && (
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <h3 className="font-medium text-gray-900 mb-4">Évolution journalière</h3>
//                     <div className="space-y-3 max-h-60 overflow-y-auto">
//                       {evolutionJournaliere.map((jour, idx) => (
//                         <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
//                           <div className="flex justify-between items-center">
//                             <div>
//                               <p className="font-medium">
//                                 {new Date(jour.jour).toLocaleDateString('fr-FR', {
//                                   weekday: 'long',
//                                   day: 'numeric',
//                                   month: 'long'
//                                 })}
//                               </p>
//                               <p className="text-sm text-gray-500">
//                                 {jour.nombre_missions} mission(s) • {jour.points_actifs} point(s) actif(s)
//                               </p>
//                             </div>
//                             <div className="text-right">
//                               <p className="text-xl font-bold text-green-600">{jour.poids_total} kg</p>
//                               <p className="text-sm text-gray-500">{formatCurrency(jour.gains_total)}</p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 <div className="flex gap-3 justify-end pt-4 border-t">
//                   <button
//                     className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
//                     onClick={() => setShowDetailsModal(false)}
//                   >
//                     Fermer
//                   </button>
//                   <button
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
//                     onClick={() => handleExportRapport(selectedCampagne)}
//                   >
//                     <Download size={16} />
//                     Télécharger le rapport
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

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

// export default DashboardSponsor;



// pages/Sponsor/DashboardSponsor.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, DollarSign, Package, Map, Calendar,
  Download, Eye, Filter, RefreshCw, Award,
  Target, BarChart3, PieChart, Clock, CheckCircle,
  XCircle, Users, Building, Plus, Search, Zap, X,
  Menu, LogOut, Home, BarChart, Settings, HelpCircle,
  Mail, Phone, MapPin, Edit, Save, Camera
} from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardSponsor = () => {
  const navigate = useNavigate();
  
  // États existants
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [campagnes, setCampagnes] = useState([]);
  const [stats, setStats] = useState({
    totalCampagnes: 0,
    campagnesActives: 0,
    campagnesTerminees: 0,
    budgetTotal: 0,
    montantUtilise: 0,
    poidsTotalCollecte: 0,
    poidsTotalAttendu: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampagne, setSelectedCampagne] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [campagneDetails, setCampagneDetails] = useState(null);
  const [pointsDetails, setPointsDetails] = useState([]);
  const [evolutionJournaliere, setEvolutionJournaliere] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  // États pour la navigation et modals
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  
  // Nouvel état pour l'évolution mensuelle
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
      const response = await fetch(`${API_URL}/api/sponsors/profil`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        // CORRECTION: Utiliser data.sponsor (pas data.utilisateur)
        const userData = {
          id: data.sponsor?.id,
          email: data.sponsor?.email,
          telephone: data.sponsor?.telephone,
          nomOrganisation: data.sponsor?.nom_organisation,
          typeOrganisation: data.sponsor?.type_organisation,
          nomResponsable: data.sponsor?.nom_responsable,
          adresse: data.sponsor?.adresse,
          photoLogoUrl: data.sponsor?.photo_logo_url
        };
        
        setUser(userData);
        setProfileForm(userData);
        // Mettre à jour le localStorage
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Erreur chargement profil:', error);
    }
  };

  useEffect(() => {
    // Charger d'abord depuis le localStorage
    const userData = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
    setUser(userData);
    setProfileForm(userData);
    
    // Puis charger depuis le serveur pour être à jour
    loadUserProfile();
    loadDashboard();
  }, []);

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
      
      // Compter les campagnes créées ce mois-ci
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

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
    toast.success('Déconnexion réussie');
    navigate('/login');
  };

  const loadDashboard = async () => {
    const token = getToken();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/sponsors/campagnes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.success) {
        setCampagnes(data.campagnes || []);
        
        // Calculer l'évolution mensuelle
        const evolution = calculerEvolutionMensuelle(data.campagnes || []);
        setEvolutionMensuelle(evolution);

        const statsCalc = (data.campagnes || []).reduce((acc, c) => {
          acc.totalCampagnes++;
          if (c.statut === 'active') acc.campagnesActives++;
          if (c.statut === 'terminee') acc.campagnesTerminees++;
          acc.budgetTotal += parseFloat(c.budget_total || 0);
          acc.montantUtilise += parseFloat(c.montant_utilise || 0);
          acc.poidsTotalCollecte += parseFloat(c.poids_collecte_actuel || 0);
          acc.poidsTotalAttendu += parseFloat(c.poids_attendue || 0);
          return acc;
        }, {
          totalCampagnes: 0,
          campagnesActives: 0,
          campagnesTerminees: 0,
          budgetTotal: 0,
          montantUtilise: 0,
          poidsTotalCollecte: 0,
          poidsTotalAttendu: 0
        });

        setStats(statsCalc);
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
        setEvolutionJournaliere([]); // Pas de simulation
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
    await loadUserProfile(); // Recharger le profil
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
      const response = await fetch(`${API_URL}/api/sponsors/profil`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileForm)
      });
      const data = await response.json();
      
      if (data.success) {
        // Mettre à jour l'état user
        setUser(profileForm);
        // Mettre à jour le localStorage
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profileForm));
        setEditingProfile(false);
        toast.success('Profil mis à jour avec succès');
        
        // Recharger depuis le serveur pour confirmer
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('XOF', 'FCFA');
  };

  // Composant pour le graphique en barres (évolution mensuelle)
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
                  <span className="text-sm font-semibold text-blue-600">{item.nombre}</span>
                </div>
                <div 
                  className="w-full bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                  style={{ height: `${barHeight}px` }}
                >
                  <div className="w-full h-full opacity-0 hover:opacity-100 transition-opacity">
                    {/* Tooltip */}
                  </div>
                </div>
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

  // Fonction d'export PDF
  const handleExportRapport = (campagne) => {
    const contenuHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Rapport - ${campagne.nom}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #2563eb; }
          h2 { color: #1f2937; margin-top: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th { background: #2563eb; color: white; padding: 8px; text-align: left; }
          td { padding: 8px; border-bottom: 1px solid #e5e7eb; }
          .total { font-weight: bold; background: #f3f4f6; }
          .header { background: #eff6ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Rapport de campagne</h1>
          <p><strong>Campagne:</strong> ${campagne.nom}</p>
          <p><strong>Période:</strong> ${new Date(campagne.date_debut).toLocaleDateString()} - ${new Date(campagne.date_fin).toLocaleDateString()}</p>
          <p><strong>Statut:</strong> ${campagne.statut}</p>
          <p><strong>Date de génération:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <h2>Objectifs par type de déchet</h2>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Objectif (kg)</th>
              <th>Collecté (kg)</th>
              <th>Reste (kg)</th>
              <th>Progression</th>
              <th>Prix/kg</th>
            </tr>
          </thead>
          <tbody>
            ${campagneDetails?.objectifs?.map(obj => {
              const progression = obj.poids_attendue ? ((obj.poids_collecte_actuel || 0) / obj.poids_attendue * 100).toFixed(1) : 0;
              return `
                <tr>
                  <td>${getTypeLabel(obj.type_dechet)}</td>
                  <td>${obj.poids_attendue}</td>
                  <td>${obj.poids_collecte_actuel || 0}</td>
                  <td>${(obj.poids_attendue - (obj.poids_collecte_actuel || 0)).toFixed(1)}</td>
                  <td>${progression}%</td>
                  <td>${obj.prix_par_kg} FCFA</td>
                </tr>
              `;
            }).join('')}
            <tr class="total">
              <td><strong>TOTAL</strong></td>
              <td><strong>${campagne.poids_attendue}</strong></td>
              <td><strong>${campagne.poids_collecte_actuel || 0}</strong></td>
              <td><strong>${(campagne.poids_attendue - (campagne.poids_collecte_actuel || 0)).toFixed(1)}</strong></td>
              <td><strong>${campagne.poids_attendue ? ((campagne.poids_collecte_actuel || 0) / campagne.poids_attendue * 100).toFixed(1) : 0}%</strong></td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <h2>Points de collecte actifs</h2>
        <table>
          <thead>
            <tr>
              <th>Point</th>
              <th>Localisation</th>
              <th>Poids collecté (kg)</th>
              <th>Contribution</th>
            </tr>
          </thead>
          <tbody>
            ${pointsDetails.filter(p => p.poids_collecte > 0).map(point => `
              <tr>
                <td>${point.point_nom}</td>
                <td>${point.commune} - ${point.quartier}</td>
                <td>${point.poids_collecte}</td>
                <td>${campagne.poids_collecte_actuel > 0 ? ((point.poids_collecte / campagne.poids_collecte_actuel) * 100).toFixed(1) : 0}%</td>
              </tr>
            `).join('')}
            <tr class="total">
              <td colspan="2"><strong>TOTAL</strong></td>
              <td><strong>${pointsDetails.filter(p => p.poids_collecte > 0).reduce((acc, p) => acc + p.poids_collecte, 0)} kg</strong></td>
              <td><strong>100%</strong></td>
            </tr>
          </tbody>
        </table>

        <p style="text-align: center; margin-top: 30px; color: #6b7280;">
          Rapport généré automatiquement - EcoCollect
        </p>
      </body>
      </html>
    `;

    // Créer un blob et télécharger
    const blob = new Blob([contenuHTML], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport_${campagne.nom.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('Rapport généré avec succès !');
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
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre tableau de bord...</p>
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
                  <Target className="h-8 w-8 text-blue-600" />
                  <span className="text-2xl font-bold text-gray-900">{stats.totalCampagnes}</span>
                </div>
                <p className="text-sm text-gray-600">Total campagnes</p>
                <div className="mt-2 flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    {stats.campagnesActives} actives
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {stats.campagnesTerminees} terminées
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <Package className="h-8 w-8 text-green-600" />
                  <span className="text-2xl font-bold text-gray-900">
                    {stats.poidsTotalCollecte.toFixed(1)} kg
                  </span>
                </div>
                <p className="text-sm text-gray-600">Déchets collectés</p>
                <p className="text-xs text-gray-500 mt-2">
                  Objectif: {stats.poidsTotalAttendu.toFixed(1)} kg
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="h-8 w-8 text-orange-600" />
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.montantUtilise)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Fonds utilisés</p>
                <p className="text-xs text-gray-500 mt-2">
                  Budget total: {formatCurrency(stats.budgetTotal)}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <Map className="h-8 w-8 text-purple-600" />
                  <span className="text-2xl font-bold text-gray-900">
                    {campagnes.reduce((acc, c) => acc + (c.zones_intervention?.length || 0), 0)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Zones couvertes</p>
                <p className="text-xs text-gray-500 mt-2">
                  {campagnes.length} campagne(s)
                </p>
              </div>
            </div>

            {/* Évolution mensuelle des campagnes */}
            {evolutionMensuelle.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Évolution mensuelle des campagnes
                </h2>
                <BarChart data={evolutionMensuelle} />
              </div>
            )}

            {/* Recherche */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher une campagne..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
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
                          <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {getTypeLabel(type)}
                          </span>
                        ))}
                      </div>

                      {/* Barre de progression */}
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Progression</span>
                          <span className="font-medium text-blue-600">{progression}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
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
                        <div className="bg-gray-50 p-2 rounded-lg">
                          <p className="text-xs text-gray-500">Budget</p>
                          <p className="font-bold text-orange-600">{formatCurrency(campagne.budget_total || 0)}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-lg">
                          <p className="text-xs text-gray-500">Utilisé</p>
                          <p className="font-bold text-orange-600">{formatCurrency(campagne.montant_utilise || 0)}</p>
                        </div>
                      </div>

                      {/* Période */}
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <Calendar size={16} />
                        <span>
                          {new Date(campagne.date_debut).toLocaleDateString()} - {new Date(campagne.date_fin).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Boutons d'action */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(campagne)}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                        >
                          <Eye size={16} />
                          Détails
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Target size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune campagne trouvée</h3>
                <p className="text-gray-600">
                  Vous ne participez encore à aucune campagne
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
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
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
                    Nombre de campagnes créées par mois
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
                <h3 className="font-semibold text-gray-900 mb-4">Statistiques globales</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taux de réussite moyen</span>
                    <span className="font-bold text-blue-600">
                      {stats.poidsTotalAttendu > 0 
                        ? ((stats.poidsTotalCollecte / stats.poidsTotalAttendu) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget utilisé / total</span>
                    <span className="font-bold text-green-600">
                      {stats.budgetTotal > 0 
                        ? ((stats.montantUtilise / stats.budgetTotal) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Campagnes actives</span>
                    <span className="font-bold text-purple-600">{stats.campagnesActives}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Performance par campagne</h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {campagnes.map(c => (
                    <div key={c.id} className="border-b border-gray-100 pb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{c.nom}</span>
                        <span className="text-sm text-gray-600">
                          {c.poids_attendue ? ((c.poids_collecte_actuel || 0) / c.poids_attendue * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${c.poids_attendue ? ((c.poids_collecte_actuel || 0) / c.poids_attendue * 100) : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                {editingProfile ? <Save size={18} /> : <Edit size={18} />}
                {editingProfile ? 'Sauvegarder' : 'Modifier le profil'}
              </button>
            </div>

            <div className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {user?.nomOrganisation?.charAt(0) || 'S'}
                  </div>
                  {editingProfile && (
                    <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200">
                      <Camera size={16} className="text-gray-600" />
                    </button>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{user?.nomOrganisation}</h3>
                  <p className="text-gray-600">{user?.typeOrganisation || 'Organisation'}</p>
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
                    <MapPin size={18} className="text-gray-400" />
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
                <h3 className="text-lg font-semibold text-blue-600 mb-3">Bienvenue dans votre espace Sponsor</h3>
                <p className="text-gray-600">
                  En tant que sponsor, vous pouvez suivre l'évolution des campagnes que vous financez,
                  consulter des rapports détaillés et mesurer l'impact de vos contributions.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Fonctionnalités disponibles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">📊 Tableau de bord</h4>
                    <p className="text-sm text-gray-600">
                      Vue d'ensemble de vos campagnes avec des indicateurs clés de performance.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">📈 Statistiques</h4>
                    <p className="text-sm text-gray-600">
                      Graphique d'évolution mensuelle du nombre de campagnes.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-800 mb-2">🎯 Campagnes</h4>
                    <p className="text-sm text-gray-600">
                      Liste complète de toutes les campagnes que vous soutenez.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-800 mb-2">💰 Financements</h4>
                    <p className="text-sm text-gray-600">
                      Suivi de votre budget, des montants utilisés et des contributions.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <h4 className="font-medium text-indigo-800 mb-2">📄 Rapports</h4>
                    <p className="text-sm text-gray-600">
                      Génération de rapports détaillés pour chaque campagne (format HTML téléchargeable).
                    </p>
                  </div>
                  
                  <div className="p-4 bg-pink-50 rounded-lg">
                    <h4 className="font-medium text-pink-800 mb-2">⚙️ Paramètres</h4>
                    <p className="text-sm text-gray-600">
                      Gestion de votre profil et de vos informations personnelles.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Comment interpréter les données ?</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm">1</span>
                    </div>
                    <p className="text-gray-600">
                      <span className="font-medium">Progression des collectes :</span> La barre de progression montre l'avancement par rapport à l'objectif fixé.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm">2</span>
                    </div>
                    <p className="text-gray-600">
                      <span className="font-medium">Évolution mensuelle :</span> Le graphique en barres montre le nombre de campagnes créées chaque mois.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm">3</span>
                    </div>
                    <p className="text-gray-600">
                      <span className="font-medium">Points de collecte :</span> Visualisez la répartition des collectes par point et leur contribution à l'objectif global.
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
                  <a href="mailto:support@ecocollect.com" className="text-blue-600 hover:underline">
                    support@ecocollect.com
                  </a>
                  <span className="text-gray-300">|</span>
                  <a href="tel:+2250708091011" className="text-blue-600 hover:underline">
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
            <Building className="h-8 w-8 text-blue-600 flex-shrink-0" />
            {sidebarOpen && (
              <div>
                <h2 className="font-bold text-gray-900">EcoCollect</h2>
                <p className="text-xs text-blue-600">Sponsor</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              {user?.nomOrganisation?.charAt(0) || 'S'}
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <p className="font-medium text-gray-900 truncate">{user?.nomOrganisation || 'Sponsor'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || 'sponsor@exemple.com'}</p>
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
                    ? 'text-blue-600 bg-blue-50' 
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
                    ? 'text-blue-600 bg-blue-50' 
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
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Target size={20} />
                {sidebarOpen && <span>Campagnes</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('parametres')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  currentPage === 'parametres' 
                    ? 'text-blue-600 bg-blue-50' 
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
                    ? 'text-blue-600 bg-blue-50' 
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
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0">
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
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
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
                  <h3 className="font-medium text-gray-900 mb-4">Objectifs par type de déchet</h3>
                  <div className="space-y-4">
                    {campagneDetails?.objectifs?.map((obj, idx) => {
                      const progression = obj.poids_attendue ? 
                        ((obj.poids_collecte_actuel || 0) / obj.poids_attendue * 100).toFixed(1) : 0;
                      const reste = obj.poids_attendue - (obj.poids_collecte_actuel || 0);
                      
                      return (
                        <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="font-medium text-blue-600">{getTypeLabel(obj.type_dechet)}</span>
                              <span className="ml-2 text-sm text-gray-500">Prix: {obj.prix_par_kg} FCFA/kg</span>
                            </div>
                            <span className="text-sm font-medium text-blue-600">{progression}%</span>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
                            <div>
                              <span className="text-gray-500">Objectif:</span>
                              <span className="ml-1 font-medium">{obj.poids_attendue} kg</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Collecté:</span>
                              <span className="ml-1 font-medium text-green-600">{obj.poids_collecte_actuel || 0} kg</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Reste:</span>
                              <span className="ml-1 font-medium text-orange-600">{reste.toFixed(1)} kg</span>
                            </div>
                          </div>
                          
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
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
                        .map((point, idx) => {
                          const pourcentageCampagne = selectedCampagne.poids_collecte_actuel > 0 
                            ? ((point.poids_collecte / selectedCampagne.poids_collecte_actuel) * 100).toFixed(1)
                            : 0;
                          
                          return (
                            <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p className="font-medium">{point.point_nom}</p>
                                  <p className="text-sm text-gray-500">{point.commune} - {point.quartier}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xl font-bold text-green-600">{point.poids_collecte} kg</p>
                                  <p className="text-xs text-gray-500">{pourcentageCampagne}% de la collecte</p>
                                </div>
                              </div>
                              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-500 rounded-full"
                                  style={{ width: `${pourcentageCampagne}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                          Points actifs: <span className="font-bold">{pointsDetails.filter(p => p.poids_collecte > 0).length}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Total: <span className="font-bold text-green-600">
                            {pointsDetails.filter(p => p.poids_collecte > 0).reduce((acc, p) => acc + p.poids_collecte, 0)} kg
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Map className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Aucun point de collecte actif pour cette campagne</p>
                    <p className="text-xs text-gray-400 mt-1">Les collectes apparaîtront quand des déchets seront déposés</p>
                  </div>
                )}

                <div className="flex gap-3 justify-end pt-4 border-t">
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    onClick={() => setShowDetailsModal(false)}
                  >
                    Fermer
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    onClick={() => handleExportRapport(selectedCampagne)}
                  >
                    <Download size={16} />
                    Télécharger le rapport
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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

export default DashboardSponsor;