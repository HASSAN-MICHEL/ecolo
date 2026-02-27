import React, { useEffect, useRef } from 'react';

const StatsBand = () => {
  const sectionRef = useRef(null);

  const animateCount = (el, target, suffix = '') => {
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      const display = target >= 1000
        ? (start / 1000).toFixed(target >= 10000 ? 0 : 1) + 'k'
        : Math.round(start) + (suffix || '');
      el.textContent = display + (suffix && target < 1000 ? suffix : '');
    }, 20);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target.querySelector('.stat-num');
            const txt = el.textContent;
            if (txt.includes('k')) animateCount(el, parseFloat(txt) * 1000, '');
            else if (txt.includes('T')) animateCount(el, parseFloat(txt) * 1000, '');
            else if (txt.includes('%')) animateCount(el, parseInt(txt), '%');
            else animateCount(el, parseInt(txt.replace(',', '')), '');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    const statItems = sectionRef.current?.querySelectorAll('.stat-item');
    statItems?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="stats-band" ref={sectionRef}>
      <div className="section-inner">
        <div className="stats-band-inner">
          <div className="stat-item reveal">
            <div className="stat-num">48k+</div>
            <div className="stat-desc">Producteurs actifs</div>
          </div>
          <div className="stat-item reveal reveal-delay-1">
            <div className="stat-num">120T</div>
            <div className="stat-desc">Déchets valorisés</div>
          </div>
          <div className="stat-item reveal reveal-delay-2">
            <div className="stat-num">6,200</div>
            <div className="stat-desc">Collectes par mois</div>
          </div>
          <div className="stat-item reveal reveal-delay-3">
            <div className="stat-num">98%</div>
            <div className="stat-desc">Satisfaction producteurs</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsBand;