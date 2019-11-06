const functions = require('firebase-functions');
const request = require('request-promise');

const express = require('express');
const cors = require('cors');

const app = express();

const uuidv1 = require('uuid/v1');

const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
const LINE_HEADER = {
    'content-type': 'application/json',
    'Authorization': `Bearer hW9uy356t+Gy+f35Rmcrm6reUtOY8jJnK2JivJs/RlL+uSWsCZ2nSRWSZngToV/bXY1I4sBmPFS1Ibax0kYVwm24Z1JZozcxcjrI4yIMsxY7B/F7rlIf+swWW49fyVUeDEUrZRQXrvYitLIwmCkbDQdB04t89/1O/w1cDnyilFU=
  `
};

exports.LineBot = functions.https.onRequest((req, res) => {
    if (req.body.events[0].message.type !== 'text') {
        return;
    }
    reply(req.body);

    var admin = require("firebase-admin");

    // Fetch the service account key JSON file contents
    var serviceAccount = require("./serviceAccountKey.json");

    // Initialize the app with a service account, granting admin privileges
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://btestscg.firebaseio.com"
    });

    // As an admin, the app has access to read and write all data, regardless of Security Rules
    var db = admin.database();
    var ref = db.ref("/History/" + uuidv1());
    ref.once("value", function (snapshot) {
        console.log(snapshot.val());
    });

    ref.set({
        Text: req.body.events[0].message.text,
        CreatedDate: (new Date()).getTime()
    });
});

const reply = (bodyResponse) => {

    var word = bodyResponse.events[0].message.text;

    switch (word.toLowerCase().trim()) {
        case "scg":
            word = "yeah";
            break;
    }
    return request({
        method: 'POST',
        uri: 'https://api.line.me/v2/bot/message/reply',
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer nxLabDOyNNbJO9C2Ypqy9b3XuYxyEszmCzcP4YVTgDU405P5sHIGjfEh56aF3RZFXY1I4sBmPFS1Ibax0kYVwm24Z1JZozcxcjrI4yIMsxZzRPWD8qymOt5pJMUvMBwhtJs/y5G6WZzuabvsMBEZ2AdB04t89/1O/w1cDnyilFU='
        },
        body: JSON.stringify({
            replyToken: bodyResponse.events[0].replyToken,
            messages: [
                {
                    type: `text`,
                    text: "บันทึกข้อมูลสำเร็จ"
                }
            ]
        })
    });


};


