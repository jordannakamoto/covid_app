// User.js
const genPassword = require('../lib/passwordUtils').genPassword;
const connection = require('../config/database');
const User = connection.models.User;


function createJordan(){
    var jordan = new User();
    jordan.name = {"First":"Jordan","Last":"Nakamoto"};
    jordan.accessLevel = "admin";
    jordan.key = "jordan";
    jordan.save();
}

function addUser(userdata){
        User.findOne({ name: userdata.name})
                .then((user) => {
                    
                    if (!user) {
                        newUser = new User(userdata);
                        newUser.save()
                        .then((user) => {
                            console.log(user.name.First + " " + user.name.Last + " added to Database");
                        });
                    }
                    else{
                        console.log("Error: User " + user.name.First + " " + user.name.Last +" already exists");
                    }
                });
}



function genKey(){    
    var result = new Date().getTime();
    result = result.toString(16);
    result = result.substr(5,6);
    
    return result;
}

module.exports = {addUser, genKey, createJordan};