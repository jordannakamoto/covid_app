const  {program} = require('commander');
const connection = require('./config/database');
const sUtil = require('./lib/scheduleUtil.js');
const uUtil = require('./lib/User.js');

program
    .command('clear users')
    .alias('cu')
    .description('Clears User collection')
    .action(() =>{
        connection.collections.users.deleteMany({});
        console.log("All Users deleted from connected database");
    });
    
program
    .command('clear alerts')
    .alias('ca')
    .description('Clears Alerts collection')
    .action(() =>{
        connection.collections.alerts.deleteMany({});
        console.log("All Alerts deleted from connected database");
    });
    
    
program
    .command('set expected')
    .alias('se')
    .description('Sets expected users based on todays date')
    .action(() => {
        sUtil.setExpected();
        console.log("UserList: expectedList updated with today's data")
    });
    
    
 program
    .command('set idle')
    .alias('si')
    .description('Sets idle users based on todays date')
    .action(() => {
        sUtil.setIdle();
        console.log("Succesful users set to idle")
    });
    
 program
    .command('create jordan')
    .alias('cj')
    .description('Create root user')
    .action(() => {
        uUtil.createJordan();
        console.log("Jordan created.. please register with key - 'jordan'")
    });
    
 program.parse(process.argv);