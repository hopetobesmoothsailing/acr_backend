const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: Number,
    ID: String,
    name: String,
    email: String,
    Gen_cod: Number,
    Gen_txt: String,
    Age_cod: Number,
    Age_txt: String,
    Reg_cod: Number,
    Reg_txt: String,
    Area_cod: Number,
    Area_txt: String,
    PV_cod: Number,
    PV_txt: String,
    AC_cod: Number,
    AC_txt: String,
    Prof_cod: Number,
    Prof_txt: String,
    Istr_cod: Number,
    Istr_txt: String,
    weight_s: Number,
    password: String,
    isLogin: Number
});

module.exports = mongoose.model('Users', userSchema, 'users');