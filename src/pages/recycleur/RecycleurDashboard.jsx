

// import React, { useState, useEffect } from 'react';
// import DashboardLayout from '../../Layouts/LayoutDashboard';
// import recycleurService from '../../services/recycleurService';
// import { 
//   FiPackage, FiTrendingUp, FiCheckCircle, FiClock,
//   FiMap, FiCalendar, FiDollarSign, FiFileText, FiRefreshCw,
//   FiBarChart2, FiAward, FiTarget
// } from 'react-icons/fi';
// import { Link } from 'react-router-dom';
// import toast from 'react-hot-toast';

// const RecycleurDashboard = () => {
//   const [dashboard, setDashboard] = useState(null);
//   const [demandes, setDemandes] = useState([]);
//   const [declarations, setDeclarations] = useState([]);
//   const [stocks, setStocks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const userData = JSON.parse(localStorage.getItem('ecocollect_user'));
//     setUser(userData);
//     loadDashboard();
//   }, []);

//   const loadDashboard = async () => {
//     try {
//       setLoading(true);
      
//       // Charger toutes les données en parallèle
//       const [dashboardData, demandesData, stocksData, declarationsData] = await Promise.all([
//         recycleurService.getDashboard().catch(() => ({ dashboard: {} })),
//         recycleurService.getMesDemandes().catch(() => ({ demandes: [] })),
//         recycleurService.getStocks({ limit: 5 }).catch(() => ({ stocks: [] })),
//         recycleurService.getMesDeclarations().catch(() => ({ declarations: [] }))
//       ]);
      
//       setDashboard(dashboardData.dashboard || {});
//       setDemandes(demandesData.demandes || []);
//       setDeclarations(declarationsData.declarations || []);
//       setStocks(stocksData.stocks || []);
//     } catch (error) {
//       console.error('Erreur chargement dashboard:', error);
//       toast.error('Erreur lors du chargement des données');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await loadDashboard();
//     setRefreshing(false);
//     toast.success('Données actualisées');
//   };

//   // ✅ NOUVELLES STATISTIQUES avec poids des demandes validées
//   const statCards = [
//     {
//       title: 'Demandes en attente',
//       value: dashboard?.statsDemandes?.enAttente || 0,
//       icon: FiClock,
//       color: 'bg-yellow-100 text-yellow-600',
//       link: '/recycleur/demandes?statut=en_attente'
//     },
//     {
//       title: 'Demandes validées',
//       value: dashboard?.statsDemandes?.validees || 0,
//       icon: FiCheckCircle,
//       color: 'bg-green-100 text-green-600',
//       link: '/recycleur/demandes?statut=validee'
//     },
//     {
//       title: 'KG validés',
//       value: `${dashboard?.statsDemandes?.kgValides || 0} kg`,
//       icon: FiTarget,
//       color: 'bg-blue-100 text-blue-600',
//       description: 'Poids total des demandes validées'
//     },
//     {
//       title: 'Demandes réalisées',
//       value: dashboard?.statsDemandes?.realisees || 0,
//       icon: FiTrendingUp,
//       color: 'bg-purple-100 text-purple-600',
//       link: '/recycleur/demandes?statut=realisee'
//     },
//     {
//       title: 'KG reçus',
//       value: `${dashboard?.statsDemandes?.kgRecus || 0} kg`,
//       icon: FiPackage,
//       color: 'bg-orange-100 text-orange-600',
//       description: 'Poids réellement reçu'
//     },
//     {
//       title: 'KG recyclés',
//       value: `${dashboard?.recyclage?.total_kg_recycles || 0} kg`,
//       icon: FiMap,
//       color: 'bg-indigo-100 text-indigo-600',
//     },
//   ];

//   // Garder aussi les stats existantes pour la compatibilité
//   const legacyStatCards = [
//     {
//       title: 'Demandes en attente',
//       value: dashboard?.demandes?.demandes_en_attente || 0,
//       icon: FiClock,
//       color: 'bg-yellow-100 text-yellow-600',
//       link: '/recycleur/demandes?statut=en_attente'
//     },
//     {
//       title: 'Demandes acceptées',
//       value: dashboard?.demandes?.demandes_validees || 0,
//       icon: FiCheckCircle,
//       color: 'bg-green-100 text-green-600',
//       link: '/recycleur/demandes?statut=validee'
//     },
//     {
//       title: 'Demandes réalisées',
//       value: dashboard?.demandes?.demandes_realisees || 0,
//       icon: FiTrendingUp,
//       color: 'bg-blue-100 text-blue-600',
//       link: '/recycleur/demandes?statut=realisee'
//     },
//     {
//       title: 'KG reçus',
//       value: `${dashboard?.demandes?.total_kg_recus || 0} kg`,
//       icon: FiPackage,
//       color: 'bg-purple-100 text-purple-600',
//     },
//     {
//       title: 'KG recyclés',
//       value: `${dashboard?.recyclage?.total_kg_recycles || 0} kg`,
//       icon: FiMap,
//       color: 'bg-orange-100 text-orange-600',
//     },
//     {
//       title: 'Points avec stock',
//       value: stocks.length,
//       icon: FiMap,
//       color: 'bg-indigo-100 text-indigo-600',
//     },
//   ];

//   // Utilisez les nouvelles stats si disponibles, sinon les anciennes
//   const cardsToShow = dashboard?.statsDemandes ? statCards : legacyStatCards;

//   const getStatusBadge = (statut) => {
//     const badges = {
//       'en_attente': { color: 'bg-yellow-100 text-yellow-800', label: 'En attente' },
//       'validee': { color: 'bg-green-100 text-green-800', label: 'Validée' },
//       'acceptee': { color: 'bg-green-100 text-green-800', label: 'Acceptée' },
//       'realisee': { color: 'bg-blue-100 text-blue-800', label: 'Réalisée' },
//       'refusee': { color: 'bg-red-100 text-red-800', label: 'Refusée' },
//     };
//     return badges[statut] || badges.en_attente;
//   };

  
//   const styles = `
//     .stats-grid {
//       display: grid;
//       grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
//       gap: 1.5rem;
//       margin-bottom: 2rem;
//     }

//     .stat-card {
//       background: white;
//       border-radius: 1rem;
//       padding: 1.5rem;
//       display: flex;
//       align-items: center;
//       gap: 1rem;
//       box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.05);
//       border: 1px solid #d9e0d9;
//       transition: all 0.3s ease;
//       cursor: pointer;
//       text-decoration: none;
//       color: inherit;
//     }

//     .stat-card:hover {
//       transform: translateY(-4px);
//       box-shadow: 0 8px 30px -8px rgba(45, 138, 94, 0.2);
//     }

//     .stat-icon {
//       width: 3rem;
//       height: 3rem;
//       border-radius: 0.75rem;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: 1.5rem;
//     }

//     .stat-content {
//       flex: 1;
//     }

//     .stat-title {
//       font-size: 0.9rem;
//       color: #5a655a;
//       margin-bottom: 0.25rem;
//     }

//     .stat-value {
//       font-size: 1.8rem;
//       font-weight: 700;
//       color: #1a1e1a;
//     }

//     .section-title {
//       font-size: 1.2rem;
//       font-weight: 600;
//       color: #1a1e1a;
//       margin-bottom: 1rem;
//       display: flex;
//       align-items: center;
//       gap: 0.5rem;
//     }

//     .section-title i {
//       color: #2d8a5e;
//     }

//     .grid-2 {
//       display: grid;
//       grid-template-columns: repeat(2, 1fr);
//       gap: 1.5rem;
//       margin-bottom: 2rem;
//     }

//     .card {
//       background: white;
//       border-radius: 1rem;
//       padding: 1.5rem;
//       border: 1px solid #d9e0d9;
//     }

//     .list-item {
//       padding: 1rem;
//       border-bottom: 1px solid #d9e0d9;
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//     }

//     .list-item:last-child {
//       border-bottom: none;
//     }

//     .item-title {
//       font-weight: 600;
//       color: #1a1e1a;
//     }

//     .item-subtitle {
//       font-size: 0.85rem;
//       color: #5a655a;
//     }

//     .badge {
//       padding: 0.25rem 0.75rem;
//       border-radius: 100px;
//       font-size: 0.75rem;
//       font-weight: 600;
//     }

//     .view-all {
//       text-align: center;
//       margin-top: 1rem;
//       padding-top: 1rem;
//       border-top: 1px solid #d9e0d9;
//     }

//     .view-all a {
//       color: #2d8a5e;
//       text-decoration: none;
//       font-weight: 600;
//       font-size: 0.9rem;
//     }

//     .view-all a:hover {
//       text-decoration: underline;
//     }

//     .empty-state {
//       text-align: center;
//       padding: 2rem;
//       color: #5a655a;
//     }

//     .quick-actions {
//       display: flex;
//       gap: 1rem;
//       margin-bottom: 2rem;
//       flex-wrap: wrap;
//     }

//     .action-btn {
//       background: white;
//       border: 1px solid #d9e0d9;
//       border-radius: 100px;
//       padding: 0.75rem 1.5rem;
//       display: flex;
//       align-items: center;
//       gap: 0.5rem;
//       color: #1a1e1a;
//       text-decoration: none;
//       transition: all 0.3s;
//     }

//     .action-btn:hover {
//       background: #2d8a5e;
//       color: white;
//       border-color: #2d8a5e;
//     }

//     .action-btn:hover i {
//       color: white;
//     }

//     @media (max-width: 768px) {
//       .grid-2 {
//         grid-template-columns: 1fr;
//       }
//     }
//   `;


//   if (loading) {
//     return (
//       <DashboardLayout title="Dashboard Recycleur" user={user}>
//         <div style={{ textAlign: 'center', padding: '3rem' }}>
//           <div className="spinner" style={{ margin: '0 auto' }}></div>
//           <p style={{ marginTop: '1rem', color: '#5a655a' }}>Chargement du tableau de bord...</p>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <>
//       <style>{styles}</style>
//       <DashboardLayout title="Dashboard Recycleur" user={user}>
//         <div className="dashboard-container">
//           {/* En-tête avec bouton d'actualisation */}
//           <div className="header-actions">
//             <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a1e1a' }}>
//               Tableau de bord
//             </h1>
//             <button 
//               className={`refresh-btn ${refreshing ? 'spinning' : ''}`}
//               onClick={handleRefresh}
//               disabled={refreshing}
//             >
//               <FiRefreshCw className={refreshing ? 'fa-spin' : ''} />
//               Actualiser
//             </button>
//           </div>

//           {/* Résumé des statistiques de demandes */}
//           {dashboard?.statsDemandes && (
//             <div className="summary-card" style={{
//               background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//               color: 'white',
//               padding: '1.5rem',
//               borderRadius: '1rem',
//               marginBottom: '2rem'
//             }}>
//               <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//                 <FiBarChart2 /> Bilan des demandes
//               </h3>
//               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
//                 <div>
//                   <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total demandes</div>
//                   <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{dashboard.statsDemandes.total}</div>
//                 </div>
//                 <div>
//                   <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>KG validés</div>
//                   <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{dashboard.statsDemandes.kgValides} kg</div>
//                 </div>
//                 <div>
//                   <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>KG reçus</div>
//                   <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{dashboard.statsDemandes.kgRecus} kg</div>
//                 </div>
//                 <div>
//                   <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Taux de validation</div>
//                   <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
//                     {dashboard.statsDemandes.total > 0 
//                       ? Math.round((dashboard.statsDemandes.validees / dashboard.statsDemandes.total) * 100)
//                       : 0}%
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Actions rapides */}
//           <div className="quick-actions">
//             <Link to="/recycleur/demandes/nouvelle" className="action-btn">
//               <i className="fas fa-plus"></i>
//               Nouvelle demande
//             </Link>
//             <Link to="/recycleur/declarations/nouvelle" className="action-btn">
//               <i className="fas fa-recycle"></i>
//               Déclarer recyclage
//             </Link>
//             <Link to="/recycleur/stocks" className="action-btn">
//               <i className="fas fa-boxes"></i>
//               Voir tous les stocks
//             </Link>
//           </div>

//           {/* Statistiques */}
//           <div className="stats-grid">
//             {cardsToShow.map((stat, index) => (
//               stat.link ? (
//                 <Link key={index} to={stat.link} className="stat-card">
//                   <div className={`stat-icon ${stat.color}`}>
//                     <stat.icon />
//                   </div>
//                   <div className="stat-content">
//                     <div className="stat-title">{stat.title}</div>
//                     <div className="stat-value">{stat.value}</div>
//                     {stat.description && (
//                       <div className="stat-desc" style={{ fontSize: '0.7rem', color: '#6b7280' }}>{stat.description}</div>
//                     )}
//                   </div>
//                 </Link>
//               ) : (
//                 <div key={index} className="stat-card">
//                   <div className={`stat-icon ${stat.color}`}>
//                     <stat.icon />
//                   </div>
//                   <div className="stat-content">
//                     <div className="stat-title">{stat.title}</div>
//                     <div className="stat-value">{stat.value}</div>
//                     {stat.description && (
//                       <div className="stat-desc" style={{ fontSize: '0.7rem', color: '#6b7280' }}>{stat.description}</div>
//                     )}
//                   </div>
//                 </div>
//               )
//             ))}
//           </div>

//           {/* Grille principale */}
//           <div className="grid-2">
//             {/* Dernières demandes */}
//             <div className="card">
//               <div className="card-header">
//                 <h3 className="card-title">
//                   <i className="fas fa-history"></i>
//                   Dernières demandes
//                 </h3>
//                 <Link to="/recycleur/demandes" className="view-all-link">
//                   Voir tout →
//                 </Link>
//               </div>
              
//               {demandes.length > 0 ? (
//                 <>
//                   {demandes.slice(0, 5).map((demande) => {
//                     const status = getStatusBadge(demande.statut);
//                     return (
//                       <div key={demande.id} className="list-item">
//                         <div className="item-info">
//                           <div className="item-title">
//                             #{demande.id?.substring(0, 8)} - {demande.type_dechet}
//                           </div>
//                           <div className="item-subtitle">
//                             <span>{demande.quantite_demandee} kg</span>
//                             <span>•</span>
//                             <span>{recycleurService.formatDate(demande.date_souhaitee)}</span>
//                           </div>
//                         </div>
//                         <div className="item-actions">
//                           <span className={`badge ${status.color}`}>
//                             {status.label}
//                           </span>
//                           <Link 
//                             to={`/recycleur/demandes/${demande.id}`}
//                             className="item-action-btn"
//                             title="Voir détails"
//                           >
//                             <i className="fas fa-eye"></i>
//                           </Link>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </>
//               ) : (
//                 <div className="empty-state">
//                   <i className="fas fa-inbox"></i>
//                   <p>Aucune demande pour le moment</p>
//                   <Link to="/recycleur/demandes/nouvelle" style={{ color: '#2d8a5e' }}>
//                     Créer une demande
//                   </Link>
//                 </div>
//               )}
//             </div>

//             {/* Stocks disponibles */}
//             <div className="card">
//               <div className="card-header">
//                 <h3 className="card-title">
//                   <i className="fas fa-boxes"></i>
//                   Stocks disponibles
//                 </h3>
//                 <Link to="/recycleur/stocks" className="view-all-link">
//                   Voir tout →
//                 </Link>
//               </div>
              
//               {stocks.length > 0 ? (
//                 <>
//                   {stocks.slice(0, 5).map((stock) => (
//                     <div key={stock.id} className="list-item">
//                       <div className="item-info">
//                         <div className="item-title">{stock.nom_point}</div>
//                         <div className="item-subtitle">
//                           <span>{recycleurService.getTypeLabel(stock.type_dechet)}</span>
//                           <span>•</span>
//                           <span>{stock.commune}</span>
//                         </div>
//                       </div>
//                       <div className="stock-quantity">
//                         {stock.quantite_disponible} <small>kg</small>
//                       </div>
//                     </div>
//                   ))}
//                 </>
//               ) : (
//                 <div className="empty-state">
//                   <i className="fas fa-box-open"></i>
//                   <p>Aucun stock disponible</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Dernières déclarations */}
//           <div className="card" style={{ marginTop: '1.5rem' }}>
//             <div className="card-header">
//               <h3 className="card-title">
//                 <i className="fas fa-file-alt"></i>
//                 Dernières déclarations de recyclage
//               </h3>
//               <Link to="/recycleur/declarations" className="view-all-link">
//                 Voir tout →
//               </Link>
//             </div>
            
//             {declarations.length > 0 ? (
//               <>
//                 {declarations.slice(0, 5).map((declaration) => {
//                   const status = getStatusBadge(declaration.statut);
//                   return (
//                     <div key={declaration.id} className="list-item">
//                       <div className="item-info">
//                         <div className="item-title">
//                           {recycleurService.getTypeLabel(declaration.type_dechet)}
//                         </div>
//                         <div className="item-subtitle">
//                           <span>{declaration.quantite_recyclee} kg</span>
//                           <span>•</span>
//                           <span>{recycleurService.formatDate(declaration.date_recyclage)}</span>
//                         </div>
//                       </div>
//                       <div className="item-actions">
//                         <span className={`badge ${status.color}`}>
//                           {status.label}
//                         </span>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </>
//             ) : (
//               <div className="empty-state">
//                 <i className="fas fa-file"></i>
//                 <p>Aucune déclaration pour le moment</p>
//                 <Link to="/recycleur/declarations/nouvelle" style={{ color: '#2d8a5e' }}>
//                   Déclarer un recyclage
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </DashboardLayout>
//     </>
//   );
// };

// export default RecycleurDashboard;



// pages/Recycleur/RecycleurDashboard.jsx - Version corrigée

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../Layouts/LayoutDashboard';
import recycleurService from '../../services/recycleurService';
import { 
  FiPackage, FiTrendingUp, FiCheckCircle, FiClock,
  FiMap, FiCalendar, FiDollarSign, FiFileText, FiRefreshCw,
  FiBarChart2, FiAward, FiTarget, FiBox
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const RecycleurDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [demandes, setDemandes] = useState([]);
  const [declarations, setDeclarations] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [monStock, setMonStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('ecocollect_user'));
    setUser(userData);
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      
      // Charger toutes les données en parallèle
      const [dashboardData, demandesData, stocksData, declarationsData, monStockData] = await Promise.all([
        recycleurService.getDashboard().catch(() => ({ dashboard: {} })),
        recycleurService.getMesDemandes().catch(() => ({ demandes: [] })),
        recycleurService.getStocks({ limit: 5 }).catch(() => ({ stocks: [] })),
        recycleurService.getMesDeclarations().catch(() => ({ declarations: [] })),
        recycleurService.getMonStock().catch(() => ({ stocks: [] }))  // ✅ AJOUTÉ
      ]);
      
      setDashboard(dashboardData.dashboard || {});
      setDemandes(demandesData.demandes || []);
      setDeclarations(declarationsData.declarations || []);
      setStocks(stocksData.stocks || []);
      setMonStock(monStockData.stocks || []);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
    toast.success('Données actualisées');
  };

  // ✅ STATISTIQUES AVEC STOCK PERSONNEL
  const statCards = [
    {
      title: 'Demandes en attente',
      value: dashboard?.statsDemandes?.enAttente || 0,
      icon: FiClock,
      color: 'bg-yellow-100 text-yellow-600',
      link: '/recycleur/demandes?statut=en_attente'
    },
    {
      title: 'Demandes validées',
      value: dashboard?.statsDemandes?.validees || 0,
      icon: FiCheckCircle,
      color: 'bg-green-100 text-green-600',
      link: '/recycleur/demandes?statut=validee'
    },
    {
      title: 'KG validés',
      value: `${dashboard?.statsDemandes?.kgValides || 0} kg`,
      icon: FiTarget,
      color: 'bg-blue-100 text-blue-600',
      description: 'Poids total des demandes validées'
    },
    {
      title: 'Mon stock',
      value: `${dashboard?.stockPerso?.total || 0} kg`,
      icon: FiBox,
      color: 'bg-purple-100 text-purple-600',
      description: 'Stock personnel disponible',
      link: '/recycleur/mon-stock'
    }

  ];

  const getStatusBadge = (statut) => {
    const badges = {
      'en_attente': { color: 'bg-yellow-100 text-yellow-800', label: 'En attente' },
      'validee': { color: 'bg-green-100 text-green-800', label: 'Validée' },
      'acceptee': { color: 'bg-green-100 text-green-800', label: 'Acceptée' },
      'realisee': { color: 'bg-blue-100 text-blue-800', label: 'Réalisée' },
      'refusee': { color: 'bg-red-100 text-red-800', label: 'Refusée' },
    };
    return badges[statut] || badges.en_attente;
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

  const styles = `
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 1rem;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.05);
      border: 1px solid #d9e0d9;
      transition: all 0.3s ease;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px -8px rgba(45, 138, 94, 0.2);
    }

    .stat-icon {
      width: 3rem;
      height: 3rem;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .stat-content {
      flex: 1;
    }

    .stat-title {
      font-size: 0.9rem;
      color: #5a655a;
      margin-bottom: 0.25rem;
    }

    .stat-value {
      font-size: 1.8rem;
      font-weight: 700;
      color: #1a1e1a;
    }

    .stat-desc {
      font-size: 0.7rem;
      color: #6b7280;
      margin-top: 0.25rem;
    }

    .stock-perso-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1.5rem;
      border-radius: 1rem;
      margin-bottom: 2rem;
    }

    .stock-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .stock-item {
      background: rgba(255, 255, 255, 0.1);
      padding: 1rem;
      border-radius: 0.5rem;
      text-align: center;
    }

    .stock-item .type {
      font-size: 0.9rem;
      opacity: 0.9;
      margin-bottom: 0.5rem;
    }

    .stock-item .quantity {
      font-size: 1.3rem;
      font-weight: bold;
    }

    .quick-actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .action-btn {
      background: white;
      border: 1px solid #d9e0d9;
      border-radius: 100px;
      padding: 0.75rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #1a1e1a;
      text-decoration: none;
      transition: all 0.3s;
    }

    .action-btn:hover {
      background: #2d8a5e;
      color: white;
      border-color: #2d8a5e;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .card {
      background: white;
      border-radius: 1rem;
      padding: 1.5rem;
      border: 1px solid #d9e0d9;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .card-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1a1e1a;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .list-item {
      padding: 1rem;
      border-bottom: 1px solid #d9e0d9;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 100px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
      color: #5a655a;
    }

    @media (max-width: 768px) {
      .grid-2 {
        grid-template-columns: 1fr;
      }
    }
  `;

  if (loading) {
    return (
      <DashboardLayout title="Dashboard Recycleur" user={user}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="spinner" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: '1rem', color: '#5a655a' }}>Chargement du tableau de bord...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <DashboardLayout title="Dashboard Recycleur" user={user}>
        <div className="dashboard-container">
          {/* En-tête */}
          <div className="header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a1e1a' }}>
              Tableau de bord
            </h1>
            <button 
              className={`refresh-btn ${refreshing ? 'spinning' : ''}`}
              onClick={handleRefresh}
              disabled={refreshing}
              style={{
                background: 'white',
                border: '1px solid #d9e0d9',
                borderRadius: '0.75rem',
                padding: '0.6rem 1.2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <FiRefreshCw className={refreshing ? 'fa-spin' : ''} />
              Actualiser
            </button>
          </div>

          {/* Section Stock Personnel */}
          {monStock.length > 0 && (
            <div className="stock-perso-section">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiBox /> Mon stock personnel
              </h3>
              <div className="stock-grid">
                {monStock.map((stock) => (
                  <div key={stock.id} className="stock-item">
                    <div className="type">{getTypeLabel(stock.type_dechet)}</div>
                    <div className="quantity">{parseFloat(stock.quantite_disponible).toFixed(1)} kg</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions rapides */}
          <div className="quick-actions">
            <Link to="/recycleur/demandes/nouvelle" className="action-btn">
              <i className="fas fa-plus"></i>
              Nouvelle demande
            </Link>
            <Link to="/recycleur/declarations" className="action-btn">
              <i className="fas fa-recycle"></i>
              Déclarer recyclage
            </Link>
            <Link to="/recycleur/stocks" className="action-btn">
              <i className="fas fa-boxes"></i>
              Voir tous les stocks
            </Link>
            <Link to="/recycleur/mon-stock" className="action-btn">
              <i className="fas fa-box"></i>
              Mon stock
            </Link>
          </div>

          {/* Statistiques */}
          <div className="stats-grid">
            {statCards.map((stat, index) => (
              stat.link ? (
                <Link key={index} to={stat.link} className="stat-card">
                  <div className={`stat-icon ${stat.color}`}>
                    <stat.icon />
                  </div>
                  <div className="stat-content">
                    <div className="stat-title">{stat.title}</div>
                    <div className="stat-value">{stat.value}</div>
                    {stat.description && (
                      <div className="stat-desc">{stat.description}</div>
                    )}
                  </div>
                </Link>
              ) : (
                <div key={index} className="stat-card">
                  <div className={`stat-icon ${stat.color}`}>
                    <stat.icon />
                  </div>
                  <div className="stat-content">
                    <div className="stat-title">{stat.title}</div>
                    <div className="stat-value">{stat.value}</div>
                    {stat.description && (
                      <div className="stat-desc">{stat.description}</div>
                    )}
                  </div>
                </div>
              )
            ))}
          </div>

          {/* Grille principale */}
          <div className="grid-2">
            {/* Dernières demandes */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <i className="fas fa-history"></i>
                  Dernières demandes
                </h3>
                <Link to="/recycleur/demandes" className="view-all-link" style={{ color: '#2d8a5e' }}>
                  Voir tout →
                </Link>
              </div>
              
              {demandes.length > 0 ? (
                <>
                  {demandes.slice(0, 5).map((demande) => {
                    const status = getStatusBadge(demande.statut);
                    return (
                      <div key={demande.id} className="list-item">
                        <div className="item-info">
                          <div className="item-title">
                            #{demande.id?.substring(0, 8)} - {getTypeLabel(demande.type_dechet)}
                          </div>
                          <div className="item-subtitle" style={{ fontSize: '0.85rem', color: '#5a655a' }}>
                            <span>{demande.quantite_demandee} kg</span>
                            <span> • </span>
                            <span>{recycleurService.formatDate(demande.date_souhaitee)}</span>
                          </div>
                        </div>
                        <span className={`badge ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="empty-state">
                  <i className="fas fa-inbox" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
                  <p>Aucune demande pour le moment</p>
                  <Link to="/recycleur/demandes/nouvelle" style={{ color: '#2d8a5e' }}>
                    Créer une demande
                  </Link>
                </div>
              )}
            </div>

            {/* Dernières déclarations */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <i className="fas fa-file-alt"></i>
                  Dernières déclarations
                </h3>
                <Link to="/recycleur/Mesdeclarations" className="view-all-link" style={{ color: '#2d8a5e' }}>
                  Voir tout →
                </Link>
              </div>
              
              {declarations.length > 0 ? (
                <>
                  {declarations.slice(0, 5).map((declaration) => {
                    const status = getStatusBadge(declaration.statut);
                    return (
                      <div key={declaration.id} className="list-item">
                        <div className="item-info">
                          <div className="item-title">
                            {getTypeLabel(declaration.type_dechet)}
                          </div>
                          <div className="item-subtitle" style={{ fontSize: '0.85rem', color: '#5a655a' }}>
                            <span>{declaration.quantite_recyclee} kg</span>
                            <span> • </span>
                            <span>{recycleurService.formatDate(declaration.date_recyclage)}</span>
                          </div>
                        </div>
                        <span className={`badge ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="empty-state">
                  <i className="fas fa-file" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
                  <p>Aucune déclaration pour le moment</p>
                  <Link to="/recycleur/declarations/nouvelle" style={{ color: '#2d8a5e' }}>
                    Déclarer un recyclage
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default RecycleurDashboard;