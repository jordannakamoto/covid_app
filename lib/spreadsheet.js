    const {GoogleSpreadsheet} = require('google-spreadsheet');
    const creds = require('./client_secret.json');
    const doc = new GoogleSpreadsheet('1yJWURjN98gjpeAfh9GAb1UTLecJh2kmIHof3m946Jvw');

    async function postRow(row){
        await doc.useServiceAccountAuth({
            client_email: creds.client_email,
            private_key: creds.private_key,
        });
        
        await doc.loadInfo(); // loads document properties and worksheets
        console.log(doc.title);

        const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]
        sheet.addRow(row);

    }
    
    module.exports = {postRow}