import React, { useState } from 'react';
import DashboardLayout from '../../Layouts/LayoutDashboard';
import adminService from '../../services/adminService';
import { FiUpload, FiSave, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CreerRecycleur = () => {
  const [formData, setFormData] = useState({
    email: '',
    telephone: '',
    motDePasse: '',
    nomEntreprise: '',
    nomResponsable: '',
    adresse: '',
    quartier: '',
    commune: '',
    numeroIdentite: '',
  });

  const [files, setFiles] = useState({
    photoProfil: null,
    photoCniRecto: null,
    photoCniVerso: null,
  });

  const [previews, setPreviews] = useState({
    photoProfil: null,
    photoCniRecto: null,
    photoCniVerso: null,
  });

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('ecocollect_user'));
    setUser(userData);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [field]: file }));
      
      // Créer une prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (field) => {
    setFiles(prev => ({ ...prev, [field]: null }));
    setPreviews(prev => ({ ...prev, [field]: null }));
    document.getElementById(field).value = '';
  };


  // Dans CreerRecycleur.js - Modifiez la fonction handleSubmit
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validation
  if (!formData.email || !formData.telephone || !formData.motDePasse || 
      !formData.nomEntreprise || !formData.nomResponsable) {
    toast.error('Veuillez remplir tous les champs obligatoires');
    return;
  }

  if (!files.photoCniRecto || !files.photoCniVerso) {
    toast.error('Les photos recto et verso de la CNI sont requises');
    return;
  }

  const formDataToSend = new FormData();
  
  // Ajouter les champs texte un par un (plus fiable)
  formDataToSend.append('email', formData.email);
  formDataToSend.append('telephone', formData.telephone);
  formDataToSend.append('motDePasse', formData.motDePasse);
  formDataToSend.append('nomEntreprise', formData.nomEntreprise);
  formDataToSend.append('nomResponsable', formData.nomResponsable);
  formDataToSend.append('adresse', formData.adresse || '');
  formDataToSend.append('quartier', formData.quartier || '');
  formDataToSend.append('commune', formData.commune || '');
  formDataToSend.append('numeroIdentite', formData.numeroIdentite || '');

  // Ajouter les fichiers
  if (files.photoProfil) {
    formDataToSend.append('photoProfil', files.photoProfil);
  }
  if (files.photoCniRecto) {
    formDataToSend.append('photoCniRecto', files.photoCniRecto);
  }
  if (files.photoCniVerso) {
    formDataToSend.append('photoCniVerso', files.photoCniVerso);
  }

  // Afficher le contenu de FormData pour déboguer
  console.log('📦 Contenu de FormData:');
  for (let pair of formDataToSend.entries()) {
    console.log(pair[0] + ': ' + (pair[0].includes('motDePasse') ? '[HIDDEN]' : pair[1]));
  }

  try {
    setLoading(true);
    const response = await adminService.creerRecycleur(formDataToSend);
    
    if (response.success) {
      toast.success('Recycleur créé avec succès !');
      // Réinitialiser le formulaire
      setFormData({
        email: '',
        telephone: '',
        motDePasse: '',
        nomEntreprise: '',
        nomResponsable: '',
        adresse: '',
        quartier: '',
        commune: '',
        numeroIdentite: '',
      });
      setFiles({
        photoProfil: null,
        photoCniRecto: null,
        photoCniVerso: null,
      });
      setPreviews({
        photoProfil: null,
        photoCniRecto: null,
        photoCniVerso: null,
      });
    }
  } catch (error) {
    console.error('❌ Erreur détaillée:', error);
    toast.error(error.response?.data?.message || 'Erreur lors de la création');
  } finally {
    setLoading(false);
  }
};

  const styles = `
    .form-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .form-card {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      border: 1px solid #d9e0d9;
    }

    .form-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a1e1a;
      margin-bottom: 2rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group.full-width {
      grid-column: span 2;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #1a1e1a;
    }

    label span {
      color: #dc2626;
      margin-left: 0.25rem;
    }

    input, textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1.5px solid #d9e0d9;
      border-radius: 0.75rem;
      font-size: 0.95rem;
      transition: all 0.2s;
    }

    input:focus, textarea:focus {
      border-color: #2d8a5e;
      outline: none;
      box-shadow: 0 0 0 3px rgba(45, 138, 94, 0.1);
    }

    .photo-section {
      grid-column: span 2;
      margin: 1.5rem 0;
    }

    .photo-title {
      font-weight: 600;
      color: #1a1e1a;
      margin-bottom: 1rem;
    }

    .photo-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    .photo-upload {
      text-align: center;
    }

    .photo-preview {
      width: 100%;
      height: 150px;
      border: 2px dashed #d9e0d9;
      border-radius: 0.75rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      background: #f8faf8;
      margin-bottom: 0.5rem;
    }

    .photo-preview.has-image {
      border: 2px solid #2d8a5e;
    }

    .photo-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .photo-preview i {
      font-size: 2rem;
      color: #5a655a;
      margin-bottom: 0.5rem;
    }

    .photo-preview span {
      font-size: 0.8rem;
      color: #5a655a;
    }

    .remove-btn {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: #dc2626;
      color: white;
      border: none;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10;
    }

    .remove-btn:hover {
      background: #b91c1c;
    }

    .photo-hint {
      font-size: 0.75rem;
      color: #5a655a;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .btn-primary {
      background: #2d8a5e;
      color: white;
      border: none;
      padding: 0.75rem 2rem;
      border-radius: 100px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s;
    }

    .btn-primary:hover:not(:disabled) {
      background: #1e5e3f;
      transform: translateY(-2px);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #f8faf8;
      color: #1a1e1a;
      border: 1.5px solid #d9e0d9;
      padding: 0.75rem 2rem;
      border-radius: 100px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s;
    }

    .btn-secondary:hover {
      background: #e8f3e8;
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
      
      .form-group.full-width {
        grid-column: span 1;
      }
      
      .photo-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <DashboardLayout title="Créer un Recycleur" user={user}>
        <div className="form-container">
          <div className="form-card">
            <h2 className="form-title">Créer un compte Recycleur</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                {/* Informations de connexion */}
                <div className="form-group">
                  <label>Email <span>*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contact@entreprise.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Téléphone <span>*</span></label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    placeholder="+221 77 123 45 67"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Mot de passe <span>*</span></label>
                  <input
                    type="password"
                    name="motDePasse"
                    value={formData.motDePasse}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Confirmer mot de passe <span>*</span></label>
                  <input
                    type="password"
                    placeholder="••••••••"
                  />
                </div>

                {/* Informations entreprise */}
                <div className="form-group">
                  <label>Nom de l'entreprise <span>*</span></label>
                  <input
                    type="text"
                    name="nomEntreprise"
                    value={formData.nomEntreprise}
                    onChange={handleInputChange}
                    placeholder="Eco Recyclage SARL"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Nom du responsable <span>*</span></label>
                  <input
                    type="text"
                    name="nomResponsable"
                    value={formData.nomResponsable}
                    onChange={handleInputChange}
                    placeholder="Jean Dupont"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Adresse</label>
                  <input
                    type="text"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleInputChange}
                    placeholder="123 Avenue de la République"
                  />
                </div>

                <div className="form-group">
                  <label>Quartier</label>
                  <input
                    type="text"
                    name="quartier"
                    value={formData.quartier}
                    onChange={handleInputChange}
                    placeholder="Centre-ville"
                  />
                </div>

                <div className="form-group">
                  <label>Commune</label>
                  <input
                    type="text"
                    name="commune"
                    value={formData.commune}
                    onChange={handleInputChange}
                    placeholder="Dakar Plateau"
                  />
                </div>

                <div className="form-group">
                  <label>Numéro d'identité</label>
                  <input
                    type="text"
                    name="numeroIdentite"
                    value={formData.numeroIdentite}
                    onChange={handleInputChange}
                    placeholder="N° CNI ou passeport"
                  />
                </div>
              </div>

              {/* Section photos */}
              <div className="photo-section">
                <h3 className="photo-title">Documents d'identification</h3>
                <div className="photo-grid">
                  {/* Photo de profil */}
                  <div className="photo-upload">
                    <div 
                      className={`photo-preview ${previews.photoProfil ? 'has-image' : ''}`}
                      onClick={() => document.getElementById('photoProfil').click()}
                    >
                      {previews.photoProfil ? (
                        <img src={previews.photoProfil} alt="Profil" />
                      ) : (
                        <>
                          <i className="fas fa-user"></i>
                          <span>Photo de profil</span>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      id="photoProfil"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'photoProfil')}
                      style={{ display: 'none' }}
                    />
                    {files.photoProfil && (
                      <button 
                        type="button"
                        className="remove-btn"
                        onClick={() => removeFile('photoProfil')}
                      >
                        <FiX />
                      </button>
                    )}
                    <div className="photo-hint">Optionnel</div>
                  </div>

                  {/* CNI Recto */}
                  <div className="photo-upload">
                    <div 
                      className={`photo-preview ${previews.photoCniRecto ? 'has-image' : ''}`}
                      onClick={() => document.getElementById('photoCniRecto').click()}
                    >
                      {previews.photoCniRecto ? (
                        <img src={previews.photoCniRecto} alt="CNI Recto" />
                      ) : (
                        <>
                          <i className="fas fa-id-card"></i>
                          <span>CNI Recto</span>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      id="photoCniRecto"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'photoCniRecto')}
                      style={{ display: 'none' }}
                      required
                    />
                    {files.photoCniRecto && (
                      <button 
                        type="button"
                        className="remove-btn"
                        onClick={() => removeFile('photoCniRecto')}
                      >
                        <FiX />
                      </button>
                    )}
                    <div className="photo-hint">Obligatoire</div>
                  </div>

                  {/* CNI Verso */}
                  <div className="photo-upload">
                    <div 
                      className={`photo-preview ${previews.photoCniVerso ? 'has-image' : ''}`}
                      onClick={() => document.getElementById('photoCniVerso').click()}
                    >
                      {previews.photoCniVerso ? (
                        <img src={previews.photoCniVerso} alt="CNI Verso" />
                      ) : (
                        <>
                          <i className="fas fa-id-card"></i>
                          <span>CNI Verso</span>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      id="photoCniVerso"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'photoCniVerso')}
                      style={{ display: 'none' }}
                      required
                    />
                    {files.photoCniVerso && (
                      <button 
                        type="button"
                        className="remove-btn"
                        onClick={() => removeFile('photoCniVerso')}
                      >
                        <FiX />
                      </button>
                    )}
                    <div className="photo-hint">Obligatoire</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="form-actions">
                <button type="button" className="btn-secondary">
                  <FiX /> Annuler
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      Création...
                    </>
                  ) : (
                    <>
                      <FiSave /> Créer le recycleur
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default CreerRecycleur;