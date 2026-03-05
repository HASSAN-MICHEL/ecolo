// import jwt from 'jsonwebtoken';
// import User from '../models/user.js';

// const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_super_securisee';

// export const authenticateToken = async (req, res, next) => {
//   try {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

//     if (!token) {
//       return res.status(401).json({ error: 'Token d\'accès requis' });
//     }

//     const decoded = jwt.verify(token, JWT_SECRET);
//     const user = await User.findById(decoded.userId);
    
//     if (!user || !user.is_active) {
//       return res.status(403).json({ error: 'Utilisateur non autorisé ou désactivé' });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     return res.status(403).json({ error: 'Token invalide' });
//   }
// };

// export const requireRole = (roles) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({ error: 'Non authentifié' });
//     }

//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ error: 'Permissions insuffisantes' });
//     }

//     next();
//   };
// };

// export const generateToken = (userId) => {
//   return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
// };


