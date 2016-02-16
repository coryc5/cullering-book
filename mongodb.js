var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost/goodreads', function(err, db) {
  db.createCollection('books', { validator: 
    { $and: {
      title: { $type: 'string'},
      author: { $type: 'string'},
      rating: { $type: 'string'},
      ratingsNum: { $type: 'string'},
      published: { $type: 'string'},
      link: { $type: 'string'},
      img: { $type: 'string'}
      }
    }
  }, function(err, result) {
    db.collection('books').createIndex({ title: 1}, {unique: true});
    console.log('📚  Created books db. Closing connection...');
    db.close();
  });
});

module.exports = MongoClient.connect.bind(null, 'mongodb://localhost/goodreads')