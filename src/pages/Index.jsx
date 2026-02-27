import React, { useState, useEffect, useRef } from 'react';
import logo from '../assets/logo.jpeg'; // Import de l'image

const Index = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const ringPosRef = useRef({ x: 0, y: 0 });
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // ========== MODE SOMBRE ==========
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // ========== CURSEUR PERSONNALISÉ ==========
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const animateCursor = () => {
      if (cursorDotRef.current && cursorRingRef.current) {
        cursorDotRef.current.style.left = mouseRef.current.x + 'px';
        cursorDotRef.current.style.top = mouseRef.current.y + 'px';

        ringPosRef.current.x += (mouseRef.current.x - ringPosRef.current.x) * 0.12;
        ringPosRef.current.y += (mouseRef.current.y - ringPosRef.current.y) * 0.12;

        cursorRingRef.current.style.left = ringPosRef.current.x + 'px';
        cursorRingRef.current.style.top = ringPosRef.current.y + 'px';
      }
      requestAnimationFrame(animateCursor);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animateCursor();

    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // ========== PARTICULES ==========
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height;
    const COLORS = darkMode 
      ? ['rgba(45,138,94,', 'rgba(45,138,94,', 'rgba(45,138,94,']
      : ['rgba(45,138,94,', 'rgba(45,138,94,', 'rgba(45,138,94,'];

    const createParticle = () => {
      const c = COLORS[Math.floor(Math.random() * COLORS.length)];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        alpha: darkMode ? Math.random() * 0.2 + 0.1 : Math.random() * 0.4 + 0.1,
        color: c
      };
    };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particlesRef.current = [];
      for (let i = 0; i < 60; i++) {
        particlesRef.current.push(createParticle());
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, width, height);
      
      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.fill();
      });

      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x;
          const dy = particlesRef.current[i].y - particlesRef.current[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(45,138,94,${darkMode ? 0.02 : 0.04 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(drawParticles);
    };

    resize();
    window.addEventListener('resize', resize);
    drawParticles();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [darkMode]);

  // ========== NAVBAR SCROLL ==========
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ========== SCROLL REVEAL ==========
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
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

    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // ========== COMPTEURS ANIMÉS ==========
  useEffect(() => {
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

    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target.querySelector('.stat-num');
            const txt = el.textContent;
            if (txt.includes('k')) animateCount(el, parseFloat(txt) * 1000, '');
            else if (txt.includes('T')) animateCount(el, parseFloat(txt) * 1000, '');
            else if (txt.includes('%')) animateCount(el, parseInt(txt), '%');
            else animateCount(el, parseInt(txt.replace(',', '')), '');
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll('.stat-item').forEach(el => statsObserver.observe(el));

    return () => statsObserver.disconnect();
  }, []);

  // ========== SCROLL DOUX ==========
  const handleSmoothScroll = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  };

  // ========== FERMER LE MENU MOBILE AU CLIC EXTÉRIEUR ==========
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target) && 
          !e.target.closest('.nav-hamburger')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ========== STYLES ==========
  const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap');

  :root {
    /* Palette claire */
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
    --shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.05);
    --shadow-lg: 0 10px 40px -8px rgba(0, 0, 0, 0.08);
    --shadow-colored: 0 4px 20px -4px rgba(45, 138, 94, 0.15);
    --nav-bg: linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8));
    --nav-border: rgba(0, 0, 0, 0.05);
  }

  /* ========== MODE SOMBRE ========== */
  .dark-mode {
    --background: #0f1a14;
    --foreground: #e8efe8;
    --card: #1e2a22;
    --card-foreground: #e8efe8;
    --primary: #3cb371;
    --primary-foreground: #0f1a14;
    --secondary: #1a2a20;
    --secondary-foreground: #9fd3a5;
    --muted: #25312b;
    --muted-foreground: #9aa89e;
    --accent: #c68b1c;
    --accent-foreground: #fef7e6;
    --border: #2d3d33;
    --ring: #3cb371;
    --shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.3);
    --shadow-lg: 0 10px 40px -8px rgba(0, 0, 0, 0.5);
    --shadow-colored: 0 4px 20px -4px rgba(60, 179, 113, 0.3);
    --nav-bg: linear-gradient(to bottom, rgba(15, 26, 20, 0.95), rgba(15, 26, 20, 0.8));
    --nav-border: rgba(255, 255, 255, 0.05);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Outfit', sans-serif;
    background: var(--background);
    color: var(--foreground);
    line-height: 1.6;
    overflow-x: hidden;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  /* ========== MODE SOMBRE - ÉLÉMENTS SPÉCIFIQUES ========== */
  .dark-mode .cursor-dot {
    background: var(--primary);
    box-shadow: 0 0 12px var(--primary);
  }

  .dark-mode .cursor-ring {
    border-color: rgba(60, 179, 113, 0.3);
  }

  .dark-mode nav {
    background: var(--nav-bg);
    border-bottom-color: var(--nav-border);
  }

  .dark-mode nav.scrolled {
    background: rgba(15, 26, 20, 0.98);
  }

  .dark-mode .step-card,
  .dark-mode .waste-tile,
  .dark-mode .testi-card,
  .dark-mode .points-card,
  .dark-mode .reward-chip {
    background: var(--card);
    border-color: var(--border);
  }

  .dark-mode .btn-ghost {
    color: var(--muted-foreground);
  }

  .dark-mode .btn-ghost:hover {
    color: var(--foreground);
  }

  .dark-mode .stats-band {
    background: var(--card);
    border-color: var(--border);
  }

  .dark-mode footer {
    background: var(--card);
    border-color: var(--border);
  }

  /* ========== CUSTOM CURSOR ========== */
  .cursor {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 9999;
  }

  .cursor-dot {
    width: 8px;
    height: 8px;
    background: var(--primary);
    border-radius: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    transition: transform 0.1s;
    box-shadow: 0 0 12px var(--primary);
  }

  .cursor-ring {
    width: 36px;
    height: 36px;
    border: 1.5px solid rgba(45, 138, 94, 0.3);
    border-radius: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  }

  body:has(a:hover) .cursor-ring,
  body:has(button:hover) .cursor-ring {
    transform: translate(-50%, -50%) scale(1.8);
    background: rgba(45, 138, 94, 0.05);
  }

  /* ========== MENU MOBILE ========== */
  .mobile-menu {
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    background: var(--card);
    border-bottom: 1px solid var(--border);
    padding: 1.5rem;
    z-index: 99;
    transform: translateY(-100%);
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
    box-shadow: var(--shadow-lg);
    backdrop-filter: blur(10px);
    pointer-events: none;
  }

  .mobile-menu.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: all;
  }

  .mobile-menu-links {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .mobile-menu-links a {
    display: block;
    padding: 0.75rem 1rem;
    color: var(--foreground);
    text-decoration: none;
    font-weight: 500;
    border-radius: 8px;
    transition: all 0.2s;
  }

  .mobile-menu-links a:hover {
    background: var(--primary);
    color: white;
  }

  .mobile-menu-cta {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
  }

  .mobile-menu-cta .btn-ghost,
  .mobile-menu-cta .btn-pill {
    width: 100%;
    text-align: center;
    padding: 0.75rem;
  }

  /* ========== PARTICLES CANVAS ========== */
  #particles {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    opacity: 0.5;
  }

  /* ========== NAVIGATION ========== */
  nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    padding: 1.5rem 4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--nav-bg);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    border-bottom: 1px solid var(--nav-border);
  }

  nav.scrolled {
    padding: 1rem 4rem;
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.03);
  }

  .dark-mode nav.scrolled {
    background: rgba(15, 26, 20, 0.98);
  }

  .nav-logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-family: 'Outfit', sans-serif;
    font-weight: 800;
    font-size: 1.35rem;
    color: var(--foreground);
    text-decoration: none;
  }

  .nav-links {
    display: flex;
    gap: 2.5rem;
    list-style: none;
  }

  @media (max-width: 768px) {
    .nav-links {
      display: none;
    }
  }

  .nav-links a {
    color: var(--muted-foreground);
    font-size: 0.95rem;
    font-weight: 500;
    text-decoration: none;
    letter-spacing: 0.02em;
    transition: color 0.2s;
    position: relative;
  }

  .nav-links a::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--primary);
    transition: width 0.3s ease;
  }

  .nav-links a:hover {
    color: var(--foreground);
  }

  .nav-links a:hover::after {
    width: 100%;
  }

  .nav-cta {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  @media (max-width: 768px) {
    .nav-cta {
      display: none;
    }
  }

  .theme-toggle {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.2s;
    color: var(--foreground);
  }

  .theme-toggle:hover {
    background: rgba(45, 138, 94, 0.1);
  }

  .btn-ghost {
    color: var(--muted-foreground);
    font-size: 0.95rem;
    font-weight: 500;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem 1rem;
    border-radius: 100px;
    transition: color 0.2s;
    font-family: 'Outfit', sans-serif;
  }

  .btn-ghost:hover {
    color: var(--foreground);
  }

  .btn-pill {
    background: var(--primary);
    color: white;
    font-family: 'Outfit', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    padding: 0.65rem 1.6rem;
    border-radius: 100px;
    transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 4px 15px rgba(45, 138, 94, 0.2);
  }

  .btn-pill:hover {
    transform: scale(1.06);
    box-shadow: 0 8px 25px rgba(45, 138, 94, 0.3);
  }

  .nav-hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    z-index: 101;
  }

  .nav-hamburger span {
    width: 24px;
    height: 2px;
    background: var(--foreground);
    border-radius: 2px;
    transition: all 0.3s;
  }

  .nav-hamburger.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .nav-hamburger.active span:nth-child(2) {
    opacity: 0;
  }

  .nav-hamburger.active span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -7px);
  }

  @media (max-width: 768px) {
    .nav-hamburger {
      display: flex;
    }
    
    nav {
      padding: 1.25rem 1.5rem;
    }
    
    nav.scrolled {
      padding: 1rem 1.5rem;
    }
  }

  /* ========== HERO SECTION ========== */
  .hero {
    position: relative;
    z-index: 2;
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 0 4rem;
    text-align: center;
    overflow: hidden;
  }

  @media (max-width: 768px) {
    .hero {
      padding: 0 1.5rem;
    }
  }

  .hero-glow {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(ellipse 80% 60% at 50% 60%, rgba(45, 138, 94, 0.05) 0%, transparent 70%);
  }

  .orbit-ring {
    position: absolute;
    border-radius: 50%;
    border: 1px solid;
    animation: spin linear infinite;
    pointer-events: none;
  }

  .orbit-1 {
    width: 700px;
    height: 700px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-color: rgba(45, 138, 94, 0.1);
    animation-duration: 40s;
  }

  .orbit-2 {
    width: 500px;
    height: 500px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(30deg);
    border-color: rgba(45, 138, 94, 0.08);
    animation-duration: 25s;
    animation-direction: reverse;
  }

  .orbit-3 {
    width: 900px;
    height: 900px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-15deg);
    border-color: rgba(45, 138, 94, 0.05);
    animation-duration: 60s;
  }

  @keyframes spin {
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  @keyframes spin-reverse {
    from {
      transform: translate(-50%, -50%) rotate(30deg);
    }
    to {
      transform: translate(-50%, -50%) rotate(-330deg);
    }
  }

  .orbit-2 {
    animation-name: spin-reverse;
  }

  .hero-inner {
    position: relative;
    max-width: 900px;
    margin: 0 auto;
  }

  .hero-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(3.5rem, 8vw, 7.5rem);
    line-height: 1;
    margin-bottom: 1.75rem;
    color: var(--foreground);
  }

  .hero-title em {
    font-style: italic;
    color: var(--primary);
  }

  .hero-sub {
    font-size: 1.2rem;
    font-weight: 300;
    line-height: 1.7;
    color: var(--muted-foreground);
    max-width: 580px;
    margin: 0 auto 3rem;
  }

  .hero-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.25rem;
    flex-wrap: wrap;
  }

  @media (max-width: 480px) {
    .hero-actions {
      flex-direction: column;
      width: 100%;
    }
  }

  .btn-primary-hero {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    background: var(--primary);
    color: white;
    font-family: 'Outfit', sans-serif;
    font-weight: 600;
    font-size: 1.05rem;
    border: none;
    cursor: pointer;
    padding: 1rem 2.25rem;
    border-radius: 100px;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 4px 20px rgba(45, 138, 94, 0.25);
  }

  .btn-primary-hero:hover {
    transform: translateY(-3px) scale(1.04);
    box-shadow: 0 8px 30px rgba(45, 138, 94, 0.35);
  }

  .btn-outline-hero {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    background: transparent;
    color: var(--foreground);
    font-family: 'Outfit', sans-serif;
    font-weight: 500;
    font-size: 1.05rem;
    border: 1px solid var(--border);
    cursor: pointer;
    padding: 1rem 2.25rem;
    border-radius: 100px;
    transition: all 0.3s ease;
    backdrop-filter: blur(8px);
  }

  .btn-outline-hero:hover {
    border-color: var(--primary);
    color: var(--primary);
    background: rgba(45, 138, 94, 0.05);
  }

  @media (max-width: 480px) {
    .btn-primary-hero,
    .btn-outline-hero {
      width: 100%;
      justify-content: center;
    }
  }

  /* Floating stat cards */
  .hero-stats {
    position: absolute;
    pointer-events: none;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  @media (max-width: 768px) {
    .hero-stats {
      display: none;
    }
  }

  .stat-float {
    position: absolute;
    background: var(--card);
    border: 1px solid var(--border);
    backdrop-filter: blur(16px);
    border-radius: 16px;
    padding: 1rem 1.4rem;
    animation: floatCard 6s ease-in-out infinite;
    box-shadow: var(--shadow);
  }

  .stat-float-1 {
    left: 5%;
    top: 20%;
    animation-delay: 0s;
  }

  .stat-float-2 {
    right: 5%;
    top: 30%;
    animation-delay: 1.5s;
  }

  .stat-float-3 {
    left: 8%;
    bottom: 25%;
    animation-delay: 3s;
  }

  @keyframes floatCard {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-14px);
    }
  }

  .stat-float-icon {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }

  .stat-float-num {
    font-size: 1.8rem;
    font-weight: 800;
    color: var(--primary);
    line-height: 1;
    margin-bottom: 0.2rem;
  }

  .stat-float-label {
    font-size: 0.78rem;
    color: var(--muted-foreground);
    font-weight: 500;
  }

  /* Scroll indicator */
  .scroll-hint {
    position: absolute;
    bottom: 2.5rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: var(--muted-foreground);
    font-size: 0.78rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .scroll-line {
    width: 1px;
    height: 40px;
    background: linear-gradient(to bottom, var(--primary), transparent);
    animation: scrollBob 2s ease-in-out infinite;
  }

  @keyframes scrollBob {
    0%, 100% {
      transform: scaleY(1);
      opacity: 1;
    }
    50% {
      transform: scaleY(0.6);
      opacity: 0.5;
    }
  }

  /* ========== SECTIONS ========== */
  section {
    position: relative;
    z-index: 2;
  }

  .section-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 4rem;
  }

  @media (max-width: 768px) {
    .section-inner {
      padding: 0 1.5rem;
    }
  }

  /* How it works section */
  .how {
    padding: 10rem 0;
    background: linear-gradient(to bottom, transparent, var(--secondary), transparent);
  }

  .section-label {
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--primary);
    margin-bottom: 1rem;
  }

  .section-heading {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(2.5rem, 5vw, 4rem);
    line-height: 1.1;
    margin-bottom: 1.25rem;
    color: var(--foreground);
  }

  .section-sub {
    font-size: 1.1rem;
    color: var(--muted-foreground);
    max-width: 520px;
    line-height: 1.7;
  }

  .steps-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    margin-top: 5rem;
  }

  @media (max-width: 1100px) {
    .steps-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .steps-grid {
      grid-template-columns: 1fr;
    }
  }

  .step-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 2.25rem 1.75rem;
    position: relative;
    overflow: hidden;
    transition: all 0.4s ease;
    cursor: default;
    box-shadow: var(--shadow);
  }

  .step-card:hover {
    border-color: var(--primary);
    transform: translateY(-6px);
    box-shadow: var(--shadow-lg);
  }

  .step-num {
    font-size: 3.5rem;
    font-weight: 900;
    color: rgba(45, 138, 94, 0.1);
    line-height: 1;
    margin-bottom: 1.5rem;
    font-family: 'Outfit', sans-serif;
  }

  .step-icon-wrap {
    width: 52px;
    height: 52px;
    background: rgba(45, 138, 94, 0.1);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.25rem;
    font-size: 1.4rem;
    border: 1px solid rgba(45, 138, 94, 0.2);
  }

  .step-title {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 0.65rem;
    color: var(--foreground);
  }

  .step-desc {
    font-size: 0.95rem;
    color: var(--muted-foreground);
    line-height: 1.65;
  }

  .step-connector {
    position: absolute;
    top: 2.8rem;
    right: -1rem;
    width: 2rem;
    height: 1px;
    background: linear-gradient(to right, rgba(45, 138, 94, 0.3), transparent);
  }

  @media (max-width: 1100px) {
    .step-connector {
      display: none;
    }
  }

  .step-card:last-child .step-connector {
    display: none;
  }

  /* Waste types section */
  .waste {
    padding: 8rem 0;
  }

  .waste-flex {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6rem;
    align-items: center;
    margin-top: 4rem;
  }

  @media (max-width: 1100px) {
    .waste-flex {
      grid-template-columns: 1fr;
    }
  }

  .waste-tiles {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  @media (max-width: 768px) {
    .waste-tiles {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 480px) {
    .waste-tiles {
      grid-template-columns: 1fr;
    }
  }

  .waste-tile {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 1.5rem 1.25rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    text-align: center;
    transition: all 0.35s ease;
    cursor: default;
    box-shadow: var(--shadow);
  }

  .waste-tile:hover {
    border-color: var(--primary);
    background: rgba(45, 138, 94, 0.02);
    transform: scale(1.04);
    box-shadow: var(--shadow-lg);
  }

  .waste-emoji {
    font-size: 2rem;
  }

  .waste-name {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--foreground);
  }

  .waste-sub {
    font-size: 0.8rem;
    color: var(--muted-foreground);
  }

  .feature-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .feature-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
  }

  .feature-check {
    width: 24px;
    height: 24px;
    min-width: 24px;
    background: rgba(45, 138, 94, 0.1);
    border: 1px solid rgba(45, 138, 94, 0.2);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    color: var(--primary);
    margin-top: 0.1rem;
  }

  .feature-item-text {
    font-size: 0.95rem;
    color: var(--muted-foreground);
    line-height: 1.6;
  }

  .feature-item-text strong {
    color: var(--foreground);
  }

  /* Stats band */
  .stats-band {
    padding: 5rem 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    background: var(--card);
  }

  .stats-band-inner {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    text-align: center;
  }

  @media (max-width: 1100px) {
    .stats-band-inner {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .stats-band-inner {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 480px) {
    .stats-band-inner {
      grid-template-columns: 1fr;
    }
  }

  .stat-item {
    padding: 1rem;
  }

  .stat-num {
    font-size: 3rem;
    font-weight: 900;
    font-family: 'Outfit', sans-serif;
    color: var(--primary);
    line-height: 1;
    margin-bottom: 0.5rem;
  }

  .stat-desc {
    font-size: 0.95rem;
    color: var(--muted-foreground);
  }

  /* Rewards section */
  .rewards {
    padding: 8rem 0;
    background: linear-gradient(to bottom, transparent, var(--secondary), transparent);
  }

  .rewards-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6rem;
    align-items: center;
  }

  @media (max-width: 1100px) {
    .rewards-inner {
      grid-template-columns: 1fr;
    }
  }

  .rewards-visual {
    position: relative;
    height: 420px;
  }

  @media (max-width: 1100px) {
    .rewards-visual {
      height: 320px;
    }
  }

  .points-card {
    position: absolute;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 24px;
    backdrop-filter: blur(20px);
    box-shadow: var(--shadow-lg);
  }

  .points-main {
    width: 300px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 2rem;
  }

  .points-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .points-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--muted-foreground);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .points-badge {
    background: rgba(45, 138, 94, 0.1);
    color: var(--primary);
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.25rem 0.7rem;
    border-radius: 100px;
    border: 1px solid rgba(45, 138, 94, 0.2);
  }

  .points-big {
    font-size: 3.5rem;
    font-weight: 900;
    color: var(--primary);
    font-family: 'Outfit', sans-serif;
    line-height: 1;
    margin-bottom: 0.25rem;
  }

  .points-unit {
    font-size: 0.95rem;
    color: var(--muted-foreground);
    margin-bottom: 1.5rem;
  }

  .points-bar-wrap {
    background: var(--muted);
    border-radius: 100px;
    height: 6px;
    overflow: hidden;
  }

  .points-bar {
    width: 72%;
    height: 100%;
    background: linear-gradient(90deg, var(--primary), #5daa5d);
    border-radius: 100px;
  }

  .points-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 0.75rem;
    font-size: 0.85rem;
    color: var(--muted-foreground);
  }

  .reward-chip {
    position: absolute;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 0.85rem 1.1rem;
    backdrop-filter: blur(16px);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    animation: floatCard 5s ease-in-out infinite;
    box-shadow: var(--shadow);
  }

  .reward-chip-1 {
    top: 5%;
    right: -20px;
    animation-delay: 0s;
  }

  .reward-chip-2 {
    bottom: 8%;
    left: -10px;
    animation-delay: 2s;
  }

  .reward-chip-icon {
    font-size: 1.4rem;
  }

  .reward-chip-txt strong {
    display: block;
    font-size: 0.95rem;
    color: var(--foreground);
    font-weight: 600;
  }

  .reward-chip-txt span {
    font-size: 0.8rem;
    color: var(--muted-foreground);
  }

  /* Testimonials */
  .testimonials {
    padding: 8rem 0;
  }

  .testi-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-top: 5rem;
  }

  @media (max-width: 1100px) {
    .testi-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .testi-grid {
      grid-template-columns: 1fr;
    }
  }

  .testi-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 2rem;
    transition: all 0.35s ease;
    box-shadow: var(--shadow);
  }

  .testi-card:hover {
    border-color: var(--primary);
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }

  .testi-stars {
    color: var(--accent);
    margin-bottom: 1.25rem;
    font-size: 0.95rem;
    letter-spacing: 0.15em;
  }

  .testi-text {
    font-size: 0.95rem;
    color: var(--muted-foreground);
    line-height: 1.7;
    margin-bottom: 1.5rem;
    font-style: italic;
  }

  .testi-author {
    display: flex;
    align-items: center;
    gap: 0.9rem;
  }

  .testi-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    font-weight: 700;
    color: white;
  }

  .av1 {
    background: var(--primary);
  }

  .av2 {
    background: #4299e1;
  }

  .av3 {
    background: var(--accent);
  }

  .testi-name {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--foreground);
  }

  .testi-role {
    font-size: 0.8rem;
    color: var(--muted-foreground);
  }

  /* CTA Section */
  .cta-section {
    padding: 10rem 0;
    text-align: center;
    position: relative;
    overflow: hidden;
    background: var(--card);
  }

  .cta-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 800px;
    height: 400px;
    background: radial-gradient(ellipse, rgba(45, 138, 94, 0.05) 0%, transparent 70%);
    pointer-events: none;
  }

  .cta-heading {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(3rem, 6vw, 5.5rem);
    line-height: 1.05;
    margin-bottom: 1.5rem;
    color: var(--foreground);
  }

  .cta-heading em {
    font-style: italic;
    color: var(--primary);
  }

  .cta-sub {
    font-size: 1.15rem;
    color: var(--muted-foreground);
    max-width: 500px;
    margin: 0 auto 3rem;
    line-height: 1.7;
  }

  .cta-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.25rem;
    flex-wrap: wrap;
  }

  .btn-big {
    display: inline-flex;
    align-items: center;
    gap: 0.85rem;
    background: var(--primary);
    color: white;
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
    font-size: 1.1rem;
    border: none;
    cursor: pointer;
    padding: 1.15rem 2.5rem;
    border-radius: 100px;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 4px 25px rgba(45, 138, 94, 0.3);
  }

  .btn-big:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 8px 35px rgba(45, 138, 94, 0.4);
  }

  @media (max-width: 480px) {
    .btn-big,
    .btn-outline-hero {
      width: 100%;
      justify-content: center;
    }
  }

  /* Footer */
  footer {
    border-top: 1px solid var(--border);
    padding: 3.5rem 4rem 2.5rem;
    position: relative;
    z-index: 2;
    background: var(--card);
  }

  @media (max-width: 768px) {
    footer {
      padding: 3rem 1.5rem;
    }
  }

  .footer-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  .footer-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 2rem;
  }

  @media (max-width: 768px) {
    .footer-top {
      flex-direction: column;
    }
  }

  .footer-tagline {
    font-size: 0.95rem;
    color: var(--muted-foreground);
    max-width: 240px;
    line-height: 1.6;
  }

  .footer-cols {
    display: flex;
    gap: 4rem;
  }

  @media (max-width: 768px) {
    .footer-cols {
      flex-direction: column;
      gap: 2rem;
    }
  }

  .footer-col h4 {
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--foreground);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 1.25rem;
  }

  .footer-col ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .footer-col a {
    font-size: 0.95rem;
    color: var(--muted-foreground);
    text-decoration: none;
    transition: color 0.2s;
  }

  .footer-col a:hover {
    color: var(--primary);
  }

  .footer-bottom {
    border-top: 1px solid var(--border);
    padding-top: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
    color: var(--muted-foreground);
    flex-wrap: wrap;
    gap: 1rem;
  }

  @media (max-width: 768px) {
    .footer-bottom {
      flex-direction: column;
      text-align: center;
    }
  }

  .footer-bottom-lime {
    color: var(--primary);
    font-weight: 600;
  }

  /* Scroll Reveal */
  .reveal {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }

  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .reveal-delay-1 {
    transition-delay: 0.1s;
  }

  .reveal-delay-2 {
    transition-delay: 0.2s;
  }

  .reveal-delay-3 {
    transition-delay: 0.3s;
  }

  .reveal-delay-4 {
    transition-delay: 0.4s;
  }

  @media (max-width: 768px) {
    body {
      cursor: auto;
    }
    
    .cursor {
      display: none;
    }
  }
`;

  return (
    <>
      <style>{styles}</style>
      
      {/* Custom cursor */}
      <div className="cursor" id="cursor">
        <div className="cursor-dot" ref={cursorDotRef}></div>
        <div className="cursor-ring" ref={cursorRingRef}></div>
      </div>

      {/* Canvas particles */}
      <canvas id="particles" ref={canvasRef}></canvas>

      {/* Navigation */}
      <nav id="nav" ref={navRef} className={scrolled ? 'scrolled' : ''}>
        <a href="#" className="nav-logo">
          <img src={logo} alt="EcoCollect" style={{ height: '42px', width: 'auto' }} />
        </a>

        <ul className="nav-links">
          <li><a href="#how" onClick={(e) => handleSmoothScroll(e, 'how')}>Fonctionnement</a></li>
          <li><a href="#waste" onClick={(e) => handleSmoothScroll(e, 'waste')}>Déchets</a></li>
          <li><a href="#rewards" onClick={(e) => handleSmoothScroll(e, 'rewards')}>Récompenses</a></li>
          <li><a href="#about" onClick={(e) => handleSmoothScroll(e, 'about')}>À propos</a></li>
        </ul>

        <div className="nav-cta">
          <button className="btn-ghost" onClick={() => window.location = '/login'}>Se connecter</button>
          <button className="btn-pill" onClick={() => window.location = '/login'}>Commencer →</button>
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <button 
          className={`nav-hamburger ${mobileMenuOpen ? 'active' : ''}`} 
          id="hamburger" 
          aria-label="Menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span><span></span><span></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`} ref={mobileMenuRef}>
        <ul className="mobile-menu-links">
          <li><a href="#how" onClick={(e) => handleSmoothScroll(e, 'how')}>Fonctionnement</a></li>
          <li><a href="#waste" onClick={(e) => handleSmoothScroll(e, 'waste')}>Déchets</a></li>
          <li><a href="#rewards" onClick={(e) => handleSmoothScroll(e, 'rewards')}>Récompenses</a></li>
          <li><a href="#about" onClick={(e) => handleSmoothScroll(e, 'about')}>À propos</a></li>
        </ul>
        <div className="mobile-menu-cta">
          <button className="btn-ghost" onClick={() => window.location = '/login'}>Se connecter</button>
          <button className="btn-pill" onClick={() => window.location = '/login'}>Commencer →</button>
          <button className="theme-toggle" onClick={() => {
            setDarkMode(!darkMode);
            setMobileMenuOpen(false);
          }}>
            {darkMode ? '☀️ Mode clair' : '🌙 Mode sombre'}
          </button>
        </div>
      </div>

      {/* Hero Section */}
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
            <button className="btn-primary-hero" onClick={() => window.location = '/login'}>
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

      {/* How It Works Section */}
      <section className="how" id="how">
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

      {/* Waste Types Section */}
      <section className="waste" id="waste">
        <div className="section-inner">
          <div className="waste-flex">
            <div className="waste-tiles reveal">
              <div className="waste-tile">
                <div className="waste-emoji">🍶</div>
                <div className="waste-name">Plastique PET</div>
                <div className="waste-sub">Bouteilles, emballages</div>
              </div>
              <div className="waste-tile">
                <div className="waste-emoji">🪣</div>
                <div className="waste-name">Plastique PEHD</div>
                <div className="waste-sub">Bidons, flacons</div>
              </div>
              <div className="waste-tile">
                <div className="waste-emoji">📦</div>
                <div className="waste-name">Papier / Carton</div>
                <div className="waste-sub">Boîtes, journaux</div>
              </div>
              <div className="waste-tile">
                <div className="waste-emoji">🥫</div>
                <div className="waste-name">Métal</div>
                <div className="waste-sub">Canettes, conserves</div>
              </div>
              <div className="waste-tile">
                <div className="waste-emoji">🍾</div>
                <div className="waste-name">Verre</div>
                <div className="waste-sub">Bouteilles, pots</div>
              </div>
              <div className="waste-tile">
                <div className="waste-emoji">🌿</div>
                <div className="waste-name">Organique</div>
                <div className="waste-sub">Déchets alimentaires</div>
              </div>
            </div>

            <div className="waste-text-col reveal reveal-delay-2">
              <p className="section-label kicker">🗑️ Catégories de déchets</p>
              <h2 className="section-heading">Triez tout,<br/>ne ratez rien.</h2>
              <p className="section-sub">EcoCollect accepte 6 catégories de déchets recyclables. Chaque type trié et déclaré vous rapporte des points et contribue à un environnement plus propre.</p>

              <ul className="feature-list" style={{marginTop: '2rem'}}>
                <li className="feature-item">
                  <div className="feature-check">✓</div>
                  <div className="feature-item-text"><strong>Quantités flexibles</strong> — déclarez en kg, sacs ou unités</div>
                </li>
                <li className="feature-item">
                  <div className="feature-check">✓</div>
                  <div className="feature-item-text"><strong>Multi-types</strong> — combinez plusieurs catégories en une seule déclaration</div>
                </li>
                <li className="feature-item">
                  <div className="feature-check">✓</div>
                  <div className="feature-item-text"><strong>Validation instantanée</strong> — votre déclaration est traitée en temps réel</div>
                </li>
                <li className="feature-item">
                  <div className="feature-check">✓</div>
                  <div className="feature-item-text"><strong>Suivi précis</strong> — visualisez le poids réel collecté après chaque passage</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Band */}
      <section className="stats-band">
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

      {/* Rewards Section */}
      <section className="rewards" id="rewards">
        <div className="section-inner">
          <div className="rewards-inner">
            <div className="reveal">
              <p className="section-label">🏆 Système de récompenses</p>
              <h2 className="section-heading">Chaque déchet<br/>vous rapporte.</h2>
              <p className="section-sub" style={{marginBottom: '2.5rem'}}>Accumulez des points à chaque collecte validée. Échangez-les contre des avantages, réductions et services exclusifs.</p>

              <ul className="feature-list">
                <li className="feature-item">
                  <div className="feature-check">✓</div>
                  <div className="feature-item-text"><strong>Points automatiques</strong> — crédités dès la validation de la collecte</div>
                </li>
                <li className="feature-item">
                  <div className="feature-check">✓</div>
                  <div className="feature-item-text"><strong>Historique complet</strong> — suivez chaque point gagné et dépensé</div>
                </li>
                <li className="feature-item">
                  <div className="feature-check">✓</div>
                  <div className="feature-item-text"><strong>Niveaux & badges</strong> — progressez et montrez votre engagement</div>
                </li>
                <li className="feature-item">
                  <div className="feature-check">✓</div>
                  <div className="feature-item-text"><strong>Récompenses locales</strong> — partenaires et offres dans votre commune</div>
                </li>
              </ul>
            </div>

            <div className="rewards-visual reveal reveal-delay-2">
              <div className="reward-chip reward-chip-1">
                <div className="reward-chip-icon">🎫</div>
                <div className="reward-chip-txt">
                  <strong>Bon de réduction</strong>
                  <span>-15% chez nos partenaires</span>
                </div>
              </div>
              <div className="reward-chip reward-chip-2">
                <div className="reward-chip-icon">⚡</div>
                <div className="reward-chip-txt">
                  <strong>+50 pts bonus</strong>
                  <span>Collecte express validée</span>
                </div>
              </div>

              <div className="points-card points-main">
                <div className="points-header">
                  <div className="points-label">Mon solde EcoPoints</div>
                  <div className="points-badge">🟢 Actif</div>
                </div>
                <div className="points-big">2 450</div>
                <div className="points-unit">points disponibles</div>
                <div className="points-bar-wrap">
                  <div className="points-bar"></div>
                </div>
                <div className="points-footer">
                  <span>Niveau Argent</span>
                  <span>550 pts → Or</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials" id="about">
        <div className="section-inner">
          <div className="reveal" style={{textAlign: 'center', maxWidth: '600px', margin: '0 auto 1rem'}}>
            <p className="section-label">💬 Ils nous font confiance</p>
            <h2 className="section-heading">Ce que disent<br/>nos producteurs.</h2>
          </div>

          <div className="testi-grid">
            <div className="testi-card reveal reveal-delay-1">
              <div className="testi-stars">★★★★★</div>
              <p className="testi-text">"Depuis EcoCollect, on ne rate plus aucune collecte. L'application nous notifie à l'avance et les points s'accumulent automatiquement. Vraiment bien pensé."</p>
              <div className="testi-author">
                <div className="testi-avatar av1">A</div>
                <div>
                  <div className="testi-name">Aminata K.</div>
                  <div className="testi-role">Ménage — Douala 3</div>
                </div>
              </div>
            </div>

            <div className="testi-card reveal reveal-delay-2">
              <div className="testi-stars">★★★★★</div>
              <p className="testi-text">"En tant que gérant de restaurant, on génère beaucoup de déchets. EcoCollect nous a permis de structurer notre tri et de valoriser nos emballages carton efficacement."</p>
              <div className="testi-author">
                <div className="testi-avatar av2">J</div>
                <div>
                  <div className="testi-name">Jean-Pierre M.</div>
                  <div className="testi-role">Commerce — Bafoussam</div>
                </div>
              </div>
            </div>

            <div className="testi-card reveal reveal-delay-3">
              <div className="testi-stars">★★★★★</div>
              <p className="testi-text">"Notre PME produit du plastique industriel. Avec la fonctionnalité 'Entreprise', on gère nos flux de déchets proprement et on obtient des attestations pour nos clients."</p>
              <div className="testi-author">
                <div className="testi-avatar av3">F</div>
                <div>
                  <div className="testi-name">Fatou B.</div>
                  <div className="testi-role">Entreprise — Yaoundé</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="cta-section">
        <div className="cta-glow"></div>
        <div className="section-inner" style={{position: 'relative'}}>
          <p className="section-label reveal">🌍 Rejoignez le mouvement</p>
          <h2 className="cta-heading reveal">
            Votre déchet,<br/>
            <em>notre ressource.</em>
          </h2>
          <p className="cta-sub reveal">Plus de 48 000 producteurs font déjà partie d'EcoCollect. Commencez gratuitement aujourd'hui et transformez chaque geste en impact.</p>
          <div className="cta-buttons reveal">
            <button className="btn-big" onClick={() => window.location = '/login'}>
              <span>🚀</span>
              Rejoindre EcoCollect
            </button>
            <button className="btn-outline-hero" onClick={() => window.location = '/login'}>
              J'ai déjà un compte →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-logo-wrap">
              <a href="#" className="nav-logo">
                <img src="/logo.jpeg" alt="EcoCollect" style={{ height: '38px', width: 'auto' }} />
              </a>
              <p className="footer-tagline">Plateforme intelligente de gestion et valorisation des déchets recyclables.</p>
            </div>

            <div className="footer-cols">
              <div className="footer-col">
                <h4>Plateforme</h4>
                <ul>
                  <li><a href="#">Fonctionnement</a></li>
                  <li><a href="#">Types de déchets</a></li>
                  <li><a href="#">Récompenses</a></li>
                  <li><a href="#">Points de dépôt</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Producteurs</h4>
                <ul>
                  <li><a href="#">Ménages</a></li>
                  <li><a href="#">Commerces</a></li>
                  <li><a href="#">Entreprises</a></li>
                  <li><a href="#">Administrations</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Légal</h4>
                <ul>
                  <li><a href="#">CGU</a></li>
                  <li><a href="#">Confidentialité</a></li>
                  <li><a href="#">Mentions légales</a></li>
                  <li><a href="#">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <a href="#" className="nav-logo">
              <img src="/logo.jpeg" alt="EcoCollect" style={{ height: '38px', width: 'auto' }} />
            </a>
            <span>© 2026 <span className="footer-bottom-lime">EcoCollect</span>. Tous droits réservés.</span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Index;