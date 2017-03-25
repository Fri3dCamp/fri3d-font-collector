// mongo

var MongoClient = require('mongodb').MongoClient;
var collection = null;
MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/fri3d-font", function(err, db) {
  if( ! err ) { console.log("Connected to MongoDB"); }
  collection = db.collection('submissions');
});

// app

var express = require('express')
var app = express()

var bodyParser = require('body-parser');
app.use(bodyParser.json());

// public

app.use(express.static('static'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/form.html');
});

app.post('/submission', function(req, res) {
  console.log("new submission");
  var submission = req.body;
  submission.ts = new Date();
  collection.insert(submission, {w:1}, function(err, result) {
    res.end(JSON.stringify({"result" : err ? "error" : "ok" }));
  });
});

// set up actual server
var http = require('http').Server(app);
var port = process.env.PORT || 3000;

http.listen(port, function() {
  console.log('listening on *:' + port);
});
