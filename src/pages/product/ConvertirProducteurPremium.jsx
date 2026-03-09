import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../Layouts/LayoutDashboard';
import adminService from '../../services/adminService';
import { FiSave, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ConvertirProducteurPremium = () => {
  const navigate = useNavigate();
  const [producteurs, setProducteurs] = useState([]);
  const [selectedProducteur, setSelectedProducteur] = useState('');
  const [formData, setFormData] = useState({
    typeAbonnement: 'mensuel',
    frequenceCollecte: 'hebdomadaire',
    montantAbonnement: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingProducteurs, setLoadingProducteurs] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('ecocollect_user'));
    setUser(userData);
    loadProducteurs();
  }, []);

  const loadProducteurs = async () => {
    try {
      // Supposons que adminService.getProducteurs() existe et retourne tous les producteurs
      const data = await adminService.getProducteurs(); // à implémenter
      setProducteurs(data.producteurs || []);
    } catch (error) {
      toast.error('Erreur chargement producteurs');
    } finally {
      setLoadingProducteurs(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProducteur) {
      toast.error('Veuillez sélectionner un producteur');
      return;
    }
    if (!formData.montantAbonnement || parseFloat(formData.montantAbonnement) <= 0) {
      toast.error('Montant invalide');
      return;
    }

    try {
      setLoading(true);
      await adminService.convertirEnPremium(selectedProducteur, {
        typeAbonnement: formData.typeAbonnement,
        frequenceCollecte: formData.frequenceCollecte,
        montantAbonnement: parseFloat(formData.montantAbonnement),
      });
      toast.success('Producteur converti en premium');
      navigate('/admin/producteurs-premium');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur conversion');
    } finally {
      setLoading(false);
    }
  };

  const styles = `
    .form-container { max-width: 600px; margin: 0 auto; }
    .form-card { background: white; border-radius: 1rem; padding: 2rem; border: 1px solid #d9e0d9; }
    .form-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 2rem; }
    .form-group { margin-bottom: 1.5rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 600; }
    input, select { width: 100%; padding: 0.75rem 1rem; border: 1.5px solid #d9e0d9; border-radius: 0.75rem; }
    .btn-primary { background: #2d8a5e; color: white; border: none; padding: 0.75rem 2rem; border-radius: 100px; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
    .btn-secondary { background: #f8faf8; color: #1a1e1a; border: 1.5px solid #d9e0d9; padding: 0.75rem 2rem; border-radius: 100px; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
  `;

  return (
    <>
      <style>{styles}</style>
      <DashboardLayout title="Convertir en premium" user={user}>
        <div className="form-container">
          <div className="form-card">
            <h2 className="form-title">Convertir un producteur en premium</h2>

            {loadingProducteurs ? (
              <div>Chargement des producteurs...</div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Producteur *</label>
                  <select
                    value={selectedProducteur}
                    onChange={(e) => setSelectedProducteur(e.target.value)}
                    required
                  >
                    <option value="">Sélectionnez un producteur</option>
                    {producteurs
                      .filter(p => p.type_compte !== 'premium') // seulement les standards
                      .map(p => (
                        <option key={p.id} value={p.id}>
                          {p.nom_complet} - {p.email}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Type d'abonnement *</label>
                  <select name="typeAbonnement" value={formData.typeAbonnement} onChange={handleChange}>
                    <option value="mensuel">Mensuel</option>
                    <option value="trimestriel">Trimestriel</option>
                    <option value="annuel">Annuel</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Fréquence de collecte *</label>
                  <select name="frequenceCollecte" value={formData.frequenceCollecte} onChange={handleChange}>
                    <option value="hebdomadaire">Hebdomadaire</option>
                    <option value="bi-mensuelle">Bi-mensuelle</option>
                    <option value="mensuelle">Mensuelle</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Montant de l'abonnement (FCFA) *</label>
                  <input
                    type="number"
                    step="100"
                    min="0"
                    name="montantAbonnement"
                    value={formData.montantAbonnement}
                    onChange={handleChange}
                    required
                    placeholder="5000"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Traitement...' : <><FiSave /> Convertir</>}
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => navigate('/admin/producteurs-premium')}>
                    <FiX /> Annuler
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default ConvertirProducteurPremium;