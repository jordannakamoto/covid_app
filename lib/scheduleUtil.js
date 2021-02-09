// scheduleUtil.js
//
// Untested -> rescoped week object to const within sToObj
//

const connection = require('../config/database');
const User = connection.models.User;
const UserList = connection.models.UserList;

// setExpected
// requires: UserList: expectedList, Users[Schedule.Today = true]
// results: expectedList written with active Users scheduled for today
//
async function setExpected(){
    console.log('Setting Current Days Users to Expected');
    var today = new Date().getDay();
    var expectedList = await UserList.findOne({name:"expectedList"});           // query for expectedList
    
    expectedList.list.splice(0,expectedList.list.length);                                     // clear the expectedList
    
    if(today == '1'){ User.find({'Schedule.M': true}).then((users) => {changeState(users);});}     // if-else block of all Day options. query Users[] with all who are scheduled for that day of the week
    else if(today=='2'){User.find({'Schedule.T':true}).then((users)=>{changeState(users)});}
    else if(today=='3'){User.find({'Schedule.W':true}).then((users)=>{changeState(users)});}
    else if(today=='4'){User.find({'Schedule.Th':true}).then((users)=>{changeState(users)});}
    else if(today=='5'){User.find({'Schedule.F':true}).then((users)=>{changeState(users)});}
    else if(today=='6'){User.find({'Schedule.S':true}).then((users)=>{changeState(users)});}
    else if(today=='0'){User.find({'Schedule.Su':true}).then((users)=>{changeState(users)});}

    function changeState(prom){                                                    // take Promise resolution of Users[Day] query and...
        for(i = 0; i < prom.length; i ++){                                  // loop through all users
            if(prom[i].activity == "active"){
                prom[i].state = "expected";                                     // if they're active, set 'state':'expected'
                prom[i].save();                                                         // so we expect them to take the DST today
                expectedList.list.push(prom[i]._id);                        // update UserList: expectedList with list of today's expected employees
            }
        }
        expectedList.save();
    }
    console.log('...Done!');
}


// setIdle
// takes previous day's expectedList and sets all users to idle
function setIdle(){
    console.log('Setting previous days expectedList to idle');
    UserList.findOne({name:"expectedList"}).populate({path:"list"})
        .then((expectedList) => {
            for(i = 0; i < expectedList.list.length; i++){
                if(expectedList.list[i].state == "0"){
                    expectedList.list[i].state = "idle";
                    expectedList.list[i].save();
                }
                else if(expectedList.list[i].state == "expected"){
                    expectedList.list[i].state = "idle";
                    expectedList.list[i].save();
                }
                else
                    console.log(expectedList.list[i].state)
            }
            
        })
    console.log('...Done!');
}

async function setOneExpected(userid){
    var today = new Date().getDay();
    var expectedList = await UserList.findOne({name:"expetedList"});
    const week = ["Su","M","T","W","Th","F","S"];
    var dayCode = week[today];
    
    User.find({_id: userid})
        .then((user)=> { 
            if(user.Schedule[dayCode] == "true"){
                user.state = "expected";
                user.save();
                expectedList.list.push(user._id);
                expectedList.save();
            }
            else{
                user.state = "idle";
                user.save();
            }
        })
    
}



// Function for creating expectedList if it is removed from the database
function initExpectedList(){
    var expectedList = new UserList;
    expectedList.name = "expectedList";
    expectedList.list = [];
    expectedList.save();
}




// sToObj
// For reading schedule data from spreadsheet to User model
// creates schedule Object compatible with User Schema
// reads and parses notation from Spreadsheet
//
function sToObj(input){
  const week = ["M","T","W","Th","F","S","Su"];
  
  var scheduleObj = {};
  // If there is a comma notation: (i.e.) "M,T,F"
  if(input.indexOf(',') > -1){
    var tempArr = input.split(',');
    for(i = 0; i < tempArr.length; i++){
      scheduleObj[tempArr[i]] = true; 
    }
  }
  // Else if there is a dash notation: (i.e.) "M-F"
  else if(input.indexOf('-') > -1){
    var tempArr = input.split('-');
    var posArr = [];
    posArr[0] = week.indexOf(tempArr[0]);
    posArr[1] = week.indexOf(tempArr[1]);
    for(i = 0; i <= posArr[1]; i++){
      scheduleObj[week[i]] = true;
    }
  }
  // Else if there is only one day
  else if(input.length <= 2){
      scheduleObj[input] = true;
  }
  return scheduleObj;
}

module.exports = {sToObj, setExpected, setOneExpected, setIdle, initExpectedList};