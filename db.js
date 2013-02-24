var r = require('rethinkdb');
var fs = require("fs");
var util = require("util");
var config = require('./config');

exports.initialize = function() {
    r.connect({ host: 'localhost', port: 28015 }, function(db) {
        console.log("Connected to RethinkDB");
    });
    
    return this;
}

exports.allPhotos = function(callback) {
    r.db("talk").table("photos").run().collect(function (results) {
        callback(JSON.stringify(results));
    });
}

exports.addPhoto = function(file, lat, lon, user, callback) {
    r.db("talk").table("photos").insert({}).run().collect(function (results) {
        var photo_id = results[0].generated_keys[0];
        
        fs.rename(file.path, "public/uploads/" + photo_id, function(error) {
            if (error) {
                callback(error);
                return;
            }
            
            console.log("updating...");
            
            r.db("talk").table("photos").get(photo_id).update(
                {
                    "url": "http://localhost:" + config.port + "/uploads/" + photo_id,
                    "coordinate": {
                        "lat": lat,
                        "lon": lon
                    },
                    "user_id": user
                }
            ).run().collect(function (results) {
                console.log(results);
                callback(null);
            });
        });
    });
    
    callback(null);
}