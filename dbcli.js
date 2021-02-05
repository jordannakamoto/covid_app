const  {program} = require('commander');
const connection = require('./config/database');

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
    
 program.parse(process.argv);