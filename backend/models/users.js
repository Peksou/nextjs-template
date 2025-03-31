const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    lastname: { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token:    { type: String, required: true },
    commentaires: [{type: mongoose.Schema.Types.ObjectId, ref: 'Commentaire'}],
})

const User = mongoose.model('users', userSchema);
module.exports = User
