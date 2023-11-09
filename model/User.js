const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: Number,
    name: String,
    last_name: String,
    gender: String,
    age: Number,
    email: String,
    password: String,
});

module.exports = mongoose.model('Users', userSchema, 'users');