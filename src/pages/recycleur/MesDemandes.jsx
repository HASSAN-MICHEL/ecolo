// import React, { useState, useEffect } from 'react';
// import { useLocation, Link } from 'react-router-dom';
// import DashboardLayout from '../../Layouts/LayoutDashboard';
// import recycleurService from '../../services/recycleurService';
// import { FiFilter, FiEye, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
// import toast from 'react-hot-toast';

// const MesDemandes = () => {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
  
//   const [demandes, setDemandes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filtreStatut, setFiltreStatut] = useState(queryParams.get('statut') || 'tous');
//   const [selectedDemande, setSelectedDemande] = useState(null);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [quantiteRecue, setQuantiteRecue] = useState('');
//   const [notesConfirmation, setNotesConfirmation] = useState('');
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const userData = JSON.parse(localStorage.getItem('ecocollect_user'));
//     setUser(userData);
//     loadDemandes();
//   }, [filtreStatut]);

//   const loadDemandes = async () => {
//     try {
//       setLoading(true);
//       const statut = filtreStatut !== 'tous' ? filtreStatut : null;
//       const data = await recycleurService.getMesDemandes(statut);
//       setDemandes(data.demandes || []);
//     } catch (error) {
//       console.error('Erreur chargement demandes:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConfirmerReception = async () => {
//     if (!quantiteRecue || parseFloat(quantiteRecue) <= 0) {
//       toast.error('Veuillez entrer une quantité valide');
//       return;
//     }

//     try {
//       const response = await recycleurService.confirmerReception(
//         selectedDemande.id,
//         parseFloat(quantiteRecue),
//         notesConfirmation
//       );

//       if (response.success) {
//         toast.success('Réception confirmée avec succès !');
//         setShowConfirmModal(false);
//         setSelectedDemande(null);
//         setQuantiteRecue('');
//         setNotesConfirmation('');
//         loadDemandes();
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Erreur lors de la confirmation');
//     }
//   };

//   const getStatusBadge = (statut) => {
//     const badges = {
//       'en_attente': { 
//         color: 'bg-yellow-100 text-yellow-800', 
//         icon: FiClock,
//         label: 'En attente' 
//       },
//       'acceptee': { 
//         color: 'bg-green-100 text-green-800', 
//         icon: FiCheckCircle,
//         label: 'Acceptée' 
//       },
//       'realisee': { 
//         color: 'bg-blue-100 text-blue-800', 
//         icon: FiCheckCircle,
//         label: 'Réalisée' 
//       },
//       'refusee': { 
//         color: 'bg-red-100 text-red-800', 
//         icon: FiXCircle,
//         label: 'Refusée' 
//       },
//     };
//     return badges[statut] || badges.en_attente;
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('fr-FR', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     });
//   };

//   const styles = `
//     .filters-bar {
//       display: flex;
//       gap: 1rem;
//       margin-bottom: 2rem;
//       flex-wrap: wrap;
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
//       background: #2d8a5e;
//       color: white;
//       border-color: #2d8a5e;
//     }

//     .filter-btn:hover:not(.active) {
//       background: #e8f3e8;
//     }

//     .demandes-table {
//       background: white;
//       border-radius: 1rem;
//       border: 1px solid #d9e0d9;
//       overflow: hidden;
//     }

//     .table-header {
//       display: grid;
//       grid-template-columns: 1fr 2fr 2fr 1.5fr 1.5fr 1.5fr 1fr;
//       background: #f8faf8;
//       padding: 1rem;
//       font-weight: 600;
//       color: #1a1e1a;
//       border-bottom: 2px solid #d9e0d9;
//     }

//     .table-row {
//       display: grid;
//       grid-template-columns: 1fr 2fr 2fr 1.5fr 1.5fr 1.5fr 1fr;
//       padding: 1rem;
//       border-bottom: 1px solid #d9e0d9;
//       align-items: center;
//     }

//     .table-row:hover {
//       background: #f8faf8;
//     }

//     .badge {
//       padding: 0.25rem 0.75rem;
//       border-radius: 100px;
//       font-size: 0.75rem;
//       font-weight: 600;
//       display: inline-flex;
//       align-items: center;
//       gap: 0.25rem;
//       width: fit-content;
//     }

//     .action-btn {
//       background: none;
//       border: none;
//       color: #2d8a5e;
//       cursor: pointer;
//       font-size: 1.2rem;
//       padding: 0.5rem;
//       border-radius: 0.5rem;
//       transition: all 0.2s;
//     }

//     .action-btn:hover {
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
//       max-width: 500px;
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

//     .modal-actions {
//       display: flex;
//       gap: 1rem;
//       justify-content: flex-end;
//       margin-top: 2rem;
//     }

//     .empty-state {
//       text-align: center;
//       padding: 3rem;
//       color: #5a655a;
//     }

//     .empty-state i {
//       font-size: 3rem;
//       color: #d9e0d9;
//       margin-bottom: 1rem;
//     }

//     @media (max-width: 1024px) {
//       .table-header, .table-row {
//         grid-template-columns: 1fr 2fr 2fr 1.5fr 1.5fr 1.5fr;
//       }
      
//       .col-actions {
//         display: none;
//       }
//     }

//     @media (max-width: 768px) {
//       .demandes-table {
//         overflow-x: auto;
//       }
      
//       .table-header, .table-row {
//         min-width: 800px;
//       }
//     }
//   `;

//   if (loading) {
//     return (
//       <DashboardLayout title="Mes demandes" user={user}>
//         <div style={{ textAlign: 'center', padding: '3rem' }}>
//           <div className="spinner" style={{ margin: '0 auto' }}></div>
//           <p style={{ marginTop: '1rem', color: '#5a655a' }}>Chargement...</p>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <>
//       <style>{styles}</style>
//       <DashboardLayout title="Mes demandes d'enlèvement" user={user}>
//         {/* Filtres */}
//         <div className="filters-bar">
//           <button 
//             className={`filter-btn ${filtreStatut === 'tous' ? 'active' : ''}`}
//             onClick={() => setFiltreStatut('tous')}
//           >
//             <FiFilter /> Toutes
//           </button>
//           <button 
//             className={`filter-btn ${filtreStatut === 'en_attente' ? 'active' : ''}`}
//             onClick={() => setFiltreStatut('en_attente')}
//           >
//             <FiClock /> En attente
//           </button>
//           <button 
//             className={`filter-btn ${filtreStatut === 'acceptee' ? 'active' : ''}`}
//             onClick={() => setFiltreStatut('acceptee')}
//           >
//             <FiCheckCircle /> Acceptées
//           </button>
//           <button 
//             className={`filter-btn ${filtreStatut === 'realisee' ? 'active' : ''}`}
//             onClick={() => setFiltreStatut('realisee')}
//           >
//             <FiCheckCircle /> Réalisées
//           </button>
//         </div>

//         {/* Tableau des demandes */}
//         {demandes.length > 0 ? (
//           <div className="demandes-table">
//             <div className="table-header">
//               <div>N° Demande</div>
//               <div>Point de dépôt</div>
//               <div>Type de déchet</div>
//               <div>Quantité</div>
//               <div>Date souhaitée</div>
//               <div>Statut</div>
//               <div className="col-actions">Actions</div>
//             </div>

//             {demandes.map((demande) => {
//               const status = getStatusBadge(demande.statut);
//               const StatusIcon = status.icon;
              
//               return (
//                 <div key={demande.id} className="table-row">
//                   <div className="col-id">#{demande.id.substring(0, 8)}</div>
//                   <div className="col-point">{demande.nom_point || 'Point de collecte'}</div>
//                   <div className="col-type">{demande.type_dechet}</div>
//                   <div className="col-quantite">{demande.quantite_demandee} kg</div>
//                   <div className="col-date">{formatDate(demande.date_souhaitee)}</div>
//                   <div className="col-status">
//                     <span className={`badge ${status.color}`}>
//                       <StatusIcon size={12} />
//                       {status.label}
//                     </span>
//                   </div>
//                   <div className="col-actions">
//                     {demande.statut === 'acceptee' && (
//                       <button 
//                         className="action-btn"
//                         onClick={() => {
//                           setSelectedDemande(demande);
//                           setQuantiteRecue(demande.quantite_demandee);
//                           setShowConfirmModal(true);
//                         }}
//                         title="Confirmer réception"
//                       >
//                         <i className="fas fa-check-circle"></i>
//                       </button>
//                     )}
//                     <button 
//                       className="action-btn"
//                       onClick={() => window.location.href = `/recycleur/demandes/${demande.id}`}
//                       title="Voir détails"
//                     >
//                       <FiEye />
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         ) : (
//           <div className="empty-state">
//             <i className="fas fa-inbox"></i>
//             <p>Aucune demande trouvée</p>
//             <Link to="/recycleur/demandes/nouvelle" style={{ color: '#2d8a5e' }}>
//               Créer une demande
//             </Link>
//           </div>
//         )}

//         {/* Modal de confirmation de réception */}
//         {showConfirmModal && selectedDemande && (
//           <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
//             <div className="modal-content" onClick={e => e.stopPropagation()}>
//               <h3 className="modal-title">Confirmer la réception</h3>
              
//               <div style={{ marginBottom: '1rem' }}>
//                 <p><strong>Demande:</strong> #{selectedDemande.id.substring(0, 8)}</p>
//                 <p><strong>Type:</strong> {selectedDemande.type_dechet}</p>
//                 <p><strong>Quantité demandée:</strong> {selectedDemande.quantite_demandee} kg</p>
//               </div>

//               <div className="form-group">
//                 <label>Quantité reçue (kg) *</label>
//                 <input
//                   type="number"
//                   value={quantiteRecue}
//                   onChange={(e) => setQuantiteRecue(e.target.value)}
//                   min="0.1"
//                   step="0.1"
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Notes (optionnel)</label>
//                 <textarea
//                   value={notesConfirmation}
//                   onChange={(e) => setNotesConfirmation(e.target.value)}
//                   rows="3"
//                   placeholder="Observations sur la réception..."
//                 />
//               </div>

//               <div className="modal-actions">
//                 <button 
//                   className="btn-secondary"
//                   onClick={() => {
//                     setShowConfirmModal(false);
//                     setSelectedDemande(null);
//                     setQuantiteRecue('');
//                     setNotesConfirmation('');
//                   }}
//                 >
//                   Annuler
//                 </button>
//                 <button 
//                   className="btn-primary"
//                   onClick={handleConfirmerReception}
//                 >
//                   Confirmer la réception
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </DashboardLayout>
//     </>
//   );
// };

// export default MesDemandes;


// pages/Recycleur/Demandes.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import DashboardLayout from '../../Layouts/LayoutDashboard';
import recycleurService from '../../services/recycleurService';
import { FiFilter, FiEye, FiCheckCircle, FiXCircle, FiClock, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';

const MesDemandes = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtreStatut, setFiltreStatut] = useState(queryParams.get('statut') || 'tous');
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [quantiteRecue, setQuantiteRecue] = useState('');
  const [notesConfirmation, setNotesConfirmation] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('ecocollect_user'));
    setUser(userData);
    loadDemandes();
  }, [filtreStatut]);

  const loadDemandes = async () => {
    try {
      setLoading(true);
      const statut = filtreStatut !== 'tous' ? filtreStatut : null;
      const data = await recycleurService.getMesDemandes(statut);
      setDemandes(data.demandes || []);
    } catch (error) {
      console.error('Erreur chargement demandes:', error);
      toast.error('Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDemandes();
    setRefreshing(false);
    toast.success('Données actualisées');
  };

  const handleConfirmerReception = async () => {
    if (!quantiteRecue || parseFloat(quantiteRecue) <= 0) {
      toast.error('Veuillez entrer une quantité valide');
      return;
    }

    try {
      const response = await recycleurService.confirmerReception(
        selectedDemande.id,
        parseFloat(quantiteRecue),
        notesConfirmation
      );

      if (response.success) {
        toast.success('Réception confirmée avec succès !');
        setShowConfirmModal(false);
        setSelectedDemande(null);
        setQuantiteRecue('');
        setNotesConfirmation('');
        loadDemandes();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la confirmation');
    }
  };

  const getStatusBadge = (statut) => {
    const badges = {
      'en_attente': { 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: FiClock,
        label: 'En attente' 
      },
      'validee': { 
        color: 'bg-green-100 text-green-800', 
        icon: FiCheckCircle,
        label: 'Validée' 
      },
      'acceptee': { 
        color: 'bg-green-100 text-green-800', 
        icon: FiCheckCircle,
        label: 'Acceptée' 
      },
      'realisee': { 
        color: 'bg-blue-100 text-blue-800', 
        icon: FiCheckCircle,
        label: 'Réalisée' 
      },
      'refusee': { 
        color: 'bg-red-100 text-red-800', 
        icon: FiXCircle,
        label: 'Refusée' 
      },
    };
    return badges[statut] || badges.en_attente;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const styles = `
    .demandes-container {
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
      background: #2d8a5e;
      color: white;
      border-color: #2d8a5e;
    }

    .filter-btn:hover:not(.active) {
      background: #e8f3e8;
    }

    .new-demand-btn {
      background: #2d8a5e;
      color: white;
      border: none;
      padding: 0.6rem 1.5rem;
      border-radius: 100px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
    }

    .new-demand-btn:hover {
      background: #1e5e3f;
    }

    .demandes-table {
      background: white;
      border-radius: 1rem;
      border: 1px solid #d9e0d9;
      overflow: hidden;
    }

    .table-header {
      display: grid;
      grid-template-columns: 1fr 2fr 2fr 1.5fr 1.5fr 1.5fr 1fr;
      background: #f8faf8;
      padding: 1rem;
      font-weight: 600;
      color: #1a1e1a;
      border-bottom: 2px solid #d9e0d9;
    }

    .table-row {
      display: grid;
      grid-template-columns: 1fr 2fr 2fr 1.5fr 1.5fr 1.5fr 1fr;
      padding: 1rem;
      border-bottom: 1px solid #d9e0d9;
      align-items: center;
      transition: background 0.2s;
    }

    .table-row:hover {
      background: #f8faf8;
    }

    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 100px;
      font-size: 0.75rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      width: fit-content;
    }

    .action-btn {
      background: none;
      border: none;
      color: #2d8a5e;
      cursor: pointer;
      font-size: 1.2rem;
      padding: 0.5rem;
      border-radius: 0.5rem;
      transition: all 0.2s;
    }

    .action-btn:hover {
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
      max-width: 500px;
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

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #1a1e1a;
    }

    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1.5px solid #d9e0d9;
      border-radius: 0.75rem;
      font-size: 0.95rem;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      border-color: #2d8a5e;
      outline: none;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .btn-primary {
      background: #2d8a5e;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-primary:hover {
      background: #1e5e3f;
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
      color: #5a655a;
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

    @media (max-width: 1024px) {
      .table-header, .table-row {
        grid-template-columns: 1fr 2fr 2fr 1.5fr 1.5fr 1.5fr;
      }
      
      .col-actions {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .demandes-table {
        overflow-x: auto;
      }
      
      .table-header, .table-row {
        min-width: 800px;
      }
    }
  `;

  if (loading) {
    return (
      <DashboardLayout title="Mes demandes" user={user}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="spinner" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: '1rem', color: '#5a655a' }}>Chargement des demandes...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <DashboardLayout title="Mes demandes d'enlèvement" user={user}>
        <div className="demandes-container">
          {/* En-tête */}
          <div className="header-actions">
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a1e1a' }}>
              Demandes d'enlèvement
            </h1>
            <button 
              className="filter-btn"
              onClick={handleRefresh}
              disabled={refreshing}
              style={{ padding: '0.6rem 1rem' }}
            >
              <FiRefreshCw className={refreshing ? 'fa-spin' : ''} />
              Actualiser
            </button>
          </div>

          {/* Filtres et nouvelle demande */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div className="filters-bar">
              <button 
                className={`filter-btn ${filtreStatut === 'tous' ? 'active' : ''}`}
                onClick={() => setFiltreStatut('tous')}
              >
                <FiFilter /> Toutes
              </button>
              <button 
                className={`filter-btn ${filtreStatut === 'en_attente' ? 'active' : ''}`}
                onClick={() => setFiltreStatut('en_attente')}
              >
                <FiClock /> En attente
              </button>
              <button 
                className={`filter-btn ${filtreStatut === 'validee' ? 'active' : ''}`}
                onClick={() => setFiltreStatut('validee')}
              >
                <FiCheckCircle /> Validées
              </button>
              <button 
                className={`filter-btn ${filtreStatut === 'realisee' ? 'active' : ''}`}
                onClick={() => setFiltreStatut('realisee')}
              >
                <FiCheckCircle /> Réalisées
              </button>
            </div>
            <Link to="/recycleur/demandes/nouvelle" className="new-demand-btn">
              <i className="fas fa-plus"></i>
              Nouvelle demande
            </Link>
          </div>

          {/* Tableau des demandes */}
          {demandes.length > 0 ? (
            <div className="demandes-table">
              <div className="table-header">
                <div>N° Demande</div>
                <div>Point de dépôt</div>
                <div>Type de déchet</div>
                <div>Quantité</div>
                <div>Date souhaitée</div>
                <div>Statut</div>
                <div className="col-actions">Actions</div>
              </div>

              {demandes.map((demande) => {
                const status = getStatusBadge(demande.statut);
                const StatusIcon = status.icon;
                
                return (
                  <div key={demande.id} className="table-row">
                    <div className="col-id">#{demande.id?.substring(0, 8)}</div>
                    <div className="col-point">{demande.nom_point || 'Point de collecte'}</div>
                    <div className="col-type">{recycleurService.getTypeLabel(demande.type_dechet)}</div>
                    <div className="col-quantite">{demande.quantite_demandee} kg</div>
                    <div className="col-date">{formatDate(demande.date_souhaitee)}</div>
                    <div className="col-status">
                      <span className={`badge ${status.color}`}>
                        <StatusIcon size={12} />
                        {status.label}
                      </span>
                    </div>
                    <div className="col-actions">
                      {demande.statut === 'validee' && (
                        <button 
                          className="action-btn"
                          onClick={() => {
                            setSelectedDemande(demande);
                            setQuantiteRecue(demande.quantite_demandee);
                            setShowConfirmModal(true);
                          }}
                          title="Confirmer réception"
                        >
                          <i className="fas fa-check-circle"></i>
                        </button>
                      )}
                      <Link 
                        to={`/recycleur/demandes/${demande.id}`}
                        className="action-btn"
                        title="Voir détails"
                      >
                        <FiEye />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <i className="fas fa-inbox"></i>
              <p>Aucune demande trouvée</p>
              <Link to="/recycleur/demandes/nouvelle" style={{ color: '#2d8a5e' }}>
                Créer une demande
              </Link>
            </div>
          )}

          {/* Pagination */}
          {demandes.length > 0 && (
            <div className="pagination">
              <button className="page-btn"><i className="fas fa-chevron-left"></i></button>
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <button className="page-btn"><i className="fas fa-chevron-right"></i></button>
            </div>
          )}

          {/* Modal de confirmation de réception */}
          {showConfirmModal && selectedDemande && (
            <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h3 className="modal-title">Confirmer la réception</h3>
                
                <div style={{ marginBottom: '1.5rem', background: '#f8faf8', padding: '1rem', borderRadius: '0.75rem' }}>
                  <p><strong>Demande:</strong> #{selectedDemande.id?.substring(0, 8)}</p>
                  <p><strong>Type:</strong> {recycleurService.getTypeLabel(selectedDemande.type_dechet)}</p>
                  <p><strong>Quantité demandée:</strong> {selectedDemande.quantite_demandee} kg</p>
                  <p><strong>Point:</strong> {selectedDemande.nom_point}</p>
                </div>

                <div className="form-group">
                  <label>Quantité reçue (kg) *</label>
                  <input
                    type="number"
                    value={quantiteRecue}
                    onChange={(e) => setQuantiteRecue(e.target.value)}
                    min="0.1"
                    step="0.1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Notes (optionnel)</label>
                  <textarea
                    value={notesConfirmation}
                    onChange={(e) => setNotesConfirmation(e.target.value)}
                    rows="3"
                    placeholder="Observations sur la réception..."
                  />
                </div>

                <div className="modal-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => {
                      setShowConfirmModal(false);
                      setSelectedDemande(null);
                      setQuantiteRecue('');
                      setNotesConfirmation('');
                    }}
                  >
                    Annuler
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={handleConfirmerReception}
                  >
                    Confirmer la réception
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default MesDemandes;