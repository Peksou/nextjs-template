var express = require('express');
var router = express.Router();
const Commentaire = require('../models/commentaires');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const { checkToken } = require('../modules/checkToken');

// -- GET - TOUS LES COMMENTAIRS DE L'UTILISATEUR -- //
router.get('/', (req, res) => {
    Commentaire.find()
      .populate('user', 'username lastname email') // Ne pas renvoyer le password/token
      .sort({ date: -1 })
      .then(dataComments => {
        res.json({ result: true, commentaires: dataComments });
      })
      .catch(err => {
        res.status(500).json({ result: false, error: 'Erreur serveur' });
      });
  });
  
// --🔒 POST - AJOUTER UN COMMENTAIRE D'UTILISATEUR  --  //
router.post('/', checkToken, (req, res) => {
    if (!checkBody(req.body, ['texte', 'note'])) {
      return res.status(400).json({ result: false, error: 'Champs manquants' });
    }
  
    // Vérifie que la note est bien comprise entre 1 et 5
    if (req.body.note < 1 || req.body.note > 5) {
      return res.status(400).json({ result: false, error: 'Note invalide' });
    }
  
    User.findOne({ token: req.body.token })
      .then(user => {
        if (!user) {
          return res.status(401).json({ result: false, error: 'Utilisateur introuvable' });
        }
  
        const newComment = new Commentaire({
          texte: req.body.texte,
          note: req.body.note,
          user: user._id
        });
  
        newComment.save().then(dataComment => {
          user.commentaires.push(dataComment._id);
          user.save().then(() => {
            res.json({ result: true, commentaire: dataComment });
          });
        });
      })
      .catch(() => {
        res.status(500).json({ result: false, error: 'Erreur serveur' });
      });
  });


// -- Récupérer uniquement les commentaires d’un utilisateur ?

// -- Afficher la note moyenne de l’appli ?


module.exports = router;