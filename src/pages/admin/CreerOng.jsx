import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import DashboardLayout from '../../Layouts/LayoutDashboard';

const CreerOng = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    nomOng: '',
    numeroAgrement: '',
    domaineIntervention: '',
    nomResponsable: '',
    email: '',
    telephone: '',
    adresse: '',
    motDePasse: ''
  });

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('ecocollect_user')));
    if (id) {
      loadOng();
    }
  }, [id]);

  const loadOng = async () => {
    try {
      setLoading(true);
      const { data } = await adminService.getOng(id);
      const ong = data.ong;
      setFormData({
        nomOng: ong.nom_ong || '',
        numeroAgrement: ong.numero_agrement || '',
        domaineIntervention: ong.domaine_intervention ? ong.domaine_intervention.join(',') : '',
        nomResponsable: ong.nom_responsable || '',
        email: ong.email || '',
        telephone: ong.telephone || '',
        adresse: ong.adresse || '',
        motDePasse: ''  // jamais pré-rempli
      });
    } catch (error) {
      toast.error('Erreur chargement ONG');
      navigate('/admin/ongs');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (id) {
        // Pour la modification, ne pas envoyer le mot de passe
        const { motDePasse, ...dataToSend } = formData;
        await adminService.updateOng(id, dataToSend);
        toast.success('ONG modifiée');
      } else {
        await adminService.createOng(formData);
        toast.success('ONG créée');
      }
      navigate('/admin/ongs');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title={id ? 'Modifier ONG' : 'Nouvelle ONG'} user={user}>
      <div className="mb-4">
        <button onClick={() => navigate('/admin/ongs')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <FiArrowLeft /> Retour
        </button>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <div className="grid grid-cols-1 gap-6">
          {/* Champ Logo supprimé */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'ONG *</label>
            <input type="text" name="nomOng" required value={formData.nomOng} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Numéro d'agrément</label>
            <input type="text" name="numeroAgrement" value={formData.numeroAgrement} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Domaines d'intervention (séparés par des virgules)</label>
            <input type="text" name="domaineIntervention" value={formData.domaineIntervention} onChange={handleChange} className="input-field" placeholder="ex: environnement, éducation, santé" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du responsable *</label>
            <input type="text" name="nomResponsable" required value={formData.nomResponsable} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
            <input type="tel" name="telephone" required value={formData.telephone} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} className="input-field" />
          </div>
          {!id && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
              <input type="password" name="motDePasse" required value={formData.motDePasse} onChange={handleChange} className="input-field" />
            </div>
          )}
          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              <FiSave /> {loading ? 'Enregistrement...' : (id ? 'Mettre à jour' : 'Créer')}
            </button>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default CreerOng;