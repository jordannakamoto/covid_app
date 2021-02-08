// namelist.js
// keeps track of which users are in a registration active state + another list of which users are in a password reset state

const fs = require('fs');

var file_name = './lists/namelist.json';
var nameList;

fs.readFile(file_name, 'utf-8', (err, data) => {
    
    if (err) {
        throw err
    } else {
        // parse JSON string to JSON object
        nameList = JSON.parse(data);
    }
});

// finds an entry in the json file with the search key
function validateRegister(query){
    if(nameList[query] !==  undefined){
        return nameList[query];
    }
    else{
        return false;
    }
}

// deletes and updates json file after entry has been used
function clearEntry(query){
    delete nameList[query];
    fs.writeFile(file_name, JSON.stringify(nameList), function (err) {
        if (err) return console.log(err);
        console.log("User registered and removed from namelist");
    });
}

module.exports.validateRegister = validateRegister;
module.exports.clearEntry = clearEntry;