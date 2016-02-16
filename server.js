var express = require('express');
var scraper = require('./scraper');
var app = express();

app.get('/', scraper.get);

app.get('/lib', scraper.find);


app.listen(5000);

module.exports = app;