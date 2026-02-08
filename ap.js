import express from "express";
import cors from "cors";  // Importer CORS
import chambreRoutes from "./routes/chambreRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();

// Activer CORS pour toutes les origines
app.use(cors());

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Routes
app.use("/api/chambres", chambreRoutes);
app.use("/api/restaurant/menu", menuRoutes);
app.use("/api/restaurant/order", orderRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erreur interne du serveur" });
});

export default app;



{
  "name": "drink-manage",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "main": "electron/main.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "backend": "node backend/server.js",
    "installer:no-rebuild": "electron-builder --win --publish=never --config.npmRebuild=false",
    "electron": "electron .",
    "electron:dev": "concurrently \"npm run backend\" \"wait-on http://localhost:5173 && electron .\"",
    "electron:serve": "concurrently \"npm run dev\" \"npm run backend\" \"wait-on http://localhost:5173 && electron .\"",
    "dist": "electron-builder --win",
    "dist:dir": "electron-builder --dir",
    "installer": "electron-builder --win --publish=never",
    "pack": "electron-builder --dir",
    "build:electron": "npm run build && electron-builder",
    "build:all": "npm run build && npm run dist",
    "postinstall": "electron-builder install-app-deps",
    "clean": "rm -rf dist-electron",
    "clean:all": "rm -rf dist dist-electron node_modules/.cache",
    "test:electron": "electron ."
  },
  "dependencies": {
    "@chakra-ui/react": "^3.18.0",
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.0",
    "@fortawesome/fontawesome-free": "^7.0.1",
    "@mui/icons-material": "^7.0.0",
    "@mui/material": "^7.0.0",
    "@radix-ui/react-slot": "^1.2.3",
    "axios": "^1.8.4",
    "bcryptjs": "^3.0.2",
    "bootstrap": "^5.3.8",
    "chart.js": "^4.4.8",
    "class-variance-authority": "^0.7.1",
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
    "tailwind-merge": "^3.3.1",
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
  },
  "build": {
    "appId": "com.drinkmanage.app",
    "productName": "DRINK MANAGE",
    "directories": {
      "output": "dist-electron"
    },
    "files": [
      "dist/**/*",
      "backend/**/*",
      "electron/**/*",
      "node_modules/**/*",
      "package.json"
    ],
    "extraResources": [
      {
        "from": "backend",
        "to": "app-backend",
        "filter": ["**/*"]
      },
      {
        "from": "dist",
        "to": "app-dist",
        "filter": ["**/*"]
      }
    ],
    "win": {
      "target": "nsis",
      "icon": "assets/icon.ico"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true,
      "shortcutName": "DRINK MANAGE",
      "uninstallDisplayName": "DRINK MANAGE"
    }
  },
  "keywords": [
    "drink",
    "management",
    "hotel",
    "restaurant",
    "inventory",
    "react",
    "electron"
  ],
  "author": {
    "name": "HASSAN MIMCHE",
    "email": "nadiraamin26@gmail.com"
  },
  "description": "Application de gestion de boissons pour hôtels et restaurants"
}


