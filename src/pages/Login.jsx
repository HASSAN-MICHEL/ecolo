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
  // ANCIENNE API const API_URL = 'https://ecobackend-7tuh.vercel.app';

   const API_URL = 'https://ecobackend-y6nd.vercel.app';
  // const API_URL = 'http://localhost:3000';
  const STORAGE_KEYS = {
    TOKEN: 'ecocollect_token',
    USER: 'ecocollect_user',
    ROLE: 'ecocollect_role'
  };

  // Mapping des rôles vers les pages
  const ROLE_PAGES = {
    'producteur': '/producteur',
    'collecteur': '/collecteur',
    'gestionnaire': '/gestionnaire',
    'superviseur': '/superviseur',
    'admin': '/admin'
  };

  // Vérifier si déjà connecté
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const role = localStorage.getItem(STORAGE_KEYS.ROLE);
    
    if (token && role && ROLE_PAGES[role]) {
      window.location.href = ROLE_PAGES[role];
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
      
      console.log(`✅ Données sauvegardées pour ${role}:`, user?.nomComplet || user?.email);
      return true;
    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error);
      return false;
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
    
  //   if (!validateForm()) return;

  //   setIsLoading(true);
  //   setMessage({ type: 'info', text: 'Connexion en cours...' });

  //   try {
  //     // ===== 1. ESSAYER PRODUCTEUR =====
  //     try {
  //       const prodResponse = await fetch(`${API_URL}/api/auth/connexion`, {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ 
  //           identifiant: formData.identifiant, 
  //           motDePasse: formData.motDePasse 
  //         })
  //       });
        
  //       const prodData = await prodResponse.json();
        
  //       if (prodResponse.ok && prodData.token) {
  //         const userData = prodData.producteur || prodData.user || prodData.utilisateur || prodData;
          
  //         if (saveAuthData(prodData.token, userData, 'producteur')) {
  //           setMessage({ type: 'success', text: 'Connexion producteur réussie ! Redirection...' });
  //           setTimeout(() => window.location.href = ROLE_PAGES['producteur'], 1500);
  //           return;
  //         }
  //       }
  //     } catch (prodError) {
  //       console.log('Producteur non trouvé ou erreur:', prodError.message);
  //     }
      
  //     // ===== 2. ESSAYER COLLECTEUR =====
  //     try {
  //       const colResponse = await fetch(`${API_URL}/api/collecteurs/connexion`, {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ 
  //           identifiant: formData.identifiant, 
  //           motDePasse: formData.motDePasse 
  //         })
  //       });
        
  //       const colData = await colResponse.json();
        
  //       if (colResponse.ok && colData.success && colData.token) {
  //         if (saveAuthData(colData.token, colData.collecteur, 'collecteur')) {
  //           setMessage({ type: 'success', text: 'Connexion collecteur réussie ! Redirection...' });
  //           setTimeout(() => window.location.href = ROLE_PAGES['collecteur'], 1500);
  //           return;
  //         }
  //       }
  //     } catch (colError) {
  //       console.log('Collecteur non trouvé ou erreur:', colError.message);
  //     }
      
  //     // ===== 3. ESSAYER GESTIONNAIRE =====
  //     try {
  //       const gestResponse = await fetch(`${API_URL}/api/gestionnaires/connexion`, {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ 
  //           identifiant: formData.identifiant, 
  //           motDePasse: formData.motDePasse 
  //         })
  //       });
        
  //       const gestData = await gestResponse.json();
        
  //       if (gestResponse.ok && gestData.success && gestData.token) {
  //         if (saveAuthData(gestData.token, gestData.utilisateur, 'gestionnaire')) {
  //           setMessage({ type: 'success', text: 'Connexion gestionnaire réussie ! Redirection...' });
  //           setTimeout(() => window.location.href = ROLE_PAGES['gestionnaire'], 1500);
  //           return;
  //         }
  //       }
  //     } catch (gestError) {
  //       console.log('Gestionnaire non trouvé ou erreur:', gestError.message);
  //     }
      
  //     // ===== 4. ESSAYER SUPERVISEUR =====
  //     try {
  //       const supResponse = await fetch(`${API_URL}/api/superviseurs/connexion`, {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ 
  //           identifiant: formData.identifiant, 
  //           motDePasse: formData.motDePasse 
  //         })
  //       });
        
  //       const supData = await supResponse.json();
        
  //       if (supResponse.ok && supData.success && supData.token) {
  //         if (saveAuthData(supData.token, supData.superviseur, 'superviseur')) {
  //           setMessage({ type: 'success', text: 'Connexion superviseur réussie ! Redirection...' });
  //           setTimeout(() => window.location.href = ROLE_PAGES['superviseur'], 1500);
  //           return;
  //         }
  //       }
  //     } catch (supError) {
  //       console.log('Superviseur non trouvé ou erreur:', supError.message);
  //     }
      
  //     // ===== 5. ESSAYER ADMIN =====
  //     try {
  //       const adminResponse = await fetch(`${API_URL}/api/admin/connexion`, {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ 
  //           identifiant: formData.identifiant, 
  //           motDePasse: formData.motDePasse 
  //         })
  //       });
        
  //       const adminData = await adminResponse.json();
        
  //       if (adminResponse.ok && adminData.token) {
  //         if (saveAuthData(adminData.token, adminData.admin, 'admin')) {
  //           setMessage({ type: 'success', text: 'Connexion admin réussie ! Redirection...' });
  //           setTimeout(() => window.location.href = ROLE_PAGES['admin'], 1500);
  //           return;
  //         }
  //       }
  //     } catch (adminError) {
  //       console.log('Admin non trouvé ou erreur:', adminError.message);
  //     }
      
  //     // ===== AUCUNE CONNEXION RÉUSSIE =====
  //     throw new Error('Identifiants incorrects ou compte inexistant');
      
  //   } catch (error) {
  //     console.error('❌ Erreur connexion:', error);
  //     setMessage({ 
  //       type: 'error', 
  //       text: error.message || 'Erreur de connexion au serveur' 
  //     });
      
  //     localStorage.removeItem(STORAGE_KEYS.TOKEN);
  //     localStorage.removeItem(STORAGE_KEYS.USER);
  //     localStorage.removeItem(STORAGE_KEYS.ROLE);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;

  setIsLoading(true);
  setMessage({ type: 'info', text: 'Connexion en cours...' });

  try {
    // ===== 1. ESSAYER COLLECTEUR EN PREMIER =====
    console.log('🔍 Tentative de connexion collecteur...');
    try {
      const colResponse = await fetch(`${API_URL}/api/collecteurs/connexion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          identifiant: formData.identifiant, 
          motDePasse: formData.motDePasse 
        })
      });
      
      console.log('📊 Réponse collecteur status:', colResponse.status);
      const colData = await colResponse.json();
      console.log('📦 Données collecteur:', colData);
      
      if (colResponse.ok && colData.success && colData.token) {
        console.log('✅ Connexion collecteur réussie!');
        if (saveAuthData(colData.token, colData.collecteur, 'collecteur')) {
          setMessage({ type: 'success', text: 'Connexion collecteur réussie ! Redirection...' });
          setTimeout(() => window.location.href = ROLE_PAGES['collecteur'], 1500);
          return;
        }
      }
    } catch (colError) {
      console.log('❌ Erreur collecteur:', colError.message);
    }
    
    // ===== 2. ESSAYER GESTIONNAIRE =====
    console.log('🔍 Tentative de connexion gestionnaire...');
    try {
      const gestResponse = await fetch(`${API_URL}/api/gestionnaires/connexion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          identifiant: formData.identifiant, 
          motDePasse: formData.motDePasse 
        })
      });
      
      console.log('📊 Réponse gestionnaire status:', gestResponse.status);
      const gestData = await gestResponse.json();
      
      if (gestResponse.ok && gestData.success && gestData.token) {
        console.log('✅ Connexion gestionnaire réussie!');
        if (saveAuthData(gestData.token, gestData.utilisateur, 'gestionnaire')) {
          setMessage({ type: 'success', text: 'Connexion gestionnaire réussie ! Redirection...' });
          setTimeout(() => window.location.href = ROLE_PAGES['gestionnaire'], 1500);
          return;
        }
      }
    } catch (gestError) {
      console.log('❌ Erreur gestionnaire:', gestError.message);
    }
    
    // ===== 3. ESSAYER SUPERVISEUR =====
    console.log('🔍 Tentative de connexion superviseur...');
    try {
      const supResponse = await fetch(`${API_URL}/api/superviseurs/connexion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          identifiant: formData.identifiant, 
          motDePasse: formData.motDePasse 
        })
      });
      
      console.log('📊 Réponse superviseur status:', supResponse.status);
      const supData = await supResponse.json();
      
      if (supResponse.ok && supData.success && supData.token) {
        console.log('✅ Connexion superviseur réussie!');
        if (saveAuthData(supData.token, supData.superviseur, 'superviseur')) {
          setMessage({ type: 'success', text: 'Connexion superviseur réussie ! Redirection...' });
          setTimeout(() => window.location.href = ROLE_PAGES['superviseur'], 1500);
          return;
        }
      }
    } catch (supError) {
      console.log('❌ Erreur superviseur:', supError.message);
    }
    
    // ===== 4. ESSAYER PRODUCTEUR EN DERNIER =====
    console.log('🔍 Tentative de connexion producteur...');
    try {
      const prodResponse = await fetch(`${API_URL}/api/auth/connexion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          identifiant: formData.identifiant, 
          motDePasse: formData.motDePasse 
        })
      });
      
      console.log('📊 Réponse producteur status:', prodResponse.status);
      const prodData = await prodResponse.json();
      
      if (prodResponse.ok && prodData.token) {
        const userData = prodData.producteur || prodData.user || prodData.utilisateur || prodData;
        console.log('✅ Connexion producteur réussie!');
        
        if (saveAuthData(prodData.token, userData, 'producteur')) {
          setMessage({ type: 'success', text: 'Connexion producteur réussie ! Redirection...' });
          setTimeout(() => window.location.href = ROLE_PAGES['producteur'], 1500);
          return;
        }
      }
    } catch (prodError) {
      console.log('❌ Erreur producteur:', prodError.message);
    }
    
    // ===== 5. ESSAYER ADMIN =====
    console.log('🔍 Tentative de connexion admin...');
    try {
      const adminResponse = await fetch(`${API_URL}/api/admin/connexion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          identifiant: formData.identifiant, 
          motDePasse: formData.motDePasse 
        })
      });
      
      const adminData = await adminResponse.json();
      
      if (adminResponse.ok && adminData.token) {
        console.log('✅ Connexion admin réussie!');
        if (saveAuthData(adminData.token, adminData.admin, 'admin')) {
          setMessage({ type: 'success', text: 'Connexion admin réussie ! Redirection...' });
          setTimeout(() => window.location.href = ROLE_PAGES['admin'], 1500);
          return;
        }
      }
    } catch (adminError) {
      console.log('❌ Erreur admin:', adminError.message);
    }
    
    // ===== AUCUNE CONNEXION RÉUSSIE =====
    throw new Error('Identifiants incorrects ou compte inexistant');
    
  } catch (error) {
    console.error('❌ Erreur connexion:', error);
    setMessage({ 
      type: 'error', 
      text: error.message || 'Erreur de connexion au serveur' 
    });
    
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
  } finally {
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
      
      {/* Éléments ambiants */}
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

      {/* Font Awesome */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </>
  );
};

export default Login;