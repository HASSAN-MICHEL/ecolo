import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiEye, FiPlus, FiCheck, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import * as adminService from '../../services/adminService';
import DashboardLayout from '../../Layouts/LayoutDashboard';

const SponsorsList = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('ecocollect_user')));
    loadSponsors();
  }, []);

  const loadSponsors = async () => {
    try {
      setLoading(true);
      const { data } = await adminService.getSponsors();
      setSponsors(data.sponsors || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des sponsors');
      console.error(error);
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
                <td className="px-6 py-4 whitespace-nowrap">{spponsor.email}</td>
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