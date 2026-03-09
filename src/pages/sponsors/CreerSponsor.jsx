// // import React, { useState, useEffect } from 'react';
// // import { useNavigate, useParams } from 'react-router-dom';
// // import DashboardLayout from '../../Layouts/LayoutDashboard';
// // import adminService from '../../services/adminService';
// // import { FiSave, FiX } from 'react-icons/fi';
// // import toast from 'react-hot-toast';

// // const CreerSponsor = () => {
// //   const navigate = useNavigate();
// //   const { id } = useParams();
// //   const isEditing = !!id;

// //   const [formData, setFormData] = useState({
// //     email: '',
// //     telephone: '',
// //     motDePasse: '',
// //     nomOrganisation: '',
// //     typeOrganisation: '',
// //     nomResponsable: '',
// //     adresse: ''
// //   });
// //   const [logo, setLogo] = useState(null);
// //   const [preview, setPreview] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [user, setUser] = useState(null);

// //   useEffect(() => {
// //     const userData = JSON.parse(localStorage.getItem('ecocollect_user'));
// //     setUser(userData);
// //     if (isEditing) {
// //       loadSponsor();
// //     }
// //   }, [id]);

// //   const loadSponsor = async () => {
// //     try {
// //       const data = await adminService.getSponsorById(id);
// //       const sponsor = data.sponsor;
// //       setFormData({
// //         email: sponsor.email || '',
// //         telephone: sponsor.telephone || '',
// //         motDePasse: '',
// //         nomOrganisation: sponsor.nom_organisation || '',
// //         typeOrganisation: sponsor.type_organisation || '',
// //         nomResponsable: sponsor.nom_responsable || '',
// //         adresse: sponsor.adresse || ''
// //       });
// //       if (sponsor.photo_logo_url) {
// //         setPreview(sponsor.photo_logo_url);
// //       }
// //     } catch {
// //       toast.error('Erreur chargement');
// //       navigate('/admin/sponsors');
// //     }
// //   };

// //   const handleChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   const handleFile = (e) => {
// //     const file = e.target.files[0];
// //     setLogo(file);
// //     if (file) {
// //       const reader = new FileReader();
// //       reader.onloadend = () => setPreview(reader.result);
// //       reader.readAsDataURL(file);
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     const form = new FormData();
// //     Object.entries(formData).forEach(([key, val]) => val && form.append(key, val));
// //     if (logo) form.append('logo', logo);

// //     try {
// //       setLoading(true);
// //       if (isEditing) {
// //         await adminService.modifierSponsor(id, form);
// //         toast.success('Sponsor modifié');
// //       } else {
// //         await adminService.creerSponsor(form);
// //         toast.success('Sponsor créé');
// //       }
// //       navigate('/admin/sponsors');
// //     } catch (err) {
// //       toast.error(err.response?.data?.message || 'Erreur');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <DashboardLayout title={isEditing ? 'Modifier sponsor' : 'Nouveau sponsor'} user={user}>
// //       <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
// //         <form onSubmit={handleSubmit} className="space-y-4">
// //           <div>
// //             <label>Nom organisation *</label>
// //             <input name="nomOrganisation" value={formData.nomOrganisation} onChange={handleChange} required className="w-full border p-2 rounded" />
// //           </div>
// //           <div>
// //             <label>Type organisation</label>
// //             <input name="typeOrganisation" value={formData.typeOrganisation} onChange={handleChange} className="w-full border p-2 rounded" />
// //           </div>
// //           <div>
// //             <label>Nom responsable</label>
// //             <input name="nomResponsable" value={formData.nomResponsable} onChange={handleChange} className="w-full border p-2 rounded" />
// //           </div>
// //           <div>
// //             <label>Email *</label>
// //             <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border p-2 rounded" />
// //           </div>
// //           <div>
// //             <label>Téléphone</label>
// //             <input name="telephone" value={formData.telephone} onChange={handleChange} className="w-full border p-2 rounded" />
// //           </div>
// //           <div>
// //             <label>Adresse</label>
// //             <textarea name="adresse" value={formData.adresse} onChange={handleChange} className="w-full border p-2 rounded" />
// //           </div>
// //           {!isEditing && (
// //             <div>
// //               <label>Mot de passe *</label>
// //               <input type="password" name="motDePasse" value={formData.motDePasse} onChange={handleChange} required className="w-full border p-2 rounded" />
// //             </div>
// //           )}
// //           <div>
// //             <label>Logo</label>
// //             <input type="file" accept="image/*" onChange={handleFile} className="w-full" />
// //             {preview && <img src={preview} alt="logo" className="mt-2 h-20 object-contain" />}
// //           </div>
// //           <div className="flex gap-3 pt-4">
// //             <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded flex items-center gap-2">
// //               {loading ? '...' : <><FiSave /> {isEditing ? 'Modifier' : 'Créer'}</>}
// //             </button>
// //             <button type="button" onClick={() => navigate('/admin/sponsors')} className="bg-gray-200 px-6 py-2 rounded flex items-center gap-2">
// //               <FiX /> Annuler
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </DashboardLayout>
// //   );
// // };

// // export default CreerSponsor;


// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { FiSave, FiArrowLeft } from 'react-icons/fi';
// import toast from 'react-hot-toast';
// import adminService from '../../services/adminService';
// import DashboardLayout from '../../Layouts/LayoutDashboard';

// const CreerSponsor = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [user, setUser] = useState(null);
//   const [formData, setFormData] = useState({
//     nomOrganisation: '',
//     typeOrganisation: 'entreprise',
//     nomResponsable: '',
//     email: '',
//     telephone: '',
//     adresse: '',
//     motDePasse: '',
//     photoLogo: null
//   });

//   useEffect(() => {
//     setUser(JSON.parse(localStorage.getItem('ecocollect_user')));
//     if (id) {
//       loadSponsor();
//     }
//   }, [id]);

//   const loadSponsor = async () => {
//     try {
//       setLoading(true);
//       const { data } = await adminService.getSponsor(id);
//       const sponsor = data.sponsor;
//       setFormData({
//         nomOrganisation: sponsor.nom_organisation || '',
//         typeOrganisation: sponsor.type_organisation || 'entreprise',
//         nomResponsable: sponsor.nom_responsable || '',
//         email: sponsor.email || '',
//         telephone: sponsor.telephone || '',
//         adresse: sponsor.adresse || '',
//         motDePasse: '', // ne pas pré-remplir
//         photoLogo: null
//       });
//     } catch (error) {
//       toast.error('Erreur chargement sponsor');
//       navigate('/admin/sponsors');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === 'photoLogo') {
//       setFormData({ ...formData, photoLogo: files[0] });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

  
//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     setLoading(true);
//     if (id) {
//       await adminService.updateSponsor(id, formData);
//       toast.success('Sponsor modifié');
//     } else {
//       await adminService.createSponsor(formData);
//       toast.success('Sponsor créé');
//     }
//     navigate('/admin/sponsors');
//   } catch (error) {
//     console.error('Erreur lors de l\'enregistrement:', error);
//     if (error.response) {
//       // Le serveur a répondu avec un code d'erreur
//       console.error('Réponse serveur:', error.response.data);
//       console.error('Statut:', error.response.status);
      
//       // Afficher le message d'erreur du serveur
//       const serverMessage = error.response.data?.message || error.response.data?.error || 'Erreur serveur';
//       toast.error(`Erreur ${error.response.status}: ${serverMessage}`);
//     } else if (error.request) {
//       // Pas de réponse du serveur
//       toast.error('Aucune réponse du serveur. Vérifiez votre connexion.');
//     } else {
//       toast.error('Erreur: ' + error.message);
//     }
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <DashboardLayout title={id ? 'Modifier sponsor' : 'Nouveau sponsor'} user={user}>
//       <div className="mb-4">
//         <button onClick={() => navigate('/admin/sponsors')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
//           <FiArrowLeft /> Retour
//         </button>
//       </div>
//       <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-2xl">
//         <div className="grid grid-cols-1 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
//             <input type="file" name="photoLogo" accept="image/*" onChange={handleChange} className="w-full" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'organisation *</label>
//             <input type="text" name="nomOrganisation" required value={formData.nomOrganisation} onChange={handleChange} className="input-field" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Type d'organisation *</label>
//             <select name="typeOrganisation" value={formData.typeOrganisation} onChange={handleChange} className="input-field">
//               <option value="entreprise">Entreprise</option>
//               <option value="association">Association</option>
//               <option value="fondation">Fondation</option>
//               <option value="autre">Autre</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Nom du responsable *</label>
//             <input type="text" name="nomResponsable" required value={formData.nomResponsable} onChange={handleChange} className="input-field" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
//             <input type="email" name="email" required value={formData.email} onChange={handleChange} className="input-field" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
//             <input type="tel" name="telephone" required value={formData.telephone} onChange={handleChange} className="input-field" />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
//             <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} className="input-field" />
//           </div>
//           {!id && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
//               <input type="password" name="motDePasse" required value={formData.motDePasse} onChange={handleChange} className="input-field" />
//             </div>
//           )}
//           <div className="flex justify-end">
//             <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
//               <FiSave /> {loading ? 'Enregistrement...' : (id ? 'Mettre à jour' : 'Créer')}
//             </button>
//           </div>
//         </div>
//       </form>
//     </DashboardLayout>
//   );
// };

// export default CreerSponsor;


import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
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
    motDePasse: ''
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
        motDePasse: ''
      });
    } catch (error) {
      toast.error('Erreur chargement sponsor');
      navigate('/admin/sponsors');
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
        await adminService.updateSponsor(id, formData);
        toast.success('Sponsor modifié');
      } else {
        await adminService.createSponsor(formData);
        toast.success('Sponsor créé');
      }
      navigate('/admin/sponsors');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      if (error.response) {
        toast.error(`Erreur ${error.response.status}: ${error.response.data?.message || 'Erreur serveur'}`);
      } else {
        toast.error('Erreur de connexion');
      }
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