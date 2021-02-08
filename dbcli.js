const  {program} = require('commander');
const connection = require('./config/database');
const sUtil = require('./lib/scheduleUtil.js');

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
    
    
 program.parse(process.argv);