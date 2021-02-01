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
    
    program.parse(process.argv);