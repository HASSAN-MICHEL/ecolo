import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../Layouts/LayoutDashboard';
import adminService from '../../services/adminService';
import { FiCheckCircle, FiXCircle, FiEye, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const DemandesSuppressionList = () => {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionNotes, setActionNotes] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('ecocollect_user'));
    setUser(userData);
    loadDemandes();
  }, []);

  const loadDemandes = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDemandesSuppression();
      setDemandes(data.demandes || []);
    } catch (error) {
      console.error('Erreur chargement demandes:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleTraiter = (demande) => {
    setSelectedDemande(demande);
    setActionNotes('');
    setShowModal(true);
  };

  const confirmTraiter = async (statut) => {
    if (!actionNotes.trim()) {
      toast.error('Veuillez entrer des notes de traitement');
      return;
    }
    try {
      await adminService.traiterDemande(selectedDemande.id, statut, actionNotes);
      toast.success(`Demande ${statut === 'approuvee' ? 'approuvée' : 'rejetée'}`);
      setShowModal(false);
      loadDemandes();
    } catch (error) {
      toast.error('Erreur lors du traitement');
    }
  };

  const getStatusBadge = (statut) => {
    const colors = {
      en_attente: 'bg-yellow-100 text-yellow-800',
      approuvee: 'bg-green-100 text-green-800',
      rejetee: 'bg-red-100 text-red-800',
    };
    const icons = {
      en_attente: FiClock,
      approuvee: FiCheckCircle,
      rejetee: FiXCircle,
    };
    const Icon = icons[statut] || FiClock;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${colors[statut] || 'bg-gray-100'}`}>
        <Icon size={12} /> {statut.replace('_', ' ')}
      </span>
    );
  };

  const styles = `
    .header-section { margin-bottom: 2rem; }
    .page-title { font-size: 1.5rem; font-weight: 700; color: #1a1e1a; }
    .table-container { background: white; border-radius: 1rem; border: 1px solid #d9e0d9; overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f8faf8; padding: 1rem; text-align: left; }
    td { padding: 1rem; border-bottom: 1px solid #d9e0d9; }
    .action-btn { background: none; border: none; color: #5a655a; cursor: pointer; padding: 0.5rem; border-radius: 0.5rem; }
    .action-btn:hover { background: #e8f3e8; color: #2d8a5e; }
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { background: white; border-radius: 1rem; padding: 2rem; max-width: 500px; width: 90%; }
    .modal-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem; }
    .btn-primary { background: #2d8a5e; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 100px; cursor: pointer; }
    .btn-secondary { background: #f8faf8; color: #1a1e1a; border: 1.5px solid #d9e0d9; padding: 0.75rem 1.5rem; border-radius: 100px; cursor: pointer; }
    .btn-danger { background: #dc2626; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 100px; cursor: pointer; }
  `;

  return (
    <>
      <style>{styles}</style>
      <DashboardLayout title="Demandes de suppression" user={user}>
        <div className="header-section">
          <h1 className="page-title">Gestion des demandes de suppression</h1>
        </div>

        {loading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : demandes.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Superviseur</th>
                  <th>Type entité</th>
                  <th>Entité</th>
                  <th>Raison</th>
                  <th>Statut</th>
                  <th>Date demande</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {demandes.map(d => (
                  <tr key={d.id}>
                    <td className="font-medium">{d.superviseur_nom}</td>
                    <td>{d.type_entite}</td>
                    <td>{d.entite_nom || d.entite_id}</td>
                    <td className="max-w-xs truncate">{d.raison}</td>
                    <td>{getStatusBadge(d.statut)}</td>
                    <td>{new Date(d.cree_le).toLocaleDateString()}</td>
                    <td>
                      {d.statut === 'en_attente' ? (
                        <button className="action-btn" onClick={() => handleTraiter(d)}>
                          <FiEye /> Traiter
                        </button>
                      ) : (
                        <span className="text-gray-400">Traité</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">Aucune demande en attente</div>
        )}

        {/* Modal de traitement */}
        {showModal && selectedDemande && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-4">Traiter la demande</h3>
              <p className="mb-2">
                <strong>Superviseur:</strong> {selectedDemande.superviseur_nom}
              </p>
              <p className="mb-2">
                <strong>Type:</strong> {selectedDemande.type_entite}
              </p>
              <p className="mb-4">
                <strong>Raison:</strong> {selectedDemande.raison}
              </p>
              <label className="block mb-2">Notes de traitement *</label>
              <textarea
                className="w-full border rounded p-2 mb-4"
                rows="3"
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder="Expliquez votre décision..."
              />
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowModal(false)}>
                  Annuler
                </button>
                <button className="btn-primary" onClick={() => confirmTraiter('approuvee')}>
                  Approuver
                </button>
                <button className="btn-danger" onClick={() => confirmTraiter('rejetee')}>
                  Rejeter
                </button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </>
  );
};

export default DemandesSuppressionList;