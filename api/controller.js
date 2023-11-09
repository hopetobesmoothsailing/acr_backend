const Users = require("../model/User");
const ACRLog = require('../model/ACRLog');
const Counters = require('../model/Counter');
const md5 = require("md5");

exports.signup = async (req, res) => {
    const name = req.body.name;
    const last_name = req.body.last_name;
    const gender = req.body.gender;
    const email = req.body.email;
    const age = req.body.age;
    const password = md5(req.body.password);
    const newUser = Users({ _id: await getNextSequenceValue('users'), name, last_name, gender, age, email, password});
    if ((await Users.find({email}, {_id: 0, __v: 0}).exec()).length > 0) {
        res.send({
            status: 'already exists',
            comment: 'Email has already existed'
        });
    } else {
        const result = await newUser.save();
        if (result !== undefined) {
            res.send({
                status: 'success'
            })
        } else {
            res.send({
                status: 'Error Found'
            })
        }
    }
}

exports.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = (await Users.find({email}, {__v: 0}).exec())[0];
    if (user !== undefined) {
        if (md5(password) === user.password) {
            res.send({
                status: 'success',
                user: user
            })
        } else {
            res.send({
                status: 'wrong password',
                comment: 'Password is not matching'
            })
        }
    } else {
        res.send({
            status: 'not registered',
            comment: 'user is not registered'
        })
    }
}

exports.registerACRResult = async (req, res) => {
    const acrResults = req.body.acr_results;
    if (acrResults.length === 0) {
        res.send({
            status: 'no data',
            comment: 'No ACR Results'
        })
    } else {
        acrResults.forEach(r => {
            const newLog = ACRLog({
                user_id: r['user_id'],
                uuid: r['uuid'],
                imei: r['imei'],
                model: r['model'],
                brand: r['brand'],
                acr_result: r['acr_result'],
                duration: r['duration'],
                record_at: r['record_at'],
                register_at: new Date()
            });
            newLog.save();
        })
    }
}

const getNextSequenceValue = async (sequenceName) => {
    const sequenceDocument = await Counters.findOneAndUpdate(
        {_id: sequenceName},
        {$inc: {sequence_value: 1}},
        {new: true, upsert: true}
    );
    console.log(sequenceDocument);
    return sequenceDocument.sequence_value;
}