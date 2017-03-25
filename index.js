var MongoClient = require('mongodb').MongoClient;
var collection = null;
MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/fri3d-font", function(err, db) {
  if( ! err ) { console.log("Connected to MongoDB"); }
  collection = db.collection('submissions');
});

var http = require('http').Server(app);
var io   = require('socket.io')(http);
var express = require('express')
var app = express()
app.use(express.static('static'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/form.html');
});

});

io.on('connection', function(socket){
  socket.on("submission", function(submission){
    collection.insert(submission, {w:1}, function(err, result) {
      socket.emit("response", err ? "error" : "ok");
    });
  });
});

var port = process.env.PORT || 3000;

http.listen(port, function() {
  console.log('listening on *:' + port);
});
