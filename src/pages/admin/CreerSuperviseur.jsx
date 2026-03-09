// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import AdminLayout from './AdminLayout';
// // import AdminLayout from '../../Layouts/AdminLayout ';
// import adminService from '../../services/adminService';
// import { FiSave, FiX } from 'react-icons/fi';
// import toast from 'react-hot-toast';

// const CreerSuperviseur = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: '',
//     telephone: '',
//     motDePasse: '',
//     confirmMotDePasse: '',
//     nomComplet: ''
//   });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (formData.motDePasse !== formData.confirmMotDePasse) {
//       toast.error('Les mots de passe ne correspondent pas');
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await adminService.creerSuperviseur({
//         email: formData.email,
//         telephone: formData.telephone,
//         motDePasse: formData.motDePasse,
//         nomComplet: formData.nomComplet
//       });

//       if (response.success) {
//         toast.success('Superviseur créé avec succès');
//         navigate('/admin/superviseurs');
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Erreur lors de la création');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AdminLayout title="Créer un superviseur">
//       <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">Nouveau superviseur</h2>
        
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Nom complet *
//             </label>
//             <input
//               type="text"
//               name="nomComplet"
//               value={formData.nomComplet}
//               onChange={handleChange}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Email *
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Téléphone
//             </label>
//             <input
//               type="tel"
//               name="telephone"
//               value={formData.telephone}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Mot de passe *
//             </label>
//             <input
//               type="password"
//               name="motDePasse"
//               value={formData.motDePasse}
//               onChange={handleChange}
//               required
//               minLength={6}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Confirmer le mot de passe *
//             </label>
//             <input
//               type="password"
//               name="confirmMotDePasse"
//               value={formData.confirmMotDePasse}
//               onChange={handleChange}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//             />
//           </div>

//           <div className="flex gap-3 pt-4">
//             <button
//               type="submit"
//               disabled={loading}
//               className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2 disabled:opacity-50"
//             >
//               {loading ? (
//                 <>
//                   <div className="spinner w-4 h-4"></div>
//                   Création...
//                 </>
//               ) : (
//                 <>
//                   <FiSave /> Créer
//                 </>
//               )}
//             </button>
//             <button
//               type="button"
//               onClick={() => navigate('/admin/superviseurs')}
//               className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 flex items-center gap-2"
//             >
//               <FiX /> Annuler
//             </button>
//           </div>
//         </form>
//       </div>
//     </AdminLayout>
//   );
// };

// export default CreerSuperviseur;



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import adminService from '../../services/adminService';
import { FiSave, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CreerSuperviseur = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    telephone: '',
    motDePasse: '',
    confirmMotDePasse: '',
    nomComplet: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.motDePasse !== formData.confirmMotDePasse) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      setLoading(true);
      const response = await adminService.creerSuperviseur({
        email: formData.email,
        telephone: formData.telephone,
        motDePasse: formData.motDePasse,
        nomComplet: formData.nomComplet
      });

      if (response.success) {
        toast.success('Superviseur créé avec succès');
        navigate('/admin/superviseurs');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Créer un superviseur">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Nouveau superviseur</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom complet *
            </label>
            <input
              type="text"
              name="nomComplet"
              value={formData.nomComplet}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe *
            </label>
            <input
              type="password"
              name="motDePasse"
              value={formData.motDePasse}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmer le mot de passe *
            </label>
            <input
              type="password"
              name="confirmMotDePasse"
              value={formData.confirmMotDePasse}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Création...
                </>
              ) : (
                <>
                  <FiSave /> Créer
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/superviseurs')}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 flex items-center gap-2"
            >
              <FiX /> Annuler
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CreerSuperviseur;