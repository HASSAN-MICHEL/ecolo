// // // import React, { useState, useEffect } from 'react';
// // // import { useNavigate, useLocation } from 'react-router-dom';
// // // import DashboardLayout from '../../Layouts/LayoutDashboard';
// // // import recycleurService from '../../services/recycleurService';
// // // import { FiSend, FiCalendar, FiMapPin, FiPackage } from 'react-icons/fi';
// // // import toast from 'react-hot-toast';

// // // const DemandeEnlevement = () => {
// // //   const navigate = useNavigate();
// // //   const location = useLocation();
// // //   const queryParams = new URLSearchParams(location.search);
  
// // //   const [formData, setFormData] = useState({
// // //     pointDepotId: queryParams.get('point') || '',
// // //     typeDechet: queryParams.get('type') || '',
// // //     quantite: '',
// // //     dateSouhaitee: '',
// // //     notes: ''
// // //   });

// // //   const [pointsDepot, setPointsDepot] = useState([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const [submitting, setSubmitting] = useState(false);
// // //   const [user, setUser] = useState(null);

// // //   useEffect(() => {
// // //     const userData = JSON.parse(localStorage.getItem('ecocollect_user'));
// // //     setUser(userData);
// // //     loadPointsDepot();
// // //   }, []);

// // //   const loadPointsDepot = async () => {
// // //     try {
// // //       setLoading(true);
// // //       // Simuler le chargement des points de dépôt
// // //       // À remplacer par un vrai appel API
// // //       const mockPoints = [
// // //         { id: '1', nom: 'Point Collecte Nord', commune: 'Dakar', quartier: 'Nord', stocks: { 'plastique_pet': 500, 'papier_carton': 300 } },
// // //         { id: '2', nom: 'Point Collecte Sud', commune: 'Pikine', quartier: 'Sud', stocks: { 'metal': 200, 'verre': 150 } },
// // //         { id: '3', nom: 'Point Collecte Est', commune: 'Guédiawaye', quartier: 'Est', stocks: { 'plastique_pehd': 400, 'organique': 600 } },
// // //       ];
// // //       setPointsDepot(mockPoints);
// // //     } catch (error) {
// // //       console.error('Erreur chargement points:', error);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleInputChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setFormData(prev => ({ ...prev, [name]: value }));
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
    
// // //     if (!formData.pointDepotId || !formData.typeDechet || !formData.quantite || !formData.dateSouhaitee) {
// // //       toast.error('Veuillez remplir tous les champs obligatoires');
// // //       return;
// // //     }

// // //     if (parseFloat(formData.quantite) <= 0) {
// // //       toast.error('La quantité doit être supérieure à 0');
// // //       return;
// // //     }

// // //     try {
// // //       setSubmitting(true);
// // //       const response = await recycleurService.creerDemande(formData);
      
// // //       if (response.success) {
// // //         toast.success('Demande d\'enlèvement créée avec succès !');
// // //         navigate('/recycleur/demandes');
// // //       }
// // //     } catch (error) {
// // //       toast.error(error.response?.data?.message || 'Erreur lors de la création');
// // //     } finally {
// // //       setSubmitting(false);
// // //     }
// // //   };

// // //   const typesDechet = [
// // //     { value: 'plastique_pet', label: 'Plastique PET' },
// // //     { value: 'plastique_pehd', label: 'Plastique PEHD' },
// // //     { value: 'papier_carton', label: 'Papier/Carton' },
// // //     { value: 'metal', label: 'Métal' },
// // //     { value: 'verre', label: 'Verre' },
// // //     { value: 'organique', label: 'Organique' },
// // //   ];

// // //   const selectedPoint = pointsDepot.find(p => p.id === formData.pointDepotId);

// // //   const styles = `
// // //     .form-container {
// // //       max-width: 800px;
// // //       margin: 0 auto;
// // //     }

// // //     .form-card {
// // //       background: white;
// // //       border-radius: 1rem;
// // //       padding: 2rem;
// // //       border: 1px solid #d9e0d9;
// // //     }

// // //     .form-title {
// // //       font-size: 1.5rem;
// // //       font-weight: 700;
// // //       color: #1a1e1a;
// // //       margin-bottom: 2rem;
// // //     }

// // //     .form-grid {
// // //       display: grid;
// // //       grid-template-columns: repeat(2, 1fr);
// // //       gap: 1.5rem;
// // //     }

// // //     .form-group {
// // //       margin-bottom: 1.5rem;
// // //     }

// // //     .form-group.full-width {
// // //       grid-column: span 2;
// // //     }

// // //     label {
// // //       display: block;
// // //       margin-bottom: 0.5rem;
// // //       font-weight: 600;
// // //       color: #1a1e1a;
// // //     }

// // //     label span {
// // //       color: #dc2626;
// // //       margin-left: 0.25rem;
// // //     }

// // //     select, input, textarea {
// // //       width: 100%;
// // //       padding: 0.75rem 1rem;
// // //       border: 1.5px solid #d9e0d9;
// // //       border-radius: 0.75rem;
// // //       font-size: 0.95rem;
// // //       transition: all 0.2s;
// // //     }

// // //     select:focus, input:focus, textarea:focus {
// // //       border-color: #2d8a5e;
// // //       outline: none;
// // //       box-shadow: 0 0 0 3px rgba(45, 138, 94, 0.1);
// // //     }

// // //     .stock-info {
// // //       background: #e8f3e8;
// // //       border-radius: 0.75rem;
// // //       padding: 1rem;
// // //       margin-top: 0.5rem;
// // //       font-size: 0.9rem;
// // //       color: #1a1e1a;
// // //     }

// // //     .stock-info i {
// // //       color: #2d8a5e;
// // //       margin-right: 0.5rem;
// // //     }

// // //     .point-info {
// // //       background: #f8faf8;
// // //       border-radius: 0.75rem;
// // //       padding: 1rem;
// // //       margin-top: 0.5rem;
// // //       display: flex;
// // //       align-items: center;
// // //       gap: 0.5rem;
// // //       color: #5a655a;
// // //     }

// // //     .form-actions {
// // //       display: flex;
// // //       gap: 1rem;
// // //       justify-content: flex-end;
// // //       margin-top: 2rem;
// // //       padding-top: 2rem;
// // //       border-top: 1px solid #d9e0d9;
// // //     }

// // //     .btn-primary {
// // //       background: #2d8a5e;
// // //       color: white;
// // //       border: none;
// // //       padding: 0.75rem 2rem;
// // //       border-radius: 100px;
// // //       font-weight: 600;
// // //       cursor: pointer;
// // //       display: flex;
// // //       align-items: center;
// // //       gap: 0.5rem;
// // //       transition: all 0.3s;
// // //     }

// // //     .btn-primary:hover:not(:disabled) {
// // //       background: #1e5e3f;
// // //       transform: translateY(-2px);
// // //     }

// // //     .btn-primary:disabled {
// // //       opacity: 0.6;
// // //       cursor: not-allowed;
// // //     }

// // //     .btn-secondary {
// // //       background: #f8faf8;
// // //       color: #1a1e1a;
// // //       border: 1.5px solid #d9e0d9;
// // //       padding: 0.75rem 2rem;
// // //       border-radius: 100px;
// // //       font-weight: 600;
// // //       cursor: pointer;
// // //       display: flex;
// // //       align-items: center;
// // //       gap: 0.5rem;
// // //       transition: all 0.3s;
// // //     }

// // //     .btn-secondary:hover {
// // //       background: #e8f3e8;
// // //     }

// // //     @media (max-width: 768px) {
// // //       .form-grid {
// // //         grid-template-columns: 1fr;
// // //       }
      
// // //       .form-group.full-width {
// // //         grid-column: span 1;
// // //       }
// // //     }
// // //   `;

// // //   return (
// // //     <>
// // //       <style>{styles}</style>
// // //       <DashboardLayout title="Nouvelle demande d'enlèvement" user={user}>
// // //         <div className="form-container">
// // //           <div className="form-card">
// // //             <h2 className="form-title">Créer une demande d'enlèvement</h2>

// // //             <form onSubmit={handleSubmit}>
// // //               <div className="form-grid">
// // //                 {/* Point de dépôt */}
// // //                 <div className="form-group full-width">
// // //                   <label>Point de dépôt <span>*</span></label>
// // //                   <select
// // //                     name="pointDepotId"
// // //                     value={formData.pointDepotId}
// // //                     onChange={handleInputChange}
// // //                     required
// // //                   >
// // //                     <option value="">Sélectionnez un point</option>
// // //                     {pointsDepot.map(point => (
// // //                       <option key={point.id} value={point.id}>
// // //                         {point.nom} - {point.commune}
// // //                       </option>
// // //                     ))}
// // //                   </select>
                  
// // //                   {selectedPoint && (
// // //                     <div className="point-info">
// // //                       <FiMapPin />
// // //                       <span>{selectedPoint.quartier}, {selectedPoint.commune}</span>
// // //                     </div>
// // //                   )}
// // //                 </div>

// // //                 {/* Type de déchet */}
// // //                 <div className="form-group">
// // //                   <label>Type de déchet <span>*</span></label>
// // //                   <select
// // //                     name="typeDechet"
// // //                     value={formData.typeDechet}
// // //                     onChange={handleInputChange}
// // //                     required
// // //                   >
// // //                     <option value="">Sélectionnez</option>
// // //                     {typesDechet.map(type => (
// // //                       <option key={type.value} value={type.value}>
// // //                         {type.label}
// // //                       </option>
// // //                     ))}
// // //                   </select>

// // //                   {selectedPoint && formData.typeDechet && (
// // //                     <div className="stock-info">
// // //                       <i className="fas fa-boxes"></i>
// // //                       Stock disponible: {selectedPoint.stocks[formData.typeDechet] || 0} kg
// // //                     </div>
// // //                   )}
// // //                 </div>

// // //                 {/* Quantité */}
// // //                 <div className="form-group">
// // //                   <label>Quantité (kg) <span>*</span></label>
// // //                   <input
// // //                     type="number"
// // //                     name="quantite"
// // //                     value={formData.quantite}
// // //                     onChange={handleInputChange}
// // //                     min="1"
// // //                     step="0.1"
// // //                     placeholder="Ex: 500"
// // //                     required
// // //                   />
// // //                 </div>

// // //                 {/* Date souhaitée */}
// // //                 <div className="form-group">
// // //                   <label>Date souhaitée <span>*</span></label>
// // //                   <input
// // //                     type="date"
// // //                     name="dateSouhaitee"
// // //                     value={formData.dateSouhaitee}
// // //                     onChange={handleInputChange}
// // //                     min={new Date().toISOString().split('T')[0]}
// // //                     required
// // //                   />
// // //                 </div>

// // //                 {/* Notes */}
// // //                 <div className="form-group full-width">
// // //                   <label>Notes (optionnel)</label>
// // //                   <textarea
// // //                     name="notes"
// // //                     value={formData.notes}
// // //                     onChange={handleInputChange}
// // //                     rows="3"
// // //                     placeholder="Informations complémentaires..."
// // //                   />
// // //                 </div>
// // //               </div>

// // //               {/* Actions */}
// // //               <div className="form-actions">
// // //                 <button 
// // //                   type="button" 
// // //                   className="btn-secondary"
// // //                   onClick={() => navigate('/recycleur/demandes')}
// // //                 >
// // //                   <i className="fas fa-times"></i> Annuler
// // //                 </button>
// // //                 <button type="submit" className="btn-primary" disabled={submitting}>
// // //                   {submitting ? (
// // //                     <>
// // //                       <div className="spinner"></div>
// // //                       Envoi en cours...
// // //                     </>
// // //                   ) : (
// // //                     <>
// // //                       <FiSend /> Envoyer la demande
// // //                     </>
// // //                   )}
// // //                 </button>
// // //               </div>
// // //             </form>
// // //           </div>
// // //         </div>
// // //       </DashboardLayout>
// // //     </>
// // //   );
// // // };

// // // export default DemandeEnlevement;


// // // pages/Recycleur/DemandeEnlevement.jsx - Version fonctionnelle

// // import React, { useState, useEffect } from 'react';
// // import { useNavigate, useLocation } from 'react-router-dom';
// // import DashboardLayout from '../../Layouts/LayoutDashboard';
// // import recycleurService from '../../services/recycleurService';
// // import { FiSend, FiCalendar, FiMapPin, FiPackage } from 'react-icons/fi';
// // import toast from 'react-hot-toast';

// // const DemandeEnlevement = () => {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const queryParams = new URLSearchParams(location.search);
  
// //   const [formData, setFormData] = useState({
// //     pointDepotId: queryParams.get('point') || '',
// //     typeDechet: queryParams.get('type') || '',
// //     quantite: '',
// //     dateSouhaitee: new Date().toISOString().split('T')[0],
// //     notes: ''
// //   });

// //   const [pointsDepot, setPointsDepot] = useState([]);
// //   const [stocksData, setStocksData] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [submitting, setSubmitting] = useState(false);
// //   const [user, setUser] = useState(null);

// //   useEffect(() => {
// //     const userData = JSON.parse(localStorage.getItem('ecocollect_user'));
// //     setUser(userData);
// //     loadPointsDepot();
// //   }, []);

// //   const loadPointsDepot = async () => {
// //     try {
// //       setLoading(true);
// //       console.log('🔄 Chargement des points de dépôt...');
      
// //       // Récupérer les stocks (qui contiennent les infos des points)
// //       const response = await recycleurService.getStocks();
// //       console.log('📦 Données reçues:', response);
      
// //       // Extraire les stocks (peut être dans response.stocks ou directement response)
// //       const stocks = response.stocks || response || [];
// //       setStocksData(stocks);
      
// //       // Créer une map des points uniques à partir des stocks
// //       const pointsMap = new Map();
      
// //       stocks.forEach(stock => {
// //         if (stock.point_depot_id && !pointsMap.has(stock.point_depot_id)) {
// //           pointsMap.set(stock.point_depot_id, {
// //             id: stock.point_depot_id,
// //             nom: stock.point_nom || stock.nom_point || 'Point sans nom',
// //             commune: stock.commune || 'Non spécifiée',
// //             quartier: stock.quartier || 'Non spécifié',
// //             adresse: stock.adresse || '',
// //             stocks: {}
// //           });
// //         }
// //       });
      
// //       // Si la map est vide, c'est que les stocks n'ont pas les infos des points
// //       if (pointsMap.size === 0) {
// //         console.log('⚠️ Aucun point trouvé dans les stocks, utilisation des données mockées');
// //         // Utiliser les données mockées en attendant
// //         const mockPoints = [
// //           { id: '6e4d0955-433d-4121-84ff-47bfb9e2a735', nom: 'Point de collecte Nord', commune: 'Dakar', quartier: 'Nord' },
// //         ];
// //         setPointsDepot(mockPoints);
// //       } else {
// //         // Ajouter les stocks à chaque point
// //         stocks.forEach(stock => {
// //           const point = pointsMap.get(stock.point_depot_id);
// //           if (point) {
// //             point.stocks[stock.type_dechet] = stock.quantite_disponible;
// //           }
// //         });
        
// //         const pointsArray = Array.from(pointsMap.values());
// //         console.log('📍 Points trouvés:', pointsArray);
// //         setPointsDepot(pointsArray);
// //       }
      
// //     } catch (error) {
// //       console.error('❌ Erreur chargement points:', error);
// //       toast.error('Erreur lors du chargement des points de dépôt');
      
// //       // Fallback: utiliser les UUIDs des stocks que vous avez montrés
// //       const fallbackPoints = [
// //         { 
// //           id: '6e4d0955-433d-4121-84ff-47bfb9e2a735', 
// //           nom: 'Point de collecte Nord', 
// //           commune: 'Dakar', 
// //           quartier: 'Nord',
// //           stocks: {
// //             'plastique_pet': 20,
// //             'papier_carton': 40,
// //             'metal': 2
// //           }
// //         }
// //       ];
// //       setPointsDepot(fallbackPoints);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({ ...prev, [name]: value }));
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
    
// //     if (!formData.pointDepotId || !formData.typeDechet || !formData.quantite || !formData.dateSouhaitee) {
// //       toast.error('Veuillez remplir tous les champs obligatoires');
// //       return;
// //     }

// //     if (parseFloat(formData.quantite) <= 0) {
// //       toast.error('La quantité doit être supérieure à 0');
// //       return;
// //     }

// //     try {
// //       setSubmitting(true);
// //       console.log('📤 Envoi de la demande avec données:', formData);
      
// //       const response = await recycleurService.creerDemande(formData);
      
// //       if (response.success) {
// //         toast.success('Demande d\'enlèvement créée avec succès !');
// //         navigate('/recycleur/demandes');
// //       }
// //     } catch (error) {
// //       console.error('❌ Erreur lors de la création:', error);
// //       toast.error(error.response?.data?.message || 'Erreur lors de la création');
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

// //   const selectedPoint = pointsDepot.find(p => p.id === formData.pointDepotId);
// //   const stockDisponible = selectedPoint?.stocks?.[formData.typeDechet] || 0;

// //   const styles = `
// //     .demande-container {
// //       max-width: 800px;
// //       margin: 0 auto;
// //       padding: 1.5rem;
// //     }

// //     .demande-card {
// //       background: white;
// //       border-radius: 1rem;
// //       padding: 2rem;
// //       border: 1px solid #d9e0d9;
// //     }

// //     .demande-title {
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

// //     .form-group label {
// //       display: block;
// //       margin-bottom: 0.5rem;
// //       font-weight: 600;
// //       color: #1a1e1a;
// //     }

// //     .form-group label span {
// //       color: #dc2626;
// //       margin-left: 0.25rem;
// //     }

// //     .form-group select,
// //     .form-group input,
// //     .form-group textarea {
// //       width: 100%;
// //       padding: 0.75rem 1rem;
// //       border: 1.5px solid #d9e0d9;
// //       border-radius: 0.75rem;
// //       font-size: 0.95rem;
// //       transition: all 0.2s;
// //     }

// //     .form-group select:focus,
// //     .form-group input:focus,
// //     .form-group textarea:focus {
// //       border-color: #2d8a5e;
// //       outline: none;
// //       box-shadow: 0 0 0 3px rgba(45, 138, 94, 0.1);
// //     }

// //     .stock-info {
// //       background: #e8f3e8;
// //       border-radius: 0.75rem;
// //       padding: 1rem;
// //       margin-top: 0.5rem;
// //       font-size: 0.9rem;
// //       color: #1a1e1a;
// //       display: flex;
// //       align-items: center;
// //       gap: 0.5rem;
// //     }

// //     .stock-info i {
// //       color: #2d8a5e;
// //     }

// //     .point-info {
// //       background: #f8faf8;
// //       border-radius: 0.75rem;
// //       padding: 1rem;
// //       margin-top: 0.5rem;
// //       display: flex;
// //       align-items: center;
// //       gap: 0.5rem;
// //       color: #5a655a;
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

// //     .spinner {
// //       border: 2px solid #f3f3f3;
// //       border-top: 2px solid #2d8a5e;
// //       border-radius: 50%;
// //       width: 20px;
// //       height: 20px;
// //       animation: spin 1s linear infinite;
// //     }

// //     @keyframes spin {
// //       0% { transform: rotate(0deg); }
// //       100% { transform: rotate(360deg); }
// //     }

// //     @media (max-width: 768px) {
// //       .form-grid {
// //         grid-template-columns: 1fr;
// //       }
      
// //       .form-group.full-width {
// //         grid-column: span 1;
// //       }
      
// //       .form-actions {
// //         flex-direction: column;
// //       }
      
// //       .btn-primary, .btn-secondary {
// //         width: 100%;
// //         justify-content: center;
// //       }
// //     }
// //   `;

// //   return (
// //     <>
// //       <style>{styles}</style>
// //       <DashboardLayout title="Nouvelle demande d'enlèvement" user={user}>
// //         <div className="demande-container">
// //           <div className="demande-card">
// //             <h2 className="demande-title">Créer une demande d'enlèvement</h2>

// //             <form onSubmit={handleSubmit}>
// //               <div className="form-grid">
// //                 {/* Point de dépôt */}
// //                 <div className="form-group full-width">
// //                   <label>Point de dépôt <span>*</span></label>
// //                   <select
// //                     name="pointDepotId"
// //                     value={formData.pointDepotId}
// //                     onChange={handleInputChange}
// //                     required
// //                     disabled={loading}
// //                   >
// //                     <option value="">Sélectionnez un point</option>
// //                     {pointsDepot.map(point => (
// //                       <option key={point.id} value={point.id}>
// //                         {point.nom} - {point.commune}
// //                       </option>
// //                     ))}
// //                   </select>
                  
// //                   {selectedPoint && (
// //                     <div className="point-info">
// //                       <FiMapPin />
// //                       <span>{selectedPoint.quartier}, {selectedPoint.commune}</span>
// //                     </div>
// //                   )}
// //                 </div>

// //                 {/* Type de déchet */}
// //                 <div className="form-group">
// //                   <label>Type de déchet <span>*</span></label>
// //                   <select
// //                     name="typeDechet"
// //                     value={formData.typeDechet}
// //                     onChange={handleInputChange}
// //                     required
// //                     disabled={loading}
// //                   >
// //                     <option value="">Sélectionnez</option>
// //                     {typesDechet.map(type => (
// //                       <option key={type.value} value={type.value}>
// //                         {type.label}
// //                       </option>
// //                     ))}
// //                   </select>

// //                   {selectedPoint && formData.typeDechet && (
// //                     <div className="stock-info">
// //                       <i className="fas fa-boxes"></i>
// //                       Stock disponible: <strong>{stockDisponible} kg</strong>
// //                     </div>
// //                   )}
// //                 </div>

// //                 {/* Quantité */}
// //                 <div className="form-group">
// //                   <label>Quantité (kg) <span>*</span></label>
// //                   <input
// //                     type="number"
// //                     name="quantite"
// //                     value={formData.quantite}
// //                     onChange={handleInputChange}
// //                     min="1"
// //                     max={stockDisponible || undefined}
// //                     step="0.1"
// //                     placeholder="Ex: 500"
// //                     required
// //                   />
// //                 </div>

// //                 {/* Date souhaitée */}
// //                 <div className="form-group">
// //                   <label>Date souhaitée <span>*</span></label>
// //                   <input
// //                     type="date"
// //                     name="dateSouhaitee"
// //                     value={formData.dateSouhaitee}
// //                     onChange={handleInputChange}
// //                     min={new Date().toISOString().split('T')[0]}
// //                     required
// //                   />
// //                 </div>

// //                 {/* Notes */}
// //                 <div className="form-group full-width">
// //                   <label>Notes (optionnel)</label>
// //                   <textarea
// //                     name="notes"
// //                     value={formData.notes}
// //                     onChange={handleInputChange}
// //                     rows="3"
// //                     placeholder="Informations complémentaires..."
// //                   />
// //                 </div>
// //               </div>

// //               {/* Actions */}
// //               <div className="form-actions">
// //                 <button 
// //                   type="button" 
// //                   className="btn-secondary"
// //                   onClick={() => navigate('/recycleur/demandes')}
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
// //                       <FiSend /> Envoyer la demande
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

// // export default DemandeEnlevement;



// // pages/Recycleur/DemandeEnlevement.jsx - Version corrigée

// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import DashboardLayout from '../../Layouts/LayoutDashboard';
// import recycleurService from '../../services/recycleurService';
// import { FiSend, FiCalendar, FiMapPin, FiPackage } from 'react-icons/fi';
// import toast from 'react-hot-toast';

// const DemandeEnlevement = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
  
//   const [formData, setFormData] = useState({
//     pointDepotId: queryParams.get('point') || '',
//     typeDechet: queryParams.get('type') || '',
//     quantite: '',
//     dateSouhaitee: new Date().toISOString().split('T')[0],
//     notes: ''
//   });

//   const [pointsDepot, setPointsDepot] = useState([]);
//   const [stocksData, setStocksData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const userData = JSON.parse(localStorage.getItem('ecocollect_user'));
//     setUser(userData);
//     loadPointsDepot();
//   }, []);

//   const loadPointsDepot = async () => {
//     try {
//       setLoading(true);
//       console.log('🔄 Chargement des points de dépôt...');
      
//       // 1. Récupérer les stocks
//       const stocksResponse = await recycleurService.getStocks();
//       console.log('📦 Stocks reçus:', stocksResponse);
      
//       const stocks = stocksResponse.stocks || [];
//       setStocksData(stocks);
      
//       // 2. Récupérer les points de dépôt
//       const pointsResponse = await recycleurService.getPointsDepot();
//       console.log('📍 Points reçus:', pointsResponse);
      
//       const points = pointsResponse.points || pointsResponse || [];
      
//       // 3. Créer une map des stocks par point
//       const stocksByPoint = {};
//       stocks.forEach(stock => {
//         if (!stocksByPoint[stock.point_depot_id]) {
//           stocksByPoint[stock.point_depot_id] = {};
//         }
//         stocksByPoint[stock.point_depot_id][stock.type_dechet] = stock.quantite_disponible;
//       });
      
//       // 4. Combiner les données
//       const pointsWithStocks = points.map(point => ({
//         id: point.id,
//         nom: point.nom,
//         commune: point.commune,
//         quartier: point.quartier,
//         adresse: point.adresse,
//         stocks: stocksByPoint[point.id] || {}
//       }));
      
//       console.log('✅ Points avec stocks:', pointsWithStocks);
//       setPointsDepot(pointsWithStocks);
      
//     } catch (error) {
//       console.error('❌ Erreur chargement points:', error);
//       toast.error('Erreur lors du chargement des points de dépôt');
      
//       // Fallback avec les données que vous avez
//       const fallbackPoints = [
//         { 
//           id: '6e4d0955-433d-4121-84ff-47bfb9e2a735', 
//           nom: 'Point de collecte Nord', 
//           commune: 'Dakar', 
//           quartier: 'Nord',
//           stocks: {
//             'plastique_pet': 20,
//             'papier_carton': 40,
//             'metal': 2
//           }
//         }
//       ];
//       setPointsDepot(fallbackPoints);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     // Debug
//     if (name === 'pointDepotId' || name === 'typeDechet') {
//       const point = pointsDepot.find(p => p.id === formData.pointDepotId);
//       if (point && formData.typeDechet) {
//         console.log(`Stock pour ${formData.typeDechet}:`, point.stocks[formData.typeDechet]);
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.pointDepotId || !formData.typeDechet || !formData.quantite || !formData.dateSouhaitee) {
//       toast.error('Veuillez remplir tous les champs obligatoires');
//       return;
//     }

//     if (parseFloat(formData.quantite) <= 0) {
//       toast.error('La quantité doit être supérieure à 0');
//       return;
//     }

//     // Vérifier le stock
//     const selectedPoint = pointsDepot.find(p => p.id === formData.pointDepotId);
//     const stockDispo = selectedPoint?.stocks?.[formData.typeDechet] || 0;
    
//     if (parseFloat(formData.quantite) > stockDispo) {
//       toast.error(`Stock insuffisant. Disponible: ${stockDispo} kg`);
//       return;
//     }

//     try {
//       setSubmitting(true);
//       console.log('📤 Envoi de la demande avec données:', formData);
      
//       const response = await recycleurService.creerDemande(formData);
      
//       if (response.success) {
//         toast.success('Demande d\'enlèvement créée avec succès !');
//         navigate('/recycleur/demandes');
//       }
//     } catch (error) {
//       console.error('❌ Erreur lors de la création:', error);
//       toast.error(error.response?.data?.message || 'Erreur lors de la création');
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

//   const selectedPoint = pointsDepot.find(p => p.id === formData.pointDepotId);
//   const stockDisponible = selectedPoint?.stocks?.[formData.typeDechet] || 0;

//   // Les styles restent identiques
  
// //   const styles = `
// //     .demande-container {
// //       max-width: 800px;
// //       margin: 0 auto;
// //       padding: 1.5rem;
// //     }

// //     .demande-card {
// //       background: white;
// //       border-radius: 1rem;
// //       padding: 2rem;
// //       border: 1px solid #d9e0d9;
// //     }

// //     .demande-title {
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

// //     .form-group label {
// //       display: block;
// //       margin-bottom: 0.5rem;
// //       font-weight: 600;
// //       color: #1a1e1a;
// //     }

// //     .form-group label span {
// //       color: #dc2626;
// //       margin-left: 0.25rem;
// //     }

// //     .form-group select,
// //     .form-group input,
// //     .form-group textarea {
// //       width: 100%;
// //       padding: 0.75rem 1rem;
// //       border: 1.5px solid #d9e0d9;
// //       border-radius: 0.75rem;
// //       font-size: 0.95rem;
// //       transition: all 0.2s;
// //     }

// //     .form-group select:focus,
// //     .form-group input:focus,
// //     .form-group textarea:focus {
// //       border-color: #2d8a5e;
// //       outline: none;
// //       box-shadow: 0 0 0 3px rgba(45, 138, 94, 0.1);
// //     }

// //     .stock-info {
// //       background: #e8f3e8;
// //       border-radius: 0.75rem;
// //       padding: 1rem;
// //       margin-top: 0.5rem;
// //       font-size: 0.9rem;
// //       color: #1a1e1a;
// //       display: flex;
// //       align-items: center;
// //       gap: 0.5rem;
// //     }

// //     .stock-info i {
// //       color: #2d8a5e;
// //     }

// //     .point-info {
// //       background: #f8faf8;
// //       border-radius: 0.75rem;
// //       padding: 1rem;
// //       margin-top: 0.5rem;
// //       display: flex;
// //       align-items: center;
// //       gap: 0.5rem;
// //       color: #5a655a;
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

// //     .spinner {
// //       border: 2px solid #f3f3f3;
// //       border-top: 2px solid #2d8a5e;
// //       border-radius: 50%;
// //       width: 20px;
// //       height: 20px;
// //       animation: spin 1s linear infinite;
// //     }

// //     @keyframes spin {
// //       0% { transform: rotate(0deg); }
// //       100% { transform: rotate(360deg); }
// //     }

// //     @media (max-width: 768px) {
// //       .form-grid {
// //         grid-template-columns: 1fr;
// //       }
      
// //       .form-group.full-width {
// //         grid-column: span 1;
// //       }
      
// //       .form-actions {
// //         flex-direction: column;
// //       }
      
// //       .btn-primary, .btn-secondary {
// //         width: 100%;
// //         justify-content: center;
// //       }
// //     }
// //   `;




//   return (
//     <>
//       <style>{styles}</style>
//       <DashboardLayout title="Nouvelle demande d'enlèvement" user={user}>
//         <div className="demande-container">
//           <div className="demande-card">
//             <h2 className="demande-title">Créer une demande d'enlèvement</h2>

//             <form onSubmit={handleSubmit}>
//               <div className="form-grid">
//                 {/* Point de dépôt */}
//                 <div className="form-group full-width">
//                   <label>Point de dépôt <span>*</span></label>
//                   <select
//                     name="pointDepotId"
//                     value={formData.pointDepotId}
//                     onChange={handleInputChange}
//                     required
//                     disabled={loading}
//                   >
//                     <option value="">Sélectionnez un point</option>
//                     {pointsDepot.map(point => (
//                       <option key={point.id} value={point.id}>
//                         {point.nom} - {point.commune}
//                       </option>
//                     ))}
//                   </select>
                  
//                   {selectedPoint && (
//                     <div className="point-info">
//                       <FiMapPin />
//                       <span>{selectedPoint.quartier}, {selectedPoint.commune}</span>
//                     </div>
//                   )}
//                 </div>

//                 {/* Type de déchet */}
//                 <div className="form-group">
//                   <label>Type de déchet <span>*</span></label>
//                   <select
//                     name="typeDechet"
//                     value={formData.typeDechet}
//                     onChange={handleInputChange}
//                     required
//                     disabled={loading}
//                   >
//                     <option value="">Sélectionnez</option>
//                     {typesDechet.map(type => (
//                       <option key={type.value} value={type.value}>
//                         {type.label}
//                       </option>
//                     ))}
//                   </select>

//                   {selectedPoint && formData.typeDechet && (
//                     <div className="stock-info">
//                       <i className="fas fa-boxes"></i>
//                       Stock disponible: <strong>{stockDisponible} kg</strong>
//                     </div>
//                   )}
//                 </div>

//                 {/* Quantité */}
//                 <div className="form-group">
//                   <label>Quantité (kg) <span>*</span></label>
//                   <input
//                     type="number"
//                     name="quantite"
//                     value={formData.quantite}
//                     onChange={handleInputChange}
//                     min="1"
//                     max={stockDisponible || undefined}
//                     step="0.1"
//                     placeholder="Ex: 500"
//                     required
//                   />
//                 </div>

//                 {/* Date souhaitée */}
//                 <div className="form-group">
//                   <label>Date souhaitée <span>*</span></label>
//                   <input
//                     type="date"
//                     name="dateSouhaitee"
//                     value={formData.dateSouhaitee}
//                     onChange={handleInputChange}
//                     min={new Date().toISOString().split('T')[0]}
//                     required
//                   />
//                 </div>

//                 {/* Notes */}
//                 <div className="form-group full-width">
//                   <label>Notes (optionnel)</label>
//                   <textarea
//                     name="notes"
//                     value={formData.notes}
//                     onChange={handleInputChange}
//                     rows="3"
//                     placeholder="Informations complémentaires..."
//                   />
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="form-actions">
//                 <button 
//                   type="button" 
//                   className="btn-secondary"
//                   onClick={() => navigate('/recycleur/demandes')}
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
//                       <FiSend /> Envoyer la demande
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

// export default DemandeEnlevement;


// pages/Recycleur/DemandeEnlevement.jsx - Version avec débogage

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../../Layouts/LayoutDashboard';
import recycleurService from '../../services/recycleurService';
import { FiSend, FiCalendar, FiMapPin, FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';

const DemandeEnlevement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [formData, setFormData] = useState({
    pointDepotId: queryParams.get('point') || '',
    typeDechet: queryParams.get('type') || '',
    quantite: '',
    dateSouhaitee: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [pointsDepot, setPointsDepot] = useState([]);
  const [stocksData, setStocksData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('ecocollect_user'));
    setUser(userData);
    loadPointsDepot();
  }, []);

  const loadPointsDepot = async () => {
    try {
      setLoading(true);
      console.log('🔄 Chargement des points de dépôt...');
      
      // 1. Récupérer les stocks
      const stocksResponse = await recycleurService.getStocks();
      console.log('📦 Stocks reçus (complet):', stocksResponse);
      
      // Analyser la structure des stocks
      const stocks = stocksResponse.stocks || [];
      console.log('📦 Tableau stocks:', stocks);
      console.log('📦 Nombre de stocks:', stocks.length);
      
      // Afficher chaque stock en détail
      stocks.forEach((stock, index) => {
        console.log(`Stock ${index}:`, {
          point_depot_id: stock.point_depot_id,
          type_dechet: stock.type_dechet,
          quantite: stock.quantite_disponible,
          point_nom: stock.point_nom
        });
      });
      
      setStocksData(stocks);
      
      // 2. Récupérer les points de dépôt
      const pointsResponse = await recycleurService.getPointsDepot();
      console.log('📍 Points reçus:', pointsResponse);
      
      const points = pointsResponse.points || pointsResponse || [];
      console.log('📍 Points:', points);
      
      // 3. Créer une map des stocks par point
      const stocksByPoint = {};
      stocks.forEach(stock => {
        if (stock.point_depot_id) {
          if (!stocksByPoint[stock.point_depot_id]) {
            stocksByPoint[stock.point_depot_id] = {};
          }
          stocksByPoint[stock.point_depot_id][stock.type_dechet] = stock.quantite_disponible;
        }
      });
      
      console.log('📊 Map stocks par point:', stocksByPoint);
      
      // 4. Combiner les données
      const pointsWithStocks = points.map(point => {
        const pointStocks = stocksByPoint[point.id] || {};
        console.log(`Point ${point.nom} - Stocks trouvés:`, pointStocks);
        
        return {
          id: point.id,
          nom: point.nom,
          commune: point.commune,
          quartier: point.quartier,
          adresse: point.adresse,
          stocks: pointStocks
        };
      });
      
      console.log('✅ Points avec stocks FINAL:', pointsWithStocks);
      setPointsDepot(pointsWithStocks);
      
    } catch (error) {
      console.error('❌ Erreur chargement points:', error);
      toast.error('Erreur lors du chargement des points de dépôt');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Debug amélioré
    if (name === 'pointDepotId') {
      console.log('Point sélectionné ID:', value);
      const point = pointsDepot.find(p => p.id === value);
      console.log('Point sélectionné:', point);
      if (point) {
        console.log('Stocks du point:', point.stocks);
      }
    }
    
    if (name === 'typeDechet' && formData.pointDepotId) {
      const point = pointsDepot.find(p => p.id === formData.pointDepotId);
      if (point) {
        console.log(`Stock pour ${value}:`, point.stocks[value]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.pointDepotId || !formData.typeDechet || !formData.quantite || !formData.dateSouhaitee) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (parseFloat(formData.quantite) <= 0) {
      toast.error('La quantité doit être supérieure à 0');
      return;
    }

    // Vérifier le stock
    const selectedPoint = pointsDepot.find(p => p.id === formData.pointDepotId);
    const stockDispo = selectedPoint?.stocks?.[formData.typeDechet] || 0;
    
    if (parseFloat(formData.quantite) > stockDispo) {
      toast.error(`Stock insuffisant. Disponible: ${stockDispo} kg`);
      return;
    }

    try {
      setSubmitting(true);
      console.log('📤 Envoi de la demande avec données:', formData);
      
      const response = await recycleurService.creerDemande(formData);
      
      if (response.success) {
        toast.success('Demande d\'enlèvement créée avec succès !');
        navigate('/recycleur/demandes');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la création:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la création');
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

  const selectedPoint = pointsDepot.find(p => p.id === formData.pointDepotId);
  const stockDisponible = selectedPoint?.stocks?.[formData.typeDechet] || 0;

  // Styles identiques...

  const styles = `
    .demande-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 1.5rem;
    }

    .demande-card {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      border: 1px solid #d9e0d9;
    }

    .demande-title {
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

    .stock-info {
      background: #e8f3e8;
      border-radius: 0.75rem;
      padding: 1rem;
      margin-top: 0.5rem;
      font-size: 0.9rem;
      color: #1a1e1a;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .stock-info i {
      color: #2d8a5e;
    }

    .point-info {
      background: #f8faf8;
      border-radius: 0.75rem;
      padding: 1rem;
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #5a655a;
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

  return (
    <>
      <style>{styles}</style>
      <DashboardLayout title="Nouvelle demande d'enlèvement" user={user}>
        <div className="demande-container">
          <div className="demande-card">
            <h2 className="demande-title">Créer une demande d'enlèvement</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                {/* Point de dépôt */}
                <div className="form-group full-width">
                  <label>Point de dépôt <span>*</span></label>
                  <select
                    name="pointDepotId"
                    value={formData.pointDepotId}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Sélectionnez un point</option>
                    {pointsDepot.map(point => (
                      <option key={point.id} value={point.id}>
                        {point.nom} - {point.commune}
                      </option>
                    ))}
                  </select>
                  
                  {selectedPoint && (
                    <div className="point-info">
                      <FiMapPin />
                      <span>{selectedPoint.quartier}, {selectedPoint.commune}</span>
                    </div>
                  )}
                </div>

                {/* Type de déchet */}
                <div className="form-group">
                  <label>Type de déchet <span>*</span></label>
                  <select
                    name="typeDechet"
                    value={formData.typeDechet}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Sélectionnez</option>
                    {typesDechet.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>

                  {selectedPoint && formData.typeDechet && (
                    <div className="stock-info">
                      <i className="fas fa-boxes"></i>
                      Stock disponible: <strong>{stockDisponible} kg</strong>
                    </div>
                  )}
                </div>

                {/* Quantité */}
                <div className="form-group">
                  <label>Quantité (kg) <span>*</span></label>
                  <input
                    type="number"
                    name="quantite"
                    value={formData.quantite}
                    onChange={handleInputChange}
                    min="1"
                    max={stockDisponible || undefined}
                    step="0.1"
                    placeholder="Ex: 500"
                    required
                  />
                </div>

                {/* Date souhaitée */}
                <div className="form-group">
                  <label>Date souhaitée <span>*</span></label>
                  <input
                    type="date"
                    name="dateSouhaitee"
                    value={formData.dateSouhaitee}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                {/* Notes */}
                <div className="form-group full-width">
                  <label>Notes (optionnel)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Informations complémentaires..."
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => navigate('/recycleur/demandes')}
                >
                  <i className="fas fa-times"></i> Annuler
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? (
                    <>
                      <div className="spinner"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <FiSend /> Envoyer la demande
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

export default DemandeEnlevement;