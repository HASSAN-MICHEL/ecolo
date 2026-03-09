import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../Layouts/LayoutDashboard';
import adminService from '../../services/adminService';
import { FiEye, FiXCircle, FiCalendar, FiDollarSign, FiAward } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProducteursPremiumList = () => {
  const [producteurs, setProducteurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('ecocollect_user'));
    setUser(userData);
    loadProducteurs();
  }, []);

  const loadProducteurs = async () => {
    try {
      setLoading(true);
      const data = await adminService.getProducteursPremium();
      setProducteurs(data.producteurs || []);
    } catch (error) {
      console.error('Erreur chargement producteurs premium:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleResilier = async (id, nom) => {
    if (!window.confirm(`Voulez-vous résilier l'abonnement de ${nom} ?`)) return;
    try {
      await adminService.resilierAbonnement(id, 'Résiliation par admin');
      toast.success('Abonnement résilié');
      loadProducteurs();
    } catch (error) {
      toast.error('Erreur lors de la résiliation');
    }
  };

  const getStatusBadge = (statut) => {
    const colors = {
      actif: 'bg-green-100 text-green-800',
      expire: 'bg-gray-100 text-gray-800',
      resilie: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[statut] || 'bg-gray-100'}`}>
        {statut}
      </span>
    );
  };

  const styles = `
    .header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .btn-primary { background: #2d8a5e; color: white; padding: 0.75rem 1.5rem; border-radius: 100px; display: flex; align-items: center; gap: 0.5rem; text-decoration: none; }
    .table-container { background: white; border-radius: 1rem; border: 1px solid #d9e0d9; overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f8faf8; padding: 1rem; text-align: left; }
    td { padding: 1rem; border-bottom: 1px solid #d9e0d9; }
    .badge { padding: 0.25rem 0.75rem; border-radius: 100px; font-size: 0.75rem; font-weight: 600; display: inline-flex; align-items: center; gap: 0.25rem; }
    .action-btn { background: none; border: none; color: #5a655a; cursor: pointer; padding: 0.5rem; border-radius: 0.5rem; }
    .action-btn:hover { background: #e8f3e8; color: #2d8a5e; }
    .action-btn.delete:hover { background: #fee2e2; color: #dc2626; }
  `;

  return (
    <>
      <style>{styles}</style>
      <DashboardLayout title="Producteurs Premium" user={user}>
        <div className="header-section">
          <h1 className="page-title">Liste des producteurs premium</h1>
          <Link to="/admin/producteurs/convertir-premium" className="btn-primary">
            <FiAward /> Convertir en premium
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : producteurs.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nom / Entreprise</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Abonnement</th>
                  <th>Fréquence</th>
                  <th>Montant</th>
                  <th>Date début</th>
                  <th>Date fin</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {producteurs.map(p => (
                  <tr key={p.id}>
                    <td className="font-medium">{p.nom_complet}</td>
                    <td>{p.email}</td>
                    <td>{p.telephone}</td>
                    <td>{p.type_abonnement}</td>
                    <td>{p.frequence_collecte}</td>
                    <td>{p.montant_abonnement?.toLocaleString()} FCFA</td>
                    <td>{new Date(p.date_debut).toLocaleDateString()}</td>
                    <td>{new Date(p.date_fin).toLocaleDateString()}</td>
                    <td>{getStatusBadge(p.abonnement_statut || p.statut)}</td>
                    <td>
                      <div className="flex gap-2">
                        <Link to={`/admin/producteurs-premium/${p.id}`} className="action-btn">
                          <FiEye />
                        </Link>
                        <button
                          className="action-btn delete"
                          onClick={() => handleResilier(p.id, p.nom_complet)}
                          title="Résilier abonnement"
                        >
                          <FiXCircle />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">Aucun producteur premium</div>
        )}
      </DashboardLayout>
    </>
  );
};

export default ProducteursPremiumList;