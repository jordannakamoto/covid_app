const mongoose = require('mongoose');

require('dotenv').config();

const conn = process.env.DB_STRING;     

const connection = mongoose.createConnection(conn, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// UserSchemag
const UserSchema = new mongoose.Schema({
    username: String,
    name: Object, // first and last name keys
    language: String, // user can set language English/Spanish
    hash: String,
    salt: String,
    phone: String,
    email: String,
    vacURL: String,      // link to vac document
    
    state: String,         // has the person taken the survey today
    
    activity: String,     // is the person working from home, in quarantine, needs vaccination etc.
    group: String,
    accessLevel: String,
    Schedule: {  // store time as float
        Mon: {"start": 0, "end": 0},
        Tue: {"start": 0, "end": 0},
        Wed: {"start": 0, "end": 0},
        Thu: {"start": 0, "end": 0},
        Fri: {"start": 0, "end": 0},
        Sat: {"start": 0, "end": 0},
        Sun: {"start": 0, "end": 0}
    },
    title: String
});

// https://alexanderzeitler.com/articles/mongoose-referencing-schema-in-properties-and-arrays/
const AlertSchema = new mongoose.Schema({
    msg: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: String,
    note: String,
    state: String             // new, in-progress, completed
});

const User = connection.model('User', UserSchema);
const Alert = connection.model('Alert', AlertSchema);

module.exports = connection;