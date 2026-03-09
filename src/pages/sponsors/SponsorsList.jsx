// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import DashboardLayout from '../../Layouts/LayoutDashboard';
// import adminService from '../../services/adminService';
// import { 
//   FiEye, FiEdit2, FiTrash2, FiSearch, 
//   FiDollarSign, FiCheckCircle, FiXCircle,
//   FiUserPlus
// } from 'react-icons/fi';
// import toast from 'react-hot-toast';

// const SponsorsList = () => {
//   const [sponsors, setSponsors] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const userData = JSON.parse(localStorage.getItem('ecocollect_user'));
//     setUser(userData);
//     loadSponsors();
//   }, []);

//   useEffect(() => {
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       setFiltered(sponsors.filter(s => 
//         s.nom_organisation?.toLowerCase().includes(term) ||
//         s.email?.toLowerCase().includes(term) ||
//         s.nom_responsable?.toLowerCase().includes(term)
//       ));
//     } else {
//       setFiltered(sponsors);
//     }
//   }, [searchTerm, sponsors]);

//   const loadSponsors = async () => {
//     try {
//       setLoading(true);
//       const data = await adminService.getSponsors();
//       setSponsors(data.sponsors || []);
//       setFiltered(data.sponsors || []);
//     } catch (error) {
//       toast.error('Erreur chargement sponsors');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Supprimer ce sponsor ?')) {
//       try {
//         await adminService.supprimerSponsor(id);
//         toast.success('Sponsor supprimé');
//         loadSponsors();
//       } catch {
//         toast.error('Erreur suppression');
//       }
//     }
//   };

//   const getStatusBadge = (actif) => (
//     <span className={`badge ${actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//       {actif ? <FiCheckCircle className="inline mr-1" /> : <FiXCircle className="inline mr-1" />}
//       {actif ? 'Actif' : 'Inactif'}
//     </span>
//   );

//   const styles = `
//     .header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
//     .btn-primary { background: #2d8a5e; color: white; padding: 0.75rem 1.5rem; border-radius: 100px; display: flex; align-items: center; gap: 0.5rem; text-decoration: none; }
//     .search-box { margin-bottom: 1.5rem; position: relative; max-width: 400px; }
//     .search-box input { width: 100%; padding: 0.75rem 1rem 0.75rem 2.5rem; border: 1.5px solid #d9e0d9; border-radius: 0.75rem; }
//     .search-box i { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #5a655a; }
//     .table-container { background: white; border-radius: 1rem; border: 1px solid #d9e0d9; overflow-x: auto; }
//     table { width: 100%; border-collapse: collapse; }
//     th { background: #f8faf8; padding: 1rem; text-align: left; }
//     td { padding: 1rem; border-bottom: 1px solid #d9e0d9; }
//     .action-btn { background: none; border: none; color: #5a655a; cursor: pointer; padding: 0.5rem; border-radius: 0.5rem; }
//     .action-btn:hover { background: #e8f3e8; color: #2d8a5e; }
//     .badge { padding: 0.25rem 0.75rem; border-radius: 100px; font-size: 0.75rem; font-weight: 600; display: inline-flex; align-items: center; gap: 0.25rem; }
//   `;

//   return (
//     <>
//       <style>{styles}</style>
//       <DashboardLayout title="Gestion des sponsors" user={user}>
//         <div className="header-section">
//           <h1 className="page-title">Liste des sponsors</h1>
//           <Link to="/admin/sponsors/nouveau" className="btn-primary">
//             <FiUserPlus /> Nouveau sponsor
//           </Link>
//         </div>

//         <div className="search-box">
//           <i className="fas fa-search"></i>
//           <input
//             type="text"
//             placeholder="Rechercher..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         {loading ? (
//           <div className="text-center py-8">Chargement...</div>
//         ) : filtered.length > 0 ? (
//           <div className="table-container">
//             <table>
//               <thead>
//                 <tr>
//                   <th>Organisation</th>
//                   <th>Responsable</th>
//                   <th>Email</th>
//                   <th>Téléphone</th>
//                   <th>Statut</th>
//                   <th>Nb campagnes</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map(s => (
//                   <tr key={s.id}>
//                     <td className="font-medium">{s.nom_organisation}</td>
//                     <td>{s.nom_responsable || '-'}</td>
//                     <td>{s.email}</td>
//                     <td>{s.telephone || '-'}</td>
//                     <td>{getStatusBadge(s.est_actif)}</td>
//                     <td>{s.nb_campagnes || 0}</td>
//                     <td>
//                       <div className="flex gap-2">
//                         <Link to={`/admin/sponsors/${s.id}`} className="action-btn">
//                           <FiEye />
//                         </Link>
//                         <Link to={`/admin/sponsors/${s.id}/edit`} className="action-btn">
//                           <FiEdit2 />
//                         </Link>
//                         <button className="action-btn" onClick={() => handleDelete(s.id)}>
//                           <FiTrash2 />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="text-center py-8 text-gray-500">Aucun sponsor trouvé</div>
//         )}
//       </DashboardLayout>
//     </>
//   );
// };

// export default SponsorsList;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiEye, FiPlus, FiCheck, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import DashboardLayout from '../../Layouts/LayoutDashboard';

const SponsorsList = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('ecocollect_user')));
    loadSponsors();
  }, []);

  // const loadSponsors = async () => {
  //   try {
  //     setLoading(true);
  //     const { data } = await adminService.getSponsors();
  //     setSponsors(data.sponsors || []);
  //   } catch (error) {
  //     toast.error('Erreur lors du chargement des sponsors');
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const loadSponsors = async () => {
    try {
        setLoading(true);
        const response = await adminService.getSponsors();
        console.log('Réponse brute:', response);
        setSponsors(response.sponsors || []);
    } catch (error) {
        console.error('Erreur détaillée:', error);
        if (error.response) {
            console.error('Données de la réponse:', error.response.data);
            console.error('Statut:', error.response.status);
        }
        toast.error('Erreur lors du chargement des sponsors');
    } finally {
        setLoading(false);
    }
};

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce sponsor ?')) return;
    try {
      await adminService.deleteSponsor(id);
      toast.success('Sponsor supprimé');
      loadSponsors();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleToggleActif = async (sponsor) => {
    try {
      if (sponsor.est_actif) {
        const raison = prompt('Raison de la désactivation :');
        if (!raison) return;
        await adminService.deactivateSponsor(sponsor.id, raison);
        toast.success('Sponsor désactivé');
      } else {
        await adminService.activateSponsor(sponsor.id);
        toast.success('Sponsor activé');
      }
      loadSponsors();
    } catch (error) {
      toast.error('Erreur lors du changement de statut');
    }
  };

  if (loading) return <DashboardLayout title="Sponsors"><p>Chargement...</p></DashboardLayout>;

  return (
    <DashboardLayout title="Gestion des sponsors" user={user}>
      <div className="mb-4 flex justify-end">
        <Link to="/admin/sponsors/nouveau" className="btn-primary flex items-center gap-2">
          <FiPlus /> Nouveau sponsor
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Logo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organisation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responsable</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sponsors.map((sponsor) => (
              <tr key={sponsor.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {sponsor.photo_logo_url ? (
                    <img src={sponsor.photo_logo_url} alt="logo" className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="h-10 w-10 bg-gray-200 rounded-full" />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{sponsor.nom_organisation}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sponsor.nom_responsable}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sponsor.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    sponsor.est_actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {sponsor.est_actif ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleToggleActif(sponsor)}
                    className={`mr-2 p-1 rounded ${sponsor.est_actif ? 'text-red-600 hover:bg-red-100' : 'text-green-600 hover:bg-green-100'}`}
                    title={sponsor.est_actif ? 'Désactiver' : 'Activer'}
                  >
                    {sponsor.est_actif ? <FiX /> : <FiCheck />}
                  </button>
                  <Link to={`/admin/sponsors/${sponsor.id}/edit`} className="text-blue-600 hover:text-blue-900 mr-2">
                    <FiEdit2 />
                  </Link>
                  <button onClick={() => handleDelete(sponsor.id)} className="text-red-600 hover:text-red-900">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
            {sponsors.length === 0 && (
              <tr><td colSpan="6" className="text-center py-4 text-gray-500">Aucun sponsor</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default SponsorsList;