


// import React, { useState, useEffect } from 'react';
// import logo from '../assets/logo.jpeg';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     identifiant: '',
//     motDePasse: '',
//     rememberMe: false
//   });
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });
//   const [userType, setUserType] = useState('');

//   // Configuration API
//   const API_URL = 'http://localhost:3000';
//   const STORAGE_KEYS = {
//     TOKEN: 'ecocollect_token',
//     USER: 'ecocollect_user',
//     ROLE: 'ecocollect_role'
//   };

//   // Mapping des rôles vers les pages
//   const ROLE_PAGES = {
//     'producteur': '/producteur',
//     'collecteur': '/collecteur',
//     'gestionnaire': '/gestionnaire',
//     'superviseur': '/superviseur',
//     'admin': '/admin',
//     'recycleur': '/recycleur',
//     'sponsor': '/sponsor',
//     'ong': '/ong'
//   };

//   // URLs de connexion par type
//   const LOGIN_URLS = {
//     'admin': `${API_URL}/api/admin/connexion`,
//     'superviseur': `${API_URL}/api/superviseurs/connexion`,
//     'gestionnaire': `${API_URL}/api/gestionnaires/connexion`,
//     'collecteur': `${API_URL}/api/collecteurs/connexion`,
//     'producteur': `${API_URL}/api/auth/connexion`,
//     'recycleur': `${API_URL}/api/recycleurs/connexion`,
//     'sponsor': `${API_URL}/api/sponsors/connexion`,
//     'ong': `${API_URL}/api/ongs/connexion`
//   };

//   // Vérifier si déjà connecté
//   useEffect(() => {
//     const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
//     const role = localStorage.getItem(STORAGE_KEYS.ROLE);
    
//     if (token && role && ROLE_PAGES[role]) {
//       window.location.href = ROLE_PAGES[role];
//     }
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));

//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.identifiant.trim()) {
//       newErrors.identifiant = 'L\'email ou le téléphone est requis';
//     } else if (formData.identifiant.includes('@') && !/\S+@\S+\.\S+/.test(formData.identifiant)) {
//       newErrors.identifiant = 'L\'email n\'est pas valide';
//     }

//     if (!formData.motDePasse) {
//       newErrors.motDePasse = 'Le mot de passe est requis';
//     }

//     if (!userType) {
//       newErrors.userType = 'Veuillez sélectionner votre type de compte';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const saveAuthData = (token, user, role) => {
//     try {
//       localStorage.setItem(STORAGE_KEYS.TOKEN, token);
//       localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
//       localStorage.setItem(STORAGE_KEYS.ROLE, role);
      
//       if (formData.rememberMe) {
//         localStorage.setItem('ecocollect_remember', 'true');
//       }
      
//       console.log(`✅ Données sauvegardées pour ${role}:`, user?.nomComplet || user?.email);
//       return true;
//     } catch (error) {
//       console.error('❌ Erreur sauvegarde:', error);
//       return false;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;

//     setIsLoading(true);
//     setMessage({ type: 'info', text: 'Connexion en cours...' });

//     try {
//       const url = LOGIN_URLS[userType];
//       console.log(`🔍 Tentative de connexion ${userType}...`);
//       console.log(`📡 URL: ${url}`);

//       const response = await fetch(url, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           identifiant: formData.identifiant, 
//           motDePasse: formData.motDePasse,
//           ...(userType === 'admin' && { email: formData.identifiant }) // Pour admin qui utilise 'email' au lieu de 'identifiant'
//         })
//       });

//       console.log(`📊 Réponse status:`, response.status);
//       const data = await response.json();
//       console.log(`📦 Données reçues:`, data);

//       if (response.ok && data.token) {
//         // Extraire les données utilisateur selon le type
//         let userData;
//         switch(userType) {
//           case 'admin':
//             userData = data.utilisateur || data.admin;
//             break;
//           case 'superviseur':
//             userData = data.superviseur || data.utilisateur;
//             break;
//           case 'gestionnaire':
//             userData = data.utilisateur || data.gestionnaire;
//             break;
//           case 'collecteur':
//             userData = data.collecteur || data.utilisateur;
//             break;
//           case 'ong':
//             userData = data.ong || data.utilisateur;
//             break;
//           case 'sponsor':
//             userData = data.sponsor || data.utilisateur;
//             break;
//           case 'producteur':
//             userData = data.producteur || data.utilisateur || data;
//             break;
//           default:
//             userData = data.utilisateur || data[userType] || data;
//         }

//         console.log(`✅ Connexion ${userType} réussie!`);
        
//         if (saveAuthData(data.token, userData, userType)) {
//           setMessage({ type: 'success', text: `Connexion ${userType} réussie ! Redirection...` });
//           setTimeout(() => window.location.href = ROLE_PAGES[userType], 1500);
//         }
//       } else {
//         throw new Error(data.message || 'Identifiants incorrects');
//       }

//     } catch (error) {
//       console.error('❌ Erreur connexion:', error);
//       setMessage({ 
//         type: 'error', 
//         text: error.message || 'Erreur de connexion au serveur' 
//       });
      
//       localStorage.removeItem(STORAGE_KEYS.TOKEN);
//       localStorage.removeItem(STORAGE_KEYS.USER);
//       localStorage.removeItem(STORAGE_KEYS.ROLE);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const isEmail = (contact) => contact.includes('@');

//   // Styles (gardez les mêmes)
  
//   const styles = `
//     @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap');

//     * { margin: 0; padding: 0; box-sizing: border-box; }

//     :root {
//       --background: #f8faf8;
//       --foreground: #1a1e1a;
//       --card: #ffffff;
//       --card-foreground: #1a1e1a;
//       --primary: #2d8a5e;
//       --primary-foreground: #ffffff;
//       --secondary: #e8f3e8;
//       --secondary-foreground: #1a5c3a;
//       --muted: #f0f3f0;
//       --muted-foreground: #5a655a;
//       --accent: #e0a020;
//       --accent-foreground: #3d2d06;
//       --destructive: #dc2626;
//       --border: #d9e0d9;
//       --ring: #2d8a5e;
//       --radius: 0.75rem;
//       --radius-lg: 1.25rem;
//       --radius-xl: 1.75rem;
//       --shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.05);
//       --shadow-lg: 0 10px 40px -8px rgba(0, 0, 0, 0.08);
//       --shadow-colored: 0 4px 20px -4px rgba(45, 138, 94, 0.15);
      
//       --ff-head: 'DM Serif Display', Georgia, serif;
//       --ff-body: 'Outfit', sans-serif;
      
//       --ease: cubic-bezier(.4,0,.2,1);
//       --spring: cubic-bezier(.34,1.56,.64,1);
//     }

//     body {
//       font-family: var(--ff-body);
//       background: var(--background);
//       color: var(--foreground);
//       min-height: 100vh;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       padding: 1rem;
//       position: relative;
//     }

//     body::before {
//       content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
//       background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
//       opacity:.015;
//     }

//     .ambient {
//       position:fixed; pointer-events:none; z-index:0;
//       border-radius:50%; filter:blur(100px);
//     }

//     .ambient-1 { 
//       width:600px; height:400px; top:0; left:50%; transform:translateX(-50%);
//       background:radial-gradient(ellipse, rgba(45,138,94,0.03) 0%, transparent 70%); 
//     }

//     .ambient-2 { 
//       width:400px; height:300px; bottom:10%; right:5%;
//       background:radial-gradient(ellipse, rgba(45,138,94,0.02) 0%, transparent 70%); 
//     }

//     .login-container {
//       max-width: 450px;
//       width: 100%;
//       background: var(--card);
//       border-radius: var(--radius-xl);
//       padding: 2.5rem;
//       border: 1px solid var(--border);
//       box-shadow: var(--shadow-lg);
//       animation: fadeIn 0.5s var(--spring) both;
//       position: relative;
//       z-index: 1;
//     }

//     @keyframes fadeIn {
//       from { opacity: 0; transform: translateY(24px); }
//       to { opacity: 1; transform: translateY(0); }
//     }

//     .logo {
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       gap: 0.75rem;
//       margin-bottom: 2rem;
//       text-decoration: none;
//     }

//     .logo-img {
//       height: 70px;
//       width: auto;
//       border-radius: 15px;
//       transition: transform 0.3s var(--spring);
//     }

//     .logo-img:hover {
//       transform: scale(1.05);
//     }

//     .logo-text {
//       font-size: 1.8rem;
//       font-weight: 800;
//       color: var(--foreground);
//     }

//     .logo-text span {
//       color: var(--primary);
//     }

//     h1 {
//       font-family: var(--ff-head);
//       text-align: center;
//       margin-bottom: 2rem;
//       font-size: 1.8rem;
//       font-weight: 600;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       gap: 0.5rem;
//       color: var(--foreground);
//     }

//     h1 em {
//       color: var(--primary);
//       font-style: italic;
//     }

//     .form-group {
//       margin-bottom: 1.5rem;
//     }

//     label {
//       display: block;
//       margin-bottom: 0.5rem;
//       font-size: 0.9rem;
//       font-weight: 600;
//       color: var(--foreground);
//       letter-spacing: 0.02em;
//     }

//     label i {
//       color: var(--primary);
//       margin-right: 0.5rem;
//     }

//     .input-wrap {
//       position: relative;
//     }

//     .input-icon {
//       position: absolute;
//       left: 1rem;
//       top: 50%;
//       transform: translateY(-50%);
//       color: var(--muted-foreground);
//       font-size: 1rem;
//     }

//     input {
//       width: 100%;
//       padding: 0.9rem 1rem 0.9rem 2.5rem;
//       border-radius: var(--radius);
//       background: var(--muted);
//       border: 1.5px solid var(--border);
//       color: var(--foreground);
//       font-size: 0.95rem;
//       font-family: var(--ff-body);
//       transition: all 0.2s var(--ease);
//       outline: none;
//     }

//     input:focus {
//       border-color: var(--ring);
//       box-shadow: 0 0 0 3px rgba(45, 138, 94, 0.1);
//     }

//     input.error {
//       border-color: var(--destructive);
//     }

//     .toggle-password {
//       position: absolute;
//       right: 1rem;
//       top: 50%;
//       transform: translateY(-50%);
//       background: none;
//       border: none;
//       cursor: pointer;
//       color: var(--muted-foreground);
//       font-size: 1.1rem;
//       transition: color 0.2s;
//     }

//     .toggle-password:hover {
//       color: var(--primary);
//     }

//     .error-text {
//       color: var(--destructive);
//       font-size: 0.75rem;
//       margin-top: 0.25rem;
//       font-weight: 500;
//     }

//     .checkbox-group {
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       margin: 1.5rem 0;
//     }

//     .checkbox-label {
//       display: flex;
//       align-items: center;
//       gap: 0.5rem;
//       cursor: pointer;
//       color: var(--foreground);
//       font-size: 0.9rem;
//     }

//     .checkbox-label input[type="checkbox"] {
//       width: 18px;
//       height: 18px;
//       accent-color: var(--primary);
//       cursor: pointer;
//     }

//     .forgot-link {
//       color: var(--primary);
//       text-decoration: none;
//       font-size: 0.9rem;
//       font-weight: 600;
//       transition: color 0.2s;
//     }

//     .forgot-link:hover {
//       text-decoration: underline;
//     }

//     .btn {
//       width: 100%;
//       padding: 1rem;
//       border: none;
//       border-radius: 100px;
//       cursor: pointer;
//       font-family: var(--ff-body);
//       font-weight: 700;
//       font-size: 1rem;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       gap: 0.75rem;
//       transition: all 0.3s var(--spring);
//       background: var(--primary);
//       color: white;
//       box-shadow: 0 4px 15px rgba(45, 138, 94, 0.2);
//     }

//     .btn:hover:not(:disabled) {
//       transform: translateY(-3px);
//       box-shadow: 0 8px 25px rgba(45, 138, 94, 0.3);
//     }

//     .btn:disabled {
//       opacity: 0.6;
//       cursor: not-allowed;
//     }

//     .btn i {
//       font-size: 1rem;
//     }

//     .btn svg {
//       transition: transform 0.3s var(--spring);
//     }

//     .btn:hover svg {
//       transform: translateX(4px);
//     }

//     .spinner {
//       width: 1.2rem;
//       height: 1.2rem;
//       border: 2px solid rgba(255, 255, 255, 0.3);
//       border-radius: 50%;
//       border-top-color: white;
//       animation: spin 0.8s linear infinite;
//     }

//     @keyframes spin {
//       to { transform: rotate(360deg); }
//     }

//     .message {
//       padding: 1rem;
//       margin-top: 1rem;
//       border-radius: var(--radius);
//       font-size: 0.9rem;
//       display: flex;
//       align-items: center;
//       gap: 0.5rem;
//       animation: slideIn 0.3s var(--ease);
//     }

//     @keyframes slideIn {
//       from { opacity: 0; transform: translateY(-10px); }
//       to { opacity: 1; transform: translateY(0); }
//     }

//     .message.success {
//       background: var(--secondary);
//       color: var(--secondary-foreground);
//       border: 1px solid var(--primary);
//     }

//     .message.error {
//       background: rgba(220, 38, 38, 0.1);
//       color: var(--destructive);
//       border: 1px solid var(--destructive);
//     }

//     .message.info {
//       background: rgba(45, 138, 94, 0.05);
//       color: var(--primary);
//       border: 1px solid var(--primary);
//     }

//     .links {
//       text-align: center;
//       margin-top: 1.5rem;
//       font-size: 0.9rem;
//       color: var(--muted-foreground);
//     }

//     .links a {
//       color: var(--primary);
//       text-decoration: none;
//       font-weight: 600;
//       transition: color 0.2s;
//     }

//     .links a:hover {
//       text-decoration: underline;
//     }

//     .back-home {
//       display: inline-flex;
//       align-items: center;
//       gap: 0.5rem;
//       margin-top: 1rem;
//       color: var(--muted-foreground);
//       text-decoration: none;
//       font-size: 0.9rem;
//       transition: all 0.2s;
//     }

//     .back-home:hover {
//       color: var(--primary);
//       transform: translateX(-3px);
//     }

//     .divider {
//       height: 1px;
//       background: linear-gradient(90deg, transparent, var(--border), transparent);
//       margin: 2rem 0;
//     }

//     @media (max-width: 480px) {
//       .login-container {
//         padding: 2rem 1.5rem;
//       }
      
//       .logo-img {
//         height: 60px;
//       }
//     }
//   `;

//   return (
//     <>
//       <style>{styles}</style>
      
//       <div className="ambient ambient-1"></div>
//       <div className="ambient ambient-2"></div>

//       <div className="login-container">
//         <a href="/" className="logo">
//           <img src={logo} alt="EcoCollect" className="logo-img" />
//         </a>

//         <h1>
//           <em>Connexion</em>
//         </h1>

//         <form onSubmit={handleSubmit}>
//           {/* Sélecteur de type de compte */}
//           <div className="form-group">
//             <label>
//               <i className="fas fa-user-tag"></i>
//               Type de compte
//             </label>
//             <select
//               value={userType}
//               onChange={(e) => setUserType(e.target.value)}
//               className={errors.userType ? 'error' : ''}
//               style={{
//                 width: '100%',
//                 padding: '0.9rem 1rem',
//                 borderRadius: 'var(--radius)',
//                 background: 'var(--muted)',
//                 border: '1.5px solid var(--border)',
//                 color: 'var(--foreground)',
//                 fontSize: '0.95rem',
//                 outline: 'none'
//               }}
//             >
//               <option value="">Sélectionnez votre type de compte</option>
//               <option value="admin">Administrateur</option>
//               <option value="superviseur">Superviseur</option>
//               <option value="gestionnaire">Gestionnaire</option>
//               <option value="collecteur">Collecteur</option>
//               <option value="producteur">Producteur</option>
//               <option value="recycleur">Recycleur</option>
//               <option value="sponsor">Sponsor</option>
//               <option value="ong">ONG</option>
//             </select>
//             {errors.userType && <div className="error-text">{errors.userType}</div>}
//           </div>

//           <div className="form-group">
//             <label>
//               <i className="fas fa-envelope"></i>
//               Email ou Téléphone
//             </label>
//             <div className="input-wrap">
//               <i className={`fas ${isEmail(formData.identifiant) ? 'fa-envelope' : 'fa-phone'} input-icon`}></i>
//               <input
//                 type="text"
//                 name="identifiant"
//                 value={formData.identifiant}
//                 onChange={handleInputChange}
//                 className={errors.identifiant ? 'error' : ''}
//                 placeholder="votre@email.com"
//               />
//             </div>
//             {errors.identifiant && <div className="error-text">{errors.identifiant}</div>}
//           </div>

//           <div className="form-group">
//             <label>
//               <i className="fas fa-lock"></i>
//               Mot de passe
//             </label>
//             <div className="input-wrap">
//               <i className="fas fa-lock input-icon"></i>
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 name="motDePasse"
//                 value={formData.motDePasse}
//                 onChange={handleInputChange}
//                 className={errors.motDePasse ? 'error' : ''}
//                 placeholder="••••••••"
//               />
//               <button
//                 type="button"
//                 className="toggle-password"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
//               </button>
//             </div>
//             {errors.motDePasse && <div className="error-text">{errors.motDePasse}</div>}
//           </div>

//           <div className="checkbox-group">
//             <label className="checkbox-label">
//               <input
//                 type="checkbox"
//                 name="rememberMe"
//                 checked={formData.rememberMe}
//                 onChange={handleInputChange}
//               />
//               Se souvenir de moi
//             </label>
//             <a href="/forgot-password" className="forgot-link">
//               Mot de passe oublié ?
//             </a>
//           </div>

//           {message.text && (
//             <div className={`message ${message.type}`}>
//               <i className={`fas ${
//                 message.type === 'success' ? 'fa-check-circle' :
//                 message.type === 'error' ? 'fa-exclamation-circle' :
//                 'fa-info-circle'
//               }`}></i>
//               {message.text}
//             </div>
//           )}

//           <button type="submit" className="btn" disabled={isLoading}>
//             {isLoading ? (
//               <>
//                 <div className="spinner"></div>
//                 Connexion en cours...
//               </>
//             ) : (
//               <>
//                 <i className="fas fa-sign-in-alt"></i>
//                 Se connecter
//               </>
//             )}
//           </button>
//         </form>

//         <div className="links">
//           <p>
//             Pas encore de compte ? <a href="/register">S'inscrire</a>
//           </p>
//           <a href="/" className="back-home">
//             <i className="fas fa-arrow-left"></i>
//             Retour à l'accueil
//           </a>
//         </div>
//       </div>

//       <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
//     </>
//   );
// };

// export default Login;



import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.jpeg';

const Login = () => {
  const [formData, setFormData] = useState({
    identifiant: '',
    motDePasse: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Configuration API
  // const API_URL = 'http://localhost:3000';
  const API_URL = 'https://ecobackend-zeds.vercel.app';
  const STORAGE_KEYS = {
    TOKEN: 'ecocollect_token',
    USER: 'ecocollect_user',
    ROLE: 'ecocollect_role'
  };

  // Mapping des rôles vers les pages et endpoints
  const ROLE_CONFIG = {
    'admin': {
      page: '/admin',
      url: `${API_URL}/api/admin/connexion`,
      userField: 'utilisateur',
      emailField: 'email',
      bodyFormat: (identifiant, motDePasse) => ({ email: identifiant, motDePasse })
    },
    'superviseur': {
      page: '/superviseur',
      url: `${API_URL}/api/superviseurs/connexion`,
      userField: 'superviseur',
      emailField: 'email',
      bodyFormat: (identifiant, motDePasse) => ({ identifiant, motDePasse })
    },
    'gestionnaire': {
      page: '/gestionnaire',
      url: `${API_URL}/api/gestionnaires/connexion`,
      userField: 'utilisateur',
      emailField: 'email',
      bodyFormat: (identifiant, motDePasse) => ({ identifiant, motDePasse })
    },
    'collecteur': {
      page: '/collecteur',
      url: `${API_URL}/api/collecteurs/connexion`,
      userField: 'collecteur',
      emailField: 'email',
      bodyFormat: (identifiant, motDePasse) => ({ identifiant, motDePasse })
    },
    'producteur': {
      page: '/producteur',
      url: `${API_URL}/api/auth/connexion`,
      userField: 'producteur',
      emailField: 'email',
      bodyFormat: (identifiant, motDePasse) => ({ identifiant, motDePasse })
    },
    'recycleur': {
      page: '/recycleur',
      url: `${API_URL}/api/recycleurs/connexion`,
      userField: 'recycleur',
      emailField: 'email',
      bodyFormat: (identifiant, motDePasse) => ({ identifiant, motDePasse })
    },
    'sponsor': {
      page: '/sponsor',
      url: `${API_URL}/api/sponsors/connexion`,
      userField: 'sponsor',
      emailField: 'email',
      bodyFormat: (identifiant, motDePasse) => ({ identifiant, motDePasse })
    },
    'ong': {
      page: '/ong',
      url: `${API_URL}/api/ongs/connexion`,
      userField: 'ong',
      emailField: 'email',
      bodyFormat: (identifiant, motDePasse) => ({ identifiant, motDePasse })
    }
  };

  // Ordre de priorité des rôles (les plus spécifiques d'abord)
  const ROLE_PRIORITY = ['admin', 'superviseur', 'gestionnaire', 'collecteur', 'recycleur', 'sponsor', 'ong', 'producteur'];

  // Vérifier si déjà connecté
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const role = localStorage.getItem(STORAGE_KEYS.ROLE);
    
    if (token && role && ROLE_CONFIG[role]) {
      window.location.href = ROLE_CONFIG[role].page;
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.identifiant.trim()) {
      newErrors.identifiant = 'L\'email ou le téléphone est requis';
    } else if (formData.identifiant.includes('@') && !/\S+@\S+\.\S+/.test(formData.identifiant)) {
      newErrors.identifiant = 'L\'email n\'est pas valide';
    }

    if (!formData.motDePasse) {
      newErrors.motDePasse = 'Le mot de passe est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveAuthData = (token, user, role) => {
    try {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.ROLE, role);
      
      if (formData.rememberMe) {
        localStorage.setItem('ecocollect_remember', 'true');
      }
      
      console.log(`✅ Données sauvegardées pour ${role}:`, user);
      return true;
    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error);
      return false;
    }
  };

  // Fonction pour extraire le token et l'utilisateur selon la structure de réponse
  const extractAuthData = (data, role) => {
    let token = null;
    let user = null;

    // Chercher le token dans différentes structures possibles
    if (data.token) {
      token = data.token;
    } else if (data.accessToken) {
      token = data.accessToken;
    } else if (data.access_token) {
      token = data.access_token;
    } else if (data.jwt) {
      token = data.jwt;
    }

    // Chercher l'utilisateur dans différentes structures possibles
    const config = ROLE_CONFIG[role];
    if (config && data[config.userField]) {
      user = data[config.userField];
    } else if (data.utilisateur) {
      user = data.utilisateur;
    } else if (data.user) {
      user = data.user;
    } else if (data[role]) {
      user = data[role];
    } else if (data.data && data.data.user) {
      user = data.data.user;
    } else if (typeof data === 'object' && !data.token) {
      // Si la réponse est directement l'utilisateur
      user = data;
    }

    return { token, user };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage({ type: 'info', text: 'Connexion en cours...' });

    let lastError = null;
    let success = false;

    // Essayer les endpoints dans l'ordre de priorité
    for (const role of ROLE_PRIORITY) {
      if (success) break;
      
      const config = ROLE_CONFIG[role];
      
      try {
        console.log(`🔍 Tentative de connexion en tant que ${role}...`);
        console.log(`📡 URL: ${config.url}`);

        const response = await fetch(config.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config.bodyFormat(formData.identifiant, formData.motDePasse))
        });

        console.log(`📊 Réponse ${role} status:`, response.status);
        
        // Si la réponse est 404, cet endpoint n'existe pas
        if (response.status === 404) {
          console.log(`⚠️ Endpoint ${role} non trouvé`);
          continue;
        }

        // Si la réponse est 401, identifiants incorrects pour ce rôle
        if (response.status === 401) {
          console.log(`⚠️ Identifiants incorrects pour ${role}`);
          continue;
        }

        const data = await response.json();
        console.log(`📦 Données reçues pour ${role}:`, data);

        if (response.ok) {
          // Extraire le token et l'utilisateur
          const { token, user } = extractAuthData(data, role);
          
          if (token) {
            console.log(`✅ Connexion réussie en tant que ${role}!`);
            
            if (saveAuthData(token, user, role)) {
              setMessage({ 
                type: 'success', 
                text: `Connexion réussie ! Redirection vers votre espace ${role}...` 
              });
              
              success = true;
              setTimeout(() => window.location.href = config.page, 1500);
              break;
            }
          } else {
            console.log(`⚠️ Token manquant pour ${role}, structure:`, Object.keys(data));
          }
        }

      } catch (error) {
        console.log(`❌ Erreur pour ${role}:`, error.message);
        lastError = error;
      }
    }

    // Si aucun endpoint n'a fonctionné
    if (!success) {
      console.error('❌ Toutes les tentatives ont échoué');
      setMessage({ 
        type: 'error', 
        text: lastError?.message || 'Identifiants incorrects ou compte non trouvé' 
      });
      
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.ROLE);
      setIsLoading(false);
    }
  };

  const isEmail = (contact) => contact.includes('@');

 const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --background: #f8faf8;
      --foreground: #1a1e1a;
      --card: #ffffff;
      --card-foreground: #1a1e1a;
      --primary: #2d8a5e;
      --primary-foreground: #ffffff;
      --secondary: #e8f3e8;
      --secondary-foreground: #1a5c3a;
      --muted: #f0f3f0;
      --muted-foreground: #5a655a;
      --accent: #e0a020;
      --accent-foreground: #3d2d06;
      --destructive: #dc2626;
      --border: #d9e0d9;
      --ring: #2d8a5e;
      --radius: 0.75rem;
      --radius-lg: 1.25rem;
      --radius-xl: 1.75rem;
      --shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.05);
      --shadow-lg: 0 10px 40px -8px rgba(0, 0, 0, 0.08);
      --shadow-colored: 0 4px 20px -4px rgba(45, 138, 94, 0.15);
      
      --ff-head: 'DM Serif Display', Georgia, serif;
      --ff-body: 'Outfit', sans-serif;
      
      --ease: cubic-bezier(.4,0,.2,1);
      --spring: cubic-bezier(.34,1.56,.64,1);
    }

    body {
      font-family: var(--ff-body);
      background: var(--background);
      color: var(--foreground);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      position: relative;
    }

    body::before {
      content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
      background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
      opacity:.015;
    }

    .ambient {
      position:fixed; pointer-events:none; z-index:0;
      border-radius:50%; filter:blur(100px);
    }

    .ambient-1 { 
      width:600px; height:400px; top:0; left:50%; transform:translateX(-50%);
      background:radial-gradient(ellipse, rgba(45,138,94,0.03) 0%, transparent 70%); 
    }

    .ambient-2 { 
      width:400px; height:300px; bottom:10%; right:5%;
      background:radial-gradient(ellipse, rgba(45,138,94,0.02) 0%, transparent 70%); 
    }

    .login-container {
      max-width: 450px;
      width: 100%;
      background: var(--card);
      border-radius: var(--radius-xl);
      padding: 2.5rem;
      border: 1px solid var(--border);
      box-shadow: var(--shadow-lg);
      animation: fadeIn 0.5s var(--spring) both;
      position: relative;
      z-index: 1;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 2rem;
      text-decoration: none;
    }

    .logo-img {
      height: 70px;
      width: auto;
      border-radius: 15px;
      transition: transform 0.3s var(--spring);
    }

    .logo-img:hover {
      transform: scale(1.05);
    }

    .logo-text {
      font-size: 1.8rem;
      font-weight: 800;
      color: var(--foreground);
    }

    .logo-text span {
      color: var(--primary);
    }

    h1 {
      font-family: var(--ff-head);
      text-align: center;
      margin-bottom: 2rem;
      font-size: 1.8rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      color: var(--foreground);
    }

    h1 em {
      color: var(--primary);
      font-style: italic;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--foreground);
      letter-spacing: 0.02em;
    }

    label i {
      color: var(--primary);
      margin-right: 0.5rem;
    }

    .input-wrap {
      position: relative;
    }

    .input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--muted-foreground);
      font-size: 1rem;
    }

    input {
      width: 100%;
      padding: 0.9rem 1rem 0.9rem 2.5rem;
      border-radius: var(--radius);
      background: var(--muted);
      border: 1.5px solid var(--border);
      color: var(--foreground);
      font-size: 0.95rem;
      font-family: var(--ff-body);
      transition: all 0.2s var(--ease);
      outline: none;
    }

    input:focus {
      border-color: var(--ring);
      box-shadow: 0 0 0 3px rgba(45, 138, 94, 0.1);
    }

    input.error {
      border-color: var(--destructive);
    }

    .toggle-password {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      color: var(--muted-foreground);
      font-size: 1.1rem;
      transition: color 0.2s;
    }

    .toggle-password:hover {
      color: var(--primary);
    }

    .error-text {
      color: var(--destructive);
      font-size: 0.75rem;
      margin-top: 0.25rem;
      font-weight: 500;
    }

    .checkbox-group {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 1.5rem 0;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      color: var(--foreground);
      font-size: 0.9rem;
    }

    .checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: var(--primary);
      cursor: pointer;
    }

    .forgot-link {
      color: var(--primary);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 600;
      transition: color 0.2s;
    }

    .forgot-link:hover {
      text-decoration: underline;
    }

    .btn {
      width: 100%;
      padding: 1rem;
      border: none;
      border-radius: 100px;
      cursor: pointer;
      font-family: var(--ff-body);
      font-weight: 700;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      transition: all 0.3s var(--spring);
      background: var(--primary);
      color: white;
      box-shadow: 0 4px 15px rgba(45, 138, 94, 0.2);
    }

    .btn:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(45, 138, 94, 0.3);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn i {
      font-size: 1rem;
    }

    .btn svg {
      transition: transform 0.3s var(--spring);
    }

    .btn:hover svg {
      transform: translateX(4px);
    }

    .spinner {
      width: 1.2rem;
      height: 1.2rem;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .message {
      padding: 1rem;
      margin-top: 1rem;
      border-radius: var(--radius);
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      animation: slideIn 0.3s var(--ease);
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .message.success {
      background: var(--secondary);
      color: var(--secondary-foreground);
      border: 1px solid var(--primary);
    }

    .message.error {
      background: rgba(220, 38, 38, 0.1);
      color: var(--destructive);
      border: 1px solid var(--destructive);
    }

    .message.info {
      background: rgba(45, 138, 94, 0.05);
      color: var(--primary);
      border: 1px solid var(--primary);
    }

    .links {
      text-align: center;
      margin-top: 1.5rem;
      font-size: 0.9rem;
      color: var(--muted-foreground);
    }

    .links a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s;
    }

    .links a:hover {
      text-decoration: underline;
    }

    .back-home {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1rem;
      color: var(--muted-foreground);
      text-decoration: none;
      font-size: 0.9rem;
      transition: all 0.2s;
    }

    .back-home:hover {
      color: var(--primary);
      transform: translateX(-3px);
    }

    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--border), transparent);
      margin: 2rem 0;
    }

    @media (max-width: 480px) {
      .login-container {
        padding: 2rem 1.5rem;
      }
      
      .logo-img {
        height: 60px;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      
      <div className="ambient ambient-1"></div>
      <div className="ambient ambient-2"></div>

      <div className="login-container">
        <a href="/" className="logo">
          <img src={logo} alt="EcoCollect" className="logo-img" />
        </a>

        <h1>
          <em>Connexion</em>
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <i className="fas fa-envelope"></i>
              Email ou Téléphone
            </label>
            <div className="input-wrap">
              <i className={`fas ${isEmail(formData.identifiant) ? 'fa-envelope' : 'fa-phone'} input-icon`}></i>
              <input
                type="text"
                name="identifiant"
                value={formData.identifiant}
                onChange={handleInputChange}
                className={errors.identifiant ? 'error' : ''}
                placeholder="votre@email.com"
              />
            </div>
            {errors.identifiant && <div className="error-text">{errors.identifiant}</div>}
          </div>

          <div className="form-group">
            <label>
              <i className="fas fa-lock"></i>
              Mot de passe
            </label>
            <div className="input-wrap">
              <i className="fas fa-lock input-icon"></i>
              <input
                type={showPassword ? 'text' : 'password'}
                name="motDePasse"
                value={formData.motDePasse}
                onChange={handleInputChange}
                className={errors.motDePasse ? 'error' : ''}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {errors.motDePasse && <div className="error-text">{errors.motDePasse}</div>}
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
              />
              Se souvenir de moi
            </label>
            <a href="/forgot-password" className="forgot-link">
              Mot de passe oublié ?
            </a>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              <i className={`fas ${
                message.type === 'success' ? 'fa-check-circle' :
                message.type === 'error' ? 'fa-exclamation-circle' :
                'fa-info-circle'
              }`}></i>
              {message.text}
            </div>
          )}

          <button type="submit" className="btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Connexion en cours...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i>
                Se connecter
              </>
            )}
          </button>
        </form>

        <div className="links">
          <p>
            Pas encore de compte ? <a href="/register">S'inscrire</a>
          </p>
          <a href="/" className="back-home">
            <i className="fas fa-arrow-left"></i>
            Retour à l'accueil
          </a>
        </div>
      </div>

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </>
  );
};

export default Login;