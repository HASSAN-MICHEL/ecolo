// // import React, { useState, useEffect } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import DashboardLayout from '../../Layouts/LayoutDashboard';
// // import recycleurService from '../../services/recycleurService';
// // import { FiUpload, FiFileText, FiCalendar } from 'react-icons/fi';
// // import toast from 'react-hot-toast';

// // const DeclarationRecyclage = () => {
// //   const navigate = useNavigate();
// //   const [formData, setFormData] = useState({
// //     demandeId: '',
// //     typeDechet: '',
// //     quantite: '',
// //     dateRecyclage: new Date().toISOString().split('T')[0],
// //     certificat: null
// //   });

// //   const [demandes, setDemandes] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [submitting, setSubmitting] = useState(false);
// //   const [certificatPreview, setCertificatPreview] = useState(null);
// //   const [user, setUser] = useState(null);

// //   useEffect(() => {
// //     const userData = JSON.parse(localStorage.getItem('ecocollect_user'));
// //     setUser(userData);
// //     loadDemandes();
// //   }, []);

// //   const loadDemandes = async () => {
// //     try {
// //       setLoading(true);
// //       const data = await recycleurService.getMesDemandes('realisee');
// //       setDemandes(data.demandes || []);
// //     } catch (error) {
// //       console.error('Erreur chargement demandes:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({ ...prev, [name]: value }));
// //   };

// //   const handleFileChange = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       setFormData(prev => ({ ...prev, certificat: file }));
      
// //       // Créer une prévisualisation
// //       const reader = new FileReader();
// //       reader.onloadend = () => {
// //         setCertificatPreview(reader.result);
// //       };
// //       reader.readAsDataURL(file);
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
    
// //     if (!formData.typeDechet || !formData.quantite || !formData.dateRecyclage) {
// //       toast.error('Veuillez remplir tous les champs obligatoires');
// //       return;
// //     }

// //     if (parseFloat(formData.quantite) <= 0) {
// //       toast.error('La quantité doit être supérieure à 0');
// //       return;
// //     }

// //     const formDataToSend = new FormData();
// //     formDataToSend.append('typeDechet', formData.typeDechet);
// //     formDataToSend.append('quantite', formData.quantite);
// //     formDataToSend.append('dateRecyclage', formData.dateRecyclage);
    
// //     if (formData.demandeId) {
// //       formDataToSend.append('demandeId', formData.demandeId);
// //     }
    
// //     if (formData.certificat) {
// //       formDataToSend.append('certificat', formData.certificat);
// //     }

// //     try {
// //       setSubmitting(true);
// //       const response = await recycleurService.declarerRecyclage(formDataToSend);
      
// //       if (response.success) {
// //         toast.success('Déclaration de recyclage enregistrée avec succès !');
// //         navigate('/recycleur/declarations');
// //       }
// //     } catch (error) {
// //       toast.error(error.response?.data?.message || 'Erreur lors de la déclaration');
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   const typesDechet = [
// //     { value: 'plastique_pet', label: 'Plastique PET' },
// //     { value: 'plastique_pehd', label: 'Plastique PEHD' },
// //     { value: 'papier_carton', label: 'Papier/Carton' },
// //     { value: 'metal', label: 'Métal' },
// //     { value: 'verre', label: 'Verre' },
// //     { value: 'organique', label: 'Organique' },
// //   ];

// //   const styles = `
// //     .form-container {
// //       max-width: 800px;
// //       margin: 0 auto;
// //     }

// //     .form-card {
// //       background: white;
// //       border-radius: 1rem;
// //       padding: 2rem;
// //       border: 1px solid #d9e0d9;
// //     }

// //     .form-title {
// //       font-size: 1.5rem;
// //       font-weight: 700;
// //       color: #1a1e1a;
// //       margin-bottom: 2rem;
// //     }

// //     .form-grid {
// //       display: grid;
// //       grid-template-columns: repeat(2, 1fr);
// //       gap: 1.5rem;
// //     }

// //     .form-group {
// //       margin-bottom: 1.5rem;
// //     }

// //     .form-group.full-width {
// //       grid-column: span 2;
// //     }

// //     label {
// //       display: block;
// //       margin-bottom: 0.5rem;
// //       font-weight: 600;
// //       color: #1a1e1a;
// //     }

// //     label span {
// //       color: #dc2626;
// //       margin-left: 0.25rem;
// //     }

// //     select, input, textarea {
// //       width: 100%;
// //       padding: 0.75rem 1rem;
// //       border: 1.5px solid #d9e0d9;
// //       border-radius: 0.75rem;
// //       font-size: 0.95rem;
// //       transition: all 0.2s;
// //     }

// //     select:focus, input:focus, textarea:focus {
// //       border-color: #2d8a5e;
// //       outline: none;
// //       box-shadow: 0 0 0 3px rgba(45, 138, 94, 0.1);
// //     }

// //     .file-upload {
// //       border: 2px dashed #d9e0d9;
// //       border-radius: 0.75rem;
// //       padding: 2rem;
// //       text-align: center;
// //       cursor: pointer;
// //       transition: all 0.3s;
// //     }

// //     .file-upload:hover {
// //       border-color: #2d8a5e;
// //       background: #e8f3e8;
// //     }

// //     .file-upload i {
// //       font-size: 2rem;
// //       color: #2d8a5e;
// //       margin-bottom: 0.5rem;
// //     }

// //     .file-upload p {
// //       color: #5a655a;
// //       margin-bottom: 0.5rem;
// //     }

// //     .file-upload small {
// //       color: #5a655a;
// //       font-size: 0.8rem;
// //     }

// //     .certificat-preview {
// //       margin-top: 1rem;
// //       padding: 1rem;
// //       background: #f8faf8;
// //       border-radius: 0.75rem;
// //       display: flex;
// //       align-items: center;
// //       gap: 1rem;
// //     }

// //     .certificat-preview img {
// //       width: 50px;
// //       height: 50px;
// //       object-fit: cover;
// //       border-radius: 0.5rem;
// //     }

// //     .certificat-preview i {
// //       font-size: 2rem;
// //       color: #2d8a5e;
// //     }

// //     .form-actions {
// //       display: flex;
// //       gap: 1rem;
// //       justify-content: flex-end;
// //       margin-top: 2rem;
// //       padding-top: 2rem;
// //       border-top: 1px solid #d9e0d9;
// //     }

// //     .btn-primary {
// //       background: #2d8a5e;
// //       color: white;
// //       border: none;
// //       padding: 0.75rem 2rem;
// //       border-radius: 100px;
// //       font-weight: 600;
// //       cursor: pointer;
// //       display: flex;
// //       align-items: center;
// //       gap: 0.5rem;
// //       transition: all 0.3s;
// //     }

// //     .btn-primary:hover:not(:disabled) {
// //       background: #1e5e3f;
// //       transform: translateY(-2px);
// //     }

// //     .btn-primary:disabled {
// //       opacity: 0.6;
// //       cursor: not-allowed;
// //     }

// //     .btn-secondary {
// //       background: #f8faf8;
// //       color: #1a1e1a;
// //       border: 1.5px solid #d9e0d9;
// //       padding: 0.75rem 2rem;
// //       border-radius: 100px;
// //       font-weight: 600;
// //       cursor: pointer;
// //       display: flex;
// //       align-items: center;
// //       gap: 0.5rem;
// //       transition: all 0.3s;
// //     }

// //     .btn-secondary:hover {
// //       background: #e8f3e8;
// //     }

// //     .info-box {
// //       background: #e8f3e8;
// //       border-radius: 0.75rem;
// //       padding: 1rem;
// //       margin-bottom: 1.5rem;
// //       color: #1a1e1a;
// //       font-size: 0.95rem;
// //     }

// //     .info-box i {
// //       color: #2d8a5e;
// //       margin-right: 0.5rem;
// //     }

// //     @media (max-width: 768px) {
// //       .form-grid {
// //         grid-template-columns: 1fr;
// //       }
      
// //       .form-group.full-width {
// //         grid-column: span 1;
// //       }
// //     }
// //   `;

// //   return (
// //     <>
// //       <style>{styles}</style>
// //       <DashboardLayout title="Déclaration de recyclage" user={user}>
// //         <div className="form-container">
// //           <div className="form-card">
// //             <h2 className="form-title">Déclarer des volumes recyclés</h2>

// //             <div className="info-box">
// //               <i className="fas fa-info-circle"></i>
// //               Déclarez les volumes que vous avez effectivement recyclés. 
// //               Cette information est importante pour le suivi des campagnes et les rapports.
// //             </div>

// //             <form onSubmit={handleSubmit}>
// //               <div className="form-grid">
// //                 {/* Lien avec une demande (optionnel) */}
// //                 <div className="form-group full-width">
// //                   <label>Lié à une demande (optionnel)</label>
// //                   <select
// //                     name="demandeId"
// //                     value={formData.demandeId}
// //                     onChange={handleInputChange}
// //                   >
// //                     <option value="">Sélectionnez une demande</option>
// //                     {demandes.map(demande => (
// //                       <option key={demande.id} value={demande.id}>
// //                         #{demande.id.substring(0, 8)} - {demande.type_dechet} ({demande.quantite_demandee} kg)
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </div>

// //                 {/* Type de déchet */}
// //                 <div className="form-group">
// //                   <label>Type de déchet <span>*</span></label>
// //                   <select
// //                     name="typeDechet"
// //                     value={formData.typeDechet}
// //                     onChange={handleInputChange}
// //                     required
// //                   >
// //                     <option value="">Sélectionnez</option>
// //                     {typesDechet.map(type => (
// //                       <option key={type.value} value={type.value}>
// //                         {type.label}
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </div>

// //                 {/* Quantité recyclée */}
// //                 <div className="form-group">
// //                   <label>Quantité recyclée (kg) <span>*</span></label>
// //                   <input
// //                     type="number"
// //                     name="quantite"
// //                     value={formData.quantite}
// //                     onChange={handleInputChange}
// //                     min="0.1"
// //                     step="0.1"
// //                     placeholder="Ex: 1000"
// //                     required
// //                   />
// //                 </div>

// //                 {/* Date de recyclage */}
// //                 <div className="form-group">
// //                   <label>Date de recyclage <span>*</span></label>
// //                   <input
// //                     type="date"
// //                     name="dateRecyclage"
// //                     value={formData.dateRecyclage}
// //                     onChange={handleInputChange}
// //                     max={new Date().toISOString().split('T')[0]}
// //                     required
// //                   />
// //                 </div>

// //                 {/* Certificat (optionnel) */}
// //                 <div className="form-group full-width">
// //                   <label>Certificat / Justificatif (optionnel)</label>
// //                   <div 
// //                     className="file-upload"
// //                     onClick={() => document.getElementById('certificat').click()}
// //                   >
// //                     <i className="fas fa-cloud-upload-alt"></i>
// //                     <p>Cliquez pour télécharger un fichier</p>
// //                     <small>PDF, JPEG, PNG - Max 5MB</small>
// //                   </div>
// //                   <input
// //                     type="file"
// //                     id="certificat"
// //                     accept=".pdf,image/*"
// //                     onChange={handleFileChange}
// //                     style={{ display: 'none' }}
// //                   />
                  
// //                   {certificatPreview && (
// //                     <div className="certificat-preview">
// //                       {certificatPreview.startsWith('data:image') ? (
// //                         <img src={certificatPreview} alt="Prévisualisation" />
// //                       ) : (
// //                         <i className="fas fa-file-pdf"></i>
// //                       )}
// //                       <div>
// //                         <strong>{formData.certificat?.name}</strong>
// //                         <p style={{ fontSize: '0.8rem', color: '#5a655a' }}>
// //                           {(formData.certificat?.size / 1024 / 1024).toFixed(2)} MB
// //                         </p>
// //                       </div>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>

// //               {/* Actions */}
// //               <div className="form-actions">
// //                 <button 
// //                   type="button" 
// //                   className="btn-secondary"
// //                   onClick={() => navigate('/recycleur/declarations')}
// //                 >
// //                   <i className="fas fa-times"></i> Annuler
// //                 </button>
// //                 <button type="submit" className="btn-primary" disabled={submitting}>
// //                   {submitting ? (
// //                     <>
// //                       <div className="spinner"></div>
// //                       Envoi en cours...
// //                     </>
// //                   ) : (
// //                     <>
// //                       <FiFileText /> Déclarer le recyclage
// //                     </>
// //                   )}
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       </DashboardLayout>
// //     </>
// //   );
// // };

// // export default DeclarationRecyclage;


// // pages/Recycleur/DeclarationRecyclage.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import DashboardLayout from '../../Layouts/LayoutDashboard';
// import recycleurService from '../../services/recycleurService';
// import { FiUpload, FiFileText, FiCalendar, FiPackage } from 'react-icons/fi';
// import toast from 'react-hot-toast';

// const DeclarationRecyclage = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     demandeId: '',
//     typeDechet: '',
//     quantite: '',
//     dateRecyclage: new Date().toISOString().split('T')[0],
//     certificat: null
//   });

//   const [demandes, setDemandes] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [certificatPreview, setCertificatPreview] = useState(null);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const userData = JSON.parse(localStorage.getItem('ecocollect_user'));
//     setUser(userData);
//     loadDemandes();
//   }, []);

//   const loadDemandes = async () => {
//     try {
//       setLoading(true);
//       const data = await recycleurService.getMesDemandes('realisee');
//       setDemandes(data.demandes || []);
//     } catch (error) {
//       console.error('Erreur chargement demandes:', error);
//       toast.error('Erreur lors du chargement des demandes');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Vérifier la taille (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error('Le fichier ne doit pas dépasser 5MB');
//         return;
//       }
      
//       setFormData(prev => ({ ...prev, certificat: file }));
      
//       // Créer une prévisualisation pour les images
//       if (file.type.startsWith('image/')) {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           setCertificatPreview(reader.result);
//         };
//         reader.readAsDataURL(file);
//       } else {
//         setCertificatPreview('pdf');
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.typeDechet || !formData.quantite || !formData.dateRecyclage) {
//       toast.error('Veuillez remplir tous les champs obligatoires');
//       return;
//     }

//     if (parseFloat(formData.quantite) <= 0) {
//       toast.error('La quantité doit être supérieure à 0');
//       return;
//     }

//     const formDataToSend = new FormData();
//     formDataToSend.append('typeDechet', formData.typeDechet);
//     formDataToSend.append('quantite', formData.quantite);
//     formDataToSend.append('dateRecyclage', formData.dateRecyclage);
    
//     if (formData.demandeId) {
//       formDataToSend.append('demandeId', formData.demandeId);
//     }
    
//     if (formData.certificat) {
//       formDataToSend.append('certificat', formData.certificat);
//     }

//     try {
//       setSubmitting(true);
//       const response = await recycleurService.declarerRecyclageWithCertificat(formDataToSend);
      
//       if (response.success) {
//         toast.success('Déclaration de recyclage enregistrée avec succès !');
//         navigate('/recycleur/declarations');
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Erreur lors de la déclaration');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const typesDechet = [
//     { value: 'plastique_pet', label: 'Plastique PET' },
//     { value: 'plastique_pehd', label: 'Plastique PEHD' },
//     { value: 'papier_carton', label: 'Papier/Carton' },
//     { value: 'metal', label: 'Métal' },
//     { value: 'verre', label: 'Verre' },
//     { value: 'organique', label: 'Organique' },
//   ];

//   const styles = `
//     .declaration-container {
//       max-width: 800px;
//       margin: 0 auto;
//       padding: 1.5rem;
//     }

//     .declaration-card {
//       background: white;
//       border-radius: 1rem;
//       padding: 2rem;
//       border: 1px solid #d9e0d9;
//     }

//     .declaration-title {
//       font-size: 1.5rem;
//       font-weight: 700;
//       color: #1a1e1a;
//       margin-bottom: 2rem;
//     }

//     .form-grid {
//       display: grid;
//       grid-template-columns: repeat(2, 1fr);
//       gap: 1.5rem;
//     }

//     .form-group {
//       margin-bottom: 1.5rem;
//     }

//     .form-group.full-width {
//       grid-column: span 2;
//     }

//     .form-group label {
//       display: block;
//       margin-bottom: 0.5rem;
//       font-weight: 600;
//       color: #1a1e1a;
//     }

//     .form-group label span {
//       color: #dc2626;
//       margin-left: 0.25rem;
//     }

//     .form-group select,
//     .form-group input,
//     .form-group textarea {
//       width: 100%;
//       padding: 0.75rem 1rem;
//       border: 1.5px solid #d9e0d9;
//       border-radius: 0.75rem;
//       font-size: 0.95rem;
//       transition: all 0.2s;
//     }

//     .form-group select:focus,
//     .form-group input:focus,
//     .form-group textarea:focus {
//       border-color: #2d8a5e;
//       outline: none;
//       box-shadow: 0 0 0 3px rgba(45, 138, 94, 0.1);
//     }

//     .file-upload {
//       border: 2px dashed #d9e0d9;
//       border-radius: 0.75rem;
//       padding: 2rem;
//       text-align: center;
//       cursor: pointer;
//       transition: all 0.3s;
//     }

//     .file-upload:hover {
//       border-color: #2d8a5e;
//       background: #e8f3e8;
//     }

//     .file-upload i {
//       font-size: 2rem;
//       color: #2d8a5e;
//       margin-bottom: 0.5rem;
//     }

//     .file-upload p {
//       color: #5a655a;
//       margin-bottom: 0.5rem;
//     }

//     .file-upload small {
//       color: #5a655a;
//       font-size: 0.8rem;
//     }

//     .certificat-preview {
//       margin-top: 1rem;
//       padding: 1rem;
//       background: #f8faf8;
//       border-radius: 0.75rem;
//       display: flex;
//       align-items: center;
//       gap: 1rem;
//     }

//     .certificat-preview img {
//       width: 50px;
//       height: 50px;
//       object-fit: cover;
//       border-radius: 0.5rem;
//     }

//     .certificat-preview i {
//       font-size: 2rem;
//       color: #2d8a5e;
//     }

//     .form-actions {
//       display: flex;
//       gap: 1rem;
//       justify-content: flex-end;
//       margin-top: 2rem;
//       padding-top: 2rem;
//       border-top: 1px solid #d9e0d9;
//     }

//     .btn-primary {
//       background: #2d8a5e;
//       color: white;
//       border: none;
//       padding: 0.75rem 2rem;
//       border-radius: 100px;
//       font-weight: 600;
//       cursor: pointer;
//       display: flex;
//       align-items: center;
//       gap: 0.5rem;
//       transition: all 0.3s;
//     }

//     .btn-primary:hover:not(:disabled) {
//       background: #1e5e3f;
//       transform: translateY(-2px);
//     }

//     .btn-primary:disabled {
//       opacity: 0.6;
//       cursor: not-allowed;
//     }

//     .btn-secondary {
//       background: #f8faf8;
//       color: #1a1e1a;
//       border: 1.5px solid #d9e0d9;
//       padding: 0.75rem 2rem;
//       border-radius: 100px;
//       font-weight: 600;
//       cursor: pointer;
//       display: flex;
//       align-items: center;
//       gap: 0.5rem;
//       transition: all 0.3s;
//     }

//     .btn-secondary:hover {
//       background: #e8f3e8;
//     }

//     .info-box {
//       background: #e8f3e8;
//       border-radius: 0.75rem;
//       padding: 1rem;
//       margin-bottom: 1.5rem;
//       color: #1a1e1a;
//       font-size: 0.95rem;
//       display: flex;
//       align-items: center;
//       gap: 0.5rem;
//     }

//     .info-box i {
//       color: #2d8a5e;
//       font-size: 1.2rem;
//     }

//     .spinner {
//       border: 2px solid #f3f3f3;
//       border-top: 2px solid #2d8a5e;
//       border-radius: 50%;
//       width: 20px;
//       height: 20px;
//       animation: spin 1s linear infinite;
//     }

//     @keyframes spin {
//       0% { transform: rotate(0deg); }
//       100% { transform: rotate(360deg); }
//     }

//     @media (max-width: 768px) {
//       .form-grid {
//         grid-template-columns: 1fr;
//       }
      
//       .form-group.full-width {
//         grid-column: span 1;
//       }
      
//       .form-actions {
//         flex-direction: column;
//       }
      
//       .btn-primary, .btn-secondary {
//         width: 100%;
//         justify-content: center;
//       }
//     }
//   `;

//   return (
//     <>
//       <style>{styles}</style>
//       <DashboardLayout title="Déclaration de recyclage" user={user}>
//         <div className="declaration-container">
//           <div className="declaration-card">
//             <h2 className="declaration-title">Déclarer des volumes recyclés</h2>

//             <div className="info-box">
//               <i className="fas fa-info-circle"></i>
//               <span>
//                 Déclarez les volumes que vous avez effectivement recyclés. 
//                 Cette information est importante pour le suivi des campagnes et les rapports.
//               </span>
//             </div>

//             <form onSubmit={handleSubmit}>
//               <div className="form-grid">
//                 {/* Lien avec une demande (optionnel) */}
//                 <div className="form-group full-width">
//                   <label>Lié à une demande (optionnel)</label>
//                   <select
//                     name="demandeId"
//                     value={formData.demandeId}
//                     onChange={handleInputChange}
//                     disabled={loading}
//                   >
//                     <option value="">Sélectionnez une demande</option>
//                     {demandes.map(demande => (
//                       <option key={demande.id} value={demande.id}>
//                         #{demande.id?.substring(0, 8)} - {recycleurService.getTypeLabel(demande.type_dechet)} ({demande.quantite_demandee} kg)
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Type de déchet */}
//                 <div className="form-group">
//                   <label>Type de déchet <span>*</span></label>
//                   <select
//                     name="typeDechet"
//                     value={formData.typeDechet}
//                     onChange={handleInputChange}
//                     required
//                   >
//                     <option value="">Sélectionnez</option>
//                     {typesDechet.map(type => (
//                       <option key={type.value} value={type.value}>
//                         {type.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Quantité recyclée */}
//                 <div className="form-group">
//                   <label>Quantité recyclée (kg) <span>*</span></label>
//                   <input
//                     type="number"
//                     name="quantite"
//                     value={formData.quantite}
//                     onChange={handleInputChange}
//                     min="0.1"
//                     step="0.1"
//                     placeholder="Ex: 1000"
//                     required
//                   />
//                 </div>

//                 {/* Date de recyclage */}
//                 <div className="form-group">
//                   <label>Date de recyclage <span>*</span></label>
//                   <input
//                     type="date"
//                     name="dateRecyclage"
//                     value={formData.dateRecyclage}
//                     onChange={handleInputChange}
//                     max={new Date().toISOString().split('T')[0]}
//                     required
//                   />
//                 </div>

//                 {/* Certificat (optionnel) */}
//                 <div className="form-group full-width">
//                   <label>Certificat / Justificatif (optionnel)</label>
//                   <div 
//                     className="file-upload"
//                     onClick={() => document.getElementById('certificat').click()}
//                   >
//                     <i className="fas fa-cloud-upload-alt"></i>
//                     <p>Cliquez pour télécharger un fichier</p>
//                     <small>PDF, JPEG, PNG - Max 5MB</small>
//                   </div>
//                   <input
//                     type="file"
//                     id="certificat"
//                     name="certificat"
//                     accept=".pdf,image/*"
//                     onChange={handleFileChange}
//                     style={{ display: 'none' }}
//                   />
                  
//                   {certificatPreview && (
//                     <div className="certificat-preview">
//                       {certificatPreview === 'pdf' ? (
//                         <i className="fas fa-file-pdf"></i>
//                       ) : certificatPreview.startsWith('data:image') ? (
//                         <img src={certificatPreview} alt="Prévisualisation" />
//                       ) : (
//                         <i className="fas fa-file"></i>
//                       )}
//                       <div>
//                         <strong>{formData.certificat?.name}</strong>
//                         <p style={{ fontSize: '0.8rem', color: '#5a655a' }}>
//                           {(formData.certificat?.size / 1024).toFixed(0)} KB
//                         </p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="form-actions">
//                 <button 
//                   type="button" 
//                   className="btn-secondary"
//                   onClick={() => navigate('/recycleur/declarations')}
//                 >
//                   <i className="fas fa-times"></i> Annuler
//                 </button>
//                 <button type="submit" className="btn-primary" disabled={submitting}>
//                   {submitting ? (
//                     <>
//                       <div className="spinner"></div>
//                       Envoi en cours...
//                     </>
//                   ) : (
//                     <>
//                       <FiFileText /> Déclarer le recyclage
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </DashboardLayout>
//     </>
//   );
// };

// export default DeclarationRecyclage;


// pages/Recycleur/DeclarationRecyclage.jsx - Version corrigée

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../Layouts/LayoutDashboard';
import recycleurService from '../../services/recycleurService';
import { FiUpload, FiFileText, FiCalendar, FiPackage, FiInfo, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const DeclarationRecyclage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    demandeId: '',
    typeDechet: '',
    quantite: '',
    dateRecyclage: new Date().toISOString().split('T')[0],
    certificat: null
  });

  const [demandes, setDemandes] = useState([]);
  const [monStock, setMonStock] = useState([]);
  const [stockDisponible, setStockDisponible] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [certificatPreview, setCertificatPreview] = useState(null);
  const [user, setUser] = useState(null);
  const [stockError, setStockError] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('ecocollect_user'));
    setUser(userData);
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Charger les demandes réalisées
      const demandesData = await recycleurService.getMesDemandes('realisee');
      setDemandes(demandesData.demandes || []);
      
      // Charger le stock personnel
      await loadMonStock();
      
    } catch (error) {
      console.error('Erreur chargement données:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };
const loadMonStock = async () => {
  try {
    // ✅ Utiliser le service au lieu de fetch direct
    const data = await recycleurService.getMonStock();
    console.log('📦 Stock personnel chargé:', data);
    
    if (data.success) {
      setMonStock(data.stocks || []);
    }
  } catch (error) {
    console.error('❌ Erreur chargement stock:', error);
    toast.error('Erreur lors du chargement de votre stock');
  }
};

// Dans handleInputChange, ajoutez des logs pour déboguer
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
  
  // Vérifier le stock disponible quand le type change
  if (name === 'typeDechet') {
    console.log('🔍 Type sélectionné:', value);
    console.log('📦 MonStock actuel:', monStock);
    
    const stock = monStock.find(s => s.type_dechet === value);
    console.log('🎯 Stock trouvé:', stock);
    
    const dispo = stock ? parseFloat(stock.quantite_disponible) : 0;
    setStockDisponible(dispo);
    
    if (formData.quantite && parseFloat(formData.quantite) > dispo) {
      setStockError(`Stock insuffisant. Vous avez ${dispo.toFixed(2)} kg disponibles.`);
    } else {
      setStockError('');
    }
  }
  
  if (name === 'quantite' && formData.typeDechet) {
    const stock = monStock.find(s => s.type_dechet === formData.typeDechet);
    const dispo = stock ? parseFloat(stock.quantite_disponible) : 0;
    
    if (parseFloat(value) > dispo) {
      setStockError(`Stock insuffisant. Vous avez ${dispo.toFixed(2)} kg disponibles.`);
    } else {
      setStockError('');
    }
  }
};

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Le fichier ne doit pas dépasser 5MB');
        return;
      }
      
      // Vérifier le type de fichier
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Format non supporté. Utilisez PDF, JPEG ou PNG');
        return;
      }
      
      setFormData(prev => ({ ...prev, certificat: file }));
      
      // Créer une prévisualisation pour les images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCertificatPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setCertificatPreview('pdf');
      }
    }
  };



  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validations
  if (!formData.typeDechet) {
    toast.error('Veuillez sélectionner un type de déchet');
    return;
  }

  if (!formData.quantite || parseFloat(formData.quantite) <= 0) {
    toast.error('Veuillez entrer une quantité valide');
    return;
  }

  if (!formData.dateRecyclage) {
    toast.error('Veuillez sélectionner une date');
    return;
  }

  // Vérifier le stock
  const quantiteValue = parseFloat(formData.quantite);
  if (quantiteValue > stockDisponible) {
    toast.error(`Stock insuffisant. Vous avez ${stockDisponible.toFixed(2)} kg disponibles.`);
    return;
  }

  const formDataToSend = new FormData();
  
  // S'assurer que les noms correspondent à ce que le backend attend
  formDataToSend.append('typeDechet', formData.typeDechet);
  formDataToSend.append('quantite', quantiteValue.toString());
  formDataToSend.append('dateRecyclage', formData.dateRecyclage);
  
  if (formData.demandeId) {
    formDataToSend.append('demandeId', formData.demandeId);
  }
  
  if (formData.certificat) {
    formDataToSend.append('certificat', formData.certificat);
  }

  try {
    setSubmitting(true);
    console.log('📤 Envoi de la déclaration...');
    
    const response = await recycleurService.declarerRecyclageWithCertificat(formDataToSend);
    
    if (response.success) {
      toast.success('✅ Déclaration de recyclage enregistrée avec succès !');
      
      if (response.stock_restant) {
        toast.success(`Stock restant: ${response.stock_restant} kg`);
      }
      
      navigate('/recycleur/declarations');
    }
  } catch (error) {
    console.error('❌ Erreur détaillée:', error);
    console.error('❌ Réponse erreur:', error.response?.data);
    
    // Afficher le message d'erreur spécifique du backend
    const errorMessage = error.response?.data?.message || 'Erreur lors de la déclaration';
    toast.error(errorMessage);
  } finally {
    setSubmitting(false);
  }
};

  const typesDechet = [
    { value: 'plastique_pet', label: 'Plastique PET' },
    { value: 'plastique_pehd', label: 'Plastique PEHD' },
    { value: 'papier_carton', label: 'Papier/Carton' },
    { value: 'metal', label: 'Métal' },
    { value: 'verre', label: 'Verre' },
    { value: 'organique', label: 'Organique' },
  ];

  const getTypeLabel = (type) => {
    const labels = {
      'plastique_pet': 'Plastique PET',
      'plastique_pehd': 'Plastique PEHD',
      'papier_carton': 'Papier/Carton',
      'metal': 'Métal',
      'verre': 'Verre',
      'organique': 'Organique'
    };
    return labels[type] || type;
  };

  const styles = `
    .declaration-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 1.5rem;
    }

    .declaration-card {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      border: 1px solid #d9e0d9;
    }

    .declaration-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a1e1a;
      margin-bottom: 2rem;
    }

    .stock-info-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1.5rem;
      border-radius: 1rem;
      margin-bottom: 2rem;
    }

    .stock-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .stock-item {
      background: rgba(255, 255, 255, 0.1);
      padding: 1rem;
      border-radius: 0.5rem;
      text-align: center;
    }

    .stock-item .type {
      font-size: 0.9rem;
      opacity: 0.9;
      margin-bottom: 0.5rem;
    }

    .stock-item .quantity {
      font-size: 1.3rem;
      font-weight: bold;
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

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #1a1e1a;
    }

    .form-group label span {
      color: #dc2626;
      margin-left: 0.25rem;
    }

    .form-group select,
    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1.5px solid #d9e0d9;
      border-radius: 0.75rem;
      font-size: 0.95rem;
      transition: all 0.2s;
    }

    .form-group select:focus,
    .form-group input:focus,
    .form-group textarea:focus {
      border-color: #2d8a5e;
      outline: none;
      box-shadow: 0 0 0 3px rgba(45, 138, 94, 0.1);
    }

    .form-group select:disabled,
    .form-group input:disabled {
      background: #f8faf8;
      cursor: not-allowed;
    }

    .stock-disponible {
      margin-top: 0.5rem;
      padding: 0.5rem;
      background: #e8f3e8;
      border-radius: 0.5rem;
      font-size: 0.9rem;
      color: #2d8a5e;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .stock-error {
      margin-top: 0.5rem;
      padding: 0.5rem;
      background: #fee2e2;
      border-radius: 0.5rem;
      font-size: 0.9rem;
      color: #dc2626;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .file-upload {
      border: 2px dashed #d9e0d9;
      border-radius: 0.75rem;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
    }

    .file-upload:hover {
      border-color: #2d8a5e;
      background: #e8f3e8;
    }

    .file-upload i {
      font-size: 2rem;
      color: #2d8a5e;
      margin-bottom: 0.5rem;
    }

    .file-upload p {
      color: #5a655a;
      margin-bottom: 0.5rem;
    }

    .file-upload small {
      color: #5a655a;
      font-size: 0.8rem;
    }

    .certificat-preview {
      margin-top: 1rem;
      padding: 1rem;
      background: #f8faf8;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .certificat-preview img {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 0.5rem;
    }

    .certificat-preview i {
      font-size: 2rem;
      color: #2d8a5e;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #d9e0d9;
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

    .info-box {
      background: #e8f3e8;
      border-radius: 0.75rem;
      padding: 1rem;
      margin-bottom: 1.5rem;
      color: #1a1e1a;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .info-box i {
      color: #2d8a5e;
      font-size: 1.2rem;
    }

    .spinner {
      border: 2px solid #f3f3f3;
      border-top: 2px solid #2d8a5e;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
      
      .form-group.full-width {
        grid-column: span 1;
      }
      
      .form-actions {
        flex-direction: column;
      }
      
      .btn-primary, .btn-secondary {
        width: 100%;
        justify-content: center;
      }
    }
  `;

  if (loading) {
    return (
      <DashboardLayout title="Déclaration de recyclage" user={user}>
        <div className="text-center p-8">
          <div className="spinner" style={{ margin: '0 auto' }}></div>
          <p className="mt-4 text-gray-600">Chargement de vos données...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <DashboardLayout title="Déclaration de recyclage" user={user}>
        <div className="declaration-container">
          <div className="declaration-card">
            <h2 className="declaration-title">Déclarer des volumes recyclés</h2>

            <div className="info-box">
              <FiInfo size={20} />
              <span>
                Déclarez les volumes que vous avez effectivement recyclés. 
                Cette information sera déduite de votre stock disponible.
              </span>
            </div>

            {/* Affichage du stock disponible */}
            {monStock.length > 0 && (
              <div className="stock-info-card">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiPackage /> Votre stock disponible
                </h3>
                <div className="stock-grid">
                  {monStock.map((stock) => (
                    <div key={stock.id} className="stock-item">
                      <div className="type">{getTypeLabel(stock.type_dechet)}</div>
                      <div className="quantity">{parseFloat(stock.quantite_disponible).toFixed(1)} kg</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                {/* Lien avec une demande (optionnel) */}
                <div className="form-group full-width">
                  <label>Lié à une demande (optionnel)</label>
                  <select
                    name="demandeId"
                    value={formData.demandeId}
                    onChange={handleInputChange}
                    disabled={loading}
                  >
                    <option value="">Sélectionnez une demande</option>
                    {demandes.map(demande => (
                      <option key={demande.id} value={demande.id}>
                        #{demande.id?.substring(0, 8)} - {recycleurService.getTypeLabel(demande.type_dechet)} ({parseFloat(demande.quantite_demandee).toFixed(1)} kg)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type de déchet */}
                <div className="form-group">
                  <label>Type de déchet <span>*</span></label>
                  <select
                    name="typeDechet"
                    value={formData.typeDechet}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Sélectionnez</option>
                    {typesDechet.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  
                  {formData.typeDechet && (
                    <div className="stock-disponible">
                      <FiPackage size={16} />
                      Stock disponible: <strong>{stockDisponible.toFixed(2)} kg</strong>
                    </div>
                  )}
                </div>

                {/* Quantité recyclée */}
                <div className="form-group">
                  <label>Quantité recyclée (kg) <span>*</span></label>
                  <input
                    type="number"
                    name="quantite"
                    value={formData.quantite}
                    onChange={handleInputChange}
                    min="0.1"
                    max={stockDisponible || undefined}
                    step="0.1"
                    placeholder="Ex: 1000"
                    required
                  />
                  {stockError && (
                    <div className="stock-error">
                      <FiAlertCircle size={16} />
                      {stockError}
                    </div>
                  )}
                </div>

                {/* Date de recyclage */}
                <div className="form-group">
                  <label>Date de recyclage <span>*</span></label>
                  <input
                    type="date"
                    name="dateRecyclage"
                    value={formData.dateRecyclage}
                    onChange={handleInputChange}
                    max={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                {/* Certificat (optionnel) */}
                <div className="form-group full-width">
                  <label>Certificat / Justificatif (optionnel)</label>
                  <div 
                    className="file-upload"
                    onClick={() => document.getElementById('certificat').click()}
                  >
                    <i className="fas fa-cloud-upload-alt"></i>
                    <p>Cliquez pour télécharger un fichier</p>
                    <small>PDF, JPEG, PNG - Max 5MB</small>
                  </div>
                  <input
                    type="file"
                    id="certificat"
                    name="certificat"
                    accept=".pdf,image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  
                  {certificatPreview && (
                    <div className="certificat-preview">
                      {certificatPreview === 'pdf' ? (
                        <i className="fas fa-file-pdf"></i>
                      ) : certificatPreview.startsWith('data:image') ? (
                        <img src={certificatPreview} alt="Prévisualisation" />
                      ) : (
                        <i className="fas fa-file"></i>
                      )}
                      <div>
                        <strong>{formData.certificat?.name}</strong>
                        <p style={{ fontSize: '0.8rem', color: '#5a655a' }}>
                          {(formData.certificat?.size / 1024).toFixed(0)} KB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Récapitulatif */}
              {formData.typeDechet && formData.quantite && !stockError && (
                <div className="info-box" style={{ marginTop: '1rem' }}>
                  <FiInfo size={20} />
                  <span>
                    Après cette déclaration, il vous restera <strong>{(stockDisponible - parseFloat(formData.quantite)).toFixed(2)} kg</strong> de {getTypeLabel(formData.typeDechet)}.
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => navigate('/recycleur/declarations')}
                >
                  <i className="fas fa-times"></i> Annuler
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={submitting || !!stockError}
                >
                  {submitting ? (
                    <>
                      <div className="spinner"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <FiFileText /> Déclarer le recyclage
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

export default DeclarationRecyclage;