const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
app.use(express.static('assets'))
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs');
var db;



MongoClient.connect(url, function (err, client) {
  if (err) throw err;
  db = client.db('HonoursProject');
  app.listen(8080);
  console.log("Running on 8080")
});

app.get('/', function (req, res) {
  res.render('pages/display');
});

app.get('/crowdsourcing', function (req, res) {
  res.render('pages/crowdsourcing');
});

app.post("/getVenueInfo", function(req, res){
  db.collection('VenueInformation').find(req.body).toArray(function(err, result){
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});

app.post("/updateVenue", function (req, res){
  var query = { Venue_Name: req.body.Venue_Name };
  var newvalues = {
    $set: req.body
 }
 
  db.collection('CurrentVenueInformation').updateOne(query,newvalues, function(err, result) {
  if (err) throw err;
  console.log(req.body)
  db.collection('PastVenueInformation').insertOne(req.body, function(err, result) {
    if (err) throw err;
    res.send("Done")
    });
  });
  
});

app.get("/getLiveVenueInfo", function(req, res){
  db.collection('CurrentVenueInformation').find().toArray(function(err, result){
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});

