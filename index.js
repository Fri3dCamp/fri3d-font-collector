// mongo

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var submissions = null;
MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/fri3d-font", function(err, db) {
  if( ! err ) { console.log("Connected to MongoDB"); }
  submissions = db.collection('submissions');
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
  var submission = req.body;
  submission.ts = new Date();
  submissions.insert(submission, {w:1}, function(err, result) {
    res.end(JSON.stringify({"result" : err ? "error" : "ok" }));
  });
});

// private

var auth = require('http-auth');
var basic = auth.basic(
  { realm: "Private..." },
  function(username, password, callback) {
    callback(password === process.env.FFC_PASSWD);
  }
);

app.get('/admin', auth.connect(basic), function(req, res){
  res.sendFile(__dirname + '/admin.html');
});

app.get('/submissions', auth.connect(basic), function(req, res){
  submissions.find({}).toArray(function(err, docs){
    res.send(JSON.stringify(docs));
  });
});

app.post('/submission/delete', auth.connect(basic), function(req, res){
  submissions.remove({_id: new mongodb.ObjectID(req.body["_id"])}, {w:1}, function(err, result) {
    res.end(JSON.stringify({"result" : err ? "error" : "ok" }));
  });
});

// set up actual server
var http = require('http').Server(app);
var port = process.env.PORT || 3000;

http.listen(port, function() {
  console.log('listening on *:' + port);
});
