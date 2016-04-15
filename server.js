'use strict'

const fs = require('fs')
const path = require('path')
const express = require('express')
const scraper = require('./scraper')
const MongoClient = require('mongodb').MongoClient

const app = express()

app.get('/', function (req, res, next) {
  res.send(fs.readFileSync(path.join(__dirname, 'public/index.html'), 'utf8'))
})

app.get('/assets/bundle.js', function (req, res, next) {
  res.send(fs.readFileSync(path.join(__dirname, 'public/bundle.js'), 'utf8'))
})

app.get('/db', function (req, res, next) {
  MongoClient.connect('mongodb://localhost/goodreads', function (err, db) {
    if (err) throw err

    db.collection('books').find({published: 1987}).toArray(function (err, docs) {
      if (err) throw err

      res.send(docs)
      db.close()
    })
  })
})

app.get('/phantom', scraper.phantom)

app.get('/grab', scraper.get)

app.get('/culled', function (req, res, next) {
  MongoClient.connect('mongodb://localhost/goodreads', function (err, db) {
    if (err) throw err

    db.collection('culled_books').find({published: 1987}).toArray(function (err, docs) {
      if (err) throw err

      res.send(docs)
      db.close()
    })
  })
})


app.listen(5000)

module.exports = app
