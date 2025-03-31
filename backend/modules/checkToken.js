const User = require('../models/User');

const checkToken = (req, res, next) => {
  const token = req.body.token || req.headers.authorization;

  if (!token) {
    return res.status(401).json({ result: false, error: 'Token manquant' });
  }

  User.findOne({ token }).then(user => {
    if (!user) {
      return res.status(403).json({ result: false, error: 'Token invalide' });
    }

    req.user = user; // Injecte l’utilisateur dans la requête
    next();
  }).catch(err => {
    res.status(500).json({ result: false, error: 'Erreur serveur' });
  });
};

module.exports = checkToken;
