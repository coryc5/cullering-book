var cheerio = require('cheerio');
var request = require('request');
var mongo = require('./mongodb');
var phantom = require('phantom');


var Controller = {};


Controller.get = function(req, res, next) {
  request('https://www.goodreads.com/book/popular_by_date/1987/', function(err, response, body) {

    var bookArr = [];
    var $ = cheerio.load(body);
    
    $('.tableList').find('tr').each(function(elem, i) {
      var bookInfo = {};
      var greyText = $(this).find('.greyText').text().split('\n');
      var rawRatingInfo = greyText[1].trim().split(' ');
      var bookRating = +rawRatingInfo[0];
      
        if (bookRating >= 4) {
            if (rawRatingInfo.length > 40) {
              rawRatingInfo = rawRatingInfo.slice(15);
            } 
          
          bookInfo.title = $(this).find('.bookTitle').text().trim();
          bookInfo.author = $(this).find('.authorName').text();
          bookInfo.rating = +rawRatingInfo[0];
          bookInfo.ratingsNum = parseInt(rawRatingInfo[4].replace(',',''));
          bookInfo.published = +greyText[4];
          bookInfo.link = 'https://goodreads.com' + $(this).find('.bookTitle').attr('href');
          bookInfo.img = $(this).find('.bookSmallImg').attr('src');
          
          bookArr.push(bookInfo);
        }      
    });
    
    mongo(function(err, db) {
      db.collection('books').insertMany(bookArr, function(err, result) {
        if (err) throw err;
      });
    });
    
    res.send(bookArr);
  });
}

Controller.find = function(req, res, next) {
  mongo(function(err, db) {
    db.collection('books').find({published: 1987}).toArray(function(err, docs) {
      var book = docs[1];
      phantom.create().then(function(ph) {
        ph.createPage().then(function(page) {
          page.open('http://overdrive.chipublib.org/BANGSearch.dll?Type=FullText&FullTextField=All&FullTextCriteria=' + book.title + ' ' + book.author).then(function(status) {
            console.log(status);
            page.property('content').then(function(content) {
      
              var $ = cheerio.load(content);
              
              var foundBooks = $('.icon-eBook.avail-0').length + $('.icon-eBook.avail-1').length; 
              
              if(!foundBooks) res.send('nothing found');
              else res.send('found ' + foundBooks);
              
      
              page.close();
              ph.exit();
            })
          })
        });
      });
      
       
     });
    });
}

module.exports = Controller;