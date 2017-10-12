const path = require('path')
const request = require('request-promise')
const showdown  = require('showdown')
const converter = new showdown.Converter()
// const firebaseAdmin = require("firebase-admin");
// Configure
// Markdown
converter.setFlavor('github');
// Firebase
// let serviceAccount = path.join(__dirname, '/credentials/kfum-clubs-firebase-adminsdk-384qk-b65ad5f692.json')
// firebaseAdmin.initializeApp({
//   credential: firebaseAdmin.credential.cert(serviceAccount),
//   databaseURL: "https://kfum-clubs.firebaseio.com"
// });

module.exports = {
    sendEmail: async function(body) {
        let response = await request.post('https://api.elasticemail.com/v2/email/send', {form: body})
        return response.success
    },

    markdownToHTML: function(markdown) {
        return converter.makeHtml(markdown);
    },

    getValidationErrors: async function(req) {
        let errors = await req.getValidationResult()
        if (!errors.isEmpty()) {
            return errors.array().map(err => `Field ${err.param}: ${err.msg}`)
        }
        return [];
    },

    // Note: You can send messages to up to 1,000 devices in a single request.
    // If you provide an array with over 1,000 registration tokens, the request will fail with a messaging/invalid-recipient error.
    // pushNotification: function(registrationTokens, notification) {
    //     let payload = {
    //         notification
    //     }
    //     firebaseAdmin.messaging().sendToDevice(registrationTokens, payload)
    //     .then((response) => {
    //       // See the MessagingDevicesResponse reference documentation for
    //       // the contents of response.
    //       console.log("Successfully sent message:", response);
    //     })
    //     .catch((error) => {
    //       console.log("Error sending message:", error);
    //     });
    // }
};