var cheerio = require('cheerio');
var request = require('request');
var mongo = require('./mongodb');


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
      var watchmen = docs[0];
      
      request({
        url: 'http://overdrive.chipublib.org/BANGSearch.dll?Type=FullText&FullTextField=All&FullTextCriteria=hello',
        headers: { "User-Agent": "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410."}}, 
        function(err, response, body) {
        var $ = cheerio.load(body);
        
        console.log($('.icon-eBook').length);
        res.send();
        
      });
       
     });
    });
}

module.exports = Controller;