
exports.initialize
var config = require('./config.js')
  , io
  , initialized = false

exports.initialize = function(server) {
  if (initialized) return
  initialized = true

  io = require('socket.io').listen(server)

  io.sockets.on('connect', onConnect)
  io.sockets.on('disconnect', onDisconnect)
  function onConnect(socket) {
    console.log('socket connected ' + socket.toString())
  }
  function onDisconnect(socket) {
    console.log('socket disconnected ' + socket.toString())
  }

  var images =  ['http://www.google.com/logos/2013/edward_goreys_88th_birthday-1056005.2-hp.jpg'
                 , 'http://www.biography.com/imported/images/Biography/Images/Profiles/D/Charles-Darwin-9266433-1-402.jpg'
                 , 'http://2.bp.blogspot.com/-YgsC6_3yDio/TrF1jTkOHQI/AAAAAAAABNE/UT7gtMRcDf8/s1600/atom.jpg']
  function nextImage() {
    //cylce through
    var url = images.shift()
    images.push(url)
    return url
  }
  setInterval(function test() {
    var testObj = {
      url : nextImage()
      , coordinate : {
          lat : 100
        , lon : 100
      }
      , user_id : 'saam'
    }
    io.sockets.emit('new photo', testObj)
  }, 5000)

}

exports.pushData = function (obj) {
  io.sockets.emit('new photo', obj)
}
