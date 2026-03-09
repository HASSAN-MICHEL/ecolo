import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import DashboardLayout from '../../Layouts/LayoutDashboard';

const OngsList = () => {
  const [ongs, setOngs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('ecocollect_user')));
    loadOngs();
  }, []);

  const loadOngs = async () => {
    try {
      setLoading(true);
      const response = await adminService.getOngs();
      console.log('Réponse API ongs:', response); // pour déboguer
      // Gestion des formats possibles
      if (response && response.ongs) {
        setOngs(response.ongs);
      } else if (Array.isArray(response)) {
        setOngs(response);
      } else {
        setOngs([]);
      }
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors du chargement des ONG');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardLayout title="ONG"><p>Chargement...</p></DashboardLayout>;

  return (
    <DashboardLayout title="Gestion des ONG" user={user}>
      <div className="mb-4 flex justify-end">
        <Link to="/admin/ongs/nouveau" className="btn-primary flex items-center gap-2">
          <FiPlus /> Nouvelle ONG
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom ONG</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responsable</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agrément</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ongs.map(ong => (
              <tr key={ong.id}>
                <td className="px-6 py-4 font-medium">{ong.nom_ong}</td>
                <td className="px-6 py-4">{ong.nom_responsable}</td>
                <td className="px-6 py-4">{ong.email}</td>
                <td className="px-6 py-4">{ong.numero_agrement || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    ong.est_actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {ong.est_actif ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link to={`/admin/ongs/${ong.id}/edit`} className="text-blue-600 hover:text-blue-900 mr-2">
                    <FiEdit2 />
                  </Link>
                  {/* Pas de suppression */}
                </td>
              </tr>
            ))}
            {ongs.length === 0 && (
              <tr><td colSpan="6" className="text-center py-4">Aucune ONG</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default OngsList;