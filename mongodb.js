var MongoClient = require('mongodb').MongoClient


MongoClient.connect('mongodb://localhost/goodreads', function (err, db) {
  if (err) throw err

  db.createCollection('books', { validator:
    { $and: {
      title: { $type: 'string' },
      author: { $type: 'string' },
      rating: { $type: 'string' },
      ratingsNum: { $type: 'string' },
      published: { $type: 'string' },
      link: { $type: 'string' },
      img: { $type: 'string' },
      avail: { $type: 'string' } }
    }
  }, function (err, result) {
    if (err) throw err

    db.collection('books').updateMany({}, { $set: {avail: 'Loading...'},
      $unset: {availCopies: '', libCopies: '', holds: '', libURL: ''}}, function () {
      })
    db.collection('books').createIndex({ title: 1 }, { unique: true })
    db.close()
  })
})


module.exports = MongoClient.connect.bind(null, 'mongodb://localhost/goodreads')
