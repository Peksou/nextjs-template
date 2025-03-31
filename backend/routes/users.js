var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const uid2 = require('uid2');

const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');

/* GET TEST users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//GET ALL USERS
router.get("/allUsers", (req, res) => {
  User.find().then(data => {
    res.json(data);
    console.log("route get all users", data);
  })
})

//// ROUTE POST REGISTER : route pour créer un nouvel utilisateur
router.post('/register', (req, res) => {
  if (!checkBody(req.body, ['username', 'lastname', 'email', 'password'])) {
    return res.status(400).json({ result: false, error: 'Champs manquants ou vides' });
  }

  // Vérifie si l'email existe déjà
  User.findOne({ email: req.body.email })
    .then(data => {
      if (data) {
        return res.status(409).json({ result: false, error: 'Email déjà utilisé' });
      }

      const newUser = new User({
        username: req.body.username,
        lastname: req.body.lastname,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        token: uid2(32),
      });

      newUser.save().then(user => {
        res.json({ result: true, token: user.token });
      });
    })
    .catch(err => {
      console.error("Erreur MongoDB :", err); // 👈 pour afficher l’erreur précise
      res.status(500).json({ result: false, error: 'Erreur serveur' });
    });
});

//// ROUTE POST LOGIN : route pour connecter un utilisateur
router.post('/login', (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    return res.status(400).json({ result: false, error: 'Champs manquants' });
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ result: false, error: 'Email inconnu' });
      }

      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.json({ result: true, token: user.token });
      } else {
        res.status(401).json({ result: false, error: 'Mot de passe incorrect' });
      }
    })
    .catch(err => {
      res.status(500).json({ result: false, error: 'Erreur serveur' });
    });
});


module.exports = router;
