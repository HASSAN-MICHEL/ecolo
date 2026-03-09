import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import * as adminService from '../../services/adminService';
import DashboardLayout from '../../Layouts/LayoutDashboard';

const CreerSponsor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    nomOrganisation: '',
    typeOrganisation: 'entreprise',
    nomResponsable: '',
    email: '',
    telephone: '',
    adresse: '',
    motDePasse: '',
    photoLogo: null
  });

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('ecocollect_user')));
    if (id) {
      loadSponsor();
    }
  }, [id]);

  const loadSponsor = async () => {
    try {
      setLoading(true);
      const { data } = await adminService.getSponsor(id);
      const sponsor = data.sponsor;
      setFormData({
        nomOrganisation: sponsor.nom_organisation || '',
        typeOrganisation: sponsor.type_organisation || 'entreprise',
        nomResponsable: sponsor.nom_responsable || '',
        email: sponsor.email || '',
        telephone: sponsor.telephone || '',
        adresse: sponsor.adresse || '',
        motDePasse: '', // ne pas pré-remplir
        photoLogo: null
      });
    } catch (error) {
      toast.error('Erreur chargement sponsor');
      navigate('/admin/sponsors');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photoLogo') {
      setFormData({ ...formData, photoLogo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (id) {
        await adminService.updateSponsor(id, formData);
        toast.success('Sponsor modifié');
      } else {
        await adminService.createSponsor(formData);
        toast.success('Sponsor créé');
      }
      navigate('/admin/sponsors');
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title={id ? 'Modifier sponsor' : 'Nouveau sponsor'} user={user}>
      <div className="mb-4">
        <button onClick={() => navigate('/admin/sponsors')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <FiArrowLeft /> Retour
        </button>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
            <input type="file" name="photoLogo" accept="image/*" onChange={handleChange} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'organisation *</label>
            <input type="text" name="nomOrganisation" required value={formData.nomOrganisation} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type d'organisation *</label>
            <select name="typeOrganisation" value={formData.typeOrganisation} onChange={handleChange} className="input-field">
              <option value="entreprise">Entreprise</option>
              <option value="association">Association</option>
              <option value="fondation">Fondation</option>
              <option value="autre">Autre</option>
            </select>
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

export default CreerSponsor;