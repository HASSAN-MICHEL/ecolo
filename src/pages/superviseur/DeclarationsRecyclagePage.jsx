// // pages/Superviseur/DeclarationsRecyclagePage.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   FileText, CheckCircle, XCircle, Clock, Eye,
//   Filter, Search, RefreshCw, Info, Calendar,
//   User, Package, Download, Image, File, AlertCircle
// } from 'lucide-react';
// import toast from 'react-hot-toast';

// const DeclarationsRecyclagePage = () => {
//   const navigate = useNavigate();
//   const [declarations, setDeclarations] = useState([]);
//   const [stats, setStats] = useState({
//     total: 0,
//     en_attente: 0,
//     validees: 0,
//     total_kg: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [filtreStatut, setFiltreStatut] = useState('tous');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedDeclaration, setSelectedDeclaration] = useState(null);
//   const [showPreviewModal, setShowPreviewModal] = useState(false);
//   const [showValidationModal, setShowValidationModal] = useState(false);
//   const [motifRefus, setMotifRefus] = useState('');
//   const [user, setUser] = useState(null);

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
//     loadDeclarations();
//   }, [filtreStatut]);

//   const loadDeclarations = async () => {
//     const token = getToken();
//     setLoading(true);

//     try {
//       const url = new URL(`${API_URL}/api/superviseurs/declarations-recyclage`);
//       if (filtreStatut !== 'tous') {
//         url.searchParams.append('statut', filtreStatut);
//       }
//       if (searchTerm) {
//         url.searchParams.append('search', searchTerm);
//       }

//       const response = await fetch(url, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       const data = await response.json();

//       if (data.success) {
//         setDeclarations(data.declarations || []);
//         setStats(data.statistiques || {
//           total: 0,
//           en_attente: 0,
//           validees: 0,
//           total_kg: 0
//         });
//       }
//     } catch (error) {
//       console.error('Erreur chargement déclarations:', error);
//       toast.error('Erreur lors du chargement des déclarations');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await loadDeclarations();
//     setRefreshing(false);
//     toast.success('Données actualisées');
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     loadDeclarations();
//   };

//   const handleValider = async (declarationId) => {
//     const token = getToken();
//     try {
//       const response = await fetch(`${API_URL}/api/superviseurs/declarations-recyclage/${declarationId}/valider`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       const data = await response.json();
//       if (data.success) {
//         toast.success('✅ Déclaration validée avec succès');
//         setShowValidationModal(false);
//         setSelectedDeclaration(null);
//         loadDeclarations();
//       } else {
//         toast.error(data.message || 'Erreur lors de la validation');
//       }
//     } catch (error) {
//       console.error('Erreur:', error);
//       toast.error('Erreur lors de la validation');
//     }
//   };

//   const handleRefuser = async (declarationId) => {
//     if (!motifRefus.trim()) {
//       toast.error('Veuillez fournir un motif de refus');
//       return;
//     }

//     const token = getToken();
//     try {
//       const response = await fetch(`${API_URL}/api/superviseurs/declarations-recyclage/${declarationId}/refuser`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ motif: motifRefus })
//       });

//       const data = await response.json();
//       if (data.success) {
//         toast.success('❌ Déclaration refusée');
//         setShowValidationModal(false);
//         setSelectedDeclaration(null);
//         setMotifRefus('');
//         loadDeclarations();
//       } else {
//         toast.error(data.message || 'Erreur lors du refus');
//       }
//     } catch (error) {
//       console.error('Erreur:', error);
//       toast.error('Erreur lors du refus');
//     }
//   };

//   const getStatusBadge = (statut) => {
//     switch (statut) {
//       case 'en_attente':
//         return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center gap-1"><Clock size={12} /> En attente</span>;
//       case 'validee':
//         return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1"><CheckCircle size={12} /> Validée</span>;
//       case 'refusee':
//         return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center gap-1"><XCircle size={12} /> Refusée</span>;
//       default:
//         return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{statut}</span>;
//     }
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

//   const getCertificatIcon = (url) => {
//     if (!url) return <File className="text-gray-400" />;
//     if (url.endsWith('.pdf')) return <FileText className="text-red-500" />;
//     return <Image className="text-blue-500" />;
//   };

//   const getCertificatUrl = (path) => {
//     if (!path) return null;
//     return `${API_URL}${path}`;
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('fr-FR', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const filteredDeclarations = declarations.filter(d => {
//     if (!searchTerm) return true;
//     return (
//       d.recycleur_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       getTypeLabel(d.type_dechet).toLowerCase().includes(searchTerm.toLowerCase()) ||
//       d.id?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   });

//   const styles = `
//     .declarations-container {
//       padding: 1.5rem;
//     }

//     .header-actions {
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       margin-bottom: 2rem;
//     }

//     .stats-grid {
//       display: grid;
//       grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//       gap: 1rem;
//       margin-bottom: 2rem;
//     }

//     .stat-card {
//       background: white;
//       border-radius: 1rem;
//       padding: 1.5rem;
//       border: 1px solid #d9e0d9;
//       box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.05);
//     }

//     .stat-title {
//       font-size: 0.9rem;
//       color: #5a655a;
//       margin-bottom: 0.5rem;
//     }

//     .stat-value {
//       font-size: 2rem;
//       font-weight: 700;
//       color: #1a1e1a;
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

//     .declarations-grid {
//       display: grid;
//       grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
//       gap: 1.5rem;
//     }

//     .declaration-card {
//       background: white;
//       border-radius: 1rem;
//       padding: 1.5rem;
//       border: 1px solid #d9e0d9;
//       transition: all 0.3s;
//     }

//     .declaration-card:hover {
//       transform: translateY(-4px);
//       box-shadow: 0 8px 30px -8px rgba(102, 126, 234, 0.15);
//     }

//     .card-header {
//       display: flex;
//       justify-content: space-between;
//       align-items: start;
//       margin-bottom: 1rem;
//     }

//     .recycleur-info {
//       display: flex;
//       align-items: center;
//       gap: 0.5rem;
//       margin-bottom: 0.5rem;
//     }

//     .recycleur-name {
//       font-weight: 600;
//       color: #1a1e1a;
//     }

//     .declaration-type {
//       font-size: 1.1rem;
//       font-weight: 600;
//       color: #667eea;
//       margin: 0.5rem 0;
//     }

//     .declaration-quantity {
//       font-size: 1.8rem;
//       font-weight: 700;
//       color: #2d8a5e;
//       margin: 0.5rem 0;
//     }

//     .declaration-meta {
//       display: flex;
//       flex-direction: column;
//       gap: 0.5rem;
//       margin: 1rem 0;
//       padding: 1rem 0;
//       border-top: 1px solid #d9e0d9;
//       border-bottom: 1px solid #d9e0d9;
//     }

//     .meta-item {
//       display: flex;
//       align-items: center;
//       gap: 0.5rem;
//       color: #5a655a;
//       font-size: 0.9rem;
//     }

//     .certificat-section {
//       margin-top: 1rem;
//       padding: 1rem;
//       background: #f8faf8;
//       border-radius: 0.75rem;
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//     }

//     .certificat-info {
//       display: flex;
//       align-items: center;
//       gap: 0.5rem;
//     }

//     .action-buttons {
//       display: flex;
//       gap: 0.5rem;
//       margin-top: 1rem;
//     }

//     .btn-validate {
//       flex: 1;
//       background: #10b981;
//       color: white;
//       border: none;
//       padding: 0.6rem;
//       border-radius: 0.75rem;
//       font-weight: 600;
//       cursor: pointer;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       gap: 0.5rem;
//     }

//     .btn-validate:hover {
//       background: #059669;
//     }

//     .btn-reject {
//       flex: 1;
//       background: #ef4444;
//       color: white;
//       border: none;
//       padding: 0.6rem;
//       border-radius: 0.75rem;
//       font-weight: 600;
//       cursor: pointer;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       gap: 0.5rem;
//     }

//     .btn-reject:hover {
//       background: #dc2626;
//     }

//     .btn-view {
//       background: none;
//       border: none;
//       color: #667eea;
//       cursor: pointer;
//       padding: 0.5rem;
//       border-radius: 0.5rem;
//       transition: all 0.2s;
//     }

//     .btn-view:hover {
//       background: #e8f3e8;
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
//       max-width: 600px;
//       width: 90%;
//       max-height: 80vh;
//       overflow-y: auto;
//     }

//     .modal-title {
//       font-size: 1.3rem;
//       font-weight: 700;
//       color: #1a1e1a;
//       margin-bottom: 1.5rem;
//     }

//     .certificat-preview {
//       max-width: 100%;
//       max-height: 400px;
//       object-fit: contain;
//       margin-bottom: 1rem;
//     }

//     .pdf-preview {
//       width: 100%;
//       height: 400px;
//       border: 1px solid #d9e0d9;
//       border-radius: 0.5rem;
//     }

//     .modal-actions {
//       display: flex;
//       gap: 1rem;
//       justify-content: flex-end;
//       margin-top: 2rem;
//     }

//     .btn-primary {
//       background: #667eea;
//       color: white;
//       border: none;
//       padding: 0.75rem 1.5rem;
//       border-radius: 0.75rem;
//       font-weight: 600;
//       cursor: pointer;
//     }

//     .btn-primary:hover {
//       background: #5a67d8;
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

//     .empty-state i {
//       font-size: 3rem;
//       color: #d9e0d9;
//       margin-bottom: 1rem;
//     }

//     @media (max-width: 768px) {
//       .filters-bar {
//         flex-direction: column;
//       }
      
//       .search-bar {
//         width: 100%;
//       }
      
//       .declarations-grid {
//         grid-template-columns: 1fr;
//       }
      
//       .action-buttons {
//         flex-direction: column;
//       }
//     }
//   `;

//   if (loading) {
//     return (
//       <div className="p-8 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Chargement des déclarations...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <style>{styles}</style>
//       <div className="declarations-container">
//         {/* En-tête */}
//         <div className="header-actions">
//           <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a1e1a' }}>
//             Déclarations de recyclage
//           </h1>
//           <button 
//             className="refresh-btn"
//             onClick={handleRefresh}
//             disabled={refreshing}
//           >
//             <RefreshCw size={18} className={refreshing ? 'fa-spin' : ''} />
//             Actualiser
//           </button>
//         </div>

//         {/* Statistiques */}
//         <div className="stats-grid">
//           <div className="stat-card">
//             <div className="stat-title">Total déclarations</div>
//             <div className="stat-value">{stats.total}</div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-title">En attente</div>
//             <div className="stat-value text-yellow-600">{stats.en_attente}</div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-title">Validées</div>
//             <div className="stat-value text-green-600">{stats.validees}</div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-title">Total KG recyclés</div>
//             <div className="stat-value text-blue-600">{parseFloat(stats.total_kg).toFixed(1)} kg</div>
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
//             className={`filter-btn ${filtreStatut === 'en_attente' ? 'active' : ''}`}
//             onClick={() => setFiltreStatut('en_attente')}
//           >
//             <Clock size={16} />
//             En attente
//           </button>
//           <button 
//             className={`filter-btn ${filtreStatut === 'validee' ? 'active' : ''}`}
//             onClick={() => setFiltreStatut('validee')}
//           >
//             <CheckCircle size={16} />
//             Validées
//           </button>
//           <button 
//             className={`filter-btn ${filtreStatut === 'refusee' ? 'active' : ''}`}
//             onClick={() => setFiltreStatut('refusee')}
//           >
//             <XCircle size={16} />
//             Refusées
//           </button>
          
//           <form onSubmit={handleSearch} className="search-bar">
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Rechercher par recycleur, type..."
//               className="search-input"
//             />
//             <button type="submit" className="filter-btn">
//               <Search size={16} />
//               Rechercher
//             </button>
//           </form>
//         </div>

//         {/* Liste des déclarations */}
//         {filteredDeclarations.length > 0 ? (
//           <div className="declarations-grid">
//             {filteredDeclarations.map((declaration) => (
//               <div key={declaration.id} className="declaration-card">
//                 <div className="card-header">
//                   <div>
//                     <div className="recycleur-info">
//                       <User size={16} className="text-gray-400" />
//                       <span className="recycleur-name">{declaration.recycleur_nom}</span>
//                     </div>
//                     <div className="declaration-type">
//                       {getTypeLabel(declaration.type_dechet)}
//                     </div>
//                   </div>
//                   {getStatusBadge(declaration.statut)}
//                 </div>

//                 <div className="declaration-quantity">
//                   {parseFloat(declaration.quantite_recyclee).toFixed(1)} kg
//                 </div>

//                 <div className="declaration-meta">
//                   <div className="meta-item">
//                     <Calendar size={16} />
//                     <span>Recyclé le {formatDate(declaration.date_recyclage)}</span>
//                   </div>
//                   <div className="meta-item">
//                     <Package size={16} />
//                     <span>Déclaration #{declaration.id.substring(0, 8)}</span>
//                   </div>
//                 </div>

//                 {/* Certificat */}
//                 {declaration.certificat_url ? (
//                   <div className="certificat-section">
//                     <div className="certificat-info">
//                       {getCertificatIcon(declaration.certificat_url)}
//                       <span className="text-sm text-gray-600">
//                         Certificat joint
//                       </span>
//                     </div>
//                     <button
//                       className="btn-view"
//                       onClick={() => {
//                         setSelectedDeclaration(declaration);
//                         setShowPreviewModal(true);
//                       }}
//                       title="Voir le certificat"
//                     >
//                       <Eye size={18} />
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="certificat-section" style={{ background: '#fff3e0' }}>
//                     <span className="text-sm text-gray-500">Aucun certificat</span>
//                   </div>
//                 )}

//                 {/* Actions pour les déclarations en attente */}
//                 {declaration.statut === 'en_attente' && (
//                   <div className="action-buttons">
//                     <button
//                       className="btn-validate"
//                       onClick={() => {
//                         setSelectedDeclaration(declaration);
//                         setShowValidationModal(true);
//                       }}
//                     >
//                       <CheckCircle size={16} />
//                       Valider
//                     </button>
//                     <button
//                       className="btn-reject"
//                       onClick={() => {
//                         setSelectedDeclaration(declaration);
//                         setMotifRefus('');
//                         setShowValidationModal(true);
//                       }}
//                     >
//                       <XCircle size={16} />
//                       Refuser
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="empty-state">
//             <FileText size={48} className="mx-auto mb-4 text-gray-300" />
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune déclaration trouvée</h3>
//             <p className="text-gray-600">Il n'y a pas de déclaration correspondant aux critères</p>
//           </div>
//         )}

//         {/* Modal de prévisualisation du certificat */}
//         {showPreviewModal && selectedDeclaration && (
//           <div className="modal-overlay" onClick={() => setShowPreviewModal(false)}>
//             <div className="modal-content" onClick={e => e.stopPropagation()}>
//               <h3 className="modal-title">
//                 Certificat - {getTypeLabel(selectedDeclaration.type_dechet)}
//               </h3>
              
//               {selectedDeclaration.certificat_url && (
//                 <>
//                   {selectedDeclaration.certificat_url.endsWith('.pdf') ? (
//                     <iframe
//                       src={getCertificatUrl(selectedDeclaration.certificat_url)}
//                       className="pdf-preview"
//                       title="Certificat PDF"
//                     />
//                   ) : (
//                     <img
//                       src={getCertificatUrl(selectedDeclaration.certificat_url)}
//                       alt="Certificat"
//                       className="certificat-preview"
//                     />
//                   )}
                  
//                   <div className="modal-actions">
//                     <a
//                       href={getCertificatUrl(selectedDeclaration.certificat_url)}
//                       download
//                       className="btn-primary"
//                       style={{ textDecoration: 'none' }}
//                     >
//                       <Download size={16} /> Télécharger
//                     </a>
//                     <button
//                       className="btn-secondary"
//                       onClick={() => setShowPreviewModal(false)}
//                     >
//                       Fermer
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Modal de validation/refus */}
//         {showValidationModal && selectedDeclaration && (
//           <div className="modal-overlay" onClick={() => setShowValidationModal(false)}>
//             <div className="modal-content" onClick={e => e.stopPropagation()}>
//               <h3 className="modal-title">
//                 {motifRefus === undefined ? 'Valider la déclaration' : 'Refuser la déclaration'}
//               </h3>
              
//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
//                 <p><strong>Recycleur:</strong> {selectedDeclaration.recycleur_nom}</p>
//                 <p><strong>Type:</strong> {getTypeLabel(selectedDeclaration.type_dechet)}</p>
//                 <p><strong>Quantité:</strong> {parseFloat(selectedDeclaration.quantite_recyclee).toFixed(1)} kg</p>
//                 <p><strong>Date:</strong> {formatDate(selectedDeclaration.date_recyclage)}</p>
//               </div>

//               {motifRefus !== undefined && (
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Motif du refus
//                   </label>
//                   <textarea
//                     value={motifRefus}
//                     onChange={(e) => setMotifRefus(e.target.value)}
//                     rows="3"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
//                     placeholder="Expliquez la raison du refus..."
//                   />
//                 </div>
//               )}

//               <div className="modal-actions">
//                 <button
//                   className="btn-secondary"
//                   onClick={() => {
//                     setShowValidationModal(false);
//                     setSelectedDeclaration(null);
//                     setMotifRefus('');
//                   }}
//                 >
//                   Annuler
//                 </button>
//                 {motifRefus === undefined ? (
//                   <button
//                     className="btn-primary"
//                     onClick={() => handleValider(selectedDeclaration.id)}
//                     style={{ background: '#10b981' }}
//                   >
//                     <CheckCircle size={16} /> Valider
//                   </button>
//                 ) : (
//                   <button
//                     className="btn-primary"
//                     onClick={() => handleRefuser(selectedDeclaration.id)}
//                     style={{ background: '#ef4444' }}
//                   >
//                     <XCircle size={16} /> Confirmer le refus
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default DeclarationsRecyclagePage;


// pages/Superviseur/DeclarationsRecyclagePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, CheckCircle, XCircle, Clock, Eye,
  Filter, Search, RefreshCw, Info, Calendar,
  User, Package, Download, Image, File, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const DeclarationsRecyclagePage = () => {
  const navigate = useNavigate();
  const [declarations, setDeclarations] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    en_attente: 0,
    validees: 0,
    total_kg: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtreStatut, setFiltreStatut] = useState('tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeclaration, setSelectedDeclaration] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [motifRefus, setMotifRefus] = useState('');
  const [user, setUser] = useState(null);

  // const API_URL = 'http://localhost:3000';
  const API_URL = 'https://ecobackend-zeds.vercel.app';
  const STORAGE_KEYS = {
    TOKEN: 'ecocollect_token',
    USER: 'ecocollect_user',
    ROLE: 'ecocollect_role'
  };

  const getToken = () => localStorage.getItem(STORAGE_KEYS.TOKEN);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
    setUser(userData);
    loadDeclarations();
  }, [filtreStatut]);

  const loadDeclarations = async () => {
    const token = getToken();
    setLoading(true);

    try {
      const url = new URL(`${API_URL}/api/superviseurs/declarations-recyclage`);
      if (filtreStatut !== 'tous') {
        url.searchParams.append('statut', filtreStatut);
      }
      if (searchTerm) {
        url.searchParams.append('search', searchTerm);
      }

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.success) {
        setDeclarations(data.declarations || []);
        setStats(data.statistiques || {
          total: 0,
          en_attente: 0,
          validees: 0,
          total_kg: 0
        });
      }
    } catch (error) {
      console.error('Erreur chargement déclarations:', error);
      toast.error('Erreur lors du chargement des déclarations');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDeclarations();
    setRefreshing(false);
    toast.success('Données actualisées');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadDeclarations();
  };

  const handleValider = async (declarationId) => {
    const token = getToken();
    try {
      const response = await fetch(`${API_URL}/api/superviseurs/declarations-recyclage/${declarationId}/valider`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        toast.success('✅ Déclaration validée avec succès');
        setShowValidationModal(false);
        setSelectedDeclaration(null);
        setMotifRefus('');
        loadDeclarations();
      } else {
        toast.error(data.message || 'Erreur lors de la validation');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la validation');
    }
  };

  const handleRefuser = async (declarationId) => {
    if (!motifRefus.trim()) {
      toast.error('Veuillez fournir un motif de refus');
      return;
    }

    const token = getToken();
    try {
      const response = await fetch(`${API_URL}/api/superviseurs/declarations-recyclage/${declarationId}/refuser`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ motif: motifRefus })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('❌ Déclaration refusée');
        setShowValidationModal(false);
        setSelectedDeclaration(null);
        setMotifRefus('');
        loadDeclarations();
      } else {
        toast.error(data.message || 'Erreur lors du refus');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du refus');
    }
  };

  const getStatusBadge = (statut) => {
    switch (statut) {
      case 'en_attente':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center gap-1"><Clock size={12} /> En attente</span>;
      case 'validee':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1"><CheckCircle size={12} /> Validée</span>;
      case 'refusee':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center gap-1"><XCircle size={12} /> Refusée</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{statut}</span>;
    }
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

  const getCertificatIcon = (url) => {
    if (!url) return <File className="text-gray-400" />;
    if (url.endsWith('.pdf')) return <FileText className="text-red-500" />;
    return <Image className="text-blue-500" />;
  };

  const getCertificatUrl = (path) => {
    if (!path) return null;
    return `${API_URL}${path}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredDeclarations = declarations.filter(d => {
    if (!searchTerm) return true;
    return (
      d.recycleur_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getTypeLabel(d.type_dechet).toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const styles = `
    .declarations-container {
      padding: 1.5rem;
    }

    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 1rem;
      padding: 1.5rem;
      border: 1px solid #d9e0d9;
      box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.05);
    }

    .stat-title {
      font-size: 0.9rem;
      color: #5a655a;
      margin-bottom: 0.5rem;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #1a1e1a;
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

    .declarations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .declaration-card {
      background: white;
      border-radius: 1rem;
      padding: 1.5rem;
      border: 1px solid #d9e0d9;
      transition: all 0.3s;
    }

    .declaration-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px -8px rgba(102, 126, 234, 0.15);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 1rem;
    }

    .recycleur-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .recycleur-name {
      font-weight: 600;
      color: #1a1e1a;
    }

    .declaration-type {
      font-size: 1.1rem;
      font-weight: 600;
      color: #667eea;
      margin: 0.5rem 0;
    }

    .declaration-quantity {
      font-size: 1.8rem;
      font-weight: 700;
      color: #2d8a5e;
      margin: 0.5rem 0;
    }

    .declaration-meta {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin: 1rem 0;
      padding: 1rem 0;
      border-top: 1px solid #d9e0d9;
      border-bottom: 1px solid #d9e0d9;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #5a655a;
      font-size: 0.9rem;
    }

    .certificat-section {
      margin-top: 1rem;
      padding: 1rem;
      background: #f8faf8;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .certificat-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .btn-validate {
      flex: 1;
      background: #10b981;
      color: white;
      border: none;
      padding: 0.6rem;
      border-radius: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-validate:hover {
      background: #059669;
    }

    .btn-reject {
      flex: 1;
      background: #ef4444;
      color: white;
      border: none;
      padding: 0.6rem;
      border-radius: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-reject:hover {
      background: #dc2626;
    }

    .btn-view {
      background: none;
      border: none;
      color: #667eea;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 0.5rem;
      transition: all 0.2s;
    }

    .btn-view:hover {
      background: #e8f3e8;
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
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }

    .modal-title {
      font-size: 1.3rem;
      font-weight: 700;
      color: #1a1e1a;
      margin-bottom: 1.5rem;
    }

    .certificat-preview {
      max-width: 100%;
      max-height: 400px;
      object-fit: contain;
      margin-bottom: 1rem;
    }

    .pdf-preview {
      width: 100%;
      height: 400px;
      border: 1px solid #d9e0d9;
      border-radius: 0.5rem;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .btn-primary {
      background: #667eea;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-primary:hover {
      background: #5a67d8;
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

    .empty-state i {
      font-size: 3rem;
      color: #d9e0d9;
      margin-bottom: 1rem;
    }

    @media (max-width: 768px) {
      .filters-bar {
        flex-direction: column;
      }
      
      .search-bar {
        width: 100%;
      }
      
      .declarations-grid {
        grid-template-columns: 1fr;
      }
      
      .action-buttons {
        flex-direction: column;
      }
    }
  `;

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des déclarations...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="declarations-container">
        {/* En-tête */}
        <div className="header-actions">
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a1e1a' }}>
            Déclarations de recyclage
          </h1>
          <button 
            className="refresh-btn"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={18} className={refreshing ? 'fa-spin' : ''} />
            Actualiser
          </button>
        </div>

        {/* Statistiques */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">Total déclarations</div>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">En attente</div>
            <div className="stat-value text-yellow-600">{stats.en_attente}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Validées</div>
            <div className="stat-value text-green-600">{stats.validees}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Total KG recyclés</div>
            <div className="stat-value text-blue-600">{parseFloat(stats.total_kg).toFixed(1)} kg</div>
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
            className={`filter-btn ${filtreStatut === 'en_attente' ? 'active' : ''}`}
            onClick={() => setFiltreStatut('en_attente')}
          >
            <Clock size={16} />
            En attente
          </button>
          <button 
            className={`filter-btn ${filtreStatut === 'validee' ? 'active' : ''}`}
            onClick={() => setFiltreStatut('validee')}
          >
            <CheckCircle size={16} />
            Validées
          </button>
          <button 
            className={`filter-btn ${filtreStatut === 'refusee' ? 'active' : ''}`}
            onClick={() => setFiltreStatut('refusee')}
          >
            <XCircle size={16} />
            Refusées
          </button>
          
          <form onSubmit={handleSearch} className="search-bar">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par recycleur, type..."
              className="search-input"
            />
            <button type="submit" className="filter-btn">
              <Search size={16} />
              Rechercher
            </button>
          </form>
        </div>

        {/* Liste des déclarations */}
        {filteredDeclarations.length > 0 ? (
          <div className="declarations-grid">
            {filteredDeclarations.map((declaration) => (
              <div key={declaration.id} className="declaration-card">
                <div className="card-header">
                  <div>
                    <div className="recycleur-info">
                      <User size={16} className="text-gray-400" />
                      <span className="recycleur-name">{declaration.recycleur_nom}</span>
                    </div>
                    <div className="declaration-type">
                      {getTypeLabel(declaration.type_dechet)}
                    </div>
                  </div>
                  {getStatusBadge(declaration.statut)}
                </div>

                <div className="declaration-quantity">
                  {parseFloat(declaration.quantite_recyclee).toFixed(1)} kg
                </div>

                <div className="declaration-meta">
                  <div className="meta-item">
                    <Calendar size={16} />
                    <span>Recyclé le {formatDate(declaration.date_recyclage)}</span>
                  </div>
                  <div className="meta-item">
                    <Package size={16} />
                    <span>Déclaration #{declaration.id.substring(0, 8)}</span>
                  </div>
                </div>

                {/* Certificat */}
                {declaration.certificat_url ? (
                  <div className="certificat-section">
                    <div className="certificat-info">
                      {getCertificatIcon(declaration.certificat_url)}
                      <span className="text-sm text-gray-600">
                        Certificat joint
                      </span>
                    </div>
                    <button
                      className="btn-view"
                      onClick={() => {
                        setSelectedDeclaration(declaration);
                        setShowPreviewModal(true);
                      }}
                      title="Voir le certificat"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="certificat-section" style={{ background: '#fff3e0' }}>
                    <span className="text-sm text-gray-500">Aucun certificat</span>
                  </div>
                )}

                {/* Actions pour les déclarations en attente */}
                {declaration.statut === 'en_attente' && (
                  <div className="action-buttons">
                    <button
                      className="btn-validate"
                      onClick={() => {
                        setSelectedDeclaration(declaration);
                        setMotifRefus(null);  // null pour la validation
                        setShowValidationModal(true);
                      }}
                    >
                      <CheckCircle size={16} />
                      Valider
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => {
                        setSelectedDeclaration(declaration);
                        setMotifRefus('');  // chaîne vide pour le refus
                        setShowValidationModal(true);
                      }}
                    >
                      <XCircle size={16} />
                      Refuser
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FileText size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune déclaration trouvée</h3>
            <p className="text-gray-600">Il n'y a pas de déclaration correspondant aux critères</p>
          </div>
        )}

        {/* Modal de prévisualisation du certificat */}
        {showPreviewModal && selectedDeclaration && (
          <div className="modal-overlay" onClick={() => setShowPreviewModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3 className="modal-title">
                Certificat - {getTypeLabel(selectedDeclaration.type_dechet)}
              </h3>
              
              {selectedDeclaration.certificat_url && (
                <>
                  {selectedDeclaration.certificat_url.endsWith('.pdf') ? (
                    <iframe
                      src={getCertificatUrl(selectedDeclaration.certificat_url)}
                      className="pdf-preview"
                      title="Certificat PDF"
                    />
                  ) : (
                    <img
                      src={getCertificatUrl(selectedDeclaration.certificat_url)}
                      alt="Certificat"
                      className="certificat-preview"
                    />
                  )}
                  
                  <div className="modal-actions">
                    <a
                      href={getCertificatUrl(selectedDeclaration.certificat_url)}
                      download
                      className="btn-primary"
                      style={{ textDecoration: 'none' }}
                    >
                      <Download size={16} /> Télécharger
                    </a>
                    <button
                      className="btn-secondary"
                      onClick={() => setShowPreviewModal(false)}
                    >
                      Fermer
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ✅ UN SEUL MODAL de validation/refus (j'ai supprimé le deuxième) */}
        {showValidationModal && selectedDeclaration && (
          <div className="modal-overlay" onClick={() => setShowValidationModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3 className="modal-title">
                {motifRefus === null ? 'Valider la déclaration' : 'Refuser la déclaration'}
              </h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p><strong>Recycleur:</strong> {selectedDeclaration.recycleur_nom}</p>
                <p><strong>Type:</strong> {getTypeLabel(selectedDeclaration.type_dechet)}</p>
                <p><strong>Quantité:</strong> {parseFloat(selectedDeclaration.quantite_recyclee).toFixed(1)} kg</p>
                <p><strong>Date:</strong> {formatDate(selectedDeclaration.date_recyclage)}</p>
              </div>

              {motifRefus !== null && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motif du refus <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={motifRefus}
                    onChange={(e) => setMotifRefus(e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
                    placeholder="Expliquez la raison du refus..."
                    required
                  />
                </div>
              )}

              <div className="modal-actions">
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setShowValidationModal(false);
                    setSelectedDeclaration(null);
                    setMotifRefus('');
                  }}
                >
                  Annuler
                </button>
                {motifRefus === null ? (
                  <button
                    className="btn-primary"
                    onClick={() => handleValider(selectedDeclaration.id)}
                    style={{ background: '#10b981' }}
                  >
                    <CheckCircle size={16} /> Valider
                  </button>
                ) : (
                  <button
                    className="btn-primary"
                    onClick={() => handleRefuser(selectedDeclaration.id)}
                    style={{ background: '#ef4444' }}
                    disabled={!motifRefus.trim()}
                  >
                    <XCircle size={16} /> Confirmer le refus
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DeclarationsRecyclagePage;