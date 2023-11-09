const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const counterSchema = new Schema({
    _id: String,
    sequence_value: Number
});

module.exports = mongoose.model('Counters', counterSchema, 'counters');