import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiPlus, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import DashboardLayout from '../../Layouts/LayoutDashboard';

const CreerCampagne = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingPromoteurs, setLoadingPromoteurs] = useState(false);
  const [user, setUser] = useState(null);
  const [promoteurs, setPromoteurs] = useState({
    sponsors: [],
    ongs: []
  });
  
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    objectifs: [{ typeDechet: '', poidsAttendue: '', prixParKg: '' }],
    zonesIntervention: [],
    promoteurs: []
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
    
    loadPromoteurs();
    
    if (id) {
      loadCampagne();
    }
  }, [id]);

  const loadPromoteurs = async () => {
    try {
      setLoadingPromoteurs(true);
      
      // Utiliser les routes admin pour récupérer les promoteurs
      const [sponsorsRes, ongsRes] = await Promise.all([
        adminService.getSponsors(),
        adminService.getOngs()
      ]);

      setPromoteurs({
        sponsors: sponsorsRes.sponsors || [],
        ongs: ongsRes.ongs || []
      });
    } catch (error) {
      console.error('Erreur chargement promoteurs:', error);
      toast.error('Erreur lors du chargement des sponsors/ONG');
    } finally {
      setLoadingPromoteurs(false);
    }
  };

  const loadCampagne = async () => {
    try {
      setLoading(true);
      const response = await adminService.getCampagne(id);
      
      if (response.success) {
        const c = response.campagne;
        
        // Transformer les données pour le formulaire
        let objectifs = [];
        
        // Si la campagne a des objectifs (nouveau format)
        if (c.objectifs && Array.isArray(c.objectifs) && c.objectifs.length > 0) {
          objectifs = c.objectifs.map(obj => ({
            typeDechet: obj.type_dechet || obj.typeDechet,
            poidsAttendue: obj.poids_attendue || obj.poidsAttendue,
            prixParKg: obj.prix_par_kg || obj.prixParKg
          }));
        } 
        // Ancien format avec types_dechets
        else if (c.types_dechets) {
          const types = Array.isArray(c.types_dechets) ? c.types_dechets : [c.types_dechets];
          objectifs = types.map((type, index) => ({
            typeDechet: type,
            poidsAttendue: Array.isArray(c.poids_attendue) ? c.poids_attendue[index] : c.poids_attendue,
            prixParKg: Array.isArray(c.prix_par_kg) ? c.prix_par_kg[index] : c.prix_par_kg
          }));
        }

        // Formater les promoteurs existants
        const promoteursExistants = [];
        if (c.promoteurs) {
          if (Array.isArray(c.promoteurs)) {
            promoteursExistants.push(...c.promoteurs.map(p => ({
              type: p.type,
              id: p.id || p.promoteur_id
            })));
          }
        }

        setFormData({
          nom: c.nom || '',
          description: c.description || '',
          dateDebut: c.date_debut ? c.date_debut.slice(0, 10) : '',
          dateFin: c.date_fin ? c.date_fin.slice(0, 10) : '',
          objectifs: objectifs.length > 0 ? objectifs : [{ typeDechet: '', poidsAttendue: '', prixParKg: '' }],
          zonesIntervention: c.zones_intervention || [],
          promoteurs: promoteursExistants
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

  const handlePromoteurChange = (e) => {
    const { value, checked } = e.target;
    const [type, id] = value.split(':');
    
    setFormData(prev => ({
      ...prev,
      promoteurs: checked
        ? [...prev.promoteurs, { type, id }]
        : prev.promoteurs.filter(p => !(p.type === type && p.id === id))
    }));
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
      
      // Préparer les données EXACTEMENT comme les attend le backend
      const dataToSend = {
        nom: formData.nom,
        description: formData.description || '',
        dateDebut: formData.dateDebut,
        dateFin: formData.dateFin,
        objectifs: formData.objectifs.map(obj => ({
          typeDechet: obj.typeDechet,
          poidsAttendue: parseFloat(obj.poidsAttendue),
          prixParKg: parseFloat(obj.prixParKg)
        })),
        zonesIntervention: formData.zonesIntervention,
        promoteurs: formData.promoteurs.map(p => ({
          id: p.id,
          type: p.type
          // Pas de contribution car le backend l'attend mais peut être null
        }))
      };

      console.log('📤 Données envoyées au backend:', JSON.stringify(dataToSend, null, 2));

      let response;
      if (id) {
        response = await adminService.updateCampagne(id, dataToSend);
      } else {
        response = await adminService.createCampagne(dataToSend);
      }

      if (response && response.success) {
        toast.success(id ? 'Campagne modifiée avec succès' : 'Campagne créée avec succès');
        navigate('/admin/campagnes');
      } else {
        throw new Error(response?.message || 'Erreur lors de l\'enregistrement');
      }
    } catch (error) {
      console.error('❌ Erreur détaillée:', error);
      toast.error(error.response?.data?.message || error.message || 'Erreur lors de l\'enregistrement');
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

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 max-w-4xl mx-auto">
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
                        <FiX size={18} />
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
                <FiPlus size={16} />
                Ajouter un type de déchet
              </button>
            </div>

            {/* Sélection des promoteurs (Sponsors/ONG) */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Promoteurs (Sponsors / ONG)</h3>
              
              {loadingPromoteurs ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-purple-600 border-t-transparent"></div>
                  <p className="mt-2 text-sm text-gray-500">Chargement des promoteurs...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sponsors */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Sponsors
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {promoteurs.sponsors.length > 0 ? (
                        promoteurs.sponsors.map(sponsor => (
                          <label key={`sponsor-${sponsor.id}`} className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer">
                            <input
                              type="checkbox"
                              value={`sponsor:${sponsor.id}`}
                              checked={formData.promoteurs.some(p => p.type === 'sponsor' && p.id === sponsor.id)}
                              onChange={handlePromoteurChange}
                              className="rounded text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-sm">{sponsor.nom_organisation || sponsor.nom}</span>
                          </label>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-2">Aucun sponsor disponible</p>
                      )}
                    </div>
                  </div>

                  {/* ONG */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Organisations (ONG)
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {promoteurs.ongs.length > 0 ? (
                        promoteurs.ongs.map(ong => (
                          <label key={`ong-${ong.id}`} className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer">
                            <input
                              type="checkbox"
                              value={`ong:${ong.id}`}
                              checked={formData.promoteurs.some(p => p.type === 'ong' && p.id === ong.id)}
                              onChange={handlePromoteurChange}
                              className="rounded text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-sm">{ong.nom_ong || ong.nom}</span>
                          </label>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-2">Aucune ONG disponible</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Résumé des promoteurs sélectionnés */}
              {formData.promoteurs.length > 0 && (
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-700 mb-2">
                    Promoteurs sélectionnés ({formData.promoteurs.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.promoteurs.map((p, idx) => {
                      const promoteur = p.type === 'sponsor' 
                        ? promoteurs.sponsors.find(s => s.id === p.id)
                        : promoteurs.ongs.find(o => o.id === p.id);
                      return (
                        <span key={idx} className="px-2 py-1 bg-white text-xs rounded-full border border-purple-200">
                          {p.type === 'sponsor' ? '🏢' : '🤝'} {promoteur?.nom_organisation || promoteur?.nom_ong || promoteur?.nom || p.id}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
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