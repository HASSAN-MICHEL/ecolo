
import { useState } from 'react';
import { Mail, Phone, ArrowLeft, Send } from 'lucide-react';
import logo from '../assets/logo.jpeg';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({ contact: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState({ type: '', text: '' });

  // const API_URL = 'https://ecobackend-y6nd.vercel.app';

  // const API_URL = 'http://localhost:3000';
const API_URL = 'https://ecobackend-zeds.vercel.app';
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (serverMessage.text) setServerMessage({ type: '', text: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.contact.trim()) {
      newErrors.contact = 'L\'email ou le téléphone est requis';
    } else if (formData.contact.includes('@') && !/\S+@\S+\.\S+/.test(formData.contact)) {
      newErrors.contact = 'L\'email n\'est pas valide';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setServerMessage({ type: 'info', text: 'Envoi du code en cours...' });

    try {
      const response = await fetch(`${API_URL}/api/auth/demande-reinitialisation-mdp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.contact })
      });

      const data = await response.json();

      if (data.success) {
        setServerMessage({ type: 'success', text: 'Code envoyé ! Redirection...' });
        sessionStorage.setItem('reset_email', formData.contact);
        setTimeout(() => window.location.href = '/verify-code', 1500);
      } else {
        throw new Error(data.message || 'Erreur lors de la demande');
      }
    } catch (error) {
      setServerMessage({ type: 'error', text: error.message });
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
      --primary: #2d8a5e;
      --secondary: #e8f3e8;
      --secondary-foreground: #1a5c3a;
      --muted: #f0f3f0;
      --muted-foreground: #5a655a;
      --destructive: #dc2626;
      --border: #d9e0d9;
      --ring: #2d8a5e;
      --radius: 0.75rem;
      --radius-xl: 1.75rem;
      --shadow-lg: 0 10px 40px -8px rgba(0, 0, 0, 0.08);
      
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
      content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
      opacity: .015;
    }

    .ambient {
      position: fixed; pointer-events: none; z-index: 0;
      border-radius: 50%; filter: blur(100px);
    }

    .ambient-1 { 
      width: 600px; height: 400px; top: 0; left: 50%; transform: translateX(-50%);
      background: radial-gradient(ellipse, rgba(45,138,94,0.03) 0%, transparent 70%); 
    }

    .ambient-2 { 
      width: 400px; height: 300px; bottom: 10%; right: 5%;
      background: radial-gradient(ellipse, rgba(45,138,94,0.02) 0%, transparent 70%); 
    }

    .auth-container {
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
      margin-bottom: 2rem;
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

    h1 {
      font-family: var(--ff-head);
      text-align: center;
      margin-bottom: 2rem;
      font-size: 2rem;
      color: var(--foreground);
    }

    h1 em {
      color: var(--primary);
      font-style: italic;
    }

    .subtitle {
      text-align: center;
      color: var(--muted-foreground);
      margin-bottom: 2rem;
      line-height: 1.6;
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
    }

    label i, label svg {
      color: var(--primary);
      margin-right: 0.5rem;
      vertical-align: middle;
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

    .error-text {
      color: var(--destructive);
      font-size: 0.75rem;
      margin-top: 0.25rem;
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
    }

    .links a:hover {
      text-decoration: underline;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1rem;
      color: var(--muted-foreground);
      text-decoration: none;
      font-size: 0.9rem;
    }

    .back-link:hover {
      color: var(--primary);
      transform: translateX(-3px);
    }

    .help-box {
      margin-top: 2rem;
      padding: 1rem;
      background: var(--muted);
      border-radius: var(--radius);
      border: 1px solid var(--border);
    }

    .help-box h3 {
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
      color: var(--foreground);
    }

    .help-box ul {
      list-style: none;
      font-size: 0.8rem;
      color: var(--muted-foreground);
    }

    .help-box li {
      margin-bottom: 0.25rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="ambient ambient-1"></div>
      <div className="ambient ambient-2"></div>

      <div className="auth-container">
        <a href="/" className="logo">
          <img src={logo} alt="EcoCollect" className="logo-img" />
        </a>

        <h1>
          <em>Mot de passe oublié</em>
        </h1>

        <p className="subtitle">
          Recevez un code pour réinitialiser votre mot de passe
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              {isEmail(formData.contact) ? <Mail size={16} /> : <Phone size={16} />}
              Email
            </label>
            <div className="input-wrap">
              {isEmail(formData.contact) ? 
                <Mail className="input-icon" size={18} /> : 
                <Phone className="input-icon" size={18} />
              }
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                className={errors.contact ? 'error' : ''}
                placeholder="votre@email.com"
              />
            </div>
            {errors.contact && <div className="error-text">{errors.contact}</div>}
          </div>

          {serverMessage.text && (
            <div className={`message ${serverMessage.type}`}>
              <i className={`fas ${
                serverMessage.type === 'success' ? 'fa-check-circle' :
                serverMessage.type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'
              }`}></i>
              {serverMessage.text}
            </div>
          )}

          <button type="submit" className="btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Envoi en cours...
              </>
            ) : (
              <>
                <Send size={18} />
                Recevoir le code
              </>
            )}
          </button>
        </form>

        <div className="links">
          <a href="/login" className="back-link">
            <ArrowLeft size={16} />
            Retour à la connexion
          </a>
        </div>

        <div className="help-box">
          <h3>Besoin d'aide ?</h3>
          <ul>
            <li><span>•</span> Vérifiez que l'email est bien celui de votre compte</li>
            <li><span>•</span> Le code arrivera dans les 2 minutes maximum</li>
            <li><span>•</span> Contactez le support si vous ne recevez rien</li>
          </ul>
        </div>
      </div>

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </>
  );
};

export default ForgotPassword;