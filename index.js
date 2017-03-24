var MongoClient = require('mongodb').MongoClient;
var collection = null;
MongoClient.connect("mongodb://localhost:27017/fri3d-font", function(err, db) {
  if( ! err ) { console.log("Connected to MongoDB"); }
  collection = db.collection('submissions');
});

var app  = require('express')();
var http = require('http').Server(app);
var io   = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/form.html');
});

app.get('/canvas-writer.js', function(req, res){
  res.sendFile(__dirname + '/canvas-writer.js');
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