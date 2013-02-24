var db = require("./db.js").initialize()
    
console.log('initialized post.js')

exports.initialize = function(app) {
    app.get("/photos", function(req, res) {
        res.header("Content-Type", "text/json");
    
        db.allPhotos(function(results) {
            res.send(JSON.stringify(results));
        })
    });
  
    app.post("/photos", function(req, res) {
        res.header("Content-Type", "text/json");
        
        db.addPhoto(req.files[Object.keys(req.files)[0]], req.query["lat"], req.query["lon"], req.query["user"], function(error) {
            if (error != null) {
                res.send("ERROR");
            }
            else {
                res.send("SUCCESS");
            }
        })
    });
    
    return this;
}