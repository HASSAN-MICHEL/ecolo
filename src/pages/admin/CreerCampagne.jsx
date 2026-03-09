import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import * as adminService from '../../services/adminService';
import DashboardLayout from '../../Layouts/LayoutDashboard';

const CreerCampagne = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    objectifs: [{ typeDechet: '', poidsAttendue: '', prixParKg: '' }],
    zonesIntervention: []
  });

  const wasteTypes = [
    { value: 'plastique_pet', label: 'Plastique PET' },
    { value: 'plastique_pehd', label: 'Plastique PEHD' },
    { value: 'papier_carton', label: 'Papier/Carton' },
    { value: 'metal', label: 'Métal' },
    { value: 'verre', label: 'Verre' },
    { value: 'organique', label: 'Organique' }
  ];

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('ecocollect_user') || '{}');
    setUser(userData);
    
    if (id) {
      loadCampagne();
    }
  }, [id]);

  const loadCampagne = async () => {
    try {
      setLoading(true);
      const response = await adminService.getCampagne(id);
      
      if (response.success) {
        const c = response.campagne;
        
        // Transformer les types_dechets en objectifs si nécessaire
        let objectifs = c.objectifs || [];
        if (objectifs.length === 0 && c.types_dechets) {
          // Compatibilité avec ancien format
          objectifs = c.types_dechets.map((type, index) => ({
            typeDechet: type,
            poidsAttendue: Array.isArray(c.poids_attendue) ? c.poids_attendue[index] : c.poids_attendue,
            prixParKg: Array.isArray(c.prix_par_kg) ? c.prix_par_kg[index] : c.prix_par_kg
          }));
        }

        setFormData({
          nom: c.nom || '',
          description: c.description || '',
          dateDebut: c.date_debut ? c.date_debut.slice(0, 10) : '',
          dateFin: c.date_fin ? c.date_fin.slice(0, 10) : '',
          objectifs: objectifs,
          zonesIntervention: c.zones_intervention || []
        });
      }
    } catch (error) {
      console.error('Erreur chargement campagne:', error);
      toast.error('Erreur lors du chargement de la campagne');
      navigate('/admin/campagnes');
    } finally {
      setLoading(false);
    }
  };

  const handleObjectifChange = (index, field, value) => {
    const nouveauxObjectifs = [...formData.objectifs];
    nouveauxObjectifs[index][field] = value;
    setFormData(prev => ({ ...prev, objectifs: nouveauxObjectifs }));
  };

  const handleAjouterObjectif = () => {
    setFormData(prev => ({
      ...prev,
      objectifs: [...prev.objectifs, { typeDechet: '', poidsAttendue: '', prixParKg: '' }]
    }));
  };

  const handleSupprimerObjectif = (index) => {
    if (formData.objectifs.length > 1) {
      setFormData(prev => ({
        ...prev,
        objectifs: prev.objectifs.filter((_, i) => i !== index)
      }));
    }
  };

  const handleZoneChange = (e) => {
    const zones = e.target.value.split(',').map(z => z.trim()).filter(z => z);
    setFormData(prev => ({ ...prev, zonesIntervention: zones }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!formData.nom || !formData.dateDebut || !formData.dateFin) {
      toast.error('Veuillez remplir le nom et les dates de la campagne');
      return;
    }

    if (formData.objectifs.length === 0) {
      toast.error('Ajoutez au moins un objectif');
      return;
    }

    for (const obj of formData.objectifs) {
      if (!obj.typeDechet || !obj.poidsAttendue || !obj.prixParKg) {
        toast.error('Tous les objectifs doivent être complets');
        return;
      }
      if (parseFloat(obj.poidsAttendue) <= 0 || parseFloat(obj.prixParKg) <= 0) {
        toast.error('Les poids et prix doivent être positifs');
        return;
      }
    }

    if (new Date(formData.dateDebut) > new Date(formData.dateFin)) {
      toast.error('La date de début doit être antérieure à la date de fin');
      return;
    }

    try {
      setLoading(true);
      
      const dataToSend = {
        ...formData,
        // Ne pas envoyer les champs dupliqués
      };

      if (id) {
        const response = await adminService.updateCampagne(id, dataToSend);
        if (response.success) {
          toast.success('Campagne modifiée avec succès');
          navigate('/admin/campagnes');
        }
      } else {
        const response = await adminService.createCampagne(dataToSend);
        if (response.success) {
          toast.success('Campagne créée avec succès');
          navigate('/admin/campagnes');
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title={id ? 'Modifier la campagne' : 'Nouvelle campagne'} user={user}>
      <div className="mb-6">
        <button 
          onClick={() => navigate('/admin/campagnes')} 
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <FiArrowLeft /> Retour à la liste
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 max-w-3xl mx-auto">
        {loading && !formData.nom && id ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Chargement de la campagne...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Informations générales */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de la campagne <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nom"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Ex: Campagne de recyclage 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Description de la campagne..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de début <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="dateDebut"
                      required
                      value={formData.dateDebut}
                      onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de fin <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="dateFin"
                      required
                      value={formData.dateFin}
                      onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                      min={formData.dateDebut || new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Objectifs par type de déchet */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Objectifs par type de déchet</h3>
              
              {formData.objectifs.map((objectif, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-purple-700">Objectif #{index + 1}</h4>
                    {formData.objectifs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleSupprimerObjectif(index)}
                        className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors"
                        title="Supprimer cet objectif"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <select
                      value={objectif.typeDechet}
                      onChange={(e) => handleObjectifChange(index, 'typeDechet', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                      required
                    >
                      <option value="">Type de déchet</option>
                      {wasteTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    
                    <input
                      type="number"
                      placeholder="Poids (kg)"
                      value={objectif.poidsAttendue}
                      onChange={(e) => handleObjectifChange(index, 'poidsAttendue', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                      min="1"
                      step="0.1"
                      required
                    />
                    
                    <input
                      type="number"
                      placeholder="Prix/kg (FCFA)"
                      value={objectif.prixParKg}
                      onChange={(e) => handleObjectifChange(index, 'prixParKg', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                      min="1"
                      step="1"
                      required
                    />
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={handleAjouterObjectif}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter un type de déchet
              </button>
            </div>

            {/* Zones d'intervention */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Zones d'intervention</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Communes/Localités (séparées par des virgules)
                </label>
                <input
                  type="text"
                  value={formData.zonesIntervention.join(', ')}
                  onChange={handleZoneChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Ex: Dakar, Pikine, Guédiawaye"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Laissez vide si la campagne est nationale
                </p>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => navigate('/admin/campagnes')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FiSave />
                {loading ? 'Enregistrement...' : (id ? 'Mettre à jour' : 'Créer la campagne')}
              </button>
            </div>
          </div>
        )}
      </form>
    </DashboardLayout>
  );
};

export default CreerCampagne;