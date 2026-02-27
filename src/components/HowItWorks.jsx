import React, { useEffect, useRef } from 'react';

const HowItWorks = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    const revealElements = sectionRef.current?.querySelectorAll('.reveal');
    revealElements?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="how" id="how" ref={sectionRef}>
      <div className="section-inner">
        <div className="reveal">
          <p className="section-label">⚡ Processus simplifié</p>
          <h2 className="section-heading">Quatre étapes,<br/>un impact réel.</h2>
          <p className="section-sub">De l'inscription à la récompense, chaque action est pensée pour être simple, rapide et motivante.</p>
        </div>

        <div className="steps-grid">
          <div className="step-card reveal reveal-delay-1">
            <div className="step-num">01</div>
            <div className="step-icon-wrap">🪪</div>
            <div className="step-title">Enrôlement</div>
            <div className="step-desc">Créez votre compte en choisissant votre profil : ménage, commerce, entreprise ou administration. Localisez-vous en quelques secondes.</div>
            <div className="step-connector"></div>
          </div>
          <div className="step-card reveal reveal-delay-2">
            <div className="step-num">02</div>
            <div className="step-icon-wrap">🗂️</div>
            <div className="step-title">Tri & Préparation</div>
            <div className="step-desc">Triez vos déchets par catégorie — plastique, papier, métal, verre, organique — dans vos contenants ou sacs EcoCollect.</div>
            <div className="step-connector"></div>
          </div>
          <div className="step-card reveal reveal-delay-3">
            <div className="step-num">03</div>
            <div className="step-icon-wrap">📋</div>
            <div className="step-title">Déclaration</div>
            <div className="step-desc">Déclarez vos déchets en 3 clics. Choisissez la collecte à domicile ou déposez dans un point de regroupement proche.</div>
            <div className="step-connector"></div>
          </div>
          <div className="step-card reveal reveal-delay-4">
            <div className="step-num">04</div>
            <div className="step-icon-wrap">🎁</div>
            <div className="step-title">Collecte & Récompenses</div>
            <div className="step-desc">Suivez votre collecte en temps réel, recevez la confirmation et voyez vos points s'accumuler à chaque action.</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;