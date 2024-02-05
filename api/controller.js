const Users = require("../model/User");
const ACRLog = require('../model/ACRLog');
const Palinsesto = require('../model/Palinsesto');
const Counters = require('../model/Counter');
const md5 = require("md5");
const nodemailer = require('nodemailer');
// const moment = require("moment");
const moment = require('moment-timezone');
const multer = require('multer');
const xlsx = require('xlsx');
const Palinsestom = require('../model/Palinsestom');

// Setup storage engine
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');  // Ensure this directory exists
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ dest: 'uploads/' });

// const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const fs = require('fs');



exports.signup = async (req, res) => {
    const ID = req.body.id;
    const name = req.body.name;
    const email = req.body.email;
    const Gen_cod = req.body.gen_cod === '-' ? 0 : req.body.gen_cod;
    const Gen_txt = req.body.gen_txt;
    const Age_cod = req.body.age_cod === '-' ? 0 : req.body.age_cod;
    const Age_txt = req.body.age_txt;
    const Reg_cod = req.body.reg_cod === '-' ? 0 : req.body.reg_cod;
    const Reg_txt = req.body.reg_txt;
    const Area_cod = req.body.area_cod === '-' ? 0 : req.body.area_cod;
    const Area_txt = req.body.area_txt;
    const PV_cod = req.body.pv_cod === '-' ? 0 : req.body.pv_cod;
    const PV_txt = req.body.pv_txt;
    const AC_cod = req.body.ac_cod === '-' ? 0 : req.body.ac_cod;
    const AC_txt = req.body.ac_txt;
    const Prof_cod = req.body.prof_cod === '-' ? 0 : req.body.prof_cod;
    const Prof_txt = req.body.prof_txt;
    const Istr_cod = req.body.istr_cod === '-' ? 0 : req.body.istr_cod;
    const Istr_txt = req.body.istr_txt;
    const password = md5(req.body.password);
    const weight_s = req.body.weight_s;
    const Age2_cod = req.body.age2_cod === '-' ? 0 : req.body.age2_cod;
    const Age2_txt = req.body.age2_txt === '-' ? 0 : req.body.age2_txt;
    const Age3_cod = req.body.age3_cod === '-' ? 0 : req.body.age3_cod;
    const Age3_txt = req.body.age3_txt === '-' ? 0 : req.body.age3_txt;
    const device = req.body.device
    const newUser = Users({
        _id: await getNextSequenceValue('users'),
        ID,
        name,
        email,
        Gen_cod,
        Gen_txt,
        Age_cod,
        Age_txt,
        Reg_cod,
        Reg_txt,
        Area_cod,
        Area_txt,
        PV_cod,
        PV_txt,
        AC_cod,
        AC_txt,
        Prof_cod,
        Prof_txt,
        Istr_cod,
        Istr_txt,
        weight_s,
        password,
        isLogin: 0,
        role: 4,
        device,
        Age2_cod,
        Age2_txt,
        Age3_cod,
        Age3_txt
    });
    if ((await Users.find({email}, {_id: 0, __v: 0}).exec()).length > 0) {
        await Users.findOneAndUpdate({email}, {
            Gen_cod,
            Gen_txt,
            Age_cod,
            Age_txt,
            Reg_cod,
            Reg_txt,
            Area_cod,
            Area_txt,
            PV_cod,
            PV_txt,
            AC_cod,
            AC_txt,
            Prof_cod,
            Prof_txt,
            Istr_cod,
            Istr_txt,
            role: 4,
            weight_s,
            device,
            Age2_cod,
            Age2_txt,
            Age3_cod,
            Age3_txt
        });
        res.send({status: 'success', comment: 'user updated'});
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
    const user_id = req.body.user_id;
    const uuid = req.body.uuid;
    const imei = req.body.imei;
    const model = req.body.model;
    const brand = req.body.brand;
    const acr_result = req.body.acr_result;
    const duration = req.body.duration;
    const longitude = req.body.longitude;
    const latitude = req.body.latitude;
    const location_address = req.body.locationAddress;
    const recorded_at = req.body.recorded_at; // Format DD/MM/YYYY HH:mm
    const appVersion = req.body.app_version;
    const newLog = ACRLog({
        user_id,
        uuid,
        imei,
        model,
        brand,
        acr_result,
        duration,
        longitude,
        latitude,
        location_address,
        recorded_at,
        f_recorded_at: (moment(recorded_at, 'DD/MM/YYYY HH:mm').utcOffset('+0100')),
        registered_at: (new Date()).toLocaleString('en-US', {hour12: false})
    });
    const result = await newLog.save();
    if (result !== undefined) {
        if (appVersion !== undefined) {
            await Users.updateOne({_id: user_id}, {isLogin: 1, appVersion})
        } else {
            await Users.updateOne({_id: user_id}, {isLogin: 1})
        }
        res.send({
            status: 'success'
        });
    } else {
        res.send({
            status: 'error',
            comment: 'DB Error'
        });
    }
}

exports.getUsers = async (req, res) => {
    const users = (await Users.find({}, {__v: 0}).exec());
    res.send({
        status: 'success',
        users
    })
}

exports.getACRDetails = async (req, res) => {
    try {
        const acrDetails = await ACRLog.find(
            {latitude: {$exists: true, $ne: ''}, longitude: {$exists: true, $ne: ''}}, // Filter for non-empty latitudes and longitudes
            {__v: 0}
        ).sort({recorded_at: -1}); // Sort by recorded_at field in descending order

        res.send({
            status: 'success',
            acrDetails
        });
    } catch (error) {
        res.status(500).send({status: 'error', message: 'Failed to fetch ACR details'});
    }
};

exports.getACRDetailsByDate = async (req, res) => {
    try {
        const {date} = req.body; // Assuming the date is sent in the request body
        // Handle the date format conversion if necessary to match MongoDB date format

        // Use the date to fetch ACR details from MongoDB
        // Modify this part according to your database schema and retrieval logic
        // Assuming date is in the format 'dd/MM/yyyy', adjust the regex pattern accordingly
        const regexPattern = new RegExp(`^${date}`);
        console.log('Regex Pattern:', date); // Log the regex pattern
        // Query ACR details based on the regex pattern for recorded_at
        const acrDetails = await ACRLog.find({recorded_at: {$regex: date}});

        //  console.log(acrDetails);
        res.send({
            status: 'success',
            acrDetails,
        });
    } catch (error) {
        console.error('Error fetching ACR details by date:', error);
        res.status(500).send({
            status: 'error',
            message: 'Failed to fetch ACR details by date',
        });
    }
};

exports.getExportACRDetailsByDateRTV = async (req, res) => {
    try {
        const date = req.body.date;
        const formattedDate = date.replace(/\//g, '-');
        // Define the match stage based on type and wonull
        let matchCondition = { "recorded_at": { "$regex": date } };
        const pipeline = [
            {
                "$match": matchCondition
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "user_id",
                    "foreignField": "_id",
                    "as": "user_data"
                }
            },
            {
                "$unwind": "$user_data"
            },
            { 
                "$project": {
                    "user_id": 1,
                    "acr_result": 1,
                    "recorded_at": 1,
                    "model":1,
                    "brand":1,
                    "ID": "$user_data.ID",
                    "weight_s": "$user_data.weight_s",
                    "Age_cod": "$user_data.Age_cod",
                    "Age_txt": "$user_data.Age_txt",
                    "Gen_cod": "$user_data.Gen_cod",
                    "Gen_txt": "$user_data.Gen_txt",
                    "Reg_cod": "$user_data.Age_cod",
                    "Reg_txt": "$user_data.Reg_txt",
                    "PV_cod": "$user_data.PV_cod",
                    "PV_txt": "$user_data.PV_txt",
                    "Area_cod": "$user_data.Area_cod",
                    "Area_txt": "$user_data.Area_txt",
                    "Istr_cod": "$user_data.Istr_cod",
                    "Istr_txt": "$user_data.Istr_txt",
                    "Prof_cod": "$user_data.Prof_cod",
                    "Prof_txt": "$user_data.Prof_txt",
                    "AC_cod": "$user_data.AC_cod",
                    "AC_txt": "$user_data.AC_txt",
                    "email": "$user_data.email"
                }
            }
        ];
        

        const acrDetails = await ACRLog.aggregate(pipeline);

        if (acrDetails.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No ACR details found for the given date and type.',
            });
        }


        const csvStringifier = createCsvStringifier({
            header: [
              //  { id: '_id', title: 'ID' },
                { id: 'user_id', title: 'User ID' },
                { id: 'ID', title: 'ID_NOTO' },
                //  { id: 'uuid', title: 'UUID' },
              //  { id: 'imei', title: 'IMEI' },
                { id: 'model', title: 'Model' },
                { id: 'brand', title: 'Brand' },
                { id: 'acr_result', title: 'ACR Result' },
                { id: 'recorded_at', title: 'Recorded At' },
              //  { id: 'name', title: 'Name' },
                { id: 'email', title: 'Email' },
                { id: 'Gen_cod', title: 'Gen Cod' },
                { id: 'Gen_txt', title: 'Gen Txt' },
                { id: 'Age_cod', title: 'Age Cod' },
                { id: 'Age_txt', title: 'Age Txt' },
                { id: 'Reg_cod', title: 'Reg Cod' },
                { id: 'Reg_txt', title: 'Reg Txt' },
                { id: 'Area_cod', title: 'Area Cod' },
                { id: 'Area_txt', title: 'Area Txt' },
                { id: 'PV_cod', title: 'PV Cod' },
                { id: 'PV_txt', title: 'PV Txt' },
                { id: 'AC_cod', title: 'AC Cod' },
                { id: 'AC_txt', title: 'AC Txt' },
                { id: 'Prof_cod', title: 'Prof Cod' },
                { id: 'Prof_txt', title: 'Prof Txt' },
                { id: 'Istr_cod', title: 'Istr Cod' },
                { id: 'Istr_txt', title: 'Istr Txt' },
                { id: 'weight_s', title: 'PESO' }
             /*   { id: 'isLogin', title: 'Is Login' }, */
            ],
        });
 
        const csvData = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(acrDetails);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=ACR_Details_${formattedDate}.csv`);
        res.status(200).send(csvData);
    } catch (error) {
        console.error('Error fetching or exporting ACR type details by date:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch or export ACR type details by date',
        });
    }
};

exports.getCsvByDateRTV = async (req, res) => {
    console.log ("CSVDATERTV");
    try {
        const date = req.body.date;
        const type = req.body.type;
        const wonull = req.body.notnull; 

        const channels_tv = ['RAI1', 'RAI2', 'RAI3', 'RETE4', 'CANALE5', 'ITALIA1', 'LA7'];

        // Define the match stage based on type and wonull
        let matchCondition = { "recorded_at": { "$regex": date } };
        if (wonull === 'yes') {
            matchCondition["acr_result"] = { "$ne": "NULL" };
        }
        if (type === 'TV') {
            matchCondition["acr_result"] = { ...matchCondition["acr_result"], "$in": channels_tv };
        } else if (type === 'RADIO') {
            matchCondition["acr_result"] = { ...matchCondition["acr_result"], "$nin": channels_tv };
        }

        // Aggregation pipeline
        const pipeline = [
            {
                "$match": matchCondition
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "user_id",
                    "foreignField": "_id",
                    "as": "user_data"
                }
            },
            {
                "$unwind": "$user_data"
            },
            {
                "$project": {
                    "user_id": 1,
                    "acr_result": 1,
                    "recorded_at": 1,
                    "user_ID": "$user_data.ID",
                    "weight_s": "$user_data.weight_s",
//                    "email": "$user_data.email"
                }
            }
        ];
        

        // Aggregate query
        const acrDetails = await ACRLog.aggregate(pipeline);

        if (acrDetails.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No ACR details found for the given date and type.',
            });
        }
        
        res.send({
            status: 'success',
            acrDetails,
        });
    } catch (error) {
        console.error('Error fetching ACR type details by date:', error);
        res.status(500).send({
            status: 'error',
            message: 'Failed to fetch ACR type details by date',
        });
    }
};

exports.getACRDetailsByDateRTV = async (req, res) => {
    try {
        const date = req.body.date;
        const type = req.body.type;
        const wonull = req.body.notnull; 

        const channels_tv = ['RAI1', 'RAI2', 'RAI3', 'RETE4', 'CANALE5', 'ITALIA1', 'LA7'];
        
        // Define the match stage based on type and wonull
        let matchCondition = { "recorded_at": { "$regex": date }, "user_id" : {"$gte": 68} };
        if (wonull === 'yes') { 
            matchCondition["acr_result"] = { "$ne": "NULL" };
        }
        if (type === 'TV') {
            matchCondition["acr_result"] = { ...matchCondition["acr_result"], "$in": channels_tv };
        } else if (type === 'RADIO') {
            matchCondition["acr_result"] = { ...matchCondition["acr_result"], "$nin": channels_tv };
        }

        // Aggregation pipeline
        const pipeline = [
            {
                "$match": matchCondition
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "user_id",
                    "foreignField": "_id",
                    "as": "user_data"
                }
            },
            {
                "$unwind": "$user_data"
            },
            {
                "$project": {
                    "user_id": 1,
                    "acr_result": 1,
                    "recorded_at": 1,
                    "model":1,
                    "brand":1,
                    "user_ID": "$user_data.ID",
                    "weight_s": "$user_data.weight_s",
        //                    "email": "$user_data.email"
                }
            }
        ];
        

        // Aggregate query
        const acrDetails = await ACRLog.aggregate(pipeline);

        res.send({
            status: 'success',
            acrDetails,
        });
    } catch (error) {
        console.error('Error fetching ACR type details by date:', error);
        res.status(500).send({
            status: 'error',
            message: 'Failed to fetch ACR type details by date',
        });
    }
};
exports.getACRDetailsByRangeRTV = async (req, res) => {
    try {
        const startDate = req.body.startDate; // Expected in YYYY-MM-DD
        const stopDate = req.body.stopDate || startDate; // Use startDate if stopDate is not defined
        const type = req.body.type;
        const wonull = req.body.notnull; 
        console.log("StartDate",startDate);
        console.log("StopDate",startDate);

        // Assuming 'f_recorded_at' is in ISO date format and can be compared directly
        let matchCondition = {
            "f_recorded_at": { "$gte": new Date(startDate), "$lte": new Date(stopDate) },
            "user_id" : {"$gte": 68} // Assuming user_id filtering is still required
        };

        if (wonull === 'yes') { 
            matchCondition["acr_result"] = { "$ne": "NULL" };
        }
        const channels_tv = ['RAI1', 'RAI2', 'RAI3', 'RETE4', 'CANALE5', 'ITALIA1', 'LA7'];
        if (type === 'TV') {
            matchCondition["acr_result"] = { ...matchCondition["acr_result"], "$in": channels_tv };
        } else if (type === 'RADIO') {
            matchCondition["acr_result"] = { ...matchCondition["acr_result"], "$nin": channels_tv };
        }

        // Aggregation pipeline
        const pipeline = [
            {
                "$match": matchCondition
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "user_id",
                    "foreignField": "_id",
                    "as": "user_data"
                }
            },
            {
                "$unwind": "$user_data"
            },
            {
                "$project": {
                    "user_id": 1,
                    "acr_result": 1,
                    "recorded_at": 1,
                    "model":1,
                    "brand":1,
                    "user_ID": "$user_data.ID",
                    "weight_s": "$user_data.weight_s",
        //                    "email": "$user_data.email"
                }
            }
        ];

        const acrDetails = await ACRLog.aggregate(pipeline);

        res.send({
            status: 'success',
            acrDetails,
        });
    } catch (error) {
        console.error('Error fetching ACR type details by date:', error);
        res.status(500).send({
            status: 'error',
            message: 'Failed to fetch ACR type details by date',
        });
    }
};

exports.getACRDetailsByDateAndUser = async (req, res) => {
    
    try {
        const  date = req.body.date; // Assuming the parameters are sent in the query string
        const  user_id = req.body.userId; // Assuming the parameters are sent in the query string
        let acrDetails = [];
        // Use the date and user_id to fetch ACR details from MongoDB
        // Modify this part according to your database schema and retrieval logic
        // Assuming date is in the format 'dd/MM/yyyy', adjust the regex pattern accordingly
        // const regexPattern = new RegExp(`^${date.replace(/\//g, '-')}`);
        console.log("Data da cercare",date);
        console.log("ID da cercare",user_id);
        const [day, month, year] = date.split('-');
        const newdate = `${day}/${month}/${year}`;
        // Query ACR details based on the regex pattern for recorded_at and user_id
        if (date !== '') 
        acrDetails = await ACRLog.find({ recorded_at: { $regex: newdate }, user_id: parseInt(user_id) });
        else 
        acrDetails = await ACRLog.find({ user_id: parseInt(user_id) });

        res.send({
            status: 'success',
            acrDetails,
        });
    } catch (error) {
        console.error('Error fetching ACR details by date and user:', error);
        res.status(500).send({
            status: 'error',
            message: 'Failed to fetch ACR details by date and user',
        });
    }
};
exports.getACRDetailsByDateTimeslot = async (req, res) => {
    try {
        const {date} = req.body; // Assuming the date is sent in the request body

        // Assuming date is in the format 'dd/MM/yyyy'
        const [day, month, year] = date.split('/');
        const startDate = new Date(year, month - 1, day); // Month needs to be zero-based in JavaScript Date

        // Create time slot intervals (3 hours each)
        const timeSlots = [];
        for (let i = 0; i < 8; i++) {
            const startHour = i * 3;
            const endHour = startHour + 2;
            const timeSlot = {
                start: new Date(startDate).setHours(startHour, 0, 0, 0),
                end: new Date(startDate).setHours(endHour, 59, 59, 999),
                label: `${startHour.toString().padStart(2, '0')}:00 - ${endHour.toString().padStart(2, '0')}:59`,
            };
            timeSlots.push(timeSlot);
        }
        console.log("timeSlots[0].start");
        console.log(timeSlots[0].start);
        const acrDetails = await ACRLog.find({
            recorded_at: {
                $gte: new Date(`${date} ${timeSlots[0].start}`), // Start of the first time slot
                $lte: new Date(`${date} ${timeSlots[timeSlots.length - 1].end}`), // End of the last time slot
            },
        });
        console.log("acrDetails");
        console.log(acrDetails);

        const groupedDetails = timeSlots.map((slot) => {
            const slotDetails = acrDetails.filter((detail) => {
                const recordedDate = new Date(detail.recorded_at);
                return recordedDate >= slot.start && recordedDate <= slot.end;
            });
            const groupedByChannel = {}; // Grouping by acr_result for each time slot
            slotDetails.forEach((detail) => {
                if (!groupedByChannel[detail.acr_result]) {
                    groupedByChannel[detail.acr_result] = 1;
                } else {
                    groupedByChannel[detail.acr_result]++;
                }
            });
            return {
                label: slot.label,
                data: groupedByChannel,
            };
        });

        console.log(groupedDetails);
        res.send({
            status: 'success',
            groupedDetails,
        });
    } catch (error) {
        console.error('Error fetching ACR details by date:', error);
        res.status(500).send({
            status: 'error',
            message: 'Failed to fetch ACR details by date',
        });
    }
};

exports.getACRResults = async (req, res) => {
    let acrResults = [];
    const results = await ACRLog.aggregate([
        {
            $match: {acr_result: {$ne: 'NULL'}}
        },
        {
            $group: {_id: {'title': '$acr_result', 'date': '$recorded_at'}, total_count: {$sum: 1}}
        },
        {
            $sort: {'_id.title': 1}
        }
    ], {allowDiskUse: true}).exec();
    for (const item of results) {
        const users = await ACRLog.aggregate([
            {
                $match: {acr_result: {$eq: item._id.title}, recorded_at: {$eq: item._id.date}}
            },
            {
                $group: {_id: '$user_id'}
            },
        ], {allowDiskUse: true}).exec();
        const phones = await ACRLog.aggregate([
            {
                $match: {acr_result: {$eq: item._id.title}, recorded_at: {$eq: item._id.date}}
            },
            {
                $group: {_id: '$brand'}
            }
        ], {allowDiskUse: true}).exec();
        acrResults = [...acrResults, {
            title: item._id.title,
            date: item._id.date,
            total_count: item.total_count,
            user_count: users.length,
            phone_count: phones.length
        }];
    }
    res.send({
        status: 'success',
        acrResults
    })
}

exports.getUserCountByTime = async (req, res) => {
    const timeDistance = req.body.timeDistance;
    const date = req.body.date;
}

exports.getACRDetailsByDate = async (req, res) => {
    try {
        const {date} = req.body; // Assuming the date is sent in the request body
        // Handle the date format conversion if necessary to match MongoDB date format

        // Use the date to fetch ACR details from MongoDB
        // Modify this part according to your database schema and retrieval logic
        // Assuming date is in the format 'dd/MM/yyyy', adjust the regex pattern accordingly
        const regexPattern = new RegExp(`^${date}`);
        console.log('Regex Pattern:', date); // Log the regex pattern
        // Query ACR details based on the regex pattern for recorded_at
        const acrDetails = await ACRLog.find({recorded_at: {$regex: date}});

        //  console.log(acrDetails);
        res.send({
            status: 'success',
            acrDetails,
        });
    } catch (error) {
        console.error('Error fetching ACR details by date:', error);
        res.status(500).send({
            status: 'error',
            message: 'Failed to fetch ACR details by date',
        });
    }
};

exports.getResultsByDateAndChannel = async (req, res) => {
    try {
        const {date, acr_result} = req.body; // Assuming date and acr_result are sent in the request body

        // Handle the date format conversion if necessary to match MongoDB date format

        // Create a regular expression for the date
        const dateRegexPattern = new RegExp(`^${date}`);

        // Query ACR details based on the regex pattern for recorded_at and acr_result
        const acrDetails = await ACRLog.find({
            recorded_at: {$regex: dateRegexPattern},
            acr_result: acr_result // Add acr_result filter
        });

        res.send({
            status: 'success',
            acrDetails,
        });
    } catch (error) {
        console.error('Error fetching ACR details by date:', error);
        res.status(500).send({
            status: 'error',
            message: 'Failed to fetch ACR details by date',
        });
    }
};


exports.getACRDetailsByDateTimeslot = async (req, res) => {
    try {
        const {date} = req.body; // Assuming the date is sent in the request body

        // Assuming date is in the format 'dd/MM/yyyy'
        const [day, month, year] = date.split('/');
        const startDate = new Date(year, month - 1, day); // Month needs to be zero-based in JavaScript Date

        // Create time slot intervals (3 hours each)
        const timeSlots = [];
        for (let i = 0; i < 8; i++) {
            const startHour = i * 3;
            const endHour = startHour + 2;
            const timeSlot = {
                start: new Date(startDate).setHours(startHour, 0, 0, 0),
                end: new Date(startDate).setHours(endHour, 59, 59, 999),
                label: `${startHour.toString().padStart(2, '0')}:00 - ${endHour.toString().padStart(2, '0')}:59`,
            };
            timeSlots.push(timeSlot);
        }
        console.log("timeSlots[0].start");
        console.log(timeSlots[0].start);
        const acrDetails = await ACRLog.find({
            recorded_at: {
                $gte: new Date(`${date} ${timeSlots[0].start}`), // Start of the first time slot
                $lte: new Date(`${date} ${timeSlots[timeSlots.length - 1].end}`), // End of the last time slot
            },
        });
        console.log("acrDetails");
        console.log(acrDetails);

        const groupedDetails = timeSlots.map((slot) => {
            const slotDetails = acrDetails.filter((detail) => {
                const recordedDate = new Date(detail.recorded_at);
                return recordedDate >= slot.start && recordedDate <= slot.end;
            });
            const groupedByChannel = {}; // Grouping by acr_result for each time slot
            slotDetails.forEach((detail) => {
                if (!groupedByChannel[detail.acr_result]) {
                    groupedByChannel[detail.acr_result] = 1;
                } else {
                    groupedByChannel[detail.acr_result]++;
                }
            });
            return {
                label: slot.label,
                data: groupedByChannel,
            };
        });

        console.log(groupedDetails);
        res.send({
            status: 'success',
            groupedDetails,
        });
    } catch (error) {
        console.error('Error fetching ACR details by date:', error);
        res.status(500).send({
            status: 'error',
            message: 'Failed to fetch ACR details by date',
        });
    }
};

const getNextSequenceValue = async (sequenceName) => {
    const sequenceDocument = await Counters.findOneAndUpdate(
        {_id: sequenceName},
        {$inc: {sequence_value: 1}},
        {new: true, upsert: true}
    );
    return sequenceDocument.sequence_value;
}

exports.sendReminderEmailToInactiveUsers = async (req, res) => {
    try {
        const {date} = req.body; // Assuming the date is sent in the request body
        // Handle the date format conversion if necessary to match MongoDB date format

        // Use the date to fetch ACR details from MongoDB
        // Modify this part according to your database schema and retrieval logic
        // Assuming date is in the format 'dd/MM/yyyy', adjust the regex pattern accordingly
        const activeUsers = []
        const acrDetails = await ACRLog.find({recorded_at: {$regex: date}});
        acrDetails.forEach((detail) => {
            if (!activeUsers.includes(detail.user_id)) {
                activeUsers.push(detail.user_id);
            }
        });
        console.log("Active Users");
        console.log(activeUsers);

        // Find users who haven't sent data in the last 24 hours
        const inactiveUsers = await Users.find({
            _id: {$nin: activeUsers}
        });
        console.log("INACTIVE USERS");
        console.log(inactiveUsers);
        // Prepare and send emails to inactive users
        inactiveUsers.forEach(async (user) => {
            const {email, name} = user; // Assuming User model has 'email' and 'name' fields

            // Create transporter for sending emails
            const transporter = nodemailer.createTransport({
                host: 'smtps.aruba.it',
                port: 465,
                secure: true, // true for SSL
                auth: {
                    user: 'noreply@chartmusic.it',
                    pass: 'Norepchrt.2022',
                },
            });


            // Email content
            const mailOptions = {
                from: 'noreply@chartmusic.it',
                // to: email,
                to: 'antonio.trigiani@gmail.com',
                subject: 'RadioMonitor Reminder: Verifica invio dati',
                text: `Ciao ${name} ${email},\n\nQuesto messaggio per ricordarti di avviare l'app RadioMonitor. Sono passate 24 ore da quando abbiamo ricevuto il tuo ultimo invio. Ti chiediamo gentilmente se ti sia possibile avviare il riconoscimento chiudendo e riavviando l'applicazione o effettuando un doppio tap sullo schermo attendendo che il pulsante diventi di colore blu. Grazie davvero per la tua preziosa collaborazione!\n\nA presto, lo staff di RadioMonitor`,
            };

            // Send email
            // await transporter.sendMail(mailOptions);
            return res = "OK";
        });

        console.log('Reminder emails sent to inactive users.');
    } catch (error) {
        console.error('Error sending reminder emails:', error);
    }
};
exports.getAppStatusUsers = async (req, res) => {
    try {
        const {date} = req.body; // Assuming the date is sent in the request body
        const activeUsers = []
        const acrDetails = await ACRLog.find({recorded_at: {$regex: date}});
        acrDetails.forEach((detail) => {
            if (!activeUsers.includes(detail.user_id)) {
                activeUsers.push(detail.user_id);
            }
        });
        console.log("Active Users for data ",date);
        console.log(activeUsers);

        // Find users who haven't sent data in the last 24 hours
        const allactiveUsers = await Users.find({
            _id: {$in: activeUsers}
        });
        const allinactiveUsers = await Users.find({
            _id: {$nin: activeUsers}
        });
        console.log("INACTIVE USERS for data ",date);
        console.log(allinactiveUsers);
        // Prepare and send emails to inactive users
        
        res.send({
            status: 'success',
            activeUsers: allactiveUsers,
            inactiveUsers: allinactiveUsers,
        });
    } catch (error) {
        console.error('Error sending reminder emails:', error);
    }
};
exports.getAppActivatedUsers = async (req, res) => {
    try {
        const { date } = req.body; // Assuming the date is sent in the request body
    
        // Parse the date in the dd/mm/yyyy format and convert it to ISO format
        const [day, month, year] = date.split('/');
        const isoDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
    
        const activeUsers = [];
        const acrDetails = await ACRLog.find({ f_recorded_at: { $gte: isoDate } });
    
        acrDetails.forEach((detail) => {
          if (!activeUsers.includes(detail.user_id)) {
            console.log("Found user id", detail.user_id);
            console.log("Found active user", detail.recorded_at);
            activeUsers.push(detail.user_id);
          }
        });
    
        console.log("GetAppActivatedUser: Active Users for date", date);
        console.log(activeUsers);
    
        // Find users who haven't sent data in the last 24 hours
        const allActiveUsers = await Users.find({
          _id: { $in: activeUsers }
        });
    
        const allInactiveUsers = await Users.find({
          _id: { $nin: activeUsers }
        });
    
        console.log("GetAppActivatedUser: INACTIVE USERS for date", date);
        console.log(allInactiveUsers);
    
        // Prepare and send emails to inactive users
        res.send({
          status: 'success',
          activeUsers: allActiveUsers,
          inactiveUsers: allInactiveUsers,
        });
      } catch (error) {
        console.error('Error sending GetAppActivatedUser:', error);
      }
};
// Helper function to get active user IDs who sent data in the last 6 hours
const getActiveUsersIds = async (dateBefore24Hours) => {
    try {

        // Find user IDs who sent data in the last 6 hours
        const activeUserIds = await ACRLog.distinct('user_id', {
            recorded_at: {$gte: dateBefore24Hours}
        });
        return activeUserIds;
    } catch (error) {
        console.error('Error fetching active user IDs:', error);
        return [];
    }
};



  exports.getPalinsestoByDateAndChannel = async (req, res) => {
    try {
        const { date, channel_name } = req.body; // Assuming date and acr_result are sent in the request body

        // Handle the date format conversion if necessary to match MongoDB date format

        // Create a regular expression for the date
        const dateRegexPattern = new RegExp(`^${date}`);

        // Query ACR details based on the regex pattern for recorded_at and acr_result
        const palDetails = await Palinsesto.find({
            day: { $regex: dateRegexPattern },
            "events.channel.name":channel_name // Add acr_result filter
        });

        res.send({
            status: 'success',
            palDetails,
        });
    } catch (error) {
        console.error('Error fetching PALINSESTO details by date:', error);
        res.status(500).send({
            status: 'error',
            message: 'Failed to fetch PALINSESTO details by date',
        });
    }
};
exports.getPalinsestomByDateAndChannel = async (req, res) => {
    try {
        const { date, channel_name } = req.body; // Assuming date and acr_result are sent in the request body

        // Handle the date format conversion if necessary to match MongoDB date format

        // Create a regular expression for the date
        const dateRegexPattern = new RegExp(`^${date}`);

        // Query ACR details based on the regex pattern for recorded_at and acr_result
        const palDetails = await Palinsestom.find({
            day: { $regex: dateRegexPattern },
            "events.channel.name":channel_name // Add acr_result filter
        });

        res.send({
            status: 'success',
            palDetails,
        });
    } catch (error) {
        console.error('Error fetching PALINSESTO details by date:', error);
        res.status(500).send({
            status: 'error',
            message: 'Failed to fetch PALINSESTO details by date',
        });
    }
};

exports.uploadPalinsestom = async (req, res) => {
    try {
        const file = req.file;

        // Read the Excel file
        const workbook = xlsx.readFile(file.path);
        const sheetNames = workbook.SheetNames;

        for (const sheetName of sheetNames) {
            const worksheet = workbook.Sheets[sheetName];
            const dayData = xlsx.utils.sheet_to_json(worksheet);

            const channelInfo = getChannelInfo(sheetName); // Get channel info based on the sheet name
            const documentId = await getNextSequenceValue('palinsestom'); // Ensure this generates a unique _id

            let currentStartTime = null; // Initialize currentStartTime

            const events = dayData.reduce((acc, event) => {
                let start_time_str = event['ORA_INIZIO'];
                const duration_str = event['DURATASO'];
                const date_str = event['SC_DATA'];

                if (!start_time_str && currentStartTime) {
                    // Use the last end time as the start time for this event
                    start_time_str = currentStartTime.format('HH:mm:ss');
                } else if (start_time_str) {
                    // Update currentStartTime when ORA_INIZIO is provided
                    currentStartTime = moment.tz(start_time_str, 'HH:mm:ss', 'Europe/Rome');
                }

                const duration = moment.duration(duration_str, 'seconds');
                const end_time = moment(currentStartTime).add(duration);
                // Update currentStartTime to the end time for the next iteration
                
                // Format the date from DD-MM-YYYY to YYYY-MM-DD for consistent handling
                const formattedDate = moment.tz(date_str, 'DD-MM-YYYY', 'Europe/Rome').format('YYYY-MM-DD');
              
                acc.push({
                    title: event['TITOLO'],
                    channel: channelInfo,
                    date: formattedDate.replace(/-/g, '/'),
                    hour: currentStartTime.format('HH:mm'),
                    time_interval: `${currentStartTime.format('HH:mm')} - ${end_time.format('HH:mm')}`,
                    duration: duration_str,
                    duration_in_minutes: `${Math.round(duration.asMinutes())} min`,
                    duration_small_format: `${Math.floor(duration.asHours())}:${duration.minutes().toString().padStart(2, '0')}`,
                    start_date: currentStartTime.format(),
                    end_date: end_time.format(),
                });
                currentStartTime = end_time;

                return acc;
            }, []);
        
            const newPalinsesto = new Palinsestom({
                _id: documentId,
                day: dayData[0]?.['SC_DATA'],
                events: events
            });

            // Insert into MongoDB (consider checking for duplicates)
            await newPalinsesto.save();
        }

        res.send({ status: 'success', message: 'File processed and data saved.' });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).send({ status: 'error', message: 'Error processing file.' });
    }
};

 

function getChannelInfo(sheetName) {
    // Replace with actual logic to map sheetName to channel details
    // Example:
    if (sheetName === 'Radio1') {
      return {
        name: 'RAIRadio1',
        category_path: 'radio1',
        palinsesto_url: 'rai-radio-1',
        palinsesto_name: 'Radio 1'
      };
    }
    if (sheetName === 'Radio2') {
        return {
          name: 'RAIRadio2',
          category_path: 'radio2',
          palinsesto_url: 'rai-radio-2',
          palinsesto_name: 'Radio 2'
        };
      }
      if (sheetName === 'Radio3') {
        return {
          name: 'RAIRadio3',
          category_path: 'radio3',
          palinsesto_url: 'rai-radio-3',
          palinsesto_name: 'Radio 3'
        };
      }
}