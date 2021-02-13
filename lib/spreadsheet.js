    const {GoogleSpreadsheet} = require('google-spreadsheet');
    const creds = require('./client_secret.json');
    const doc = new GoogleSpreadsheet('1yJWURjN98gjpeAfh9GAb1UTLecJh2kmIHof3m946Jvw');
    const sUtil = require('./scheduleUtil.js');
    const uUtil = require('./User.js');
    
    
        
    function addEmployee(employee, _key){
        var newUser = {
            name: {}
        };
        
        newUser.name.First = employee.First;
        newUser.name.Last = employee.Last;
        newUser.title = employee.Title;
        newUser.group = employee.Group;
        newUser.phone = employee['Phone Number'];
        newUser.email = employee['Email Address'];
        newUser.Schedule = sUtil.sToObj(employee.Schedule);
        newUser.activity = "inactive";
        newUser.state = "unregistered"
        
        // generate key
        var modified = employee.Last[2];
        modified += employee.First[1];
        modified += employee.Last[0];
        modified+= _key;
        
        newUser.key = modified;
        
        uUtil.addUser(newUser);
        

        return modified;
    }
    
    
    
    async function postRow(row){
        await doc.useServiceAccountAuth({
            client_email: creds.client_email,
            private_key: creds.private_key,
        });
        
        await doc.loadInfo(); // loads document properties and worksheets
        console.log(doc.title);

        const sheet = doc.sheetsByIndex[1]; // or use doc.sheetsById[id]
        sheet.addRow(row);

    }
    
     async function createUsers(){
        await doc.useServiceAccountAuth({
            client_email: creds.client_email,
            private_key: creds.private_key,
        });
        
        await doc.loadInfo(); // loads document properties and worksheets
        console.log("Loading Sheet Info for Adding Employeees");

        const sheet2 = doc.sheetsByIndex[2]; // or use doc.sheetsById[id]
        
        const rows = await(sheet2.getRows)({    
        });
        
        rows.forEach( row => {
            if(row.Key.length < 1){
                var temp = uUtil.genKey();
                row.Key = addEmployee(row, temp);   // pass generated key to newUser, get it back with intials added
                row.save();
            }
        })
        console.log("..Done");
    }
    
    module.exports = {postRow, createUsers}