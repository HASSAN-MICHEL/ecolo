/* Variables CSS pour une cohérence */
:root {
  --primary: #e67e22;
  --secondary: #d35400;
  --sidebar-width: 100%;
  --sidebar-collapsed-width: 90px;
  --header-height: 70px;
  --transition-speed: 0.3s;
}

/* Reset et styles de base */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body, #root {
  height: 100%;
  width: 100%;
  overflow: hidden; /* Empêche le défilement global */
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Layout principal */
.app-container {
  display: flex;
  height: 100vh;
  width: 100%;
}

/* Sidebar FIXE */
.sidebar {
  width: 100%;
  height: 100%;
  
  left: 0;
  top: 0;
  z-index: 1000;
  transition: width var(--transition-speed) ease;
  overflow-y: auto; /* Défilement interne si nécessaire */
  overflow-x: hidden;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar.collapsed {
  width: var(--sidebar-collapsed-width);
}

/* Contenu principal DÉFILABLE */
.main-content {
  flex: 1;
  margin-left: var(--sidebar-width);
  transition: margin-left var(--transition-speed) ease;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Conteneur principal sans défilement */
}

.main-content.sidebar-collapsed {
  margin-left: var(--sidebar-collapsed-width);
}

/* Header fixe */
.header {
  height: var(--header-height);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background: white;
}

/* Contenu défilable SEULEMENT ici */
.content-wrapper {
  flex: 1;
  overflow-y: auto; /* Défilement uniquement dans cette zone */
  overflow-x: hidden;
  padding: 1.5rem;
}

/* Cartes modernes */
.card {
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all var(--transition-speed);
  overflow: hidden;
}

.card:hover {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* Boutons */
.btn {
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all var(--transition-speed);
  font-weight: 500;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--secondary);
  transform: translateY(-1px);
}

/* Tableaux responsives */
.table-responsive {
  overflow-x: auto;
  width: 100%;
}

.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 600px; /* Minimum width before scrolling */
}

.table th {
  background-color: #f8f9fa;
  position: sticky;
  top: 0;
  z-index: 10;
}

/* Grille responsive */
.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}

.col {
  flex: 1 0 0%;
  padding: 0 15px;
}

/* Utilitaires responsive */
.d-none {
  display: none !important;
}

.d-block {
  display: block !important;
}

.d-flex {
  display: flex !important;
}

/* Media Queries pour le responsive */

/* Tablettes */
@media (max-width: 992px) {
  :root {
    --sidebar-width: 250px;
  }
  
  .sidebar.collapsed {
    width: var(--sidebar-collapsed-width);
  }
  
  .main-content {
    margin-left: var(--sidebar-collapsed-width);
  }
  
  .main-content.sidebar-expanded {
    margin-left: var(--sidebar-width);
  }
  
  .table {
    font-size: 0.9rem;
  }
  
  .card {
    margin-bottom: 1rem;
  }
}

/* Mobiles */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    width: 100%;
    width: auto;
  }
  
  .sidebar.show {
    transform: translateX(0);
    width: 100%;
    max-width: auto;
  }
  
  .main-content {
    margin-left: 0 !important;
    width: 100%;
  }
  
  .content-wrapper {
    padding: 1rem;
  }
  
  /* Menu hamburger visible sur mobile */
  .mobile-menu-btn {
    display: block !important;
  }
  
  /* Cacher certains éléments sur mobile */
  .hide-on-mobile {
    display: none !important;
  }
  
  /* Ajustements pour petits écrans */
  .btn {
    padding: 6px 12px;
    font-size: 0.9rem;
  }
  
  h1 {
    font-size: 1.8rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
}

/* Très petits écrans */
@media (max-width: 576px) {
  .content-wrapper {
    padding: 0.75rem;
  }
  
  .card {
    border-radius: 8px;
  }
  
  .btn {
    width: 100%;
    margin-bottom: 0.5rem;
  }
  
  .btn-group .btn {
    width: auto;
  }
  
  /* Stack les colonnes sur très petits écrans */
  .col {
    flex: 0 0 100%;
    max-width: 100%;
  }
}

/* Grands écrans */
@media (min-width: 1200px) {
  .container {
    max-width: 1140px;
  }
}

/* Très grands écrans */
@media (min-width: 1400px) {
  .container {
    max-width: 1320px;
  }
}

/* Gestion du débordement et défilement */
.overflow-auto {
  overflow: auto;
}

.overflow-hidden {
  overflow: hidden;
}

.overflow-y-auto {
  overflow-y: auto;
}

.overflow-x-auto {
  overflow-x: auto;
}

/* Scrollbar personnalisée pour Webkit */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Animation pour le sidebar */
@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.sidebar.show {
  animation: slideIn 0.3s ease forwards;
}

/* Animation de fade pour le contenu */
.fade-in {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Amélioration de la lisibilité sur mobile */
@media (max-width: 768px) {
  body {
    font-size: 14px;
  }
  
  .table td, .table th {
    padding: 0.5rem;
  }
  
  /* Éviter le zoom sur les inputs sur iOS */
  input, select, textarea {
    font-size: 16px !important;
  }
}

/* Mode paysage sur mobile */
@media (max-height: 500px) and (orientation: landscape) {
  .sidebar {
    overflow-y: auto;
  }
  
  .header {
    height: 60px;
  }
  
  .content-wrapper {
    padding: 0.5rem;
  }
}

/* High DPI screens */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .card {
    border: 0.5px solid rgba(0, 0, 0, 0.05);
  }
}

/* Styles spécifiques pour le layout fixe */
.fixed-sidebar-layout {
  height: 100%;
  overflow: hidden;
}

.fixed-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  overflow-y: auto;
}

.scrollable-content {
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Empêcher le défilement du body quand la sidebar mobile est ouverte */
body.sidebar-open-mobile {
  overflow: hidden;
}

/* Overlay pour mobile */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;
}

.sidebar-overlay.active {
  
}




{
  "name": "DRINK_MANAGE",
  "version": "1.0.0",
  "description": "Application de gestion de boissons",
  "type": "module",
  "author": "HASSAN MIMCHE",
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run electron:dev\"",
    "server": "node backend/server.js",
    "electron": "electron .",
    "electron:dev": "wait-on http://localhost:5000 && cross-env ELECTRON_APP=true electron .",
    "build:win-installer": "npx electron-builder --win nsis --config.forceCodeSigning=false"

  },
  "build": {
    "appId": "com.angelacity.drink",
    "productName": "DRINK MANAGE",
    "directories": {
      "output": "dist-electron"
    },
    "files": [
      "dist/**/*",
      "backend/**/*",
      "electron/**/*",
      "package.json"
    ],
    "extraResources": [
      {
        "from": "backend",
        "to": "app.asar.unpacked/backend",
        "filter": [
          "**/*"
        ]
      },
      {
        "from": "assets",
        "to": "assets",
        "filter": [
          "**/*"
        ]
      },
      {
        "from": "dist",
        "to": "dist",
        "filter": [
          "**/*"
        ]
      }
    ],
    "win": {
      "target": "nsis",
      "icon": "assets/icon.ico",
      "signAndEditExecutable": false
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true,
      "installerIcon": "assets/icon.ico",
      "uninstallerIcon": "assets/icon.ico",
      "installerHeaderIcon": "assets/icon.ico",
      "shortcutName": "DRINK MANAGE"
    },
    "npmRebuild": false,
    "asar": false,
    "forceCodeSigning": false
  },
  "dependencies": {
    "bcryptjs": "^3.0.2",
    "bootstrap": "^5.3.8",
    "cors": "^2.8.5",
    "express": "^5.1.0",
    "joi": "^18.0.1",
    "jsonwebtoken": "^9.0.2",
    "pdfkit": "^0.17.2",
    "pg": "^8.16.3",
    "react-dom": "^19.1.1",
    "react-pdf": "^10.1.0",
    "recharts": "^3.2.1",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.1",
    "tailwindcss": "^4.1.13"
  },
  "devDependencies": {
    "concurrently": "^9.2.1",
    "cross-env": "^10.0.0",
    "electron": "^22.0.0",
    "electron-builder": "^26.0.12",
    "electron-is-dev": "^3.0.1",
    "wait-on": "^9.0.1"
  }
}











{
  "name": "ha-hotel",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "backend": "node backend/server.js"
  },
  "dependencies": {
    "@chakra-ui/react": "^3.18.0",
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.0",
    "@fortawesome/fontawesome-free": "^7.0.1",
    "@mui/icons-material": "^7.0.0",
    "@mui/material": "^7.0.0",
    "axios": "^1.8.4",
    "bcryptjs": "^3.0.2",
    "bootstrap": "^5.3.8",
    "chart.js": "^4.4.8",
    "clsx": "^2.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express-validator": "^7.2.1",
    "framer-motion": "^12.23.12",
    "html2canvas": "^1.4.1",
    "joi": "^17.12.3",
    "jsonwebtoken": "^9.0.2",
    "jspdf": "^3.0.3",
    "jwt-decode": "^4.0.0",
    "lightningcss": "^1.30.2",
    "lucide-react": "^0.513.0",
    "moment": "^2.30.1",
    "node-cron": "^3.0.3",
    "pdfkit": "^0.17.2",
    "pg": "^8.13.1",
    "react": "^18.2.0",
    "react-bootstrap": "^2.10.10",
    "react-dom": "^18.2.0",
    "react-icons": "^5.5.0",
    "react-router-dom": "^7.1.5",
    "sass": "^1.92.0",
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "@babel/core": "^7.28.4",
    "@babel/preset-env": "^7.28.3",
    "@babel/preset-react": "^7.27.1",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.7.0",
    "concurrently": "^9.2.1",
    "electron": "^38.2.1",
    "electron-builder": "^26.0.12",
    "electron-is-dev": "^3.0.1",
    "eslint": "^9.19.0",
    "eslint-plugin-react": "^7.37.4",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.18",
    "nodemon": "^3.1.9",
    "semver": "^7.7.2",
    "vite": "^6.3.6",
    "wait-on": "^9.0.1"
  }
}

