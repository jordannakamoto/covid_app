const mongoose = require('mongoose');

require('dotenv').config();

const conn = process.env.DB_STRING;     

const connection = mongoose.createConnection(conn, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// UserSchema
const UserSchema = new mongoose.Schema({
    // access level stored in admin/manager list object
    username: String,
    name: Object, // first and last name keys
    language: String, // user can set language English/Spanish
    hash: String,
    salt: String,
    
    isActive: Boolean,
    group: String,
    Schedule: {  // store time as float
        Mon: 0.0,
        Tue: 0.0,
        Wed: 0.0,
        Thu: 0.0,
        Fri: 0.0,
        Sat: 0.0,
        Sun: 0.0
    }
});

const User = connection.model('User', UserSchema);

module.exports = connection;