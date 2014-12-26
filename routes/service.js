var request = require('request');
var Q = require('q');
var auth = process.env.AUTH;

var Service = function () {
};

Service.prototype.initialSync = function (stream) {

    var deferred = Q.defer();

    var event1 = {
        "dateTime": "2014-12-08T06:36:56.128Z",
        "source": "Sample App",
        "version": "0.0.1",
        "objectTags": [
            "foo"
        ],
        "actionTags": [
            "bar"
        ],
        "properties": {
            "baz": 100
        },
        "eventDateTime": "2014-12-08T06:36:56.0Z"
    };
    var event2 = {
        "dateTime": "2014-12-10T06:36:56.128Z",
        "source": "Sample App",
        "version": "0.0.1",
        "objectTags": [
            "foo"
        ],
        "actionTags": [
            "bar"
        ],
        "properties": {
            "baz": 50
        },
        "eventDateTime": "2014-12-10T06:36:56.0Z"
    };

    var events = [event1, event2];

    var options = {
        url: "http://localhost:5000/v1/streams/" + stream.streamid + "/events/batch",
        json: events,
        headers: {
            'Authorization': stream.writeToken
        }
    };

    request.post(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            deferred.resolve(body);
        } else {
            deferred.reject(error);
        }
    });

    return deferred.promise;
};

Service.prototype.diffSync = function (stream, userId) {
    var deferred = Q.defer();

    var latestEvent = {
        "dateTime": "2014-12-13T06:36:56.128Z",
        "source": "Sample App",
        "version": "0.0.1",
        "objectTags": [
            "foo"
        ],
        "actionTags": [
            "bar"
        ],
        "properties": {
            "baz": 100
        },
        "eventDateTime": "2014-12-13T06:36:56.0Z"
    };
    var diffEvents = [latestEvent];

    var options = {
        url: "http://localhost:5000/v1/streams/" + stream.streamid + "/events/batch",
        json: diffEvents,
        headers: {
            'Authorization': stream.writeToken
        }
    };

    request.post(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            deferred.resolve(body);
        } else {
            deferred.reject(error);
        }
    });

    return deferred.promise;
};


Service.prototype.registerStream = function (appId, appSecret, contextUrl) {
    var deferred = Q.defer();
    var callbackUrl = contextUrl + "/sync?userId=someUserId&streamId={{streamId}}&writeToken={{writeToken}}&latestEventSyncDate={{latestEventSyncDate}}";

    var options = {
        url: "http://localhost:5000/v1/streams",
        json: {'callbackUrl': callbackUrl},
        headers: {
            'Authorization': appId + ":" + appSecret
        }
    };

    request.post(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("GOT RESPONSE", response);
            deferred.resolve(body);
        } else {
            console.log("GOT ERROR", error);
            deferred.reject(error);
        }
    });
    return deferred.promise;
};


module.exports = new Service();
    