// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import DashboardLayout from '../../Layouts/LayoutDashboard';
// import adminService from '../../services/adminService';
// import { 
//   FiUserPlus, FiEye, FiEdit2, FiTrash2, 
//   FiSearch, FiDownload, FiMail,
//   FiPhone, FiMapPin, FiCheckCircle, FiXCircle,
//   FiAlertCircle, FiUserCheck
// } from 'react-icons/fi';
// import toast from 'react-hot-toast';

// const RecycleursList = () => {
//   const [recycleurs, setRecycleurs] = useState([]);
//   const [filteredRecycleurs, setFilteredRecycleurs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('tous');
  
//   // États pour les modales
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showActivateModal, setShowActivateModal] = useState(false);
//   const [showSuspendModal, setShowSuspendModal] = useState(false);
//   const [selectedRecycleur, setSelectedRecycleur] = useState(null);
//   const [actionReason, setActionReason] = useState('');
//   const [actionNotes, setActionNotes] = useState('');
  
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const userData = JSON.parse(localStorage.getItem('ecocollect_user') || '{}');
//     setUser(userData);
//     loadRecycleurs();
//   }, []);

//   useEffect(() => {
//     filterRecycleurs();
//   }, [searchTerm, statusFilter, recycleurs]);

//   const loadRecycleurs = async () => {
//     try {
//       setLoading(true);
//       const response = await adminService.getRecycleurs();
//       setRecycleurs(response.recycleurs || []);
//       setFilteredRecycleurs(response.recycleurs || []);
//     } catch (error) {
//       console.error('Erreur chargement recycleurs:', error);
//       toast.error('Erreur lors du chargement des recycleurs');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterRecycleurs = () => {
//     let filtered = [...recycleurs];

//     // Filtre par statut
//     if (statusFilter !== 'tous') {
//       filtered = filtered.filter(r => r.statut === statusFilter);
//     }

//     // Filtre par recherche
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(r => 
//         r.nom_entreprise?.toLowerCase().includes(term) ||
//         r.nom_responsable?.toLowerCase().includes(term) ||
//         r.email?.toLowerCase().includes(term) ||
//         r.telephone?.includes(term) ||
//         r.commune?.toLowerCase().includes(term)
//       );
//     }

//     setFilteredRecycleurs(filtered);
//   };

//   // Activer un recycleur
//   const handleActivateClick = (recycleur) => {
//     setSelectedRecycleur(recycleur);
//     setActionReason('');
//     setActionNotes('');
//     setShowActivateModal(true);
//   };

//   const confirmActivate = async () => {
//     try {
//       setLoading(true);
//       await adminService.validerRecycleur(selectedRecycleur.id, actionNotes);
//       toast.success(`Recycleur ${selectedRecycleur.nom_entreprise} activé avec succès`);
//       setShowActivateModal(false);
//       setSelectedRecycleur(null);
//       loadRecycleurs();
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Erreur lors de l\'activation');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Suspendre un recycleur
//   const handleSuspendClick = (recycleur) => {
//     setSelectedRecycleur(recycleur);
//     setActionReason('');
//     setActionNotes('');
//     setShowSuspendModal(true);
//   };

//   const confirmSuspend = async () => {
//     if (!actionReason.trim()) {
//       toast.error('Veuillez entrer une raison de suspension');
//       return;
//     }

//     try {
//       setLoading(true);
//       await adminService.suspendreRecycleur(selectedRecycleur.id, actionReason);
//       toast.success(`Recycleur ${selectedRecycleur.nom_entreprise} suspendu`);
//       setShowSuspendModal(false);
//       setSelectedRecycleur(null);
//       loadRecycleurs();
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Erreur lors de la suspension');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Demander suppression (pour superviseur) ou supprimer directement (pour admin)
//   const handleDeleteClick = (recycleur) => {
//     setSelectedRecycleur(recycleur);
//     setActionReason('');
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = async () => {
//     // Validation pour les superviseurs uniquement
//     if (user?.type !== 'admin' && !actionReason.trim()) {
//       toast.error('Veuillez entrer une raison de suppression');
//       return;
//     }

//     try {
//       setLoading(true);
      
//       if (user?.type === 'admin') {
//         // ADMIN: Suppression directe
//         await adminService.supprimerRecycleur(selectedRecycleur.id);
//         toast.success('✅ Recycleur supprimé avec succès');
//       } else {
//         // SUPERVISEUR: Demande de suppression
//         await adminService.demanderSuppressionRecycleur(selectedRecycleur.id, actionReason);
//         toast.success('📨 Demande de suppression envoyée à l\'administrateur');
//       }
      
//       setShowDeleteModal(false);
//       setSelectedRecycleur(null);
//       setActionReason('');
//       await loadRecycleurs();
      
//     } catch (error) {
//       console.error('❌ Erreur détaillée:', error);
//       const errorMessage = error.response?.data?.message || 
//                           error.message || 
//                           'Erreur lors de l\'opération';
//       toast.error(`❌ ${errorMessage}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusBadge = (statut) => {
//     const badges = {
//       'en_attente': { 
//         color: 'bg-yellow-100 text-yellow-800', 
//         icon: FiAlertCircle,
//         label: 'En attente' 
//       },
//       'actif': { 
//         color: 'bg-green-100 text-green-800', 
//         icon: FiCheckCircle,
//         label: 'Actif' 
//       },
//       'suspendu': { 
//         color: 'bg-red-100 text-red-800', 
//         icon: FiXCircle,
//         label: 'Suspendu' 
//       },
//     };
//     return badges[statut] || badges.en_attente;
//   };

//   const exportToCSV = () => {
//     const headers = ['Entreprise', 'Responsable', 'Email', 'Téléphone', 'Adresse', 'Quartier', 'Commune', 'Statut', 'Date création'];
//     const data = filteredRecycleurs.map(r => [
//       r.nom_entreprise,
//       r.nom_responsable,
//       r.email,
//       r.telephone,
//       r.adresse,
//       r.quartier,
//       r.commune,
//       r.statut,
//       new Date(r.cree_le).toLocaleDateString('fr-FR')
//     ]);

//     const csvContent = [headers, ...data]
//       .map(row => row.join(','))
//       .join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
//     link.setAttribute('href', url);
//     link.setAttribute('download', 'recycleurs.csv');
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const getDeleteModalTitle = () => {
//     return user?.type === 'admin' ? 'Confirmer la suppression' : 'Demande de suppression';
//   };

//   const getDeleteModalMessage = () => {
//     if (user?.type === 'admin') {
//       return `Vous êtes sur le point de supprimer définitivement le recycleur :\n${selectedRecycleur?.nom_entreprise}`;
//     }
//     return `Vous êtes sur le point de demander la suppression du recycleur :\n${selectedRecycleur?.nom_entreprise}`;
//   };

//   // Calcul des statistiques
//   const stats = {
//     total: recycleurs.length,
//     enAttente: recycleurs.filter(r => r.statut === 'en_attente').length,
//     actifs: recycleurs.filter(r => r.statut === 'actif').length,
//     suspendus: recycleurs.filter(r => r.statut === 'suspendu').length,
//   };

//   if (loading && recycleurs.length === 0) {
//     return (
//       <DashboardLayout title="Gestion des recycleurs" user={user}>
//         <div className="text-center py-12">
//           <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
//           <p className="mt-4 text-gray-600">Chargement des recycleurs...</p>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout title="Gestion des recycleurs" user={user}>
//       {/* En-tête avec actions */}
//       <div className="mb-6 flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-gray-800">Liste des recycleurs</h1>
//         <div className="flex gap-3">
//           <button 
//             onClick={exportToCSV} 
//             className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
//           >
//             <FiDownload /> Exporter CSV
//           </button>
//           <Link 
//             to="/admin/recycleurs/nouveau" 
//             className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
//           >
//             <FiUserPlus /> Nouveau recycleur
//           </Link>
//         </div>
//       </div>

//       {/* Cartes de statistiques */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
//               <FiUserPlus size={24} />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Total</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">
//               <FiAlertCircle size={24} />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">En attente</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.enAttente}</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
//               <FiCheckCircle size={24} />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Actifs</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.actifs}</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
//               <FiXCircle size={24} />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Suspendus</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.suspendus}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Barre de filtres */}
//       <div className="bg-white rounded-xl shadow-sm p-4 mb-8 flex flex-wrap gap-4">
//         <div className="flex-1 min-w-[250px] relative">
//           <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
//           <input
//             type="text"
//             placeholder="Rechercher par entreprise, responsable, email..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
//           />
//         </div>
//         <select 
//           className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//         >
//           <option value="tous">Tous les statuts</option>
//           <option value="en_attente">En attente</option>
//           <option value="actif">Actif</option>
//           <option value="suspendu">Suspendu</option>
//         </select>
//       </div>

//       {/* Tableau des recycleurs */}
//       {filteredRecycleurs.length > 0 ? (
//         <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entreprise</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responsable</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Localisation</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date création</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredRecycleurs.map((recycleur) => {
//                   const status = getStatusBadge(recycleur.statut);
//                   const StatusIcon = status.icon;
                  
//                   return (
//                     <tr key={recycleur.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4">
//                         <div className="font-medium text-gray-900">{recycleur.nom_entreprise}</div>
//                         {recycleur.numero_identite && (
//                           <div className="text-sm text-gray-500">N° {recycleur.numero_identite}</div>
//                         )}
//                       </td>
//                       <td className="px-6 py-4 text-gray-900">{recycleur.nom_responsable}</td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-2 text-sm">
//                           <FiMail className="text-gray-400" size={14} />
//                           <span className="text-gray-600">{recycleur.email}</span>
//                         </div>
//                         <div className="flex items-center gap-2 text-sm mt-1">
//                           <FiPhone className="text-gray-400" size={14} />
//                           <span className="text-gray-600">{recycleur.telephone}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         {recycleur.adresse && (
//                           <div className="text-sm text-gray-600">{recycleur.adresse}</div>
//                         )}
//                         {(recycleur.quartier || recycleur.commune) && (
//                           <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
//                             <FiMapPin size={12} />
//                             <span>
//                               {recycleur.quartier && `${recycleur.quartier}, `}
//                               {recycleur.commune}
//                             </span>
//                           </div>
//                         )}
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
//                           <StatusIcon size={12} />
//                           {status.label}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-600">
//                         {new Date(recycleur.cree_le).toLocaleDateString('fr-FR')}
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex gap-2">
//                           {/* Bouton de validation pour les comptes en attente */}
//                           {recycleur.statut === 'en_attente' && (
//                             <button 
//                               className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
//                               onClick={() => handleActivateClick(recycleur)}
//                               title="Activer le compte"
//                             >
//                               <FiCheckCircle size={18} />
//                             </button>
//                           )}
                          
//                           {/* Bouton de suspension pour les comptes actifs */}
//                           {recycleur.statut === 'actif' && (
//                             <button 
//                               className="p-1 text-orange-600 hover:bg-orange-50 rounded transition-colors"
//                               onClick={() => handleSuspendClick(recycleur)}
//                               title="Suspendre le compte"
//                             >
//                               <FiXCircle size={18} />
//                             </button>
//                           )}
                          
//                           {/* Bouton de réactivation pour les comptes suspendus */}
//                           {recycleur.statut === 'suspendu' && (
//                             <button 
//                               className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
//                               onClick={() => handleActivateClick(recycleur)}
//                               title="Réactiver le compte"
//                             >
//                               <FiUserCheck size={18} />
//                             </button>
//                           )}
                          
//                           <Link 
//                             to={`/admin/recycleurs/${recycleur.id}`}
//                             className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
//                             title="Voir détails"
//                           >
//                             <FiEye size={18} />
//                           </Link>
//                           <Link 
//                             to={`/admin/recycleurs/${recycleur.id}/edit`}
//                             className="p-1 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
//                             title="Modifier"
//                           >
//                             <FiEdit2 size={18} />
//                           </Link>
//                           <button 
//                             className={`p-1 rounded transition-colors ${
//                               user?.type === 'admin' 
//                                 ? 'text-red-600 hover:bg-red-50' 
//                                 : 'text-orange-600 hover:bg-orange-50'
//                             }`}
//                             onClick={() => handleDeleteClick(recycleur)}
//                             title={user?.type === 'admin' ? 'Supprimer définitivement' : 'Demander la suppression'}
//                           >
//                             <FiTrash2 size={18} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : (
//         <div className="bg-white rounded-xl shadow-sm p-12 text-center">
//           <div className="text-gray-300 text-5xl mb-4">📦</div>
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun recycleur trouvé</h3>
//           <p className="text-gray-600 mb-4">
//             {searchTerm || statusFilter !== 'tous' 
//               ? 'Aucun recycleur ne correspond à vos critères'
//               : 'Commencez par créer votre premier recycleur'}
//           </p>
//           {(searchTerm || statusFilter !== 'tous') && (
//             <button
//               onClick={() => {
//                 setSearchTerm('');
//                 setStatusFilter('tous');
//               }}
//               className="text-purple-600 hover:text-purple-800 underline"
//             >
//               Réinitialiser les filtres
//             </button>
//           )}
//         </div>
//       )}

//       {/* Modal d'activation */}
//       {showActivateModal && selectedRecycleur && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-xl max-w-md w-full p-6">
//             <h3 className="text-xl font-bold text-gray-900 mb-4">
//               {selectedRecycleur.statut === 'suspendu' ? 'Réactiver' : 'Activer'} le compte
//             </h3>
            
//             <div className="mb-6">
//               <p className="mb-4">
//                 Vous êtes sur le point de {selectedRecycleur.statut === 'suspendu' ? 'réactiver' : 'activer'} le recycleur :<br />
//                 <strong className="text-purple-600">{selectedRecycleur.nom_entreprise}</strong>
//               </p>
              
//               <p className="text-sm text-gray-600 mb-2">
//                 Notes (optionnel) :
//               </p>
              
//               <textarea
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
//                 rows="4"
//                 value={actionNotes}
//                 onChange={(e) => setActionNotes(e.target.value)}
//                 placeholder="Ajouter des notes de validation..."
//               />
//             </div>

//             <div className="flex gap-3 justify-end">
//               <button 
//                 className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//                 onClick={() => {
//                   setShowActivateModal(false);
//                   setSelectedRecycleur(null);
//                   setActionNotes('');
//                 }}
//               >
//                 Annuler
//               </button>
//               <button 
//                 className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
//                 onClick={confirmActivate}
//                 disabled={loading}
//               >
//                 {loading ? 'Traitement...' : (selectedRecycleur.statut === 'suspendu' ? 'Réactiver' : 'Activer')}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modal de suspension */}
//       {showSuspendModal && selectedRecycleur && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-xl max-w-md w-full p-6">
//             <h3 className="text-xl font-bold text-gray-900 mb-4">Suspendre le compte</h3>
            
//             <div className="mb-6">
//               <p className="mb-4">
//                 Vous êtes sur le point de suspendre le recycleur :<br />
//                 <strong className="text-purple-600">{selectedRecycleur.nom_entreprise}</strong>
//               </p>
              
//               <p className="text-sm text-gray-600 mb-2">
//                 Raison de la suspension <span className="text-red-500">*</span> :
//               </p>
              
//               <textarea
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
//                 rows="4"
//                 value={actionReason}
//                 onChange={(e) => setActionReason(e.target.value)}
//                 placeholder="Expliquez la raison de la suspension..."
//               />
//             </div>

//             <div className="flex gap-3 justify-end">
//               <button 
//                 className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//                 onClick={() => {
//                   setShowSuspendModal(false);
//                   setSelectedRecycleur(null);
//                   setActionReason('');
//                 }}
//               >
//                 Annuler
//               </button>
//               <button 
//                 className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
//                 onClick={confirmSuspend}
//                 disabled={loading || !actionReason.trim()}
//               >
//                 {loading ? 'Traitement...' : 'Suspendre'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modal de suppression */}
//       {showDeleteModal && selectedRecycleur && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-xl max-w-md w-full p-6">
//             <h3 className="text-xl font-bold text-gray-900 mb-4">{getDeleteModalTitle()}</h3>
            
//             <div className="mb-6">
//               <p className="mb-4 whitespace-pre-line">
//                 {getDeleteModalMessage()}
//               </p>
              
//               {user?.type !== 'admin' && (
//                 <>
//                   <p className="text-sm text-gray-600 mb-2">
//                     Raison de la demande <span className="text-red-500">*</span> :
//                   </p>
                  
//                   <textarea
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
//                     rows="4"
//                     value={actionReason}
//                     onChange={(e) => setActionReason(e.target.value)}
//                     placeholder="Raison de la suppression..."
//                     disabled={loading}
//                   />
//                 </>
//               )}

//               {user?.type === 'admin' && (
//                 <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//                   <p className="text-sm text-red-700 flex items-center gap-2">
//                     <FiAlertCircle size={18} />
//                     Cette action est irréversible. Toutes les données associées à ce recycleur seront définitivement supprimées.
//                   </p>
//                 </div>
//               )}
//             </div>

//             <div className="flex gap-3 justify-end">
//               <button 
//                 className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//                 onClick={() => {
//                   setShowDeleteModal(false);
//                   setSelectedRecycleur(null);
//                   setActionReason('');
//                 }}
//                 disabled={loading}
//               >
//                 Annuler
//               </button>
//               <button 
//                 className={`px-4 py-2 text-white rounded-lg ${
//                   user?.type === 'admin' 
//                     ? 'bg-red-600 hover:bg-red-700' 
//                     : 'bg-orange-600 hover:bg-orange-700'
//                 }`}
//                 onClick={confirmDelete}
//                 disabled={loading || (user?.type !== 'admin' && !actionReason.trim())}
//               >
//                 {loading ? 'Traitement...' : (user?.type === 'admin' ? 'Supprimer définitivement' : 'Envoyer la demande')}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </DashboardLayout>
//   );
// };

// export default RecycleursList;



import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiEdit2, 
  FiEye, 
  FiPlus, 
  FiMail,
  FiPhone, 
  FiMapPin,
  FiTrash2,
  FiX,
  FiDownload,
  FiFilter,
  FiSearch,
  FiRefreshCw,
  FiUser,
  FiUserCheck,
  FiUserX
} from 'react-icons/fi';
import {
  Clock, CheckCircle, XCircle, TrendingUp,
  Target, Package, Map, DollarSign,
  Building2, User, Mail, Phone, MapPin,
  AlertCircle, Ban, Shield
} from 'lucide-react';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import DashboardLayout from '../../Layouts/LayoutDashboard';

const RecycleursList = () => {
  const [recycleurs, setRecycleurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [filtreStatut, setFiltreStatut] = useState('tous');
  const [searchTerm, setSearchTerm] = useState('');
  
  // États pour les modales
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRecycleur, setSelectedRecycleur] = useState(null);
  const [recycleurDetails, setRecycleurDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  // États pour activation/suspension
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [actionReason, setActionReason] = useState('');
  const [actionNotes, setActionNotes] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('ecocollect_user') || '{}');
    setUser(userData);
    loadRecycleurs();
  }, [filtreStatut]);

  const loadRecycleurs = async () => {
    try {
      setLoading(true);
      const response = await adminService.getRecycleurs();
      
      if (response.success) {
        // Formater les données pour l'affichage
        const recycleursFormatees = (response.recycleurs || []).map(r => ({
          ...r,
          stats: {
            missions: r.nombre_missions || 0,
            collectes: r.poids_total_collecte || 0,
            points: r.nombre_points || 0
          }
        }));
        
        setRecycleurs(recycleursFormatees);
      }
    } catch (error) {
      console.error('Erreur chargement recycleurs:', error);
      toast.error('Erreur lors du chargement des recycleurs');
    } finally {
      setLoading(false);
    }
  };

  const loadRecycleurDetails = async (recycleurId) => {
    setLoadingDetails(true);
    try {
      const response = await adminService.getRecycleurById(recycleurId);
      
      if (response.success) {
        setRecycleurDetails(response.recycleur);
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
    await loadRecycleurs();
    setRefreshing(false);
    toast.success('Données actualisées');
  };

  const handleViewDetails = (recycleur) => {
    setSelectedRecycleur(recycleur);
    loadRecycleurDetails(recycleur.id);
    setShowDetailsModal(true);
  };

  // Activer un recycleur
  const handleActivateClick = (recycleur) => {
    setSelectedRecycleur(recycleur);
    setActionNotes('');
    setShowActivateModal(true);
  };

  const confirmActivate = async () => {
    try {
      setLoading(true);
      await adminService.validerRecycleur(selectedRecycleur.id, actionNotes);
      toast.success(`✅ Recycleur ${selectedRecycleur.nom_entreprise} activé avec succès`);
      setShowActivateModal(false);
      setSelectedRecycleur(null);
      loadRecycleurs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'activation');
    } finally {
      setLoading(false);
    }
  };

  // Suspendre un recycleur
  const handleSuspendClick = (recycleur) => {
    setSelectedRecycleur(recycleur);
    setActionReason('');
    setShowSuspendModal(true);
  };

  const confirmSuspend = async () => {
    if (!actionReason.trim()) {
      toast.error('Veuillez entrer une raison de suspension');
      return;
    }

    try {
      setLoading(true);
      await adminService.suspendreRecycleur(selectedRecycleur.id, actionReason);
      toast.success(`⚠️ Recycleur ${selectedRecycleur.nom_entreprise} suspendu`);
      setShowSuspendModal(false);
      setSelectedRecycleur(null);
      setActionReason('');
      loadRecycleurs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la suspension');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (statut) => {
    const badges = {
      'en_attente': { 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: Clock, 
        label: 'En attente' 
      },
      'actif': { 
        color: 'bg-green-100 text-green-800', 
        icon: CheckCircle, 
        label: 'Actif' 
      },
      'suspendu': { 
        color: 'bg-red-100 text-red-800', 
        icon: XCircle, 
        label: 'Suspendu' 
      }
    };
    const badge = badges[statut] || badges.en_attente;
    const Icon = badge.icon;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${badge.color}`}>
        <Icon size={12} />
        {badge.label}
      </span>
    );
  };

  // Filtrage
  const recycleursFiltres = recycleurs.filter(r => {
    const matchStatut = filtreStatut === 'tous' || r.statut === filtreStatut;
    const matchSearch = !searchTerm || 
      r.nom_entreprise?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.nom_responsable?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.telephone?.includes(searchTerm);
    return matchStatut && matchSearch;
  });

  // Calcul des statistiques
  const stats = {
    total: recycleurs.length,
    enAttente: recycleurs.filter(r => r.statut === 'en_attente').length,
    actifs: recycleurs.filter(r => r.statut === 'actif').length,
    suspendus: recycleurs.filter(r => r.statut === 'suspendu').length,
  };

  const exportToCSV = () => {
    const headers = ['Entreprise', 'Responsable', 'Email', 'Téléphone', 'Adresse', 'Quartier', 'Commune', 'Statut', 'Date création'];
    const data = recycleursFiltres.map(r => [
      r.nom_entreprise,
      r.nom_responsable,
      r.email,
      r.telephone,
      r.adresse,
      r.quartier,
      r.commune,
      r.statut,
      new Date(r.cree_le).toLocaleDateString('fr-FR')
    ]);

    const csvContent = [headers, ...data]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'recycleurs.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Export CSV réussi');
  };

  return (
    <DashboardLayout title="Gestion des recycleurs" user={user}>
      {/* En-tête avec boutons d'action */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Liste des recycleurs</h2>
        <div className="flex gap-3">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
          >
            <FiDownload size={18} />
            Exporter CSV
          </button>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
            disabled={refreshing}
          >
            <FiRefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
            Actualiser
          </button>
          <Link
            to="/admin/recycleurs/nouveau"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <FiPlus size={18} /> Nouveau recycleur
          </Link>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <Building2 size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">En attente</p>
              <p className="text-2xl font-bold text-gray-900">{stats.enAttente}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Actifs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.actifs}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
              <Ban size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Suspendus</p>
              <p className="text-2xl font-bold text-gray-900">{stats.suspendus}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setFiltreStatut('tous')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              filtreStatut === 'tous' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FiFilter size={16} />
            Tous
          </button>
          <button
            onClick={() => setFiltreStatut('en_attente')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              filtreStatut === 'en_attente' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Clock size={16} />
            En attente
          </button>
          <button
            onClick={() => setFiltreStatut('actif')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              filtreStatut === 'actif' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <CheckCircle size={16} />
            Actifs
          </button>
          <button
            onClick={() => setFiltreStatut('suspendu')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              filtreStatut === 'suspendu' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <XCircle size={16} />
            Suspendus
          </button>
        </div>

        <div className="flex-1 max-w-md relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher par entreprise, responsable, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>
      </div>

      {/* Liste des recycleurs en mode grille */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Chargement des recycleurs...</p>
        </div>
      ) : recycleursFiltres.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recycleursFiltres.map((recycleur) => (
            <div key={recycleur.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border border-gray-100">
              {/* En-tête de la carte */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">{recycleur.nom_entreprise}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <User size={14} />
                    {recycleur.nom_responsable}
                  </p>
                </div>
                {getStatusBadge(recycleur.statut)}
              </div>

              {/* Numéro d'identité */}
              {recycleur.numero_identite && (
                <div className="mb-3 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                  <span className="font-medium">N° identité:</span> {recycleur.numero_identite}
                </div>
              )}

              {/* Contact */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={14} className="text-gray-400" />
                  <span className="truncate">{recycleur.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={14} className="text-gray-400" />
                  <span>{recycleur.telephone}</span>
                </div>
              </div>

              {/* Localisation */}
              {(recycleur.adresse || recycleur.quartier || recycleur.commune) && (
                <div className="flex items-start gap-2 text-sm text-gray-500 mb-4 bg-gray-50 p-3 rounded-lg">
                  <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <span>
                    {recycleur.adresse && <div>{recycleur.adresse}</div>}
                    <div>
                      {recycleur.quartier && `${recycleur.quartier}, `}
                      {recycleur.commune}
                    </div>
                  </span>
                </div>
              )}

              {/* Statistiques (si disponibles) */}
              {recycleur.stats && (
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-gray-50 p-2 rounded-lg text-center">
                    <Package size={16} className="mx-auto mb-1 text-purple-600" />
                    <p className="text-xs text-gray-500">Missions</p>
                    <p className="font-bold text-sm">{recycleur.stats.missions}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg text-center">
                    <Target size={16} className="mx-auto mb-1 text-purple-600" />
                    <p className="text-xs text-gray-500">Collectes</p>
                    <p className="font-bold text-sm">{recycleur.stats.collectes} kg</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg text-center">
                    <Map size={16} className="mx-auto mb-1 text-purple-600" />
                    <p className="text-xs text-gray-500">Points</p>
                    <p className="font-bold text-sm">{recycleur.stats.points}</p>
                  </div>
                </div>
              )}

              {/* Date de création */}
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                <Clock size={12} />
                <span>Inscrit le {new Date(recycleur.cree_le).toLocaleDateString('fr-FR')}</span>
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewDetails(recycleur)}
                  className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <FiEye size={16} />
                  Détails
                </button>
                
                
              </div>

              {/* Boutons de gestion de statut */}
              {recycleur.statut === 'en_attente' && (
                <button
                  onClick={() => handleActivateClick(recycleur)}
                  className="mt-2 w-full px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center justify-center gap-2 text-sm transition-colors"
                >
                  <CheckCircle size={14} />
                  Activer le compte
                </button>
              )}
              
              {recycleur.statut === 'actif' && (
                <button
                  onClick={() => handleSuspendClick(recycleur)}
                  className="mt-2 w-full px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 flex items-center justify-center gap-2 text-sm transition-colors"
                >
                  <XCircle size={14} />
                  Suspendre le compte
                </button>
              )}
              
              {recycleur.statut === 'suspendu' && (
                <button
                  onClick={() => handleActivateClick(recycleur)}
                  className="mt-2 w-full px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center justify-center gap-2 text-sm transition-colors"
                >
                  <FiUserCheck size={14} />
                  Réactiver le compte
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Building2 size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun recycleur trouvé</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filtreStatut !== 'tous' 
              ? 'Aucun recycleur ne correspond à vos critères'
              : 'Commencez par créer votre premier recycleur'}
          </p>
          {(searchTerm || filtreStatut !== 'tous') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFiltreStatut('tous');
              }}
              className="text-purple-600 hover:text-purple-800 underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      )}

      {/* MODAL DE DÉTAILS */}
      {showDetailsModal && selectedRecycleur && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50 sticky top-0">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">{selectedRecycleur.nom_entreprise}</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>

            {loadingDetails ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Chargement des détails...</p>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Informations générales */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Statut</p>
                    <div className="mt-1">{getStatusBadge(selectedRecycleur.statut)}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Responsable</p>
                    <p className="font-medium text-sm">{selectedRecycleur.nom_responsable}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">N° Identité</p>
                    <p className="font-medium text-sm">{selectedRecycleur.numero_identite || 'Non renseigné'}</p>
                  </div>
                </div>

                {/* Contact */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-4">Contact</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedRecycleur.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Téléphone</p>
                      <p className="font-medium">{selectedRecycleur.telephone}</p>
                    </div>
                  </div>
                </div>

                {/* Localisation */}
                {(selectedRecycleur.adresse || selectedRecycleur.quartier || selectedRecycleur.commune) && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-4">Localisation</h3>
                    <div className="space-y-2">
                      {selectedRecycleur.adresse && (
                        <p className="text-sm">{selectedRecycleur.adresse}</p>
                      )}
                      <p className="text-sm text-gray-600">
                        {selectedRecycleur.quartier && `${selectedRecycleur.quartier}, `}
                        {selectedRecycleur.commune}
                      </p>
                    </div>
                  </div>
                )}

                {/* Informations supplémentaires */}
                {recycleurDetails && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-4">Statistiques</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{recycleurDetails.nombre_missions || 0}</p>
                        <p className="text-sm text-gray-500">Missions</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{recycleurDetails.poids_total_collecte || 0} kg</p>
                        <p className="text-sm text-gray-500">Collectés</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{recycleurDetails.nombre_points || 0}</p>
                        <p className="text-sm text-gray-500">Points</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Boutons d'action */}
                <div className="flex gap-3 justify-end pt-4 border-t">
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
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

      {/* MODAL D'ACTIVATION */}
      {showActivateModal && selectedRecycleur && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {selectedRecycleur.statut === 'suspendu' ? 'Réactiver' : 'Activer'} le compte
            </h3>
            
            <div className="mb-6">
              <p className="mb-4">
                Vous êtes sur le point de {selectedRecycleur.statut === 'suspendu' ? 'réactiver' : 'activer'} le recycleur :<br />
                <strong className="text-purple-600">{selectedRecycleur.nom_entreprise}</strong>
              </p>
              
              <p className="text-sm text-gray-600 mb-2">
                Notes (optionnel) :
              </p>
              
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                rows="4"
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder="Ajouter des notes de validation..."
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setShowActivateModal(false);
                  setSelectedRecycleur(null);
                  setActionNotes('');
                }}
              >
                Annuler
              </button>
              <button 
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                onClick={confirmActivate}
                disabled={loading}
              >
                {loading ? 'Traitement...' : (selectedRecycleur.statut === 'suspendu' ? 'Réactiver' : 'Activer')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE SUSPENSION */}
      {showSuspendModal && selectedRecycleur && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Suspendre le compte</h3>
            
            <div className="mb-6">
              <p className="mb-4">
                Vous êtes sur le point de suspendre le recycleur :<br />
                <strong className="text-purple-600">{selectedRecycleur.nom_entreprise}</strong>
              </p>
              
              <p className="text-sm text-gray-600 mb-2">
                Raison de la suspension <span className="text-red-500">*</span> :
              </p>
              
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                rows="4"
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Expliquez la raison de la suspension..."
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setShowSuspendModal(false);
                  setSelectedRecycleur(null);
                  setActionReason('');
                }}
              >
                Annuler
              </button>
              <button 
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                onClick={confirmSuspend}
                disabled={loading || !actionReason.trim()}
              >
                {loading ? 'Traitement...' : 'Suspendre'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default RecycleursList;