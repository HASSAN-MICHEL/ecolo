import React from 'react';

const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="hero-glow"></div>
      <div className="orbit-ring orbit-1"></div>
      <div className="orbit-ring orbit-2"></div>
      <div className="orbit-ring orbit-3"></div>

      <div className="hero-stats">
        <div className="stat-float stat-float-1">
          <div className="stat-float-icon">♻️</div>
          <div className="stat-float-num">12k+</div>
          <div className="stat-float-label">Collectes ce mois</div>
        </div>
        <div className="stat-float stat-float-2">
          <div className="stat-float-icon">🏆</div>
          <div className="stat-float-num">850</div>
          <div className="stat-float-label">Points gagnés aujourd'hui</div>
        </div>
        <div className="stat-float stat-float-3">
          <div className="stat-float-icon">🌱</div>
          <div className="stat-float-num">4.2T</div>
          <div className="stat-float-label">Kg valorisés ce mois</div>
        </div>
      </div>

      <div className="hero-inner">
        <h1 className="hero-title">
          Recyclez.<br/>
          <em>Gagnez.</em><br/>
          Impactez.
        </h1>

        <p className="hero-sub">
          Déclarez vos déchets, suivez vos collectes en temps réel
          et transformez chaque geste écologique en récompenses concrètes.
        </p>

        <div className="hero-actions">
          <button className="btn-primary-hero" onClick={() => window.location = 'login.html'}>
            Créer mon compte gratuit
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          <button className="btn-outline-hero" onClick={() => document.getElementById('how').scrollIntoView({behavior: 'smooth'})}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
            </svg>
            Voir comment ça marche
          </button>
        </div>
      </div>

      <div className="scroll-hint">
        <span>Découvrir</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
};

export default Hero;