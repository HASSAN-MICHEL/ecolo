// VerifyCode.js
import { useState, useEffect } from 'react';
import { Key, ArrowLeft, CheckCircle, Mail } from 'lucide-react';
import logo from '../assets/logo.jpeg';

const VerifyCode = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState({ type: '', text: '' });
  const [email, setEmail] = useState('');

  // ANCIENNE API : const API_URL = 'https://ecobackend-7tuh.vercel.app';

 const API_URL = 'https://ecobackend-y6nd.vercel.app';
  useEffect(() => {
    const storedEmail = sessionStorage.getItem('reset_email');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      window.location.href = '/forgot-password';
    }
  }, []);

  const handleCodeChange = (index, value) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').split('');
      const newCode = [...code];
      digits.forEach((digit, i) => {
        if (index + i < 6) newCode[index + i] = digit;
      });
      setCode(newCode);
      const nextIndex = Math.min(index + digits.length, 5);
      document.getElementById(`code-${nextIndex}`)?.focus();
    } else {
      const newCode = [...code];
      newCode[index] = value.replace(/\D/g, '');
      setCode(newCode);
      if (value && index < 5) {
        document.getElementById(`code-${index + 1}`)?.focus();
      }
    }
    if (errors.code) setErrors({});
    if (serverMessage.text) setServerMessage({ type: '', text: '' });
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '');
    if (pastedData.length >= 6) {
      const digits = pastedData.slice(0, 6).split('');
      setCode(digits);
      document.getElementById('code-5')?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    
    if (fullCode.length !== 6) {
      setErrors({ code: 'Veuillez entrer les 6 chiffres du code' });
      return;
    }

    setIsLoading(true);
    setServerMessage({ type: 'info', text: 'Vérification du code...' });

    try {
      const response = await fetch(`${API_URL}/api/auth/verifier-code-reinitialisation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: fullCode })
      });

      const data = await response.json();

      if (data.success) {
        setServerMessage({ type: 'success', text: 'Code valide ! Redirection...' });
        sessionStorage.setItem('reset_code', fullCode);
        setTimeout(() => window.location.href = '/reset-password', 1500);
      } else {
        throw new Error(data.message || 'Code invalide');
      }
    } catch (error) {
      setServerMessage({ type: 'error', text: error.message || 'Code invalide ou expiré' });
      setCode(['', '', '', '', '', '']);
      document.getElementById('code-0')?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setServerMessage({ type: 'info', text: 'Renvoi du code...' });

    try {
      const response = await fetch(`${API_URL}/api/auth/demande-reinitialisation-mdp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        setServerMessage({ type: 'success', text: 'Nouveau code envoyé !' });
        setCode(['', '', '', '', '', '']);
        document.getElementById('code-0')?.focus();
      } else {
        throw new Error(data.message || 'Erreur lors du renvoi');
      }
    } catch (error) {
      setServerMessage({ type: 'error', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

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
      margin-bottom: 1rem;
      font-size: 2rem;
      color: var(--foreground);
    }

    h1 em {
      color: var(--primary);
      font-style: italic;
    }

    .email-display {
      text-align: center;
      color: var(--muted-foreground);
      margin-bottom: 2rem;
      font-size: 0.95rem;
    }

    .email-display strong {
      color: var(--foreground);
      font-weight: 600;
    }

    .code-input-group {
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
      margin: 1.5rem 0;
    }

    .code-input {
      width: 3rem;
      height: 3.5rem;
      text-align: center;
      font-size: 1.5rem;
      font-weight: 600;
      font-family: 'Courier New', monospace;
      border: 2px solid var(--border);
      border-radius: var(--radius);
      background: var(--muted);
      color: var(--foreground);
      transition: all 0.2s var(--ease);
      outline: none;
    }

    .code-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(45, 138, 94, 0.1);
    }

    .code-input.error {
      border-color: var(--destructive);
    }

    .timer {
      text-align: center;
      font-size: 0.9rem;
      color: var(--muted-foreground);
      margin-bottom: 1.5rem;
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

    .btn.secondary {
      background: transparent;
      color: var(--muted-foreground);
      border: 2px solid var(--border);
      box-shadow: none;
    }

    .btn.secondary:hover:not(:disabled) {
      background: var(--muted);
      color: var(--foreground);
      transform: none;
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

    .button-group {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .links {
      text-align: center;
      margin-top: 1.5rem;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
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
          <em>Vérification du code</em>
        </h1>

        <div className="email-display">
          <Mail size={14} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
          Code envoyé à <strong>{email}</strong>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="code-input-group" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`code-input ${errors.code ? 'error' : ''}`}
              />
            ))}
          </div>
          {errors.code && <div className="error-text" style={{ textAlign: 'center' }}>{errors.code}</div>}

          <div className="timer">
            <i className="far fa-clock"></i> Code valide 15 minutes
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

          <div className="button-group">
            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Vérification...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Vérifier le code
                </>
              )}
            </button>

            <button type="button" className="btn secondary" onClick={handleResendCode} disabled={isLoading}>
              Renvoyer le code
            </button>
          </div>
        </form>

        <div className="links">
          <a href="/forgot-password" className="back-link">
            <ArrowLeft size={16} />
            Modifier mon email
          </a>
        </div>

        <div className="help-box">
          <h3>Vous ne recevez pas le code ?</h3>
          <ul>
            <li><span>•</span> Vérifiez vos spams / courriers indésirables</li>
            <li><span>•</span> Attendez 2 minutes avant de renvoyer</li>
            <li><span>•</span> Vérifiez que votre email est correct</li>
            <li><span>•</span> Contactez le support si le problème persiste</li>
          </ul>
        </div>
      </div>

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </>
  );
};

export default VerifyCode;