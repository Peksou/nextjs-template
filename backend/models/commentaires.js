const mongoose = require('mongoose');

const commentaireSchema = new mongoose.Schema({
    texte: {
        type: String, required: true,
    },
    note: {
        type: Number, min: 1, max: 5, required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true,
    },
    date: {
        type: Date, default: Date.now
    }
});

const Commentaire = mongoose.model('Commentaire', commentaireSchema);
module.exports = Commentaire;