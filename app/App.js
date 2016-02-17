var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jQuery');

var Dewey = require('./components/Dewey');

var App = React.createClass({
  
  getInitialState: function() {
    return {
      items: []
    }
  },
  
  componentDidMount: function() {
    var self = this;
    $.getJSON('/db', function(data) {
      self.setState({items: data});
    });
    
    $.get('/phantom');
    
    setTimeout(function() {
      setInterval(function() {
        $.getJSON('/db', function(data) {
          self.setState({items: data});
        })}, 750)}, 
      1300);    
  },
  
  render: function() {
    
    var items = [];
    var itemsLength = this.state.items.length;
        
    for (var i = 0; i < itemsLength; i++) {
      var book = this.state.items[i];
      // console.log('hi');
      // console.log(book.libURL);
      items.push(<Dewey title={book.title} author={book.author} rating={book.rating} ratings={book.ratingsNum} avail={book.avail} libURL={book.libURL} key={i}/>)
    }
    
    
    return (
      <div>
        Hello World!
        {items}
      </div>
    );
  }
});

ReactDOM.render(<App />, document.getElementById('app'));