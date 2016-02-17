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
          bookInfo.avail = 'Loading...';
          bookInfo.libURL = '';
          bookInfo.availCopies = 0;
          
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

Controller.phantom = function() {
  
  var mainURL = 'http://e-media.lapl.org/';
  
  mongo(function(err, db) {
    db.collection('books').find({published: 1987}).toArray(function(err, docs) {
      docs = docs.reverse();
      function opera(book) {  
        phantom.create().then(function(ph) {
          ph.createPage().then(function(page) {
            page.open('http://e-media.lapl.org/BANGSearch.dll?Type=FullText&FullTextField=All&FullTextCriteria=' + book.title + ' ' + book.author).then(function(status) {
              page.property('content').then(function(content) {
        
                var $ = cheerio.load(content);
                
                var checkedOutBooks = $('.icon-eBook.avail-0').length;
                var availBooks = $('.icon-eBook.avail-1').length; 
                
                
                if(!(checkedOutBooks + availBooks)) {
                  mongo(function(err, db) {
                    db.collection('books').update(book, { $set: {avail: 'Not Available'}});
                    db.close();
                  });
                } else {
                  var statusText = Boolean(availBooks) ? 'Available' : 'Checked Out';
                  
                  mongo(function(err, db) {
                    db.collection('books').update(book, { $set: {avail: statusText}});
                    db.close();
                  });
                  
                  var link = mainURL + $('.li-details').find('a').eq(0).attr('href');
                  phantom.create().then(function(ph) {
                   ph.createPage().then(function(page) {
                      page.open(link).then(function(status) {
                        page.property('content').then(function(content) {
                          var $$ = cheerio.load(content);
                          var availCopies = $$('#availableCopies').text();
                          var libCopies = $$('#libCopies').text();
                          var holds = parseInt($$('.details-patrons-on-holds').text());
                          
                            if (!holds) {
                              holds = 0;
                            } else {
                              holds *= +libCopies;
                            }
                          
                          mongo(function(err, db) {
                            db.collection('books').update({title: book.title}, { $set: 
                              {avail: statusText,
                              libURL: link,
                              availCopies: availCopies,
                              libCopies: libCopies,
                              holds: holds
                              }});
                            db.close();
                          });
                          
                          page.close();
                          ph.exit();
                        });
                      });
                  });
                   });
                }
                
                page.close();
                ph.exit();
                if (docs.length) opera(docs.pop());
              });
            })
          });
        });
      }  
    opera(docs.pop());    
    opera(docs.pop());    
    opera(docs.pop());    
    // opera(docs.pop());    
    });
  });
}


module.exports = Controller;