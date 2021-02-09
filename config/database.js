const mongoose = require('mongoose');

require('dotenv').config();

const conn = process.env.DB_STRING;     

const connection = mongoose.createConnection(conn, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// UserSchemag
const UserSchema = new mongoose.Schema({
    // App properties
    username: String,
    hash: String,
    salt: String,
    key: String,
    alerts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Alert'
    }],
    note: String,
    
    // Employee properties
    name: Object, // first and last name keys
    phone: String,
    email: String,
    title: String,
    group: String,
    Schedule: {  // store time as float
        "M": Boolean,
        "T": Boolean,
        "W": Boolean,
        "Th": Boolean,
        "F": Boolean,
        "S": Boolean,
        "Su": Boolean        
    },
    
    // App Settings
    language: String, // user can set language English/Spanish
    accessLevel: String,
    vacURL: String,      // link to vac document
    
    // App States
    state: String,         // has the person taken the survey today
    activity: String,    // is the person working from home, in quarantine, needs vaccination etc.
});

// https://alexanderzeitler.com/articles/mongoose-referencing-schema-in-properties-and-arrays/
const AlertSchema = new mongoose.Schema({
    msg: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: String,
    state: String             // new, in-progress, completed
});

const UserListSchema = new mongoose.Schema({
    name: String,
    list:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }]

})

const User = connection.model('User', UserSchema);
const Alert = connection.model('Alert', AlertSchema);
const UserList = connection.model('UserList', UserListSchema);

module.exports = connection;