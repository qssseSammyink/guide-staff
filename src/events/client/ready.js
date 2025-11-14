const client = require('../../index');
const colors = require('colors');

module.exports = {
  name: "clientReady"
};

client.once('clientReady', () => {
    console.log("----------------------------------------------".white);
    console.log(`[READY] ${client.user.tag} is up and ready to go.`.bold.white);
    console.log("----------------------------------------------".white);
});

