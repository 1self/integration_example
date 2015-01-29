var express = require('express');
var router = express.Router();
var request = require('request');
var service = require('./service');
var moment = require('moment');
var Q = require('q');

var APP_ID = "app-id-4161bd0e1f9cb2e38710454efe64b856";
var APP_SECRET = "app-secret-7cd333e1170bddb9170388b858a09803272c840296b3041b44c218f6ca3f0e4e";
var CONTEXT_URI = "http://localhost:3000";

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {title: 'Express'});
});

router.post('/streams', function (req, res) {
    console.log("Registering stream...");
    service.registerStream(APP_ID, APP_SECRET, CONTEXT_URI)
        .then(service.initialSync)
        .then(function (result) {
            res.send(result);
        }).catch(function (err) {
            res.send(err);
        });
});

router.get('/sync', function (req, res) {
    var userId = req.query.userId;
    var streamId = req.query.streamId;
    var writeToken = req.headers.authorization;
    var latestEventSyncDate = moment(req.query.latestEventSyncDate).toDate();
    console.log("req.query ", req.query);

    var stream = {
        streamid: streamId,
        writeToken: writeToken,
        latestEventSyncDate: latestEventSyncDate
    };

    service.diffSync(stream, userId)
        .then(function (result) {
            res.send("Triggered called");
        })

});

module.exports = router;