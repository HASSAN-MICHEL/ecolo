

// // import React, { useState, useEffect } from 'react';
// // import DashboardLayout from '../../Layouts/LayoutDashboard';
// // import adminService from '../../services/adminService';
// // import { FiUserPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
// // import { Link } from 'react-router-dom';
// // import toast from 'react-hot-toast';

// // const SuperviseurList = () => {
// //   const [superviseurs, setSuperviseurs] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [user, setUser] = useState(null);

// //   useEffect(() => {
// //     // Récupérer l'utilisateur pour le passer au DashboardLayout
// //     const storedUser = localStorage.getItem('ecocollect_user');
// //     if (storedUser) {
// //       setUser(JSON.parse(storedUser));
// //     }
// //     loadSuperviseurs();
// //   }, []);

// //   const loadSuperviseurs = async () => {
// //     try {
// //       setLoading(true);
// //       const data = await adminService.getSuperviseurs();
// //       setSuperviseurs(data.superviseurs || []);
// //     } catch (error) {
// //       console.error('Erreur chargement superviseurs:', error);
// //       toast.error('Erreur lors du chargement des superviseurs');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// import React, { useState, useEffect } from 'react';
// import DashboardLayout from '../../Layouts/LayoutDashboard';
// import adminService from '../../services/adminService'; // C'est déjà une instance
// import { FiUserPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
// import { Link } from 'react-router-dom';
// import toast from 'react-hot-toast';

// const SuperviseurList = () => {
//   const [superviseurs, setSuperviseurs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('ecocollect_user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//     loadSuperviseurs();
//   }, []);

//   const loadSuperviseurs = async () => {
//     try {
//       setLoading(true);
//       const data = await adminService.getSuperviseurs(); // Utilisation directe
//       setSuperviseurs(data.superviseurs || []);
//     } catch (error) {
//       console.error('Erreur chargement superviseurs:', error);
//       toast.error('Erreur lors du chargement des superviseurs');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer ce superviseur ?')) {
//       try {
//         await adminService.supprimerSuperviseur(id); // Utilisation directe
//         toast.success('Superviseur supprimé avec succès');
//         loadSuperviseurs();
//       } catch (error) {
//         console.error('Erreur suppression:', error);
//         toast.error('Erreur lors de la suppression');
//       }
//     }
//   };


//   return (
//     <DashboardLayout title="Gestion des superviseurs" user={user}>
//       <div className="mb-6 flex justify-between items-center">
//         <h2 className="text-2xl font-bold text-gray-800">Liste des superviseurs</h2>
//         <Link
//           to="/admin/superviseurs/nouveau"
//           className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
//         >
//           <FiUserPlus /> Nouveau superviseur
//         </Link>
//       </div>

//       {loading ? (
//         <div className="text-center py-12">
//           <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
//           <p className="mt-4 text-gray-600">Chargement des superviseurs...</p>
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           {superviseurs.length === 0 ? (
//             <div className="text-center py-12">
//               <p className="text-gray-500">Aucun superviseur trouvé</p>
//               <Link
//                 to="/admin/superviseurs/nouveau"
//                 className="inline-block mt-4 text-green-600 hover:text-green-700"
//               >
//                 Créer le premier superviseur
//               </Link>
//             </div>
//           ) : (
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Nom complet
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Email
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Téléphone
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Statut
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Date création
//                   </th>
//                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {superviseurs.map((sup) => (
//                   <tr key={sup.id} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="font-medium text-gray-900">{sup.nom_complet}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-gray-600">{sup.email}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-gray-600">{sup.telephone || '-'}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         sup.est_actif 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-red-100 text-red-800'
//                       }`}>
//                         {sup.est_actif ? 'Actif' : 'Inactif'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-gray-600">
//                       {new Date(sup.cree_le).toLocaleDateString('fr-FR', {
//                         day: '2-digit',
//                         month: '2-digit',
//                         year: 'numeric'
//                       })}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
//                       <Link
//                         to={`/admin/superviseurs/${sup.id}`}
//                         className="text-blue-600 hover:text-blue-900 inline-block p-1 rounded hover:bg-blue-50 transition-colors"
//                         title="Voir détails"
//                       >
//                         <FiEye className="w-5 h-5" />
//                       </Link>
//                       <Link
//                         to={`/admin/superviseurs/modifier/${sup.id}`}
//                         className="text-green-600 hover:text-green-900 inline-block p-1 rounded hover:bg-green-50 transition-colors"
//                         title="Modifier"
//                       >
//                         <FiEdit2 className="w-5 h-5" />
//                       </Link>
//                       <button
//                         onClick={() => handleDelete(sup.id)}
//                         className="text-red-600 hover:text-red-900 inline-block p-1 rounded hover:bg-red-50 transition-colors"
//                         title="Supprimer"
//                       >
//                         <FiTrash2 className="w-5 h-5" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       )}
//     </DashboardLayout>
//   );
// };

// export default SuperviseurList;



import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../Layouts/LayoutDashboard';
import adminService from '../../services/adminService';
import { 
  FiUserPlus, 
  FiEdit2, 
  FiTrash2, 
  FiEye,
  FiSearch,
  FiRefreshCw,
  FiFilter,
  FiMail,
  FiPhone,
  FiUser
} from 'react-icons/fi';
import {
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

const SuperviseurList = () => {
  const [superviseurs, setSuperviseurs] = useState([]);
  const [filteredSuperviseurs, setFilteredSuperviseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('tous');

  useEffect(() => {
    const storedUser = localStorage.getItem('ecocollect_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    loadSuperviseurs();
  }, []);

  useEffect(() => {
    filterSuperviseurs();
  }, [searchTerm, filtreStatut, superviseurs]);

  const loadSuperviseurs = async () => {
    try {
      setLoading(true);
      const data = await adminService.getSuperviseurs();
      setSuperviseurs(data.superviseurs || []);
      setFilteredSuperviseurs(data.superviseurs || []);
    } catch (error) {
      console.error('Erreur chargement superviseurs:', error);
      toast.error('Erreur lors du chargement des superviseurs');
    } finally {
      setLoading(false);
    }
  };

  const filterSuperviseurs = () => {
    let filtered = [...superviseurs];

    // Filtre par statut
    if (filtreStatut !== 'tous') {
      filtered = filtered.filter(s => 
        filtreStatut === 'actif' ? s.est_actif : !s.est_actif
      );
    }

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s => 
        s.nom_complet?.toLowerCase().includes(term) ||
        s.email?.toLowerCase().includes(term) ||
        s.telephone?.includes(term)
      );
    }

    setFilteredSuperviseurs(filtered);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSuperviseurs();
    setRefreshing(false);
    toast.success('Données actualisées');
  };

  const handleDelete = async (id, nom) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le superviseur "${nom}" ?`)) {
      try {
        await adminService.supprimerSuperviseur(id);
        toast.success('Superviseur supprimé avec succès');
        loadSuperviseurs();
      } catch (error) {
        console.error('Erreur suppression:', error);
        toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
      }
    }
  };

  const getStatusBadge = (estActif) => {
    if (estActif) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 bg-green-100 text-green-800">
          <CheckCircle size={12} />
          Actif
        </span>
      );
    }
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 bg-red-100 text-red-800">
        <XCircle size={12} />
        Inactif
      </span>
    );
  };

  // Statistiques
  const stats = {
    total: superviseurs.length,
    actifs: superviseurs.filter(s => s.est_actif).length,
    inactifs: superviseurs.filter(s => !s.est_actif).length
  };

  return (
    <DashboardLayout title="Gestion des superviseurs" user={user}>
      {/* En-tête avec boutons d'action */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Liste des superviseurs</h2>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
            disabled={refreshing}
          >
            <FiRefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
            Actualiser
          </button>
          <Link
            to="/admin/superviseurs/nouveau"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <FiUserPlus size={18} /> Nouveau superviseur
          </Link>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
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
              <XCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Inactifs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inactifs}</p>
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
            onClick={() => setFiltreStatut('inactif')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              filtreStatut === 'inactif' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <XCircle size={16} />
            Inactifs
          </button>
        </div>

        <div className="flex-1 max-w-md relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher par nom, email, téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>
      </div>

      {/* Liste des superviseurs en mode grille */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Chargement des superviseurs...</p>
        </div>
      ) : filteredSuperviseurs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuperviseurs.map((sup) => (
            <div key={sup.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border border-gray-100">
              {/* En-tête de la carte */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-lg">
                    {sup.nom_complet?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{sup.nom_complet}</h3>
                    <div className="mt-1">
                      {getStatusBadge(sup.est_actif)}
                    </div>
                  </div>
                </div>
                <Shield size={20} className="text-purple-400" />
              </div>

              {/* Contact */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiMail size={14} className="text-gray-400" />
                  <span className="truncate">{sup.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiPhone size={14} className="text-gray-400" />
                  <span>{sup.telephone || 'Non renseigné'}</span>
                </div>
              </div>

              {/* Date de création */}
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                <Clock size={12} />
                <span>Créé le {new Date(sup.cree_le).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}</span>
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-2">
                <Link
                  to={`/admin/superviseurs/${sup.id}`}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <FiEye size={16} />
                  Détails
                </Link>
               
                
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Shield size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun superviseur trouvé</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filtreStatut !== 'tous' 
              ? 'Aucun superviseur ne correspond à vos critères'
              : 'Commencez par créer votre premier superviseur'}
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
    </DashboardLayout>
  );
};

export default SuperviseurList;