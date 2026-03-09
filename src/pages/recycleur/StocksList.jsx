// // import React, { useState, useEffect } from 'react';
// // import DashboardLayout from '../../Layouts/LayoutDashboard';
// // import recycleurService from '../../services/recycleurService';
// // import { FiSearch, FiFilter, FiMapPin, FiPackage } from 'react-icons/fi';

// // const StocksList = () => {
// //   const [stocks, setStocks] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [filters, setFilters] = useState({
// //     typeDechet: '',
// //     commune: '',
// //     search: ''
// //   });
// //   const [user, setUser] = useState(null);

// //   useEffect(() => {
// //     const userData = JSON.parse(localStorage.getItem('ecocollect_user'));
// //     setUser(userData);
// //     loadStocks();
// //   }, []);

// //   const loadStocks = async () => {
// //     try {
// //       setLoading(true);
// //       const data = await recycleurService.getStocks(filters);
// //       setStocks(data.stocks || []);
// //     } catch (error) {
// //       console.error('Erreur chargement stocks:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleFilterChange = (e) => {
// //     const { name, value } = e.target;
// //     setFilters(prev => ({ ...prev, [name]: value }));
// //   };

// //   const applyFilters = () => {
// //     loadStocks();
// //   };

// //   const resetFilters = () => {
// //     setFilters({
// //       typeDechet: '',
// //       commune: '',
// //       search: ''
// //     });
// //     setTimeout(loadStocks, 100);
// //   };

// //   const typesDechet = [
// //     'plastique_pet', 'plastique_pehd', 'papier_carton',
// //     'metal', 'verre', 'organique'
// //   ];

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

// //   const styles = `
// //     .filters-bar {
// //       background: white;
// //       border-radius: 1rem;
// //       padding: 1.5rem;
// //       margin-bottom: 2rem;
// //       border: 1px solid #d9e0d9;
// //     }

// //     .filters-grid {
// //       display: grid;
// //       grid-template-columns: 2fr 1fr 1fr auto auto;
// //       gap: 1rem;
// //       align-items: end;
// //     }

// //     .filter-group {
// //       display: flex;
// //       flex-direction: column;
// //       gap: 0.5rem;
// //     }

// //     .filter-group label {
// //       font-size: 0.85rem;
// //       font-weight: 600;
// //       color: #1a1e1a;
// //     }

// //     .filter-group select, .filter-group input {
// //       padding: 0.6rem 1rem;
// //       border: 1.5px solid #d9e0d9;
// //       border-radius: 0.75rem;
// //       font-size: 0.9rem;
// //     }

// //     .filter-group select:focus, .filter-group input:focus {
// //       border-color: #2d8a5e;
// //       outline: none;
// //     }

// //     .btn-filter {
// //       background: #2d8a5e;
// //       color: white;
// //       border: none;
// //       padding: 0.6rem 1.5rem;
// //       border-radius: 0.75rem;
// //       font-weight: 600;
// //       cursor: pointer;
// //       display: flex;
// //       align-items: center;
// //       gap: 0.5rem;
// //       height: 42px;
// //     }

// //     .btn-filter:hover {
// //       background: #1e5e3f;
// //     }

// //     .btn-reset {
// //       background: #f8faf8;
// //       color: #1a1e1a;
// //       border: 1.5px solid #d9e0d9;
// //       padding: 0.6rem 1.5rem;
// //       border-radius: 0.75rem;
// //       font-weight: 600;
// //       cursor: pointer;
// //       display: flex;
// //       align-items: center;
// //       gap: 0.5rem;
// //       height: 42px;
// //     }

// //     .btn-reset:hover {
// //       background: #e8f3e8;
// //     }

// //     .stocks-grid {
// //       display: grid;
// //       grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
// //       gap: 1.5rem;
// //     }

// //     .stock-card {
// //       background: white;
// //       border-radius: 1rem;
// //       padding: 1.5rem;
// //       border: 1px solid #d9e0d9;
// //       transition: all 0.3s;
// //     }

// //     .stock-card:hover {
// //       transform: translateY(-4px);
// //       box-shadow: 0 8px 30px -8px rgba(45, 138, 94, 0.15);
// //     }

// //     .stock-header {
// //       display: flex;
// //       justify-content: space-between;
// //       align-items: center;
// //       margin-bottom: 1rem;
// //     }

// //     .stock-point {
// //       font-weight: 700;
// //       color: #1a1e1a;
// //       font-size: 1.1rem;
// //     }

// //     .stock-type {
// //       background: #e8f3e8;
// //       color: #2d8a5e;
// //       padding: 0.25rem 0.75rem;
// //       border-radius: 100px;
// //       font-size: 0.75rem;
// //       font-weight: 600;
// //     }

// //     .stock-location {
// //       display: flex;
// //       align-items: center;
// //       gap: 0.5rem;
// //       color: #5a655a;
// //       font-size: 0.9rem;
// //       margin-bottom: 1rem;
// //     }

// //     .stock-quantity {
// //       font-size: 2rem;
// //       font-weight: 700;
// //       color: #2d8a5e;
// //       margin-bottom: 1rem;
// //     }

// //     .stock-quantity small {
// //       font-size: 0.9rem;
// //       color: #5a655a;
// //       font-weight: normal;
// //     }

// //     .stock-footer {
// //       display: flex;
// //       gap: 0.5rem;
// //       margin-top: 1rem;
// //     }

// //     .btn-demand {
// //       flex: 1;
// //       background: #2d8a5e;
// //       color: white;
// //       border: none;
// //       padding: 0.6rem;
// //       border-radius: 0.75rem;
// //       font-weight: 600;
// //       cursor: pointer;
// //       text-align: center;
// //       text-decoration: none;
// //       font-size: 0.9rem;
// //     }

// //     .btn-demand:hover {
// //       background: #1e5e3f;
// //     }

// //     .btn-demand:disabled {
// //       background: #d9e0d9;
// //       cursor: not-allowed;
// //     }

// //     .pagination {
// //       display: flex;
// //       justify-content: center;
// //       gap: 0.5rem;
// //       margin-top: 2rem;
// //     }

// //     .page-btn {
// //       width: 2.5rem;
// //       height: 2.5rem;
// //       border: 1px solid #d9e0d9;
// //       border-radius: 0.5rem;
// //       background: white;
// //       cursor: pointer;
// //       display: flex;
// //       align-items: center;
// //       justify-content: center;
// //     }

// //     .page-btn.active {
// //       background: #2d8a5e;
// //       color: white;
// //       border-color: #2d8a5e;
// //     }

// //     .page-btn:hover:not(.active) {
// //       background: #e8f3e8;
// //     }

// //     @media (max-width: 768px) {
// //       .filters-grid {
// //         grid-template-columns: 1fr;
// //       }
      
// //       .stocks-grid {
// //         grid-template-columns: 1fr;
// //       }
// //     }
// //   `;

// //   if (loading) {
// //     return (
// //       <DashboardLayout title="Stocks disponibles" user={user}>
// //         <div style={{ textAlign: 'center', padding: '3rem' }}>
// //           <div className="spinner" style={{ margin: '0 auto' }}></div>
// //           <p style={{ marginTop: '1rem', color: '#5a655a' }}>Chargement...</p>
// //         </div>
// //       </DashboardLayout>
// //     );
// //   }

// //   return (
// //     <>
// //       <style>{styles}</style>
// //       <DashboardLayout title="Stocks disponibles" user={user}>
// //         {/* Filtres */}
// //         <div className="filters-bar">
// //           <div className="filters-grid">
// //             <div className="filter-group">
// //               <label>Recherche</label>
// //               <input
// //                 type="text"
// //                 name="search"
// //                 value={filters.search}
// //                 onChange={handleFilterChange}
// //                 placeholder="Nom du point, commune..."
// //               />
// //             </div>
// //             <div className="filter-group">
// //               <label>Type de déchet</label>
// //               <select name="typeDechet" value={filters.typeDechet} onChange={handleFilterChange}>
// //                 <option value="">Tous</option>
// //                 {typesDechet.map(type => (
// //                   <option key={type} value={type}>{getTypeLabel(type)}</option>
// //                 ))}
// //               </select>
// //             </div>
// //             <div className="filter-group">
// //               <label>Commune</label>
// //               <input
// //                 type="text"
// //                 name="commune"
// //                 value={filters.commune}
// //                 onChange={handleFilterChange}
// //                 placeholder="Ex: Dakar"
// //               />
// //             </div>
// //             <button className="btn-filter" onClick={applyFilters}>
// //               <FiFilter /> Filtrer
// //             </button>
// //             <button className="btn-reset" onClick={resetFilters}>
// //               <i className="fas fa-undo"></i> Réinitialiser
// //             </button>
// //           </div>
// //         </div>

// //         {/* Liste des stocks */}
// //         {stocks.length > 0 ? (
// //           <div className="stocks-grid">
// //             {stocks.map((stock) => (
// //               <div key={stock.id} className="stock-card">
// //                 <div className="stock-header">
// //                   <span className="stock-point">{stock.nom_point}</span>
// //                   <span className="stock-type">{getTypeLabel(stock.type_dechet)}</span>
// //                 </div>
                
// //                 <div className="stock-location">
// //                   <FiMapPin />
// //                   <span>{stock.commune}, {stock.quartier}</span>
// //                 </div>

// //                 <div className="stock-quantity">
// //                   {stock.quantite_disponible} <small>kg</small>
// //                 </div>

// //                 <div className="stock-footer">
// //                   <Link 
// //                     to={`/recycleur/demandes/nouvelle?point=${stock.point_depot_id}&type=${stock.type_dechet}`}
// //                     className="btn-demand"
// //                   >
// //                     <i className="fas fa-truck"></i> Demander
// //                   </Link>
// //                   <button 
// //                     className="btn-demand" 
// //                     style={{ background: '#f8faf8', color: '#1a1e1a', border: '1px solid #d9e0d9' }}
// //                     onClick={() => window.location.href = `/recycleur/points/${stock.point_depot_id}`}
// //                   >
// //                     <i className="fas fa-info-circle"></i> Détails
// //                   </button>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         ) : (
// //           <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '1rem' }}>
// //             <i className="fas fa-box-open" style={{ fontSize: '3rem', color: '#d9e0d9', marginBottom: '1rem' }}></i>
// //             <p style={{ color: '#5a655a' }}>Aucun stock disponible pour le moment</p>
// //           </div>
// //         )}

// //         {/* Pagination (à implémenter si nécessaire) */}
// //         {stocks.length > 0 && (
// //           <div className="pagination">
// //             <button className="page-btn"><i className="fas fa-chevron-left"></i></button>
// //             <button className="page-btn active">1</button>
// //             <button className="page-btn">2</button>
// //             <button className="page-btn">3</button>
// //             <button className="page-btn"><i className="fas fa-chevron-right"></i></button>
// //           </div>
// //         )}
// //       </DashboardLayout>
// //     </>
// //   );
// // };

// // export default StocksList; 



// // pages/Recycleur/StocksList.jsx - Version corrigée

// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import DashboardLayout from '../../Layouts/LayoutDashboard';
// import recycleurService from '../../services/recycleurService';
// import { FiSearch, FiFilter, FiMapPin, FiPackage, FiRefreshCw } from 'react-icons/fi';
// import toast from 'react-hot-toast';

// const StocksList = () => {
//   const [stocks, setStocks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [totaux, setTotaux] = useState({});
//   const [filters, setFilters] = useState({
//     typeDechet: '',
//     commune: '',
//     search: ''
//   });
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const userData = JSON.parse(localStorage.getItem('ecocollect_user'));
//     setUser(userData);
//     loadStocks();
//   }, []);

//   const loadStocks = async () => {
//     try {
//       setLoading(true);
//       const response = await recycleurService.getStocks(filters);
//       console.log('📦 Stocks reçus:', response);
      
//       // Adapter selon la structure
//       if (response.stocks) {
//         setStocks(response.stocks);
//         setTotaux({
//           total: response.totalGlobal,
//           parType: response.totauxParType
//         });
//       } else {
//         setStocks(response);
//       }
//     } catch (error) {
//       console.error('Erreur chargement stocks:', error);
//       toast.error('Erreur lors du chargement des stocks');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await loadStocks();
//     setRefreshing(false);
//     toast.success('Stocks actualisés');
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({ ...prev, [name]: value }));
//   };

//   const applyFilters = () => {
//     loadStocks();
//   };

//   const resetFilters = () => {
//     setFilters({
//       typeDechet: '',
//       commune: '',
//       search: ''
//     });
//     setTimeout(loadStocks, 100);
//   };

//   const typesDechet = [
//     'plastique_pet', 'plastique_pehd', 'papier_carton',
//     'metal', 'verre', 'organique'
//   ];

//   // Calculer le total si non fourni
//   const poidsTotal = stocks.reduce((acc, s) => acc + (parseFloat(s.quantite_disponible) || 0), 0);

//     const styles = `
//     .stocks-container {
//       padding: 1.5rem;
//     }

//     .header-actions {
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       margin-bottom: 2rem;
//     }

//     .filters-bar {
//       background: white;
//       border-radius: 1rem;
//       padding: 1.5rem;
//       margin-bottom: 2rem;
//       border: 1px solid #d9e0d9;
//     }

//     .filters-grid {
//       display: grid;
//       grid-template-columns: 2fr 1fr 1fr auto auto;
//       gap: 1rem;
//       align-items: end;
//     }

//     .filter-group {
//       display: flex;
//       flex-direction: column;
//       gap: 0.5rem;
//     }

//     .filter-group label {
//       font-size: 0.85rem;
//       font-weight: 600;
//       color: #1a1e1a;
//     }

//     .filter-group select, .filter-group input {
//       padding: 0.6rem 1rem;
//       border: 1.5px solid #d9e0d9;
//       border-radius: 0.75rem;
//       font-size: 0.9rem;
//       width: 100%;
//     }

//     .filter-group select:focus, .filter-group input:focus {
//       border-color: #2d8a5e;
//       outline: none;
//     }

//     .btn-filter {
//       background: #2d8a5e;
//       color: white;
//       border: none;
//       padding: 0.6rem 1.5rem;
//       border-radius: 0.75rem;
//       font-weight: 600;
//       cursor: pointer;
//       display: flex;
//       align-items: center;
//       gap: 0.5rem;
//       height: 42px;
//     }

//     .btn-filter:hover {
//       background: #1e5e3f;
//     }

//     .btn-reset {
//       background: #f8faf8;
//       color: #1a1e1a;
//       border: 1.5px solid #d9e0d9;
//       padding: 0.6rem 1.5rem;
//       border-radius: 0.75rem;
//       font-weight: 600;
//       cursor: pointer;
//       display: flex;
//       align-items: center;
//       gap: 0.5rem;
//       height: 42px;
//     }

//     .btn-reset:hover {
//       background: #e8f3e8;
//     }

//     .stocks-grid {
//       display: grid;
//       grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
//       gap: 1.5rem;
//     }

//     .stock-card {
//       background: white;
//       border-radius: 1rem;
//       padding: 1.5rem;
//       border: 1px solid #d9e0d9;
//       transition: all 0.3s;
//     }

//     .stock-card:hover {
//       transform: translateY(-4px);
//       box-shadow: 0 8px 30px -8px rgba(45, 138, 94, 0.15);
//     }

//     .stock-header {
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       margin-bottom: 1rem;
//     }

//     .stock-point {
//       font-weight: 700;
//       color: #1a1e1a;
//       font-size: 1.1rem;
//     }

//     .stock-type {
//       background: #e8f3e8;
//       color: #2d8a5e;
//       padding: 0.25rem 0.75rem;
//       border-radius: 100px;
//       font-size: 0.75rem;
//       font-weight: 600;
//     }

//     .stock-location {
//       display: flex;
//       align-items: center;
//       gap: 0.5rem;
//       color: #5a655a;
//       font-size: 0.9rem;
//       margin-bottom: 1rem;
//     }

//     .stock-quantity {
//       font-size: 2rem;
//       font-weight: 700;
//       color: #2d8a5e;
//       margin-bottom: 1rem;
//     }

//     .stock-quantity small {
//       font-size: 0.9rem;
//       color: #5a655a;
//       font-weight: normal;
//     }

//     .stock-footer {
//       display: flex;
//       gap: 0.5rem;
//       margin-top: 1rem;
//     }

//     .btn-demand {
//       flex: 1;
//       background: #2d8a5e;
//       color: white;
//       border: none;
//       padding: 0.6rem;
//       border-radius: 0.75rem;
//       font-weight: 600;
//       cursor: pointer;
//       text-align: center;
//       text-decoration: none;
//       font-size: 0.9rem;
//     }

//     .btn-demand:hover {
//       background: #1e5e3f;
//     }

//     .btn-details {
//       flex: 1;
//       background: #f8faf8;
//       color: #1a1e1a;
//       border: 1px solid #d9e0d9;
//       padding: 0.6rem;
//       border-radius: 0.75rem;
//       font-weight: 600;
//       cursor: pointer;
//       text-align: center;
//       text-decoration: none;
//       font-size: 0.9rem;
//     }

//     .btn-details:hover {
//       background: #e8f3e8;
//     }

//     .empty-state {
//       text-align: center;
//       padding: 3rem;
//       background: white;
//       border-radius: 1rem;
//       border: 1px solid #d9e0d9;
//     }

//     .empty-state i {
//       font-size: 3rem;
//       color: #d9e0d9;
//       margin-bottom: 1rem;
//     }

//     .pagination {
//       display: flex;
//       justify-content: center;
//       gap: 0.5rem;
//       margin-top: 2rem;
//     }

//     .page-btn {
//       width: 2.5rem;
//       height: 2.5rem;
//       border: 1px solid #d9e0d9;
//       border-radius: 0.5rem;
//       background: white;
//       cursor: pointer;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//     }

//     .page-btn.active {
//       background: #2d8a5e;
//       color: white;
//       border-color: #2d8a5e;
//     }

//     .page-btn:hover:not(.active) {
//       background: #e8f3e8;
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
//       border-color: #2d8a5e;
//     }

//     .refresh-btn:disabled {
//       opacity: 0.6;
//       cursor: not-allowed;
//     }

//     @media (max-width: 768px) {
//       .filters-grid {
//         grid-template-columns: 1fr;
//       }
      
//       .stocks-grid {
//         grid-template-columns: 1fr;
//       }
//     }
//         `;


//   if (loading) {
//     return (
//       <DashboardLayout title="Stocks disponibles" user={user}>
//         <div style={{ textAlign: 'center', padding: '3rem' }}>
//           <div className="spinner"></div>
//           <p style={{ marginTop: '1rem', color: '#5a655a' }}>Chargement des stocks...</p>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <>
//       <style>{styles}</style>
//       <DashboardLayout title="Stocks disponibles" user={user}>
//         <div className="stocks-container">
//           {/* En-tête */}
//           <div className="header-actions">
//             <h1>Stocks de déchets disponibles</h1>
//             <button 
//               className="refresh-btn"
//               onClick={handleRefresh}
//               disabled={refreshing}
//             >
//               <FiRefreshCw className={refreshing ? 'fa-spin' : ''} />
//               Actualiser
//             </button>
//           </div>

//           {/* Résumé */}
//           {poidsTotal > 0 && (
//             <div className="total-summary">
//               <div className="total-item">
//                 <span className="total-label">Poids total</span>
//                 <span className="total-value">{poidsTotal.toFixed(1)} kg</span>
//               </div>
//               <div className="total-item">
//                 <span className="total-label">Types présents</span>
//                 <span className="total-value">{new Set(stocks.map(s => s.type_dechet)).size}</span>
//               </div>
//             </div>
//           )}

//           {/* Filtres */}
//           <div className="filters-bar">
//             <div className="filters-grid">
//               <div className="filter-group">
//                 <label>Recherche</label>
//                 <input
//                   type="text"
//                   name="search"
//                   value={filters.search}
//                   onChange={handleFilterChange}
//                   placeholder="Nom du point, commune..."
//                 />
//               </div>
//               <div className="filter-group">
//                 <label>Type de déchet</label>
//                 <select name="typeDechet" value={filters.typeDechet} onChange={handleFilterChange}>
//                   <option value="">Tous</option>
//                   {typesDechet.map(type => (
//                     <option key={type} value={type}>{recycleurService.getTypeLabel(type)}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="filter-group">
//                 <label>Commune</label>
//                 <input
//                   type="text"
//                   name="commune"
//                   value={filters.commune}
//                   onChange={handleFilterChange}
//                   placeholder="Ex: Dakar"
//                 />
//               </div>
//               <button className="btn-filter" onClick={applyFilters}>
//                 <FiFilter /> Filtrer
//               </button>
//               <button className="btn-reset" onClick={resetFilters}>
//                 <i className="fas fa-undo"></i> Réinitialiser
//               </button>
//             </div>
//           </div>

//           {/* Liste des stocks */}
//           {stocks.length > 0 ? (
//             <div className="stocks-grid">
//               {stocks.map((stock) => (
//                 <div key={`${stock.point_depot_id}-${stock.type_dechet}`} className="stock-card">
//                   <div className="stock-header">
//                     <span className="stock-point">{stock.point_nom || 'Point de collecte'}</span>
//                     <span className="stock-type">{recycleurService.getTypeLabel(stock.type_dechet)}</span>
//                   </div>
                  
//                   <div className="stock-location">
//                     <FiMapPin />
//                     <span>{stock.commune || 'Non spécifiée'}, {stock.quartier || 'Non spécifié'}</span>
//                   </div>

//                   <div className="stock-quantity">
//                     {parseFloat(stock.quantite_disponible).toFixed(1)} <small>kg</small>
//                   </div>

//                   <div className="stock-footer">
//                     <Link 
//                       to={`/recycleur/demandes/nouvelle?point=${stock.point_depot_id}&type=${stock.type_dechet}`}
//                       className="btn-demand"
//                     >
//                       <i className="fas fa-truck"></i> Demander
//                     </Link>
//                     <Link 
//                       to={`/recycleur/points/${stock.point_depot_id}`}
//                       className="btn-details"
//                     >
//                       <i className="fas fa-info-circle"></i> Détails
//                     </Link>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="empty-state">
//               <i className="fas fa-box-open"></i>
//               <p>Aucun stock disponible pour le moment</p>
//             </div>
//           )}
//         </div>
//       </DashboardLayout>
//     </>
//   );
// };

// export default StocksList;

// pages/Recycleur/StocksList.jsx - Version corrigée

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../Layouts/LayoutDashboard';
import recycleurService from '../../services/recycleurService';
import { FiSearch, FiFilter, FiMapPin, FiPackage, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';

const StocksList = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totaux, setTotaux] = useState({
    totalGlobal: '0',
    totauxParType: {}
  });
  const [filters, setFilters] = useState({
    typeDechet: '',
    commune: '',
    search: ''
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('ecocollect_user'));
    setUser(userData);
    loadStocks();
  }, []);

  const loadStocks = async () => {
    try {
      setLoading(true);
      const response = await recycleurService.getStocks(filters);
      console.log('📦 Stocks reçus:', response);
      
      // Vérifier la structure de la réponse
      if (response && response.stocks) {
        setStocks(response.stocks);
        setTotaux({
          totalGlobal: response.totalGlobal || '0',
          totauxParType: response.totauxParType || {}
        });
      } else if (Array.isArray(response)) {
        // Si la réponse est directement un tableau
        setStocks(response);
      } else {
        console.warn('Structure de réponse inattendue:', response);
        setStocks([]);
      }
    } catch (error) {
      console.error('❌ Erreur chargement stocks:', error);
      toast.error('Erreur lors du chargement des stocks');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadStocks();
    setRefreshing(false);
    toast.success('Stocks actualisés');
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    loadStocks();
  };

  const resetFilters = () => {
    setFilters({
      typeDechet: '',
      commune: '',
      search: ''
    });
    setTimeout(loadStocks, 100);
  };

  const typesDechet = [
    { value: 'plastique_pet', label: 'Plastique PET' },
    { value: 'plastique_pehd', label: 'Plastique PEHD' },
    { value: 'papier_carton', label: 'Papier/Carton' },
    { value: 'metal', label: 'Métal' },
    { value: 'verre', label: 'Verre' },
    { value: 'organique', label: 'Organique' },
  ];

  // Calculer le nombre de types uniques
  const typesUniques = new Set(stocks.map(s => s.type_dechet)).size;

  // Styles (gardez les mêmes)
 
    const styles = `
    .stocks-container {
      padding: 1.5rem;
    }

    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .filters-bar {
      background: white;
      border-radius: 1rem;
      padding: 1.5rem;
      margin-bottom: 2rem;
      border: 1px solid #d9e0d9;
    }

    .filters-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr auto auto;
      gap: 1rem;
      align-items: end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-group label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #1a1e1a;
    }

    .filter-group select, .filter-group input {
      padding: 0.6rem 1rem;
      border: 1.5px solid #d9e0d9;
      border-radius: 0.75rem;
      font-size: 0.9rem;
      width: 100%;
    }

    .filter-group select:focus, .filter-group input:focus {
      border-color: #2d8a5e;
      outline: none;
    }

    .btn-filter {
      background: #2d8a5e;
      color: white;
      border: none;
      padding: 0.6rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      height: 42px;
    }

    .btn-filter:hover {
      background: #1e5e3f;
    }

    .btn-reset {
      background: #f8faf8;
      color: #1a1e1a;
      border: 1.5px solid #d9e0d9;
      padding: 0.6rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      height: 42px;
    }

    .btn-reset:hover {
      background: #e8f3e8;
    }

    .stocks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .stock-card {
      background: white;
      border-radius: 1rem;
      padding: 1.5rem;
      border: 1px solid #d9e0d9;
      transition: all 0.3s;
    }

    .stock-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px -8px rgba(45, 138, 94, 0.15);
    }

    .stock-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .stock-point {
      font-weight: 700;
      color: #1a1e1a;
      font-size: 1.1rem;
    }

    .stock-type {
      background: #e8f3e8;
      color: #2d8a5e;
      padding: 0.25rem 0.75rem;
      border-radius: 100px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .stock-location {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #5a655a;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .stock-quantity {
      font-size: 2rem;
      font-weight: 700;
      color: #2d8a5e;
      margin-bottom: 1rem;
    }

    .stock-quantity small {
      font-size: 0.9rem;
      color: #5a655a;
      font-weight: normal;
    }

    .stock-footer {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .btn-demand {
      flex: 1;
      background: #2d8a5e;
      color: white;
      border: none;
      padding: 0.6rem;
      border-radius: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
      font-size: 0.9rem;
    }

    .btn-demand:hover {
      background: #1e5e3f;
    }

    .btn-details {
      flex: 1;
      background: #f8faf8;
      color: #1a1e1a;
      border: 1px solid #d9e0d9;
      padding: 0.6rem;
      border-radius: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
      font-size: 0.9rem;
    }

    .btn-details:hover {
      background: #e8f3e8;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      background: white;
      border-radius: 1rem;
      border: 1px solid #d9e0d9;
    }

    .empty-state i {
      font-size: 3rem;
      color: #d9e0d9;
      margin-bottom: 1rem;
    }

    .pagination {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 2rem;
    }

    .page-btn {
      width: 2.5rem;
      height: 2.5rem;
      border: 1px solid #d9e0d9;
      border-radius: 0.5rem;
      background: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .page-btn.active {
      background: #2d8a5e;
      color: white;
      border-color: #2d8a5e;
    }

    .page-btn:hover:not(.active) {
      background: #e8f3e8;
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
      border-color: #2d8a5e;
    }

    .refresh-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .filters-grid {
        grid-template-columns: 1fr;
      }
      
      .stocks-grid {
        grid-template-columns: 1fr;
      }
    }
        `;

  if (loading) {
    return (
      <DashboardLayout title="Stocks disponibles" user={user}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '1rem', color: '#5a655a' }}>Chargement des stocks...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <DashboardLayout title="Stocks disponibles" user={user}>
        <div className="stocks-container">
          {/* En-tête */}
          <div className="header-actions">
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a1e1a' }}>
              Stocks de déchets disponibles
            </h1>
            <button 
              className="refresh-btn"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <FiRefreshCw className={refreshing ? 'fa-spin' : ''} />
              Actualiser
            </button>
          </div>

          {/* Résumé des totaux */}
          {stocks.length > 0 && (
            <div className="total-summary" style={{
              background: 'linear-gradient(135deg, #2d8a5e 0%, #1e5e3f 100%)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              <div className="total-item">
                <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>Poids total</span>
                <span style={{ fontSize: '1.8rem', fontWeight: 700 }}>
                  {parseFloat(totaux.totalGlobal || 0).toFixed(1)} kg
                </span>
              </div>
              <div className="total-item">
                <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>Points avec stock</span>
                <span style={{ fontSize: '1.8rem', fontWeight: 700 }}>
                  {new Set(stocks.map(s => s.point_depot_id)).size}
                </span>
              </div>
              <div className="total-item">
                <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>Types de déchets</span>
                <span style={{ fontSize: '1.8rem', fontWeight: 700 }}>
                  {typesUniques}
                </span>
              </div>
            </div>
          )}

          {/* Filtres */}
          <div className="filters-bar">
            <div className="filters-grid">
              <div className="filter-group">
                <label>Recherche</label>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Nom du point, commune..."
                />
              </div>
              <div className="filter-group">
                <label>Type de déchet</label>
                <select name="typeDechet" value={filters.typeDechet} onChange={handleFilterChange}>
                  <option value="">Tous</option>
                  {typesDechet.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label>Commune</label>
                <input
                  type="text"
                  name="commune"
                  value={filters.commune}
                  onChange={handleFilterChange}
                  placeholder="Ex: Paris"
                />
              </div>
              <button className="btn-filter" onClick={applyFilters}>
                <FiFilter /> Filtrer
              </button>
              <button className="btn-reset" onClick={resetFilters}>
                <i className="fas fa-undo"></i> Réinitialiser
              </button>
            </div>
          </div>

          {/* Liste des stocks */}
          {stocks.length > 0 ? (
            <div className="stocks-grid">
              {stocks.map((stock) => (
                <div key={`${stock.point_depot_id}-${stock.type_dechet}`} className="stock-card">
                  <div className="stock-header">
                    <span className="stock-point">{stock.point_nom || 'Point de collecte'}</span>
                    <span className="stock-type">{recycleurService.getTypeLabel(stock.type_dechet)}</span>
                  </div>
                  
                  <div className="stock-location">
                    <FiMapPin />
                    <span>
                      {stock.quartier || 'Quartier non spécifié'}, {stock.commune || 'Commune non spécifiée'}
                    </span>
                  </div>

                  <div className="stock-quantity">
                    {parseFloat(stock.quantite_disponible || 0).toFixed(1)} <small>kg</small>
                  </div>

                  <div className="stock-footer">
                    <Link 
                      to={`/recycleur/demandes/nouvelle?point=${stock.point_depot_id}&type=${stock.type_dechet}`}
                      className="btn-demand"
                    >
                      <i className="fas fa-truck"></i> Demander
                    </Link>
                    <Link 
                      to={`/recycleur/points/${stock.point_depot_id}`}
                      className="btn-details"
                    >
                      <i className="fas fa-info-circle"></i> Détails
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <i className="fas fa-box-open"></i>
              <p>Aucun stock disponible pour le moment</p>
              <p style={{ color: '#5a655a', marginTop: '0.5rem' }}>
                Les stocks apparaîtront après les collectes et achats
              </p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default StocksList;