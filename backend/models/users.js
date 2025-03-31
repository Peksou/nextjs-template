const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    lastname: String,
    email: String,
    password: String,
    token: String,
})

const User = mongoose.model('users', userSchema);
module.exports = User