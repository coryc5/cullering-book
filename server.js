var express = require('express');
var scraper = require('./scraper');
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');

var app = express();

app.get('/', function(req, res, next) {
  res.send(fs.readFileSync(__dirname + '/public/index.html', 'utf8'));
});

app.get('/assets/bundle.js', function(req, res, next) {
  res.send(fs.readFileSync(__dirname + '/public/bundle.js', 'utf8'));
});

app.get('/lib/:title', scraper.find);

app.get('/db', function(req, res, next) {
   MongoClient.connect('mongodb://localhost/goodreads', function(err, db) {
      db.collection('books').find({published: 1987}).toArray(function(err, docs) {
        res.send(docs);
        db.close();
      });
    });
});

app.get('/phantom', scraper.phantom);

app.get('/grab', scraper.get)


app.listen(5000);

module.exports = app;