const functions = require('firebase-functions');

exports.parseAward = functions.database.ref('/awards')
    .onCreate(async (snapshot) => {
        const award = snapshot.val();
        const criterion = await functions.database.ref('/criteria').child(award.criterion).once('value');
        console.log(criterion);
    })