const mongoose = require('mongoose')
const moment = require("moment");
const Schema = mongoose.Schema;

const acrLogSchema = new Schema({
    user_id: Number,
    uuid: String,
    imei: String,
    model: String,
    brand: String,
    acr_result: String,
    duration: Number,
    longitude: String,
    latitude: String,
    location_address: String,
    recorded_at: String,
    f_recorded_at: {
        type: Date,
        default: moment(Date.now()).utcOffset('+0100')
    },
    registered_at: String
});

module.exports = mongoose.model('ACRLog', acrLogSchema, 'acr_log');